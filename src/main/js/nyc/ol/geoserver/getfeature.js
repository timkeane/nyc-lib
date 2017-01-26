var nyc = nyc || {};
nyc.ol = nyc.ol || {};
/** 
 * @public 
 * @namespace
 */
nyc.ol.geoserver = nyc.ol.geoserver || {};

/**
 * @desc A class to retrieve the feature of the specified layer at a map click and provide a WKT representation of its geometry 
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.ol.geoserver.GetFeature.Options} options Constructor options
 * @fires nyc.ol.geoserver.GetFeature#addfeature
 * @fires nyc.ol.geoserver.GetFeature#removefeature
 * @see http://www.geoserver.org/
 */
nyc.ol.geoserver.GetFeature = function(options){
	this.map = options.map;
	$(this.map.getViewport()).append(nyc.ol.geoserver.GetFeature.HTML).trigger('create');
	$('#btn-get-feat').click($.proxy(this.toggleActive, this));
	this.geoJson = new ol.format.GeoJSON({});
	this.buffer = options.buffer || 25;
	this.units = options.units || nyc.ol.geoserver.GetFeature.BufferUnits.FEET;
	this.geomColumn = options.geomColumn || 'SHAPE';
	options.propertyNames = options.propertyNames || [];
	options.propertyNames.push(this.geomColumn);
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
	this.url += ('&propertyName=' + options.propertyNames.toString());
	this.url += '&count=1';
	this.url += '&outputFormat=text/javascript';
	this.url += ('&format_options=callback:' + this.instance() + '.callback');
	this.url += '&cql_filter=';
};

nyc.ol.geoserver.GetFeature.prototype = {
	/**
	 * @private
	 * @member {JQuery} btn
	 */ 
	btn: null,
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
	/** 
	 * @desc Get the features that have been captured
	 * @public 
	 * @method
	 * @return {Array<nyc.ol.Feature>} The features
	 */
	getFeatures: function(){
		var me = this, features = [];
		$.each(me.source.getFeatures(), function(_, feature){
			features.push({feature: feature, wkt: me.wkt.writeFeature(feature)});
		});
		return features;
	},
	/** 
	 * @desc Remove all captured features
	 * @public 
	 * @method
	 */
	clear: function(){
		this.source.clear();
	},
	/** 
	 * @desc Toggle active state
	 * @public 
	 * @method
	 */
	toggleActive: function(){
		this[this.active ? 'deactivate' : 'activate']();
	},
	/** 
	 * @desc Activate to begin capturing map clicks
	 * @public 
	 * @method
	 */
	activate: function(){
		this.active = true;
		$('#btn-get-feat').addClass('active');
		this.map.on('click', this.getFeature, this);
	},
	/** 
	 * @desc Deactivate to stop capturing map clicks
	 * @public 
	 * @method
	 */
	deactivate: function(){
		this.active = false;
		$('#btn-get-feat').removeClass('active');
		this.map.un('click', this.getFeature, this);
	},
	/**
	 * @desc The callback that handles GeoServer WFS GetFeature responses
	 * @public
	 * @method
	 * @param {Object} data The GeoServer WFS GetFeature response
	 */
	callback: function(response){
		if (response && response.features && response.features.length){
			var feature = this.geoJson.readFeature(response.features[0]);
			this.trigger(nyc.ol.FeatureEventType.ADD, feature);
			this.source.addFeature(feature);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.MapBrowserEvent} event
	 */
	getFeature: function(event){
	if (event.originalEvent.target === $('#btn-get-feat').get(0)){
		return;
	}else if (event.originalEvent.shiftKey){
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
	 * @method
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
	/** 
	 * @private 
	 * @method
	 * @param {ol.MapBrowserEvent} event
	 */
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
			this.trigger(nyc.ol.FeatureEventType.REMOVE, feature);
			me.source.removeFeature(feature);
		}
	}	
};

nyc.inherits(nyc.ol.geoserver.GetFeature, nyc.EventHandling);

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.geoserver.GetFeature.HTML = 	'<a id="btn-get-feat" class="ctl ctl-btn" data-role="button" data-icon="arrow-d" data-iconpos="notext" data-zoom-incr="1" title="Get feature (Click the map to retrieve a feature. Hold the shift-key and click a feature to remove.)">' +
		'<span class="noshow">Get feature</span>' +
	'</a>';

/**
 * @desc Object type to hold constructor options for {@link nyc.ol.geoserver.GetFeature}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The OpenLayers map with which the user will interact
 * @property {string} wfsUrl A GeoServer WFS URL (i.e. http://localhost/geoserver/wfs) 
 * @property {string} namespace The namespace of the layer from which to retrieve features
 * @property {string} typeName The type name of the layer from which to retrieve features
 * @property {string} geomColumn The name of the layer's geometry column that will be queried
 * @property {Array<string>=} propertyNames The property names of the layer to retrieve with the features
 * @property {number} [buffer=25] The buffer radius to use around the map click when querying the layer
 * @property {nyc.ol.geoserver.GetFeature.BufferUnits} [units=feet] The units of the buffer
 * @property {ol.style.Style=} style The style to use for features added to the map
 */
nyc.ol.geoserver.GetFeature.Options;

/**
 * @desc Buffer units to use when getting a feature at a map click
 * @public
 * @enum {string}
 */
nyc.ol.geoserver.GetFeature.BufferUnits = {
	/** 
	 * @desc Feet
	 */
	FEET: 'feet',
	/** 
	 * @desc Meters
	 */
	METERS: 'meters',
	/** 
	 * @desc Statute miles
	 */
	MILES: 'statute miles',
	/** 
	 * @desc Nautical miles
	 */
	NAUTICAL_MILES: 'nautical miles',
	/** 
	 * @desc Kilometers
	 */
	KILOMETERS: 'kilometers'
};

/**
 * @desc The added feature
 * @event nyc.ol.geoserver.GetFeature#addfeature
 * @type {nyc.ol.FeatureEvent}
 */

/**
 * @desc The removed feature
 * @event nyc.ol.geoserver.GetFeature#removefeature
 * @type {nyc.ol.FeatureEvent}
 */
