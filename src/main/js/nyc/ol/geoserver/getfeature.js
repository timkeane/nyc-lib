var nyc = nyc || {};
nyc.ol = nyc.ol || {};
/** 
 * @export 
 * @namespace
 */
nyc.ol.geoserver = nyc.ol.geoserver || {};

/**
 * @export
 * @enum {string}
 */
nyc.ol.geoserver.BufferUnits = {
	FEET: 'feet',
	METERS: 'meters',
	MILES: 'statute miles',
	NAUTICAL_MILES: 'nautical miles',
	KILOMETERS: 'kilometers'
};

/**
 * @export
 * @typedef {Object}
 * @property {ol.Map} map
 * @property {string} wfsUrl
 * @property {string} namespace
 * @property {string} typeName
 * @property {Array<string>=} propertyNames
 * @property {string} geomColumn
 * @property {number=} buffer
 * @property {nyc.ol.geoserver.BufferUnits=} units
 * @property {ol.style.Style=} style
 */
nyc.ol.geoserver.GetFeatureOptions;

/**
 * @export
 * @constructor
 * @extends {nyc.ol.GetFeatureOptions}
 */
nyc.ol.geoserver.GetFeature = function(options){
	this.map = options.map;
	this.wkt = new ol.format.WKT({});
	this.geoJson = new ol.format.GeoJSON({});
	this.buffer = options.buffer || 25;
	this.units = options.units || nyc.ol.geoserver.BufferUnits.FEET;
	this.geomColumn = options.geomColumn || 'SHAPE';
	this.source = new ol.source.Vector({});
	this.layer = new ol.layer.Vector({
		source: this.source,
		style: options.style || this.defaultStyle
	});
	this.map.addLayer(this.layer);
	this.url = options.wfsUrl;
	this.url += '?service=wfs';
	this.url += '&version=2.0.0';
	this.url += '&request=GetFeature';
	this.url += ('&typeNames=' + options.namespace + ':' + options.typeName);
	if (options.propertyNames){
		this.url += ('&propertyName=' + options.propertyNames.toString());
	}
	this.url += '&count=1';
	this.url += '&outputFormat=text/javascript';
	this.url += ('&format_options=callback:' + this.instance() + '.callback');
	this.url += '&cql_filter=';
};

/**
 * @export
 * @enum {string}
 */
nyc.ol.FeatureEventType = {
	ADD: 'addfeature',
	CHANGE: 'changefeature',
	REMOVE: 'removefeature'
};

nyc.ol.geoserver.GetFeature.prototype = {
	/**
	 * @private
	 * @member {string} url
	 */ 
	url: null,
	/**
	 * @private
	 * @member {number} buffer
	 */ 
	buffer: null,
	/**
	 * @private
	 * @member {ol.source.Vector} source
	 */ 
	source: null,
	/**
	 * @private
	 * @member {ol.source.Layer} layer
	 */ 
	layer: null,
	/**
	 * @private
	 * @member {ol.format.GeoJSON} geoJson
	 */ 
	geoJson: null,
	/**
	 * @private
	 * @member {ol.format.GeoJSON} geoJson
	 */ 
	geoJson: null,
	/**
	 * @private
	 * @member {ol.format.WKT} wkt
	 */ 
	wkt: null,
	/**
	 * @private
	 * @member {boolean} active
	 */ 
	active: false,
	/**
	 * @private
	 * @member {string} filter
	 */ 
	filter: "DWITHIN(${geomColumn},POINT(${x} ${y}),${buffer},${units})",
	/**
	 * @private
	 * @member {ol.style.Style} defaultStyle
	 */ 
	defaultStyle: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(255,0,0,0.5)',
			width: 5
		})
	}),
	/** @export 
	 * @return {Array<Object>}
	 */
	getFeatures: function(){
		var me = this, features = [];
		$.each(me.source.getFeatures(), function(_, feature){
			features.push({feature: feature, wkt: me.wkt.writeFeature(feature)});
		});
		return features;
	},
	/** @export */
	clear: function(){
		this.source.clear();
	},
	/**
	 * @export
	 * @param {nyc.ol.Draw.Type} type
	 */
	active: function(){
		this.active;
	},
	/** @export */
	activate: function(){
		this.active = true;
		this.map.on('click', this.getFeature, this);
	},
	/** @export */
	deactivate: function(){
		this.active = false;
		this.map.un('click', this.getFeature, this);
	},
	/**
	 * @export
	 * @param {Object} data
	 */
	callback: function(response){
		var data = {type: nyc.ol.FeatureEventType.ADD};
		if (response && response.features && response.features.length){
			data.feature = this.geoJson.readFeature(response.features[0]);
			data.feature.wkt = this.wkt.writeFeature(data.feature);
			this.source.addFeature(data.feature);
		}
		this.trigger(nyc.ol.FeatureEventType.ADD, data);
	},
	/**
	 * @private
	 * @param {ol.MapBrowserEvent} event
	 */
	getFeature: function(event){
		if (event.originalEvent.shiftKey){
			this.removeFeature(event);
		}else{
			var filter = this.filter, xy = event.coordinate;
			filter = filter.replace(/\$\{geomColumn\}/, this.geomColumn);
			filter = filter.replace(/\$\{x\}/, xy[0]);
			filter = filter.replace(/\$\{y\}/, xy[1]);
			filter = filter.replace(/\$\{buffer\}/, this.buffer);
			filter = filter.replace(/\$\{units\}/, this.units);
			$.ajax({
				url: this.url + filter,
				dataType: 'jsonp'
			});
		}
	},
	/**
	 * @private
	 * @return {string}
	 */
	instance: function(){
		var instance;
		for (var i = 0; i > -1; i++){
			instance = 'instance_' + i;
			if (!nyc.ol.geoserver.GetFeature[instance]){
				nyc.ol.geoserver.GetFeature[instance] = this;
				return 'nyc.ol.geoserver.GetFeature.' + instance;
			}
		}
	},
	/** @private */
	removeFeature: function(event){
		var me = this, map = me.map,
			feature = map.forEachFeatureAtPixel(event.pixel, 
				function(feature, layer){
					if (layer == me.layer){
						return feature;
		    		}		    		
		        }
			);	
		if (feature){
			this.trigger(nyc.ol.FeatureEventType.REMOVE, {
				type: nyc.ol.FeatureEventType.REMOVE,
				feature: {
					feature: feature, 
					wkt: me.wkt.writeFeature(feature)
				}
			});
			me.source.removeFeature(feature);
		}
	}	
};

nyc.inherits(nyc.ol.geoserver.GetFeature, nyc.EventHandling);
