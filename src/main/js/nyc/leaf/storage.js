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

		this.project(features, dataProjection);
		features = {type: 'FeatureCollection', features: features};

		var layer = L.geoJSON(features);
		map.addLayer(layer);
		return layer;
	},
	/**
	 * @private
	 * @method
	 * @param {Array<Object>}
	 * @param {string} dataProjection
	 */
	 project: function(features, dataProjection){
		 if (dataProjection){
			 $.each(features, function(_, feature){
				 var geom = feature.geometry;
				 if (geom.type == 'Point'){
					 geom.coordinates = proj4(dataProjection, 'EPSG:8357', geom.coordinates);
				 }else if(geom.type == 'LineString'){
					 $.each(geom.coordinates, function(i, coord){
						 geom.coordinates[i] = roj4(dataProjection, 'EPSG:8357', coord);
					 });
				 }else if(geom.type == 'Ploygon'){
					 $.each(geom.coordinates, function(_, coordinates){
						 $.each(coordinates, function(i, coord){
							 coordinates[i] = roj4(dataProjection, 'EPSG:8357', coord);
						 });
					 });
				 }
			 });
		 }
	 }
};

nyc.inherits(nyc.leaf.storage.Local, nyc.storage.Local);
