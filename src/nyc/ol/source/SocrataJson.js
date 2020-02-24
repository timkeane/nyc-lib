/**
 * @module nyc/ol/source/SocrataJson
 */

import OlSourceVector from 'ol/source/Vector'
import {fromExtent as polygonFromExtent} from 'ol/geom/Polygon'
import SocrataFormat from 'nyc/ol/format/SocrataJson'

/**
 * @desc Class to load all features from a SocrataJson json endpoint
 * @public
 * @class
 * @extends ol.source.Vector
 * @see http://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
 */
class SocrataJson extends OlSourceVector {
  /**
   * @desc Create an instance of SocrataJson
   * @public
   * @constructor
   * @param {module:nyc/ol/source/SocrataJson~SocrataJson.Options} options Constructor options
   */
  constructor(options) {
    options.format = new SocrataFormat({
      id: options.id,
      geometry: options.geometry
    })
    options.url = SocrataJson.urlFunction(options)
    super(options)
  }
}

/**
 * @desc Function to return a bbox URL
 * @public
 * @static
 * @function
 * @param {module:nyc/ol/source/SocrataJson~SocrataJson.Options} options Constructor options
 * @returns {ol.featureloader.FeatureLoader} Function that loads features by bbox
 */
SocrataJson.urlFunction = (options) => {
  let url = options.url
  if (typeof url === 'function') {
    return url
  }
  url = `${url}?`
  if (options.token) {
    url = `${url}&$$app_token=${options.token}`
  }
  if (options.limit) {
    url = `${url}&$limit=${options.limit}`
  } else {
    url = `${url}&$limit=2000000`
  }
  return (extent, resolution, projection) => {
    if (extent[0] === Infinity) {
      return url
    }
    const geom = options.geometry || 'the_geom'
    const ext = polygonFromExtent(extent)
      .transform(projection, 'EPSG:4326')
      .getExtent()
    options.format.setLastExtent(ext)
    return `${url}&$where=within_box(${geom},${ext[1]},${ext[0]},${ext[3]},${ext[2]})`
  }
}

/**
 * @desc Constructor options for {@link module:nyc/ol/source/SocrataJson~SocrataJson}
 * @public
 * @typedef {Object}
 * @property {string|ol.featureloader.FeatureLoader} url The URL or FeatureLoader function that returns a URL to a Socrata JSON endpoint
 * @property {string=} geometry The name of the geometry field
 * @property {string=} id The name of the field containing the unique id of the point
 * @property {string=} token The Socrata token
 * @property {string} [limit=2000000] The maximum number of records to return
 */
SocrataJson.Options

export default SocrataJson
