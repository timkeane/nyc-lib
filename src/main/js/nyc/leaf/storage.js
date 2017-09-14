var nyc = nyc || {};
nyc.leaf = nyc.leaf || {};

/**
 * @public
 * @namespace
 */
nyc.leaf.storage = {};

/**
 * @desc Class to provide access to localStorage and filesystem
 * @public
 * @class
 * @extends {nyc.storage.Local}
 * @constructor
 */
nyc.leaf.storage.Local = function(){};

nyc.leaf.storage.Local.prototype = {
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
		var dataProjection = this.customProj(projcs);
		if (typeof features == 'string'){
			features = JSON.parse(features);
		}
		features = features.features ? features.features : features;

		var layer = L.geoJSON(features, {
			coordsToLatLng: function(coord){
	 		 if (dataProjection){
	 			 coord = proj4(dataProjection, 'EPSG:4326', coord);
	 		 }
	 		 return [coord[1], coord[0], coord[2]];
	 	 }
		});
		map.addLayer(layer);
		return layer;
	}
};

nyc.inherits(nyc.leaf.storage.Local, nyc.storage.Local);
