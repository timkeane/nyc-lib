/**
 * @module nyc/ol/Geolocate
 */

import $ from 'jquery'

import NycGeolocate from 'nyc/Geolocate'

/**
 * @desc Class for providing a set of buttons to zoom and search.
 * @public
 * @class
 * @extends {module:nyc/Geolocate~Geolocate}
 * @fires module:nyc/Geolocate~Geolocate#geolocate
 */
class Geolocate extends NycGeolocate {
  /**
   * @desc Create an instance of Geolocate
   * @constructor
   * @param {ol.Map} map The OpenLayers map that will be controlled
   */
  constructor(map) {
    super($(map.getTargetElement()).find('.ol-overlaycontainer-stopevent'))
    this.getContainer().on('click dblclick mouseover mousemove', () => {
      $('.f-tip').hide()
    })
  }
}

export default Geolocate
