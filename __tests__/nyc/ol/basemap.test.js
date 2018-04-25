import nyc from 'nyc/nyc'
import OlMap from 'ol/map'
import OlView from 'ol/view'
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

test('constructor no view in options', () => {
  let basemap
  const options = {target: 'map'}

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

  basemap = new Basemap(options, 5)

  expect(basemap instanceof OlMap).toBe(true)
  expect(basemap instanceof Basemap).toBe(true)

  expect(Basemap.setupView).toHaveBeenCalledTimes(1)
  expect(Basemap.setupView.mock.calls[0][0]).toEqual(options)

  expect(Basemap.prototype.setupLayers).toHaveBeenCalledTimes(1)
  expect(Basemap.prototype.setupLayers.mock.calls[0][0]).toEqual(options)
  expect(Basemap.prototype.setupLayers.mock.calls[0][1]).toBe(5)

  expect(Basemap.prototype.defaultExtent).toHaveBeenCalledTimes(1)
  expect(Basemap.prototype.defaultExtent.mock.calls[0][0]).toBe(false)

  expect(hookupEvents).toHaveBeenCalledTimes(1)
  expect(hookupEvents.mock.calls[0][0]).toBe(target.get(0))

  Basemap.setupView = setupView
  Basemap.prototype.setupLayers = setupLayers
  Basemap.prototype.defaultExtent = defaultExtent
  nyc.mixin = mixin
})

test('constructor has view in options', () => {
  let basemap
  const view = new OlView({})
  const options = {target: 'map', view: view}

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

  basemap = new Basemap(options, 5)

  expect(basemap instanceof OlMap).toBe(true)
  expect(basemap instanceof Basemap).toBe(true)

  expect(Basemap.setupView).toHaveBeenCalledTimes(1)
  expect(Basemap.setupView.mock.calls[0][0]).toEqual(options)

  expect(Basemap.prototype.setupLayers).toHaveBeenCalledTimes(1)
  expect(Basemap.prototype.setupLayers.mock.calls[0][0]).toEqual(options)
  expect(Basemap.prototype.setupLayers.mock.calls[0][1]).toBe(5)

  expect(Basemap.prototype.defaultExtent).toHaveBeenCalledTimes(1)
  expect(Basemap.prototype.defaultExtent.mock.calls[0][0]).toBe(true)

  expect(hookupEvents).toHaveBeenCalledTimes(1)
  expect(hookupEvents.mock.calls[0][0]).toBe(target.get(0))

  Basemap.setupView = setupView
  Basemap.prototype.setupLayers = setupLayers
  Basemap.prototype.defaultExtent = defaultExtent
  nyc.mixin = mixin
})

test('showPhoto no year', () => {
  const basemap = new Basemap({target: 'map'})

  expect(Object.entries(basemap.photos).length).toBe(11)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(false)
  })
  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)

  basemap.showPhoto()

  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(year === basemap.latestPhoto)
  })
  expect(basemap.labels.base.getVisible()).toBe(false)
  expect(basemap.labels.photo.getVisible()).toBe(true)
})

test('showPhoto 1996', () => {
  const basemap = new Basemap({target: 'map'})

  expect(Object.entries(basemap.photos).length).toBe(11)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(false)
  })
  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)

  basemap.showPhoto(1996)

  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(year === '1996')
  })
  expect(basemap.labels.base.getVisible()).toBe(false)
  expect(basemap.labels.photo.getVisible()).toBe(true)
})

test('showLabels', () => {
  const basemap = new Basemap({target: 'map'})

  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)

  basemap.showLabels(BasemapHelper.LabelType.PHOTO)

  expect(basemap.labels.base.getVisible()).toBe(false)
  expect(basemap.labels.photo.getVisible()).toBe(true)

  basemap.showLabels(BasemapHelper.LabelType.BASE)
  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)
})
