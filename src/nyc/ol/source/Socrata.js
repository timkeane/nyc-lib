/**
 * @module nyc/ol/source/Socrata
 */

import OlSourceVector from 'ol/source/Vector'
import Polygon from 'ol/geom/Polygon'
import SocrataJson from 'nyc/ol/format/SocrataJson'

/**
 * @desc Class to load all features from a Socrata json endpoint
 * @public
 * @class
 * @extends {ol.source.Vector}
 * @see http://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
 */
class Socrata extends OlSourceVector {
  /**
   * @desc Create an instance of AutoLoad
   * @public
   * @constructor
   * @extends ol.source.Vector
   * @param {Object} options Constructor optionss
   */
  constructor(options) {
    options.format = new SocrataJson({
      geometryName: options.geometryName
    })
    options.url = Socrata.urlFunction(options)
    super(options)
  }
}

Socrata.urlFunction = (options) => {
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
    const ext = Polygon.fromExtent(extent)
      .transform(projection, 'EPSG:4326')
      .getExtent()
    return `${url}&$where=within_box(the_geom,${ext[1]},${ext[0]},${ext[3]},${ext[2]})`
  }
}

export default Socrata
