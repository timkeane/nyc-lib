import Locator from 'nyc/ol/Locator'
import Geoclient from 'nyc/Geoclient'

import OlGeolocation from 'ol/geolocation'

const URL = 'http://geoclient.url.gov/'

test('constructor no extent limit and default projection', () => {
  const locator = new Locator({url: URL})

  expect(locator instanceof Geoclient).toBe(true)
  expect(locator instanceof Locator).toBe(true)
  expect(locator.url).toBe(`${URL}&input=`)
  expect(locator.projection).toBe('EPSG:3857')
  expect(locator.extentLimit).toBe(undefined)

  expect(locator.geolocation instanceof OlGeolocation).toBe(true)
  expect(locator.geolocation.getTrackingOptions().maximumAge).toBe(10000)
  expect(locator.geolocation.getTrackingOptions().enableHighAccuracy).toBe(true)
  expect(locator.geolocation.getTrackingOptions().timeout).toBe(600000)
})

test('constructor no extent limit and projection provided', () => {
  const locator = new Locator({url: URL, projection: 'EPSG:2263'})

  expect(locator instanceof Geoclient).toBe(true)
  expect(locator instanceof Locator).toBe(true)
  expect(locator.url).toBe(`${URL}&input=`)
  expect(locator.projection).toBe('EPSG:2263')
  expect(locator.extentLimit).toBe(undefined)

  expect(locator.geolocation instanceof OlGeolocation).toBe(true)
})

test('constructor has extent limit and default projection', () => {
  const limit = [1, 2, 3, 4]
  const locator = new Locator({url: URL, extentLimit: limit})

  expect(locator instanceof Geoclient).toBe(true)
  expect(locator instanceof Locator).toBe(true)
  expect(locator.url).toBe(`${URL}&input=`)
  expect(locator.projection).toBe('EPSG:3857')
  expect(locator.extentLimit).toBe(limit)

  expect(locator.geolocation instanceof OlGeolocation).toBe(true)
})
