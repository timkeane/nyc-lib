/**
 * @module nyc/ol/source/SocrataJson
 */

import OlSourceVector from 'ol/source/Vector'
import Polygon from 'ol/geom/Polygon'
import SocrataFormat from 'nyc/ol/format/SocrataJson'

/**
 * @desc Class to load all features from a SocrataJson json endpoint
 * @public
 * @class
 * @extends {ol.source.Vector}
 * @see http://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
 */
class SocrataJson extends OlSourceVector {
  /**
   * @desc Create an instance of AutoLoad
   * @public
   * @constructor
   * @extends ol.source.Vector
   * @param {Object} options Constructor optionss
   */
  constructor(options) {
    options.format = new SocrataFormat({
      idName: options.idName,
      geometryName: options.geometryName
    })
    options.url = SocrataJson.urlFunction(options)
    super(options)
  }
}

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
    const ext = Polygon.fromExtent(extent)
      .transform(projection, 'EPSG:4326')
      .getExtent()
    return `${url}&$where=within_box(the_geom,${ext[1]},${ext[0]},${ext[3]},${ext[2]})`
  }
}

export default SocrataJson
