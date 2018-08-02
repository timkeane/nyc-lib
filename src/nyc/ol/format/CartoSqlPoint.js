/**
 * @module nyc/ol/format/CartoSqlPoint
 */

import nyc from 'nyc'

import OlFeature from 'ol/feature'
import OlFormatFeature from 'ol/format/feature'
import OlFormatFormatType from 'ol/format/formattype'
import OlGeomPoint from 'ol/geom/point'

/**
 * @desc Class to create point features from Carto SQL API data
 * @public
 * @class
 * @extends ol.format.Feature
 * @see http://openlayers.org/en/latest/apidoc/ol.format.Feature.html
 */
class CartoSqlPoint extends OlFormatFeature {
	/**
	 * @desc Create an instance of CartoSqlPoint
	 * @public
	 * @constructor
   * @param {module:nyc/ol/format/CartoSqlPoint~CartoSqlPoint.Options} options Constructor options
	 */
  constructor(options) {
    super()
    /**
     * @private
     * @member {ol.ProjectionLike}
     */
    this.defaultDataProjection = 'EPSG:3857'
    /**
     * @private
     * @member {ol.ProjectionLike}
     */
    this.defaultFeatureProjection = 'EPSG:3857'
    /**
     * @private
     * @member {string}
     */
    this.sql = this.createSql(options)
  }
  /**
   * @public
   * @method
   * @returns {string} The SQL
   */
  getSql() {
    return this.sql
  }
  /**
   * @desc Read a single feature from a source
   * @public
   * @method
   * @param {Object} source A row from a Carto SQL data source
   * @return {ol.Feature} Feature
   */
  readFeature(source) {
    const point = new OlGeomPoint([source.x, source.y])
    const feature = new OlFeature(source)
    feature.setGeometry(point)
    feature.setId(source.cartodb_id)
    return feature
  }
  /**
   * @desc Read all features from a source
   * @public
   * @method
   * @param {string} source Response from a Carto SQL data source
   * @return {Array.<ol.Feature>} Features
   */
  readFeatures(source) {
    const features = []
    const rows = JSON.parse(source).rows
    rows.forEach(row => {
      features.push(this.readFeature(row))
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
    return 'EPSG:3857'
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
   * @private
   * @method
   * @param {module:nyc/ol/format/CartoSqlPoint~CartoSqlPoint.Options} options
   * @return {string}
   */
  createSql(options) {
    const select = options.select ? options.select : 'cartodb_id, ST_X(the_geom_webmercator) x, ST_Y(the_geom_webmercator) Y, *'
    const where = options.where ? ` WHERE ${options.where}` : ''
    return `SELECT ${select} FROM ${options.from}${where}`    
  }
}

/**
* @desc Constructor options for {@link module:nyc/ol/format/CartoSqlPoint~CartoSqlPoint}
* @public
* @typedef {Object}
* @property {string=} select The SQL select clause
* @property {string} from The SQL from clause
* @property {string=} where The SQL where clause
*/
CartoSqlPoint.Options

export default CartoSqlPoint
