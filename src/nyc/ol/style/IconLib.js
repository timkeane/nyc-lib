/**
 * @module nyc/ol/style/IconLib
 */

import $ from 'jquery'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import Source from 'ol/source/Vector'

/**
 * @desc Class to load icons from a library
 * @public
 * @class
 */
class IconLib {
  /**
   * @desc Create an instance of IconLib
   * @public
   * @constructor
   * @param {string=} options The constructor options
   */
  constructor(options) {
    this.layer = options.layer
    this.url = options.url || IconLib.URL
    this.svg = {}
    this.icons = {}
  }
  /**
   * @private
   * @method
   * @param {module:nyc/ol/style/IconLib~IconLib.Icon|string} icon The icon
   * @returns {module:nyc/ol/style/IconLib~IconLib.Icon} The icon
   */
  parseIcon(icon) {
    if (typeof icon === 'string') {
      const ico = icon.split('#')[0]
      return {
        library: ico.split('/')[0],
        name: ico.split('/')[1],
        color: `#${icon.split('#')[1]}`
      }
    }
    return icon
  }
  /**
   * @desc Create an icon style
   * @public
   * @method
   * @param {Object|string} icon The icon in the following format 'library-name/icon-name#hexclr'
   * @param {number} width The icon width
   * @param {ol.style.Style=} style The style on which to set the icon image
   * @return {ol.style.Style} The icon style
   */
  style(icon, width, style) {
    const ico = this.parseIcon(icon)
    const prefix = IconLib.LIBRARIES[ico.library].prefix
    const suffix = IconLib.LIBRARIES[ico.library].suffix
    const url = `${this.url}/${ico.library}/${prefix}${ico.name}${suffix}.svg`
    const scale = width / IconLib.LIBRARIES[ico.library].width
    const svg = this.svg[url]
    style = style || new Style({})
    if (!svg) {
      fetch(url).then(response => {
        response.text().then(txt => {
          this.svg[url] = $(txt)[2]
          this.style(icon, width, style)
          const source = this.layer.getSource()
          this.layer.setSource(new Source())
          this.layer.setSource(source)
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

/**
 * @desc Constructor options for {@link module:nyc/ol/style.IconLib~IconLib}
 * @public
 * @typedef {Object}
 * @property {ol.layer.Vector} layer The layer that will use the style
 * @property {string=} url The URL for the icons
 */
IconLib.Options

export default IconLib
