var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.zoning = nyc.ol.layer.zoning = {};

nyc.ol.layer.zoning.Group = function(map){
	nyc.ol.layer.Group.apply(this, [map]);
	this.append([new nyc.ol.layer.zoning.District(map).addedLayers]);
};

nyc.inherits(nyc.ol.layer.zoning.Group, nyc.ol.layer.Group);
