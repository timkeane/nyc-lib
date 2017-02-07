var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};
nyc.ol.layer.group = nyc.ol.layer.group || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.group.dsny = {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.group.dsny.plow = {};

/**
 * @desc Add PlowNYC layers to the map
 * @public
 * @function
 * @param {ol.Map} map The map into which the layers will be added
 * @return {Array<ol.layer.Base>} The added layers
 */
nyc.ol.layer.group.dsny.plow.addTo = function(map){

	var priorityLyr = new ol.layer.VectorTile({
		source: new ol.source.VectorTile({
	        url: 'http://msdlva-geoapp01.csc.nycnet:83/geoserver/gwc/service/tms/1.0.0/plow%3ASNOW_PRIORITY@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
			tileGrid: nyc.ol.TILE_GRID,
			format: new ol.format.MVT()
		}),
		style: nyc.ol.style.dsny.plow.priority,
		extent: nyc.ol.Basemap.EXTENT,
		opacity: .6,
		visible: false
	});
	map.addLayer(priorityLyr);

	return [priorityLyr];
	
};