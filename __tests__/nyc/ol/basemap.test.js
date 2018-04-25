import nyc from 'nyc/nyc'
import OlMap from 'ol/map'
import Basemap from 'nyc/ol/Basemap'
import BasemapHelper from 'nyc/BasemapHelper'
import $ from 'jQuery'

let target
beforeEach(() => {
  target = $('<div id="map"></div>')
  $('body').append(target)
})

afterEach(() => {
  target.remove()
})

test('constructor', () => {
  let basemap

  const setupView = Basemap.setupView
  const setupLayers = Basemap.prototype.setupLayers
  const defaultExtent = Basemap.prototype.defaultExtent
  const mixin = nyc.mixin

  Basemap.setupView = jest.fn()
  Basemap.prototype.setupLayers = jest.fn()
  Basemap.prototype.defaultExtent = jest.fn()
  const hookupEvents = jest.fn(targetNode => {
    expect(targetNode).toBe(target.get(0))
  })
  nyc.mixin = jest.fn(obj => {
    obj.hookupEvents = hookupEvents
  })

  basemap = new Basemap({target: 'map'}, 5)

  expect(basemap instanceof OlMap).toBe(true)
  expect(basemap instanceof Basemap).toBe(true)

  expect(Basemap.setupView).toHaveBeenCalledTimes(1)
  expect(Basemap.setupView.mock.calls[0][0]).toEqual({target: 'map'})

  expect(Basemap.prototype.setupLayers).toHaveBeenCalledTimes(1)
  expect(Basemap.prototype.setupLayers.mock.calls[0][0]).toEqual({target: 'map'})
  expect(Basemap.prototype.setupLayers.mock.calls[0][1]).toBe(5)

  expect(Basemap.prototype.defaultExtent).toHaveBeenCalledTimes(1)

  expect(hookupEvents).toHaveBeenCalledTimes(1)
  expect(hookupEvents.mock.calls[0][0]).toBe(target.get(0))

  Basemap.setupView = setupView
  Basemap.prototype.setupLayers = setupLayers
  Basemap.prototype.defaultExtent = defaultExtent
  nyc.mixin = mixin
})
