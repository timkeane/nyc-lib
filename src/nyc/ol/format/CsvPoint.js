/**
 * @module nyc/ol/format/CsvPoint
 */

import Papa from 'papaparse'

import Encoding from 'text-encoding'

import nyc from 'nyc/nyc'

import OlFeature from 'ol/feature'
import OlFormatFeature from 'ol/format/feature'
import OlFormatFormatType from 'ol/format/formattype'
import OlGeomPoint from 'ol/geom/point'

/**
 * @desc Class to create point features from CSV data
 * @public
 * @class
 */
class CsvPoint extends OlFormatFeature {
  constructor(options) {
    super()
    /**
     * @private
     * @member {ol.ProjectionLike}
     */
    this.defaultDataProjection = options.defaultDataProjection || 'EPSG:4326'
    /**
     * @private
     * @member {ol.ProjectionLike}
     */
    this.defaultFeatureProjection = options.defaultFeatureProjection || 'EPSG:3857'
    /**
     * @private
     * @member {string}
     */
    this.id = options.id
    /**
     * @private
     * @member {string}
     */
    this.x = options.x
    /**
     * @private
     * @member {string}
     */
    this.y = options.y
    /**
     * @private
     * @member {number}
     */
    this.lastId = 0
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
    options = this.adaptOptions(options)
    const id = source[this.id] || this.lastId++
    const x = source[this.x] = source[this.x] * 1
    const y = source[this.y] = source[this.y] * 1
    if (isNaN(x) || isNaN(y)) {
      throw `Invalid coordinate [${x}, ${y}] for id ${id}`
    }
    const point = new OlGeomPoint([x, y])
    const feature = new OlFeature(source)
    point.transform(options.dataProjection, options.featureProjection)
    feature.setGeometry(point)
    feature.setId(id)
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
    if (source instanceof ArrayBuffer) {
      source = new Encoding.TextDecoder('utf-8').decode(source)
    }
    if (typeof source === 'string') {
      source = Papa.parse(source, {header: true}).data
    }
    source.forEach((row, i) => {
      try {
        features.push(this.readFeature(row, options))
      } catch (error) {
        console.error(error, row)
      }
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
    return OlFormatFormatType.ARRAY_BUFFER
  }
}

/**
* @desc Constructor options for {@link CsvPoint}
* @public
* @typedef {Object}
* @property {string} x The name of the field containing the x ordinate of the point
* @property {string} y The name of the field containing the y ordinate of the point
* @property {string=} id The name of the field containing the unique id of the point
* @property {ol.ProjectionLike} [defaultDataProjection=EPSG:4326] The projection of the source data
* @property {ol.ProjectionLike} [defaultFeatureProjection=EPSG:3857] The projection of the resulting features
*/
CsvPoint.Options

export default CsvPoint
