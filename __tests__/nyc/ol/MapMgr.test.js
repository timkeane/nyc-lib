import MapMgr from 'nyc/ol/MapMgr'
import Basemap from '../../../src/nyc/ol/Basemap'
import MultiFeaturePopup from '../../../src/nyc/ol/MultiFeaturePopup'
import FeatureTip from '../../../src/nyc/ol/FeatureTip'
import ListPager from '../../../src/nyc/ListPager'
import Layer from 'ol/layer/Vector'

jest.mock('../../../src/nyc/ol/Basemap')
jest.mock('../../../src/nyc/ol/MultiFeaturePopup')
jest.mock('../../../src/nyc/ol/FeatureTip')
jest.mock('../../../src/nyc/ListPager')

jest.mock('ol/layer/Vector')

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
  options.searchTarget =  undefined
  options.listTarget =  undefined
  options.facilityType =  undefined
  options.iconUrl =  undefined
  options.facilityStyle =  undefined
  options.facilitySearch =  true
  options.mouseWheelZoom =  false

  mapTarget = $('<div id="map"></div>')
  $('body').append(mapTarget)

  $.resetMocks()
  Basemap.resetMocks()
  MultiFeaturePopup.mockClear()
  FeatureTip.mockClear()
  Layer.mockClear()

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
    options.iconUrl = 'icon.png'
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

test('createLayer', () => {
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