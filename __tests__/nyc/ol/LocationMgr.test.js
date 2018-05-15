import NycLocationMgr from 'nyc/LocationMgr'
import Basemap from 'nyc/ol/Basemap'
import LocationMgr from 'nyc/ol/LocationMgr'
import NycGeoclient from 'nyc/Geoclient'
import NycOlLocator from 'nyc/ol/Locator'
import NycOlMapLocator from 'nyc/ol/MapLocator'
import NycOlZoomSearch from 'nyc/ol/ZoomSearch'

let target
beforeEach(() => {
  target = $('<div id="map"></div>')
  $('body').append(target)
})

afterEach(() => {
  target.remove()
})

test('constructor', () => {
  expect.assertions(7)
  
  const locationMgr = new LocationMgr({
    map: new Basemap({target: 'map'}),
    url: 'http://geoclient.url?keys=keys'
  })

  expect(locationMgr instanceof LocationMgr).toBe(true)
  expect(locationMgr instanceof NycLocationMgr).toBe(true)
  expect(locationMgr.zoomSearch instanceof NycOlZoomSearch).toBe(true)
  expect(locationMgr.locator instanceof NycOlLocator).toBe(true)
  expect(locationMgr.locator.geocoder instanceof NycGeoclient).toBe(true)
  expect(locationMgr.locator.geocoder.url).toBe('http://geoclient.url?keys=keys&input=')
  expect(locationMgr.mapLocator instanceof NycOlMapLocator).toBe(true)
})
