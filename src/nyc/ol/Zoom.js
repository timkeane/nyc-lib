/**
 * @module nyc/ol/Zoom
 */

import $ from 'jquery'

import NycZoom from 'nyc/Zoom'

/**
 * @desc Class for providing a set of buttons to zoom and search.
 * @public
 * @class
 * @extends {module:nyc/Zoom~Zoom}
 */
class Zoom extends NycZoom {
  /**
   * @desc Create an instance of Zoom
   * @constructor
   * @param {ol.Map} map The OpenLayers map that will be controlled
   */
  constructor(map) {
    super($(map.getTargetElement()).find('.ol-overlaycontainer-stopevent'))
    /**
     * @private
     * @member {ol.Map}
     */
    this.map = map
    /**
     * @private
     * @member {ol.View}
     */
    this.view = map.getView()
    this.getContainer().on('click dblclick mouseover mousemove', () => {
      $('.f-tip').hide()
    })
  }
  /**
   * @desc Handle the zoom event triggered by user interaction
   * @public
   * @override
   * @method
   * @param {jQuery.Event} event The event triggered by the zoom buttons
   */
  zoom(event) {
    this.view.animate({
      zoom: this.view.getZoom() + ($(event.currentTarget).data('zoom-incr') * 1)
    })
  }
}

export default Zoom
