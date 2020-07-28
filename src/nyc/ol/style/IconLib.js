/**
 * @module nyc/ol/style/IconLib
 */

import $ from 'jquery'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import EventHandling from 'nyc/EventHandling'


/**
 * @desc Class to load icons from a library
 * @public
 * @class
 */
class IconLib extends EventHandling {
  /**
   * @desc Create an instance of IconLib
   * @public
   * @constructor
   * @param {url=} url The URL to the icon library
   */
  constructor(url) {
    super()
    this.url = url || IconLib.URL
    this.svg = {}
    this.icons = {}
  }
  /**
   * @private
   * @method
   * @param {module:nyc/ol/style/IconLib~IconLib.StyleOptions} options The icon style options
   * @returns {module:nyc/ol/style/IconLib~IconLib.Icon} The icon
   */
  parseIcon(options) {
    const icon = options.icon
    if (typeof icon === 'string') {
      const ico = icon.split('#')[0]
      return {
        library: ico.split('/')[0],
        name: ico.split('/')[1],
        fill: options.fill || `#${icon.split('#')[1]}`,
        stroke: options.stroke
      }
    }
    return icon
  }
  /**
   * @desc Create an icon style
   * @public
   * @method
   * @param {module:nyc/ol/style/IconLib~IconLib.Icon} options The style options
   * @param {ol.style.Style=} style The style on which to set the icon image
   * @return {ol.style.Style} The icon style
   */
  style(options, style) {
    const ico = this.parseIcon(options)
    const prefix = IconLib.LIBRARIES[ico.library].prefix
    const suffix = IconLib.LIBRARIES[ico.library].suffix
    const url = `${this.url}/${ico.library}/${prefix}${ico.name}${suffix}.svg`
    const svg = this.svg[url]
    style = style || new Style({})
    if (!svg) {
      fetch(url).then(response => {
        if (response.ok) {
          response.text().then(txt => {
            this.svg[url] = $(txt)[2]
            this.style(options, style)
            this.trigger('icon-loaded', style)
          })
        } else {
          this.svg[url] = IconLib.NOT_FOUND_ICON.svg
          this.style(options, style)
          console.error('Icon not found', url)
          this.trigger('icon-not-found', this)
        }
      })
    } else {
      const key = `${ico.library}-${ico.name}-${ico.fill}`
      let scale = options.width / IconLib.LIBRARIES[ico.library].width
      if (svg === IconLib.NOT_FOUND_ICON.svg) {
        scale = options.width / IconLib.NOT_FOUND_ICON.width
      }
      if (!this.icons[key]) {
        const div = $('<div></div>').html(svg)
        if (svg !== IconLib.NOT_FOUND_ICON.svg) {
          const stroke = ico.stroke
          const css = div.find('svg').attr('style') || ''
          let cssAdd = `fill:${ico.fill}`
          if (stroke) {
            cssAdd = `${cssAdd};stroke-width:${stroke.width};stroke:${stroke.color}`
          }
          div.find('svg').attr('style', `${css};${cssAdd}`)
        }
        this.icons[key] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(div.html())}`
      }
      style.setImage(new Icon({src: this.icons[key], scale}))
    }
    return style
  }
}

/**
 * @desc Icon definition object
 * @public
 * @typedef {Object}
 * @property {string} library The icon library
 * @property {string} name The icon name
 * @property {string} fill The icon fill color
 * @property {module:nyc/ol/style/IconLib~IconLib.Stroke} stroke The icon stroke
 */
IconLib.Icon

/**
 * @desc Icon definition object
 * @public
 * @typedef {Object}
 * @property {number} width The width
 * @property {string} color The stroke color
 */
IconLib.Stroke

/**
 * @private
 * @const
 * @type {string}
 */
IconLib.URL = 'https://maps.nyc.gov/nyc-lib/icons'

/**
 * @public
 * @const
 * @type {string}
 */
IconLib.LIBRARIES = {
  'mapbox-maki': {
    width: 15,
    prefix: '',
    suffix: '-15'
  }
}

/**
 * @desc Default icon when requested icon is unavailable
 * @const
 * @type {Object}
 */
IconLib.NOT_FOUND_ICON = {
  svg: '<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32"><circle cx="16" cy="16" r="14" stroke="#000" stroke-width="2" fill="rgba(0,0,0,.5)" /></svg>',
  width: 32
}

/**
 * @desc Option for {@link module:nyc/ol/style/IconLib~IconLib#style}
 * @public
 * @typedef {Object}
 * @property {string|module:nyc/ol/style/IconLib~IconLib.Icon} icon The icon
 * @property {number} width The icon width
 * @property {string=} fill An override color for the icon
 * @property {module:nyc/ol/style/IconLib~IconLib.Stroke=} stroke An override color for the stroke
 */
IconLib.StyleOptions

export default IconLib
