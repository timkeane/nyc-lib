var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc A class for geocoding and geolocating
 * @public
 * @class
 * @implements {nyc.Locate}
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.Geocoder} geocoder A geocoder implementation
 * @param {string=} projection The EPSG code of the projection for output geometries (i.e. EPSG:2263)
 * @param {ol.Extent=} extentLimit Geolocation coordinates outside of this bounding box are ignored  
 * @fires nyc.Locate#geocode
 * @fires nyc.Locate#ambiguous
 * @fires nyc.Locate#geolocation
 * @fires nyc.Locate#error
 *
 */
nyc.ol.Locate = function(geocoder, projection, extentLimit){
	var me = this;
	me.projection = projection;
	me.extentLimit = extentLimit;
	geocoder.on(nyc.Locate.EventType.GEOCODE, function(data){
		me.proxyEvent(nyc.Locate.EventType.GEOCODE, data);
	});
	geocoder.on(nyc.Locate.EventType.AMBIGUOUS, function(data){
		me.proxyEvent(nyc.Locate.EventType.AMBIGUOUS, data);
	});
	geocoder.on(nyc.Locate.EventType.ERROR, function(data){
		me.proxyEvent(nyc.Locate.EventType.ERROR, data);
	});
	me.geocoder = geocoder;
	me.geolocation = new ol.Geolocation({
		trackingOptions: {
			maximumAge: 10000,
			enableHighAccuracy: true,
			timeout: 600000
		}
	});
	me.geolocation.on('change', function() {
		var p = me.geolocation.getPosition(),
			name = ol.coordinate.toStringHDMS(p);
		p = me.project(p);
		if (me.locating) {
			me.track(false);
			me.locating = false;
		}
		if (me.withinLimit(p)){ 
			me.trigger(nyc.Locate.EventType.GEOLOCATION, {
				coordinates: p,
				heading: me.geolocation.getHeading(),
				accuracy: me.geolocation.getAccuracy() / me.metersPerUnit(), 
				type: nyc.Locate.ResultType.GEOLOCATION,
				name: name
			});
		}
	});
	me.geolocation.on('error', function(error) {
		console.error(error.message, error);
	});
};

nyc.ol.Locate.prototype = {
	/** 
	 * @private 
	 * @member {boolean}
	 */
	locating: false,
	/** 
	 * @private 
	 * @member {string}
	 */
	projection: null,
	/** 
	 * @private 
	 * @member {ol.Extent}
	 */
	extentLimit: null,
	/**
	 * @desc Locate once using device geolocation
	 * @public
	 * @method
	 */
	locate: function(){
		this.locating = true;
		this.geolocation.setTracking(true);
	},
	/**
	 * @desc Track using device geolocation
	 * @public
	 * @method
	 * @param {boolean} track Track or not
	 */
	track: function(track){
		this.geolocation.setTracking(track);
	},
	/**
	 * @desc Geocode an input string representing a location
	 * @public
	 * @method
	 * @param {string} input The value to geocode
	 */
	search: function(input){
		this.geocoder.search(input);
	},
	/** 
	 * @private 
	 * @method
	 * @param {string} evt
	 * @param {(nyc.Locate.Result|nyc.Locate.Ambiguous)} data
	 */
	proxyEvent: function(evt, data){
		this.trigger(evt, data);
	},
	/**
	 * @private
	 * @method
	 * @return {number}
	 */
	metersPerUnit: function(){
		if (this.projection){
			return ol.proj.get(this.projection).getMetersPerUnit() || 1;
		}
		return 1;
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Coordinate} coordinates 
	 * @return {ol.Coordinate}
	 */
	project: function(coordinates){
		if (this.projection){
			return proj4('EPSG:4326', ol.proj.get(this.projection).getCode(), coordinates);
		}
		return coordinates;
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Coordinate} coordinates 
	 * @return {boolean} 
	 */
	withinLimit: function(coordinates){
		return this.extentLimit ? ol.extent.containsCoordinate(this.extentLimit, coordinates) : true;
	}
};

nyc.inherits(nyc.ol.Locate, nyc.EventHandling);

/**
 * @desc The recommended zoom level to use when centering a map on a the result of a call to a locate method  
 * @public
 * @const
 * @type {number}
 */
nyc.ol.Locate.ZOOM_LEVEL = 7;
