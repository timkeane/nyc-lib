/**
 * @module nyc/ol/format/CsvPoint
 */

import Papa from 'papaparse'

import Encoding from 'text-encoding'

import OlFeature from 'ol/Feature'
import OlFormatFeature from 'ol/format/Feature'
import OlFormatFormatType from 'ol/format/FormatType'
import OlGeomPoint from 'ol/geom/Point'

import nyc from 'nyc'
import proj4 from 'proj4'
import {get as olProjGet} from 'ol/proj'
import {register as olProjRegister} from 'ol/proj/proj4'

proj4.defs(nyc.projections)
olProjRegister(proj4)

/**
 * @desc Class to create point features from CSV data
 * @public
 * @class
 * @extends ol.format.Feature
 * @see http://openlayers.org/en/latest/apidoc/ol.format.Feature.html
 */
class CsvPoint extends OlFormatFeature {
	/**
	 * @desc Create an instance of CsvPoint
	 * @public
	 * @constructor
   * @param {module:nyc/ol/format/CsvPoint~CsvPoint.Options} options Constructor options
	 */
  constructor(options) {
    super()
    /**
     * @private
     * @member {ol.Projection}
     */
    this.defaultDataProjection = olProjGet(options.defaultDataProjection || 'EPSG:4326')
    /**
     * @private
     * @member {ol.Projection}
     */
    this.defaultFeatureProjection = olProjGet(options.defaultFeatureProjection || 'EPSG:3857')
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
   * @param {Object} source A row from a CSV data source
   * @param {olx.format.ReadOptions=} options Read options
   * @return {ol.Feature} Feature
   */
  readFeature(source, options) {
    const id = source[this.id] || this.lastId++
    const x = source[this.x] = source[this.x] * 1
    const y = source[this.y] = source[this.y] * 1
    if (isNaN(x) || isNaN(y)) {
     throw `Invalid coordinate [${x}, ${y}] for id ${id}`
    }
    const point = new OlGeomPoint([x, y])
    const feature = new OlFeature(source)
    options = options || {}
    options.dataProjection = olProjGet(options.dataProjection || this.defaultDataProjection)
    options.featureProjection = olProjGet(options.featureProjection || this.defaultFeatureProjection)
    point.transform(options.dataProjection, options.featureProjection)
    feature.setGeometry(point)
    feature.setId(id)
    return feature
  }
  /**
   * @desc Read all features from a source
   * @public
   * @method
   * @param {Array<Object>} source Rows from a CSV data source
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
   * @desc Read the projection from a source
   * @public
   * @override
   * @method
   * @param {Document|Node|Object|string} source Source
   * @return {ol.proj.Projection} The projection
   */
  readProjection(source) {
    return this.defaultDataProjection
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
    return OlFormatFormatType.ARRAY_BUFFER
  }
}

/**
* @desc Constructor options for {@link module:nyc/ol/format/CsvPoint~CsvPoint}
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
