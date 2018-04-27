var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.style = nyc.ol.style || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.style.zoning = nyc.ol.style.zoning || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.style.zoning.district = {
	/**
	 * @private
	 * @member {Object}
	 */
	cache: {district: {}, label: {}},
	/**
	 * @private
	 * @member {Object}
	 */
	color: {
		MED_HI_RES: 'rgba(255,211,127,.6)',
		LOW_RES: 'rgba(255,255,190,.6)',
		COM: 'rgba(255,127,124,.6)',
		MIX: 'rgba(115,178,255,.6)',
		MAN: 'rgba(223,115,255,.6)',
		BPC: 'rgba(225,225,225,.6)',
		PARK: 'rgba(211,255,190,.6)'
	},	
	/**
	 * @desc Style function for Zoning District polygons and labels
	 * @public
	 * @function
	 * @param {ol.Feature|ol.render.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the view
	 * @return {ol.style.Style}
	 */
	style: function(feature, resolution){
		return nyc.ol.style.zoning.district[feature.get('layer') == 'zoning-district-label' ? 'label' : 'polygon'](feature, resolution);
	},
	/**
	 * @desc Style function for Zoning District polygons
	 * @public
	 * @function
	 * @param {ol.Feature|ol.render.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the view
	 * @return {ol.style.Style}
	 */
	polygon: function(feature, resolution){
		var cache = nyc.ol.style.zoning.district.cache.district;
		var zoom = nyc.ol.TILE_GRID.getZForResolution(resolution);
		var district = feature.get('ZONEDIST');
		cache[zoom] = cache[zoom] || {};
		if (!cache[zoom][district]){
			var style = new ol.style.Style({
				fill: new ol.style.Fill({
					color: nyc.ol.style.zoning.district.color[feature.get('CATEGORY')]
				})
			});
			if (zoom > 12){
				style.setStroke(new ol.style.Stroke({
					color: zoom < 15 ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.2)',
					width: zoom / 10
				}));
			}
			cache[zoom][district] = style;
		}
		return cache[zoom][district];
	},
	/**
	 * @desc Style function for Zoning District labels
	 * @public
	 * @function
	 * @param {ol.Feature|ol.render.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the view
	 * @return {ol.style.Style}
	 */
	label: function(feature, resolution){
		var zoom = nyc.ol.TILE_GRID.getZForResolution(resolution);
		if (zoom > 14){
			var cache = nyc.ol.style.zoning.district.cache.label;
			var district = feature.get('ZONEDIST');
			cache[zoom] = cache[zoom] || {};
			if (!cache[zoom][district]){
				cache[zoom][district] = new ol.style.Style({
					text: new ol.style.Text({
						text: district,
						font: 'bold ' + Math.floor(zoom * .75) + 'px sans-serif',
						fill: new ol.style.Fill({color: 'rgba(0,0,0,.7)'})
					})
				});
			}
			return cache[zoom][district];
		}
	}
};

