var nyc = nyc || {};
nyc.leaf = nyc.leaf || {};

/**
 * @desc Class that provides an L.Map with base layers and labels
 * @public
 * @class
 * @extends {L.Map}
 * @mixes nyc.Basemap
 * @param {nyc.Basemap.Options} options Constructor options
 * @constructor
 * @see http://leafletjs.com/
 */
nyc.leaf.Basemap = function(options){

	nyc.Basemap.call(this, options);

	this.storage = new nyc.leaf.storage.Local();

	var map = L.map($(options.target).get(0));

	map.base = L.tileLayer(nyc.leaf.Basemap.BASE_URL, {
		minNativeZoom: 8,
		maxNativeZoom: 21,
		subdomains: '1234',
		tms: true,
		bounds: nyc.leaf.Basemap.UNIVERSE_EXTENT,
		zIndex: 0
	});
	map.base.name = 'base';
	map.addLayer(map.base);

	map.labels = {};
	for (var labelType in nyc.leaf.Basemap.LABEL_URLS) {
		map.labels[labelType] = L.tileLayer(nyc.leaf.Basemap.LABEL_URLS[labelType], {
			minNativeZoom: 8,
			maxNativeZoom: 21,
			subdomains: '1234',
			tms: true,
			bounds: nyc.leaf.Basemap.LABEL_EXTENT,
			zIndex: 1000
		});
		map.labels[labelType].name = labelType;
		if (labelType == 'base'){
			map.addLayer(map.labels[labelType]);
		}
	}

	map.photos = {};
	for (var year in nyc.leaf.Basemap.PHOTO_URLS) {
		var photo = L.tileLayer(nyc.leaf.Basemap.PHOTO_URLS[year], {
			minNativeZoom: 8,
			maxNativeZoom: 21,
			subdomains: '1234',
			tms: true,
			bounds: nyc.leaf.Basemap.PHOTO_EXTENT,
			zIndex: 1
		});
		if ((year * 1) > map.latestPhoto){
			map.latestPhoto = year;
		}
		photo.name = year;
		map.photos[year] = photo;
	}
	map.fitBounds(nyc.leaf.Basemap.EXTENT);
	return map;
};

nyc.leaf.Basemap.prototype = {
	/**
	 * @public
	 * @member {L.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {L.TileLayer}
	 */
	base: null,
	/**
	 * @private
	 * @member {Object<string, L.TileLayer>}
	 */
	labels: null,
	/**
	 * @private
	 * @member {Object<string, L.TileLayer>}
	 */
	photos: null,
	/**
	 * @private
	 * @member {number}
	 */
	latestPhoto: 0,
	/**
	 * @private
	 * @member {nyc.leaf.storage.Local}
	 */
	storage: null,
	/**
	 * @desc Get the storage used for laoding and saving data
	 * @public
	 * @override
	 * @method
	 * @return {nyc.leaf.storage.Local} srorage
	 */
	getStorage: function(year){
		return this.storage;
	},
	/**
	 * @desc Show photo layer
	 * @public
	 * @override
	 * @method
	 * @param layer {number} The photo year to show
	 */
	showPhoto: function(year){
		year = year || this.latestPhoto;
		this.hidePhoto();
		this.addLayer(this.photos[year + '']);
		this.showLabels('photo');
	},
	/**
	 * @desc Show photo layer
	 * @public
	 * @override
	 * @method
	 * @param labelType {nyc.Basemap.LabelType} The label type to show
	 */
	showLabels: function(labelType){
		this[labelType == nyc.Basemap.LabelType.BASE ? 'addLayer' : 'removeLayer'](this.labels.base);
		this[labelType == nyc.Basemap.LabelType.PHOTO ? 'addLayer' : 'removeLayer'](this.labels.photo);
	},
	/**
	 * @desc Hide photo layer
	 * @public
	 * @override
	 * @method
	 */
	hidePhoto: function(){
		this.showLabels(nyc.Basemap.LabelType.BASE);
		for (var year in this.photos){
			if (this.hasLayer(this.photos[year])){
				this.removeLayer(this.photos[year]);
			}
		}
	},
	/**
	 * @desc Returns the base layers
	 * @public
	 * @override
	 * @method
	 * @return {nyc.Basemap.BaseLayers}
	 */
	getBaseLayers: function(){
		return {
			base: this.base,
			labels: this.labels,
			photos: this.photos
		};
	},
	/**
	 * @private
	 * @method
	 */
	photoChange: function(){
		for (var photo in this.photos){
			if (this.hasLayer(this.photos[photo])){
				this.showLabels(nyc.Basemap.LabelType.PHOTO);
				return;
			}
		}
		this.showLabels(nyc.Basemap.LabelType.BASE);
	}
};

nyc.inherits(nyc.leaf.Basemap, nyc.Basemap);
nyc.inherits(L.Map, nyc.leaf.Basemap);

/**
 * @desc The URL of the New York City base map tiles
 * @private
 * @const
 * @type {string}
 */
nyc.leaf.Basemap.BASE_URL = 'https://maps{s}.nyc.gov/tms/1.0.0/carto/basemap/{z}/{x}/{y}.jpg';

/**
 * @desc The URLs of the New York City aerial imagery map tiles
 * @private
 * @const
 * @type {Object<string, string>}
 */
nyc.leaf.Basemap.PHOTO_URLS = {
	'1924': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/1924/{z}/{x}/{y}.png8',
	'1951': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/1951/{z}/{x}/{y}.png8',
	'1996': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/1996/{z}/{x}/{y}.png8',
	'2001-2': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/2001-2/{z}/{x}/{y}.png8',
	'2004': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/2004/{z}/{x}/{y}.png8',
	'2006': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/2006/{z}/{x}/{y}.png8',
	'2008': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/2008/{z}/{x}/{y}.png8',
	'2010': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/2010/{z}/{x}/{y}.png8',
	'2012': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/2012/{z}/{x}/{y}.png8',
	'2014': 'https://maps{s}.nyc.gov/tms/1.0.0/photo/2014/{z}/{x}/{y}.png8'
};

/**
 * @desc The URLs of the New York City base map label tiles
 * @private
 * @const
 * @type {Object<string, string>}
 */
nyc.leaf.Basemap.LABEL_URLS = {
	base: 'https://maps{s}.nyc.gov/tms/1.0.0/carto/label/{z}/{x}/{y}.png8',
	photo: 'https://maps{s}.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{y}.png8'
};

/**
 * @private
 * @const
 * @type {L.LatLngBounds}
 */
nyc.leaf.Basemap.UNIVERSE_EXTENT = L.latLngBounds([39.3682, -75.9374], [42.0329, -71.7187]);

/**
 * @desc The bounds of New York City
 * @public
 * @const
 * @type {L.LatLngBounds}
 */
nyc.leaf.Basemap.EXTENT = L.latLngBounds([40.4931, -74.2594], [40.9181, -73.6958]);

/**
 * @desc The center of New York City
 * @public
 * @const
 * @type {L.LatLng}
 */
nyc.leaf.Basemap.CENTER = L.latLng([40.7033127, -73.979681]);

/**
 * @private
 * @const
 * @type {L.LatLngBounds}
 */
nyc.leaf.Basemap.LABEL_EXTENT = L.latLngBounds([40.0341, -74.2727], [41.2919, -71.9101]);

/**
 * @private
 * @const
 * @type {L.LatLngBounds}
 */
nyc.leaf.Basemap.PHOTO_EXTENT = L.latLngBounds([40.4888, -74.2759], [40.9279, -73.6896]);
