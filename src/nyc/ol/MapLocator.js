/**
 * @module nyc/ol/MapLocator
 */

import $ from 'jquery'

import OlFormatGeoJson from 'ol/format/GeoJSON'
import OlStyleStyle from 'ol/style/Style'
import OlStyleIcon from 'ol/style/Icon'
import OlSourceVector from 'ol/source/Vector'
import OlLayerVector from 'ol/layer/Vector'
import OlFeature from 'ol/Feature'
import OlGeomPoint from 'ol/geom/Point'

import NycMapLocator from 'nyc/MapLocator'
import FeatureTip from 'nyc/ol/FeatureTip'

/**
 * @desc A class for managing map location
 * @public
 * @class
 * @extends module:nyc/MapLocator~MapLocator
 */
class MapLocator extends NycMapLocator {
/**
 * @desc Create an instance of MapLocator
 * @public
 * @constructor
 * @param {module:nyc/ol/MapLocator~MapLocator.Options} options Constructor options
 */
  constructor(options) {
    super()
    /**
		 * @desc The layer on which to render locations
     * @public
     * @member {ol.layer.Vector}
     */
    this.layer = null
    /**
     * @private
     * @member {ol.source.Vector}
     */
    this.source = null
    /**
     * @private
     * @member {ol.Map}
     */
    this.map = options.map
    /**
     * @private
     * @member {ol.View}
     */
    this.view = this.map.getView()
    /**
     * @private
     * @member {number}
     */
    this.zoom = options.zoom !== undefined ? options.zoom : NycMapLocator.ZOOM_LEVEL
    /**
     * @private
     * @member {ol.format.GeoJSON}
     */
    this.format = new OlFormatGeoJson()
    /**
     * @private
     * @member {module:nyc/ol/FeatureTip~FeatureTip}
     */
    this.tip = null
    this.createLayer(options.style)
  }
  /**
	 * @desc Zoom to the provided location then optionally invoke a callback function
	 * @public
	 * @override
	 * @method
	 * @param {module:nyc/Locator~Locator.Result} data The location to which the map will be oriented
	 * @param {module:nyc/MapLocator~MapLocator#zoomLocationCallback=} callback The function to call after the locator has zoomed to the location
	 */
  zoomLocation(data, callback) {
    const map = this.map
    const view = this.view
    const source = this.source
    const feature = this.feature(data)
    const geom = feature.getGeometry()
    source.clear()
    source.addFeature(feature)
    if (callback) {
      map.once('moveend', callback)
    }
    if (geom.getType() === 'Point') {
      view.animate({center: data.coordinate, zoom: this.zoom})
    } else {
      view.fit(geom.getExtent(), {size: map.getSize(), duration: 500})
    }
  }
  /**
	 * @desc Set the location to the provided location without moving the map
	 * @public
	 * @override
	 * @method
	 * @param {module:nyc/Locator~Locator.Result} data The location to which the map will be oriented
	 */
  setLocation(data) {
    this.source.clear()
    this.source.addFeature(this.feature(data))
  }
  /**
	 * @desc Get the projection of the map
	 * @public
	 * @override
	 * @method
	 * @returns {string} The map projection
	 */
  getProjection() {
    return this.view.getProjection().getCode()
  }
  /**
	 * @private
	 * @method
	 * @param {module:nyc/Locator~Locator.Result} location
	 * @return {ol.Feature}
	 */
  feature(location) {
    const geoJson = location.geometry
    const feature = new OlFeature({name: location.name, isFeature: location.isFeature})
    if (geoJson) {
      feature.setGeometry(this.format.readGeometry(geoJson))
    } else {
      feature.setGeometry(new OlGeomPoint(location.coordinate))
    }
    return feature
  }
  /**
	 * @private
	 * @method
	 * @param {ol.style.Style|Array<ol.style.Style>|ol.StyleFunction=} style
	 */
  createLayer(style) {
    this.source = new OlSourceVector()
    this.layer = new OlLayerVector({
      source: this.source,
      style: style || MapLocator.LOCATION_STYLE,
      zIndex: 10000
    })
    this.map.addLayer(this.layer)
    this.tip = new FeatureTip({
      map: this.map,
      tips: [{
        layer: this.layer,
        label: feature => {
          return {css: 'nyc-user-location', html: feature.get('name')}
        }
      }]
    })
  }
}

/**
 * @desc Object type to hold constructor options for {@link module:nyc/ol/MapLocator~MapLocator}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map on which location will be managed
 * @property {ol.style.Style=} style The style for the layer on which user-specified locations will be displayed
 * @property {number} [zoom={@link NycMapLocator.ZOOM_LEVEL}] The zoom level used when locating coordinate
 */
MapLocator.Options

/**
 * @desc The marker icon style for user location
 * @public
 * @const {ol.style.Style}
 */
MapLocator.LOCATION_STYLE = new OlStyleStyle({
  image: new OlStyleIcon({
    scale: 48 / 512,
    imgSize: [1024, 1024],
    src: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221024%22%20height%3D%221024%22%3E%3Cfilter%20id%3D%22filter%22%20style%3D%22color-interpolation-filters%3AsRGB%22%20x%3D%22-0.035750399%22%20width%3D%221.0715008%22%20y%3D%22-0.03625311%22%20%20height%3D%221.0725062%22%3E%3CfeGaussianBlur%20stdDeviation%3D%226.0015266%22%2F%3E%3C%2Ffilter%3E%3Cpath%20style%3D%22opacity%3A0.1%3Bfill%3A%23000000%3Bfill-opacity%3A1%3Bstroke%3A%23000000%3Bstroke-width%3A10%3Bstroke-opacity%3A1%3Bfilter%3Aurl(%23filter)%22%20d%3D%22M%20868.91078%2C141.10492%20C%20806.53392%2C79.855774%20695.84806%2C89.539532%20621.70905%2C162.73227%20547.57005%2C235.92501%20492.08486%2C476.05139%20510.9101%2C494.53629%20529.73535%2C513.02119%20773.473%2C457.74384%20847.612%2C384.5511%20921.751%2C311.35836%20931.28764%2C202.35407%20868.91078%2C141.10492%20Z%20M%20645.16036%2C361.99953%20c%20-41.52967%2C-40.77885%20-35.13918%2C-113.58881%2014.19918%2C-162.29746%2049.33837%2C-48.70864%20123.27149%2C-55.19708%20164.80115%2C-14.41823%2041.52967%2C40.77885%2035.13918%2C113.58881%20-14.19918%2C162.29745%20-49.33837%2C48.70864%20-123.27149%2C55.19709%20-164.80115%2C14.41824%20z%22%2F%3E%3Cpath%20style%3D%22fill%3A%23000%3Bstroke%3A%23fff%3Bstroke-width%3A20%22%20d%3D%22m%20512%2C25.6%20c%20-95.4279%2C0%20-172.8%2C77.3721%20-172.8%2C172.8%200%2C95.4279%20144%2C288%20172.8%2C288%2028.8%2C0%20172.8%2C-192.5721%20172.8%2C-288%20C%20684.8%2C102.9721%20607.4279%2C25.6%20512%2C25.6%20Z%20m%200%2C288%20c%20-63.5346%2C0%20-115.2%2C-51.6942%20-115.2%2C-115.2%200%2C-63.5058%2051.6654%2C-115.2%20115.2%2C-115.2%2063.5346%2C0%20115.2%2C51.6942%20115.2%2C115.2%200%2C63.5058%20-51.6654%2C115.2%20-115.2%2C115.2%20z%22%2F%3E%3C%2Fsvg%3E'
  })
})

export default MapLocator
