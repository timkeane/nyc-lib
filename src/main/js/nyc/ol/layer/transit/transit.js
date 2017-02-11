var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.transit = {};

nyc.ol.layer.transit.Group = function(map){
	nyc.ol.layer.Group.apply(this, [map]);
	this.append([new nyc.ol.layer.transit.Subway(map).addedLayers]);
};

nyc.inherits(nyc.ol.layer.transit.Group, nyc.ol.layer.Group);