import $ from 'jquery'

import OlMap from 'ol/map'
import OlView from 'ol/view'
import OlFeature from 'ol/feature'
import OlGeomPoint from 'ol/geom/Point'
import OlSourceVector from 'ol/source/vector'
import OlLayerVector from 'ol/layer/vector'
import OlOverlay from 'ol/overlay'

import FeatureTip from 'nyc/ol/FeatureTip'

let map
let tips
let layer0
let layer1
let layer2
let target
beforeEach(() => {
  target = $('<div></div>').css({width: '200px', height: '200px'})
  $('body').append(target)
  map = new OlMap({
    target: target.get(0),
    view: new OlView({
      center: [0, 0],
      zoom: 0
    })
  })

  layer0 = new OlLayerVector({
    source: new OlSourceVector({
      features: [
        new OlFeature({geometry: new OlGeomPoint([1, 0]), name: 'Feature One'}),
        new OlFeature({geometry: new OlGeomPoint([2, 0]), name: 'Feature Two'}),
        new OlFeature({geometry: new OlGeomPoint([3, 0]), name: 'Feature Three'}),
      ]
    })
  })
  layer0.set('name', 'layer0')
  map.addLayer(layer0)
  layer1 = new OlLayerVector({
    source: new OlSourceVector({
      features: [
        new OlFeature({geometry: new OlGeomPoint([0, 0]), name: 'Feature A'}),
        new OlFeature({geometry: new OlGeomPoint([0, 1]), name: 'Feature B'}),
        new OlFeature({geometry: new OlGeomPoint([0, 2]), name: 'Feature C'}),
      ]
    })
  })
  layer1.set('name', 'layer1')
  map.addLayer(layer1)
  layer2 = new OlLayerVector({
    source: new OlSourceVector({
      features: [
        new OlFeature({geometry: new OlGeomPoint([0, 0]), name: 'Feature i'}),
        new OlFeature({geometry: new OlGeomPoint([0, 1]), name: 'Feature ii'}),
        new OlFeature({geometry: new OlGeomPoint([0, 2]), name: 'Feature iii'}),
      ]
    })
  })
  layer2.set('name', 'layer2')
  map.addLayer(layer2)

  map.forEachFeatureAtPixel = (mockPixel, callback) => {
    const layers = [layer0, layer1, layer2]
    for (let i = 0; i < layers.length; i++) {
      const features = layers[i].getSource().getFeatures()
      for (let j = 0; j < features.length; j++) {
        const coord = features[j].getGeometry().getCoordinates()
        if (coord.toString() === mockPixel.split('-')[1]) {
          const result = callback(features[j], layers[i])
          console.warn(result)
          return result
        }
      }
    }
  }
  map.getPixelFromCoordinate = (coord) => {

  }

  tips = [{
    layer: layer0,
    label: (feature) => {
      return {
        html: `Layer One - ${feature.get('name')}`
      }
    }
  },{
    layer: layer1,
    label: (feature) => {
      return {
        html: `Layer Two - ${feature.get('name')}`,
        css: 'my-tip'
      }
    }  
  }]
})

afterEach(() => {
  target.remove()
})

test('constructor', () => {
  const tip = new FeatureTip({map: map, tips: tips})

  expect(tip instanceof OlOverlay).toBe(true)
  expect(tip instanceof FeatureTip).toBe(true)
  expect(tip.map).toBe(map)
  expect(tip.getMap()).toBe(map)
  expect(tip.getId()).toBe('FeatureTip-0')
  expect(tip.tip.get(0)).toBe(tip.getElement())
  expect(tip.tip.hasClass('f-tip')).toBe(true)
  expect(layer0.nycTip).toBe(tips[0].label)
  expect(layer1.nycTip).toBe(tips[1].label)
  expect(layer2.nycTip).toBe(undefined)
})

test('hide', () => {
  const tip = new FeatureTip({map: map, tips: tips})
  
  tip.tip.show()
  expect(tip.tip.css('display')).toBe('block')

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tip.tip.css('display'))
      }, 500)
    })
  }

  tip.hide()

  return test().then(visible => expect(visible).toBe('none'))
})

test('label', () => {
  const event = {
    type: 'pointermove',
    pixel: 'mockPixelFor-0,0',
    coordinate: [0, 0]
  }

  const tip = new FeatureTip({map: map, tips: tips})

  tip.position = jest.fn()

  tip.tip.hide()

  map.dispatchEvent(event)

  expect(tip.tip.html()).toBe('Layer Two - Feature A')
  expect(tip.tip.css('display')).toBe('block')
  expect(tip.tip.hasClass('my-tip')).toBe(true)

  expect(tip.position).toHaveBeenCalledTimes(1)
  expect(tip.position.mock.calls[0][0]).toBe(event.pixel)
})