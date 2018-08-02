import OlGeomPoint from 'ol/geom/point'

import CartoSqlPoint from 'nyc/ol/format/CartoSqlPoint'

import nyc from 'nyc'

const reponse = '{"rows":[{"cartodb_id":1,"x":1,"y":2,"name":"feature 1"},{"cartodb_id":2,"x":2,"y":3,"name":"feature 2"},{"cartodb_id":3,"x":3,"y":4,"name":"feature 3"}]}'


test('readFeatures', () => {
  expect.assertions(13)

  const cartoPoint = new CartoSqlPoint({
    from: 'table'
  })

  const features = cartoPoint.readFeatures(reponse)

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

test('getSql', () => {
  expect.assertions(3)

  let cartoPoint = new CartoSqlPoint({
    from: 'table'
  })

  expect(cartoPoint.getSql()).toBe('SELECT cartodb_id, ST_X(the_geom_webmercator) x, ST_Y(the_geom_webmercator) Y, * FROM table')

  cartoPoint = new CartoSqlPoint({
    select: 'cartodb_id as id, ST_X(the_geom_webmercator) x, ST_Y(the_geom_webmercator) Y, name',
    from: 'table'
  })

  expect(cartoPoint.getSql()).toBe('SELECT cartodb_id as id, ST_X(the_geom_webmercator) x, ST_Y(the_geom_webmercator) Y, name FROM table')

  cartoPoint = new CartoSqlPoint({
    select: 'cartodb_id as id, ST_X(the_geom_webmercator) x, ST_Y(the_geom_webmercator) Y, name',
    from: 'table',
    where: "name = 'Fred' and id > 0"
  })

  expect(cartoPoint.getSql()).toBe("SELECT cartodb_id as id, ST_X(the_geom_webmercator) x, ST_Y(the_geom_webmercator) Y, name FROM table WHERE name = 'Fred' and id > 0")
})

test('readProjection', () => {
  expect.assertions(1)

  const cartoPoint = new CartoSqlPoint({
    from: 'table'
  })

  expect(cartoPoint.readProjection()).toBe('EPSG:3857')
})

test('getLastExtent', () => {
  expect.assertions(1)

  const cartoPoint = new CartoSqlPoint({
    from: 'table'
  })

  expect(cartoPoint.getLastExtent()).toBeNull()
})