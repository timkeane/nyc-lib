/**
 * @module nyc/Locator
 */

import proj4 from 'proj4'

import nyc from 'nyc/nyc'
import EventHandling from 'nyc/EventHandling'

/**
 * @desc An abstract class for geocoding and geolocating
 * @public
 * @abstract
 * @class
 * @extends nyc/EventHandling
 * @fires Locator#geocode
 * @fires Locator#ambiguous
 * @fires Locator#geolocation
 * @fires Locator#error
 */
class Locator extends EventHandling {
  /**
   * @desc Creates an instance of Locator
   * @access protected
   * @param {nyc/Locator/Options} options Construction options
   */
   constructor(options) {
     super()
     options = options || {}
     /**
   	 * @desc The epsg code
   	 * @public
   	 * @member {string}
   	 */
   	this.projection = options.projection || 'EPSG:3857'
   }
   /**
 	 * @desc Geocode an input string representing a location
 	 * @public
 	 * @abstract
 	 * @method
 	 * @param {string} input The value to geocode
 	 */
 	search(input) {
    throw 'Not implemented'
 	}
   /**
 	 * @desc Locator once using device geolocation
 	 * @public
 	 * @abstract
 	 * @method
 	 */
 	locate() {
 		throw 'Not implemented'
 	}
   /**
 	 * @desc Track using device geolocation
 	 * @public
 	 * @abstract
 	 * @method
 	 * @param {boolean} track Track or not
 	 */
 	track() {
 		throw 'Not implemented'
 	}
  /**
	 * @desc Get a distance for an accuracy enumerator based on the projections
	 * @public
	 * @method
	 * @param {nyc/Locator/Accuracy} accuracy
	 * @return {number} The accurcy in map units
	 */
	accuracyDistance(accuracy) {
    if (this.projection === 'EPSG:3857') {
      return accuracy
    }
    return accuracy / this.metersPerUnit()
	}
  /**
	 * @desc Get a distance for an accuracy enumerator based on the projections
	 * @public
	 * @method
	 * @return {number} The meters per map unit
	 */
	metersPerUnit(){
		return proj4.defs[this.projection].to_meter
	}
}

/**
 * @desc constructor options for {nyc/Locator}
 * @public
 * @typedef {Object}
 * @property {string} [projection=EPSG:3857] The EPSG code of the projection for output geometries (i.e. EPSG:2263)
 */
Locator.Options

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
 * @property {(Array<number>|undefined)} coordinate The geocoded location coordinate
 * @property {number} accuracy The accuracy of the geocoded location in meters or units of a specified projection
 * @property {Locator.ResultType} type They type of result
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
 * @property {Array<Locator.Result>} possible An array of possible results to the request
 */
Locator.Ambiguous

/**
 * @desc The result of a search request
 * @event Locator#geocode
 * @type {Locator.ResultType}
 */

/**
 * @desc The result of a locate request
 * @event Locator#geolocation
 * @type {Locator.ResultType}
 */

/**
 * @desc The result of an inconclusive search request
 * @event Locator#ambiguous
 * @type {Locator.Ambiguous}
 */

/**
 * @desc The error object from a locate request error
 * @event Locator#error
 * @type {Object}
 */

export default Locator
