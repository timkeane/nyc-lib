import OlGeomPoint from 'ol/geom/point'

import CartoSql from 'nyc/ol/format/CartoSql'

import nyc from 'nyc'

const reponseWithId = '{"rows":[{"cartodb_id":1,"wkt_geom":"POINT(1 2)","name":"feature 1"},{"cartodb_id":2,"wkt_geom":"POINT(2 3)","name":"feature 2"},{"cartodb_id":3,"wkt_geom":"POINT(3 4)","name":"feature 3"}]}'
const reponseNoId = '{"rows":[{"wkt_geom":"POINT(1 2)","name":"feature 1"},{"wkt_geom":"POINT(2 3)","name":"feature 2"},{"wkt_geom":"POINT(3 4)","name":"feature 3"}]}'


test('readFeatures with cartodb_id', () => {
  expect.assertions(13)

  const cartoPoint = new CartoSql({
    from: 'table'
  })

  const features = cartoPoint.readFeatures(reponseWithId)

  expect(features.length).toBe(3)

  expect(features[0].getGeometry().getCoordinates()).toEqual([1, 2])
  expect(features[0].getId()).toBe(1)
  expect(features[0].get('cartodb_id')).toBe(1)
  expect(features[0].get('name')).toBe('feature 1')

  expect(features[1].getGeometry().getCoordinates()).toEqual([2, 3])
  expect(features[1].getId()).toBe(2)
  expect(features[1].get('cartodb_id')).toBe(2)
  expect(features[1].get('name')).toBe('feature 2')

  expect(features[2].getGeometry().getCoordinates()).toEqual([3, 4])
  expect(features[2].getId()).toBe(3)
  expect(features[2].get('cartodb_id')).toBe(3)
  expect(features[2].get('name')).toBe('feature 3')
})

test('readFeatures without cartodb_id', () => {
  expect.assertions(10)

  const cartoPoint = new CartoSql({
    from: 'table'
  })

  const features = cartoPoint.readFeatures(reponseNoId)

  expect(features.length).toBe(3)

  expect(features[0].getGeometry().getCoordinates()).toEqual([1, 2])
  expect(features[0].getId()).toBe(0)
  expect(features[0].get('name')).toBe('feature 1')

  expect(features[1].getGeometry().getCoordinates()).toEqual([2, 3])
  expect(features[1].getId()).toBe(1)
  expect(features[1].get('name')).toBe('feature 2')

  expect(features[2].getGeometry().getCoordinates()).toEqual([3, 4])
  expect(features[2].getId()).toBe(2)
  expect(features[2].get('name')).toBe('feature 3')
})

test('getSql', () => {
  expect.assertions(3)

  let cartoPoint = new CartoSql({
    from: 'table'
  })

  expect(cartoPoint.getSql()).toBe('SELECT cartodb_id, ST_AsText(the_geom_webmercator) wkt_geom, * FROM table')

  cartoPoint = new CartoSql({
    select: 'cartodb_id as id, ST_AsText(the_geom_webmercator) wkt_geom, name',
    from: 'table'
  })

  expect(cartoPoint.getSql()).toBe('SELECT cartodb_id as id, ST_AsText(the_geom_webmercator) wkt_geom, name FROM table')

  cartoPoint = new CartoSql({
    select: 'cartodb_id as id, ST_AsText(the_geom_webmercator) wkt_geom, name',
    from: 'table',
    where: "name = 'Fred' and id > 0"
  })

  expect(cartoPoint.getSql()).toBe("SELECT cartodb_id as id, ST_AsText(the_geom_webmercator) wkt_geom, name FROM table WHERE name = 'Fred' and id > 0")
})

test('readProjection', () => {
  expect.assertions(1)

  const cartoPoint = new CartoSql({
    from: 'table'
  })

  expect(cartoPoint.readProjection()).toBe('EPSG:3857')
})

test('getLastExtent', () => {
  expect.assertions(1)

  const cartoPoint = new CartoSql({
    from: 'table'
  })

  expect(cartoPoint.getLastExtent()).toBeNull()
})