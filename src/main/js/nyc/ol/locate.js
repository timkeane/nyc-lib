var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * nyc.ol.Locate an object for geocoding and geolocating
 * @public
 * @class
 * @constructor
 * @implements {nyc.Locate}
 * @param {nyc.Geocoder} geocoder A geocoder implementation
 * @param {ol.proj.Projection=} projection The projection for output geometries
 * @param {ol.Extent=} extentLimit Geolocation coordinates outside of this bounding box are ignored  
 *
 */
nyc.ol.Locate = function(geocoder, projection, extentLimit){
	var me = this;
	me.projection = projection;
	me.extentLimit = extentLimit;
	geocoder.on(nyc.Locate.LocateEventType.GEOCODE, function(data){
		me.proxyEvent(nyc.Locate.LocateEventType.GEOCODE, data);
	});
	geocoder.on(nyc.Locate.LocateEventType.AMBIGUOUS, function(data){
		me.proxyEvent(nyc.Locate.LocateEventType.AMBIGUOUS, data);
	});
	geocoder.on(nyc.Locate.LocateEventType.ERROR, function(data){
		me.proxyEvent(nyc.Locate.LocateEventType.ERROR, data);
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
			me.trigger(nyc.Locate.LocateEventType.GEOLOCATION, {
				coordinates: p,
				heading: me.geolocation.getHeading(),
				accuracy: me.geolocation.getAccuracy() / me.metersPerUnit(), 
				type: nyc.Locate.LocateResultType.GEOLOCATION,
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
	 * @member {ol.proj.Projection}
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
	 * @desc Geocode an input string and trigger an event of nyc.Locate.LocateEventType with nyc.Locate.LocateResult or nyc.LocateAmbiguoud data
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
	 * @param {(nyc.Locate.LocateResult|nyc.Locate.LocateAmbiguous)} data
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

