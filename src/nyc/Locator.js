/**
 * @module nyc/Locator
 */

import EventHandling from 'nyc/EventHandling'

/**
 * @desc An abstract class for geocoding and geolocating
 * @public
 * @abstract
 * @class
 * @extends nyc/EventHandling
 * @fires Locate#geocode
 * @fires Locate#ambiguous
 * @fires Locate#error
 */
class Locator extends EventHandling {
  /**
   * @desc Creates an instance of Locator
   * @access protected
   */
   constructor() {
     super()
   }
   /**
 	 * @desc Geocode an input string representing a location
 	 * @public
 	 * @abstract
 	 * @method
 	 * @param {string} input The value to geocode
 	 */
 	search(input) {
 		throw 'Not Implemented'
 	}
 	/**
 	 * @desc Get a distance for an accuracy enumerator based on the projections
 	 * @public
 	 * @abstract
 	 * @method
 	 * @param {Geocoder.Accuracy} accuracy
 	 * @return {number}
 	 *
 	 */
 	accuracyDistance(accuracy) {
 		throw 'Not Implemented'
 	}
   /**
 	 * @desc Locate once using device geolocation
 	 * @public
 	 * @abstract
 	 * @method
 	 */
 	locate() {
 		throw 'Must be implemented'
 	}
   /**
 	 * @desc Track using device geolocation
 	 * @public
 	 * @abstract
 	 * @method
 	 * @param {boolean} track Track or not
 	 */
 	track() {
 		throw 'Must be implemented'
 	}
   /**
 	 * @desc Geocode an input string representing a location
 	 * @public
 	 * @abstract
 	 * @method
 	 * @param {string} input The value to geocode
 	 */
 	search(input) {
 		throw 'Must be implemented'
 	}
}

/**
 * @desc Enumeration for locate event type
 * @public
 * @enum {string}
 */
 Locator.EventType = {
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
	ERROR: 'error'
}

/**
 * @desc Enumeration for locate result type
 * @public
 * @enum {string}
 */
Locator.ResultType = {
	/**
	 * @desc The geocode result type
	 */
	GEOCODE: 'geocode',
	/**
	 * @desc The geolocation result type
	 */
	GEOLOCATION: 'geolocation'
}

/**
 * @desc Enumeration for Geocoder accuracy
 * @public
 * @enum {number}
 */
Locator.Accuracy = {
	/**
	 * @desc High accuracy
	 */
	HIGH: 0,
	/**
	 * @desc Medium accuracy
	 */
	MEDIUM: 30,
	/**
	 * @desc Low accuracy
	 */
	LOW: 300,
	/**
	 * @desc ZIP Code accuracy
	 */
	ZIP_CODE: 600
}

/**
 * @desc Object type to hold data about a successful result of a geocoder search or device geolocation
 * @public
 * @typedef {Object}
 * @property {string} name The formatted name of the geocoded location
 * @property {(Array<number>|undefined)} coordinates The geocoded location coordinates
 * @property {number} accuracy The accuracy of the geocoded location in meters or units of a specified projection
 * @property {nyc.Locate.ResultType} type They type of result
 * @property {boolean=} zip Is this the geocoded location a ZIP Code center point
 * @property {Object=} geometry A geoJSON representation of the geocoded location coordinates
 * @property {Object=} data Additional properties provided by the geocoder
 */
Locator.Result

/**
 * @desc Object type to hold data about possible locations resulting from a geocoder search
 * @public
 * @typedef {Object}
 * @property {string} input The input string on which the geocoding attempt was made
 * @property {Array<nyc.Locate.Result>} possible An array of possible results to the request
 */
Locator.Ambiguous

/**
 * @desc The result of a search request
 * @event nyc.Locate#geocode
 * @type {nyc.Locate.ResultType}
 */

/**
 * @desc The result of a locate request
 * @event nyc.Locate#geolocation
 * @type {nyc.Locate.ResultType}
 */

/**
 * @desc The result of an inconclusive search request
 * @event nyc.Locate#ambiguous
 * @type {nyc.Locate.Ambiguous}
 */

/**
 * @desc The error object from a locate request error
 * @event nyc.Locate#error
 * @type {Object}
 */

export default Locator
