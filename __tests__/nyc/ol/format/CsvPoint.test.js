import Encoding from 'text-encoding'

import OlGeomPoint from 'ol/geom/Point'
import OlFormatFormatType from 'ol/format/FormatType'

import CsvPoint from 'nyc/ol/format/CsvPoint'
import StandardCsv from 'nyc/ol/format/StandardCsv'

import nyc from 'nyc'
import nycOl from 'nyc/ol'

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
  expect.assertions(16)

  const csvpoint = new CsvPoint({
    x: 'x',
    y: 'y',
    id: 'id',
    dataProjection: 'EPSG:2263',
    featureProjection: 'EPSG:4326'
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
  expect.assertions(10)

  const csvpoint = new CsvPoint({
    x: 'x',
    y: 'y'
  })

  const features = csvpoint.readFeatures(new Encoding.TextEncoder().encode(csv).buffer)

  expect(features.length).toBe(3)
  expect(features[0].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([0, 0]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[1].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([1, 2]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())
  expect(features[2].getGeometry().getCoordinates()).toEqual(new OlGeomPoint([2, 3]).transform('EPSG:4326', 'EPSG:3857').getCoordinates())

  expect(features[0].getProperties().name).toBe('foo')

  expect(features[1].getProperties().name).toBe('bar')

  expect(features[2].getProperties().name).toBe('wtf')

  expect(features[0].getId()).toBe(0)
  expect(features[1].getId()).toBe(1)
  expect(features[2].getId()).toBe(2)
})

test('readFeatures no id or default projections', () => {
  expect.assertions(16)

  const csvpoint = new CsvPoint({
    x: 'x',
    y: 'y'
  })

  const features = csvpoint.readFeatures(sourceNoId, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'})

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
  expect.assertions(1)

  expect(new CsvPoint({x: 'x', y: 'y'}).getType()).toBe(OlFormatFormatType.ARRAY_BUFFER)
})

describe('hookupEvents called from constructor', () => {
  const error = console.error
  beforeEach(() => {
    console.error = jest.fn()
  })
  afterEach(() => {
    console.error = error
  })
  test('readFeatures has bad data', () => {
    expect.assertions(3)

    const source = [{x: '123', y: 'abc'}]

    const csvpoint = new CsvPoint({
      x: 'x',
      y: 'y'
    })

    csvpoint.readFeatures(source)

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error.mock.calls[0][0]).toBe('Invalid coordinate [123, NaN] for id 0')
    expect(console.error.mock.calls[0][1]).toBe(source[0])
  })

  test('readProjection', () => {
    expect.assertions(1)

    const csvpoint = new CsvPoint({
      x: 'x',
      y: 'y'
    })
    
    expect(csvpoint.readProjection('anything')).toBe(csvpoint.dataProjection)
  })

  test('getLastExtent', () => {
    expect.assertions(1)

    const csvpoint = new CsvPoint({
      x: 'x',
      y: 'y'
    })

    expect(csvpoint.getLastExtent()).toBeNull()
  })
})

describe('detectCsvFormat', () => {
  test('detectCsvFormat autoDetect = true with X, Y', () => {
    expect.assertions(3)

    const csvpoint = new CsvPoint({autoDetect: true})

    csvpoint.detectCsvFormat([{X: 1, Y: 2}])

    expect(csvpoint.x).toBe(StandardCsv.X)
    expect(csvpoint.y).toBe(StandardCsv.Y)
    expect(csvpoint.dataProjection.getCode()).toBe('EPSG:2263')
  })

  test('detectCsvFormat autoDetect = true with LNG, LAT', () => {
    expect.assertions(3)

    const csvpoint = new CsvPoint({autoDetect: true})

    csvpoint.detectCsvFormat([{LNG: 1, LAT: 2}])

    expect(csvpoint.x).toBe(StandardCsv.LNG)
    expect(csvpoint.y).toBe(StandardCsv.LAT)
    expect(csvpoint.dataProjection.getCode()).toBe('EPSG:4326')
  })

})
