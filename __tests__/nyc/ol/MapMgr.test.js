import MapMgr from 'nyc/ol/MapMgr'
import Basemap from 'nyc/ol/Basemap'
import MultiFeaturePopup from 'nyc/ol/MultiFeaturePopup'
import FeatureTip from 'nyc/ol/FeatureTip'
import ListPager from 'nyc/ListPager'
import Layer from 'ol/layer/Vector'
import FilterAndSort from 'nyc/ol/source/FilterAndSort'
import LocationMgr from 'nyc/ol/LocationMgr'
import OlFeature from 'ol/Feature'
import OlGeomPoint from 'ol/geom/Point'
import MapLocator from 'nyc/MapLocator'

import nyc from 'nyc'


jest.mock('../../../src/nyc/ol/Basemap')
jest.mock('../../../src/nyc/ol/MultiFeaturePopup')
jest.mock('../../../src/nyc/ol/FeatureTip')
jest.mock('../../../src/nyc/ListPager')
jest.mock('../../../src/nyc/ol/source/FilterAndSort')
jest.mock('../../../src/nyc/ol/LocationMgr')
jest.mock('ol/layer/Vector')

const proj4 = nyc.proj4


const options = {
  facilityUrl: 'http://facility',
  geoclientUrl: 'http://geoclient',
  mapTarget: '#map'
}

const createParentFormat = MapMgr.prototype.createParentFormat
const createDecorations = MapMgr.prototype.createDecorations
const createLocationMgr = MapMgr.prototype.createLocationMgr
const checkMouseWheel = MapMgr.prototype.checkMouseWheel

let mapTarget

beforeEach(() => {
  options.searchTarget = undefined
  options.listTarget = undefined
  options.facilityType = undefined
  options.mapMarkerUrl = undefined
  options.facilityStyle = undefined
  options.facilitySearch = true
  options.mouseWheelZoom = false

  mapTarget = $('<div id="map"></div>')
  $('body').append(mapTarget)

  $.resetMocks()
  Basemap.resetMocks()
  MultiFeaturePopup.mockClear()
  FeatureTip.mockClear()
  Layer.mockClear()
  FilterAndSort.mockClear()
  LocationMgr.mockClear()

  MapMgr.prototype.createParentFormat = jest.fn()
  MapMgr.prototype.createDecorations = jest.fn()
  MapMgr.prototype.createLocationMgr = jest.fn().mockImplementation(() => {
    return 'mock-location-mgr'
  })
  MapMgr.prototype.checkMouseWheel = jest.fn()

})

afterEach(() => {
  mapTarget.remove()
  MapMgr.prototype.createParentFormat = createParentFormat
  MapMgr.prototype.createDecorations = createDecorations
  MapMgr.prototype.createLocationMgr = createLocationMgr
  MapMgr.prototype.checkMouseWheel = checkMouseWheel
})

describe('constructor', () => {
  const createSource = MapMgr.prototype.createSource
  const createLayer = MapMgr.prototype.createLayer
  const ready = MapMgr.prototype.ready
  const createStyle = MapMgr.prototype.createStyle

  const mockPromise = {}
  const mockSource = {}
  const mockLayer = {}

  beforeEach(() => {
    mockPromise.then = jest.fn()
    mockSource.autoLoad = jest.fn().mockImplementation(() => {
      return mockPromise
    })
    MapMgr.prototype.createSource = jest.fn().mockImplementation(() => {
      return mockSource
    })

    mockLayer.set = jest.fn()
    MapMgr.prototype.createLayer = jest.fn().mockImplementation(() => {
      return mockLayer
    })

    MapMgr.prototype.ready = jest.fn()
    MapMgr.prototype.createStyle = jest.fn().mockImplementation(() => {
      return 'mock-style'
    })
  })
  afterEach(() => {
    MapMgr.prototype.createSource = createSource
    MapMgr.prototype.createLayer = createLayer
    MapMgr.prototype.ready = ready
    MapMgr.prototype.createStyle = createStyle
  })

  test('constructor minimum options', () => {
    expect.assertions(39)

    const mapMgr = new MapMgr(options)
    expect(mapMgr instanceof MapMgr).toBe(true)

    expect(mapMgr.facilitySearch).toBe(options.facilitySearch)

    expect(ListPager).toHaveBeenCalledTimes(0)
    expect(mapMgr.pager).toBeUndefined()

    expect(mapMgr.createSource).toHaveBeenCalledTimes(1)
    expect(mapMgr.source).toBe(mockSource)
    expect(mapMgr.source.autoLoad).toHaveBeenCalledTimes(1)
    expect($.mocks.proxy).toHaveBeenCalledTimes(1)
    expect($.mocks.proxy.mock.calls[0][0]).toBe(mapMgr.ready)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(mapMgr)
    expect(mockPromise.then).toHaveBeenCalledTimes(1)
    expect(mockPromise.then.mock.calls[0][0]).toBe($.mocks.proxy.returnedValues[0])

    expect(Basemap).toHaveBeenCalledTimes(1)
    expect(Basemap.mock.calls[0][0].target).toBe(mapTarget.get(0))

    expect(mapMgr.map.getView).toHaveBeenCalledTimes(1)
    expect(mapMgr.view).toBe(mapMgr.map.getView())

    expect(mapMgr.createStyle).toHaveBeenCalledTimes(1)
    expect(mapMgr.createStyle.mock.calls[0][0]).toBe(options)

    expect(mapMgr.createLayer).toHaveBeenCalledTimes(1)
    expect(mapMgr.createLayer.mock.calls[0][0]).toBe(mapMgr.source)
    expect(mapMgr.createLayer.mock.calls[0][1]).toBe('mock-style')

    expect(MultiFeaturePopup).toHaveBeenCalledTimes(1)
    expect(MultiFeaturePopup.mock.calls[0][0].map).toBe(mapMgr.map)
    expect(MultiFeaturePopup.mock.calls[0][0].layers).toEqual([mapMgr.layer])

    expect(mapMgr.createLocationMgr).toHaveBeenCalledTimes(1)
    expect(mapMgr.createLocationMgr.mock.calls[0][0]).toBe(options)
    expect(mapMgr.locationMgr).toBe('mock-location-mgr')

    expect(mapMgr.location).toEqual({})

    expect(FeatureTip).toHaveBeenCalledTimes(1)
    expect(FeatureTip.mock.calls[0][0].map).toBe(mapMgr.map)
    expect(FeatureTip.mock.calls[0][0].tips.length).toBe(1)
    expect(FeatureTip.mock.calls[0][0].tips[0].layer).toBe(mapMgr.layer)
    expect(FeatureTip.mock.calls[0][0].tips[0].label).toBe(MapMgr.tipFunction)

    expect(mapMgr.view.fit).toHaveBeenCalledTimes(1)
    expect(mapMgr.view.fit.mock.calls[0][0]).toBe(Basemap.EXTENT)
    expect(mapMgr.view.fit.mock.calls[0][1].size).toEqual([100, 100])
    expect(mapMgr.view.fit.mock.calls[0][1].duration).toBe(500)

    expect(mapMgr.checkMouseWheel).toHaveBeenCalledTimes(1)
    expect(mapMgr.checkMouseWheel.mock.calls[0][0]).toBe(false)
  })

  test('constructor all options', () => {
    expect.assertions(41)

    options.searchTarget = '#search'
    options.listTarget = '#list'
    options.facilityType = 'Cool Places'
    options.mapMarkerUrl = 'icon.png'
    options.facilityStyle = 'mock-facility-style'
    options.facilitySearch = 'mock-facility-search-param'
    options.mouseWheelZoom = true

    const mapMgr = new MapMgr(options)
    expect(mapMgr instanceof MapMgr).toBe(true)

    expect(mapMgr.facilitySearch).toBe(options.facilitySearch)

    expect(ListPager).toHaveBeenCalledTimes(1)
    expect(ListPager.mock.calls[0][0].target).toBe(options.listTarget)
    expect(ListPager.mock.calls[0][0].itemType).toBe(options.facilityType)
    expect(mapMgr.pager).toBe(ListPager.mock.instances[0])

    expect(mapMgr.createSource).toHaveBeenCalledTimes(1)
    expect(mapMgr.source).toBe(mockSource)
    expect(mapMgr.source.autoLoad).toHaveBeenCalledTimes(1)
    expect($.mocks.proxy.mock.calls[0][0]).toBe(mapMgr.ready)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(mapMgr)
    expect(mockPromise.then).toHaveBeenCalledTimes(1)
    expect($.mocks.proxy).toHaveBeenCalledTimes(1)
    expect(mockPromise.then.mock.calls[0][0]).toBe($.mocks.proxy.returnedValues[0])

    expect(Basemap).toHaveBeenCalledTimes(1)
    expect(Basemap.mock.calls[0][0].target).toBe(mapTarget.get(0))

    expect(mapMgr.map.getView).toHaveBeenCalledTimes(1)
    expect(mapMgr.view).toBe(mapMgr.map.getView())

    expect(mapMgr.createStyle).toHaveBeenCalledTimes(1)
    expect(mapMgr.createStyle.mock.calls[0][0]).toBe(options)

    expect(mapMgr.createLayer).toHaveBeenCalledTimes(1)
    expect(mapMgr.createLayer.mock.calls[0][0]).toBe(mapMgr.source)
    expect(mapMgr.createLayer.mock.calls[0][1]).toBe('mock-style')

    expect(MultiFeaturePopup).toHaveBeenCalledTimes(1)
    expect(MultiFeaturePopup.mock.calls[0][0].map).toBe(mapMgr.map)
    expect(MultiFeaturePopup.mock.calls[0][0].layers).toEqual([mapMgr.layer])

    expect(mapMgr.createLocationMgr).toHaveBeenCalledTimes(1)
    expect(mapMgr.createLocationMgr.mock.calls[0][0]).toBe(options)
    expect(mapMgr.locationMgr).toBe('mock-location-mgr')

    expect(mapMgr.location).toEqual({})

    expect(FeatureTip).toHaveBeenCalledTimes(1)
    expect(FeatureTip.mock.calls[0][0].map).toBe(mapMgr.map)
    expect(FeatureTip.mock.calls[0][0].tips.length).toBe(1)
    expect(FeatureTip.mock.calls[0][0].tips[0].layer).toBe(mapMgr.layer)
    expect(FeatureTip.mock.calls[0][0].tips[0].label).toBe(MapMgr.tipFunction)

    expect(mapMgr.view.fit).toHaveBeenCalledTimes(1)
    expect(mapMgr.view.fit.mock.calls[0][0]).toBe(Basemap.EXTENT)
    expect(mapMgr.view.fit.mock.calls[0][1].size).toEqual([100, 100])
    expect(mapMgr.view.fit.mock.calls[0][1].duration).toBe(500)

    expect(mapMgr.checkMouseWheel).toHaveBeenCalledTimes(1)
    expect(mapMgr.checkMouseWheel.mock.calls[0][0]).toBe(true)
  })

})

describe('MapMgr abstract functions', () => {
  beforeEach(() => {
    MapMgr.prototype.createParentFormat = createParentFormat
    MapMgr.prototype.createDecorations = createDecorations
  })

  test('createParentFormat', () => {
    expect.assertions(1)
    expect(() => {
      MapMgr.prototype.createParentFormat(options)
    }).toThrow('must be implemented')
  })

  test('createDecorations', () => {
    expect.assertions(1)
    expect(() => {
      MapMgr.prototype.createDecorations(options)
    }).toThrow('must be implemented')
  })

})

test('createLayer', () => {
  expect.assertions(4)

  const layer = MapMgr.prototype.createLayer('mock-source', 'mock-style')

  expect(Layer).toHaveBeenCalledTimes(1)
  expect(Layer.mock.calls[0][0].source).toBe('mock-source')
  expect(Layer.mock.calls[0][0].style).toBe('mock-style')
  expect(Layer.mock.instances[0]).toBe(layer)
})

test('located', () => {
  expect.assertions(4)

  const mapMgr = new MapMgr(options)
  mapMgr.resetList = jest.fn()

  mapMgr.located('mock-location-1')

  expect(mapMgr.location).toBe('mock-location-1')
  expect(mapMgr.resetList).toHaveBeenCalledTimes(0)

  mapMgr.pager = 'mock-pager'

  mapMgr.located('mock-location-2')

  expect(mapMgr.location).toBe('mock-location-2')
  expect(mapMgr.resetList).toHaveBeenCalledTimes(1)
})

test('resetList', () => {
  expect.assertions(10)
  options.listTarget = '#list'

  const mapMgr = new MapMgr(options)

  FilterAndSort.features = 'mock-features'

  mapMgr.resetList({})
  expect(mapMgr.popup.hide).toHaveBeenCalledTimes(1)
  expect(mapMgr.source.sort).toHaveBeenCalledTimes(0)
  expect(mapMgr.source.getFeatures).toHaveBeenCalledTimes(1)
  expect(mapMgr.pager.reset).toHaveBeenCalledTimes(1)
  expect(mapMgr.pager.reset.mock.calls[0][0]).toBe('mock-features')

  FilterAndSort.features = 'mock-sorted-features'
  mapMgr.location = {coordinate: 'mock-coordinate'}

  mapMgr.resetList({})
  expect(mapMgr.source.getFeatures).toHaveBeenCalledTimes(1)
  expect(mapMgr.source.sort).toHaveBeenCalledTimes(1)
  expect(mapMgr.source.sort.mock.calls[0][0]).toBe('mock-coordinate')
  expect(mapMgr.pager.reset).toHaveBeenCalledTimes(2)
  expect(mapMgr.pager.reset.mock.calls[1][0]).toEqual('mock-sorted-features')

})

describe('ready', () => {
  const nycReady = nyc.ready
  beforeEach(() => {
    nyc.ready = jest.fn()
    options.listTarget = '#list'
    MapMgr.prototype.createLocationMgr = jest.fn().mockImplementation(() => {
      return {
        search: {
          setFeatures: jest.fn()
        }
      }
    })
  })
  afterEach(() => {
    nyc.ready = nycReady
  })

  test('ready - facility search is false', () => {
    expect.assertions(5)

    options.facilitySearch = false

    const mapMgr = new MapMgr(options)

    mapMgr.ready('mock-features')

    expect(mapMgr.locationMgr.search.setFeatures).toHaveBeenCalledTimes(0)

    expect(mapMgr.pager.reset).toHaveBeenCalledTimes(1)
    expect(mapMgr.pager.reset.mock.calls[0][0]).toBe('mock-features')

    expect(nyc.ready).toHaveBeenCalledTimes(1)
    expect(nyc.ready.mock.calls[0][0].get(0)).toBe(document.body)
  })

  test('ready - facility search is true', () => {
    expect.assertions(6)

    options.facilitySearch = true

    const mapMgr = new MapMgr(options)

    mapMgr.ready('mock-features')

    expect(mapMgr.locationMgr.search.setFeatures).toHaveBeenCalledTimes(1)
    expect(mapMgr.locationMgr.search.setFeatures.mock.calls[0][0].features).toBe('mock-features')

    expect(mapMgr.pager.reset).toHaveBeenCalledTimes(1)
    expect(mapMgr.pager.reset.mock.calls[0][0]).toBe('mock-features')

    expect(nyc.ready).toHaveBeenCalledTimes(1)
    expect(nyc.ready.mock.calls[0][0].get(0)).toBe(document.body)
  })

  test('ready - facility search is object', () => {
    expect.assertions(7)

    options.facilitySearch = {nameField: 'FRED'}

    const mapMgr = new MapMgr(options)

    mapMgr.ready('mock-features')

    expect(mapMgr.locationMgr.search.setFeatures).toHaveBeenCalledTimes(1)
    expect(mapMgr.locationMgr.search.setFeatures.mock.calls[0][0].features).toBe('mock-features')
    expect(mapMgr.locationMgr.search.setFeatures.mock.calls[0][0].nameField).toBe('FRED')

    expect(mapMgr.pager.reset).toHaveBeenCalledTimes(1)
    expect(mapMgr.pager.reset.mock.calls[0][0]).toBe('mock-features')

    expect(nyc.ready).toHaveBeenCalledTimes(1)
    expect(nyc.ready.mock.calls[0][0].get(0)).toBe(document.body)
  })

})

test('zoomTo', () => {
  expect.assertions(8)
  const feature = new OlFeature({geometry: new OlGeomPoint([0, 0])})

  const mapMgr = new MapMgr(options)
  mapMgr.zoomTo(feature)

  expect(mapMgr.map.once).toHaveBeenCalledTimes(1)
  expect(mapMgr.map.once.mock.calls[0][0]).toBe('moveend')
  expect(typeof mapMgr.map.once.mock.calls[0][1]).toBe('function')

  expect(mapMgr.popup.showFeature).toHaveBeenCalledTimes(1)
  expect(mapMgr.popup.showFeature.mock.calls[0][0]).toBe(feature)

  expect(mapMgr.view.animate).toHaveBeenCalledTimes(1)
  expect(mapMgr.view.animate.mock.calls[0][0].center).toEqual(feature.getGeometry().getCoordinates())
  expect(mapMgr.view.animate.mock.calls[0][0].zoom).toBe(MapLocator.ZOOM_LEVEL)

})

describe('directionsTo', () => {
  const getFromAddr = MapMgr.prototype.getFromAddr
  const getFullAddress = OlFeature.prototype.getFullAddress
  const open = window.open

  beforeEach(() => {
    MapMgr.prototype.getFromAddr = jest.fn().mockImplementation(() => {
      return 'mock name'
    })

    OlFeature.prototype.getFullAddress = jest.fn().mockImplementation(() => {
      return 'mock address'
    })

    window.open = jest.fn()
  })
  afterEach(() => {
    MapMgr.prototype.getFromAddr = getFromAddr
    OlFeature.prototype.getFullAddress = getFullAddress
    window.open = open

  })

  test('directionsTo', () => {
    expect.assertions(5)
    const feature = new OlFeature({geometry: new OlGeomPoint([0, 0])})
    const mapMgr = new MapMgr(options)
    mapMgr.directionsTo(feature)

    const to = 'mock%20address'
    const from = 'mock%20name'

    expect(feature.getFullAddress).toHaveBeenCalledTimes(1)
    expect(mapMgr.getFromAddr).toHaveBeenCalledTimes(1)
    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open.mock.calls[0][0]).toBe(`https://www.google.com/maps/dir/${from}/${to}`)

    MapMgr.prototype.getFromAddr = jest.fn().mockImplementation(() => {
      return ''
    })
    mapMgr.directionsTo(feature)
    expect(window.open.mock.calls[1][0]).toBe(`https://www.google.com/maps/dir/${to}/${to}`)
  })

})

test('getFromAddr', () => {
  expect.assertions(3)
  const mapMgr = new MapMgr(options)
  mapMgr.location = {
    type: 'geolocated',
    coordinate: [1, 1]
  }
  const coordinates = proj4(mapMgr.view.getProjection().getCode(), 'EPSG:4326', mapMgr.location.coordinate)

  expect(mapMgr.getFromAddr()).toBe(`${coordinates[1]},${coordinates[0]}`)

  mapMgr.location = {
    type: '',
    name: 'mock-location'
  }
  expect(mapMgr.getFromAddr()).toBe(mapMgr.location.name)

  mapMgr.location = {
    type: '',
    name: ''
  }
  expect(mapMgr.getFromAddr()).toBe('')


})


