var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.layer.plow = {};

/**
 * @desc Abstract class for creating layer groups
 * @public
 * @class
 * @extends {nyc.ol.layer.Group}
 * @constructor
 * @param {ol.Map} map The map to which the layers will be added
 */
nyc.ol.layer.plow.Group = function(map){
	nyc.ol.layer.Group.apply(this, [map]);
	this.append([new nyc.ol.layer.plow.Priority(map).addedLayers]);
};
nyc.inherits(nyc.ol.layer.plow.Group, nyc.ol.layer.Group);

/**
 * @desc Abstract class for creating layer groups
 * @public
 * @class
 * @extends {nyc.ol.layer.Group}
 * @constructor
 * @param {ol.Map} map The map to which the layers will be added
 */
nyc.ol.layer.plow.Priority = function(map){
	nyc.ol.layer.Group.apply(this, [map]);
	this.addTo(map);
};

nyc.ol.layer.plow.Priority.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	url: 'http://msdlva-geoapp01.csc.nycnet:83/geoserver/gwc/service/tms/1.0.0/plow%3ASNOW_PRIORITY@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map 
	 */
	addTo: function(map){
		var me = this, added = me.addedLayers;
	
		var priorityLyr = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
		        url: this.url,
				tileGrid: nyc.ol.TILE_GRID,
				format: new ol.format.MVT()
			}),
			style: nyc.ol.style.plow.priority,
			extent: nyc.ol.Basemap.EXTENT,
			opacity: .6,
			visible: false
		});
		map.addLayer(priorityLyr);
		added.groupLayers.push(priorityLyr);
		added.allLayers.push(priorityLyr);
		priorityLyr.set('name', 'Snow Removal Designation');
	
		added.tips.push(
	        new nyc.ol.FeatureTip(map, [{layer: priorityLyr, labelFunction: function(){
				me.mixin(this, me.mixins);		
	        	return {cssClass: 'priority', text: this.html()};
	        }}])
		);
		
		priorityLyr.html = function(feature, layer){
			if (layer === this && feature.get('layer') == 'SNOW_PRIORITY'){
				me.mixin(feature, me.mixins);		
				return feature.html();
			}
		};
	},
	/**
	 * @private
	 * @member {Array<Object>}
	 */
	mixins: [
         {designation: {C: 'Critical', S: 'Sector', H: 'Haulster', V: 'Non-DSNY'}},
         new nyc.Content({tip: '<div class="plow"><b>${STREET}</b><br>${priority}</div>'}),
         {
        	 html: function(){
        		 this.embelish();
        		 return this.message('tip', this.getProperties());
        	 },
        	 embelish: function(){
        		 this.getProperties().priority = this.designation[this.get('DSNY_DESIGNATION')];
        	 }
    	 }
	]
};
nyc.inherits(nyc.ol.layer.plow.Priority, nyc.ol.layer.Group);