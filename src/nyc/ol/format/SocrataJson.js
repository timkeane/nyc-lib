/**
 * @module nyc/ol/format/SocrataJson
 */

import OlFeature from 'ol/Feature'
import OlJSONFeature from 'ol/format/JSONFeature'
import GeoJSON from 'ol/format/GeoJSON'

import {get as olProjGet} from 'ol/proj'

/**
 * @desc Class to create point features from CSV data
 * @public
 * @class
 * @extends ol.format.Feature
 */
class SocrataJson extends OlJSONFeature {
  /**
   * @desc Create an instance of CsvPoint
   * @public
   * @constructor
   * @param {Object} options Constructor options
   */
  constructor(options) {
    super(options)
    this.geoJson = new GeoJSON()
  }
  readFeaturesFromObject(object, options) {
    return object
  }
  readFeatureFromObject(object, options) {
    const props = object
    const geom = this.geoJson.readGeometry(props[options.geometryName])
    delete props[options.geometryName]
    const feature = new OlFeature(props)
    geom.transform(options.dataProjection, options.featureProjection)
    feature.setGeometry(geom)
    return feature
  }
  readProjection(source) {
    return new olProjGet('EPSG:4326')
  }

}

export default SocrataJson
