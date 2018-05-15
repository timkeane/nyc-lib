import $ from 'jquery'

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
  const basemap = new Basemap({target: 'map0'})
  const lMap = L.map('map1')
  expect(basemap instanceof Basemap)
  expect(typeof basemap.setView).toBe('function')
  
  // expect(Object.getOwnPropertyNames(basemap)).toEqual(Object.getOwnPropertyNames(lMap))
})