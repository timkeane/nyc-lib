/**
 * @module nyc/ol/style/IconLib
 */

import $ from 'jquery'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'

class IconLib {
  constructor(url) {
    this.url = url || IconLib.URL
    this.icons = {}
  }
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

IconLib.HOST = 'https://maps.nyc.gov/nyc-lib/icons'

export default IconLib
