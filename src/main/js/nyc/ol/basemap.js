var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc Class that provides an ol.Map with base layers and labels
 * @public
 * @class
 * @extends {ol.Map}
 * @mixes nyc.Basemap
 * @constructor
 * @param {Object} options Constructor options 
 * @param {number} [preload=0] Preload option for base layer 
 * @see http://openlayers.org/en/latest/apidoc/ol.Map.html
 */
nyc.ol.Basemap = function(options, preload){
	var me = this, layers = [], viewProvided = options.view;
	
	/**
	 * @private
	 * @member {number}
	 */
	me.latestPhoto = 0;

	/**
	 * @private
	 * @member {ol.layer.Tile}
	 */
	me.base = new ol.layer.Tile({
		extent: nyc.ol.Basemap.UNIVERSE_EXTENT,
		source: new ol.source.XYZ({url: nyc.ol.Basemap.BASE_URL}),
		preload: preload || 0
	});
	layers.push(me.base);

	/**
	 * @private
	 * @member {Object<string, ol.layer.Tile>}
	 */
	me.labels = {};
	for (var labelType in nyc.ol.Basemap.LABEL_URLS) {
		me.labels[labelType] = new ol.layer.Tile({
			extent: nyc.ol.Basemap.LABEL_EXTENT,
			source: new ol.source.XYZ({url: nyc.ol.Basemap.LABEL_URLS[labelType]}),
			zIndex: 1000,
			visible: labelType == 'base'
		});		
		layers.push(me.labels[labelType]);
	}
	
	/**
	 * @private
	 * @member {Object<string, ol.layer.Tile>}
	 */
	me.photos = {};
	for (var year in nyc.ol.Basemap.PHOTO_URLS) {
		var photo = new ol.layer.Tile({
			extent: nyc.ol.Basemap.PHOTO_EXTENT,
			source: new ol.source.XYZ({url: nyc.ol.Basemap.PHOTO_URLS[year]}),
			visible: false
		});		
		if ((year * 1) > me.latestPhoto){
			me.latestPhoto = year;
		}
		photo.set('name', year);
		layers.push(photo);
		photo.on('change:visible', $.proxy(me.photoChange, me));
		me.photos[year] = photo;
	}
	
	options.view = options.view || new ol.View({
		center: nyc.ol.Basemap.CENTER,
		minZoom: 8,
		maxZoom: 21,
		zoom: 8,
		constrainRotation: 1
	});
	options.layers = layers.concat(options.layers || []);
	
	ol.Map.call(me, options);
	
	if (!viewProvided){
		me.getView().fit(nyc.ol.Basemap.EXTENT, me.getSize());		
	}
	
	//hack fix for misbehaving iphone 
	if (nyc.util.isIos()){
		$(window).resize(function(){
			setInterval(function(){
				me.updateSize();
			}, 400);
		});		
	}

};

ol.inherits(nyc.ol.Basemap, ol.Map);
nyc.inherits(nyc.ol.Basemap, nyc.Basemap);

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
 * @desc Show the specified label layer
 * @public
 * @method	
 * @param labelType {nyc.Basemap.BaseLayers} The label type to show
 */
nyc.ol.Basemap.prototype.showLabels = function(labelType){
	this.labels.base.setVisible(labelType == nyc.Basemap.LabelType.BASE);
	this.labels.photo.setVisible(labelType == nyc.Basemap.LabelType.PHOTO);
};

/** 
 * @desc Hide photo layer
 * @public
 * @method	
 */
nyc.ol.Basemap.prototype.hidePhoto = function(){
	this.base.setVisible(true);
	this.showLabels(nyc.Basemap.LabelType.BASE);
	for (var year in this.photos){
		this.photos[year].setVisible(false);
	}
};

/** 
 * @desc Returns the base layers
 * @public
 * @method
 * @return {nyc.Basemap.BaseLayers}
 */
nyc.ol.Basemap.prototype.getBaseLayers = function(){
	return {
		base: this.base,
		labels: this.labels,
		photos: this.photos
	};
};

/** 
 * @private
 * @method
 */
nyc.ol.Basemap.prototype.photoChange = function(){
	for (var photo in this.photos){
		if (this.photos[photo].getVisible()){
			this.showLabels(nyc.Basemap.LabelType.PHOTO);
			return;
		}
	}
	this.showLabels(nyc.Basemap.LabelType.BASE);
};

/**
 * @desc The URL of the New York City base map tiles 
 * @private
 * @const
 * @type {string}
 */
nyc.ol.Basemap.BASE_URL = 'https://maps{1-4}.nyc.gov/tms/1.0.0/carto/basemap/{z}/{x}/{-y}.jpg';

/**
 * @desc The URLs of the New York City aerial imagery map tiles 
 * @private
 * @const
 * @type {Object<string, string>}
 */
nyc.ol.Basemap.PHOTO_URLS = {
	'1924': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/1924/{z}/{x}/{-y}.png8',
	'1951': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/1951/{z}/{x}/{-y}.png8',
	'1996': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/1996/{z}/{x}/{-y}.png8',
	'2001-2': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2001-2/{z}/{x}/{-y}.png8',
	'2004': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2004/{z}/{x}/{-y}.png8',
	'2006': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2006/{z}/{x}/{-y}.png8',
	'2008': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2008/{z}/{x}/{-y}.png8',
	'2010': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2010/{z}/{x}/{-y}.png8',
	'2012': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2012/{z}/{x}/{-y}.png8',
	'2014': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2014/{z}/{x}/{-y}.png8',
	'2016': 'https://maps{1-4}.nyc.gov/tms/1.0.0/photo/2016/{z}/{x}/{-y}.png8'
};

/**
 * @desc The URLs of the New York City base map label tiles 
 * @private
 * @const
 * @type {Object<string, string>}
 */
nyc.ol.Basemap.LABEL_URLS = {
	base: 'https://maps{1-4}.nyc.gov/tms/1.0.0/carto/label/{z}/{x}/{-y}.png8',
	photo: 'https://maps{1-4}.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8'
};

/**
 * @private
 * @const
 * @type {ol.Extent}
 */
nyc.ol.Basemap.UNIVERSE_EXTENT = [-8453323, 4774561, -7983695, 5165920];

/**
 * @desc The bounds of New York City
 * @public 
 * @const
 * @type {ol.Extent}
 */
nyc.ol.Basemap.EXTENT = [-8266522, 4937867, -8203781, 5000276];

/**
 * @desc The center of New York City
 * @public 
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

