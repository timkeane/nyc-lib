import $ from 'jquery'

import BasemapHelper from 'nyc/BasemapHelper'
import Basemap from 'nyc/leaf/Basemap'

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

test('constructor', () => {
  expect.assertions(259)

  const basemap = new Basemap({target: 'map0'})
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
})