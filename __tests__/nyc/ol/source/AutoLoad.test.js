import OlFormatGeoJson from 'ol/format/GeoJSON'
import OlSourceVector from 'ol/source/Vector'
import AutoLoad from 'nyc/ol/source/AutoLoad'
import CsvAddr from 'nyc/ol/format/CsvAddr'
import Decorate from 'nyc/ol/format/Decorate'

const json = '{"type":"FeatureCollection","features":[{"type":"Feature","id":"1","geometry":{"type":"Point","coordinates":[-8225901.570409151,4992156.62272557]},"properties":{"zip":"10458","hours":"Mon, Tue, Wed, Thu, Fri, Sat: 9:00am - 9:00pm<br>Sun: 12:00pm - 6:00pm","address2":"(at Kingsbridge and Briggs)","city":"Bronx","address1":"310 East Kingsbridge Road","name":"Bronx - Bronx Library Center","type":"permanent"}}]}'
const jsonUrl = 'https://maps.nyc.gov/data.json'

const csv = 'COL1,COL2\n1,2\n'
const csvUrl = 'https://maps.nyc.gov/data.csv'

test('constructor', () => {
  expect.assertions(3)

  fetch.mockResponseOnce(json)

  const autoload = new AutoLoad({
    url: jsonUrl,
    format: new OlFormatGeoJson()
  })
  expect(autoload instanceof OlSourceVector).toBe(true)
  expect(autoload instanceof AutoLoad).toBe(true)
  expect(autoload.autoLoad() instanceof Promise).toBe(true)
})

test('resolve', async () => {
  expect.assertions(9)
  
  const geojson = JSON.parse(json).features[0]

  fetch.mockResponseOnce(json)

  const autoload = new AutoLoad({
    url: jsonUrl,
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

test('resolve CsvAddr format', done => {
  expect.assertions(5)
  
  fetch.mockResponseOnce(csv)

  const format = new CsvAddr({})
  format.readFeatures = jest.fn(() => {return 'mock-features'})
  
  const autoLoad = new AutoLoad({
    url: csvUrl,
    format: format
  })
  autoLoad.addFeatures = jest.fn()

  autoLoad.autoLoad().then(features => {
    expect(format.readFeatures).toHaveBeenCalledTimes(1)
    expect(format.readFeatures.mock.calls[0][0]).toBe(csv)
    expect(autoLoad.addFeatures).toHaveBeenCalledTimes(1)
    expect(autoLoad.addFeatures.mock.calls[0][0]).toBe('mock-features') 
    expect(autoLoad.get('autoload-complete')).toBe(autoLoad)
    done()
  })

  setTimeout(() => {
    format.trigger('geocode-complete')
  }, 100)
})

test('resolve CsvAddr format', done => {
  expect.assertions(5)
  
  fetch.mockResponseOnce(csv)

  const format = new Decorate({parentFormat: new CsvAddr({})})
  format.readFeatures = jest.fn(() => {return 'mock-features'})
  
  const autoLoad = new AutoLoad({
    url: csvUrl,
    format: format
  })
  autoLoad.addFeatures = jest.fn()

  autoLoad.autoLoad().then(features => {
    expect(format.readFeatures).toHaveBeenCalledTimes(1)
    expect(format.readFeatures.mock.calls[0][0]).toBe(csv)
    expect(autoLoad.addFeatures).toHaveBeenCalledTimes(1)
    expect(autoLoad.addFeatures.mock.calls[0][0]).toBe('mock-features') 
    expect(autoLoad.get('autoload-complete')).toBe(autoLoad)
    done()
  })

  setTimeout(() => {
    format.parentFormat.trigger('geocode-complete')
  }, 100)
})

describe('fetch times out', () => {
  const actualFetch = global.fetch

  beforeEach(() => {
    jest.setTimeout(16000)
    global.fetch = url => {
      return new Promise((resolve, reject) => {})
    }
  })
  afterEach(() => {
    jest.setTimeout(5000)
    global.fetch = actualFetch
  })

  test('fetch times out', done => {
    expect.assertions(2)

    const autoload = new AutoLoad({
      url: jsonUrl,
      format: new OlFormatGeoJson()
    }).autoLoad().catch(err => {
      expect(err.message).toBe(`Failed to load ${jsonUrl}`)
      expect(err.cause.message).toBe(`Request timeout for ${jsonUrl}`)
      done()
    })
  })
})