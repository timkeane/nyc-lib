import NycLocalStorage from 'nyc/LocalStorage'

/**
 * @desc Class to provide access to localStorage and filesystem
 * @public
 * @class
 * @extends {nyc.storage.Local}
 * @constructor
 */
class LocalStorage extends NycLocalStorage {
	constructor(){
		super()
	}
	/**
	 * @public
	 * @abstract
	 * @method
	 * @param {Object} map
	 * @param {string|Array<Object>} features
	 * @param {string} projcs
	 * @return {Object}
	*/
	addToMap (map, features, projcs) {
		var options = {
			featureProjection: map.getView().getProjection(),
			dataProjection: this.customProj(projcs)
		}
		if (typeof features == 'object'){
			features = {type: 'FeatureCollection', features: features}
		}
		features = new ol.format.GeoJSON().readFeatures(features, options)
		var source = new ol.source.Vector()
		var layer = new ol.layer.Vector({source: source})
		source.addFeatures(features)
		map.addLayer(layer)
		return layer
	}
}

