var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};
nyc.ol.layer.transit = nyc.ol.layer.transit || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.transit.subway = {
	/**
	 * @private
	 * @member {string}
	 */
	url : 'http://msdlva-geoapp01.csc.nycnet:83/geoserver/gwc/service/tms/1.0.0/transit%3Asubway@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
	/**
	 * @desc Add subway layer to the map
	 * @public
	 * @function
	 * @param {ol.Map} map The map into which the layers will be added
	 * @return {nyc.ol.layer.Adds} The added layers
	 */
	addTo: function(map){
		var added = {groupLayers: [], proxyLayers: [], allLayers: [], tips: []};
		
		var subway = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
		        url: this.url,
				tileGrid: nyc.ol.TILE_GRID,
				format: new ol.format.MVT()
			}),
			style: nyc.ol.style.transit.subway.line,
			extent: nyc.ol.Basemap.EXTENT,
			visible: false
		});
		map.addLayer(subway);	
		added.groupLayers.push(subway);
		added.allLayers.push(subway);
		subway.set('name', 'Subway');
		
		var subwayProxy = nyc.ol.style.mvt.proxyPointLayer({
			map: map,
			mvtLayer: subway,
			fidProperty: 'OBJECTID',
			pointStyle: nyc.ol.style.transit.subway.station 
		});
		subwayProxy.setMaxResolution(nyc.ol.TILE_GRID.getResolution(10));
		added.proxyLayers.push(subwayProxy);
		added.allLayers.push(subwayProxy);
	
		added.tips.push(
			new nyc.ol.FeatureTip(map, [{
				layer: subway,
				labelFunction: function(){
					if (this.get('layer') == 'SUBWAY_LINE'){
						nyc.ol.layer.mixin(this, nyc.ol.layer.transit.subway.mixins);
						return {cssClass: 'tip-subway-ln', text: this.lineTip()};
					}else{
						return {text: this.get('NOTES')};
					}
				}
			},{
				layer: subwayProxy,
				labelFunction: function(){
					nyc.ol.layer.mixin(this, nyc.ol.layer.transit.subway.mixins);
					return {cssClass: 'tip-subway-sta', text: this.stationTip()};
				}
			}])
		);
		
		subwayProxy.html = function(feature, layer){
			var html = '';
			if (layer === this){
				nyc.ol.layer.mixin(feature, nyc.ol.layer.transit.subway.mixins);
				return feature.html();
			}
		}
		
		return added;
	},
	/**
	 * @private
	 * @member {Array<Object>}
	 */
	mixins: [
		new nyc.Content({
			stationTip: '<div class="subway-info"><div class="notranslate" translate="no">${NAME}</div><div class="icons notranslate" translate="no"></div></div>',
			lineTip: '<div><div class="icons notranslate" translate="no"></div></div>',
			info: '<div class="subway-info"><b class="notranslate" translate="no">${NAME}</b><div class="icons notranslate" translate="no"></div><div class="note">${NOTES}</div></div>',
			icon: '<div class="subway-icon subway-${line} ${express}"><div>${line}</div></div>'
		}),
		{
			/**
			 * @private
			 * @function
			 * @returns {Array<Oject<string, string>>}
			 */
			getLines: function(){
				var lines = [];
				$.each(this.get('LINE').split('-'), function(_, name){
					var parts = name.split(' ');
					lines.push({
						line: parts[0],
						express: parts.length == 2 ? 'express' :  ''
					});
				});
				return lines;
			},
			/**
			 * @private
			 * @function
			 * @param {string} infoClass A css class for list view or popup view
			 * @return {JQuery}
			 */
			stationTip: function(){
				return this.icons($(this.message('stationTip', this.getProperties())), this.getLines());
			},
			/**
			 * @private
			 * @function
			 * @param {string} infoClass A css class for list view or popup view
			 * @return {JQuery}
			 */
			lineTip: function(){
				return this.icons($(this.message('lineTip')), this.getLines());
			},
			/**
			 * @private
			 * @function
			 * @param {string} infoClass A css class for list view or popup view
			 * @return {JQuery}
			 */
			html: function(){
				return this.icons($(this.message('info', this.getProperties())), this.getLines());
			},
			/**
			 * @private
			 * @function
			 * @param {JQuery} html
			 * @param {Array<Oject<string, string>>} lines
			 * @return {JQuery} 
			 */
			icons: function(html, lines){
				var me = this, icons = html.find('.icons');
				$.each(lines, function(){
					icons.append(me.message('icon', this));
				});
				return html;
			}
		}
	]
};
