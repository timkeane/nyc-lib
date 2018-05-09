/**
 * @module nyc/ol/format/Decorate
 */

import $ from 'jquery'

import nyc from 'nyc/nyc'

import OlFeature from 'ol/feature'
import OlFormatFeature from 'ol/format/feature'
import OlGeomPoint from 'ol/geom/point'

/**
 * @desc Class to create point features from CSV data
 * @public
 * @class
 */
class Decorate extends OlFormatFeature {
  constructor(options) {
    super()
    /**
     * @private
     * @member {ol.format.Feature}
     */
    this.parentFormat = options.parentFormat
    /**
     * @private
     * @member {Array<Object>}
     */
    this.decorations = options.decorations
  }
  /**
   * @desc Read a single feature from a source
   * @public
   * @method
   * @param {Object} source A row from a {@see nyc.ol.source.CsvPoint} data source
   * @param {olx.format.ReadOptions=} options Read options
   * @return {ol.Feature} Feature
   */
  readFeature(source, options) {
    throw 'Not supported: Use readFeatures'
  }
  /**
   * @desc Read all features from a source
   * @public
   * @method
   * @param {Array<Object>} source Rows from a {@see nyc.ol.source.CsvPoint} data source
   * @param {olx.format.ReadOptions=} options Read options
   * @return {Array.<ol.Feature>} Features
   */
  readFeatures(source, options) {
    const features = this.parentFormat.readFeatures(source, options)
    features.forEach(feature => {
      this.decorate(feature)
    })
    return features
  }
  /**
   * @desc Return format type
   * @public
   * @override
   * @method
   * @return {ol.format.FormatType}
   */
  getType() {
    return this.parentFormat.getType()
  }
  /**
   * @desc Decorate a feature
   * @public
   * @method
   * @param {ol.Feature} source The feature to decorate
   */
  decorate(feature) {
    if (!feature.get('decorated')) {
      feature.set('decorated', true)
      nyc.mixin(feature, this.decorations)
      if (feature.extendFeature) {
        feature.extendFeature()
      }
    }
  }
}

/**
* @desc Constructor options for {@link Decorate}
* @public
* @typedef {Object}
* @property {ol.format.Feature} parentFormat The parent format for creating features to decorate
* @property {Array<Object>} decorations The objects used to decorate features
*/
Decorate.Options

export default Decorate
