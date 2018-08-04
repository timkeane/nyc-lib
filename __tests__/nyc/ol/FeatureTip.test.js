import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlFeature from 'ol/Feature'
import OlGeomPoint from 'ol/geom/Point'
import OlSourceVector from 'ol/source/Vector'
import OlLayerVector from 'ol/layer/Vector'
import OlOverlay from 'ol/Overlay'

import FeatureTip from 'nyc/ol/FeatureTip'

let map
let tips
let layer0
let layer1
let layer2
let target
beforeEach(() => {
  $.resetMocks()
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
        new OlFeature({geometry: new OlGeomPoint([0, 3]), name: 'Feature iii'}),
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
          return result
        }
      }
    }
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
  expect.assertions(10)

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
  expect.assertions(4)

  const tip = new FeatureTip({map: map, tips: tips})

  tip.tip.show()
  expect(tip.tip.css('display')).toBe('block')

  tip.hide()
  expect(tip.tip.css('display')).toBe('none')
  expect($.mocks.fadeOut).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeOut.mock.instances[0].get(0)).toBe(tip.tip.get(0))
})

test('label with css', () => {
  expect.assertions(4)

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
})

test('label no css', () => {
  expect.assertions(3)

  const event = {
    type: 'pointermove',
    pixel: 'mockPixelFor-1,0',
    coordinate: [1, 0]
  }

  const tip = new FeatureTip({map: map, tips: tips})

  tip.position = jest.fn()

  tip.tip.hide()

  map.dispatchEvent(event)

  expect(tip.tip.html()).toBe('Layer One - Feature One')
  expect(tip.tip.css('display')).toBe('block')

  expect(tip.position).toHaveBeenCalledTimes(1)
})

test('label no label', () => {
  expect.assertions(3)

  const event = {
    type: 'pointermove',
    pixel: 'mockPixelFor-0,3',
    coordinate: [0, 3]
  }

  const tip = new FeatureTip({map: map, tips: tips})

  tip.position = jest.fn()
  tip.hide = jest.fn()

  map.dispatchEvent(event)

  expect(tip.tip.html()).toBe('')
  expect(tip.hide).toHaveBeenCalledTimes(1)
  expect(tip.position).toHaveBeenCalledTimes(0)
})

test('position bottom-right', () => {
  expect.assertions(1)

  const tip = new FeatureTip({map: map, tips: tips})

  tip.tip.css({width: '100px', height: '20px'}).show()
  tip.setPosition([0, 0])

  tip.map.getPixelFromCoordinate = jest.fn()
  tip.map.getPixelFromCoordinate.mockReturnValueOnce([50, 50])
  tip.map.getGetSize = jest.fn()
  tip.map.getGetSize.mockReturnValueOnce([200, 200])

  tip.position()

  expect(tip.getPositioning()).toBe('top-left')
})

test('position bottom-right', () => {
  expect.assertions(1)
  
  const tip = new FeatureTip({map: map, tips: tips})

  tip.tip.css({width: '100px', height: '20px'}).show()
  tip.setPosition([0, 0])

  tip.map.getPixelFromCoordinate = jest.fn()
  tip.map.getPixelFromCoordinate.mockReturnValueOnce([150, 50])
  tip.map.getSize = jest.fn()
  tip.map.getSize.mockReturnValueOnce([200, 200])

  tip.position()

  expect(tip.getPositioning()).toBe('top-right')
})

test('position bottom-right', () => {
  expect.assertions(1)
  
  const tip = new FeatureTip({map: map, tips: tips})

  tip.tip.css({width: '100px', height: '20px'}).show()
  tip.setPosition([0, 0])

  tip.map.getPixelFromCoordinate = jest.fn()
  tip.map.getPixelFromCoordinate.mockReturnValueOnce([150, 190])
  tip.map.getSize = jest.fn()
  tip.map.getSize.mockReturnValueOnce([200, 200])

  tip.position()

  expect(tip.getPositioning()).toBe('bottom-right')
})

test('position bottom-right', () => {
  expect.assertions(1)
  
  const tip = new FeatureTip({map: map, tips: tips})

  tip.tip.css({width: '100px', height: '20px'}).show()
  tip.setPosition([0, 0])

  tip.map.getPixelFromCoordinate = jest.fn()
  tip.map.getPixelFromCoordinate.mockReturnValueOnce([50, 190])
  tip.map.getSize = jest.fn()
  tip.map.getSize.mockReturnValueOnce([200, 200])

  tip.position()

  expect(tip.getPositioning()).toBe('bottom-left')
})

describe('out', () => {
  let inMap
  let notInMap
  beforeEach(() => {
    inMap = $('<div>in</div>')
    notInMap = $('<div>out</div>')
    $(map.getTargetElement()).append(inMap)
    $('body').append(notInMap)
  })
  afterEach(() => {
    inMap.remove()
    notInMap.remove()
  })

  test('out triggered by document mouseover', () => {
    expect.assertions(2)
  
    const tip = new FeatureTip({map: map, tips: tips})
  
    $(tip.getElement()).show()

    $(document).trigger({type: 'mouseover', target: inMap.get(0)})

    expect($(tip.getElement()).css('display')).toBe('block')

    $(document).trigger({type: 'mouseover', target: notInMap.get(0)})

    expect($(tip.getElement()).css('display')).toBe('none')
  })
})
