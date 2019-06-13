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
import Icon from 'ol/style/Icon'
import Style from 'ol/style/Style'
import Decorate from 'nyc/ol/format/Decorate'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom'
import Vector from 'ol/source/Vector'


import nyc from 'nyc'


jest.mock('../../../src/nyc/ol/Basemap')
jest.mock('../../../src/nyc/ol/MultiFeaturePopup')
jest.mock('../../../src/nyc/ol/FeatureTip')
jest.mock('../../../src/nyc/ListPager')
jest.mock('../../../src/nyc/ol/source/FilterAndSort')
jest.mock('../../../src/nyc/ol/LocationMgr')
jest.mock('ol/style/Style')
jest.mock('ol/style/Icon')
jest.mock('ol/layer/Vector')

const proj4 = nyc.proj4


const options = {
  geoclientUrl: 'http://geoclient',
  mapTarget: '#map'
}

const createParentFormat = MapMgr.prototype.createParentFormat
const createDecorations = MapMgr.prototype.createDecorations
const createLocationMgr = MapMgr.prototype.createLocationMgr
const checkMouseWheel = MapMgr.prototype.checkMouseWheel

const createLocationMgrMock = jest.fn().mockImplementation(() => {
  return 'mock-location-mgr'
})

let mapTarget

beforeEach(() => {
  options.searchTarget = undefined
  options.listTarget = undefined
  options.facilityType = undefined
  options.facilityStyle = undefined
  options.facilitySearch = true
  options.mouseWheelZoom = false
  options.startAt = undefined
  options.facilityUrl = 'http://facility'


  mapTarget = $('<div id="map"></div>')
  $('body').append(mapTarget)

  $.resetMocks()
  Basemap.resetMocks()
  MultiFeaturePopup.mockClear()
  FeatureTip.mockClear()
  Layer.mockClear()
  FilterAndSort.mockClear()
  LocationMgr.resetMocks()
  ListPager.mockClear()
  Style.mockClear()
  // Decorate.mockClear()

  MapMgr.prototype.createParentFormat = jest.fn()
  MapMgr.prototype.createDecorations = jest.fn()
  MapMgr.prototype.createLocationMgr = createLocationMgrMock
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
  const mockLocationMgr = {}

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
    mockLocationMgr.goTo = jest.fn()
    MapMgr.prototype.createLocationMgr = jest.fn().mockImplementation(() => {
      return mockLocationMgr
    })
  })
  afterEach(() => {
    MapMgr.prototype.createSource = createSource
    MapMgr.prototype.createLayer = createLayer
    MapMgr.prototype.ready = ready
    MapMgr.prototype.createStyle = createStyle
  })

  test('constructor minimum options', () => {
    expect.assertions(43)

    const mapMgr = new MapMgr(options)
    expect(mapMgr instanceof MapMgr).toBe(true)

    expect(mapMgr.facilitySearch).toBe(options.facilitySearch)

    expect(ListPager).toHaveBeenCalledTimes(0)
    expect(mapMgr.pager).toBeUndefined()

    expect(mapMgr.createSource).toHaveBeenCalledTimes(1)
    expect(mapMgr.map.addLayer).toHaveBeenCalledTimes(2)
    expect(mapMgr.map.addLayer.mock.calls[0][0]).toBe(mapMgr.layer)
    expect(mapMgr.map.addLayer.mock.calls[1][0]).toBe(mapMgr.highlightLayer)
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
    expect(mapMgr.locationMgr).toBe(mockLocationMgr)
    expect(mapMgr.locationMgr.goTo).toHaveBeenCalledTimes(0)


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
    expect.assertions(46)

    options.searchTarget = '#search'
    options.listTarget = '#list'
    options.facilityType = 'Cool Places'
    options.facilityStyle = 'icon.png'
    options.facilityStyle = 'mock-facility-style'
    options.facilitySearch = 'mock-facility-search-param'
    options.mouseWheelZoom = true
    options.startAt = 'startAddress'

    const mapMgr = new MapMgr(options)
    expect(mapMgr instanceof MapMgr).toBe(true)

    expect(mapMgr.facilitySearch).toBe(options.facilitySearch)

    expect(ListPager).toHaveBeenCalledTimes(1)
    expect(ListPager.mock.calls[0][0].target).toBe(options.listTarget)
    expect(ListPager.mock.calls[0][0].itemType).toBe(options.facilityType)
    expect(mapMgr.pager).toBe(ListPager.mock.instances[0])

    expect(mapMgr.createSource).toHaveBeenCalledTimes(1)
    expect(mapMgr.map.addLayer).toHaveBeenCalledTimes(2)
    expect(mapMgr.map.addLayer.mock.calls[0][0]).toBe(mapMgr.layer)
    expect(mapMgr.map.addLayer.mock.calls[1][0]).toBe(mapMgr.highlightLayer)
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
    expect(mapMgr.locationMgr).toBe(mockLocationMgr)
    expect(mapMgr.locationMgr.goTo).toHaveBeenCalledTimes(1)
    expect(mapMgr.locationMgr.goTo.mock.calls[0][0]).toBe(options.startAt)

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

  test('constructor no source/layer provided', () => {
    expect.assertions(8)
    MapMgr.prototype.createSource = jest.fn().mockImplementation(() => {
      return ''
    })
    const mapMgr = new MapMgr(options)
    expect(mapMgr.createLayer).toHaveBeenCalledTimes(0)
    expect(mapMgr.map.addLayer).toHaveBeenCalledTimes(0)
    expect(mapMgr.layer).toBeNull()
    expect(mapMgr.source.autoLoad).toBeUndefined()
    expect(mapMgr.ready).toHaveBeenCalledTimes(1)

    //if no layer is created
    expect(MultiFeaturePopup).toHaveBeenCalledTimes(0)
    expect(mapMgr.popup).toBeNull()
    expect(FeatureTip).toHaveBeenCalledTimes(0)

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

describe('resetList', () => {

  test('resetList - pager supplied, no coordinates supplied', () => {
    expect.assertions(5)
    options.listTarget = '#list'

    const mapMgr = new MapMgr(options)

    FilterAndSort.features = 'mock-features'

    mapMgr.resetList({})
    expect(mapMgr.popup.hide).toHaveBeenCalledTimes(1)
    expect(mapMgr.source.sort).toHaveBeenCalledTimes(0)
    expect(mapMgr.source.getFeatures).toHaveBeenCalledTimes(1)
    expect(mapMgr.pager.reset).toHaveBeenCalledTimes(1)
    expect(mapMgr.pager.reset.mock.calls[0][0]).toBe('mock-features')

  })

  test('resetList - pager and coordinate supplied', () => {
    expect.assertions(6)
    options.listTarget = '#list'

    const mapMgr = new MapMgr(options)

    FilterAndSort.features = 'mock-sorted-features'
    mapMgr.location = {coordinate: 'mock-coordinate'}

    mapMgr.resetList({})
    expect(mapMgr.popup.hide).toHaveBeenCalledTimes(1)
    expect(mapMgr.source.getFeatures).toHaveBeenCalledTimes(0)
    expect(mapMgr.source.sort).toHaveBeenCalledTimes(1)
    expect(mapMgr.source.sort.mock.calls[0][0]).toBe('mock-coordinate')
    expect(mapMgr.pager.reset).toHaveBeenCalledTimes(1)
    expect(mapMgr.pager.reset.mock.calls[0][0]).toEqual('mock-sorted-features')

  })

  test('resetList - no pager supplied', () => {
    expect.assertions(4)
    options.listTarget = ''
    const mapMgr = new MapMgr(options)

    mapMgr.resetList({})
    expect(mapMgr.popup.hide).toHaveBeenCalledTimes(1)
    expect(mapMgr.source.sort).toHaveBeenCalledTimes(0)
    expect(mapMgr.source.getFeatures).toHaveBeenCalledTimes(0)
    expect(mapMgr.pager).toBeUndefined()

  })

})


describe('ready', () => {
  const nycReady = nyc.ready
  const createSource = MapMgr.prototype.createSource

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

  test('ready - facility search is true, but source not provided', () => {
    expect.assertions(5)

    options.facilitySearch = true

    const mapMgr = new MapMgr(options)

    mapMgr.source = ''
    mapMgr.ready('mock-features')

    expect(mapMgr.locationMgr.search.setFeatures).toHaveBeenCalledTimes(0)

    expect(mapMgr.pager.reset).toHaveBeenCalledTimes(1)
    expect(mapMgr.pager.reset.mock.calls[0][0]).toBe('mock-features')

    expect(nyc.ready).toHaveBeenCalledTimes(1)
    expect(nyc.ready.mock.calls[0][0].get(0)).toBe(document.body)

    MapMgr.prototype.createSource = createSource

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

  test('directionsTo - from addr provided', () => {
    expect.assertions(4)
    const feature = new OlFeature({geometry: new OlGeomPoint([0, 0])})
    const mapMgr = new MapMgr(options)
    mapMgr.directionsTo(feature)

    const to = 'mock%20address'
    const from = 'mock%20name'

    expect(feature.getFullAddress).toHaveBeenCalledTimes(1)
    expect(mapMgr.getFromAddr).toHaveBeenCalledTimes(1)
    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open.mock.calls[0][0]).toBe(`https://www.google.com/maps/dir/${from}/${to}`)


  })

  test('directionsTo - no from addr provided', () => {
    expect.assertions(4)
    MapMgr.prototype.getFromAddr = jest.fn().mockImplementation(() => {
      return ''
    })

    const feature = new OlFeature({geometry: new OlGeomPoint([0, 0])})
    const mapMgr = new MapMgr(options)
    mapMgr.directionsTo(feature)

    const to = 'mock%20address'

    expect(feature.getFullAddress).toHaveBeenCalledTimes(1)
    expect(mapMgr.getFromAddr).toHaveBeenCalledTimes(1)
    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open.mock.calls[0][0]).toBe(`https://www.google.com/maps/dir/${to}/${to}`)

  })

})
describe('getFromAddr', () => {
  test('getFromAddr location.type supplied - geolocated ', () => {
    expect.assertions(1)
    const mapMgr = new MapMgr(options)
    mapMgr.location = {
      type: 'geolocated',
      coordinate: [1, 1]
    }
    const coordinates = proj4(mapMgr.view.getProjection().getCode(), 'EPSG:4326', mapMgr.location.coordinate)

    expect(mapMgr.getFromAddr()).toBe(`${coordinates[1]},${coordinates[0]}`)

  })

  test('getFromAddr no location.type supplied, name supplied ', () => {
    expect.assertions(1)
    const mapMgr = new MapMgr(options)

    mapMgr.location = {
      type: '',
      name: 'mock-location'
    }
    expect(mapMgr.getFromAddr()).toBe(mapMgr.location.name)

  })

  test('getFromAddr no location.type or name supplied ', () => {
    expect.assertions(1)
    const mapMgr = new MapMgr(options)

    mapMgr.location = {
      type: '',
      name: ''
    }
    expect(mapMgr.getFromAddr()).toBe('')

  })
})

test('expandDetail', () => {
  expect.assertions(1)

  const mapMgr = new MapMgr(options)

  mapMgr.popup.pan = jest.fn()

  mapMgr.expandDetail()

  expect(mapMgr.popup.pan).toHaveBeenCalledTimes(1)

})

describe('loadMarkerImage', () => {
  const width = $.fn.width
  const height = $.fn.height
  beforeEach(() => {
    $.fn.width = jest.fn().mockImplementation(() => {
      return 216
    })
    $.fn.height = jest.fn().mockImplementation(() => {
      return 233
    })
  })
  afterEach(() => {
    $.fn.width = width
    $.fn.height = height
  })

  test('loadMarkerImage', () => {
    expect.assertions(8)
  
    const facilityStyle = 'data:image/png;base64,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'
  
    const mapMgr = new MapMgr(options)
    
    const mockStyle = {
      setImage: jest.fn()
    }
    mapMgr.layer = {
      setStyle: jest.fn(),
      getStyle: jest.fn(() => {
        return mockStyle
      })
    }
  
  
    mapMgr.loadMarkerImage(facilityStyle, 32, mockStyle)
  
    const test = () => {
      return new Promise(resolve => {
        expect(Icon).toHaveBeenCalledTimes(1)
        expect(Icon.mock.calls[0][0].src).toBe(facilityStyle)
        expect(Icon.mock.calls[0][0].imgSize[0]).toBe(216)
        expect(Icon.mock.calls[0][0].imgSize[1]).toBe(233)
        expect(Icon.mock.calls[0][0].scale).toBe(32/233)
        expect(mockStyle.setImage).toHaveBeenCalledTimes(1)
        expect(mockStyle.setImage.mock.calls[0][0]).toBe(Icon.mock.instances[0])
        resolve(true)
      }, 500)
    }
    return test().then(success => {expect(success).toBe(true)})
  })
})

describe('createLocationMgr', () => {

  beforeEach(() => {
    MapMgr.prototype.createLocationMgr = createLocationMgr
  })
  afterEach(() => {
    MapMgr.prototype.createLocationMgr = createLocationMgrMock
  })

  test('createLocationMgr with specified search', () => {
    expect.assertions(12)

    options.searchTarget = 'searchTarget'
    const mapMgr = new MapMgr(options)

    LocationMgr.resetMocks()
    mapMgr.createLocationMgr(options)

    expect(LocationMgr).toHaveBeenCalledTimes(1)
    expect(LocationMgr.mock.calls[0][0].map).toBe(mapMgr.map)
    expect(LocationMgr.mock.calls[0][0].searchTarget).toBe(options.searchTarget)
    expect(LocationMgr.mock.calls[0][0].dialogTarget).toBe(options.mapTarget)
    expect(LocationMgr.mock.calls[0][0].url).toBe(options.geoclientUrl)

    expect(mapMgr.locationMgr.on).toHaveBeenCalledTimes(2)

    expect(mapMgr.locationMgr.on.mock.calls[0][0]).toBe('geocoded')
    expect(mapMgr.locationMgr.on.mock.calls[0][1]).toBe(mapMgr.located)
    expect(mapMgr.locationMgr.on.mock.calls[0][2]).toBe(mapMgr)

    expect(mapMgr.locationMgr.on.mock.calls[1][0]).toBe('geolocated')
    expect(mapMgr.locationMgr.on.mock.calls[1][1]).toBe(mapMgr.located)
    expect(mapMgr.locationMgr.on.mock.calls[1][2]).toBe(mapMgr)


  })

  test('createLocationMgr with locationMarkerUrl supplied', () => {
    expect.assertions(8)

    options.searchTarget = 'searchTarget'
    options.locationMarkerUrl = 'locationMarkerUrl'
    
    const loadMarkerImage = MapMgr.prototype.loadMarkerImage
    MapMgr.prototype.loadMarkerImage = jest.fn()

    const mapMgr = new MapMgr(options)

    LocationMgr.resetMocks()
    mapMgr.createLocationMgr(options)

    expect(LocationMgr).toHaveBeenCalledTimes(1)
    expect(LocationMgr.mock.calls[0][0].map).toBe(mapMgr.map)
    expect(LocationMgr.mock.calls[0][0].searchTarget).toBe(options.searchTarget)
    expect(LocationMgr.mock.calls[0][0].dialogTarget).toBe(options.mapTarget)
    expect(LocationMgr.mock.calls[0][0].url).toBe(options.geoclientUrl)

    expect(mapMgr.loadMarkerImage.mock.calls[0][0]).toBe(options.locationMarkerUrl)
    expect(mapMgr.loadMarkerImage.mock.calls[0][1]).toBe(64)
    expect(mapMgr.loadMarkerImage.mock.calls[0][2] instanceof Style).toBe(true)

    MapMgr.prototype.loadMarkerImage = loadMarkerImage

  })

  test('createLocationMgr with built-in search', () => {
    expect.assertions(5)
    
    const mapMgr = new MapMgr(options)

    LocationMgr.resetMocks()
    mapMgr.createLocationMgr(options)

    expect(LocationMgr).toHaveBeenCalledTimes(1)
    expect(LocationMgr.mock.calls[0][0].map).toBe(mapMgr.map)
    expect(LocationMgr.mock.calls[0][0].searchTarget).toBeUndefined()
    expect(LocationMgr.mock.calls[0][0].dialogTarget).toBe(options.mapTarget)
    expect(LocationMgr.mock.calls[0][0].url).toBe(options.geoclientUrl)

  })

  test('createLocationMgr with no search', () => {
    expect.assertions(6)
    
    options.searchTarget = false
    const mapMgr = new MapMgr(options)
    
    LocationMgr.resetMocks()
    mapMgr.createLocationMgr(options)
    
    expect(LocationMgr).toHaveBeenCalledTimes(1)
    expect(LocationMgr.mock.calls[0][0].map).toBe(mapMgr.map)
    expect(LocationMgr.mock.calls[0][0].searchTarget).toBeUndefined()
    expect(LocationMgr.mock.calls[0][0].dialogTarget).toBe(options.mapTarget)
    expect(LocationMgr.mock.calls[0][0].url).toBe(options.geoclientUrl)

    expect(LocationMgr.mockSearchContainer.hide).toHaveBeenCalledTimes(1)
  })
})

describe('createPager', () => {
  test('createPager w/listTarget supplied', () => {
    expect.assertions(4)
    options.listTarget = '#listTarget'
    options.facilityType = 'facilityType'

    expect(MapMgr.prototype.createPager(options) instanceof ListPager).toBe(true)
    expect(ListPager).toHaveBeenCalledTimes(1)
    expect(ListPager.mock.calls[0][0].target).toBe(options.listTarget)
    expect(ListPager.mock.calls[0][0].itemType).toBe(options.facilityType)

  })

  test('createPager w/o listTarget supplied', () => {
    expect.assertions(2)
    options.listTarget = ''

    expect(MapMgr.prototype.createPager(options) instanceof ListPager).toBe(false)
    expect(ListPager).toHaveBeenCalledTimes(0)

  })
})


describe('createSource', () => {
  beforeEach(() => {
    MapMgr.prototype.createParentFormat = jest.fn().mockImplementation(() => {
      return 'mock-parent-format'
    })
    MapMgr.prototype.createDecorations = jest.fn().mockImplementation(() => {
      return 'mock-decorations'
    })
  })

  afterEach(() => {
    MapMgr.prototype.createParentFormat = createParentFormat
    MapMgr.prototype.createDecorations = createDecorations
  })

  test('createSource has source URL', () => {
    expect.assertions(7)
    const mapMgr = new MapMgr(options)

    expect(mapMgr.createParentFormat).toHaveBeenCalledTimes(1)
    expect(mapMgr.createDecorations).toHaveBeenCalledTimes(1)

    expect(FilterAndSort).toHaveBeenCalledTimes(1)
    expect(FilterAndSort.mock.calls[0][0].url).toBe(options.facilityUrl)
    expect(FilterAndSort.mock.calls[0][0].format instanceof Decorate).toBe(true)
    expect(FilterAndSort.mock.calls[0][0].format.decorations).toBe('mock-decorations')
    expect(FilterAndSort.mock.calls[0][0].format.parentFormat).toBe('mock-parent-format')
  })

  test('createSource no source URL', () => {
    expect.assertions(4)
    options.facilityUrl = undefined

    const mapMgr = new MapMgr(options)

    expect(mapMgr.createParentFormat).toHaveBeenCalledTimes(0)
    expect(mapMgr.createDecorations).toHaveBeenCalledTimes(0)
    expect(FilterAndSort).toHaveBeenCalledTimes(0)
    expect(mapMgr.source).toBeUndefined()
  })

})

describe('createHighlightLayer', () => {
  test('createHighlightLayer', () => {
    expect.assertions(5)
    options.highlightStyle = 'highlightStyle'
    const mapMgr = new MapMgr(options)

    Layer.mockClear()
    mapMgr.createHighlightLayer(options)

    expect(mapMgr.highlightSource instanceof Vector).toBe(true)
    expect(mapMgr.highlightLayer instanceof Layer).toBe(true)

    expect(Layer.mock.calls[0][0].source instanceof Vector).toBe(true)
    expect(Layer.mock.calls[0][0].source).toBe(mapMgr.highlightSource)
    expect(Layer.mock.calls[0][0].style).toBe('highlightStyle')


  })
})

describe('createHighlightStyle', () => {
  test('createHighlightStyle w/param', () => {
    expect.assertions(1)
    options.highlightStyle = 'highlightStyle'

    const mapMgr = new MapMgr(options)
    expect(mapMgr.createHighlightStyle(options)).toBe('highlightStyle')

  })

  test('createHighlightStyle w/o param', () => {
    expect.assertions(5)
    options.highlightStyle = ''

    const mapMgr = new MapMgr(options)

    Style.mockClear()
    mapMgr.createHighlightStyle(options)

    expect(Style.mock.calls[0][0].image instanceof Circle).toBe(true)
    expect(Style.mock.calls[0][0].image.radius_).toBe(20)
    expect(Style.mock.calls[0][0].image.stroke_ instanceof Stroke).toBe(true)
    expect(Style.mock.calls[0][0].image.stroke_.color_).toBe('yellow')
    expect(Style.mock.calls[0][0].image.stroke_.width_).toBe(10)

  })
})

describe('highlight', () => {
  const clear = Vector.prototype.clear
  const addFeatures = Vector.prototype.addFeatures

  beforeEach(() => {
    Vector.prototype.clear = jest.fn()
    Vector.prototype.addFeatures = jest.fn()
    
  })
  afterEach(() => {
    Vector.prototype.clear = clear
    Vector.prototype.addFeatures = addFeatures

  })


  test('highlight', () => {
    expect.assertions(2)

    const mapMgr = new MapMgr(options)

    mapMgr.highlight()
    expect(Vector.prototype.clear).toHaveBeenCalledTimes(1)
    expect(Vector.prototype.addFeatures).toHaveBeenCalledTimes(0)
    

  })

  test('highlight w/ feature', () => {
    expect.assertions(3)

    const feature = new OlFeature()
    const mapMgr = new MapMgr(options)

    mapMgr.highlight(feature)
    expect(Vector.prototype.clear).toHaveBeenCalledTimes(1)
    expect(Vector.prototype.addFeatures).toHaveBeenCalledTimes(1)
    expect(Vector.prototype.addFeatures.mock.calls[0][0]).toEqual([feature])
    

  })
})


describe('createStyle', () => {
  const loadMarkerImage = MapMgr.prototype.loadMarkerImage
  const createHighlightStyle = MapMgr.prototype.createHighlightStyle
  beforeEach(() => {
    MapMgr.prototype.loadMarkerImage = jest.fn()
    MapMgr.prototype.createHighlightStyle = jest.fn()
  })
  afterEach(() => {
    MapMgr.prototype.loadMarkerImage = loadMarkerImage
    MapMgr.prototype.createHighlightStyle = createHighlightStyle
  })

  test('createStyle facilityStyle supplied as function', () => {
    expect.assertions(1)

    options.facilityStyle = () => {}
    const mapMgr = new MapMgr(options)
    expect(mapMgr.createStyle(options)).toBe(options.facilityStyle)

  })

  test('facilityStyle supplied as string', () => {
    expect.assertions(7)

    options.facilityStyle = 'icon-url'
    const mapMgr = new MapMgr(options)

    expect(mapMgr.createStyle(options) instanceof Style).toBe(true)
    expect(Style.mock.calls[1][0]).toBeUndefined()
    expect(mapMgr.loadMarkerImage).toHaveBeenCalledTimes(2)
    expect(mapMgr.loadMarkerImage.mock.calls[1][0]).toBe(options.facilityStyle)
    expect(mapMgr.loadMarkerImage.mock.calls[1][1]).toBe(32)
    expect(mapMgr.loadMarkerImage.mock.calls[1][2]).toBe(Style.mock.instances[1])
    expect(Style).toHaveBeenCalledTimes(2)

  })

  test('createStyle no facilityStyle supplied', () => {
    expect.assertions(9)

    options.facilityStyle = undefined

    const mapMgr = new MapMgr(options)

    expect(mapMgr.createStyle(options) instanceof Style).toBe(true)
    expect(Style.mock.calls[1][0].image instanceof Circle).toBe(true)
    expect(Style.mock.calls[1][0].image.radius_).toBe(6)
    expect(Style.mock.calls[1][0].image.fill_ instanceof Fill).toBe(true)
    expect(Style.mock.calls[1][0].image.fill_.color_).toBe('rgba(0,0,255,.5)')
    expect(Style.mock.calls[1][0].image.stroke_ instanceof Stroke).toBe(true)
    expect(Style.mock.calls[1][0].image.stroke_.color_).toBe('rgb(0,0,255)')
    expect(Style.mock.calls[1][0].image.stroke_.width_).toBe(2)
    expect(Style).toHaveBeenCalledTimes(2)

  })

  test('createStyle no facilityStyle or facilityStyle supplied, facilityStyle supplied', () => {
    expect.assertions(9)

    options.facilityStyle = [255, 255, 255]
    const mapMgr = new MapMgr(options)

    expect(mapMgr.createStyle(options) instanceof Style).toBe(true)
    expect(Style.mock.calls[1][0].image instanceof Circle).toBe(true)
    expect(Style.mock.calls[1][0].image.radius_).toBe(6)
    expect(Style.mock.calls[1][0].image.fill_ instanceof Fill).toBe(true)
    expect(Style.mock.calls[1][0].image.fill_.color_).toBe(`rgba(${options.facilityStyle},.5)`)
    expect(Style.mock.calls[1][0].image.stroke_ instanceof Stroke).toBe(true)
    expect(Style.mock.calls[1][0].image.stroke_.color_).toBe(`rgb(${options.facilityStyle})`)
    expect(Style.mock.calls[1][0].image.stroke_.width_).toBe(2)
    expect(Style).toHaveBeenCalledTimes(2)

  })
})

test('checkMouseWheel - true', () => {
  expect.assertions(2)

  MapMgr.prototype.checkMouseWheel = checkMouseWheel
  options.mouseWheelZoom = true

  const mapMgr = new MapMgr(options)

  expect(mapMgr.map.getInteractions).toHaveBeenCalledTimes(0)
  expect(mapMgr.map.removeInteraction).toHaveBeenCalledTimes(0)


})

test('checkMouseWheel - false', () => {
  expect.assertions(4)

  MapMgr.prototype.checkMouseWheel = checkMouseWheel

  const mapMgr = new MapMgr(options)

  expect(mapMgr.map.getInteractions).toHaveBeenCalledTimes(1)
  expect(mapMgr.map.removeInteraction).toHaveBeenCalledTimes(1)
  expect(mapMgr.map.removeInteraction.mock.calls[0][0] instanceof MouseWheelZoom).toBe(true)

  mapMgr.map.getInteractions = jest.fn().mockImplementation(() => {
    return [1, 1]
  })
  mapMgr.checkMouseWheel(false)
  expect(mapMgr.map.removeInteraction.mock.calls[1][0] instanceof MouseWheelZoom).toBe(false)
})

test('tipFunction', () => {
  expect.assertions(2)
  const feature = new OlFeature({geometry: new OlGeomPoint([0, 0])})
  feature.getTip = jest.fn().mockImplementation(() => {
    return 'feature-tip'
  })

  expect(MapMgr.tipFunction(feature)).toEqual({html: 'feature-tip'})
  expect(feature.getTip).toHaveBeenCalledTimes(1)
})

describe('decorations', () => {
  let extendedDecorations
  let button
  beforeEach(() => {
    button = $('<button></button>')
    $('body').append(button)
    extendedDecorations = {app: {expandDetail: jest.fn()}}
    $.extend(extendedDecorations, MapMgr.FEATURE_DECORATIONS, {
      getName() {
        return 'A Name'
      },
      getAddress1() {
        return 'Address line 1'
      },
      getAddress2() {
        return 'Address line 2'
      },
      getCityStateZip() {
        return 'City, State Zip'
      },
      getPhone() {
        return '212-867-5309'
      },
      getEmail() {
        return 'email@email.com'
      },
      getWebsite() {
        return 'http://website'
      },
      detailsHtml() {
        return 'Some details'
      },
      cssClass() {
        return 'css-class'
      }
    })
  })

  afterEach(() => {
    button.remove()
  })

  test('getTip', () => {
    expect.assertions(1)
    expect(() => {
      MapMgr.FEATURE_DECORATIONS.getTip()
    }).toThrow('A getName decoration must be provided')
  })

  test('getName', () => {
    expect.assertions(1)
    expect(() => {
      MapMgr.FEATURE_DECORATIONS.getName()
    }).toThrow('A getName decoration must be provided')
  })

  test('cssClass', () => {
    expect.assertions(1)
    expect(MapMgr.FEATURE_DECORATIONS.cssClass()).toBe(undefined)
  })

  test('getAddress1', () => {
    expect.assertions(1)
    expect(() => {
      MapMgr.FEATURE_DECORATIONS.getAddress1()
    }).toThrow('A getAddress1 decoration must be provided to use default html method and directions')
  })

  test('getAddress2', () => {
    expect.assertions(1)
    expect(MapMgr.FEATURE_DECORATIONS.getAddress2()).toBe('')
  })

  test('getCityStateZip', () => {
    expect.assertions(1)
    expect(() => {
      MapMgr.FEATURE_DECORATIONS.getCityStateZip()
    }).toThrow('A getCityStateZip decoration must be provided to use default html method and directions')
  })

  test('getFullAddress', () => {
    expect.assertions(2)
    const html = extendedDecorations.addressHtml()
    expect(html.length).toBe(1)
    expect(extendedDecorations.getFullAddress()).toBe(
      'Address line 1\nAddress line 2,\nCity, State Zip'
    )
  })

  test('getPhone', () => {
    expect.assertions(1)
    expect(MapMgr.FEATURE_DECORATIONS.getPhone()).toBe(undefined)
  })

  test('getEmail', () => {
    expect.assertions(1)
    expect(MapMgr.FEATURE_DECORATIONS.getEmail()).toBe(undefined)
  })

  test('getWebsite', () => {
    expect.assertions(1)
    expect(MapMgr.FEATURE_DECORATIONS.getWebsite()).toBe(undefined)
  })

  test('detailsHtml', () => {
    expect.assertions(1)
    expect(MapMgr.FEATURE_DECORATIONS.detailsHtml()).toBe(undefined)
  })

  test('nameHtml', () => {
    expect.assertions(2)
    const html = extendedDecorations.nameHtml()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<h3 class="name notranslate">A Name</h3>'
    )
  })

  test('addressHtml with line 2', () => {
    expect.assertions(2)
    const html = extendedDecorations.addressHtml()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="addr notranslate"><div class="ln1">Address line 1</div><div class="ln2">Address line 2</div><div class="ln3">City, State Zip</div></div>'
    )
  })

  test('addressHtml no line 2', () => {
    expect.assertions(2)
    extendedDecorations.getAddress2 = () => {return ''}
    const html = extendedDecorations.addressHtml()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="addr notranslate"><div class="ln1">Address line 1</div><div class="ln3">City, State Zip</div></div>'
    )
  })

  test('mapButton', () => {
    expect.assertions(3)
    const html = extendedDecorations.mapButton()
    expect(html.length).toBe(1)
    expect(html.data('feature')).toBe(extendedDecorations)
    expect($('<div></div>').append(html).html()).toBe(
      '<button class="btn rad-all map"><span class="screen-reader-only">Locate this facility on the </span>Map</button>'
    )
  })

  test('directionsButton', () => {
    expect.assertions(3)
    const html = extendedDecorations.directionsButton()
    expect(html.length).toBe(1)
    expect(html.data('feature')).toBe(extendedDecorations)
    expect($('<div></div>').append(html).html()).toBe(
      '<button class="btn rad-all dir">Directions</button>'
    )
  })

  test('phoneButton has phone', () => {
    expect.assertions(2)
    const html = extendedDecorations.phoneButton()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<a class="btn rad-all phone" role="button" href="tel:212-867-5309">212-867-5309</a>'
    )
  })

  test('phoneButton no phone', () => {
    expect.assertions(1)
    extendedDecorations.getPhone = () => {}
    expect(extendedDecorations.phoneButton()).toBe(undefined)
  })

  test('emailButton has email', () => {
    expect.assertions(2)
    const html = extendedDecorations.emailButton()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<a class="btn rad-all email" role="button" href="mailto:email@email.com">Email</a>'
    )
  })

  test('emailButton no email', () => {
    expect.assertions(1)
    extendedDecorations.getEmail = () => {}
    expect(extendedDecorations.emailButton()).toBe(undefined)
  })

  test('websiteButton has website', () => {
    expect.assertions(2)
    const html = extendedDecorations.websiteButton()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<a class="btn rad-all web" target="blank" role="button" href="http://website">Website</a>'
    )
  })

  test('websiteButton no website', () => {
    expect.assertions(1)
    extendedDecorations.getWebsite = () => {}
    expect(extendedDecorations.websiteButton()).toBe(undefined)
  })


  test('distanceHtml has distance in feet', () => {
    expect.assertions(2)
    extendedDecorations.getDistance = () => {return {distance: 1000, units: 'ft'}}
    const html = extendedDecorations.distanceHtml()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="dist" aria-hidden="true">• 0.19 mi •</div>'
    )
  })

  test('distanceHtml has distance in meters', () => {
    expect.assertions(2)
    extendedDecorations.getDistance = () => {return {distance: 1000, units: 'm'}}
    const html = extendedDecorations.distanceHtml()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="dist" aria-hidden="true">• 1.00 km •</div>'
    )
  })

  test('screen reader distanceHtml has distance in feet', () => {
    expect.assertions(2)
    extendedDecorations.getDistance = () => {return {distance: 1000, units: 'ft'}}
    const html = extendedDecorations.distanceHtml(true)
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="dist screen-reader-only">0.19 miles</div>'
    )
  })

  test('screen reader distanceHtml has distance in meters', () => {
    expect.assertions(2)
    extendedDecorations.getDistance = () => {return {distance: 1000, units: 'm'}}
    const html = extendedDecorations.distanceHtml(true)
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="dist screen-reader-only">1.00 kilometers</div>'
    )
  })

  test('distanceHtml no distance', () => {
    expect.assertions(1)
    expect(extendedDecorations.distanceHtml()).toBe(undefined)
  })

  test('detailsCollapsible has details', () => {
    expect.assertions(2)
    const html = extendedDecorations.detailsCollapsible()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="dtl"><div class="clps rad-all"><button class="btn rad-all" aria-pressed="false" id="clsp-btn-0" aria-controls="clsp-pnl-0">Details</button><div class="content rad-bot" aria-expanded="false" aria-collapsed="true" aria-hidden="true" style="display: none;" id="clsp-pnl-0" aria-labelledby="clsp-btn-0"></div></div></div>'
    )
  })

  test('detailsCollapsible no dtl', () => {
    expect.assertions(1)
    extendedDecorations.detailsHtml = () => {}
    expect(extendedDecorations.detailsCollapsible()).toBe(undefined)
  })

  test('html', () => {
    expect.assertions(1)
    const html = extendedDecorations.html()
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="facility css-class"><h3 class="name notranslate">A Name</h3><div class="addr notranslate"><div class="ln1">Address line 1</div><div class="ln2">Address line 2</div><div class="ln3">City, State Zip</div></div><a class="btn rad-all phone" role="button" href="tel:212-867-5309">212-867-5309</a><a class="btn rad-all email" role="button" href="mailto:email@email.com">Email</a><a class="btn rad-all web" target="blank" role="button" href="http://website">Website</a><button class="btn rad-all map"><span class="screen-reader-only">Locate this facility on the </span>Map</button><button class="btn rad-all dir">Directions</button><div class="dtl"><div class="clps rad-all"><button class="btn rad-all" aria-pressed="false" id="clsp-btn-1" aria-controls="clsp-pnl-1">Details</button><div class="content rad-bot" aria-expanded="false" aria-collapsed="true" aria-hidden="true" style="display: none;" id="clsp-pnl-1" aria-labelledby="clsp-btn-1"></div></div></div></div>'
    )
  })

  test('handleButton', () => {
    expect.assertions(6)
    const mockFeature = {
      app: {
        zoomTo: jest.fn(),
        directionsTo: jest.fn()
      }
    }
    button.data('feature', mockFeature)

    extendedDecorations.handleButton({currentTarget: button})
    expect(mockFeature.app.zoomTo).toHaveBeenCalledTimes(0)
    expect(mockFeature.app.directionsTo).toHaveBeenCalledTimes(1)
    expect(mockFeature.app.directionsTo.mock.calls[0][0]).toBe(mockFeature)

    button.addClass('map')

    extendedDecorations.handleButton({currentTarget: button})
    expect(mockFeature.app.zoomTo).toHaveBeenCalledTimes(1)
    expect(mockFeature.app.zoomTo.mock.calls[0][0]).toBe(mockFeature)
    expect(mockFeature.app.directionsTo).toHaveBeenCalledTimes(1)
  })
  
})
