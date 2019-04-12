/**
 * @module nyc/ol/format/CartoSql
 */

import OlFeature from 'ol/Feature'
import Point from 'ol/geom/Point'
import OlFormatFeature from 'ol/format/Feature'
import OlFormatWkt from 'ol/format/WKT'
import OlFormatFormatType from 'ol/format/FormatType'

/**
 * @desc Class to create features from Carto SQL API data.  This format requires the presence of a WTK geometry in the source data with the column name wkt_geom.
 * @public
 * @class
 * @extends ol.format.Feature
 * @see http://openlayers.org/en/latest/apidoc/module-ol_format_Feature-FeatureFormat.html
 */
class CartoSql extends OlFormatFeature {
  /**
   * @desc Create an instance of CartoSql
   * @public
   * @constructor
   */
  constructor() {
    super()
    /**
     * @private
     * @member {ol.ProjectionLike}
     */
    this.dataProjection = 'EPSG:3857'
    /**
     * @private
     * @member {ol.ProjectionLike}
     */
    this.featureProjection = 'EPSG:3857'
    /**
     * @private
     * @member {ol.format.WKT}
     */
    this.wkt = new OlFormatWkt()
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
   * @param {Object} source A row from a Carto SQL data source
   * @return {ol.Feature} Feature
   */
  readFeature(source) {
    let id;
    const feature = new OlFeature(source) 
    try {
      feature.setGeometry(this.wkt.readGeometry(source.wkt_geom))
    } catch (badGeom) {
      feature.setGeometry(new Point([0, 0]))
    }
    if (source.cartodb_id) {
      id = source.cartodb_id
    } else {
      id = this.lastId;
      this.lastId += 1
    }
    feature.setId(id)
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
   * @desc Return format type
   * @public
   * @override
   * @method
   * @return {ol.format.FormatType} The format type
   */
  getType() {
    return OlFormatFormatType.TEXT
  }
}

/**
 * @desc Create a Carto SQL API query.  If a select clause is provided it must include a wkt_geom column.
 * @public
 * @static
 * @method
 * @param {module:nyc/ol/format/CartoSql~CartoSql.Options} options Options
 * @return {string} SQL statement
 */
CartoSql.createSql = options => {
  const select = options.select ? options.select : 'cartodb_id, ST_AsText(the_geom_webmercator) wkt_geom, *'
  const where = options.where ? ` WHERE ${options.where}` : ''
  return `SELECT ${select} FROM ${options.from}${where}`
}

/**
* @desc Options for {@link module:nyc/ol/format/CartoSql~CartoSql#createSql}
* @public
* @typedef {Object}
* @property {string=} select The SQL select clause
* @property {string} from The SQL from clause
* @property {string=} where The SQL where clause
*/
CartoSql.Options

export default CartoSql
