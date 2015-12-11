var nyc = nyc || {};

/**
 * An interface for geocoding and geolocating
 * @export
 * @interface
 */
nyc.Locate = function(){};

nyc.Locate.prototype = {
	/**
	 * Locate once using device geolocation
	 * @export
	 * @method
	 */
	locate: function(){},
	/**
	 * Track using device geolocation
	 * @export
	 * @method
	 * @param {boolean} track
	 */
	track: function(track){},
	/**
	 * Geocode an input string and trigger an event of nyc.Locate.LocateEventType with nyc.Locate.LocateResult or nyc.LocateAmbiguoud data
	 * @export
	 * @method
	 * @param {string} input
	 */
	search: function(input){}
};

/**
 * Enum for locate event type
 * @export
 * @enum {string}
 */
nyc.Locate.LocateEventType = {
	GEOCODE: 'geocode',
	GEOLOCATION: 'geolocation',
	AMBIGUOUS: 'ambiguous',
	ERROR: 'error'
};

/**
 * Enum for locate result type
 * @export
 * @enum {string}
 */
nyc.Locate.LocateResultType = {
	GEOCODE: 'geocode',
	GEOLOCATION: 'geolocation'
};

/**
 * Object type to hold data about a successful result of a geocoder search or device geolocation
 * @export
 * @typedef {Object}
 * @property {string} name
 * @property {(Array<number>|undefined)} coordinates
 * @property {(Object|undefined)} geoJsonGeometry
 * @property {number} accuracy
 * @property {nyc.Locate.LocateResultType} type
 * @property {(boolean|undefined)} zip
 * @property {(Object|undefined)} data
 */
nyc.Locate.LocateResult;

/**
 * Object type to hold data about possible locations resulting from a geocoder search
 * @export
 * @typedef {Object}
 * @property {string} input
 * @property {Array<nyc.Locate.LocateResult>} possible
 */
nyc.Locate.LocateAmbiguous;
