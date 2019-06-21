/**
 * @module nyc/ol/format/CsvAddr
 */

import $ from 'jquery'
import CsvPoint from 'nyc/ol/format/CsvPoint'
import OlGeomPoint from 'ol/geom/Point'
import EventHandling from 'nyc/EventHandling'
import ReplaceTokens from 'nyc/ReplaceTokens'

/**
 * @desc Class to create point features from CSV data
 * @public
 * @class
 * @extends ol.format.Feature
 * @mixes module:nyc/EventHandling~EventHandling
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
     * @private
     * @member {number}
     */
    this.featureCount = undefined
    /**
     * @private
     * @member {number}
     */
    this.geocodedCount = 0
    this.replace = new ReplaceTokens().replace

    const eventHandling = new EventHandling()
    this.on = $.proxy(eventHandling.on, eventHandling)
    this.one = $.proxy(eventHandling.one, eventHandling)
    this.off = $.proxy(eventHandling.off, eventHandling)
    this.trigger = $.proxy(eventHandling.trigger, eventHandling)
  }
  /**
   * @desc Read all features from a source
   * @public
   * @override
   * @method
   * @param {Object} source Rows from a CSV data source
   * @param {olx.format.ReadOptions=} options Read options
   * @return {Array.<ol.Feature>} Features
   */
  readFeatures(source, options) {
    const features = super.readFeatures(source, options)
    this.featureCount = (this.featureCount || 0) + features.length
    return features
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
          feature.set('_geoclientResp', result)
        } else {
          console.warn('Ambiguous location:', input, source, 'Geocoder response:', result)
        }
      }).catch(error => {
        console.error('Geocoding error:', input, source, 'Geocoder response:', error)
      }).finally(() => {
        this.geocodedCount = this.geocodedCount + 1
        if (this.geocodedCount === this.featureCount) {
          this.trigger('geocode-complete', this)
        }
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
