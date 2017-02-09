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
		distLyr.set('name', 'Zoning District');

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
				nyc.ol.layer.mixin(this, nyc.ol.layer.zoning.district.mixins);	        	
	        	return {cssClass: 'tip-zoning', text: this.tip()};
	        }}])
		);

		distLyr.html = function(feature, layer){
			if (layer === this && feature.get('layer') == 'zoning-district'){
				nyc.ol.layer.mixin(feature, nyc.ol.layer.zoning.district.mixins);				
				return feature.html();
			}
		};
		
		return added;
	},
	/**
	 * @private
	 * @member {Array<Object>}
	 */
	mixins: [
         {
        	 baseUrl: 'http://www1.nyc.gov/site/planning/zoning/districts-tools/',
        	 categories: {
        		 MED_HI_RES: {desc: 'Residential (Medium and Higher Density)', url: 'residence-districts-r1-r10.page'},
        		 LOW_RES: {desc: 'Residential (Lower Density)', url: 'residence-districts-r1-r10.page'},
        		 COM: {desc: 'Commercial', url: 'commercial-districts-c1-c8.page'},
        		 MIX: {desc: 'Mixed Use', url: 'glossary.page#paired_districts'},
        		 MAN: {desc: 'Manufacturing', url: 'mfg-districts.page'},
        		 BPC: {desc: 'Battery Park City', url: 'special-purpose-districts-manhattan.page#bpark'},
        		 PARK: {desc: 'Park', url: 'glossary.page#public_park'}
			}
		},
 		new nyc.Content({
 			tip: '<b>${ZONEDIST}</b><br>${category}',
 			popup: '<div class="zoning">' +
	 			'<div><b>Zoning designation:</b></div>' +
	 			'<div><a href="${zonedistUrl}" target="_blank">${ZONEDIST}</a></div>' +
	 			'<div><b>Description:</b></div>' +
	 			'<div><a href="${categoryUrl}" target="_blank">${category}</a></div>'
		}),
		{
			/**
			 * @private
			 * @function
			 * @param {string} infoClass A css class for list view or popup view
			 * @return {JQuery}
			 */
			html: function(){
				this.embelish();				
				return this.message('popup', this.getProperties());
			},
			/**
			 * @private
			 * @function
			 * @param {string} infoClass A css class for list view or popup view
			 * @return {JQuery}
			 */
			tip: function(){
				this.embelish();
				return this.message('tip', this.getProperties());
			},
			embelish: function(){
				var props = this.getProperties(), category = this.categories[this.get('CATEGORY')];
				props.category = category.desc;
				props.categoryUrl = this.baseUrl + category.url;
				props.zonedistUrl = this.baseUrl + this.get('URL');
			}
		}
	]
};