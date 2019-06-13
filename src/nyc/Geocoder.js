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
   * @desc Create an instance of Geocoder
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
   * @param {string} input Input
   * @returns {Promise<Object>} The result of the search request
   */
  search(input) {
    throw 'Not implemented'
  }
}

export default Geocoder
