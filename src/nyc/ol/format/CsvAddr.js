/**
 * @module nyc/ol/format/CsvAddr
 */

import CsvPoint from 'nyc/ol/format/CsvPoint'
import OlGeomPoint from 'ol/geom/Point'
import ReplaceTokens from 'nyc/ReplaceTokens'

/**
 * @desc Class to create point features from CSV data
 * @public
 * @class
 * @extends ol.format.Feature
 * @see http://openlayers.org/en/latest/apidoc/module-ol_format_Feature-FeatureFormat.html
 */
class CsvAddr extends CsvPoint {
  /**
   * @desc Create an instance of CsvAddr
   * @public
   * @constructor
   * @param {module:nyc/ol/format/CsvAddr~CsvAddr.Options} options Constructor options
   */
  constructor(options) {
    super(options)
    /**
     * @private
     * @member {boolean}
     */
    this.geocoder = options.geocoder
    /**
     * @private
     * @member {string}
     */
    this.locationTemplate = options.locationTemplate
    /**
     * @desc Replace tokens in a string with values from a provided object
     * @public
     * @method
     * @param {string} str String with tokens to be replaced
     * @param {Object<string, string>} values Values token for replacement
     * @return {string} String with replacement value substitution
     */
    this.replace = new ReplaceTokens().replace
  }
  /**
   * @desc Set the feature geometry
   * @public
   * @override
   * @method
   * @param {ol.Feature} feature The feature
   * @param {Object<string, string>} source A row from a CSV data source
   */
  setGeometry(feature, source) {
    const input = this.replace(this.locationTemplate, source)
    if (input === this.locationTemplate) {
      console.error('Invalid location:', input, 'Bad record:', source)
    } else {
      this.geocoder.search(input).then(result => {
        if (result.type === 'geocoded') {
          console.info('Geocoded:', input, source, 'Geocoder response:', result)
          feature.setGeometry(new OlGeomPoint(result.coordinate))
        } else {
          console.warn('Ambiguous location:', input, source, 'Geocoder response:', result)
        }
      }).catch(error => {
        console.error('Geocoding error:', input, source, 'Geocoder response:', error)
      })
    }
  }
}
/**
* @desc Constructor options for {@link module:nyc/ol/format/CsvAddr~CsvAddr}
* @public
* @typedef {Object}
* @property {boolean} [autoDetect=false] Attempt to determine standard column names and projection
* @property {module:nyc/Geocoder~Geocoder} x The geocoder to use for geocoding feature
* @property {string} locationTemplate The location template for generating a location string to pass to the geocoder
*/
CsvAddr.Options

export default CsvAddr
