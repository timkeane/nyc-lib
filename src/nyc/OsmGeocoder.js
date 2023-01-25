/**
 * @module nyc/OsmGeocoder
 */

import Geocoder from ''
import proj4 from 'proj4'
import Geocoder from 'nyc/Geocoder'

/**
 * @desc A class for geocoding
 * @public
 */
class OsmGeocoder extends Geocoder {
  /**
   * @desc Create an instance of Geocoder
   * @public
   * @constructor
   * @param {Object<string, Object>} options
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
   * @param {Object} result Result
   * @return {Locator.Result} Locator result
   */
  parse(feature) {
    return {
      type: 'geocoded',
      coordinate: this.project(feature.geometry.coordinates),
      data: feature.properties,
      name: feature.label
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
            resolve({
              type: 'ambiguous',
              input: result.geocoding.query,
              possible: []
            })
          } else {
            resolve(parse(features[0]))
          }
        })
      })
    })
  }
}

export default Geocoder
