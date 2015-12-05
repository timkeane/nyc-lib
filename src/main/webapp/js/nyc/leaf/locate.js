/** 
 * @export 
 * @namespace
 */
window.nyc = window.nyc || {};
/** 
 * @export 
 * @namespace
 */
nyc.leaf = nyc.leaf || {};

/**
 * @export
 * @class
 * @classdesc Class for providing geocoding and device geolocation functionality
 * @constructor
 * @implements {nyc.Locate}
 * @extends {nyc.EventHandling}
 * @param {L.Map} map
 * @param {nyc.Geocoder} controls
 * @param {L.LatLngBounds} extentLimit
 */
nyc.leaf.Locate = function(map, geocoder, extentLimit){	
	var me = this;	
	me.map = map;
	me.geocoder = geocoder;
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
	map.on('locationfound', $.proxy(me.geolocated, me));
	map.on('locationerror', $.proxy(me.geoError, me));
};
	
nyc.leaf.Locate.prototype = {
	/**
	 * @private
	 * @member {L.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {nyc.Geocoder}
	 */
	geocoder: null,
	/**
	 * @private
	 * @member {L.LatLngBounds}
	 */
	extentLimit: null,
	/**
	 * @private
	 * @member {boolean}
	 */
	isGeolocateAllowed: true,
	/**
	 * Locate once using device geolocation
	 * @export
	 * @method
	 */
	locate: function(){
		if (this.isGeolocateAllowed){
			this.map.locate({
				enableHighAccuracy: true,
				setView: false, 
				maxZoom: nyc.leaf.Locate.ZOOM_LEVEL
			});
		}else{
			this.trigger(nyc.Locate.LocateEventType.ERROR, 'You have disabled location services for this page. To use this feature you must enable location services.');
		}
	},
	/**
	 * Geocode an input string and trigger an event of nyc.Locate.LocateEventType with nyc.Locate.LocateResult or nyc.LocateAmbiguoud data
	 * @export
	 * @method
	 * @param {string} input
	 */
	search: function(input){
		this.geocoder.search(input);
	},
	/**
	 * @private
	 * @method
	 * @param {Object} evt
	 * @param {Object} data
	 */
	proxyEvent: function(evt, data){
		this.trigger(evt, data);
	},
	/**
	 * @private
	 * @method
	 * @param {Object} e
	 */
	geoError: function(e) {
		if (e.code == 1) this.isGeolocateAllowed = false;
	},
	/**
	 * @private
	 * @method
	 * @param {Object} e
	 */
	geolocated: function(e) {
	    if (this.extentLimit.contains(e.latlng)){
			this.trigger(nyc.Locate.LocateEventType.GEOLOCATION, {
				 name: this.dmsString(e.latlng),
				 coordinates: [e.latlng.lng, e.latlng.lat],
				 accuracy: e.accuracy,
				 type: nyc.Locate.LocateResultType.GEOLOCATION
			});
	    }				
	},
	/** 
	 * @private 
	 * @method
	 * @return {string}
	 */
	dmsString: function(latLng){
		var lat = latLng.lat, lng = latLng.lng, 
			dmsLat = this.dms(Math.abs(lat)), dmsLng = this.dms(Math.abs(lng));
		dmsLat += lat < 0 ? " S " : " N ";
		dmsLng += lng < 0 ? " W" : " E";
		return dmsLat + dmsLng;
	},
	/**
	 * @private 
	 * @method
	 * @param {number} deg
	 * @return {string}
	 */
	dms: function(deg){
	   var d = Math.floor(deg),
	   	minfloat = (deg-d) * 60,
	   	m = Math.floor(minfloat),
	   	secfloat = (minfloat-m) * 60,
	   	s = secfloat.toFixed(0);
	   return "" + d + "° " + m + "' " + s + '"';
	}
};

nyc.inherits(nyc.leaf.Locate, nyc.EventHandling);

/**
 * @export
 * @const
 * @type {number}
 */
nyc.leaf.Locate.ZOOM_LEVEL = 16;