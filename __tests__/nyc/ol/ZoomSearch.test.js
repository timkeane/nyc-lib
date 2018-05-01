import $ from 'jquery'

import OlGeoJSON from 'ol/format/geojson'

import NycZoomSearch from 'nyc/ZoomSearch'
import ZoomSearch from 'nyc/ol/ZoomSearch'

let container
let mockMap
beforeEach(() => {
  container = $('<div><div class="ol-overlaycontainer-stopevent"></div></div>')
  $('body').append(container)
  mockMap = {
    getTargetElement: function() {
      return container.get(0)
    },
    getView: function() {
      return 'mock-view'
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
/*
test('featureAsLocation', () => {
  const feature = new ol.Feature({
    geometry: new OlPolygon([[0,0], [0,2], [2,2], [2,0], [0,0]]),

  })
  const zoomSearch = new ZoomSearch(mockMap)

})
*/
