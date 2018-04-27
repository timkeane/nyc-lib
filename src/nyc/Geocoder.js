/**
 * @module nyc/Geocoder
 */

 import EventHandling from 'nyc/EventHandling'

/**
 * @desc A class for geocoding using the New York City Geoclient API
 * @public
 * @abstract
 * @class
 * @extends nyc/EventHandling
 */
export default class Geocoder extends EventHandling {
  constructor() {
    super()
  }
  search(input) {
    throw 'Not implemented'
  }
}
