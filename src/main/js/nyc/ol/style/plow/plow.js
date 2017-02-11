var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.style = nyc.ol.style || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.style.plow = {
	/**
	 * @private
	 * @member {Object}
	 */
	cache: {priority: {}, visited: {}},
	/**
	 * @private
	 * @member {Object}
	 */
	color: {
		priority: {C: '#BF402E', S: '#1141AF', H: '#FFC228', V: '#A0CC17'},
		visited: {}
	},	
	/**
	 * @desc Style function for snow priority
	 * @public
	 * @function
	 * @param {ol.Feature|ol.render.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the view
	 * @return {ol.style.Style}
	 */
	priority: function(feature, resolution){
		var cache = nyc.ol.style.plow.cache.priority;
		var zoom = nyc.ol.TILE_GRID.getZForResolution(resolution);
		var priority = feature.get('PRIORITY');
		cache[zoom] = cache[zoom] || {};
		if (!cache[zoom][priority]){
			var width = Math.pow(2, zoom - 7) / 200;
			cache[zoom][priority] = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: nyc.ol.style.plow.color.priority[priority],
					width: width > .5 ? width : .5,
					lineJoin: 'miter'
				})
			});
		}
		return cache[zoom][priority];
	}
};