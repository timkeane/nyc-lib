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
        color: options.color || `#${icon.split('#')[1]}`
      }
    }
    return icon
  }
  /**
   * @desc Create an icon style
   * @public
   * @method
   * @param {module:nyc/ol/style/IconLib~IconLib.StyleOptions} options Icon style options
   * @param {ol.style.Style=} style The style on which to set the icon image
   * @return {ol.style.Style} The icon style
   */
  style(options, style) {
    const ico = this.parseIcon(options)
    const prefix = IconLib.LIBRARIES[ico.library].prefix
    const suffix = IconLib.LIBRARIES[ico.library].suffix
    const url = `${this.url}/${ico.library}/${prefix}${ico.name}${suffix}.svg`
    const scale = options.width / IconLib.LIBRARIES[ico.library].width
    const svg = this.svg[url]
    style = style || new Style({})
    if (!svg) {
      fetch(url).then(response => {
        response.text().then(txt => {
          this.svg[url] = $(txt)[2]
          this.style(options, style)
          this.trigger('icon-loaded', this)
        })
      })
    } else {
      const key = `${ico.library}-${ico.name}-${ico.color}`
      if (!this.icons[key]) {
        const div = $('<div></div>').html(svg)
        const css = div.find('svg').attr('style') || ''
        div.find('svg').attr('style', `${css};fill:${ico.color}`)
        this.icons[key] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(div.html())}`
      }
      style.setImage(new Icon({src: this.icons[key], scale}))
    }
    return style
  }
}

/**
 * @desc Option for {@link module:nyc/ol/style/IconLib~IconLib#style}
 * @public
 * @typedef {Object}
 * @property {string|module:nyc/ol/style/IconLib~IconLib.Icon} icon The icon in the following format 'library-name/icon-name#hexclr'
 * @property {number} width The icon width
 * @property {string=} color An override color for the icon
 */
IconLib.StyleOptions

/**
 * @desc Icon definition object
 * @public
 * @typedef {Object}
 * @property {string} library The icon library
 * @property {string} name The icon name
 * @property {string} color The icon color
 */
IconLib.Icon

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

export default IconLib
