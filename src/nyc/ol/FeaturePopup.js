/**
 * @module nyc/ol/FeaturePopup
 */

import $ from 'jquery'

import olExtent from 'ol/extent'

import nyc from 'nyc/nyc'
import Popup from 'nyc/ol/Popup'

/**
 * @desc A class to display popups on a map
 * @public
 * @class
 * @extends {ol.Overlay}
 * @constructor
 * @see http://www.openlayers.org/
 */
class FeaturePopup extends Popup {
  /**
   * @desc Create an instance of FeaturePopup
   * @public
   * @constructor
   * @param {FeaturePopup.Options} options Constructor options
   * @see http://www.openlayers.org/
   */
  constructor(options) {
    super(options)
    this.layers = []
    this.addLayers(options.layers)
    this.map.on('click', $.proxy(this.mapClick, this))
  }
  /**
   * @desc Add a layer
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
  addLayer() {
    this.layers.push(layer)
    layer.set('popup-id', this.getId())
  }
  /**
   * @desc Show the popup
   * @public
   * @method
   * @param {ol.Feature} feature The feature
   * @param {ol.coordinate=} coordinate The coordinate
   */
  showFeature(feature, coordinate) {
    coordinate = coordinate || olExtent.getCenter(feature.getGeometry().getExtent())
    this.show({
      coordinate: coordinate,
      html: nyc.html(feature)
    })
  }
  /**
   * @method
   * @access protected
   * @param {ol.MapBrowserEvent} event
   */
  mapClick(event) {
    const id = this.getId()
    const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      if (layer.get('popup-id') === id) {
        return feature
      }
    })
    if (feature) this.showFeature(feature, event.coordinate)
  }
}

/**
 * @desc Object to hold constructor option for FeaturePopup
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 * @property {Array<ol.layer.Vector>} layers The layers
 */
FeaturePopup.Options

export default FeaturePopup
