var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.style = nyc.ol.style || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.style.transit = nyc.ol.style.transit || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.style.transit.subway = {
	/**
	 * @private
	 * @member {Object}
	 */
	cache: {SUBWAY_LINE: {}, SUBWAY_STATION: {}, SUBWAY_TRANSFER: {}, SUBWAY_ENTRANCE: {}},
	/**
	 * @private
	 * @member {Object}
	 */
	color: {
		1: '#ff3433', 2: '#ff3433', 3: '#ff3433',
		4: '#009d33', 5: '#009d33', 6: '#009d33', 7: '#c801cc',
		A: '#0e689a', C: '#0e689a', E: '#0e689a',
		B: '#fa9705', D: '#fa9705', F: '#fa9705',
		G: '#98cd01',
		J: '#9d6400', M: '#9d6400', Z: '#9d6400',
		L: '#999999', S: '#999999',
		N: '#ffff0c', R: '#ffff0c', Q: '#ffff0c'
	},		
	/**
	 * @desc Style function for Zoning District polygons
	 * @public
	 * @function
	 * @param {ol.Feature|ol.render.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the view
	 * @return {ol.style.Style}
	 */
	style: function(feature, resolution){
		var layer = feature.get('layer'), style = nyc.ol.style.transit.subway;
		if (layer == 'SUBWAY_STATION'){
			return style.station(feature, resolution);
		}else if (layer == 'SUBWAY_LINE'){
			return style.line(feature, resolution);			
		}
		return style.transfer(feature, resolution);			
	},
	/**
	 * @desc Style function for Zoning District polygons
	 * @public
	 * @function
	 * @param {ol.Feature|ol.render.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the view
	 * @return {ol.style.Style}
	 */
	line: function(feature, resolution){
		var layer = feature.get('layer');
		var cache = nyc.ol.style.transit.subway.cache[layer];
		if (layer == 'SUBWAY_LINE'){
			var route = feature.get('RT_SYMBOL');
			var zoom = nyc.ol.TILE_GRID.getZForResolution(resolution);
			cache[zoom] = cache[zoom] || {};
			if (!cache[zoom][route]){
				var width = [.25, .25, .5, .5, 1, 1, 2, 4, 8, 10, 14, 18, 22, 26][zoom - 8];
				cache[zoom][route] = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: nyc.ol.style.transit.subway.color[route],
						width: width,
						lineJoin: 'bevel',
						lineCap: 'square',
						miterLimit: 200
					})
				});
			}
			return cache[zoom][route];
		}else{
			return nyc.ol.style.transit.subway.transfer(feature, resolution);
		}
	},
	/**
	 * @desc Style function for Zoning District polygons
	 * @public
	 * @function
	 * @param {ol.Feature|ol.render.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the view
	 * @return {ol.style.Style}
	 */
	transfer: function(feature, resolution){
		var layer = feature.get('layer');
		var cache = nyc.ol.style.transit.subway.cache[layer];
		var zoom = nyc.ol.TILE_GRID.getZForResolution(resolution);
		if (!cache[zoom]){
			var width = [1, 1, 2, 4, 6, 8, 10, 12, 14, 18, 22, 26, 32, 32][zoom - 8] / 2;
			cache[zoom] = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: '#000',
					width: width > .5 ? width : .5
				})
			});
		}
		return cache[zoom];
	},
	/**
	 * @desc Style function for Zoning District labels
	 * @public
	 * @function
	 * @param {ol.Feature|ol.render.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the view
	 * @return {ol.style.Style}
	 */
	station: function(feature, resolution){
		var layer = feature.get('layer');
		var cache = nyc.ol.style.transit.subway.cache[layer];
		var zoom = nyc.ol.TILE_GRID.getZForResolution(resolution);
		var radius = nyc.ol.style.transit.subway.radius(zoom, layer);
		if (radius && !cache[zoom]){
			cache[zoom] = new ol.style.Style({
				image: new ol.style.Circle({
					radius: radius,
					stroke: new ol.style.Stroke({
						color : layer == 'SUBWAY_STATION' ? '#000' : '#228B22',
						width : radius / 3
					}),
					fill: new ol.style.Fill({
						color: layer == 'SUBWAY_STATION' ? 'rgba(255,255,255,.8)' : 'rgba(50,205,50,.8)'
					})
				})
			});
		}
		return cache[zoom];
	},
	radius: function(zoom, layer){
		if (layer == 'SUBWAY_STATION'){
			return [2, 4, 6, 8, 12, 16, 20, 26, 32, 36, 42][zoom - 11];
		}
		return [5, 6, 7, 8, 9, 10, 11][zoom - 15];
	}
};

