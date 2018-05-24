/**
 * @module nyc/ol/ZoomSearch
 */

import $ from 'jquery'

import OlGeoJSON from 'ol/format/geojson'
import olExtent from 'ol/extent'

import NycZoomSearch from 'nyc/ZoomSearch'
import NycLocator from 'nyc/Locator'

/**
 * @desc Class for providing a set of buttons to zoom and search.
 * @public
 * @class
 * @extends {nyc/ZoomSearch}
 */
class ZoomSearch extends NycZoomSearch {
  /**
   * @desc Creates an instance of nyc/ol/ZoomSearch
   * @constructor
   * @param {ol.Map} map The OpenLayers map that will be controlled
   */
  constructor(map) {
    super($(map.getTargetElement()).find('.ol-overlaycontainer-stopevent'))
    /**
  	 * @private
  	 * @member {ol.Map}
  	 */
  	this.map = map
    /**
  	 * @private
  	 * @member {ol.View}
  	 */
  	this.view = map.getView()
    /**
  	 * @private
  	 * @member {ol.format.GeoJSON}
  	 */
  	this.geoJson = new OlGeoJSON()
  	this.getContainer().on('click dblclick mouseover mousemove', () => {
      $('.feature-tip').hide()
    })
  }
	/**
	 * @public
	 * @override
	 * @method
	 * @param {Object} feature The feature object
	 * @param {NycZoomSearch.FeatureSearchOptions} options The options passed to setFeature
	 * @return {NycLocator.Result}
	 */
	featureAsLocation(feature, options) {
		const geom = feature.getGeometry()
		return {
			name: feature.getName ? feature.getName() : feature.get(options.nameField),
			coordinate: olExtent.getCenter(geom.getExtent()),
			geometry: JSON.parse(this.geoJson.writeGeometry(geom)),
			data: feature.getProperties(),
			type: 'geocoded',
			accuracy: NycLocator.Accuracy.HIGH
		}
	}
	/**
	 * @desc Handle the zoom event triggered by user interaction
	 * @public
	 * @override
	 * @method
	 * @param event The DOM event triggered by the zoom buttons
	 */
	zoom(event) {
		this.view.animate({
      zoom: this.view.getZoom() + ($(event.target).data('zoom-incr') * 1)
    })
	}
}

export default ZoomSearch
