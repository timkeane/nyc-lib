/**
 * @module nyc/ol/format/CsvPoint
 */

import proj4 from 'proj4'

import nyc from 'nyc/nyc'

import OlFeature from 'ol/feature'
import OlFormatFeature from 'ol/format/feature'
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
    const feature = new OlFeature(source)
    const coord = proj4(
      options.dataProjection,
      options.featureProjection,
      [source[this.x], source[this.y]]
    )
    const point = new OlGeomPoint(coord)
    const id = source[this.id] || this.lastId++
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
    source.forEach(row => {
      features.push(this.readFeature(row, options))
    })
    return features
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
