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


import nyc from 'nyc'


jest.mock('../../../src/nyc/ol/Basemap')
jest.mock('../../../src/nyc/ol/MultiFeaturePopup')
jest.mock('../../../src/nyc/ol/FeatureTip')
jest.mock('../../../src/nyc/ListPager')
jest.mock('../../../src/nyc/ol/source/FilterAndSort')
jest.mock('../../../src/nyc/ol/LocationMgr')
jest.mock('ol/style/Style')
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
  options.mapMarkerColor = undefined
  options.facilityStyle = undefined
  options.facilitySearch = true
  options.mouseWheelZoom = false
  options.startAt = undefined


  mapTarget = $('<div id="map"></div>')
  $('body').append(mapTarget)

  $.resetMocks()
  Basemap.resetMocks()
  MultiFeaturePopup.mockClear()
  FeatureTip.mockClear()
  Layer.mockClear()
  FilterAndSort.mockClear()
  LocationMgr.mockClear()
  ListPager.mockClear()
  Style.mockClear()
  // Decorate.mockClear()

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
  const mockLocation = {}

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
    mockLocation.goTo = jest.fn()
    MapMgr.prototype.createLocationMgr = jest.fn().mockImplementation(() => {
      return mockLocation
    })
  })
  afterEach(() => {
    MapMgr.prototype.createSource = createSource
    MapMgr.prototype.createLayer = createLayer
    MapMgr.prototype.ready = ready
    MapMgr.prototype.createStyle = createStyle
  })

  test('constructor minimum options', () => {
    expect.assertions(42)

    const mapMgr = new MapMgr(options)
    expect(mapMgr instanceof MapMgr).toBe(true)

    expect(mapMgr.facilitySearch).toBe(options.facilitySearch)

    expect(ListPager).toHaveBeenCalledTimes(0)
    expect(mapMgr.pager).toBeUndefined()

    expect(mapMgr.createSource).toHaveBeenCalledTimes(1)
    expect(mapMgr.map.addLayer).toHaveBeenCalledTimes(1)
    expect(mapMgr.map.addLayer.mock.calls[0][0]).toBe(mapMgr.layer)
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
    expect(mapMgr.locationMgr).toBe(mockLocation)
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
    expect.assertions(45)

    options.searchTarget = '#search'
    options.listTarget = '#list'
    options.facilityType = 'Cool Places'
    options.mapMarkerUrl = 'icon.png'
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
    expect(mapMgr.map.addLayer).toHaveBeenCalledTimes(1)
    expect(mapMgr.map.addLayer.mock.calls[0][0]).toBe(mapMgr.layer)
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
    expect(mapMgr.locationMgr).toBe(mockLocation)
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

// test('loadMarkerImage', () => {
//   expect.assertions(4)
//   options.mapMarkerUrl = 'mapMarkerUrl'
//   const style = new Style({})
//   let scale
//   Style.prototype.setImage = jest.fn()

//   const mapMgr = new MapMgr(options)

//   mapMgr.loadMarkerImage(options.mapMarkerUrl, style)
//   /* TODO: trigger img load so style can be set. test currently not working */

//   expect(Style.prototype.setImage).toHaveBeenCalledTimes(1)
//   expect(Style.prototype.setImage.mock.calls[0][0] instanceof Icon).toBe(true)
//   expect(Style.prototype.setImage.mock.calls[0][0][0]).toBe(options.mapMarkerUrl)
//   expect(Style.prototype.setImage.mock.calls[0][0][1]).toBe(scale)


// })

describe('createLocationMgr', () => {

  beforeEach(() => {
    MapMgr.prototype.createLocationMgr = createLocationMgr

  })
  afterEach(() => {
    MapMgr.prototype.createLocationMgr = jest.fn().mockImplementation(() => {
      return 'mock-location-mgr'
    })
  })

  test('createLocationMgr', () => {
    expect.assertions(5)
    options.searchTarget = 'searchTarget'
    const mapMgr = new MapMgr(options)
    mapMgr.createLocationMgr(options)

    expect(LocationMgr).toHaveBeenCalledTimes(2)
    expect(LocationMgr.mock.calls[1][0].map).toBe(mapMgr.map)
    expect(LocationMgr.mock.calls[1][0].searchTarget).toBe(options.searchTarget)
    expect(LocationMgr.mock.calls[1][0].dialogTarget).toBe(options.mapTarget)
    expect(LocationMgr.mock.calls[1][0].url).toBe(options.geoclientUrl)

    /* TODO: add logic for geocoded and geolocated event triggers so they can be tested */

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

  test('createSource', () => {
    expect.assertions(7)
    options.facilityUrl = 'facilityUrl'
    const mapMgr = new MapMgr(options)

    expect(mapMgr.createParentFormat).toHaveBeenCalledTimes(1)
    expect(mapMgr.createDecorations).toHaveBeenCalledTimes(1)

    expect(FilterAndSort).toHaveBeenCalledTimes(1)
    expect(FilterAndSort.mock.calls[0][0].url).toBe(options.facilityUrl)
    expect(FilterAndSort.mock.calls[0][0].format instanceof Decorate).toBe(true)
    expect(FilterAndSort.mock.calls[0][0].format.decorations).toBe('mock-decorations')
    expect(FilterAndSort.mock.calls[0][0].format.parentFormat).toBe('mock-parent-format')


  })
})

describe('createStyle', () => {

  test('createStyle facilityStyle supplied', () => {
    expect.assertions(1)

    options.facilityStyle = 'facilityStyle'
    const mapMgr = new MapMgr(options)
    expect(mapMgr.createStyle(options)).toBe(options.facilityStyle)

  })

  test('createStyle no facilityStyle, mapMarkerUrl supplied', () => {
    expect.assertions(6)
    const loadMarkerImage = MapMgr.prototype.loadMarkerImage
    MapMgr.prototype.loadMarkerImage = jest.fn()

    options.facilityStyle = ''
    options.mapMarkerUrl = 'mapMarkerUrl'
    const mapMgr = new MapMgr(options)

    expect(Style.mock.calls[0][0]).toEqual({})
    expect(mapMgr.loadMarkerImage).toHaveBeenCalledTimes(1)
    expect(mapMgr.loadMarkerImage.mock.calls[0][0]).toBe(options.mapMarkerUrl)
    expect(mapMgr.loadMarkerImage.mock.calls[0][1] instanceof Style).toBe(true)
    expect(mapMgr.createStyle(options) instanceof Style).toBe(true)
    expect(Style).toHaveBeenCalledTimes(2)

    MapMgr.prototype.loadMarkerImage = loadMarkerImage

  })

  test('createStyle no facilityStyle or mapMarkerUrl supplied', () => {
    expect.assertions(9)

    options.facilityStyle = ''
    options.mapMarkerUrl = ''
    const mapMgr = new MapMgr(options)

    expect(Style.mock.calls[0][0].image instanceof Circle).toBe(true)
    expect(Style.mock.calls[0][0].image.radius_).toBe(6)
    expect(Style.mock.calls[0][0].image.fill_ instanceof Fill).toBe(true)
    expect(Style.mock.calls[0][0].image.fill_.color_).toBe('rgba(0,0,255,.5)')
    expect(Style.mock.calls[0][0].image.stroke_ instanceof Stroke).toBe(true)
    expect(Style.mock.calls[0][0].image.stroke_.color_).toBe('rgb(0,0,255)')
    expect(Style.mock.calls[0][0].image.stroke_.width_).toBe(2)
    expect(mapMgr.createStyle(options) instanceof Style).toBe(true)
    expect(Style).toHaveBeenCalledTimes(2)

  })

  test('createStyle no facilityStyle or mapMarkerUrl supplied, mapMarkerColor supplied', () => {
    expect.assertions(9)

    options.facilityStyle = ''
    options.mapMarkerUrl = ''
    options.mapMarkerColor = [255, 255, 255]
    const mapMgr = new MapMgr(options)

    expect(Style.mock.calls[0][0].image instanceof Circle).toBe(true)
    expect(Style.mock.calls[0][0].image.radius_).toBe(6)
    expect(Style.mock.calls[0][0].image.fill_ instanceof Fill).toBe(true)
    expect(Style.mock.calls[0][0].image.fill_.color_).toBe(`rgba(${options.mapMarkerColor},.5)`)
    expect(Style.mock.calls[0][0].image.stroke_ instanceof Stroke).toBe(true)
    expect(Style.mock.calls[0][0].image.stroke_.color_).toBe(`rgb(${options.mapMarkerColor})`)
    expect(Style.mock.calls[0][0].image.stroke_.width_).toBe(2)
    expect(mapMgr.createStyle(options) instanceof Style).toBe(true)
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


describe('decorations', () => {
  let extendedDecorations
  beforeEach(() => {
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
      '<button class="btn rad-all map btn-dark"><span class="screen-reader-only">Locate this facility on the </span>Map</button>'
    )
  })

  test('directionsButton', () => {
    expect.assertions(3)
    const html = extendedDecorations.directionsButton()
    expect(html.length).toBe(1)
    expect(html.data('feature')).toBe(extendedDecorations)
    expect($('<div></div>').append(html).html()).toBe(
      '<button class="btn rad-all dir btn-dark">Directions</button>'
    )
  })

  test('phoneButton has phone', () => {
    expect.assertions(2)
    const html = extendedDecorations.phoneButton()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<a class="btn rad-all phone btn-dark" role="button" href="tel:212-867-5309">212-867-5309</a>'
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
      '<a class="btn rad-all email btn-dark" role="button" href="mailto:email@email.com">Email</a>'
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
      '<a class="btn rad-all web btn-dark" target="blank" role="button" href="http://website">Website</a>'
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
      '<div class="dtl"><div class="clps rad-all"><button class="btn rad-all btn-dark" aria-pressed="false" id="clsp-btn-0" aria-controls="clsp-pnl-0">Details</button><div class="content rad-bot" aria-expanded="false" aria-collapsed="true" aria-hidden="true" style="display: none;" id="clsp-pnl-0" aria-labelledby="clsp-btn-0"></div></div></div>'
    )
  })

  test('detailsCollapsible no dtl', () => {
    expect.assertions(1)
    extendedDecorations.detailsHtml = () => {}
    expect(extendedDecorations.detailsCollapsible()).toBe(undefined)
  })
})
