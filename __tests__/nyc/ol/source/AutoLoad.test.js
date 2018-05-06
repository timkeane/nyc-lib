import OlFormatGeoJson from 'ol/format/geojson'

import OlSourceVector from 'ol/source/vector'

const json = '{"type":"FeatureCollection","features":[{"type":"Feature","id":"1","geometry":{"type":"Point","coordinates":[-8225901.570409151,4992156.62272557]},"properties":{"zip":"10458","hours":"Mon, Tue, Wed, Thu, Fri, Sat: 9:00am - 9:00pm<br>Sun: 12:00pm - 6:00pm","address2":"(at Kingsbridge and Briggs)","city":"Bronx","address1":"310 East Kingsbridge Road","name":"Bronx - Bronx Library Center","type":"permanent"}}]}'
const fetchMock = require('fetch-mock')
fetchMock.get('https://maps.nyc.gov/data.json', json);

const AutoLoad = require('nyc/ol/source/AutoLoad').default

test('constructor', () => {
  const autoload = new AutoLoad({
    url: 'https://maps.nyc.gov/data.json',
    format: new OlFormatGeoJson()
  })
  expect(autoload instanceof OlSourceVector).toBe(true)
  expect(autoload instanceof AutoLoad).toBe(true)
  expect(autoload.autoLoad() instanceof Promise).toBe(true)
})

test('resolve', () => {
  const geojson = JSON.parse(json).features[0]

  return new AutoLoad({
    url: 'https://maps.nyc.gov/data.json',
    format: new OlFormatGeoJson()
  }).autoLoad().then(features => {
    expect(features.length).toBe(1)
    expect(features[0].getGeometry().getCoordinates()).toEqual(geojson.geometry.coordinates)
    expect(features[0].get('name')).toEqual(geojson.properties.name)
    expect(features[0].get('address1')).toEqual(geojson.properties.address1)
    expect(features[0].get('address2')).toEqual(geojson.properties.address2)
    expect(features[0].get('city')).toEqual(geojson.properties.city)
    expect(features[0].get('hours')).toEqual(geojson.properties.hours)
    expect(features[0].get('type')).toEqual(geojson.properties.type)
    expect(features[0].get('zip')).toEqual(geojson.properties.zip)
  })
})
