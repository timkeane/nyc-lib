import OlMap from 'ol/map'
import OlView from 'ol/view'
import OlFeature from 'ol/feature'
import OlGeomPoint from 'ol/geom/point'

import Popup from 'nyc/ol/Popup'
import FeaturePopup from 'nyc/ol/FeaturePopup'

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

describe('constructor', () => {
  const mapClick = FeaturePopup.prototype.mapClick
  beforeEach(() => {
    FeaturePopup.prototype.mapClick = jest.fn()
  })
  afterEach(() => {
    FeaturePopup.prototype.mapClick = mapClick
  })

  test('constructor', () => {
    expect.assertions(7)

    const popup = new FeaturePopup({
      map: map,
      layers: mockLayers
    })

    expect(popup.getId()).toBe('Popup-0')
    expect(popup.layers.length).toBe(mockLayers.length)
    expect(popup.layers[0]).toBe(mockLayers[0])
    expect(popup.layers[0]['popup-id']).toBe(popup.getId())
    expect(popup.layers[1]).toBe(mockLayers[1])
    expect(popup.layers[1]['popup-id']).toBe(popup.getId())

    map.dispatchEvent({type: 'click'})

    expect(FeaturePopup.prototype.mapClick).toHaveBeenCalledTimes(1)
  })
})

test('showFeature has coordinate', () => {
  expect.assertions(4)
  
  const feature = new OlFeature({
    geometry: new OlGeomPoint([0, 0])
  })
  feature.cssClass = () => {
    return 'css'
  }
  feature.html = () => {
    return '<div>html</div>'
  }
  const popup = new FeaturePopup({
    map: map,
    layers: mockLayers
  })

  popup.show = jest.fn()

  popup.showFeature(feature, [1, 1])

  expect(popup.show).toHaveBeenCalledTimes(1)
  expect(popup.show.mock.calls[0][0].css).toBe('css')
  expect(popup.show.mock.calls[0][0].html.html()).toBe('html')
  expect(popup.show.mock.calls[0][0].coordinate).toEqual([1, 1])
})

test('showFeature no coordinate', () => {
  expect.assertions(3)

  const feature = new OlFeature({
    geometry: new OlGeomPoint([0, 0])
  })
  feature.html = () => {
    return '<div>html</div>'
  }
  const popup = new FeaturePopup({
    map: map,
    layers: mockLayers
  })

  popup.show = jest.fn()

  popup.showFeature(feature)

  expect(popup.show).toHaveBeenCalledTimes(1)
  expect(popup.show.mock.calls[0][0].html.html()).toBe('html')
  expect(popup.show.mock.calls[0][0].coordinate).toEqual([0, 0])
})

test('mapClick', () => {
  expect.assertions(3)

  const feature = {}

  map.forEachFeatureAtPixel = (pixel, callback) => {
    if (pixel === 'hit'){
      return callback(feature, mockLayers[0])
    } else {
      return callback(feature, mockLayer)
    }
  }
  
  const popup = new FeaturePopup({
    map: map,
    layers: mockLayers
  })

  popup.showFeature = jest.fn()

  popup.mapClick({pixel: 'hit', coordinate: 'coord'})
  popup.mapClick({pixel: 'miss'})

  expect(popup.showFeature).toHaveBeenCalledTimes(1)
  expect(popup.showFeature.mock.calls[0][0]).toBe(feature)
  expect(popup.showFeature.mock.calls[0][1]).toBe('coord')
})
