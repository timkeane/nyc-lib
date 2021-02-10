/**
 * @module nyc/ol/format/CsvPoint
 */

import Papa from 'papaparse'
import util from 'util'
import OlFeature from 'ol/Feature'
import OlFormatFeature from 'ol/format/Feature'
import OlGeomPoint from 'ol/geom/Point'
import OlFormatFormatType from 'ol/format/FormatType'
import StandardCsv from 'nyc/ol/format/StandardCsv'

import {get as olProjGet} from 'ol/proj'

/**
 * @desc Class to create point features from CSV data
 * @public
 * @class
 * @extends ol.format.Feature
 * @see http://openlayers.org/en/latest/apidoc/module-ol_format_Feature-FeatureFormat.html
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
     * @member {boolean}
     */
    this.autoDetect = options.autoDetect === true
    /**
     * @private
     * @member {ol.Projection}
     */
    this.dataProjection = olProjGet(options.dataProjection || 'EPSG:4326')
    /**
     * @private
     * @member {ol.Projection}
     */
    this.featureProjection = olProjGet(options.featureProjection || 'EPSG:3857')
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
    let id
    if (source[this.id]) {
      id = source[this.id]
    } else {
      id = this.lastId
      this.lastId += 1
    }
    const feature = new OlFeature(source)
    feature.setId(id)
    this.setGeometry(feature, source, options)
    return feature
  }
  /**
   * @desc Set the feature geometry
   * @public
   * @method
   * @param {ol.Feature} feature The feature
   * @param {Object<string, string>} source A row from a CSV data source
   * @param {olx.format.ReadOptions=} options Read options
   */
  setGeometry(feature, source, options) {
    const x = source[this.x] = parseFloat(source[this.x])
    const y = source[this.y] = parseFloat(source[this.y])
    if (isNaN(x) || isNaN(y)) {
      throw `Invalid coordinate [${x}, ${y}] for id ${feature.getId()}`
    }
    const point = new OlGeomPoint([x, y])
    point.transform(
      options && options.dataProjection ? options.dataProjection : this.dataProjection,
      options && options.featureProjection ? options.featureProjection : this.featureProjection
    )
    feature.setGeometry(point)
  }
  /**
   * @desc Read all features from a source
   * @public
   * @method
   * @param {Object} source Rows from a CSV data source
   * @param {olx.format.ReadOptions=} options Read options
   * @return {Array.<ol.Feature>} Features
   */
  readFeatures(source, options) {
    const features = []
    source = this.parseSource(source)
    source.forEach((row) => {
      try {
        features.push(this.readFeature(row, options))
      } catch (error) {
        console.error(error, row)
      }
    })
    return features
  }
  /**
   * @private
   * @method
   * @param {Object} source Rows from a CSV data source
   * @return {Array<Object>} The projection
   */
  parseSource(source) {
    if (source instanceof ArrayBuffer) {
      source = new util.TextDecoder().decode(source)
    }
    if (typeof source === 'string') {
      source = Papa.parse(source, {header: true}).data
    }
    this.detectCsvFormat(source)
    return source
  }
  /**
   * @desc Detect CSV columns and projection based on standard format
   * @public
   * @method
   * @param {Object<string, Object>} source Parsed CSV data
   */
  detectCsvFormat(source) {
    if (this.autoDetect) {
      this.id = StandardCsv.ID
      if (source[0][StandardCsv.X]) {
        this.x = StandardCsv.X
        this.y = StandardCsv.Y
        this.dataProjection = olProjGet('EPSG:2263')
      } else {
        this.x = StandardCsv.LNG
        this.y = StandardCsv.LAT
        this.dataProjection = olProjGet('EPSG:4326')
      }
    }
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
    return this.dataProjection
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
* @property {boolean} [autoDetect=false] Attempt to determine standard column names and projection
* @property {string=} x The name of the field containing the x ordinate of the point
* @property {string=} y The name of the field containing the y ordinate of the point
* @property {string=} id The name of the field containing the unique id of the point
* @property {ol.ProjectionLike} [dataProjection=EPSG:4326] The projection of the source data
* @property {ol.ProjectionLike} [featureProjection=EPSG:3857] The projection of the resulting features
*/
CsvPoint.Options

export default CsvPoint
