var nyc = nyc || {};

/**
 * @desc An interface for geocoding and geolocating
 * @public
 * @interface
 */
nyc.Locate = function(){};

nyc.Locate.prototype = {
	/**
	 * @desc Locate once using device geolocation
	 * @public
	 * @abstract
	 * @method
	 */
	locate: function(){
		throw 'Not implemented';
	},
	/**
	 * @desc Track using device geolocation
	 * @public
	 * @abstract
	 * @method
	 * @param {boolean} track Track or not
	 */
	track: function(track){
		throw 'Not implemented';		
	},
	/**
	 * @desc Geocode an input string and trigger an event of nyc.Locate.LocateEventType with nyc.Locate.LocateResult or nyc.LocateAmbiguoud data
	 * @public
	 * @abstract
	 * @method
	 * @param {string} input An input string describing a location to geocode
	 */
	search: function(input){
		throw 'Not implemented';		
	}
};

/**
 * @desc Enumeration for locate event type
 * @public
 * @enum {string}
 */
nyc.Locate.LocateEventType = {
	/**
	 * @desc The geocode event type
	 */
	GEOCODE: 'geocode',
	/**
	 * @desc The geolocation event type
	 */
	GEOLOCATION: 'geolocation',
	/**
	 * @desc The ambiguous event type
	 */
	AMBIGUOUS: 'ambiguous',
	/**
	 * @desc The ambiguous event type
	 */
	ERROR: 'ambiguous'
};

/**
 * @desc Enumeration for locate result type
 * @public
 * @enum {string}
 */
nyc.Locate.LocateResultType = {
	/**
	 * @desc The geocode result type
	 */
	GEOCODE: 'geocode',
	/**
	 * @desc The geolocation result type
	 */
	GEOLOCATION: 'geolocation'
};

/**
 * @desc Object type to hold data about a successful result of a geocoder search or device geolocation
 * @public
 * @typedef {Object}
 * @property {string} name The formatted name of the geocoded location
 * @property {(Array<number>|undefined)} coordinates The geocoded location coordinates
 * @property {number} accuracy The accuracy of the geocoded location in meters of units of a specified projection
 * @property {nyc.Locate.LocateResultType} type They type of result
 * @property {boolean=} zip Is this the geocoded location a ZIP Code center point
 * @property {Object=} geoJsonGeometry A geoJSON representation of the geocoded location coordinates
 * @property {Object=} data Additional properties provided by the geocoder
 */
nyc.Locate.LocateResult;

/**
 * @desc Object type to hold data about possible locations resulting from a geocoder search
 * @public
 * @typedef {Object}
 * @property {string} input The input string on which the geocoding attempt was made
 * @property {Array<nyc.Locate.LocateResult>} possible An array of possible results to the request
 */
nyc.Locate.LocateAmbiguous;

/**
 * @desc The result of a search request
 * @event nyc.Locate#geocode
 * @type {nyc.Locate.LocateResultType}
 */

/**
 * @desc The result of a locate request
 * @event nyc.Locate#geolocation
 * @type {nyc.Locate.LocateResultType}
 */

/**
 * @desc The result of an inconclusive search request
 * @event nyc.Locate#ambiguous
 * @type {nyc.Locate.LocateAmbiguous}
 */

/**
 * @desc The error object from a locate request error
 * @event nyc.Locate#error
 * @type {Object}
 */
