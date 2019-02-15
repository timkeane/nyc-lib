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
    this.idName = options.idName
    this.geometryName = options.geometryName || 'the_geom'
    this.geoJson = new GeoJSON()
  }
  readFeaturesFromObject(object, options) {
    const features = []
    object.forEach(o => {
      features.push(this.readFeatureFromObject(o, options))
    })
    return features
  }
  readFeatureFromObject(object, options) {
    const props = object
    const geom = this.geoJson.readGeometry(props[this.geometryName])
    delete props[this.geometryName]
    const feature = new OlFeature(props)
    geom.transform(options.dataProjection, options.featureProjection)
    feature.setGeometry(geom)
    feature.setId(props[this.idName])
    return feature
  }
  readProjection(source) {
    return new olProjGet('EPSG:4326')
  }

}

export default SocrataJson
