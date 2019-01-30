import MapMgr from '../../../src/nyc/ol/MapMgr'
import ListPager from '../../../src/nyc/ListPager'
import LocationMgr from '../../../src/nyc/ol/LocationMgr';

let options

beforeEach(() => {
  $.resetMocks()
  options = {
    mapTarget: 'mapTarget',
    searchTarget: 'searchTarget',
    listTarget: 'listTarget',
    facilityUrl: 'http://facility',
    facilityType: 'facilityType',
    iconUrl: 'img/iconUrl',
    facilityStyle: 'style',
    facilitySearch: true,
    geoclientUrl: 'http://geoclient'
  }
})
describe('constructor', () => {
  const createParentFormat = MapMgr.prototype.createParentFormat
  const createDecorations = MapMgr.prototype.createDecorations
  const createPager = MapMgr.prototype.createPager
  const createSource = MapMgr.prototype.createSource
  const ready = MapMgr.prototype.ready
  const createStyle = MapMgr.prototype.createStyle
  const createLocationMgr = MapMgr.prototype.createLocationMgr
  const autoLoad = MapMgr.prototype.source.autoLoad

  beforeEach(() => {
    MapMgr.prototype.createParentFormat = jest.fn()
    MapMgr.prototype.createDecorations = jest.fn()
    MapMgr.prototype.createPager = jest.fn()
    MapMgr.prototype.createSource = jest.fn()
    MapMgr.prototype.ready = jest.fn()
    MapMgr.prototype.createStyle = jest.fn()
    MapMgr.prototype.createLocationMgr = jest.fn()
    MapMgr.prototype.source.autoLoad = jest.fn()
  })
  afterEach(() => {
    MapMgr.prototype.createParentFormat = createParentFormat
    MapMgr.prototype.createDecorations = createDecorations
    MapMgr.prototype.createPager = createPager
    MapMgr.prototype.createSource = createSource
    MapMgr.prototype.ready = ready
    MapMgr.prototype.createStyle = createStyle
    MapMgr.prototype.createLocationMgr = createLocationMgr
    MapMgr.prototype.source.autoLoad = autoLoad
  })

  test('constructor', () => {
    expect.assertions(4)

    const mapMgr = new MapMgr(options)
    expect(mapMgr instanceof MapMgr).toBe(true)


    expect(mapMgr.createPager).toHaveBeenCalledTimes(1)
    expect(mapMgr.createSource).toHaveBeenCalledTimes(1)
    expect(mapMgr.createLocationMgr).toHaveBeenCalledTimes(1)

    
  })
})

describe('functions to be implemented', () => {

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
