import NycLocator from 'nyc/Locator'
import Geocoder from 'nyc/Geocoder'
import Locator from 'nyc/ol/Locator'

import OlGeolocation from 'ol/Geolocation'

import nyc from 'nyc'

const proj4 = nyc.proj4

function mockGeolocationEventHandlers() {
  const geolocationChange = Locator.prototype.geolocationChange
  const geolocationError = Locator.prototype.geolocationError
  Locator.prototype.geolocationChange = jest.fn()
  Locator.prototype.geolocationError = jest.fn()
  return {
    geolocationChange: geolocationChange,
    geolocationError: geolocationError
  }
}

function restoreGeolocationEventHandlers(originalHandlers) {
  Locator.prototype.geolocationChange = originalHandlers.geolocationChange
  Locator.prototype.geolocationError = originalHandlers.geolocationError
}

function geolocationExpectations(locator) {
  const geo = locator.geolocation

  expect(geo instanceof OlGeolocation).toBe(true)
  expect(geo.getTrackingOptions().maximumAge).toBe(10000)
  expect(geo.getTrackingOptions().enableHighAccuracy).toBe(true)
  expect(geo.getTrackingOptions().timeout).toBe(600000)

  geo.dispatchEvent({type: 'change'})
  geo.dispatchEvent({type: 'error'})

  expect(Locator.prototype.geolocationChange).toHaveBeenCalledTimes(1)
  expect(Locator.prototype.geolocationChange.mock.calls[0][0].type).toBe('change')

  expect(Locator.prototype.geolocationError).toHaveBeenCalledTimes(1)
  expect(Locator.prototype.geolocationError.mock.calls[0][0].type).toBe('error')
}

describe('constructor tests', () => {
  let originalHandlers
  beforeEach(() => {
    originalHandlers = mockGeolocationEventHandlers()
  })
  afterEach(() => {
    restoreGeolocationEventHandlers(originalHandlers)
  })

  test('constructor no extent limit and default projection', () => {
    expect.assertions(12)

    const locator = new Locator({geocoder: new Geocoder()})

    expect(locator instanceof NycLocator).toBe(true)
    expect(locator instanceof Locator).toBe(true)
    expect(locator.projection).toBe('EPSG:3857')
    expect(locator.extentLimit).toBe(undefined)

    geolocationExpectations(locator)
    
  })

  test('constructor no extent limit and projection provided', () => {
    expect.assertions(12)

    const locator = new Locator({
      geocoder: new Geocoder(),
      projection: 'EPSG:2263'
    })

    expect(locator instanceof NycLocator).toBe(true)
    expect(locator instanceof Locator).toBe(true)
    expect(locator.projection).toBe('EPSG:2263')
    expect(locator.extentLimit).toBe(undefined)

    geolocationExpectations(locator)
  })

  test('constructor has extent limit and default projection', () => {
    expect.assertions(12)

    const limit = [1, 2, 3, 4]
    const locator = new Locator({
      geocoder: new Geocoder(),
      extentLimit: limit
    })

    expect(locator instanceof NycLocator).toBe(true)
    expect(locator instanceof Locator).toBe(true)
    expect(locator.projection).toBe('EPSG:3857')
    expect(locator.extentLimit).toBe(limit)

    geolocationExpectations(locator)
  })
})

test('locate', () => {
  expect.assertions(3)

  const locator = new Locator({geocoder: new Geocoder()})

  locator.geolocation.setTracking = jest.fn()

  locator.locate()

  expect(locator.locating).toBe(true)
  expect(locator.geolocation.setTracking).toHaveBeenCalledTimes(1)
  expect(locator.geolocation.setTracking.mock.calls[0][0]).toBe(true)
})

test('track', () => {
  expect.assertions(4)

  const locator = new Locator({geocoder: new Geocoder()})

  locator.geolocation.setTracking = jest.fn()

  locator.track(true)

  expect(locator.geolocation.setTracking).toHaveBeenCalledTimes(1)
  expect(locator.geolocation.setTracking.mock.calls[0][0]).toBe(true)

  locator.track(false)

  expect(locator.geolocation.setTracking).toHaveBeenCalledTimes(2)
  expect(locator.geolocation.setTracking.mock.calls[1][0]).toBe(false)
})

test('geolocationError', () => {
  expect.assertions(3)

  const locator = new Locator({geocoder: new Geocoder()})

  const error = console.error
  console.error = jest.fn()

  const mockEvent = {message: 'mock-error'}
  locator.geolocationError(mockEvent)

  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error.mock.calls[0][0]).toBe('mock-error')
  expect(console.error.mock.calls[0][1]).toBe(mockEvent)

  console.error = error
})

test('geolocationChange not currently locating, no limit', () => {
  expect.assertions(8)

  const locator = new Locator({
    geocoder: new Geocoder(),
    projection: 'EPSG:2263'
  })
  locator.track = jest.fn()

  const handler = jest.fn()
  locator.on('geolocated', handler)

  locator.geolocation.getPosition = () => { return [0, 0] }
  locator.geolocation.getHeading = () => { return 90 }
  locator.geolocation.getAccuracy = () => { return 500 }

  locator.geolocationChange()

  expect(locator.locating).toBe(false)

  expect(locator.track).toHaveBeenCalledTimes(0)

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0].coordinate).toEqual(proj4('EPSG:4326', locator.projection, [0, 0]))
  expect(handler.mock.calls[0][0].heading).toBe(90)
  expect(handler.mock.calls[0][0].accuracy).toBe(500 / locator.metersPerUnit())
  expect(handler.mock.calls[0][0].type).toBe('geolocated')
  expect(handler.mock.calls[0][0].name).toBe('0° 0°')
})

test('geolocationChange not currently locating, within limit', () => {
  expect.assertions(8)

  const limit = [-1, -1, 1, 1]
  const locator = new Locator({
    geocoder: new Geocoder(),
    projection: 'EPSG:4326',
    extentLimit: limit
  })
  locator.track = jest.fn()

  const handler = jest.fn()
  locator.on('geolocated', handler)

  locator.geolocation.getPosition = () => { return [0, 0] }
  locator.geolocation.getHeading = () => { return 90 }
  locator.geolocation.getAccuracy = () => { return 500 }

  locator.geolocationChange()

  expect(locator.locating).toBe(false)

  expect(locator.track).toHaveBeenCalledTimes(0)

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0].coordinate).toEqual(proj4('EPSG:4326', locator.projection, [0, 0]))
  expect(handler.mock.calls[0][0].heading).toBe(90)
  expect(handler.mock.calls[0][0].accuracy).toBe(500 / locator.metersPerUnit())
  expect(handler.mock.calls[0][0].type).toBe('geolocated')
  expect(handler.mock.calls[0][0].name).toBe('0° 0°')
})

test('geolocationChange not currently locating, not within limit', () => {
  expect.assertions(3)

  const limit = [-2, -2, -1, -1]
  const locator = new Locator({
    geocoder: new Geocoder(),
    projection: 'EPSG:2263',
    extentLimit: limit
  })
  locator.track = jest.fn()

  const handler = jest.fn()
  locator.on('geolocated', handler)

  locator.geolocation.getPosition = () => { return [0, 0] }
  locator.geolocation.getHeading = () => { return 90 }
  locator.geolocation.getAccuracy = () => { return 500 }

  locator.geolocationChange()

  expect(locator.locating).toBe(false)
  expect(locator.track).toHaveBeenCalledTimes(0)
  expect(handler).toHaveBeenCalledTimes(0)
})

test('geolocationChange is currently locating, not within limit', () => {
  expect.assertions(3)
  const limit = [-2, -2, -1, -1]
  const locator = new Locator({
    geocoder: new Geocoder(),
    projection: 'EPSG:2263',
    extentLimit: limit
  })
  locator.locating = true
  locator.track = jest.fn()

  const handler = jest.fn()
  locator.on('geolocated', handler)

  locator.geolocation.getPosition = () => { return [0, 0] }
  locator.geolocation.getHeading = () => { return 90 }
  locator.geolocation.getAccuracy = () => { return 500 }

  locator.geolocationChange()

  expect(locator.locating).toBe(true)
  expect(locator.track).toHaveBeenCalledTimes(0)
  expect(handler).toHaveBeenCalledTimes(0)
})

test('geolocationChange IS currently locating, within limit', () => {
  expect.assertions(8)

  const limit = [-1, -1, 1, 1]
  const locator = new Locator({
    geocoder: new Geocoder(),
    projection: 'EPSG:4326',
    extentLimit: limit
  })
  locator.track = jest.fn()
  locator.locating = true

  const handler = jest.fn()
  locator.on('geolocated', handler)

  locator.geolocation.getPosition = () => { return [0, 0] }
  locator.geolocation.getHeading = () => { return 90 }
  locator.geolocation.getAccuracy = () => { return 500 }

  locator.geolocationChange()

  expect(locator.locating).toBe(false)

  expect(locator.track).toHaveBeenCalledTimes(1)

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0].coordinate).toEqual(proj4('EPSG:4326', locator.projection, [0, 0]))
  expect(handler.mock.calls[0][0].heading).toBe(90)
  expect(handler.mock.calls[0][0].accuracy).toBe(500 / locator.metersPerUnit())
  expect(handler.mock.calls[0][0].type).toBe('geolocated')
  expect(handler.mock.calls[0][0].name).toBe('0° 0°')
})
