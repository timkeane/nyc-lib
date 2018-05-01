import $ from 'jquery'
import LocationMgr from 'nyc/LocationMgr'
import EventHandling from 'nyc/EventHandling'
import ZoomSearch from 'nyc/ZoomSearch'
import Locator from 'nyc/Locator'

let container
let options
beforeEach(() => {
  container = $('<div id="map"></div>')
  $('body').append(container)
  options = {
    controls: new ZoomSearch(container),
    locator: new Locator({})
  }
})

afterEach(() => {
  container.remove()
})

test('constructor', () => {
  const locateFromQueryString = LocationMgr.prototype.locateFromQueryString
  LocationMgr.prototype.locateFromQueryString = jest.fn()

  const locationMgr = new LocationMgr(options)
  expect(locationMgr instanceof LocationMgr).toBe(true)
  expect(locationMgr instanceof EventHandling).toBe(true)
  
  expect(LocationMgr.prototype.locateFromQueryString).toHaveBeenCalledTimes(1)
  LocationMgr.prototype.locateFromQueryString = locateFromQueryString
})