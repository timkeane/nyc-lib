/**
 * @module nyc/ol/style/IconLib
 */

import $ from 'jquery'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'

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
   * @param {string=} url The base URL for icon libraries
   */
  constructor(url) {
    this.url = url || IconLib.URL
    this.icons = {}
  }
  /**
   * @desc Create an icon style
   * @public
   * @method
   * @param {string} icon The icon in the following format 'library-name/icon-name#hexclr'
   * @param {number} width The icon width
   * @return {ol.style.Style} The icon style
   */
  style(icon, width) {
    const ico = icon.split('#')[0]
    const clr = icon.split('#')[1]
    const style = new Style({})
    const scale = width / 15
    let src = this.icons[icon]
    if (!src) {
      fetch(`${this.url}/${ico}-15.svg`).then(response => {
        response.text().then(txt => {
          const div = $('<div></div>').append($(txt)[2])
          div.find('svg').attr('style', `${div.find('svg').attr('style')};fill:#${clr}`)
          src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(div.html())}`
          this.icons[icon] = src
          style.setImage(new Icon({src, scale}))
        })
      })
    } else {
      style.setImage(new Icon({src, scale}))
    }
    return style
  }
}

/**
 * @private
 * @const
 * @type {string}
 */
IconLib.URL = 'https://maps.nyc.gov/nyc-lib/icons'

export default IconLib
