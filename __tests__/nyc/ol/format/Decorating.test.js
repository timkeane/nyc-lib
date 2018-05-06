import proj4 from 'proj4'

import nyc from 'nyc/nyc'

import CsvPoint from 'nyc/ol/format/CsvPoint'
import Decorating from 'nyc/ol/format/Decorating'

const sourceId = [
  {id: 'a', x: 0, y: 0, first: 'foo', last: 'bar'},
  {id: 'b', x: 1, y: 2, first: 'bar', last: 'foo'},
  {id: 'c', x: 2, y: 3, first: 'wtf', last: 'lol'}
]
const parentFormat = new CsvPoint({
  x: 'x',
  y: 'y',
  id: 'id',
  defaultDataProjection: 'EPSG:2263',
  defaultFeatureProjection: 'EPSG:4326'
})
const extendFeatureDecorations = [
  {
    extendFeature() {
      this.set('fullname', `${this.get('first')} ${this.get('last')}`)
    }
  },
  {
    getName() {
      return this.get('fullname')
    }
  }
]
const featureDecorations = [
  {
    sayHi() {
      return `Hi, ${this.getName()}!`
    }
  },
  {
    getName() {
      return `${this.get('first')} ${this.get('last')}`
    }
  }
]

test('readFeatures extendFeature', () => {
  const decorating = new Decorating({
    parentFormat: parentFormat,
    decorations: extendFeatureDecorations
  })

  const features = decorating.readFeatures(sourceId)

  expect(features.length).toBe(3)
  expect(features[0].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:4326', [0, 0]))
  expect(features[1].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:4326', [1, 2]))
  expect(features[2].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:4326', [2, 3]))

  expect(features[0].getProperties().x).toBe(0)
  expect(features[0].getProperties().y).toBe(0)
  expect(features[0].getProperties().first).toBe('foo')
  expect(features[0].getProperties().last).toBe('bar')

  expect(features[1].getProperties().x).toBe(1)
  expect(features[1].getProperties().y).toBe(2)
  expect(features[1].getProperties().first).toBe('bar')
  expect(features[1].getProperties().last).toBe('foo')

  expect(features[2].getProperties().x).toBe(2)
  expect(features[2].getProperties().y).toBe(3)
  expect(features[2].getProperties().first).toBe('wtf')
  expect(features[2].getProperties().last).toBe('lol')

  expect(features[0].getId()).toBe('a')
  expect(features[1].getId()).toBe('b')
  expect(features[2].getId()).toBe('c')

  expect(features[0].getName()).toBe('foo bar')
  expect(features[1].getName()).toBe('bar foo')
  expect(features[2].getName()).toBe('wtf lol')
})

test('readFeatures no extendFeature', () => {
  const decorating = new Decorating({
    parentFormat: parentFormat,
    decorations: featureDecorations
  })

  const features = decorating.readFeatures(sourceId)

  expect(features.length).toBe(3)
  expect(features[0].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:4326', [0, 0]))
  expect(features[1].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:4326', [1, 2]))
  expect(features[2].getGeometry().getCoordinates()).toEqual(proj4('EPSG:2263', 'EPSG:4326', [2, 3]))

  expect(features[0].getProperties().x).toBe(0)
  expect(features[0].getProperties().y).toBe(0)
  expect(features[0].getProperties().first).toBe('foo')
  expect(features[0].getProperties().last).toBe('bar')

  expect(features[1].getProperties().x).toBe(1)
  expect(features[1].getProperties().y).toBe(2)
  expect(features[1].getProperties().first).toBe('bar')
  expect(features[1].getProperties().last).toBe('foo')

  expect(features[2].getProperties().x).toBe(2)
  expect(features[2].getProperties().y).toBe(3)
  expect(features[2].getProperties().first).toBe('wtf')
  expect(features[2].getProperties().last).toBe('lol')

  expect(features[0].getId()).toBe('a')
  expect(features[1].getId()).toBe('b')
  expect(features[2].getId()).toBe('c')

  expect(features[0].getName()).toBe('foo bar')
  expect(features[1].getName()).toBe('bar foo')
  expect(features[2].getName()).toBe('wtf lol')

  expect(features[0].sayHi()).toBe('Hi, foo bar!')
  expect(features[1].sayHi()).toBe('Hi, bar foo!')
  expect(features[2].sayHi()).toBe('Hi, wtf lol!')
})
