import OlFormatGeoJson from 'ol/format/GeoJSON'
import OlFeature from 'ol/Feature'
import OlGeomPoint from 'ol/geom/Point'
import OlGeomLineString from 'ol/geom/LineString'
import {get as olProjGet} from 'ol/proj'
import AutoLoad from 'nyc/ol/source/AutoLoad'

import nycOl from 'nyc/ol'

const FilterAndSort = require('nyc/ol/source/FilterAndSort').default

test('constructor', () => {
  expect.assertions(2)

  const filterAndSort = new FilterAndSort({
    url: 'https://maps.nyc.gov/data.json',
    format: new OlFormatGeoJson()
  })

  expect(filterAndSort instanceof AutoLoad).toBe(true)
  expect(filterAndSort instanceof FilterAndSort).toBe(true)
})

test('sort is metric', () => {
  expect.assertions(11)

  const f0 = new OlFeature({id: 'f0', geometry: new OlGeomPoint([0, 0])})
  const f1 = new OlFeature({id: 'f1', geometry: new OlGeomPoint([0, 1])})
  const f2 = new OlFeature({id: 'f2', geometry: new OlGeomPoint([0, 2])})
  const f3 = new OlFeature({id: 'f3', geometry: new OlGeomPoint([0, 2])})
  const f4 = new OlFeature({id: 'f4', geometry: new OlGeomPoint([0, 3])})

  const filterAndSort = new FilterAndSort({
    features: [f0, f4, f2, f1, f3]
  }, true)

  const features = filterAndSort.sort([0, 0])

  expect(features.length).toBe(5)
  expect(features[0]).toBe(f0)
  expect(features[1]).toBe(f1)
  expect(features[2]).toBe(f2)
  expect(features[3]).toBe(f3)
  expect(features[4]).toBe(f4)

  expect(features[0].getDistance().distance).toBe(0)
  expect(features[1].getDistance().distance).toBe(1)
  expect(features[2].getDistance().distance).toBe(2)
  expect(features[3].getDistance().distance).toBe(2)
  expect(features[4].getDistance().distance).toBe(3)
})

test('filter', () => {
  expect.assertions(2)

  const f0 = new OlFeature({id: 'f0', type: 'foo', geometry: new OlGeomPoint([0, 0])})
  const f1 = new OlFeature({id: 'f1', type: 'bar', geometry: new OlGeomPoint([0, 1])})
  const f2 = new OlFeature({id: 'f2', type: 'bar', geometry: new OlGeomPoint([0, 2])})
  const f3 = new OlFeature({id: 'f3', type: 'foo', geometry: new OlGeomPoint([0, 2])})
  const f4 = new OlFeature({id: 'f4', type: 'bar', geometry: new OlGeomPoint([0, 3])})

  f0.setId(f0.get('id'))
  f1.setId(f1.get('id'))
  f2.setId(f2.get('id'))
  f3.setId(f3.get('id'))
  f4.setId(f4.get('id'))

  const filter0 = {property: 'id', values: ['f0', 'f2']}
  const filter1 = {property: 'type', values: ['foo']}

  const filterAndSort = new FilterAndSort({
    features: [f0, f4, f2, f1, f3]
  })

  const features = filterAndSort.filter([[filter0], [filter1]])

  expect(features.length).toBe(1)
  expect(features[0].getId()).toBe('f0')
})



test('filter', () => {
  expect.assertions(3)

  const f0 = new OlFeature({id: 'f0', young: '1', old: null, geometry: new OlGeomPoint([0, 0])})
  const f1 = new OlFeature({id: 'f1', young: null, old: null, geometry: new OlGeomPoint([0, 1])})
  const f2 = new OlFeature({id: 'f2', young: '1', old: '1', geometry: new OlGeomPoint([0, 2])})
  const f3 = new OlFeature({id: 'f3', young: '1', old: null, geometry: new OlGeomPoint([0, 2])})
  const f4 = new OlFeature({id: 'f4', young: null, old: '1', geometry: new OlGeomPoint([0, 3])})

  f0.setId(f0.get('id'))
  f1.setId(f1.get('id'))
  f2.setId(f2.get('id'))
  f3.setId(f3.get('id'))
  f4.setId(f4.get('id'))

  const filter0 = [{property: 'id', values: ['f0', 'f2']}]
  const filter1 = [
    {property: 'young', values: ['1']}, 
    {property: 'old', values: ['1']}
  ]

  const filterAndSort = new FilterAndSort({
    features: [f0, f4, f2, f1, f3]
  })

  const features = filterAndSort.filter([filter0, filter1])

  expect(features.length).toBe(2)
  expect($.inArray(f0, features) > -1).toBe(true)
  expect($.inArray(f2, features) > -1).toBe(true)
  // expect(features[0]).toBe(f2)
})





test('sort with distance in data projection', () => {
  expect.assertions(16)

  const f0 = new OlFeature({id: 'f0', geometry: new OlGeomPoint([0, 0])})
  const f1 = new OlFeature({id: 'f1', geometry: new OlGeomPoint([100, 0])})
  const f2 = new OlFeature({id: 'f2', geometry: new OlGeomPoint([200, 0])})
  const f3 = new OlFeature({id: 'f3', geometry: new OlGeomPoint([300, 0])})
  const f4 = new OlFeature({id: 'f4', geometry: new OlGeomPoint([400, 0])})

  const filterAndSort = new FilterAndSort({
    features: [f0, f4, f2, f1, f3],
    format: {
      dataProjection: 'EPSG:2263'
    }
  })

  const features = filterAndSort.sort([0, 0])

  expect(features.length).toBe(5)
  expect(features[0]).toBe(f0)
  expect(features[1]).toBe(f1)
  expect(features[2]).toBe(f2)
  expect(features[3]).toBe(f3)
  expect(features[4]).toBe(f4)

  expect(features[0].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [0, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())
  expect(features[1].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [100, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())
  expect(features[2].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [200, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())
  expect(features[3].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [300, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())
  expect(features[4].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [400, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())

  expect(features[0].getDistance().units).toBe('ft')
  expect(features[1].getDistance().units).toBe('ft')
  expect(features[2].getDistance().units).toBe('ft')
  expect(features[3].getDistance().units).toBe('ft')
  expect(features[4].getDistance().units).toBe('ft')
})

test('sort with distance in data projection from parentFormat', () => {
  expect.assertions(16)

  const f0 = new OlFeature({id: 'f0', geometry: new OlGeomPoint([0, 0])})
  const f1 = new OlFeature({id: 'f1', geometry: new OlGeomPoint([100, 0])})
  const f2 = new OlFeature({id: 'f2', geometry: new OlGeomPoint([200, 0])})
  const f3 = new OlFeature({id: 'f3', geometry: new OlGeomPoint([300, 0])})
  const f4 = new OlFeature({id: 'f4', geometry: new OlGeomPoint([400, 0])})

  const filterAndSort = new FilterAndSort({
    features: [f0, f4, f2, f1, f3],
    format: {
      parentFormat: {
        dataProjection: 'EPSG:2263'
      }
    }
  })

  const features = filterAndSort.sort([0, 0])

  expect(features.length).toBe(5)
  expect(features[0]).toBe(f0)
  expect(features[1]).toBe(f1)
  expect(features[2]).toBe(f2)
  expect(features[3]).toBe(f3)
  expect(features[4]).toBe(f4)

  expect(features[0].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [0, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())
  expect(features[1].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [100, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())
  expect(features[2].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [200, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())
  expect(features[3].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [300, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())
  expect(features[4].getDistance().distance).toBe(new OlGeomLineString([[0, 0], [400, 0]]).transform('EPSG:3857', 'EPSG:2263').getLength())

  expect(features[0].getDistance().units).toBe('ft')
  expect(features[1].getDistance().units).toBe('ft')
  expect(features[2].getDistance().units).toBe('ft')
  expect(features[3].getDistance().units).toBe('ft')
  expect(features[4].getDistance().units).toBe('ft')
})

test('storeFeatures', () => {
  expect.assertions(0)
  new FilterAndSort({}).set('autoload-complete', true)
})

test('distance - is metric', () => {
  expect.assertions(6)

  const geom = new OlGeomPoint([1, 2])

  const filterAndSort = new FilterAndSort({}, true)

  filterAndSort.projections = () => {
    return [null, olProjGet('EPSG:3857')]
  }

  let distance = filterAndSort.distance([1, 3], geom)

  expect(distance.distance).toBe(1)
  expect(distance.units).toBe('m')

  filterAndSort.projections = () => {
    return [olProjGet('EPSG:4326'), olProjGet('EPSG:3857')]
  }

  distance = filterAndSort.distance([1, 3], geom)

  expect(distance.distance).toBe(1)
  expect(distance.units).toBe('m')

  filterAndSort.projections = () => {
    return [olProjGet('EPSG:2263'), olProjGet('EPSG:3857')]
  }

  distance = filterAndSort.distance([1, 3], geom)

  expect(distance.distance.toFixed(2)).toBe('4.11')
  expect(distance.units).toBe('ft')
})

test('distance - not metric', () => {
  expect.assertions(6)

  const geom = new OlGeomPoint([1, 2])

  const filterAndSort = new FilterAndSort({}, false)

  filterAndSort.projections = () => {
    return [null, olProjGet('EPSG:3857')]
  }

  let distance = filterAndSort.distance([1, 3], geom)

  expect(distance.distance).toBe(3.28084)
  expect(distance.units).toBe('ft')

  filterAndSort.projections = () => {
    return [olProjGet('EPSG:4326'), olProjGet('EPSG:3857')]
  }

  distance = filterAndSort.distance([1, 3], geom)

  expect(distance.distance).toBe(3.28084)
  expect(distance.units).toBe('ft')

  filterAndSort.projections = () => {
    return [olProjGet('EPSG:2263'), olProjGet('EPSG:3857')]
  }

  distance = filterAndSort.distance([1, 3], geom)

  expect(distance.distance.toFixed(2)).toBe('4.11')
  expect(distance.units).toBe('ft')
})
