var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc A class for managing map location
 * @public
 * @class
 * @implements {nyc.Locator}
 * @constructor
 * @param {nyc.ol.Locator.Options} options Constructor options
 */
nyc.ol.Locator = function(options){
	this.map = options.map;
	this.info = options.info;
	this.view = this.map.getView();
	this.createLayer(options.style);
	this.zoom = options.zoom !== undefined ? options.zoom : nyc.ol.Locate.ZOOM_LEVEL;
	this.format = new ol.format.GeoJSON({
		projection: this.view.getProjection()
	});
};

nyc.ol.Locator.prototype = {
	/**
	 * @public
	 * @member {ol.layer.Vector}
	 */
	layer: null,
	/**
	 * @private
	 * @member {ol.source.Vector}
	 */
	source: null,
	/**
	 * @private
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {ol.View}
	 */
	view: null,
	/**
	 * @private
	 * @member {nyc.info.Finder}
	 */
	info: null,
	/**
	 * @private
	 * @member {ol.format.GeoJSON}
	 */
	format: null,
	/**
	 * @private
	 * @member {ol.style.Style}
	 */
	pointStyle: null,
	/**
	 * @private
	 * @member {ol.style.Style}
	 */
	anyStyle: null,
	/**
	 * @public
	 * @override
	 * @method
	 * @param {nyc.Locate.Result} data The location to which the map will be oriented
	 * @param {function()} callback The function to call after the locator has zoomed to the location
	 */
	zoomLocation: function(data, callback){
		var map = this.map, view = this.view, source= this.source, feature = this.feature(data), geom = feature.getGeometry();
		source.clear();
		source.addFeature(feature);
		if (callback){
			map.once('moveend', callback);
		}
		if (!geom || geom.getType() == 'Point'){
			view.animate({center: data.coordinates, zoom: this.zoom});
		}else{
			view.fit(geom.getExtent(), map.getSize());
		}
	},
	/**
	 * @public
	 * @override
	 * @method
	 * @param {nyc.Locate.Result} data The data to set as the location
	 */
	setLocation: function(data){
		this.source.clear();
		this.source.addFeature(this.feature(data));
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Locate.Result} location
	 * @return {ol.Feature}
	 */
	feature: function(location){		 
		var format = this.format, geoJson = location.geoJsonGeometry, feature = new ol.Feature({name: location.name});
		if (geoJson){
			feature.setGeometry(format.readGeometry(location.geoJsonGeometry));
		}else{
			feature.setGeometry(new ol.geom.Point(location.coordinates));				 
			if (this.info){
				var binOrBbl = location.data.buildingIdentificationNumber || location.data.bbl;
				if (binOrBbl){
					this.info.info({
						binOrBbl: binOrBbl, 
						projection: this.view.getProjection().getCode(),
						callback: function(resp){
							var feat = resp.features[0];
							if (feat){
								feature.setGeometry(format.readGeometry(feat.geometry)); 
							}
						}
					});
				}
			}
		}
		return feature;
	},
	/**
	 * @private
	 * @method
	 * @param {ol.style.Style|Array<ol.style.Style>|ol.StyleFunction=} style
	 */
	createLayer: function(style){
		if (!style) this.createStyle();
		this.source = new ol.source.Vector();
		this.layer = new ol.layer.Vector({
			source: this.source,
			style: style || $.proxy(this.style, this)
		});
		this.map.addLayer(this.layer);
	},
	/**
	 * @private
	 * @method
	 */
	createStyle: function(){
		var icon = nyc.ol.style.LOCATION_ICON;
		var stroke = new ol.style.Stroke({
			width: 2,
			color: '#000'
		});
		var fill = new nyc.ol.style.PatternFill({image: nyc.ol.style.PatternFill.Pattern.DOT9, opacity: .2});		
		this.anyStyle = new ol.style.Style({image: icon, stroke: stroke, fill: fill});
		this.pointStyle = new ol.style.Style({image: icon});
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Feature} feature
	 * @param {number} resolution
	 */
	style: function(feature, resolution){
		if (resolution < 2){
			return this.anyStyle;
		}else{
			var center = ol.extent.getCenter(feature.getGeometry().getExtent());
			this.pointStyle.setGeometry(new ol.geom.Point(center));
			return this.pointStyle;
		}
	}
};

/**
 * @desc Object type to hold constructor options for {@link nyc.ol.Locator}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map on which location will be managed
 * @property {ol.style.Style=} style The style for the layer on which user-specified locations will be displayed
 * @property {nyc.info.Finder=} info Building or tax lot feature finder  
 * @property {number} [zoom={@link nyc.ol.Locate.ZOOM_LEVEL}] The zoom level used when locating coordinates
 */
nyc.ol.Locator.Options;
