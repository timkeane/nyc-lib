import LocalStorage from 'nyc/leaf/LocalStorage'

import Basemap from 'nyc/leaf/Basemap'

import nyc from 'nyc'
import proj4 from 'proj4'
proj4.defs(nyc.projections)

let map
const featureObjects = [
  {type:'Feature',properties:{NAME:'Astor Pl'},geometry:{type:'Point',coordinates:[986725,205255]}},
  {type:'Feature',properties:{NAME:'Canal St'},geometry:{type:'Point',coordinates:[984197,201156]}}
]
const featuresString = '{"type": "FeatureCollection", "features":[' +
  '{"type":"Feature","properties":{"NAME":"Astor Pl"},"geometry":{"type":"Point","coordinates":[986725,205255]}},' +
  '{"type":"Feature","properties":{"NAME":"Canal St"},"geometry":{"type":"Point","coordinates":[984197,201156]}}' +
']}'
beforeEach(() => {
  $('body').append('<div id="map"></div>')
  map = new Basemap({target: 'map'})
  map.addLayer = jest.fn()
})
afterEach(() => {
  $('#map').remove()
})

test('addToMap objects', () => {
  expect.assertions(1)

  const storage = new LocalStorage()
  
  storage.addToMap(map, featureObjects, proj4.defs['EPSG:2263'])

  expect(map.addLayer).toHaveBeenCalledTimes(1)
})

test('addToMap string', () => {
  expect.assertions(1)

  const storage = new LocalStorage()
  
  storage.addToMap(map, featuresString, proj4.defs['EPSG:2263'])

  expect(map.addLayer).toHaveBeenCalledTimes(1)
})

test('addToMap no proj', () => {
  expect.assertions(1)

  const storage = new LocalStorage()
  
  storage.addToMap(map, featuresString)

  expect(map.addLayer).toHaveBeenCalledTimes(1)
})

