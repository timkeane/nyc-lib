var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.zoning = nyc.ol.layer.zoning = {
	/**
	 * @desc Add zoning layers to the map
	 * @public
	 * @function
	 * @param {ol.Map} map The map into which the layers will be added
	 * @return {Array<ol.layer.Base>} The added layers
	 */
	addGroupTo: function(map){
		var district = nyc.ol.layer.zoning.district.addTo(map);
		return nyc.ol.layer.group([district]);
	}
};
