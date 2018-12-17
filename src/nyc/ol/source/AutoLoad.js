/**
 * @module nyc/ol/source/AutoLoad
 */

import $ from 'jquery'

import OlSourceVector from 'ol/source/Vector'

require('isomorphic-fetch')

/**
 * @desc Class to auto load all features from a URL
 * @public
 * @class
 * @extends {ol.source.Vector}
 * @see http://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
 */
class AutoLoad extends OlSourceVector {
  /**
   * @desc Create an instance of AutoLoad
   * @public
   * @constructor
   * @extends ol.source.Vector
   * @param {olx.source.VectorOptions} options Constructor optionss
   */
  constructor(options) {
    options.loader = () => {
      console.warn('Use autoLoad to load features')
    }
    super(options)
    this.autoLoadOptions = options
  }
  /**
   * @desc Load all features
   * @public
   * @method
   * @return {Promise.<Array<ol.Feature>>} A promise that resolves to a list of features
   */
  autoLoad() {
    const options = this.autoLoadOptions
    const format = this.getFormat()
    return new Promise((resolve, reject) => {
      fetch(options.url).then((respose) => {
        return respose.text()
      }).then((resposeText) => {
        const features = format.readFeatures(resposeText)
        this.addFeatures(features)
        this.set('autoload-complete', true)
        resolve(features)
      })
    })
  }
}

export default AutoLoad
