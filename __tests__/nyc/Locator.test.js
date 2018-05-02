import Locator from 'nyc/Locator'
import EventHandling from 'nyc/EventHandling'
import Geocoder from 'nyc/Geocoder'

test('constructor no projection', () => {
  const hookupEvents = Locator.prototype.hookupEvents
  Locator.prototype.hookupEvents = jest.fn()

  const locator = new Locator({geocoder: new Geocoder()})

  expect(locator instanceof EventHandling).toBe(true)
  expect(locator instanceof Locator).toBe(true)
  expect(locator.geocoder instanceof Geocoder).toBe(true)
  expect(locator.projection).toBe('EPSG:3857')
  expect(Locator.prototype.hookupEvents).toHaveBeenCalledTimes(1)

  Locator.prototype.hookupEvents = hookupEvents
})

test('constructor has projection', () => {
  const hookupEvents = Locator.prototype.hookupEvents
  Locator.prototype.hookupEvents = jest.fn()

  const locator = new Locator({
    geocoder: new Geocoder(),
    projection: 'EPSG:2263'
  })

  expect(locator instanceof EventHandling).toBe(true)
  expect(locator instanceof Locator).toBe(true)
  expect(locator.geocoder instanceof Geocoder).toBe(true)
  expect(locator.projection).toBe('EPSG:2263')
  expect(Locator.prototype.hookupEvents).toHaveBeenCalledTimes(1)

  Locator.prototype.hookupEvents = hookupEvents
})

test('hookupEvents/proxyEvent', () => {
  const handler = jest.fn()

  const locator = new Locator({geocoder: new Geocoder()})
  expect(locator.geocoder instanceof Geocoder).toBe(true)
  expect(locator.geocoder instanceof EventHandling).toBe(true)
// expect(locator.geocoder.on).toBe({})

  locator.on(Locator.EventType.GEOCODE, handler)
  locator.on(Locator.EventType.AMBIGUOUS, handler)
  locator.on(Locator.EventType.ERROR, handler)

  locator.geocoder.trigger(Locator.EventType.GEOCODE, {type: Locator.EventType.GEOCODE})
  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0].type).toBe(Locator.EventType.GEOCODE)

  locator.geocoder.trigger(Locator.EventType.AMBIGUOUS, {type: Locator.EventType.AMBIGUOUS})
  expect(handler).toHaveBeenCalledTimes(2)
  expect(handler.mock.calls[1][0].type).toBe(Locator.EventType.AMBIGUOUS)

  locator.geocoder.trigger(Locator.EventType.ERROR, {type: Locator.EventType.ERROR})
  expect(handler).toHaveBeenCalledTimes(3)
  expect(handler.mock.calls[2][0].type).toBe(Locator.EventType.ERROR)
})

test('not implemented methods', () => {
  const locator = new Locator({geocoder: new Geocoder()})
  expect(() => {locator.locate()}).toThrow('Not implemented')
  expect(() => {locator.track()}).toThrow('Not implemented')
})

test('search', () => {
  const search = jest.fn()

  const locator = new Locator({
    geocoder: new Geocoder()
  })

  locator.geocoder.search = search

  locator.search('an address')

  expect(search).toHaveBeenCalledTimes(1)
  expect(search.mock.calls[0][0]).toBe('an address')
})

test('accuracyDistance', () => {
  let locator = new Locator({geocoder: new Geocoder()})
  expect(locator.accuracyDistance(100)).toBe(100)

  locator = new Locator({
    geocoder: new Geocoder(),
    projection: 'EPSG:2263'
  })
  expect(locator.accuracyDistance(100).toFixed(1)).toBe('328.1')
})
