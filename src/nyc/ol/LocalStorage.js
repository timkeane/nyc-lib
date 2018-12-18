import OlFormatGeoJSON from 'ol/format/GeoJSON'
import OlSourceVector from 'ol/source/Vector'
import OlLayerVector from 'ol/layer/Vector'

import NycLocalStorage from 'nyc/LocalStorage'
import {register as olProjRegister} from 'ol/proj/proj4'

import nyc from 'nyc'

const proj4 = nyc.proj4

/**
 * @desc Class to provide access to localStorage and filesystem
 * @public
 * @class
 * @extends module:nyc/LocalStorage~LocalStorage
 */
export default class LocalStorage extends NycLocalStorage {
  /**
   * @desc Create an instance pf LocalStorage
   * @public
   * @constructor
   */
  constructor() {
    super()
  }
  /**
   * @public
   * @override
   * @method
   * @param {ol.Map} map The map on which to display the new layer
   * @param {string|Array<Object>} features The features from which to create the new layer
   * @param {string} projcs The projection
   * @return {ol.layer.Vector} The new layer
   */
  addToMap(map, features, projcs) {
    const options = {
      featureProjection: map.getView().getProjection().getCode(),
      dataProjection: this.customProj(projcs, proj4)
    }
    // customProj changes proj4.defs so we need to re-register
    olProjRegister(proj4);
    if (typeof features === 'object') {
      features = {type: 'FeatureCollection', features: features}
    }
    const source = new OlSourceVector()
    const layer = new OlLayerVector({source: source})
    source.addFeatures(new OlFormatGeoJSON().readFeatures(features, options))
    map.addLayer(layer)
    return layer
  }
}

