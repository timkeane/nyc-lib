import MapMgr from 'nyc/ol/MapMgr'
import Basemap from 'nyc/ol/Basemap'
import MultiFeaturePopup from 'nyc/ol/MultiFeaturePopup'
import FeatureTip from 'nyc/ol/FeatureTip'
import ListPager from 'nyc/ListPager'
import Layer from 'ol/layer/Vector'
import FilterAndSort from 'nyc/ol/source/FilterAndSort'
import LocationMgr from 'nyc/ol/LocationMgr'
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
import Dialog from 'nyc/Dialog'

import nyc from 'nyc'
import Feature from 'ol/Feature'

jest.mock('../../../src/nyc/ol/Basemap')
jest.mock('../../../src/nyc/ol/MultiFeaturePopup')
jest.mock('../../../src/nyc/ol/FeatureTip')
jest.mock('../../../src/nyc/ListPager')
jest.mock('../../../src/nyc/ol/source/FilterAndSort')
jest.mock('../../../src/nyc/ol/LocationMgr')
jest.mock('../../../src/nyc/Dialog')
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
const loadFailed = MapMgr.prototype.loadFailed

const createLocationMgrMock = jest.fn().mockImplementation(() => {
  return {
    search: {
      setFeatures: jest.fn()
    }
  }
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
  options.facilityMarkerUrl = undefined

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
  Dialog.mockClear()

  MapMgr.prototype.createParentFormat = jest.fn()
  MapMgr.prototype.createDecorations = jest.fn()
  MapMgr.prototype.createLocationMgr = createLocationMgrMock
  MapMgr.prototype.checkMouseWheel = jest.fn()
  MapMgr.prototype.loadFailed = jest.fn()
})

afterEach(() => {
  mapTarget.remove()
  MapMgr.prototype.createParentFormat = createParentFormat
  MapMgr.prototype.createDecorations = createDecorations
  MapMgr.prototype.createLocationMgr = createLocationMgr
  MapMgr.prototype.checkMouseWheel = checkMouseWheel
  MapMgr.prototype.loadFailed = loadFailed
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
    mockPromise.then = jest.fn(() => {return mockPromise})
    mockPromise.catch = jest.fn()
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
    expect.assertions(38)

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

    expect(mapMgr.checkMouseWheel).toHaveBeenCalledTimes(1)
    expect(mapMgr.checkMouseWheel.mock.calls[0][0]).toBe(false)
  })

  test('constructor all options', () => {
    expect.assertions(41)

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

describe('located', () => {
  let h2
  beforeEach(() => {
    h2 = $('<h2 class="info"></h2>')
    $('body').append(h2)
  })
  
  afterEach(() => {
    h2.remove()
  })

  test('located', () => {
    expect.assertions(5)
  
    const mapMgr = new MapMgr(options)
    mapMgr.ready = jest.fn()
    mapMgr.resetList = jest.fn()
    
    mapMgr.located('mock-location-1')
  
    expect(mapMgr.location).toBe('mock-location-1')
    expect(mapMgr.resetList).toHaveBeenCalledTimes(0)
  
    mapMgr.pager = {
      find: jest.fn().mockImplementation(qry => {
        return h2
      }),
      reset: jest.fn()
    }
    mapMgr.located('mock-location-2')

    expect(mapMgr.location).toBe('mock-location-2')
    expect(mapMgr.resetList).toHaveBeenCalledTimes(1)
    expect(h2.attr('aria-live')).toBe('polite')
  })
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

  beforeEach(() => {
    nyc.ready = jest.fn()
    options.listTarget = '#list'
  })
  afterEach(() => {
    nyc.ready = nycReady
  })

  test('ready - fit view', () => {
    expect.assertions(4)
    
    const mapMgr = new MapMgr(options)
    mapMgr.ready('mock-features')

    expect(mapMgr.view.fit).toHaveBeenCalledTimes(1)
    expect(mapMgr.view.fit.mock.calls[0][0]).toBe(Basemap.EXTENT)
    expect(mapMgr.view.fit.mock.calls[0][1].size).toEqual([100, 100])
    expect(mapMgr.view.fit.mock.calls[0][1].duration).toBe(500)
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
  const feature = new Feature({geometry: new OlGeomPoint([0, 0])})

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
  const getFullAddress = Feature.prototype.getFullAddress
  const open = window.open

  beforeEach(() => {
    MapMgr.prototype.getFromAddr = jest.fn().mockImplementation(() => {
      return 'mock name'
    })

    Feature.prototype.getFullAddress = jest.fn().mockImplementation(() => {
      return 'mock address'
    })

    window.open = jest.fn()
  })
  afterEach(() => {
    MapMgr.prototype.getFromAddr = getFromAddr
    Feature.prototype.getFullAddress = getFullAddress
    window.open = open

  })

  test('directionsTo - from addr provided', () => {
    expect.assertions(4)
    const feature = new Feature({geometry: new OlGeomPoint([0, 0])})
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

    const feature = new Feature({geometry: new OlGeomPoint([0, 0])})
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
    // global._canvasWin = global.window
    // global.window = global.winB4canvasMock
    $.fn.width = jest.fn().mockImplementation(() => {
      return 216
    })
    $.fn.height = jest.fn().mockImplementation(() => {
      return 233
    })
  })
  afterEach(() => {
    // global.window = global._canvasWin
    $.fn.width = width
    $.fn.height = height
  })

  test('loadMarkerImage', () => {
    expect.assertions(7)
  
    const facilityStyle = 'mockUrl'
  
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
  
    $('body').children().last().trigger('load')
    expect(Icon).toHaveBeenCalledTimes(1)
    expect(Icon.mock.calls[0][0].src).toBe(facilityStyle)
    expect(Icon.mock.calls[0][0].imgSize[0]).toBe(216)
    expect(Icon.mock.calls[0][0].imgSize[1]).toBe(233)
    expect(Icon.mock.calls[0][0].scale).toBe(32/233)
    expect(mockStyle.setImage).toHaveBeenCalledTimes(1)
    expect(mockStyle.setImage.mock.calls[0][0]).toBe(Icon.mock.instances[0])
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

    const feature = new Feature()
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

  test('createStyle facilityMarkerUrl supplied', () => {
    expect.assertions(7)

    options.facilityStyle = undefined
    options.facilityMarkerUrl = 'facility-marker-url'
    const mapMgr = new MapMgr(options)

    expect(mapMgr.createStyle(options) instanceof Style).toBe(true)
    expect(Style.mock.calls[1][0]).toBeUndefined()
    expect(mapMgr.loadMarkerImage).toHaveBeenCalledTimes(2)
    expect(mapMgr.loadMarkerImage.mock.calls[1][0]).toBe(options.facilityMarkerUrl)
    expect(mapMgr.loadMarkerImage.mock.calls[1][1]).toBe(32)
    expect(mapMgr.loadMarkerImage.mock.calls[1][2]).toBe(Style.mock.instances[1])
    expect(Style).toHaveBeenCalledTimes(2)

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

  test('createStyle for types', () => {
    expect.assertions(2)

    options.facilityStyle = {
      styles: {
        R: [255, 0, 0],
        W: [255, 255, 255],
        B: [0, 0, 255]
      }
    }

    const mapMgr = new MapMgr(options)
    
    mapMgr.createFacilityStyle = jest.fn()
    
    const styleFn = mapMgr.createStyle(options)

    styleFn(new Feature({TYPE: 'A'}), 1)

    expect(mapMgr.createFacilityStyle).toHaveBeenCalledTimes(1)
    expect(mapMgr.createFacilityStyle.mock.calls[0][0]).toBe(options.facilityStyle.styles.A)
  })
})

describe('loadFailed', () => {
  const error = console.error
  
  beforeEach(() => {
    console.error = jest.fn()
  })
  
  afterEach(() => {
    console.error = error
  })

  test('loadFailed', () => {
    expect.assertions(7)
  
    const mapMgr = new MapMgr(options)
  
    mapMgr.loadFailed = loadFailed
    mapMgr.ready = jest.fn()

    mapMgr.loadFailed('mock-error')
  
    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error.mock.calls[0][0]).toBe('mock-error')
    expect(mapMgr.ready).toHaveBeenCalledTimes(1)
    expect(Dialog).toHaveBeenCalledTimes(1)
    expect(Dialog.mock.calls[0][0]).toEqual({})
    expect(Dialog.mock.instances[0].ok).toHaveBeenCalledTimes(1)
    expect(Dialog.mock.instances[0].ok.mock.calls[0][0]).toEqual({message: 'Failed to load map data'})
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
  const feature = new Feature({geometry: new OlGeomPoint([0, 0])})
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
      '<button class="btn btn-ico rad-all map"><span class="msg-map" aria-hidden="true">Map</span><span class="screen-reader-only msg-sr-map">Locate this facility on the map</span></button>'
    )
  })

  test('directionsButton', () => {
    expect.assertions(3)
    const html = extendedDecorations.directionsButton()
    expect(html.length).toBe(1)
    expect(html.data('feature')).toBe(extendedDecorations)
    expect($('<div></div>').append(html).html()).toBe(
      '<button class="btn btn-ico rad-all dir msg-dir">Directions</button>'
    )
  })

  test('phoneButton has phone', () => {
    expect.assertions(2)
    const html = extendedDecorations.phoneButton()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<a class="btn btn-ico rad-all phone notranslate" role="button" href="tel:212-867-5309">212-867-5309</a>'
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
      '<a class="btn btn-ico rad-all email msg-email" role="button" href="mailto:email@email.com">Email</a>'
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
      '<a class="btn btn-ico rad-all web msg-web" target="blank" role="button" href="http://website">Website</a>'
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
      '<div class="dtl"><div class="clps rad-all"><button class="btn rad-all" aria-pressed="false" id="clsp-btn-0" aria-controls="clsp-pnl-0"><span class="msg-dtl">Details</span></button><div class="content rad-bot" aria-expanded="false" aria-collapsed="true" aria-hidden="true" style="display: none;" id="clsp-pnl-0" aria-labelledby="clsp-btn-0"></div></div></div>'
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
      '<div class="facility css-class"><h3 class="name notranslate">A Name</h3><div class="addr notranslate"><div class="ln1">Address line 1</div><div class="ln2">Address line 2</div><div class="ln3">City, State Zip</div></div><a class="btn btn-ico rad-all phone notranslate" role="button" href="tel:212-867-5309">212-867-5309</a><a class="btn btn-ico rad-all email msg-email" role="button" href="mailto:email@email.com">Email</a><a class="btn btn-ico rad-all web msg-web" target="blank" role="button" href="http://website">Website</a><button class="btn btn-ico rad-all map"><span class="msg-map" aria-hidden="true">Map</span><span class="screen-reader-only msg-sr-map">Locate this facility on the map</span></button><button class="btn btn-ico rad-all dir msg-dir">Directions</button><div class="dtl"><div class="clps rad-all"><button class="btn rad-all" aria-pressed="false" id="clsp-btn-1" aria-controls="clsp-pnl-1"><span class="msg-dtl">Details</span></button><div class="content rad-bot" aria-expanded="false" aria-collapsed="true" aria-hidden="true" style="display: none;" id="clsp-pnl-1" aria-labelledby="clsp-btn-1"></div></div></div></div>'
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

  test('handleOver', () => {
    expect.assertions(2)

    const mockFeature = {
      app: {
        highlight: jest.fn()
      }
    }
    button.data('feature', mockFeature)
  
    extendedDecorations.handleOver({currentTarget: button})
    expect(mockFeature.app.highlight).toHaveBeenCalledTimes(1)
    expect(mockFeature.app.highlight.mock.calls[0][0]).toBe(mockFeature)
  })

  test('handleOut', () => {
    expect.assertions(1)

    const mockFeature = {
      app: {
        highlight: jest.fn()
      }
    }
    button.data('feature', mockFeature)
  
    extendedDecorations.handleOut({currentTarget: button})
    expect(mockFeature.app.highlight).toHaveBeenCalledTimes(1)
  })
})



