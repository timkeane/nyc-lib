/**
 * @module nyc/ol/source/AutoLoad
 */

import $ from 'jquery'
import OlSourceVector from 'ol/source/Vector'
import CsvAddr from 'nyc/ol/format/CsvAddr'
import fetchTimeout from 'nyc/fetchTimeout'

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
   * @param {olx.source.VectorOptions} options Constructor options
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
    return new Promise($.proxy(this.resolve, this))
  }
  /**
   * @private
   * @method
   * @param {function} resolve Resolve function
   * @param {function} reject Reject function
   */
  resolve(resolve, reject) {
    fetchTimeout(this.autoLoadOptions.url).then(response => {
      response.text().then(responseText => {
        const format = this.getFormat(responseText)
        const csvAddr = this.getCsvAddrFormat(format)
        const features = format.readFeatures(responseText)
        this.addFeatures(features)
        if (csvAddr) {
          csvAddr.one('geocode-complete', () => {
            this.set('autoload-complete', this)
            resolve(features)
          })
        } else {
          this.set('autoload-complete', this)
          resolve(features)
        }
      })
    }).catch(err => {
      reject(err)
    })
  }

  getCsvAddrFormat(format) {
    if (format instanceof CsvAddr) {
      return format
    }
    if (format.parentFormat instanceof CsvAddr) {
      return format.parentFormat
    }
  }
}

export default AutoLoad
