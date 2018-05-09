import Encoding from 'text-encoding'

import OlGeomPoint from 'ol/geom/point'
import OlFormatFormatType from 'ol/format/formattype'

import CsvPoint from 'nyc/ol/format/CsvPoint'

import nyc from 'nyc/nyc'

const csv = 'x,y,name\n0,0,foo\n1,2,bar\n2,3,wtf'
const sourceId = [
  {id: 'a', x: 0, y: 0, name: 'foo'},
  {id: 'b', x: 1, y: 2, name: 'bar'},
  {id: 'c', x: 2, y: 3, name: 'wtf'}
]
const sourceNoId = [
  {x: 0, y: 0, name: 'foo'},
  {x: 1, y: 2, name: 'bar'},
  {x: 2, y: 3, name: 'wtf'}
]

test('readFeatures has id and projections', () => {
  const csvpoint = new CsvPoint({
    x: 'x',
    y: 'y',
    id: 'id',
    defaultDataProjection: 'EPSG:2263',
    defaultFeatureProjection: 'EPSG:4326'
  })

  const features = csvpoint.readFeatures(sourceId)

  expect(features.length).toBe(3)
  expect(features[0].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([0, 0]).transform('EPSG:2263', 'EPSG:4326').getCoordinates())
  expect(features[1].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([1, 2]).transform('EPSG:2263', 'EPSG:4326').getCoordinates())
  expect(features[2].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([2, 3]).transform('EPSG:2263', 'EPSG:4326').getCoordinates())

  expect(features[0].getProperties().x).toBe(0)
  expect(features[0].getProperties().y).toBe(0)
  expect(features[0].getProperties().name).toBe('foo')

  expect(features[1].getProperties().x).toBe(1)
  expect(features[1].getProperties().y).toBe(2)
  expect(features[1].getProperties().name).toBe('bar')

  expect(features[2].getProperties().x).toBe(2)
  expect(features[2].getProperties().y).toBe(3)
  expect(features[2].getProperties().name).toBe('wtf')

  expect(features[0].getId()).toBe('a')
  expect(features[1].getId()).toBe('b')
  expect(features[2].getId()).toBe('c')
})

test('readFeatures from ArrayBuffer no id or default projections', () => {
  const csvpoint = new CsvPoint({
    x: 'x',
    y: 'y'
  })

  const features = csvpoint.readFeatures(new Encoding.TextEncoder().encode(csv).buffer)

  expect(features.length).toBe(3)
  expect(features[0].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([0, 0]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[1].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([1, 2]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[2].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([2, 3]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())

  expect(features[0].getProperties().x).toBe(0)
  expect(features[0].getProperties().y).toBe(0)
  expect(features[0].getProperties().name).toBe('foo')

  expect(features[1].getProperties().x).toBe(1)
  expect(features[1].getProperties().y).toBe(2)
  expect(features[1].getProperties().name).toBe('bar')

  expect(features[2].getProperties().x).toBe(2)
  expect(features[2].getProperties().y).toBe(3)
  expect(features[2].getProperties().name).toBe('wtf')

  expect(features[0].getId()).toBe(0)
  expect(features[1].getId()).toBe(1)
  expect(features[2].getId()).toBe(2)
})

test('readFeatures no id or default projections', () => {
  const csvpoint = new CsvPoint({
    x: 'x',
    y: 'y'
  })

  const features = csvpoint.readFeatures(sourceNoId)

  expect(features.length).toBe(3)
  expect(features[0].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([0, 0]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[1].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([1, 2]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[2].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([2, 3]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())

  expect(features[0].getProperties().x).toBe(0)
  expect(features[0].getProperties().y).toBe(0)
  expect(features[0].getProperties().name).toBe('foo')

  expect(features[1].getProperties().x).toBe(1)
  expect(features[1].getProperties().y).toBe(2)
  expect(features[1].getProperties().name).toBe('bar')

  expect(features[2].getProperties().x).toBe(2)
  expect(features[2].getProperties().y).toBe(3)
  expect(features[2].getProperties().name).toBe('wtf')

  expect(features[0].getId()).toBe(0)
  expect(features[1].getId()).toBe(1)
  expect(features[2].getId()).toBe(2)
})

test('getType', () => {
  expect(new CsvPoint({x: 'x', y: 'y'}).getType()).toBe(OlFormatFormatType.ARRAY_BUFFER)
})
