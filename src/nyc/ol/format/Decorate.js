/**
 * @module nyc/ol/format/Decorate
 */

import $ from 'jquery'

import nyc from 'nyc'

import OlFormatFeature from 'ol/format/Feature'

/**
 * @desc Class to create point features from CSV data
 * @public
 * @class
 * @extends ol.format.Feature
 * @see http://openlayers.org/en/latest/apidoc/ol.format.Feature.html
 */
class Decorate extends OlFormatFeature {
  /**
	 * @desc Create an instance of CsvPoint
	 * @public
	 * @constructor
   * @param {module:nyc/ol/format/Decorate~Decorate.Options} options Constructor options
	 */
  constructor(options) {
    super()
    /**
     * @private
     * @member {ol.format.Feature}
     */
    this.parentFormat = options.parentFormat
    /**
     * @private
     * @member {Array<Object<string, Object>>}
     */
    this.decorations = options.decorations
  }
  /**
   * @desc Read a single feature from a source
   * @public
   * @method
   * @param {Object} source A row from a vector data source
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
   * @param {Array<Object>} source Rows from a vector data source
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
   * @desc Read the projection from a source
   * @public
   * @override
   * @method
   * @param {Document|Node|Object|string} source Source
   * @return {ol.proj.Projection} The projection
   */
  readProjection(source) {
    return this.parentFormat.readProjection(source)
  }
  /**
   * @desc Get the extent from the source of the last readFeatures call
   * @public
   * @override
   * @method
   * @return {ol.Extent} The extent
   */
  getLastExtent() {
    return null
  }
  /**
   * @desc Return format type
   * @public
   * @override
   * @method
   * @return {ol.format.FormatType} The format type
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
* @desc Constructor options for {@link module:nyc/ol/format/Decorate~Decorate}
* @public
* @typedef {Object}
* @property {ol.format.Feature} parentFormat The parent format for creating features to decorate
* @property {Array<Object<string, Object>>} decorations The objects used to decorate features
*/
Decorate.Options

export default Decorate
