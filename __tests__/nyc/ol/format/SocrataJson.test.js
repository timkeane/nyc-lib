import OlGeomPoint from 'ol/geom/Point'
import SocrataJson from 'nyc/ol/format/SocrataJson'
import {get as olProjGet} from 'ol/proj'

import nyc from 'nyc'
import nycOl from 'nyc/ol'

const sourceId = [
  {id: 'a', geom: {type: 'Point', coordinates: [0, 0]}, name: 'foo'},
  {id: 'b', geom: {type: 'Point', coordinates: [1, 2]}, name: 'bar'},
  {id: 'c', geom: {type: 'Point', coordinates: [3, 4]}, name: 'wtf'}
]
const sourceNoId = [
  {the_geom: {type: 'Point', coordinates: [0, 0]}, name: 'foo'},
  {the_geom: {type: 'Point', coordinates: [1, 2]}, name: 'bar'},
  {the_geom: {type: 'Point', coordinates: [3, 4]}, name: 'wtf'}
]

test('readFeaturesFromObject has id and geometry names', () => {
  expect.assertions(10)

  const socrataJson = new SocrataJson({
    geometry: 'geom',
    id: 'id'
  })

  const features = socrataJson.readFeatures(sourceId)

  expect(features.length).toBe(3)
  expect(features[0].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([0, 0]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[1].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([1, 2]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[2].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([3, 4]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())

  expect(features[0].getProperties().name).toBe('foo')
  expect(features[1].getProperties().name).toBe('bar')
  expect(features[2].getProperties().name).toBe('wtf')

  expect(features[0].getId()).toBe('a')
  expect(features[1].getId()).toBe('b')
  expect(features[2].getId()).toBe('c')
})

test('readFeaturesFromObject no id or geometry names', () => {
  expect.assertions(10)

  const socrataJson = new SocrataJson({})

  const features = socrataJson.readFeatures(sourceNoId)

  expect(features.length).toBe(3)
  expect(features[0].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([0, 0]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[1].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([1, 2]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[2].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([3, 4]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())

  expect(features[0].getProperties().name).toBe('foo')
  expect(features[1].getProperties().name).toBe('bar')
  expect(features[2].getProperties().name).toBe('wtf')

  expect(features[0].getId()).toBe('SocrataJson-0')
  expect(features[1].getId()).toBe('SocrataJson-1')
  expect(features[2].getId()).toBe('SocrataJson-2')
})

test('readProjection', () => {
  expect.assertions(1)

  const socrataJson = new SocrataJson({})

  expect(socrataJson.readProjection().getCode()).toBe('EPSG:4326')
})
