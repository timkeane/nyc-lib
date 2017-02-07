var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};
nyc.ol.layer.group = nyc.ol.layer.group || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.group.transportation = {};

/**
 * @desc Add transportation layers to the map
 * @public
 * @function
 * @param {ol.Map} map The map into which the layers will be added
 * @return {Array<ol.layer.Base>} The added layers
 */
nyc.ol.layer.group.transportation.addTo = function(map){
	var layers = [];
	
	var subway = new ol.layer.VectorTile({
		source: new ol.source.VectorTile({
	        url: 'http://msdlva-geoapp01.csc.nycnet:83/geoserver/gwc/service/tms/1.0.0/transportation%3Asubway@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
			tileGrid: nyc.ol.TILE_GRID,
			format: new ol.format.MVT()
		}),
		style: nyc.ol.style.transportation.subway.line,
		extent: nyc.ol.Basemap.EXTENT,
		visible: false
	});
	map.addLayer(subway);	
	layers.push(subway);
	subway.set('name', 'Subway');
	
	var subwayProxy = nyc.ol.style.mvt.proxyPointLayer({
		map: map,
		mvtLayer: subway,
		fidProperty: 'OBJECTID',
		pointStyle: nyc.ol.style.transportation.subway.station 
	});
	subwayProxy.setMaxResolution(nyc.ol.TILE_GRID.getResolution(10));
	
	return layers;
};
