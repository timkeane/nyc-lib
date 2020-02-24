/**
 * @module nyc/ol/format/SocrataJson
 */

import OlFeature from 'ol/Feature'
import OlJSONFeature from 'ol/format/JSONFeature'
import GeoJSON from 'ol/format/GeoJSON'
import nyc from 'nyc'

import {get as olProjGet} from 'ol/proj'

/**
 * @desc Class to create point features from Socrata data
 * @public
 * @class
 * @extends ol.format.Feature
 */
class SocrataJson extends OlJSONFeature {
  /**
   * @desc Create an instance of SocrataJson
   * @public
   * @constructor
   * @param {module:nyc/ol/format/SocrataJson~SocrataJson.Options} options Constructor options
   */
  constructor(options) {
    super(options)
    this.id = options.id
    this.geometry = options.geometry || 'the_geom'
    this.geoJson = new GeoJSON()
    this.defaultFeatureProjection = olProjGet('EPSG:3857')
    this.dataProjection = olProjGet('EPSG:4326')
    this.lastExtent = null
  }
  /**
   * @desc Read JSON features
   * @protected
   * @method
   * @param {Object} object Object
   * @param {ol.Feature.ReadOptions=} options Read options
   * @returns {Array<ol.Feature>} Features
   */
  readFeaturesFromObject(object, options) {
    const features = []
    object.forEach(o => {
      features.push(this.readFeatureFromObject(o, options))
    })
    return features
  }
  /**
   * @desc Read JSON a feature
   * @protected
   * @method
   * @param {Object} object Object
   * @param {ol.Feature.ReadOptions=} options Read options
   * @returns {ol.Feature} Feature
   */
  readFeatureFromObject(object, options) {
    const props = object
    const geom = this.geoJson.readGeometry(props[this.geometry])
    delete props[this.geometry]
    const feature = new OlFeature(props)
    geom.transform(options.dataProjection, options.featureProjection)
    feature.setGeometry(geom)
    feature.setId(props[this.id] || nyc.nextId('SocrataJson'))
    return feature
  }
  /**
   * @desc Read the projection from a source
   * @protected
   * @method
   * @param {Document|Node|Object|string} source Source
   * @returns {ol.Projection} Projection
   */
  readProjection(source) {
    return new olProjGet('EPSG:4326')
  }
  /**
   * @desc Get the last extent
   * @public
   * @method
   * @returns {ol.extent} Extent
   */
  getLastExtent() {
    return this.lastExtent
  }
  /**
   * @desc Set the last extent
   * @public
   * @method
   * @param {ol.extent} extent The last extent
   */
  setLastExtent(extent) {
    this.lastExtent = extent
  }
}

/**
* @desc Constructor options for {@link module:nyc/ol/format/SocrataJson~SocrataJson}
* @public
* @typedef {Object}
* @property {string=} geometry The name of the geometry field
* @property {string=} id The name of the field containing the unique id of the point
*/
SocrataJson.Options

export default SocrataJson
