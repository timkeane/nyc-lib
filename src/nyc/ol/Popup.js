/**
 * @module nyc/ol/Popup
 */

import $ from 'jquery'

import OlOverlay from 'ol/overlay'

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
    /**
     * @public
     * @member {Array<number>}
     */
    this.margin = [10, 10, 10, 10]
    /**
     * @private
     * @member {JQuery}
     */
    this.popup = $(this.getElement())
    /**
     * @private
     * @member {ol.Map}
     */
    this.map = options.map
    this.setMap(this.map)
    /**
     * @private
     * @member {JQuery}
     */
    this.content = this.popup.find('.content')
    this.popup.find('.btn-x').on('click tap', $.proxy(this.hide, this))
    this.popup.on('mouseover mousemove',  $.proxy(this.hideTip, this))
  }
  /**
   * @desc Show the popup
   * @public
   * @method
   * @param {Popup.ShowOptions} options Overlay options
   */
  show(options) {
    this.setPosition(options.coordinate)
    if (options.html) {
      this.content.html(options.html)
    }
    this.popup.fadeIn()
    $('.f-tip').fadeOut()
    this.pan()
  }
  /**
   * @desc Hide the popup
   * @public
   * @method
   */
  hide() {
    this.popup.fadeOut()
  }
  /**
   * @private
   * @method
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
    console.warn(popup.css('display'));
    if (popup.css('display') !== 'none') {
      const view = this.map.getView()
      const tailHeight = parseInt(popup.css('bottom'))

      console.warn('tailHeight',tailHeight)

      const tailOffsetLeft = -parseInt(popup.css('left'))
      const popOffset = this.getOffset()
      const popPx = this.map.getPixelFromCoordinate(this.getPosition())

      console.warn('popPx', popPx);

      const mapSize = this.map.getSize()
      const popSize = {
        width: popup.width(),
        height: popup.height() + tailHeight
      }
      const tailOffsetRight = popSize.width - tailOffsetLeft

      console.warn('tailOffsetLeft', tailOffsetLeft);
      console.warn('popSize', popSize);
      console.warn('tailOffsetRight', tailOffsetRight);

      const fromLeft = (popPx[0] - tailOffsetLeft) - this.margin[3]
      const fromRight = mapSize[0] - (popPx[0] + tailOffsetRight) - this.margin[1]
      const fromTop = popPx[1] - popSize.height + popOffset[1] - this.margin[0]
      const fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1] - this.margin[2]
      const center = view.getCenter()
      const px = this.map.getPixelFromCoordinate(center)

      console.warn('fromRight',fromRight);
      console.warn('fromLeft',fromLeft);
      console.warn('fromTop',fromTop);
      console.warn('fromBottom',fromBottom);

      console.error('px before', px)

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

      console.error('px after', px)

      view.animate({center: this.map.getCoordinateFromPixel(px)})
    }
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
 */
Popup.Options

Popup.HTML = '<div class="pop">' +
  '<button class="btn-rnd btn-x"><span class="screen-reader-only">Close</span></button>' +
  '<div class="content"></div>' +
'</div>'

export default Popup
