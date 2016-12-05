var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc Class that provides an ol.Map with base layers and labels
 * @public
 * @class
 * @constructor
 * @param {nyc.ol.layer.BaseLayer.Options} option Constructor options
 */
nyc.ol.Basemap = function(options){
	var latestPhotoYr = 0, layers = [];
	this.base = new ol.layer.Tile({
		extent: nyc.ol.Basemap.UNIVERSE_EXTENT,
		source: new ol.source.XYZ({url: nyc.ol.Basemap.BASE_URL})
	});
	layers.push(this.base);
	this.labels = {};
	for (var labelType in nyc.ol.Basemap.LABEL_URLS) {
		this.labels[labelType] = new ol.layer.Tile({
			extent: nyc.ol.Basemap.LABEL_EXTENT,
			source: new ol.source.XYZ({url: nyc.ol.Basemap.LABEL_URLS[labelType]}),
			zIndex: 1000,
			visible: labelType == 'base'
		});		
		layers.push(this.labels[labelType]);
	}
	this.photos = {};
	for (var year in nyc.ol.Basemap.PHOTO_URLS) {
		this.photos[year] = new ol.layer.Tile({
			extent: nyc.ol.Basemap.PHOTO_EXTENT,
			source: new ol.source.XYZ({url: nyc.ol.Basemap.PHOTO_URLS[year]}),
			visible: false
		});		
		if ((year * 1) > latestPhotoYr){
			this.latestPhoto = year;
		}
		layers.push(this.photos[year]);
	}
	this.view = options.view || new ol.View({
		center: nyc.ol.Basemap.CENTER,
		minZoom: 8,
		zoom: 8
	});
	this.map = new ol.Map({
		target: options.target,
		layers: layers,
		view: this.view
	});
	this.view.fit(nyc.ol.Basemap.EXTENT, this.map.getSize());
};

nyc.ol.Basemap.prototype = {
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
	 * @member {ol.layer.Tile}
	 */
	base: null,
	/**
	 * @private
	 * @member {Object<string, ol.layer.Tile>}
	 */
	labels: null,
	/**
	 * @private
	 * @member {Object<string, ol.layer.Tile>}
	 */
	photos: null,
	/**
	 * @private
	 * @member {number}
	 */
	latestPhoto: null,
	/** 
	 * @desc Add a layer to the map
	 * @public
	 * @method	
	 * @param layer {ol.layer.Base} The layer to add to the map
	 */
	addLayer: function(layer){
		this.map.addLayer(layer);
	},	
	/** 
	 * @desc Remove a layer to the map
	 * @public
	 * @method	
	 * @param layer {ol.layer.Base} The layer to remove from the map
	 */
	removeLayer: function(layer){
		this.map.removeLayer(layer);
	},	
	/** 
	 * @desc Returns the map view
	 * @public
	 * @method	
	 * @return {ol.Map}
	 */
	getOlMap: function(){
		return this.map;
	},
	/** 
	 * @desc Returns the map view
	 * @public
	 * @method	
	 * @return {ol.View}
	 */
	getView: function(){
		return this.view;
	},
	/** 
	 * @desc Returns the HTML element containing the map
	 * @public
	 * @method	
	 * @return {Element}
	 */
	getTarget: function(){
		return this.map.getTarget();
	},
	/** 
	 * @desc Show photo layer
	 * @public
	 * @method	
	 * @param layer {number} The photo year to show
	 */
	showPhoto: function(year){
		year = year || this.latestPhoto;
		this.hidePhoto();
		this.photos[year + ''].setVisible(true);
		this.showLabels('photo');
	},
	/** 
	 * @desc Show photo layer
	 * @public
	 * @method	
	 * @param labelType {string} The lable type to shoe
	 */
	showLabels: function(labelType){
		this.labels.base.setVisible(labelType == 'base');
		this.labels.photo.setVisible(labelType == 'photo');
	},
	/** 
	 * @desc Hide photo layer
	 * @public
	 * @method	
	 */
	hidePhoto: function(){
		this.base.setVisible(true)
		this.showLabels('base');
		for (var year in this.photos){
			this.photos[year].setVisible(false);
		}
	}
};

/**
 * @desc The URL of the New York City base map tiles 
 * @private
 * @const
 * @type {string}
 */
nyc.ol.Basemap.BASE_URL = '/geoserver/gwc/service/tms/1.0.0/basemap@EPSG%3A900913@png8/{z}/{x}/{-y}.png8';

/**
 * @desc The URLs of the New York City aerial imagery map tiles 
 * @private
 * @const
 * @type {Object<string, string>}
 */
nyc.ol.Basemap.PHOTO_URLS = {
	'2012': '/geoserver/gwc/service/tms/1.0.0/2012@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
	'2014': '/geoserver/gwc/service/tms/1.0.0/2014@EPSG%3A900913@png8/{z}/{x}/{-y}.png8'
};

/**
 * @desc The URLs of the New York City base map label tiles 
 * @private
 * @const
 * @type {Object<string, string>}
 */
nyc.ol.Basemap.LABEL_URLS = {
	base: '/geoserver/gwc/service/tms/1.0.0/label@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
	photo: '/geoserver/gwc/service/tms/1.0.0/label-lt@EPSG%3A900913@png8/{z}/{x}/{-y}.png8'
};

/**
 * @public 
 * @const
 * @type {ol.Extent}
 */
nyc.ol.Basemap.UNIVERSE_EXTENT = [-8453323, 4774561, -7983695, 5165920];

/**
 * @public 
 * @const
 * @type {ol.Extent}
 */
nyc.ol.Basemap.EXTENT = [-8266522, 4937867,-8203781, 5000276];

/**
 * @const
 * @type {ol.Coordinate}
 */
nyc.ol.Basemap.CENTER = [-8235252, 4969073];

/**
 * @private
 * @const
 * @type {ol.Extent}
 */
nyc.ol.Basemap.LABEL_EXTENT = [-8268000, 4870900, -8005000, 5055500];

/**
 * @private
 * @const
 * @type {ol.Extent}
 */
nyc.ol.Basemap.PHOTO_EXTENT = [-8268357, 4937238, -8203099, 5001716];

/**
 * @desc The URLs of the New York City base map label tiles 
 * @public
 * @typedef {Object}
 * @property {Element} target The target HTML element for creation of the map
 * @property {nyc.ol.View} =view The view for the map 
 */
nyc.ol.Basemap.Options;

