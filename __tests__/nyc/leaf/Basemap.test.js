import $ from 'jquery'

import nyc from 'nyc/nyc'
import Basemap from 'nyc/leaf/Basemap'
import BasemapHelper from 'nyc/BasemapHelper'

import L from 'leaflet'

let target0
let target1
beforeEach(() => {
  target0 = $('<div id="map0"></div>')
  target1 = $('<div id="map1"></div>')
  $('body').append(target0).append(target1)
})
afterEach(() => {
  target0.remove()
  target1.remove()
})


describe('constrcutor tests', () => {
  const mixin = nyc.mixin
  const setupLayers = Basemap.prototype.setupLayers
  beforeEach(() => {
    Basemap.prototype.setupLayers = jest.fn()
  })
  afterEach(() => {
    Basemap.prototype.setupLayers = setupLayers
    nyc.mixin = mixin
  })

  test('constructor', () => {
    expect.assertions(270)
    const options = {target: 'map0'}
    const basemap = new Basemap(options)
    const lMap = L.map('map1')
    expect(basemap instanceof L.Map).toBe(true)
  
    Object.keys(L.Map.prototype).forEach(member => {
      expect(basemap[member]).not.toBe(undefined)
      if (typeof L.Map.prototype[member] === 'function') {
        expect(typeof basemap[member]).toBe('function')      
      } else if (typeof L.Map.prototype[member] === 'object') {
        expect(typeof basemap[member]).toBe('object')      
      } else {
        console.warn(`Untested ${member} of type ${typeof L.Map.prototype[member]}`)
        throw 'FAIL!'
      }
    })
  
    Object.keys(BasemapHelper).forEach(member => {
      expect(basemap[member]).not.toBe(undefined)
      if (typeof BasemapHelper[member] === 'function') {
        expect(typeof basemap[member]).toBe('function')      
      } else if (typeof BasemapHelper[member] === 'object') {
        expect(typeof basemap[member]).toBe('object')      
      } else {
        console.warn(`Untested ${member} of type ${typeof BasemapHelper[member]}`)
        throw 'FAIL!'
      }
    })
  
    Object.keys(Basemap.prototype).forEach(member => {
      console.warn(member)
      expect(basemap[member]).not.toBe(undefined)
      if (typeof Basemap.prototype[member] === 'function') {
        expect(typeof basemap[member]).toBe('function')      
      } else if (typeof Basemap.prototype[member] === 'object') {
        expect(typeof basemap[member]).toBe('object')      
      } else {
        console.warn(`Untested ${member} of type ${typeof BasemapHelper[member]}`)
        throw 'FAIL!'
      }
    })

    expect(Basemap.prototype.setupLayers).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.setupLayers.mock.calls[0][0]).toBe(basemap)
    expect(Basemap.prototype.setupLayers.mock.calls[0][1]).toEqual(options)

  })
})

test('getStorage', () => {
  expect.assertions(1)

  const basemap = new Basemap({target: 'map0'})
  expect(basemap.getStorage()).toEqual(null)
})

test('showPhoto', () => {
  expect.assertions(10)
  const basemap = new Basemap({target: 'map0'})

  basemap.hidePhoto = jest.fn()
  basemap.addLayer = jest.fn()
  basemap.showLabels = jest.fn()
  basemap.showPhoto(2014)
  
  expect(basemap.hidePhoto).toHaveBeenCalledTimes(1)

  expect(basemap.addLayer).toHaveBeenCalledTimes(1)
  expect(basemap.addLayer.mock.calls[0][0].name).toBe('2014')
  
  expect(basemap.showLabels).toHaveBeenCalledTimes(1)
  expect(basemap.showLabels.mock.calls[0][0]).toBe('photo')
  
  basemap.showPhoto()

  expect(basemap.hidePhoto).toHaveBeenCalledTimes(2)

  expect(basemap.addLayer).toHaveBeenCalledTimes(2)
  expect(basemap.addLayer.mock.calls[1][0].name).toBe(basemap.latestPhoto)
  
  expect(basemap.showLabels).toHaveBeenCalledTimes(2)
  expect(basemap.showLabels.mock.calls[1][0]).toBe('photo')
})

test('showLabels', () => {
  expect.assertions(6)

  const basemap = new Basemap({target: 'map0'})

  expect(basemap.labels.base._tiles).not.toBe({} || undefined)
  expect(basemap.labels.photo._tiles).toBe(undefined)

  basemap.showLabels(BasemapHelper.LabelType.PHOTO)
  expect(basemap.labels.base._tiles).toEqual({})
  expect(basemap.labels.photo._tiles).not.toBe({} || undefined)

  basemap.showLabels(BasemapHelper.LabelType.BASE)
  expect(basemap.labels.base._tiles).not.toBe({} || undefined)
  expect(basemap.labels.photo._tiles).toEqual({})
})

test('hidePhoto', () => {
  expect.assertions(4)

  const basemap = new Basemap({target: 'map0'})

  basemap.showLabels = jest.fn()
  basemap.removeLayer = jest.fn()
  basemap.addLayer(basemap.photos[2014]) // adding a photo to the map
  basemap.hidePhoto() // removing the photo from the map

  expect(basemap.showLabels).toHaveBeenCalledTimes(1)
  expect(basemap.showLabels.mock.calls[0][0]).toBe('base')

  expect(basemap.removeLayer).toHaveBeenCalledTimes(1)
  expect(basemap.removeLayer.mock.calls[0][0].name).toBe('2014')
})

test('getBaseLayers', () => {
  expect.assertions(6)
  const basemap = new Basemap({target: 'map0'})

  const getBaseLayers = basemap.getBaseLayers()
  basemap.getBaseLayers = jest.fn()

  expect(typeof basemap.getBaseLayers).toBe('function')
  expect(typeof getBaseLayers).toBe('object')

  const getBaseLayersName = Object.keys(getBaseLayers)

  expect(typeof getBaseLayersName).toBe('object')
  expect(getBaseLayersName[0]).toEqual('base')
  expect(getBaseLayersName[1]).toEqual('labels')
  expect(getBaseLayersName[2]).toEqual('photos')
})

test('setupLayers', () => {
  expect.assertions(2)
  const basemap = new Basemap({target: 'map0'})

  basemap.setupLayers = jest.fn()
  expect(typeof basemap.setupLayers).toBe('function');
  
  basemap.setupLayers()
  expect(basemap.setupLayers).toHaveBeenCalledTimes(1)
})
