var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};
nyc.ol.layer.zoning = nyc.ol.layer.zoning || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.zoning.district = {
	/**
	 * @private
	 * @member {string}
	 */
	url: '/geoserver/gwc/service/tms/1.0.0/zoning%3Azoning@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
	/**
	 * @desc Add zoning district layer to the map
	 * @public
	 * @function
	 * @param {ol.Map} map The map into which the layers will be added
	 * @return {nyc.ol.layer.Adds} The added layers
	 */
	addTo: function(map){
		var added = {groupLayers: [], proxyLayers: [], allLayers: [], tips: []};
		var distLyr = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
		        url: this.url,
				tileGrid: nyc.ol.TILE_GRID,
				format: new ol.format.MVT()
			}),
			style: nyc.ol.style.zoning.district.polygon,
			extent: nyc.ol.Basemap.EXTENT,
			zIndex: 1000
		});
		map.addLayer(distLyr);
		added.groupLayers.push(distLyr);

		var distLbl = nyc.ol.style.mvt.proxyPointLayer({
			map: map,
			mvtLayer: distLyr,
			fidProperty: 'OBJECTID',
			pointStyle: nyc.ol.style.zoning.district.label 
		});
		distLbl.setMaxResolution(nyc.ol.TILE_GRID.getResolution(14));
		added.proxyLayers.push(distLbl);

		added.tips.push(
	        new nyc.ol.FeatureTip(map, [{layer: distLyr, labelFunction: function(){
	        	return {text: '<b>' + this.get('ZONEDIST') + '</b><br>' + CATEGORIES[this.get('CATEGORY')].desc};
	        }}])
		);

		distLyr.html = function(feature, layer){
			if (layer === this && feature.get('layer') == 'zoning-district'){
				var html = $('<div class="zoning"></div>');
				var dist = $('<a target="_blank"></a>').html(feature.get('ZONEDIST'));
				var cat = CATEGORIES[feature.get('CATEGORY')];
				var category = $('<a target="_blank"></a>').html(cat.desc);
				dist.attr('href', DCP_BASE_URL + feature.get('URL'));
				category.attr('href', DCP_BASE_URL + cat.url);
				html.append('<div><b>Zoning designation:</b><div>');
				html.append(dist);
				html.append('<div><b>Description:</b><div>');
				html.append(category);
				return html;
			}
		};
		
		return added;
	},
	/**
	 * @private
	 * @member {Array<Object>}
	 */
	minins: [
	
	]
};