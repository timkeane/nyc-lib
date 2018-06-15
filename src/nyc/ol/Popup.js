/**
 * @module nyc/ol/Popup
 */

import $ from 'jquery'

import OlOverlay from 'ol/overlay'

import nyc from 'nyc'

/**
 * @desc A class to display popups on a map
 * @public
 * @class
 * @extends ol.Overlay
 * @see http://openlayers.org/en/latest/apidoc/ol.Overlay.html
 */
class Popup extends OlOverlay {
  /**
   * @desc Create an instance of Popup
   * @public
   * @constructor
   * @param {module:nyc/ol/Popup~Popup.Options} options Constructor options
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
     * @member {jQuery}
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
     * @member {jQuery}
     */
    this.content = this.popup.find('.content')
    this.popup.find('.btn-x').on('click tap', $.proxy(this.hide, this))
    this.popup.on('mouseover mousemove',  $.proxy(this.hideTip, this))
  }
  /**
   * @desc Show the popup
   * @public
   * @method
   * @param {module:nyc/ol/Popup~Popup.ShowOptions} options Overlay options
   */
  show(options) {
    this.setPosition(options.coordinate)
    if (options.html) {
      this.content.html(options.html)
      this.cssClass(options.css)
    }
    this.popup.fadeIn()
    $('.f-tip').fadeOut()
    this.pan()
  }
  /**
   * @desc Add a css class to the popup content
   * @public
   * @method
   * @param {string} css A css class
   */
  cssClass(css) {
    this.content.get(0).className = 'content'
    this.content.addClass(css)
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
   * @param {jQuery.Event}
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
    if (!this.fullscreen() && popup.css('display') !== 'none') {
      const view = this.map.getView()
      const tailHeight = parseInt(popup.css('bottom'))
      const tailOffsetLeft = -parseInt(popup.css('left'))
      const popOffset = this.getOffset()
      const popPx = this.map.getPixelFromCoordinate(this.getPosition())
      const mapSize = this.map.getSize()
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
      const px = this.map.getPixelFromCoordinate(center)
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
      view.animate({center: this.map.getCoordinateFromPixel(px)})
    }
  }
  fullscreen() {
    const map = $(this.map.getTargetElement())
    const pop = $(this.getElement())
    const content = this.content
    const clone = content.clone()
    if (pop.height() > map.height()) {
      const fullscreen = $('<div class="pop fullscreen"></div>').append(content)
      pop.append(clone)
      const btn = $('<button class="btn-rnd btn-x"><span class="screen-reader-only">Close</span></button>')
        .click(() => {
          fullscreen.fadeOut(() => {
            clone.remove()
            content.find('.dtl').not('.btn').slideUp()
            pop.append(content)
            fullscreen.remove()
          })
        })
      map.append(fullscreen.append(btn))
      fullscreen.fadeIn()
      return true
    }
  }
}

/**
 * @desc Options for {@link module:nyc/ol/Popup~Popup#show}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} html The popup content
 * @property {ol.coordinate} coordinate The popup location
 * @property {string=} css A css class
 */
Popup.ShowOptions

/**
 * @desc Constructor option for {@link module:nyc/ol/Popup~Popup}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 */
Popup.Options

/**
 * @private
 * @const {string}
 */
Popup.HTML = '<div class="pop">' +
  '<div class="content"></div>' +
  '<button class="btn-rnd btn-x"><span class="screen-reader-only">Dismiss popup</span></button>' +
'</div>'

export default Popup
