import NycLocalStorage from 'nyc/LocalStorage'

import nyc from 'nyc'
import L from 'leaflet'

const proj4 = nyc.proj4

/**
 * @desc Class to provide access to localStorage and filesystem
 * @public
 * @class
 * @extends module:nyc/LocalStorage~LocalStorage
 */
export default class LocalStorage extends NycLocalStorage {
  /**
   * @public
   * @override
   * @method
   * @param {L.Map} map The map on which to display the new layer
   * @param {string|Array<Object>} features The features from which to create the new layer
   * @param {string=} projcs The projection
   * @return {L.Layer}  The new layer
   */
  addToMap(map, features, projcs) {
    const dataProjection = this.customProj(projcs, proj4)
    if (typeof features === 'string') {
      features = JSON.parse(features)
    }
    features = features.features ? features.features : features

    const layer = L.geoJSON(features, {
      coordsToLatLng: (coord) => {
        if (dataProjection) {
          coord = proj4(dataProjection, 'EPSG:4326', coord)
        }
        return [coord[1], coord[0], coord[2]]
      }
    })
    map.addLayer(layer)
    return layer
  }
}

