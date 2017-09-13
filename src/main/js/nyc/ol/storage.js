var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @public
 * @namespace
 */
nyc.ol.storage = {};

/**
 * @desc Class to provide access to localStorage and filesystem
 * @public
 * @class
 * @extends {nyc.storage.Local}
 * @constructor
 */
nyc.ol.storage.Local = function(){};

nyc.ol.storage.Local.prototype = {
	/**
	 * @public
	 * @abstract
	 * @method
	 * @param {Object} map
	 * @param {string|Array<Object>} features
	 * @param {string} projcs
	 * @return {Object}
	*/
	addToMap: function(map, features, projcs){
		var options = {
			featureProjection: map.getView().getProjection(),
			dataProjection: this.customProj(projcs)
		};
		if (typeof features == 'object'){
			features = {type: 'FeatureCollection', features: features};
		}
		features = new ol.format.GeoJSON().readFeatures(features, options);
		var source = new ol.source.Vector();
		var layer = new ol.layer.Vector({source: source});
		source.addFeatures(features);
		map.addLayer(layer);
		return layer;
	}
};

nyc.inherits(nyc.ol.storage.Local, nyc.storage.Local);
