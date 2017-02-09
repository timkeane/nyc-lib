var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.transit = {
	/**
	 * @desc Add transit layers to the map
	 * @public
	 * @function
	 * @param {ol.Map} map The map into which the layers will be added
	 * @return {Array<ol.layer.Base>} The added layers
	 */
	addGroupTo: function(map){
		var subway = nyc.ol.layer.transit.subway.addTo(map);
		return nyc.ol.layer.group([subway]);
	}
};
