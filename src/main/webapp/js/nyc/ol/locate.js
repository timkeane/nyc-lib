/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.ol = nyc.ol || {};

/**
 * nyc.ol.Locate an object for geocoding and geolocating
 * @export
 * @constructor
 * @implements {nyc.Locate}
 * @param {nyc.Geocoder} geocoder
 * @param {ol.proj.ProjectionLike|ol.proj.Projection=} projection
 * @param {ol.extent=} extentLimit
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
	/** @private */
	locating: false,
	/** @private */
	projection: null,
	/** @private */
	extentLimit: null,
	/** @private */
	proxyEvent: function(evt, data){
		this.trigger(evt, data);
	},
	/**
	 * @private
	 * @return {number} number of meters per unit of projection
	 */
	metersPerUnit: function(){
		if (this.projection){
			return ol.proj.get(this.projection).getMetersPerUnit() || 1;
		}
		return 1;
	},
	/**
	 * Project coordinates
	 * @private
	 * @param {ol.Coordinate} coordinates 
	 * @return {ol.Coordinate} projected coordinates
	 */
	project: function(coordinates){
		if (this.projection){
			return proj4('EPSG:4326', ol.proj.get(this.projection).getCode(), coordinates);
		}
		return coordinates;
	},
	/**
	 * Check that location is within extentLimit
	 * @private
	 * @param {ol.Coordinate} coordinates 
	 * @return {boolean} True if the location is within extentLimit
	 */
	withinLimit: function(coordinates){
		return this.extentLimit ? ol.extent.containsCoordinate(this.extentLimit, coordinates) : true;
	}
};

/**
 * Locate once using device geolocation
 * @export
 */
nyc.ol.Locate.prototype.locate = function(){
	this.locating = true;
	this.geolocation.setTracking(true);
};

/**
 * Track using device geolocation
 * @export
 * @param {boolean} track
 */
nyc.ol.Locate.prototype.track = function(track){
	this.geolocation.setTracking(track);
};

/**
 * Geocode an input string and trigger an event of nyc.Locate.LocateEventType with nyc.Locate.LocateResult or nyc.LocateAmbiguoud data
 * @export
 * @param {string} input
 */
nyc.ol.Locate.prototype.search = function(input){
	this.geocoder.search(input);
};

nyc.inherits(nyc.ol.Locate, nyc.EventHandling);

