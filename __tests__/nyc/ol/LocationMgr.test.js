import NycLocationMgr from 'nyc/LocationMgr'
import Basemap from 'nyc/ol/Basemap'
import LocationMgr from 'nyc/ol/LocationMgr'
import NycGeoclient from 'nyc/Geoclient'
import NycOlLocator from 'nyc/ol/Locator'
import NycOlMapLocator from 'nyc/ol/MapLocator'
import NycOlZoom from 'nyc/ol/Zoom'
import NycOlGeolocate from 'nyc/ol/Geolocate'
import NycOlSearch from 'nyc/ol/Search'


let div
let target
beforeEach(() => {
  target = $('<div id="search"></div>')
  div = $('<div id="map"></div>')
  $('body').append(target)
  $('body').append(div)
})

afterEach(() => {
  target.remove()
  div.remove()
})

test('constructor no search target', () => {
  expect.assertions(11)
  
  const locationMgr = new LocationMgr({
    map: new Basemap({target: 'map'}),
    url: 'http://geoclient.url?keys=keys'
  })

  expect(locationMgr instanceof LocationMgr).toBe(true)
  expect(locationMgr instanceof NycLocationMgr).toBe(true)
  expect(locationMgr.zoom instanceof NycOlZoom).toBe(true)
  expect(locationMgr.geolocate instanceof NycOlGeolocate).toBe(true)
  expect(locationMgr.search instanceof NycOlSearch).toBe(true)
  expect(locationMgr.locator instanceof NycOlLocator).toBe(true)
  expect(locationMgr.locator.geocoder instanceof NycGeoclient).toBe(true)
  expect(locationMgr.locator.geocoder.url).toBe('http://geoclient.url?keys=keys&input=')
  expect(locationMgr.mapLocator instanceof NycOlMapLocator).toBe(true)

  expect(div.find('.srch-ctl').length).toBe(1)
  expect(locationMgr.search.getContainer().get(0)).toBe(div.find('.srch-ctl').get(0))
})

test('constructor with search target', () => {
  expect.assertions(11)
  
  const locationMgr = new LocationMgr({
    map: new Basemap({target: 'map'}),
    searchTarget: target,
    url: 'http://geoclient.url?keys=keys'
  })

  expect(locationMgr instanceof LocationMgr).toBe(true)
  expect(locationMgr instanceof NycLocationMgr).toBe(true)
  expect(locationMgr.zoom instanceof NycOlZoom).toBe(true)
  expect(locationMgr.geolocate instanceof NycOlGeolocate).toBe(true)
  expect(locationMgr.search instanceof NycOlSearch).toBe(true)
  expect(locationMgr.locator instanceof NycOlLocator).toBe(true)
  expect(locationMgr.locator.geocoder instanceof NycGeoclient).toBe(true)
  expect(locationMgr.locator.geocoder.url).toBe('http://geoclient.url?keys=keys&input=')
  expect(locationMgr.mapLocator instanceof NycOlMapLocator).toBe(true)

  expect(target.find('.srch-ctl').length).toBe(1)
  expect(locationMgr.search.getContainer().get(0)).toBe(target.find('.srch-ctl').get(0))
})