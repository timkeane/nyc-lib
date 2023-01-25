/**
 * @module nyc/OsmGeocoder
 */

import Geocoder from 'nyc/Geocoder'
import proj4 from 'proj4'

/**
 * @desc A class for geocoding
 * @public
 */
class OsmGeocoder extends Geocoder {
  /**
   * @desc Create an instance of Geocoder
   * @public
   * @constructor
   * @param {Object<string, Object>} options Constructor options
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

export default OsmGeocoder
