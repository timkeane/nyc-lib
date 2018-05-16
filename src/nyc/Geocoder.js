/**
 * @module nyc/Geocoder
 */

 import EventHandling from 'nyc/EventHandling'

/**
 * @desc A class for geocoding
 * @public
 * @abstract
 * @class
 * @extends {module:nyc/EventHandling~EventHandling}
 */
class Geocoder extends EventHandling {
  /**
   * @desc Create an instance of {@see module:nyc/Geocoder~Geocoder}
   * @public
   * @constructor
   */
  constructor() {
    super()
  }
  /**
   * @desc Search for a location
   * @public
   * @abstract
   * @method
   * @param {string}
   */
  search(input) {
    throw 'Not implemented'
  }
}

export default Geocoder
