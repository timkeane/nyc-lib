import $ from 'jquery'
import LocationMgr from 'nyc/LocationMgr'
import EventHandling from 'nyc/EventHandling'
import ZoomSearch from 'nyc/ZoomSearch'
import Locator from 'nyc/Locator'
import MapLocator from 'nyc/MapLocator'

let container
let options
beforeEach(() => {
  container = $('<div id="map"></div>')
  $('body').append(container)

  options = {
    controls: new ZoomSearch(container),
    locator: new Locator({}),
    mapLocator: new MapLocator()
  }
})

afterEach(() => {
  container.remove()
})

test('constructor not autoLocate', () => {
  const locateFromQueryString = LocationMgr.prototype.locateFromQueryString
  LocationMgr.prototype.locateFromQueryString = jest.fn()
  const hookupEvents = LocationMgr.prototype.hookupEvents
  LocationMgr.prototype.hookupEvents = jest.fn()

  const locationMgr = new LocationMgr(options)
  expect(locationMgr instanceof LocationMgr).toBe(true)
  expect(locationMgr instanceof EventHandling).toBe(true)

  expect(locationMgr.controls).toBe(options.controls)
  expect(locationMgr.locator).toBe(options.locator)
  expect(locationMgr.mapLocator).toBe(options.mapLocator)
  expect(locationMgr.autoLocate).toBe(false)

  expect(LocationMgr.prototype.locateFromQueryString).toHaveBeenCalledTimes(1)
  expect(LocationMgr.prototype.hookupEvents).toHaveBeenCalledTimes(1)

  LocationMgr.prototype.locateFromQueryString = locateFromQueryString
  LocationMgr.prototype.hookupEvents = hookupEvents
})

test('constructor autoLocate', () => {
  const locateFromQueryString = LocationMgr.prototype.locateFromQueryString
  LocationMgr.prototype.locateFromQueryString = jest.fn()
  const hookupEvents = LocationMgr.prototype.hookupEvents
  LocationMgr.prototype.hookupEvents = jest.fn()

  options.autoLocate = true

  const locationMgr = new LocationMgr(options)
  expect(locationMgr instanceof LocationMgr).toBe(true)
  expect(locationMgr instanceof EventHandling).toBe(true)

  expect(locationMgr.controls).toBe(options.controls)
  expect(locationMgr.locator).toBe(options.locator)
  expect(locationMgr.mapLocator).toBe(options.mapLocator)
  expect(locationMgr.autoLocate).toBe(true)

  expect(LocationMgr.prototype.locateFromQueryString).toHaveBeenCalledTimes(1)
  expect(LocationMgr.prototype.hookupEvents).toHaveBeenCalledTimes(1)

  LocationMgr.prototype.locateFromQueryString = locateFromQueryString
  LocationMgr.prototype.hookupEvents = hookupEvents
})

test('setLocation', () => {
  options.mapLocator.setLocation = jest.fn()

  const locationMgr = new LocationMgr(options)

  locationMgr.setLocation('mock-data')
  expect(options.mapLocator.setLocation).toHaveBeenCalledTimes(1)
  expect(options.mapLocator.setLocation.mock.calls[0][0]).toBe('mock-data')
})

test('hookupEvents', () => {
  const located = LocationMgr.prototype.located
  const ambiguous = LocationMgr.prototype.ambiguous
  const error = LocationMgr.prototype.error
  LocationMgr.prototype.located = jest.fn()
  LocationMgr.prototype.ambiguous = jest.fn()
  LocationMgr.prototype.error = jest.fn()
  options.locator.search = jest.fn()
  options.locator.locate = jest.fn()

  const locationMgr = new LocationMgr(options)

  options.locator.trigger(Locator.EventType.GEOCODE, 'mock-geocode-event')
  expect(LocationMgr.prototype.located).toHaveBeenCalledTimes(1)
  expect(LocationMgr.prototype.located.mock.calls[0][0]).toBe('mock-geocode-event')

  options.locator.trigger(Locator.EventType.GEOLOCATION, 'mock-geolocation-event')
  expect(LocationMgr.prototype.located).toHaveBeenCalledTimes(2)
  expect(LocationMgr.prototype.located.mock.calls[1][0]).toBe('mock-geolocation-event')

  options.locator.trigger(Locator.EventType.AMBIGUOUS, 'mock-ambiguous-event')
  expect(LocationMgr.prototype.ambiguous).toHaveBeenCalledTimes(1)
  expect(LocationMgr.prototype.ambiguous.mock.calls[0][0]).toBe('mock-ambiguous-event')

  options.locator.trigger(Locator.EventType.ERROR, 'mock-error-event')
  expect(LocationMgr.prototype.error).toHaveBeenCalledTimes(1)
  expect(LocationMgr.prototype.error.mock.calls[0][0]).toBe('mock-error-event')

  options.controls.trigger(ZoomSearch.EventType.DISAMBIGUATED, 'mock-disambiguated-event')
  expect(LocationMgr.prototype.located).toHaveBeenCalledTimes(3)
  expect(LocationMgr.prototype.located.mock.calls[2][0]).toBe('mock-disambiguated-event')

  options.controls.trigger(ZoomSearch.EventType.SEARCH, 'mock-search-event')
  expect(options.locator.search).toHaveBeenCalledTimes(1)
  expect(options.locator.search.mock.calls[0][0]).toBe('mock-search-event')

  options.controls.trigger(ZoomSearch.EventType.GEOLOCATE, 'mock-geolocate-event')
  expect(options.locator.locate).toHaveBeenCalledTimes(1)
  expect(options.locator.locate.mock.calls[0][0]).toBe('mock-geolocate-event')

  LocationMgr.prototype.located = located
  LocationMgr.prototype.ambiguous = ambiguous
  LocationMgr.prototype.error = error
})
