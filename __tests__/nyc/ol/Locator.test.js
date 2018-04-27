import Locator from 'nyc/ol/Locator'
import Geoclient from 'nyc/Geoclient'

import OlGeolocation from 'ol/geolocation'

const URL = 'http://geoclient.url.gov/'


function mockGeolocationEventHandlers() {
  const geolocationChange = Locator.prototype.geolocationChange
  const geolocationError = Locator.prototype.geolocationError
  Locator.prototype.geolocationChange = jest.fn()
  Locator.prototype.geolocationError = jest.fn()
  return {
    geolocationChange: geolocationChange,
    geolocationError: geolocationChange
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

test('constructor no extent limit and default projection', () => {
  const originalHandlers = mockGeolocationEventHandlers()
  
  const locator = new Locator({url: URL})

  expect(locator instanceof Geoclient).toBe(true)
  expect(locator instanceof Locator).toBe(true)
  expect(locator.url).toBe(`${URL}&input=`)
  expect(locator.projection).toBe('EPSG:3857')
  expect(locator.extentLimit).toBe(undefined)

  geolocationExpectations(locator)
  restoreGeolocationEventHandlers(originalHandlers)
})

test('constructor no extent limit and projection provided', () => {
  const originalHandlers = mockGeolocationEventHandlers()

  const locator = new Locator({url: URL, projection: 'EPSG:2263'})

  expect(locator instanceof Geoclient).toBe(true)
  expect(locator instanceof Locator).toBe(true)
  expect(locator.url).toBe(`${URL}&input=`)
  expect(locator.projection).toBe('EPSG:2263')
  expect(locator.extentLimit).toBe(undefined)

  geolocationExpectations(locator)
  restoreGeolocationEventHandlers(originalHandlers)  
})

test('constructor has extent limit and default projection', () => {
  const originalHandlers = mockGeolocationEventHandlers()

  const limit = [1, 2, 3, 4]
  const locator = new Locator({url: URL, extentLimit: limit})

  expect(locator instanceof Geoclient).toBe(true)
  expect(locator instanceof Locator).toBe(true)
  expect(locator.url).toBe(`${URL}&input=`)
  expect(locator.projection).toBe('EPSG:3857')
  expect(locator.extentLimit).toBe(limit)

  geolocationExpectations(locator)
  restoreGeolocationEventHandlers(originalHandlers)
})

