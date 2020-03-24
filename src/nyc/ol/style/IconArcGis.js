/**
 * @module nyc/ol/style/IconArcGis
 */

import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import fetchTimeout from 'nyc/fetchTimeout'

class IconArcGis {
  constructor(renderer) {
    if (renderer.type !== 'uniqueValue') {
      throw new Error('Only supports unique value rendering')
    }
    this.renderer = renderer
  }
  style(feature, width) {
    const style = new Style({})
    const values = []
    for (let i = 1; i < 4; i++) {
      const prop = this.renderer[`field${i}`]
      if (prop) {
        values.push(feature.get(prop))
      }
    }
    const value = values.join(',')

    this.renderer.uniqueValueInfos.some(info => {
      if (info.value === value) {
        const sym = info.symbol
        style.setImage(new Icon({
          src: `data:${sym.contentType};base64,${sym.imageData}`,
          scale: width / sym.width
        }))
        return true
      }
    })
    return style
  }
}

const error = (url, err) => {
  const e = Error(`Unable to load drawingInfo from ${url}`)
  e.cause = err
  return e
}

IconArcGis.fetch = url => {
  return new Promise((resolve, reject) => {
    fetchTimeout(url).then(response => {
      response.json().then(layerInfo => {
        try {
          resolve(new IconArcGis(layerInfo.drawingInfo.renderer))
        } catch (err) {
          reject(error(url, err))
        }
      })
    }).catch(err => {
      reject(error(url, err))
    })
  })
}
export default IconArcGis
