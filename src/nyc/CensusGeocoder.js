/**
 * @module nyc/CensusGeocoder
 */

import nyc from 'nyc'
import $ from 'jquery'
import Locator from 'nyc/Locator'
import Geocoder from 'nyc/Geocoder'

const proj4 = nyc.proj4

/**
 * @desc A class for geocoding using the New York City Geoclient API
 * @public
 * @class
 * @extends module:nyc/Geocoder~Geocoder
 * @fires module:nyc/Locator~Locator#geocoded
 * @fires module:nyc/Locator~Locator#geolocated
 * @fires module:nyc/Locator~Locator#ambiguous
 * @fires module:nyc/Locator~Locator#error
 * @see https://developer.cityofnewyork.us/api/geoclient-api
 */
class CensusGeocoder extends Geocoder {
/**
 * @desc Create an instance of Geoclient
 * @public
 * @constructor
 * @param {module:nyc/Geoclient~Geoclient.Options} options Constructor options
 */
  constructor(options) {
    super(options)
    /**
     * @private
     * @member {string}
     */
    this.url = `${options.url}&address=`
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
   * @override
   * @method
   * @param {string} input The value to geocode
   * @returns {Promise<module:nyc/Locator~Locator.Result|module:nyc/Locator~Locator.Ambiguous>} The result of the search request
   */
  search(input) {
    const me = this
    return new Promise((resolve, reject) => {
      input = input.trim()
      if (input.length === 5 && !isNaN(input)) {
        this.resolveZip(input, resolve)
      } else if (input.length) {
        input = input.replace(/"/g, '').replace(/'/g, '').replace(/&/g, ' and ')
        $.ajax({
          url: `${me.url}${input}`,
          dataType: 'jsonp',
          success: response => {
            me.census(response, resolve)
          },
          error: me.error
        })
      }
    })
  }
  /**
   * @private
   * @method
   * @param {Array<number>} coordinate Coordinate
   * @return {Array<number>} Reprojected coordinate
   */
  project(coordinate) {
    if (coordinate && this.projection !== 'EPSG:4326') {
      return proj4('EPSG:4326', this.projection, coordinate)
    }
    return coordinate
  }
  /**
   * @private
   * @method
   * @param {Object} response Response object
   * @param {function} resolve Resolve
   */
  census(response, resolve) {
    const result = response.result
    const addressMatches = result.addressMatches
    const nothing = {
      type: 'ambiguous',
      input: result.input.address.address,
      possible: []
    }
    if (addressMatches.length) {
      if (addressMatches.length === 1) {
        const result = addressMatches[0]
        const location = this.parse(result)
        if (location) {
          location.type = 'geocoded'
          resolve(location)
          this.trigger('geocoded', location)
        } else {
          resolve(nothing)
          this.trigger('ambiguous', nothing)
        }
      } else {
        const ambiguous = {
          type: 'ambiguous',
          input: response.input,
          possible: this.possible(addressMatches)
        }
        resolve(ambiguous)
        this.trigger('ambiguous', ambiguous)
      }
    } else {
      resolve(nothing)
      this.trigger('ambiguous', nothing)
    }
  }
  /**
   * @private
   * @method
   * @param {Array<module:nyc.Locator~Locator.Ambiguous>} results Results
   * @returns {Array} Possible results
   */
  possible(results) {
    const possible = []
    results.forEach(result => {
      const location = this.parse(result)
      if (location) {
        possible.push(location)
      }
    })
    return possible
  }
  /**
   * @private
   * @method
   * @param {Object} result Result
   * @return {Locator.Result} Locator result
   */
  parse(result) {
    const p = [result.coordinates.x, result.coordinates.y]
    return {
      type: 'geocoded',
      coordinate: this.project(p),
      data: result,
      name: result.addressMatches
    }
  }
  /**
   * @private
   * @method
   * @param {function} reject Resolve
   */
  error(reject) {
    const error = {type: 'error', error: arguments}
    console.error('Geoclient error', arguments)
    reject(error)
    this.trigger('error', error)
  }
}

/**
 * @desc Constructor options for {@link module:nyc/CensusGeocoder~CensusGeocoder}
 * @public
 * @typedef {Object}
 * @property {string} url The URL for accessing the Geoclient API (see {@link https://geocoding.geo.census.gov/})
 * @property {string} [projection=EPSG:3857] The EPSG code of the projection for output geometries (i.e. EPSG:2263)
 */
CensusGeocoder.Options


export default CensusGeocoder
