var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc Class that provides an ol.Map with base layers and labels
 * @public
 * @class
 * @extends {ol.Map}
 * @constructor
 * @param {Object} option Constructor options 
 * @param {number} [preload=0] Preload option for base layer 
 * @see http://openlayers.org/en/latest/apidoc/ol.Map.html
 */
nyc.ol.Basemap = function(options, preload){
	var layers = [], viewProvided = options.view;
	
	/**
	 * @private
	 * @member {number}
	 */
	this.latestPhoto = 0;

	/**
	 * @private
	 * @member {ol.layer.Tile}
	 */
	this.base = new ol.layer.Tile({
		extent: nyc.ol.Basemap.UNIVERSE_EXTENT,
		source: new ol.source.XYZ({url: nyc.ol.Basemap.BASE_URL}),
		preload: preload || 0
	});
	layers.push(this.base);

	/**
	 * @private
	 * @member {Object<string, ol.layer.Tile>}
	 */
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
	
	/**
	 * @private
	 * @member {Object<string, ol.layer.Tile>}
	 */
	this.photos = {};
	for (var year in nyc.ol.Basemap.PHOTO_URLS) {
		var photo = new ol.layer.Tile({
			extent: nyc.ol.Basemap.PHOTO_EXTENT,
			source: new ol.source.XYZ({url: nyc.ol.Basemap.PHOTO_URLS[year]}),
			visible: false
		});		
		if ((year * 1) > this.latestPhoto){
			this.latestPhoto = year;
		}
		photo.set('name', year);
		layers.push(photo);
		photo.on('change:visible', $.proxy(this.photoChange, this));
		this.photos[year] = photo;
	}
	
	options.view = options.view || new ol.View({
		center: nyc.ol.Basemap.CENTER,
		minZoom: 8,
		zoom: 8
	});
	options.layers = layers.concat(options.layers || []);
	
	ol.Map.call(this, options);
	
	if (!viewProvided){
		this.getView().fit(nyc.ol.Basemap.EXTENT, this.getSize());		
	}
};

ol.inherits(nyc.ol.Basemap, ol.Map);

/** 
 * @desc Show photo layer
 * @public
 * @method	
 * @param layer {number} The photo year to show
 */
nyc.ol.Basemap.prototype.showPhoto = function(year){
	year = year || this.latestPhoto;
	this.hidePhoto();
	this.photos[year + ''].setVisible(true);
	this.showLabels('photo');
};

/** 
 * @desc Show photo layer
 * @public
 * @method	
 * @param labelType {nyc.ol.Basemap.LabelType} The label type to show
 */
nyc.ol.Basemap.prototype.showLabels = function(labelType){
	this.labels.base.setVisible(labelType == nyc.ol.Basemap.LabelType.BASE);
	this.labels.photo.setVisible(labelType == nyc.ol.Basemap.LabelType.PHOTO);
};

/** 
 * @desc Hide photo layer
 * @public
 * @method	
 */
nyc.ol.Basemap.prototype.hidePhoto = function(){
	this.base.setVisible(true)
	this.showLabels(nyc.ol.Basemap.LabelType.BASE);
	for (var year in this.photos){
		this.photos[year].setVisible(false);
	}
};

/** 
 * @desc Returns the base layers
 * @public
 * @method
 * @return {nyc.ol.Basemap.BaseLayers}
 */
nyc.ol.Basemap.prototype.getBaseLayers = function(){
	return {
		base: this.base,
		labels: this.labels,
		photos: this.photos
	};
};

/** 
 * @desc Returns the base layers
 * @public
 * @method
 * @return {nyc.ol.Basemap.BaseLayers}
 */
nyc.ol.Basemap.prototype.sortedPhotos = function(){
	var sorted = [];
	for (var photo in this.photos){
		sorted.push(this.photos[photo]);
	}
	//sort on the first 4 puts 2001-2 in the proper place
	return sorted.sort(function(a, b){
		return a.get('name').substr(0, 4) - b.get('name').substr(0, 4);
	});
};

/** 
 * @private
 * @method
 */
nyc.ol.Basemap.prototype.photoChange = function(){
	for (var photo in this.photos){
		if (this.photos[photo].getVisible()){
			this.showLabels(nyc.ol.Basemap.LabelType.PHOTO);
			return;
		}
	}
	this.showLabels(nyc.ol.Basemap.LabelType.BASE);
};

/**
 * @desc The URL of the New York City base map tiles 
 * @private
 * @const
 * @type {string}
 */
nyc.ol.Basemap.BASE_URL = '/geoserver/gwc/service/tms/1.0.0/basemap@EPSG%3A900913@jpeg/{z}/{x}/{-y}.jpg';

/**
 * @desc The URLs of the New York City aerial imagery map tiles 
 * @private
 * @const
 * @type {Object<string, string>}
 */
nyc.ol.Basemap.PHOTO_URLS = {
	'1924': '/geoserver/gwc/service/tms/1.0.0/1924@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
	'1951': '/geoserver/gwc/service/tms/1.0.0/1951@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
	'1996': '/geoserver/gwc/service/tms/1.0.0/1996@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
	'2001-2': '/geoserver/gwc/service/tms/1.0.0/2001-2@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
	'2004': '/geoserver/gwc/service/tms/1.0.0/2004@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
	'2006': '/geoserver/gwc/service/tms/1.0.0/2006@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
	'2008': '/geoserver/gwc/service/tms/1.0.0/2008@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
	'2010': '/geoserver/gwc/service/tms/1.0.0/2010@EPSG%3A900913@png8/{z}/{x}/{-y}.png8',
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
 * @desc Enumerator for label types
 * @public
 * @enum {string}
 */
nyc.ol.Basemap.LabelType = {
	/**
	 * @desc Label type for base layer
	 */
	BASE: 'base',
	/**
	 * @desc Label type for photo layer
	 */
	PHOTO: 'photo'
};

/**
 * @desc Object type to hold base layers
 * @public
 * @typedef {Object}
 * @property {ol.layer.Tile} base The base layer
 * @property {<string, ol.layer.Tile>} labels The label layers 
 * @property {<number, ol.layer.Tile>} photos The photo layers 
 */
nyc.ol.Basemap.BaseLayers;
