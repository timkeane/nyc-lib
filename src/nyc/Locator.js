/**
 * @module nyc/Locator
 */

import EventHandling from 'nyc/EventHandling'

import nyc from 'nyc'

const proj4 = nyc.proj4

/**
 * @desc An abstract class for geocoding and geolocating
 * @public
 * @abstract
 * @class
 * @extends {module:nyc/EventHandling~EventHandling}
 * @fires module:nyc/Locator~Locator#geocoded
 * @fires module:nyc/Locator~Locator#geolocated
 * @fires module:nyc/Locator~Locator#ambiguous
 * @fires module:nyc/Locator~Locator#error
 */
class Locator extends EventHandling {
  /**
   * @desc Creates an instance of Locator
   * @access protected
   * @param {module:nyc/Locator~Locator.Options} options Construction options
   */
  constructor(options) {
    super()
    /**
     * @desc The geocder
     * @public
     * @member {module:nyc/Geocoder~Geocoder}
     */
    this.geocoder = options.geocoder
    /**
     * @desc The epsg code
     * @public
     * @member {string}
     */
    this.projection = options.projection || 'EPSG:3857'
    this.hookupEvents()
  }
  /**
   * @desc Get a distance for an accuracy enumerator based on the projections
   * @public
   * @method
   * @return {number} The meters per map unit
   */
  metersPerUnit() {
    return proj4.defs[this.projection].to_meter
  }
  /**
   * @desc Get a distance for an accuracy enumerator based on the Locator projection
   * @access protected
   * @method
   * @param {module:nyc/Locator~Locator.Accuracy} accuracy Locator accuracy
   * @return {number} The accurcy in map units
   */
  accuracyDistance(accuracy) {
    if (this.projection === 'EPSG:3857') {
      return accuracy
    }
    return accuracy / this.metersPerUnit()
  }
  /**
   * @desc Geocode an input string representing a location
   * @public
   * @abstract
   * @method
   * @param {string} input The value to geocode
   */
  search(input) {
    this.geocoder.search(input)
  }
  /**
   * @desc Locate once using device geolocation
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
   * @private
   * @method
   * @param {Object} event The event object
   */
  proxyEvent(event) {
    this.trigger(event.type, event)
  }
  /**
   * @private
   * @method
   */
  hookupEvents() {
    this.geocoder.on('geocoded', this.proxyEvent, this)
    this.geocoder.on('ambiguous', this.proxyEvent, this)
    this.geocoder.on('error', this.proxyEvent, this)
  }
}

/**
 * @desc Constructor options for {@link module:nyc/Locator~Locator}
 * @public
 * @typedef {Object}
 * @property {module:nyc/Geocoder~Geocoder} geocoder A geocoder
 * @property {string} [projection=EPSG:3857] The EPSG code of the projection for output geometries (i.e. EPSG:2263)
 */
Locator.Options

/**
 * @desc Enumeration for approximate Geocoder accuracy in meters
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
  MEDIUM: 50,
  /**
   * @desc Low accuracy
   */
  LOW: 500,
  /**
   * @desc ZIP Code accuracy
   */
  ZIP_CODE: 1000
}

/**
 * @desc Object type to hold data about a successful result of a geocoder search or device geolocation
 * @public
 * @typedef {Object}
 * @property {string} name The formatted name of the geocoded location
 * @property {string} type The event type
 * @property {(Array<number>|undefined)} coordinate The geocoded location coordinate
 * @property {number} accuracy The accuracy of the geocoded location in meters or units of a specified projection
 * @property {string} type They type of result (geocoded or geolocated)
 * @property {boolean=} zip Is this the geocoded location a ZIP Code center point
 * @property {Object=} geometry A geoJSON representation of the geocoded location coordinates
 * @property {Object=} data Additional properties provided by the geocoder
 */
Locator.Result

/**
 * @desc Object type to hold data about possible locations resulting from a search request
 * @public
 * @typedef {Object}
 * @property {string} input The input string on which the geocoding attempt was made
 * @property {Array<module:nyc/Locator~Locator.Result>} possible An array of possible results to the request
 */
Locator.Ambiguous

/**
 * @desc The result of a search request
 * @event module:nyc/Locator~Locator#geocoded
 * @type {module:nyc/Locator~Locator.Location}
 */

/**
 * @desc The result of a locate request
 * @event module:nyc/Locator~Locator#geolocated
 * @type {module:nyc/Locator~Locator.Location}
 */

/**
 * @desc The result of an inconclusive search request
 * @event module:nyc/Locator~Locator#ambiguous
 * @type {module:nyc/Locator~Locator.Ambiguous}
 */

/**
 * @desc The error object from a locate request error
 * @event module:nyc/Locator~Locator#error
 * @type {Object}
 */

export default Locator
