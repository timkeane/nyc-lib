/**
 * @module nyc/OsmGeocoder
 */

import Geocoder from './Geocoder'
import proj4 from 'proj4'

/**
 * @desc A class for geocoding utilizing the OSM Nominatim API
 * @public
 * @class
 * @extends module:nyc/Geocoder~Geocoder
 * @fires module:nyc/Locator~Locator#geocoded
 * @fires module:nyc/Locator~Locator#geolocated
 * @fires module:nyc/Locator~Locator#ambiguous
 * @fires module:nyc/Locator~Locator#error
 * @see https://developer.cityofnewyork.us/api/geoclient-api
 */
class OsmGeocoder extends Geocoder {
  /**
   * @desc Create an instance of OsmGeocoder
   * @public
   * @constructor
 * @param {module:nyc/OsmGeocoder~OsmGeocoder.Options} options Constructor options
   */
  constructor(options) {
    super()
    this.countryCodes = options?.countryCodes?.join() || 'us'
    this.viewbox = options?.viewbox?.join() || ''
    this.projection = options?.projection || 'EPSG:3857'
    this.url = `https://nominatim.openstreetmap.org/search.php?format=geocodejson&dedupe=1&countrycodes=${this.countryCodes}&viewbox=${this.viewbox}`
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
   * @param {Object} feature feature
   * @return {Locator.Result} Locator result
   */
  parse(feature) {
    return {
      type: 'geocoded',
      coordinate: this.project(feature.geometry.coordinates),
      data: feature,
      name: feature.properties.geocoding.label
    }
  }
  /**
   * @desc Search for a location
   * @public
   * @method
   * @param {string} input Input
   * @returns {Promise<Object>} The result of the search request
   */
  search(input) {
    input = input.replace(/"/g, '').replace(/'/g, '').replace(/&/g, ' and ')
    return new Promise((resolve, reject) => {
      fetch(`${this.url}&q=${encodeURIComponent(input)}`).then(response => {
        response.json().then(result => {
          const features = result.features
          if (features.length === 0) {
            const nothing = {
              type: 'ambiguous',
              input: result.geocoding.query,
              possible: []
            }
            resolve(nothing)
            this.trigger('ambiguous', nothing)
          } else {
            const location = this.parse(features[0])
            resolve(location)
            this.trigger('geocoded', location)
          }
        })
      })
    })
  }
}

/**
 * @desc Constructor options for {@link module:nyc/OsmGeocoder~OsmGeocoder}
 * @public
 * @typedef {Object}
 * @property {Array<string>} [countryCodes=['us']] The countries in which your events are located
 * @property {Array<number>} [viewBox=['us']] A bounding box for the geocoder in EPSG:4326
 * @property {string} [projection=EPSG:3857] The EPSG code of the projection for output coordinates
 */
OsmGeocoder.Options

export default OsmGeocoder
