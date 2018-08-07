import LocalStorage from 'nyc/ol/LocalStorage'

import Basemap from '../../../src/nyc/ol/Basemap'

import nyc from 'nyc'
import {register as olProjRegister} from 'ol/proj/proj4'

const proj4 = nyc.proj4
olProjRegister(proj4)

jest.mock('../../../src/nyc/ol/Basemap')

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
  map = new Basemap({})
})

test('addToMap objects', () => {
  expect.assertions(6)

  const storage = new LocalStorage()
  
  storage.addToMap(map, featureObjects, proj4.defs['EPSG:2263'])

  expect(map.addLayer).toHaveBeenCalledTimes(1)

  const actualFeatures = map.addLayer.mock.calls[0][0].getSource().getFeatures()

  expect(actualFeatures.length).toBe(2)
  expect(actualFeatures[0].get('NAME')).toBe('Astor Pl')

  expect(actualFeatures[0].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:3857', featureObjects[0].geometry.coordinates))
  expect(actualFeatures[1].get('NAME')).toBe('Canal St')
  expect(actualFeatures[1].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:3857', featureObjects[1].geometry.coordinates))
})

test('addToMap string', () => {
  expect.assertions(6)

  const storage = new LocalStorage()
  
  storage.addToMap(map, featuresString, proj4.defs['EPSG:2263'])

  expect(map.addLayer).toHaveBeenCalledTimes(1)

  const actualFeatures = map.addLayer.mock.calls[0][0].getSource().getFeatures()

  expect(actualFeatures.length).toBe(2)
  expect(actualFeatures[0].get('NAME')).toBe('Astor Pl')

  expect(actualFeatures[0].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:3857', featureObjects[0].geometry.coordinates))
  expect(actualFeatures[1].get('NAME')).toBe('Canal St')
  expect(actualFeatures[1].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:3857', featureObjects[1].geometry.coordinates))
})