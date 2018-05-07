import OlFormatGeoJson from 'ol/format/geojson'

import OlFeature from 'ol/feature'
import OlGeomPoint from 'ol/geom/point'

const json = '{"type":"FeatureCollection","features":[{"type":"Feature","id":"1","geometry":{"type":"Point","coordinates":[-8225901.570409151,4992156.62272557]},"properties":{"zip":"10458","hours":"Mon, Tue, Wed, Thu, Fri, Sat: 9:00am - 9:00pm<br>Sun: 12:00pm - 6:00pm","address2":"(at Kingsbridge and Briggs)","city":"Bronx","address1":"310 East Kingsbridge Road","name":"Bronx - Bronx Library Center","type":"permanent"}}]}'
const fetchMock = require('fetch-mock')
fetchMock.get('https://maps.nyc.gov/data.json', json);

const AutoLoad = require('nyc/ol/source/AutoLoad').default

const FilterAndSort = require('nyc/ol/source/FilterAndSort').default

test('constructor', () => {
  const filterAndSort = new FilterAndSort({
    url: 'https://maps.nyc.gov/data.json',
    format: new OlFormatGeoJson()
  })
  expect(filterAndSort instanceof AutoLoad).toBe(true)
  expect(filterAndSort instanceof FilterAndSort).toBe(true)
})

test('sort', () => {
  const f0 = new OlFeature({id: 'f0', geometry: new OlGeomPoint([0, 0])})
  const f1 = new OlFeature({id: 'f1', geometry: new OlGeomPoint([0, 1])})
  const f2 = new OlFeature({id: 'f2', geometry: new OlGeomPoint([0, 2])})
  const f3 = new OlFeature({id: 'f3', geometry: new OlGeomPoint([0, 2])})
  const f4 = new OlFeature({id: 'f4', geometry: new OlGeomPoint([0, 3])})

  const filterAndSort = new FilterAndSort({
    features: [f0, f4, f2, f1, f3]
  })

  const features = filterAndSort.sort([0, 0])

  expect(features.length).toBe(5)
  expect(features[0]).toBe(f0)
  expect(features[1]).toBe(f1)
  expect(features[2]).toBe(f2)
  expect(features[3]).toBe(f3)
  expect(features[4]).toBe(f4)

  expect(features[0].get('distance')).toBe(0)
  expect(features[1].get('distance')).toBe(1)
  expect(features[2].get('distance')).toBe(2)
  expect(features[3].get('distance')).toBe(2)
  expect(features[4].get('distance')).toBe(3)
})

test('filter', () => {
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

  let features

  // features = filterAndSort.filter([filter0])
  //
  // expect(features.length).toBe(2)
  // expect(features[0]).toBe(f0)
  // expect(features[1]).toBe(f2)
  //
  // features = filterAndSort.filter([filter1])
  //
  // expect(features.length).toBe(2)
  // expect(features[0]).toBe(f0)
  // expect(features[1]).toBe(f3)

  features = filterAndSort.filter([filter0, filter1])

  expect(features.length).toBe(3)
  expect(features[0]).toBe(f0)
  expect(features[1]).toBe(f2)
  expect(features[2]).toBe(f3)
})
