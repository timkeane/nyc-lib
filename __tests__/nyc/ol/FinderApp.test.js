import FinderApp from 'nyc/ol/FinderApp'

import ListPager from 'nyc/ListPager'

import Basemap from 'nyc/ol/Basemap'
import MultiFeaturePopup from 'nyc/ol/MultiFeaturePopup'
import LocationMgr from 'nyc/ol/LocationMgr'
import FeatureTip from 'nyc/ol/FeatureTip'

import Decorate from 'nyc/ol/format/Decorate'

import FilterAndSort from 'nyc/ol/source/FilterAndSort'

import OlLayerVector from 'ol/layer/vector'

const style = () => {}
const format = {}
const filterChoiceOptions = []

let target
beforeEach(() => {
  // fetch.resetMocks()
  target = $('<div></div>')
  $('body').append(target)
})
afterEach(() => {
  target.remove()
})

describe('constructor', () => {
  const basemapConstructor = Basemap.prototype.constructor
  const addLayer = Basemap.prototype.addLayer
  const getView = Basemap.prototype.addLayer

  const filterAndSortConstructor = FilterAndSort.prototype.constructor
  const autoLoad = FilterAndSort.prototype.autoLoad

  const olLayerVectorConstructor = OlLayerVector.prototype.constructor

  const featureTipConstructor = FeatureTip.prototype.constructor

  const createFilters = FinderApp.prototype.createFilters
  const createTabs = FinderApp.prototype.createTabs
  const adjustTabs = FinderApp.prototype.adjustTabs
  const showSplash = FinderApp.prototype.showSplash
  beforeEach(() => {
    target = $('<div></div>')
    $('body').append(target)
    FinderApp.prototype.createFilters = jest.fn(() => {return 'mock-filters'})
    FinderApp.prototype.createTabs = jest.fn(() => {return 'mock-tabs'})
    FinderApp.prototype.adjustTabs = jest.fn()
    FinderApp.prototype.showSplash = jest.fn()
  })
  afterEach(() => {
    target.remove()
    FinderApp.prototype.createFilters = createFilters
    FinderApp.prototype.createTabs = createTabs
    FinderApp.prototype.adjustTabs = adjustTabs
    FinderApp.prototype.showSplash = showSplash
  })

  test('constructor', () => {
    expect.assertions(25)

    const finderApp = new FinderApp({
      title: 'Finder App',
      splashContent: 'splash content',
      facilityTabTitle: 'Places',
      facilityUrl: 'facility-url',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Places',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'geoclient-url'
    })

    expect(finderApp instanceof FinderApp).toBe(true)
    expect(window.finderApp).toBe(finderApp)

    expect(finderApp.pager instanceof ListPager).toBe(true)
    expect(finderApp.pager.getContainer().length).toBe(1)
    expect(finderApp.pager.getContainer().get(0)).toBe($('#facilities').get(0))

    expect(finderApp.map instanceof Basemap).toBe(true)
    expect(finderApp.map.getTargetElement()).toBe($('#map').get(0))

    expect(finderApp.source instanceof FilterAndSort).toBe(true)
    expect(finderApp.source.getFormat() instanceof Decorate).toBe(true)
    expect(finderApp.source.getFormat().parentFormat).toBe(format)

    expect(finderApp.layer instanceof OlLayerVector).toBe(true)
    expect(finderApp.layer.getSource()).toBe(finderApp.source)
    expect(finderApp.layer.getStyle()).toBe(style)

    expect(finderApp.map.getLayers().getArray().some(layer => {
      return layer === finderApp.layer
    })).toBe(true)

    expect(finderApp.popup instanceof MultiFeaturePopup).toBe(true)

    expect(finderApp.location).toEqual({})

    expect($('#map').find('.f-tip').length).toBe(1)

    expect(finderApp.view).toBe(finderApp.map.getView())

    expect(finderApp.locationMgr instanceof LocationMgr).toBe(true)

    expect(finderApp.filters).toBe('mock-filters')
    expect(finderApp.tabs).toBe('mock-tabs')
    expect(FinderApp.prototype.adjustTabs).toHaveBeenCalledTimes(1)
    expect(FinderApp.prototype.showSplash).toHaveBeenCalledTimes(1)
    expect(FinderApp.prototype.showSplash.mock.calls[0][0]).toBe('splash content')

    expect($('#map').find('#lng').length).toBe(1)
  })
})
