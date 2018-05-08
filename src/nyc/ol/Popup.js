/**
 * @module nyc/ol/Popup
 */

import $ from 'jquery'

import OlOverlay from 'ol/overlay'
import olExtent from 'ol/extent'

import nyc from 'nyc/nyc'

/**
 * @desc A class to display popups on a map
 * @public
 * @class
 * @extends {ol.Overlay}
 * @constructor
 * @see http://www.openlayers.org/
 */
class Popup extends OlOverlay {
  /**
   * @desc Create an instance of Popup
   * @public
   * @constructor
   * @param {Popup.Options} options Constructor options
   * @see http://www.openlayers.org/
   */
  constructor(options) {
    super({
      id: nyc.nextId('Popup'),
      element: $(Popup.HTML).get(0),
      stopEvent: true
    })
    this.popup = $(this.getElement())
    this.map = options.map
    this.layers = []
    this.addLayers(options.layers)
    this.setMap(this.map)
    this.map.on('click', $.proxy(this.mapClick, this))
    this.popup.find('button').on('click tap', $.proxy(this.hide, this))
    this.popup.on('mouseover mousemove',  $.proxy(this.hideTip, this))
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
   * @param {Array<ol.Feature>} features The features
   */
  showFeatures(features) {
    if (features.length) {
      const feature = features[0]
      this.show({
        coordinate: olExtent.getCenter(feature.getGeometry().getExtent()),
        html: this.html(feature)
      })
    }
  }
  /**
   * @private
   * @param {ol.Feature} feature 
   * @returns {JQuery}
   */
  html(feature) {
    let html
    if (typeof feature.html === 'function') {
      html = $(feature.html())
    } else {
      html = $('<div class="f-pop"></div>')
      Object.keys(feature.getProperties()).forEach(prop => {
        html.append(`<div class="prop"><div>${prop}</div><div>${feature.get(prop)}</div></div>`)
      })
    }
    return html
  }
  /**
   * @desc Show the popup
   * @public
   * @method
   * @param {Popup.ShowOptions} options Overlay options
   */
  show(options) {
    this.setPosition(options.coordinate)
    this.popup.find('.content').html(options.html)
    this.popup.fadeIn()
    $('.f-tip').fadeOut()
    this.pan()
  }
  /**
   * @desc Hide the popup 
   * @method
   * @public
   */
  hide() {
    this.popup.fadeOut()
  }
  /**
   * @private
   * @public
   * @param {JQuery.Event}
   */
  hideTip(event) {
    event.stopPropagation()
    $('.f-tip').fadeOut()
  }
  /**
   * @private
   * @method
   */
  pan() {
    const popup = this.popup
    if (popup.css('display') !== 'none') {
      const map = this.getMap()
      const view = map.getView()
      const tailHeight = parseInt(popup.css('bottom'))
      const tailOffsetLeft = -parseInt(popup.css('left'))
      const popOffset = this.getOffset()
      const popPx = map.getPixelFromCoordinate(this.getPosition())
      const mapSize = map.getSize()
      const popSize = {
        width: popup.width(),
        height: popup.height() + tailHeight
      }
      const tailOffsetRight = popSize.width - tailOffsetLeft
      const fromLeft = (popPx[0] - tailOffsetLeft) - this.margin[3]
      const fromRight = mapSize[0] - (popPx[0] + tailOffsetRight) - this.margin[1]
      const fromTop = popPx[1] - popSize.height + popOffset[1] - this.margin[0]
      const fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1] - this.margin[2]
      const center = view.getCenter()
      const px = map.getPixelFromCoordinate(center)
      
      if (fromRight < 0) {
        px[0] -= fromRight
      } else if (fromLeft < 0) {
        px[0] += fromLeft
      }
      if (fromTop < 0) {
        px[1] += fromTop
      } else if (fromBottom < 0) {
        px[1] -= fromBottom
      }
      view.animate({center: map.getCoordinateFromPixel(px)})
    }
  }
  /**
   * @private
   * @param {ol.MapBrowserEvent} event 
   */
  mapClick(event) {
    const pop = this
    const features = []
    this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      if (layer.get('popup-id') === pop.getId()) {
        features.push(feature)
      }
    })
    this.showFeatures(features)
  }
}

/**
 * @desc Object to hold options for showing the popup
 * @public
 * @typedef {Object}
 * @property {JQuery|Element|string} html The popup content
 * @property {ol.coordinate} html The popup location
 */
Popup.ShowOptions

/**
 * @desc Object to hold constructor option for Popup
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 * @property {Array<ol.layer.Vector>} layers The layers
 */
Popup.Options

Popup.HTML = '<div class="pop">' +
  '<button class="btn-rnd btn-clr"><span class="screen-reader-only">Close</span></button>' +
  '<div class="content"></div>' +
'</div>'

export default Popup