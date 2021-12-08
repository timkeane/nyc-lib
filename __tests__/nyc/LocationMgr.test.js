import LocationMgr from 'nyc/LocationMgr'
import EventHandling from 'nyc/EventHandling'
import Zoom from 'nyc/Zoom'
import Geolocate from 'nyc/Geolocate'
import Search from 'nyc/Search'
import Locator from 'nyc/Locator'
import MapLocator from 'nyc/MapLocator'
import Geocoder from 'nyc/Geocoder'

let container
let options
beforeEach(() => {
  container = $('<div id="map"></div>')
  $('body').append(container)

  options = {
    zoom: new Zoom(container),
    geolocate: new Geolocate(container),
    search: new Search(container),
    locator: new Locator({geocoder: new Geocoder()}),
    mapLocator: new MapLocator()
  }
})

afterEach(() => {
  container.remove()
  $('.dia-container').remove()
})

describe('constructor tests', () => {
  const locateFromQueryString = LocationMgr.prototype.locateFromQueryString
  const hookupEvents = LocationMgr.prototype.hookupEvents
  beforeEach(() => {
    LocationMgr.prototype.locateFromQueryString = jest.fn()
    LocationMgr.prototype.hookupEvents = jest.fn()

  })
  afterEach(() => {
    LocationMgr.prototype.locateFromQueryString = locateFromQueryString
    LocationMgr.prototype.hookupEvents = hookupEvents
  })

  test('constructor not autoLocate', () => {
    expect.assertions(11)

    const locationMgr = new LocationMgr(options)
    expect(locationMgr instanceof LocationMgr).toBe(true)
    expect(locationMgr instanceof EventHandling).toBe(true)

    expect(locationMgr.zoom).toBe(options.zoom)
    expect(locationMgr.geolocate).toBe(options.geolocate)
    expect(locationMgr.search).toBe(options.search)
    expect(locationMgr.locator).toBe(options.locator)
    expect(locationMgr.mapLocator).toBe(options.mapLocator)
    expect(locationMgr.autoLocate).toBe(false)

    expect(LocationMgr.prototype.locateFromQueryString).toHaveBeenCalledTimes(1)
    expect(LocationMgr.prototype.locateFromQueryString.mock.calls[0][0]).toBe(document.location.search)
    expect(LocationMgr.prototype.hookupEvents).toHaveBeenCalledTimes(1)
  })

  test('constructor autoLocate', () => {
    expect.assertions(10)

    const locateFromQueryString = LocationMgr.prototype.locateFromQueryString
    LocationMgr.prototype.locateFromQueryString = jest.fn()
    const hookupEvents = LocationMgr.prototype.hookupEvents
    LocationMgr.prototype.hookupEvents = jest.fn()

    options.autoLocate = true

    const locationMgr = new LocationMgr(options)
    expect(locationMgr instanceof LocationMgr).toBe(true)
    expect(locationMgr instanceof EventHandling).toBe(true)

    expect(locationMgr.zoom).toBe(options.zoom)
    expect(locationMgr.geolocate).toBe(options.geolocate)
    expect(locationMgr.search).toBe(options.search)
    expect(locationMgr.locator).toBe(options.locator)
    expect(locationMgr.mapLocator).toBe(options.mapLocator)
    expect(locationMgr.autoLocate).toBe(true)

    expect(LocationMgr.prototype.locateFromQueryString).toHaveBeenCalledTimes(1)
    expect(LocationMgr.prototype.hookupEvents).toHaveBeenCalledTimes(1)

    LocationMgr.prototype.locateFromQueryString = locateFromQueryString
    LocationMgr.prototype.hookupEvents = hookupEvents
  })
})

test('setLocation', () => {
  expect.assertions(2)

  options.mapLocator.setLocation = jest.fn()

  const locationMgr = new LocationMgr(options)

  locationMgr.setLocation('mock-data')
  expect(options.mapLocator.setLocation).toHaveBeenCalledTimes(1)
  expect(options.mapLocator.setLocation.mock.calls[0][0]).toBe('mock-data')
})

describe('hookupEvents', () => {
  const located = LocationMgr.prototype.located
  const ambiguous = LocationMgr.prototype.ambiguous
  const error = LocationMgr.prototype.error
  beforeEach(() => {
    LocationMgr.prototype.located = jest.fn()
    LocationMgr.prototype.ambiguous = jest.fn()
    LocationMgr.prototype.error = jest.fn()
  })
  afterEach(() => {
    LocationMgr.prototype.located = located
    LocationMgr.prototype.ambiguous = ambiguous
    LocationMgr.prototype.error = error
  })

  test('hookupEvents', () => {
    expect.assertions(14)

    options.locator.search = jest.fn()
    options.locator.locate = jest.fn()

    const locationMgr = new LocationMgr(options)

    options.locator.trigger('geocoded', 'mock-geocode-event')
    expect(LocationMgr.prototype.located).toHaveBeenCalledTimes(1)
    expect(LocationMgr.prototype.located.mock.calls[0][0]).toBe('mock-geocode-event')

    options.locator.trigger('geolocated', 'mock-geolocation-event')
    expect(LocationMgr.prototype.located).toHaveBeenCalledTimes(2)
    expect(LocationMgr.prototype.located.mock.calls[1][0]).toBe('mock-geolocation-event')

    options.locator.trigger('ambiguous', 'mock-ambiguous-event')
    expect(LocationMgr.prototype.ambiguous).toHaveBeenCalledTimes(1)
    expect(LocationMgr.prototype.ambiguous.mock.calls[0][0]).toBe('mock-ambiguous-event')

    options.locator.trigger('error', 'mock-error-event')
    expect(LocationMgr.prototype.error).toHaveBeenCalledTimes(1)
    expect(LocationMgr.prototype.error.mock.calls[0][0]).toBe('mock-error-event')

    options.search.trigger('disambiguated', 'mock-disambiguated-event')
    expect(LocationMgr.prototype.located).toHaveBeenCalledTimes(3)
    expect(LocationMgr.prototype.located.mock.calls[2][0]).toBe('mock-disambiguated-event')

    options.search.trigger('search', 'mock-search-event')
    expect(options.locator.search).toHaveBeenCalledTimes(1)
    expect(options.locator.search.mock.calls[0][0]).toBe('mock-search-event')

    options.geolocate.trigger('geolocate', 'mock-geolocate-event')
    expect(options.locator.locate).toHaveBeenCalledTimes(1)
    expect(options.locator.locate.mock.calls[0][0]).toBe('mock-geolocate-event')
  })
})

test('locateFromQueryString', () => {
  expect.assertions(19)

  options.locator.search = jest.fn()
  options.locator.locate = jest.fn()

  const locationMgr = new LocationMgr(options)

  locationMgr.locateFromQueryString()

  expect(options.locator.search).toHaveBeenCalledTimes(0)
  expect(options.locator.locate).toHaveBeenCalledTimes(0)

  locationMgr.locateFromQueryString('')

  expect(options.locator.search).toHaveBeenCalledTimes(0)
  expect(options.locator.locate).toHaveBeenCalledTimes(0)

  locationMgr.locateFromQueryString('?foo=bar&bar=foo')

  expect(options.locator.search).toHaveBeenCalledTimes(0)
  expect(options.locator.locate).toHaveBeenCalledTimes(0)

  locationMgr.locateFromQueryString('?foo=bar&location=59%20maiden%20ln&bar=foo')

  expect(options.locator.search).toHaveBeenCalledTimes(1)
  expect(options.locator.search.mock.calls[0][0]).toBe('59 maiden ln')
  expect(options.locator.locate).toHaveBeenCalledTimes(0)

  locationMgr.autoLocate = true

  locationMgr.locateFromQueryString('?foo=bar&bar=foo&location=2%20metrotech%20ctr')

  expect(options.locator.search).toHaveBeenCalledTimes(2)
  expect(options.locator.search.mock.calls[1][0]).toBe('2 metrotech ctr')
  expect(options.locator.locate).toHaveBeenCalledTimes(0)

  locationMgr.mapLocator.zoomLocation = jest.fn()
  locationMgr.mapLocator.getProjection = jest.fn(() => {
    return {getCode: () => 'EPSG:3857'}
  })

  locationMgr.locateFromQueryString('?foo=bar&bar=foo&location=1,2,EPSG:4326')

  expect(options.locator.search).toHaveBeenCalledTimes(2)
  expect(locationMgr.mapLocator.zoomLocation).toHaveBeenCalledTimes(1)
  expect(locationMgr.mapLocator.zoomLocation.mock.calls[0][0].coordinate).toEqual([111319.49079327357, 222684.20850554455])
  expect(options.locator.locate).toHaveBeenCalledTimes(0)

  locationMgr.locateFromQueryString('?foo=bar&bar=foo&input=2%20metrotech%20ctr')

  expect(options.locator.search).toHaveBeenCalledTimes(2)
  expect(locationMgr.mapLocator.zoomLocation).toHaveBeenCalledTimes(1)
  expect(options.locator.locate).toHaveBeenCalledTimes(1)
})

test('located GEOCODE', () => {
  expect.assertions(3)

  const handler = jest.fn()

  options.mapLocator.zoomLocation = (data, callback) => {
    callback()
  }

  const locationMgr = new LocationMgr(options)

  const data = {
    type: 'geocoded',
    coordinate: [1, 2],
    name: 'a name'
  }

  locationMgr.on('geocoded', handler)

  locationMgr.located(data)

  expect(locationMgr.search.val()).toBe('a name')
  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0]).toBe(data)
})

test('located GEOLOCATION', () => {
  expect.assertions(4)

  const handler = jest.fn()

  options.mapLocator.zoomLocation = (data, callback) => {
    callback()
  }

  const locationMgr = new LocationMgr(options)

  locationMgr.search.val('something')
  expect(locationMgr.search.val()).toBe('something')

  const data = {
    type: 'geolocated',
    coordinate: [1, 2],
    name: 'a name'
  }

  locationMgr.on('geolocated', handler)

  locationMgr.located(data)

  expect(locationMgr.search.val()).toBe('')
  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0]).toBe(data)
})

test('ambiguous no possible', () => {
  expect.assertions(3)

  const data = {possible: []}
  options.search.disambiguate = jest.fn()

  const locationMgr = new LocationMgr(options)

  locationMgr.dialog.ok = jest.fn()

  locationMgr.ambiguous(data)

  expect(options.search.disambiguate).toHaveBeenCalledTimes(0)
  expect(locationMgr.dialog.ok).toHaveBeenCalledTimes(1)
  expect(locationMgr.dialog.ok.mock.calls[0][0].message).toBe(
    '<span class="msg-unk-addr">The location you entered was not understood</span>'
  )
})

test('ambiguous has possible', () => {
  expect.assertions(3)

  const data = {possible: ['mock-reuslt']}
  options.search.disambiguate = jest.fn()

  const locationMgr = new LocationMgr(options)

  locationMgr.dialog.ok = jest.fn()

  locationMgr.ambiguous(data)

  expect(options.search.disambiguate).toHaveBeenCalledTimes(1)
  expect(options.search.disambiguate.mock.calls[0][0]).toBe(data)
  expect(locationMgr.dialog.ok).toHaveBeenCalledTimes(0)
})

test('error', () => {
  expect.assertions(2)

  const locationMgr = new LocationMgr(options)

  locationMgr.dialog.ok = jest.fn()

  locationMgr.error()

  expect(locationMgr.dialog.ok).toHaveBeenCalledTimes(1)
  expect(locationMgr.dialog.ok.mock.calls[0][0].message).toBe('Failed to contact geocoder')
})
