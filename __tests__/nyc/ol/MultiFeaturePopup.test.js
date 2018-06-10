import OlMap from 'ol/map'
import OlView from 'ol/view'
import OlFeature from 'ol/feature'
import OlGeomPoint from 'ol/geom/point'

import ItemPager from 'nyc/ItemPager'
import Popup from 'nyc/ol/Popup'
import FeaturePopup from 'nyc/ol/FeaturePopup'
import MultiFeaturePopup from 'nyc/ol/MultiFeaturePopup'

class MockLayer {
  set(prop, val) {
    this[prop] = val
  }
  get(prop) {
    return this[prop]
  }
}
const mockLayers = [new MockLayer(), new MockLayer()]
const mockLayer = new MockLayer()
let map
let tip
let target
const show = Popup.prototype.show
const pan = Popup.prototype.pan
beforeEach(() => {
  Popup.prototype.show = jest.fn()
  Popup.prototype.pan = jest.fn()
  tip = $('<div class="f-tip"></div>')
  $('body').append(tip)
  target = $('<div></div>').css({width: '500px', height: '500px'})
  $('body').append(target)
  map = new OlMap({
    target: target.get(0),
    view: new OlView({
      center: [0, 0],
      zoom: 0
    })
  })
})
afterEach(() => {
  Popup.prototype.show = show
  Popup.prototype.pan = pan
  target.remove()
  tip.remove()
})

test('constructor', () => {
  expect.assertions(8)

  const popup = new MultiFeaturePopup({
    map: map,
    layers: mockLayers
  })

  expect(popup.getId()).toBe('Popup-0')
  expect(popup.pager instanceof ItemPager).toBe(true)
  expect(popup.layers.length).toBe(mockLayers.length)
  expect(popup.layers[0]).toBe(mockLayers[0])
  expect(popup.layers[0]['popup-id']).toBe(popup.getId())
  expect(popup.layers[1]).toBe(mockLayers[1])
  expect(popup.layers[1]['popup-id']).toBe(popup.getId())

  popup.pager.item = {}
  popup.pager.trigger('change', popup.pager)

  expect(Popup.prototype.pan).toHaveBeenCalledTimes(1)
})

test('showFeatures no coordinate', () => {
  expect.assertions(4)

  const features = [
    new OlFeature({geometry: new OlGeomPoint([0, 0])}),
    new OlFeature({geometry: new OlGeomPoint([0, 1])}),
    new OlFeature({geometry: new OlGeomPoint([0, 2])})
  ]
  const popup = new MultiFeaturePopup({
    map: map,
    layers: mockLayers
  })

  popup.pager.show = jest.fn()

  popup.showFeatures(features)

  expect(popup.pager.show).toHaveBeenCalledTimes(1)
  expect(popup.pager.show.mock.calls[0][0]).toBe(features)

  expect(Popup.prototype.show).toHaveBeenCalledTimes(1)
  expect(Popup.prototype.show.mock.calls[0][0].coordinate).toEqual([0, 0])
})

test('showFeatures has coordinate', () => {
  expect.assertions(4)

  const features = [
    new OlFeature({geometry: new OlGeomPoint([0, 0])}),
    new OlFeature({geometry: new OlGeomPoint([0, 1])}),
    new OlFeature({geometry: new OlGeomPoint([0, 2])})
  ]
  const popup = new MultiFeaturePopup({
    map: map,
    layers: mockLayers
  })

  popup.pager.show = jest.fn()

  popup.showFeatures(features, [1, 1])

  expect(popup.pager.show).toHaveBeenCalledTimes(1)
  expect(popup.pager.show.mock.calls[0][0]).toBe(features)

  expect(Popup.prototype.show).toHaveBeenCalledTimes(1)
  expect(Popup.prototype.show.mock.calls[0][0].coordinate).toEqual([1, 1])
})

test('paged', () => {
  expect.assertions(4)

  const popup = new MultiFeaturePopup({
    map: map,
    layers: mockLayers
  })

  popup.cssClass = jest.fn()

  popup.paged({item: {}})

  expect(popup.cssClass).toHaveBeenCalledTimes(1)
  expect(popup.cssClass.mock.calls[0][0]).toBe('')
  
  popup.paged({item: {cssClass: () => {return 'css'}}})

  expect(popup.cssClass).toHaveBeenCalledTimes(2)
  expect(popup.cssClass.mock.calls[1][0]).toBe('css')
})

test('mapClick has features', () => {
  expect.assertions(3)

  const features = ['f0', 'f1', 'f2']

  map.forEachFeatureAtPixel = (pixel, callback) => {
    for (let i = 0; i < mockLayers.length; i++) {
        callback(features[i], mockLayers[1])
    }
    return callback(features[2], mockLayer)
  }

  const popup = new MultiFeaturePopup({
    map: map,
    layers: mockLayers
  })

  popup.showFeatures = jest.fn()

  popup.mapClick({pixel: 'hit', coordinate: 'coord'})

  expect(popup.showFeatures).toHaveBeenCalledTimes(1)
  expect(popup.showFeatures.mock.calls[0][0]).toEqual(['f0', 'f1'])
  expect(popup.showFeatures.mock.calls[0][1]).toBe('coord')
})

test('mapClick no features', () => {
  expect.assertions(1)

  map.forEachFeatureAtPixel = (pixel, callback) => {
    return null
  }

  const popup = new MultiFeaturePopup({
    map: map,
    layers: mockLayers
  })

  popup.showFeatures = jest.fn()

  popup.mapClick({pixel: 'hit', coordinate: 'coord'})

  expect(popup.showFeatures).toHaveBeenCalledTimes(0)
})

test('showFeature', () => {
  expect.assertions(2)

  const popup = new MultiFeaturePopup({
    map: map,
    layers: mockLayers
  })

  popup.showFeatures = jest.fn()

  popup.showFeature('mock-feature')

  expect(popup.showFeatures).toHaveBeenCalledTimes(1)
  expect(popup.showFeatures.mock.calls[0][0]).toEqual(['mock-feature'])
})

