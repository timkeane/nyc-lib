import $ from 'jquery'

import OlPolygon from 'ol/geom/polygon'
import olExtent from 'ol/extent'
import OlGeoJSON from 'ol/format/geojson'
import OlFeature from 'ol/feature'

import NycZoomSearch from 'nyc/ZoomSearch'
import ZoomSearch from 'nyc/ol/ZoomSearch'
import NycLocator from 'nyc/Locator'

let container
let mockMap
let mockView
beforeEach(() => {
  container = $('<div><div class="ol-overlaycontainer-stopevent"></div></div>')
  $('body').append(container)
  mockView = {
    zoom: 11,
    getZoom: function() {
      return this.zoom
    }
  }
  mockMap = {
    getTargetElement: function() {
      return container.get(0)
    },
    getView: function() {
      return mockView
    }
  }
})

afterEach(() => {
  container.remove()
})

test('constructor', () => {
  const tip = $('<div class="feature-tip"></div>')
  $('body').append(tip)
  tip.show()

  const zoomSearch = new ZoomSearch(mockMap)

  expect(zoomSearch instanceof ZoomSearch).toBe(true)
  expect(zoomSearch instanceof NycZoomSearch).toBe(true)
  expect(zoomSearch.map).toBe(mockMap)
  expect(zoomSearch.view).toBe(mockMap.getView())
  expect(zoomSearch.geoJson instanceof OlGeoJSON).toBe(true)
  expect(zoomSearch.getElem('.z-srch').length).toBe(1)

  zoomSearch.getElem('.z-srch').trigger('click')

  expect(tip.css('display')).toBe('none')

  tip.remove()
})

test('featureAsLocation', () => {
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
    type: NycLocator.ResultType.GEOCODE,
    accuracy: NycLocator.Accuracy.HIGH
  })
})

test('zoom', () => {
  const event = {
    target: container.find('btn-z-in').get(0)
  }

  mockView.animate = jest.fn()

  const zoomSearch = new ZoomSearch(mockMap)

  zoomSearch.zoom(event)

  expect(mockView.animate).toHaveBeenCalledTimes(1)

  console.error(mockView.animate.mock);

  // expect(mockView.animate.mock.calls[0][0].zoom).toBe(12)
  //
  // event.target = container.find('btn-z-out').get(0)
  //
  // zoomSearch.zoom(event)
  //
  // expect(mockView.animate).toHaveBeenCalledTimes(2)
  // expect(mockView.animate.mock.calls[1][0].zoom).toBe(11)
})
