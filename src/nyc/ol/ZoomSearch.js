/**
 * @module nyc/ol/ZoomSearch
 */

import $ from 'jquery'

import OlGeoJSON from 'ol/format/geojson'

import NycZoomSearch from 'nyc/ZoomSearch'
import NycLocator from 'nyc/Locator'
import NycGeocoder from 'nyc/Geocoder'

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
  	this.getElem('.z-srch').on('click dblclick mouseover mousemove', function(){$('.feature-tip').hide()})
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
		var geom = feature.getGeometry(), type = geom.getType(), data = feature.getProperties()
		data.__feature_label = feature.get(options.labelField || options.nameField)
		return {
			name: feature.get(options.nameField),
			coordinates: type == 'Point' ? geom.getCoordinates() : undefined,
			geometry: JSON.parse(this.geoJson.writeGeometry(geom)),
			data: data,
			type: NycLocator.ResultType.GEOCODE,
			accuracy: NycGeocoder.Accuracy.HIGH
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
		var view = this.view
		view.animate({zoom: view.getZoom() + $(event.target).data('zoom-incr')})
	}
}

export default ZoomSearch
