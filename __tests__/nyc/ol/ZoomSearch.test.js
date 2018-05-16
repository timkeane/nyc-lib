import OlPolygon from 'ol/geom/polygon'
import olExtent from 'ol/extent'
import OlGeoJSON from 'ol/format/geojson'
import OlFeature from 'ol/feature'

import NycZoomSearch from 'nyc/ZoomSearch'
import ZoomSearch from 'nyc/ol/ZoomSearch'
import NycLocator from 'nyc/Locator'

class MockView {
  constructor(options) {
    this.zoom = options.zoom
  }
  getZoom() {
    return this.zoom
  }
}
class MockMap {
  constructor(options) {
    const target = options.target
    this.view = new MockView({zoom: 11})
    this.target = $(target).html('<div class="ol-overlaycontainer-stopevent"></div>')
      .get(0)
  }
  getTargetElement() {
    return this.target
  }
  getView() {
    return this.view
  }
}

let target
let mockMap
beforeEach(() => {
  target = $('<div></div>')
  $('body').append(target)
  mockMap = new MockMap({target: target})
})

afterEach(() => {
  target.remove()
})

test('constructor', () => {
  expect.assertions(8)
  
  const tip = $('<div class="feature-tip"></div>')
  $('body').append(tip)
  tip.show()

  const zoomSearch = new ZoomSearch(mockMap)

  expect(zoomSearch instanceof ZoomSearch).toBe(true)
  expect(zoomSearch instanceof NycZoomSearch).toBe(true)
  expect(zoomSearch.map).toBe(mockMap)
  expect(zoomSearch.view instanceof MockView).toBe(true)
  expect(zoomSearch.view).toBe(mockMap.getView())
  expect(zoomSearch.geoJson instanceof OlGeoJSON).toBe(true)

  expect(zoomSearch.getContainer().hasClass('z-srch')).toBe(true)

  zoomSearch.getContainer().trigger('click')

  expect(tip.css('display')).toBe('none')

  tip.remove()
})

test('featureAsLocation', () => {
  expect.assertions(1)

  const options = {
    nameField: 'NAME'
  }
  const geom = new OlPolygon([[0,0], [0,2], [2,2], [2,0], [0,0]])
  const feature = new OlFeature({
    geometry: geom,
    NAME: 'a name',
    foo: 'bar'
  })

  const zoomSearch = new ZoomSearch(mockMap)

  const result = zoomSearch.featureAsLocation(feature, options)

  expect(result).toEqual({
    name: 'a name',
    coordinate: olExtent.getCenter(geom.getExtent()),
    geometry: JSON.parse(zoomSearch.geoJson.writeGeometry(geom)),
    data: feature.getProperties(),
    type: NycLocator.EventType.GEOCODE,
    accuracy: NycLocator.Accuracy.HIGH
  })
})

test('featureAsLocation feature has getName', () => {
  expect.assertions(1)

  const options = {}
  const geom = new OlPolygon([[0,0], [0,2], [2,2], [2,0], [0,0]])
  const feature = new OlFeature({
    geometry: geom,
    foo: 'bar'
  })

  feature.getName = () => {
    return 'a name'
  }

  const zoomSearch = new ZoomSearch(mockMap)

  const result = zoomSearch.featureAsLocation(feature, options)

  expect(result).toEqual({
    name: 'a name',
    coordinate: olExtent.getCenter(geom.getExtent()),
    geometry: JSON.parse(zoomSearch.geoJson.writeGeometry(geom)),
    data: feature.getProperties(),
    type: NycLocator.EventType.GEOCODE,
    accuracy: NycLocator.Accuracy.HIGH
  })
})

test('zoom', () => {
  expect.assertions(5)

  const mockView = mockMap.getView()
  mockView.animate = jest.fn()

  const zoomSearch = new ZoomSearch(mockMap)

  const event = {
    target: $('.btn-z-in').get(0)
  }

  zoomSearch.zoom(event)

  expect(mockView.getZoom()).toBe(11)
  expect(mockView.animate).toHaveBeenCalledTimes(1)
  expect(mockView.animate.mock.calls[0][0].zoom).toBe(12)

  event.target = zoomSearch.getContainer().find('.btn-z-out').get(0)

  zoomSearch.zoom(event)

  expect(mockView.animate).toHaveBeenCalledTimes(2)
  expect(mockView.animate.mock.calls[1][0].zoom).toBe(10)
})
