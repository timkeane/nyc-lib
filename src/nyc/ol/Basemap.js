/**
 * @module nyc/ol/Basemap
 */

import $ from 'jquery'

import nyc from 'nyc/nyc'
import BasemapHelper from 'nyc/BasemapHelper'

import ol from 'ol'
import OlMap from 'ol/map'
import OlView from 'ol/view'
import OlLayerTile from 'ol/layer/Tile'
import OlGeomPolygon from 'ol/geom/Polygon'
import OlSourceXYZ from 'ol/source/XYZ'

/**
 * @desc Class that provides an ol.Map with base layers, labels, and drag-and-drop
 * @public
 * @class
 * @implements nyc/Basemap
 * @extends ol.Map
 * @mixes nyc/Basemap
 */
class Basemap extends OlMap {
  /**
   * @desc Class that provides an ol.Map with base layers and labels
   * @public
   * @constructor
   * @param {Object} options Constructor options
   * @param {number} [preload=0] Preload option for base layer
   * @see http://openlayers.org/en/latest/apidoc/ol.Map.html
   */
  constructor(options, preload) {
    const viewProvided = options.view instanceof OlView
    Basemap.setupView(options)
    super(options)
    nyc.mixin(this, [BasemapHelper])
    /**
  	 * @private
  	 * @thismber {number}
  	 */
  	this.latestPhoto = 0
    /**
  	 * @private
  	 * @thismber {OlLayerTile}
  	 */
  	this.base
    /**
  	 * @private
  	 * @thismber {Object<string, OlLayerTile>}
  	 */
  	this.labels = {}
    /**
  	 * @private
  	 * @thismber {Object<string, OlLayerTile>}
  	 */
  	this.photos = {}
    /**
  	 * @private
  	 * @thismber {storage.Local}
  	 */
    //this.storage = new storage.Local()
    this.setupLayers(options, preload)
    this.defaultExtent(viewProvided)
    this.hookupEvents(this.getTargetElement())
  }
  /**
   * @desc Show photo layer
   * @public
   * @override
   * @method
   * @param layer {number} The photo year to show
   */
  showPhoto(year) {
  	this.hidePhoto()
    this.photos[(year || this.latestPhoto) + ''].setVisible(true)
  	this.showLabels('photo')
  }
  /**
   * @desc Show the specified label layer
   * @public
   * @override
   * @method
   * @param labelType {nyc.Basemap.BaseLayers} The label type to show
   */
  showLabels(labelType) {
  	this.labels.base.setVisible(labelType === BasemapHelper.LabelType.BASE)
  	this.labels.photo.setVisible(labelType === BasemapHelper.LabelType.PHOTO)
  }
  /**
   * @desc Hide photo layer
   * @public
   * @override
   * @method
   */
  hidePhoto() {
    this.base.setVisible(true)
  	this.showLabels(BasemapHelper.LabelType.BASE)
    Object.entries(this.photos).forEach(([year, layer]) => {
      layer.setVisible(false)
    })
  }
  /**
   * @desc Returns the base layers
   * @public
   * @override
   * @method
   * @return {nyc.Basemap.BaseLayers}
   */
  getBaseLayers() {
  	return {
  		base: this.base,
  		labels: this.labels,
  		photos: this.photos
  	}
  }
  /**
   * @desc Get the storage used for laoding and saving data
   * @access protected
   * @override
   * @method
   * @return {nyc.ol.storage.Local} srorage
   */
  getStorage(year) {
  	return this.storage
  }
  /**
   * @private
   * @method
   * @param {boolean} viewProvided
   */
  defaultExtent(viewProvided) {
    if (!viewProvided) {
      this.getView().fit(Basemap.EXTENT, {
        size: this.getSize(), duration: 500
      })
    }
  }
  /**
   * @private
   * @method
   * @param {Object} options
   * @param {number} [preload=0]
   */
  setupLayers(options, preload) {
    this.base = new OlLayerTile({
      extent: this.layerExtent(Basemap.UNIVERSE_EXTENT, options.view),
      source: new OlSourceXYZ({
        url: Basemap.BASE_URL,
        projection: 'EPSG:3857'
      }),
      preload: preload || 0
    })
    this.addLayer(this.base)

    Object.entries(Basemap.LABEL_URLS).forEach(([labelType, url]) => {
      this.labels[labelType] = new OlLayerTile({
        extent: this.layerExtent(Basemap.LABEL_EXTENT, options.view),
        source: new OlSourceXYZ({
          url: url,
          projection: 'EPSG:3857'
        }),
        zIndex: 1000,
        visible: labelType == 'base'
      })
      this.addLayer(this.labels[labelType])
    })

    Object.entries(Basemap.PHOTO_URLS).forEach(([year, url]) => {
      const photo = new OlLayerTile({
        extent: this.layerExtent(Basemap.PHOTO_EXTENT, options.view),
        source: new OlSourceXYZ({
          url: url,
          projection: 'EPSG:3857'
        }),
        visible: false
      })
      if ((year.split('-')[0] * 1) > this.latestPhoto) {
        this.latestPhoto = year
      }
      photo.set('name', year)
      this.addLayer(photo)
      photo.on('change:visible', $.proxy(this.photoChange, this))
      this.photos[year] = photo
    })
  }
  /**
   * @private
   * @method
   * @param extent {ol.Extent} extent
   * @param view {ol.View|undefined} extent
   */
  layerExtent(extent, view) {
  	if (view) {
  		var result = OlGeomPolygon.fromExtent(extent)
  		result.transform('EPSG:3857', view.getProjection())
  		return result.getExtent()
  	}
  	return extent
  }
  /**
   * @private
   * @method
   */
  photoChange() {
    Object.entries(this.photos).some(([year, layer]) => {
  		if (layer.getVisible()) {
  			this.showLabels(BasemapHelper.LabelType.PHOTO)
  			return true
  		}
  	})
  	this.showLabels(BasemapHelper.LabelType.BASE)
  }
}

/**
 * @private
 * @static
 * @method
 * @param {Object} options
 */
Basemap.setupView = function(options) {
  if (options.view === undefined){
    options.view = new OlView({
      center: BasemapHelper.CENTER,
      minZoom: 8,
      maxZoom: 21,
      zoom: 8,
      constrainRotation: 1
    })
  }
}

/**
 * @desc The URL of the New York City base map tiles
 * @private
 * @const
 * @type {string}
 */
Basemap.BASE_URL = 'https://maps{1-4}.nyc.gov/tms/1.0.0/carto/basemap/{z}/{x}/{-y}.jpg';

/**
 * @desc The URLs of the New York City aerial imagery map tiles
 * @private
 * @const
 * @type {Object<string, string>}
 */
Basemap.PHOTO_URLS = {
	'1924': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/1924/{z}/{x}/{-y}.png8',
	'1951': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/1951/{z}/{x}/{-y}.png8',
	'1996': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/1996/{z}/{x}/{-y}.png8',
	'2001-2': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2001-2/{z}/{x}/{-y}.png8',
	'2004': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2004/{z}/{x}/{-y}.png8',
	'2006': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2006/{z}/{x}/{-y}.png8',
	'2008': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2008/{z}/{x}/{-y}.png8',
	'2010': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2010/{z}/{x}/{-y}.png8',
	'2012': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2012/{z}/{x}/{-y}.png8',
	'2014': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2014/{z}/{x}/{-y}.png8',
	'2016': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2016/{z}/{x}/{-y}.png8'
};

/**
 * @desc The URLs of the New York City base map label tiles
 * @private
 * @const
 * @type {Object<string, string>}
 */
Basemap.LABEL_URLS = {
	base: 'https://maps{1-4}.nyc.gov/tms/1.0.0/carto/label/{z}/{x}/{-y}.png8',
	photo: 'https://maps{1-4}.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8'
};

/**
 * @private
 * @const
 * @type {ol.Extent}
 */
Basemap.UNIVERSE_EXTENT = [-8453323, 4774561, -7983695, 5165920];

/**
 * @desc The bounds of New York City
 * @public
 * @const
 * @type {ol.Extent}
 */
Basemap.EXTENT = [-8266522, 4937867, -8203781, 5000276];

/**
 * @desc The center of New York City
 * @public
 * @const
 * @type {ol.Coordinate}
 */
Basemap.CENTER = [-8235252, 4969073];

/**
 * @private
 * @const
 * @type {ol.Extent}
 */
Basemap.LABEL_EXTENT = [-8268000, 4870900, -8005000, 5055500];

/**
 * @private
 * @const
 * @type {ol.Extent}
 */
Basemap.PHOTO_EXTENT = [-8268357, 4937238, -8203099, 5001716];

export default Basemap
