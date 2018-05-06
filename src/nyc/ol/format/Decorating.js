/**
 * @module nyc/ol/format/Decorating
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
class Decorating extends OlFormatFeature {
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
    const feature = this.parentFormat.readFeature(source, options)
    nyc.mixin(feature, this.decorations)
    if (feature.extendFeature) {
      feature.extendFeature()
    }
    return feature
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
    const features = []
    source.forEach(feature => {
      features.push(this.readFeature(feature, options))
    })
    return features
  }
}

/**
* @desc Constructor options for {@link Decorating}
* @public
* @typedef {Object}
* @property {ol.format.Feature} parentFormat The parent format for creating features to decorate
* @property {Array<Object>} decorations The objects used to decorate features
*/
Decorating.Options

export default Decorating
