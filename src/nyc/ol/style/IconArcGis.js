/**
 * @module nyc/ol/style/IconArcGis
 */

import $ from 'jquery'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'

//https://services1.arcgis.com/8cuieNI8NbqQZQVJ/ArcGIS/rest/services/CCs_test_for_DoITT/FeatureServer/0/?f=pjson&token=_4vEnhiWZZLtLpwt0uooePbbomuF-tlBpHsyzEhj0UBZjrePC5uxz3sG5HXuVT0yCyh8JFDdX8NbVFPZAIq2CZ5T-ABEmAoYdmMP2J_2zVbqJ-uAZBFfmu7ZQr7f1zA13TfGlgPL-ORBKNk9WWLSaQ

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
    const value = values.concat(',')
    this.renderer.uniqueValueInfos.some(info => {
      if (info.value === value) {
        const sym = info.symbol
        style.setIcon(new Icon({
          src: `data:${sym.contentType};base64,${sym.imageData}`,
          scale: width / sym.width
        }))
        return true
      }
    })
    return style
  }
}

const error = err => {
  const error = Error(`Unable to load drawingInfo from ${url}`)
  error.cause = err
  return error
}

IconArcGis.fetch = url => {
  return new Promise((resolve, reject) => {
    fetchTimeout(url).then(response => {
      response.json().then(layerInfo => {
        try {
          resolve(new IconArcGis(layerInfo.drawingInfo.renderer))
        } catch(err) {
          reject(error(err))
        }
      })
    }).catch(err => {
      reject(error(err))
    })
  })
}