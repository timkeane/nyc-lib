var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc An class for managing map location
 * @public
 * @class
 * @implements {nyc.Locator}
 * @constructor
 * @param {nyc.leaf.Locator.Options} options Constructor options
 */
nyc.ol.Locator = function(options){
	this.map = options.map;
	this.view = this.map.getView();
	this.layerSource = options.layer.getSource();
	this.zoom = options.zoom !== undefined ? options.zoom : nyc.ol.Locate.ZOOM_LEVEL;
	this.geoJsonFormat = new ol.format.GeoJSON({
		projection: this.view.getProjection()
	});
};

nyc.ol.Locator.prototype = {
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
	 * @member {ol.source.Vector}
	 */
	layerSource: null,
	/**
	 * @private
	 * @member {ol.format.GeoJSON}
	 */
	geoJsonFormat: null,
	/**
	 * @public
	 * @override
	 * @method
	 * @param {nyc.Locate.Result} data The location to which the map will be oriented
	 */
	zoomLocation: function(data){
		var feature = this.feature(data), geom = feature.getGeometry();
		this.layerSource.clear();
		this.layerSource.addFeature(feature);
		this.map.beforeRender(
			ol.animation.zoom({resolution: this.view.getResolution()}), 
			ol.animation.pan({source: this.view.getCenter()})
		);
		if (geom.getType() == 'Point'){
			this.view.setZoom(this.zoom);
			this.view.setCenter(geom.getCoordinates());			
		}else{
			this.view.fit(geom.getExtent(), this.map.getSize());
		}
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Locate.Result} data
	 * @return {ol.Feature}
	 */
	 feature: function(data){		 
		 var geoJson = data.geoJsonGeometry, geom;
		 if (geoJson && geoJson.type != "Point"){
			 geom = this.geoJsonFormat.readGeometry(data.geoJsonGeometry);
		 }else{
			 geom = new ol.geom.Point(data.coordinates);
		 }
		 return new ol.Feature({geometry: geom, name: data.name});
	 }
};

/**
 * @desc Object type to hold constructor options for {@link nyc.leaf.Locator}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map on which location will be managed
 * @property {ol.layer.Vector} layer The layer on which user-specified locations will be displayed
 * @property {number} [zoom={@link nyc.ol.Locate.ZOOM_LEVEL}] The zoom level used when locating coordinates
 */
nyc.ol.Locator.Options;
