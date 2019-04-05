import MapMgr from 'nyc/ol/MapMgr'
import FrameworkMap from 'nyc/ol/FrameworkMap'
import Basemap from 'nyc/ol/Basemap'
import LocationMgr from 'nyc/ol/LocationMgr'
import FilterAndSort from 'nyc/ol/source/FilterAndSort'
import StandardCsv from 'nyc/ol/format/StandardCsv'
import Layer from 'ol/layer/Vector'
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom'
import Feature from 'ol/Feature'

import Search from '../../../src/nyc/ol/Search'
import CsvPoint from '../../../src/nyc/ol/format/CsvPoint'

jest.mock('../../../src/nyc/ol/Search')
jest.mock('../../../src/nyc/ol/format/CsvPoint')

let options

let mapTarget
const mockSearchContainer = {
  hide: jest.fn()
}
beforeEach(() => {
  Search.mockReset()
  Search.prototype.getContainer = () => {
    return mockSearchContainer
  }
  CsvPoint.mockReset()
  mapTarget = $('<div id="map"></div>')
  $('body').append(mapTarget)
  options = {
    facilityUrl: 'facility-url',
    geoclientUrl: 'geoclient-url',
    mapTarget: '#map',
    searchTarget: undefined,
    listTarget: undefined,
    facilitySearch: undefined,
    facilityType: undefined,
    facilityMarkerUrl: undefined,
    facilityStyle: undefined,
    mouseWheelZoom: false
  }
})
afterEach(() => {
  mapTarget.remove()
})

describe('constructor', () => {
  test('constructor', () => {
    expect.assertions(19)

    const frameworkMap = new FrameworkMap(options)
    
    expect(options.facilitySearch.nameField).toBe(StandardCsv.NAME)

    expect(frameworkMap instanceof MapMgr).toBe(true)
    expect(frameworkMap instanceof FrameworkMap).toBe(true)
    
    expect(frameworkMap.map instanceof Basemap).toBe(true)
    expect(frameworkMap.map.getInteractions().getArray().length).toBe(6)

    frameworkMap.map.getInteractions().forEach(i => {
      expect(i instanceof MouseWheelZoom).toBe(false)
    })

    expect(frameworkMap.source instanceof FilterAndSort).toBe(true)
    expect(frameworkMap.layer instanceof Layer).toBe(true)
    expect(frameworkMap.locationMgr instanceof LocationMgr).toBe(true)
    expect(Search).toHaveBeenCalledTimes(1)
    expect(mapTarget.find('.ol-overlaycontainer-stopevent').length).toBe(1)
    expect(mapTarget.hasClass('nyc-map')).toBe(true)
    expect(Search.mock.calls[0][0].get(0)).toBe(mapTarget.find('.ol-overlaycontainer-stopevent').get(0))
    expect(frameworkMap.pager).toBeUndefined()
  })

  test('constructor no facility search', () => {
    expect.assertions(19)

    options.facilitySearch = false
    
    const frameworkMap = new FrameworkMap(options)
    
    expect(options.facilitySearch).toBe(false)

    expect(frameworkMap instanceof MapMgr).toBe(true)
    expect(frameworkMap instanceof FrameworkMap).toBe(true)
    
    expect(frameworkMap.map instanceof Basemap).toBe(true)
    expect(frameworkMap.map.getInteractions().getArray().length).toBe(6)

    frameworkMap.map.getInteractions().forEach(i => {
      expect(i instanceof MouseWheelZoom).toBe(false)
    })

    expect(frameworkMap.source instanceof FilterAndSort).toBe(true)
    expect(frameworkMap.layer instanceof Layer).toBe(true)
    expect(frameworkMap.locationMgr instanceof LocationMgr).toBe(true)
    expect(Search).toHaveBeenCalledTimes(1)
    expect(mapTarget.find('.ol-overlaycontainer-stopevent').length).toBe(1)
    expect(mapTarget.hasClass('nyc-map')).toBe(true)
    expect(Search.mock.calls[0][0].get(0)).toBe(mapTarget.find('.ol-overlaycontainer-stopevent').get(0))
    expect(frameworkMap.pager).toBeUndefined()
  })
})

test('createParentFormat', () => {
  expect.assertions(3)

  const frameworkMap = new FrameworkMap(options)
  
  expect(CsvPoint).toHaveBeenCalledTimes(1)
  expect(CsvPoint.mock.calls[0][0].url).toBe(options.facilityUrl)
  expect(CsvPoint.mock.calls[0][0].autoDetect).toBe(true)
})

test('createDecorations', () => {
  expect.assertions(9)

  const frameworkMap = new FrameworkMap(options)
  
  let deocorations = frameworkMap.createDecorations({})

  expect(deocorations.length).toBe(3)
  expect(deocorations[0]).toBe(MapMgr.FEATURE_DECORATIONS)
  expect(deocorations[1]).toBe(FrameworkMap.FEATURE_DECORATIONS)
  expect(deocorations[2]).toEqual({app: frameworkMap})

  deocorations = frameworkMap.createDecorations({decorations: 'mock-decorations'})

  expect(deocorations.length).toBe(4)
  expect(deocorations[0]).toBe(MapMgr.FEATURE_DECORATIONS)
  expect(deocorations[1]).toBe(FrameworkMap.FEATURE_DECORATIONS)
  expect(deocorations[2]).toBe('mock-decorations')
  expect(deocorations[3]).toEqual({app: frameworkMap})
})

test('FEATURE_DECORATIONS minimal', () => {
  expect.assertions(8)

  const csvRow = {NAME: 'Fred', ADDR1: '222 Rocky Way', CITY: 'Bedrock', ZIP: 12345}
  const feature = new Feature(csvRow)

  $.extend(feature, FrameworkMap.FEATURE_DECORATIONS)

  expect(feature.getName()).toBe('Fred')
  expect(feature.getAddress1()).toBe('222 Rocky Way')
  expect(feature.getAddress2()).toBe('')
  expect(feature.getCityStateZip()).toBe('Bedrock, NY 12345')
  expect(feature.getPhone()).toBe('')
  expect(feature.getEmail()).toBe('')
  expect(feature.getWebsite()).toBe('')
  expect(feature.detailsHtml()).toBeUndefined()
})

test('FEATURE_DECORATIONS full', () => {
  expect.assertions(8)

  const csvRow = {NAME: 'Dino', ADDR1: '222 Rocky Way', ADDR2: 'Doghouse around back', BORO: 'Bedrock', ZIP: 12345, PHONE: '555-5555', EMAIL: 'dino@dog.woof',  WEBSITE: 'http://www.dog.woof', DETAIL: 'yaba-daba-doo'}
  const feature = new Feature(csvRow)

  $.extend(feature, FrameworkMap.FEATURE_DECORATIONS)

  expect(feature.getName()).toBe(csvRow.NAME)
  expect(feature.getAddress1()).toBe('222 Rocky Way')
  expect(feature.getAddress2()).toBe('Doghouse around back')
  expect(feature.getCityStateZip()).toBe('Bedrock, NY 12345')
  expect(feature.getPhone()).toBe('555-5555')
  expect(feature.getEmail()).toBe('dino@dog.woof')
  expect(feature.getWebsite()).toBe('http://www.dog.woof')
  expect($('<div></div>').append(feature.detailsHtml()).html()).toBe('<div>yaba-daba-doo</div>')

})