var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};
nyc.ol.layer.transit = nyc.ol.layer.transit || {};

/**
 * @desc Abstract class for creating layer groups
 * @public
 * @class
 * @extends {nyc.ol.layer.Group}
 * @constructor
 * @param {ol.Map} map The map to which the layers will be added
 */
nyc.ol.layer.transit.Subway = function(map){
	nyc.ol.layer.Group.apply(this, [map]);
	this.addTo(map);
};

nyc.ol.layer.transit.Subway.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	url: 'http://msdlva-geoapp01.csc.nycnet:83/geoserver/gwc/service/tms/1.0.0/transit%3Asubway@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map 
	 */
	addTo: function(map){
		var me = this, added = me.addedLayers;
		
		var subwayLyr = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
		        url: this.url,
				tileGrid: nyc.ol.TILE_GRID,
				format: new ol.format.MVT()
			}),
			style: nyc.ol.style.transit.subway.line,
			extent: [-8265953, 4940600, -8209993, 4998150],
			opacity: .8,
			visible: false
		});
		map.addLayer(subwayLyr);	
		added.groupLayers.push(subwayLyr);
		added.allLayers.push(subwayLyr);
		subwayLyr.set('name', 'Subway');
		
		var stationProxy = nyc.ol.style.mvt.proxyPointLayer({
			map: map,
			mvtLayer: subwayLyr,
			fidProperty: 'OBJECTID',
			pointStyle: nyc.ol.style.transit.subway.point 
		});
		added.proxyLayers.push(stationProxy);
		added.allLayers.push(stationProxy);
	
		this.tips(map, subwayLyr, stationProxy);

		stationProxy.html = function(feature, layer){
			if (layer === this){
				me.mixin(feature, me.mixins);
				return feature.html();
			}
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map 
	 * @param {ol.layer.VectorTile} subwayLyr 
	 * @param {ol.layer.Vector} stationProxy 
	 */
	tips: function(map, subwayLyr, stationProxy){
		var me = this;
		me.addedLayers.tips.push(
				new nyc.ol.FeatureTip(map, [{
					layer: subwayLyr,
					labelFunction: function(){
						if (this.get('layer') == 'SUBWAY_LINE'){
							me.mixin(this, me.mixins);
							return {cssClass: 'subway-ln', text: this.lineTip()};
						}else{
							return {text: this.get('NOTES')};
						}
					}
				},{
					layer: stationProxy,
					labelFunction: function(){
						me.mixin(this, me.mixins);
						return {cssClass: 'subway-sta', text: this.stationTip()};
					}
				}])
			);
	},
	/**
	 * @private
	 * @member {Array<Object>}
	 */
	mixins: [
		new nyc.Content({
			stationTip: '<div class="subway"><div class="notranslate" translate="no">${NAME}</div><div class="icons notranslate" translate="no"></div></div>',
			lineTip: '<div><div class="icons notranslate" translate="no"></div></div>',
			info: '<div class="subway"><b class="notranslate" translate="no">${NAME}</b><div class="icons notranslate" translate="no"></div><div class="note">${NOTES}</div></div>',
			icon: '<a class="subway-icon subway-${line} ${express}" href="http://web.mta.info/nyct/service/${webpage}.htm" title="${name} service info" target="_blank" rel="noopener noreferrer"><div>${line}</div></a>'
		}),
		{
			webpages: {
				1: 'oneline', 2: 'twoline', 3: 'threeline', 4: 'fourline', 5: 'fiveline', 6: 'sixline', '6-express': '6d', 7: 'sevenline', '7-express': '7d', 
				A: 'aline', B: 'bline', C: 'cline', D: 'dline', E: 'eline', F: 'fline', G: 'gline', J: 'jline', L: 'line', M: 'mline', N: 'nline', 
				Q: 'qline', R: 'rline', S: 'sline', W: 'wline', Z: 'zline'
			},
			/**
			 * @private
			 * @function
			 * @returns {Array<Oject<string, string>>}
			 */
			getLines: function(){
				var me = this, lines = [];
				$.each(me.get('LINE').split('-'), function(){
					var parts = this.split(' ');
					lines.push({
						name: this,
						line: parts[0],
						express: parts.length == 2 ? 'express' :  '',
						webpage: me.webpages[this]
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
				var props = this.getProperties();
				props.NOTES = props.NOTES || '';
				return this.icons($(this.message('info', props)), this.getLines());
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

nyc.inherits(nyc.ol.layer.transit.Subway, nyc.ol.layer.Group);