/**
 * @module nyc/ol/Popup
 */

import $ from 'jquery'

import OlOverlay from 'ol/Overlay'
import {linear} from 'ol/easing'
import nyc from '../index'
import EventHandling from '../EventHandling'
/**
 * @desc A class to display popups on a map
 * @public
 * @class
 * @extends ol.Overlay
 * @see http://openlayers.org/en/latest/apidoc/module-ol_Overlay.html
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
      // stopEvent: true,
      autoPanMargin: options.autoPanMargin === undefined ? 10 : options.autoPanMargin,
      autoPanAnimation: options.autoPanAnimation === undefined ? {
        duration: 1000,
        easing: linear
      } : options.autoPanAnimation
    })
    const eventHandling = new EventHandling()
    this.on = $.proxy(eventHandling.on, eventHandling)
    this.one = $.proxy(eventHandling.one, eventHandling)
    this.off = $.proxy(eventHandling.off, eventHandling)
    this.trigger = $.proxy(eventHandling.trigger, eventHandling)
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
    /**
     * @private
     * @member {jQuery}
     */
    this.fullscreen = $(Popup.FULLSCREEN_HTML)
    /**
     * @private
     * @member {jQuery}
     */
    this.closeFullscreen = this.fullscreen.find('.btn-x')
    $(this.map.getTargetElement()).append(this.fullscreen)
    this.popup.find('.btn-x').on('click tap', $.proxy(this.hide, this))
    this.popup.on('mouseover mousemove', $.proxy(this.hideTip, this))
    $(window).resize($.proxy(this.isFullscreen, this))
  }
  /**
   * @desc Show the popup
   * @public
   * @method
   * @param {module:nyc/ol/Popup~Popup.ShowOptions} options Overlay options
   */
  show(options) {
    if (options.html) {
      this.content.html(options.html)
      this.cssClass(options.css)
    }
    this.setPosition(options.coordinate)
    this.popup.fadeIn($.proxy(this.pan, this))
    $('.f-tip').fadeOut()
    $(this.getElement()).attr('tabindex', 0).focus()
    this.trigger('show', this)
  }
  /**
   * @desc Set a CSS class for the popup content
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
    const me = this
    me.popup.fadeOut(() => {
      me.trigger('hide', me)
    })
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event Event object
   */
  hideTip(event) {
    event.stopPropagation()
    $('.f-tip').fadeOut()
  }
  /**
   * @desc Pan the popup so it full appears on the map
   * @public
   * @method
   */
  pan() {
    if (!this.isFullscreen() && this.popup.css('display') !== 'none') {
      this.panIntoView({margin: 10})
    }
  }
  /**
   * @private
   * @method
   * @returns {boolean} True if fullscreen
   */
  isFullscreen() {
    const pop = $(this.getElement())
    const map = $(this.map.getTargetElement())
    if (pop.height() > map.height()) {
      this.goFullscreen()
      return true
    }
  }

  /**
   * @desc Make the popup fill the map
   * @public
   * @method
   */
  goFullscreen() {
    const pop = $(this.getElement())
    const content = this.content
    const fullscreen = this.fullscreen
    const hide = $.proxy(this.hide, this)
    fullscreen.append(content)
    this.closeFullscreen.click(() => {
      fullscreen.fadeOut()
      pop.append(content)
      $('.fnd #lng').show()
    })
    fullscreen.fadeIn(hide)
    this.trigger('fullscreen', this)
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
 * @property {number} [autoPanMargin=10] The margin the popup will maintain from the edge of the map
 */
Popup.Options

/**
 * @private
 * @const {string}
 */
Popup.HTML = '<div class="pop">' +
  '<div class="content"></div>' +
  '<button class="btn btn-rnd btn-x">' +
    '<span class="screen-reader-only">Dismiss popup</span>' +
    '<span class="fas fa-times" role="img"></span>' +
  '</button>' +
'</div>'

/**
 * @private
 * @const {string}
 */
Popup.FULLSCREEN_HTML = '<div class="pop fullscreen">' +
  '<button class="btn btn-rnd btn-x">' +
    '<span class="screen-reader-only">Close</span>' +
    '<span class="fas fa-times" role="img"></span>' +
  '</button>' +
'</div>'

export default Popup
