/**
 * @module nyc/ol/FeaturePopup
 */

import $ from 'jquery'

import {getCenter as olExtentGetCenter} from 'ol/extent'
import nyc from 'nyc'
import Popup from 'nyc/ol/Popup'

/**
 * @desc A class to display popups on a map that display feature data
 * @public
 * @class
 * @extends module:nyc/ol/Popup~Popup
 */
class FeaturePopup extends Popup {
  /**
   * @desc Create an instance of FeaturePopup
   * @public
   * @constructor
   * @param {module:nyc/ol/FeaturePopup~FeaturePopup.Options} options Constructor options
   */
  constructor(options) {
    super(options)
    /**
     * @private
     * @member {Array<ol.layer.Vector>}
     */
    this.layers = []
    this.addLayers(options.layers)
    this.map.on('click', $.proxy(this.mapClick, this))
  }
  /**
   * @desc Add layers
   * @public
   * @method
   * @param {Array<ol.layer.Vector>} layers The layers to add
   */
  addLayers(layers) {
    layers.forEach(layer => {
      this.addLayer(layer)
    })
  }
  /**
   * @desc Add a layer
   * @public
   * @method
   * @param {ol.layer.Vector} layer The layer to add
   */
  addLayer(layer) {
    this.layers.push(layer)
    layer.set('popup-id', this.getId())
  }
  /**
   * @desc Show the HTML rendered feature in the popup
   * @public
   * @method
   * @param {ol.Feature} feature The feature
   * @param {ol.Coordinate=} coordinate The coordinate
   */
  showFeature(feature, coordinate) {
    coordinate = coordinate || olExtentGetCenter(feature.getGeometry().getExtent())
    this.show({
      coordinate: coordinate,
      html: nyc.html(feature),
      css: feature.cssClass ? feature.cssClass() : ''
    })
  }
  /**
   * @desc Handles map click events
   * @method
   * @access protected
   * @param {ol.MapBrowserEvent} event OpenLayers map browser event
   */
  mapClick(event) {
    const id = this.getId()
    const result = this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      if (layer.get('popup-id') === id) {
        return feature
      }
    })
    if (result) {
      this.showFeature(result, event.coordinate)
    }
  }
}

/**
 * @desc Constructor option for {@link module:nyc/ol/FeaturePopup~FeaturePopup}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 * @property {Array<ol.layer.Vector>} layers The layers for which the popup will report feature properties
 */
FeaturePopup.Options

export default FeaturePopup
