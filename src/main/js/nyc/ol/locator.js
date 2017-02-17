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
	 * @member {nyc.info.Info}
	 */
	info: null,
	/**
	 * @private
	 * @member {ol.format.GeoJSON}
	 */
	format: null,
	/**
	 * @public
	 * @override
	 * @method
	 * @param {nyc.Locate.Result} data The location to which the map will be oriented
	 * @param {function()} callback The function to call after the locator has zoomed to the location
	 */
	zoomLocation: function(data, callback){
		var feature = this.feature(data), geom = feature.getGeometry();
		this.source.clear();
		this.source.addFeature(feature);
		this.map.once('moveend', callback);
		this.map.beforeRender(
			ol.animation.zoom({resolution: this.view.getResolution()}), 
			ol.animation.pan({source: this.view.getCenter()})
		);
		if (!geom || geom.getType() == 'Point'){
			this.view.setZoom(this.zoom);
			this.view.setCenter(data.coordinates);			
		}else{
			this.view.fit(geom.getExtent(), this.map.getSize());
		}
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
	 * @param {ol.style.Style} style
	 */
	createLayer: function(style){
		if (!style){
			var icon = new ol.style.Icon({
				scale: 48 / 512,
				src: 'img/me' +  (nyc.util.isIe() || nyc.util.isIos() ? '.png' : '.svg')
			});
			var stroke = new ol.style.Stroke({
				width: 2,
				color: '#000'
			});
			var fill = new nyc.ol.style.PatternFill({image: nyc.ol.style.PatternFill.Pattern.DOT9, opacity: .2});
			style = new ol.style.Style({image: icon, stroke: stroke, fill: fill})
		}
		this.source = new ol.source.Vector();
		this.layer = new ol.layer.Vector({
			source: this.source,
			style: style
		});
		this.map.addLayer(this.layer);
	}
};

/**
 * @desc Object type to hold constructor options for {@link nyc.ol.Locator}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map on which location will be managed
 * @property {ol.style.Style=} style The style for the layer on which user-specified locations will be displayed
 * @property {nyc.info.Info=} info Building or tax lot feature finder  
 * @property {number} [zoom={@link nyc.ol.Locate.ZOOM_LEVEL}] The zoom level used when locating coordinates
 */
nyc.ol.Locator.Options;
