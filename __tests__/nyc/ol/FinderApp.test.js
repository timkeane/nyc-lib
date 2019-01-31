import nyc from 'nyc'

import Dialog from '../../../src/nyc/Dialog'
import Directions from '../../../src/nyc/Directions'
import Share from '../../../src/nyc/Share'
import Tabs from '../../../src/nyc/Tabs'
import ListPager from '../../../src/nyc/ListPager'
import MapLocator from '../../../src/nyc/MapLocator'

import Translate from '../../../src/nyc/lang/Translate'
import Goog from '../../../src/nyc/lang/Goog'

import Basemap from '../../../src/nyc/ol/Basemap'
import Filters from '../../../src/nyc/ol/Filters'
import LocationMgr from '../../../src/nyc/ol/LocationMgr'
import MultiFeaturePopup from '../../../src/nyc/ol/MultiFeaturePopup'
import FeatureTip from '../../../src/nyc/ol/FeatureTip'

import CsvPoint from '../../../src/nyc/ol/format/CsvPoint'
import Decorate from '../../../src/nyc/ol/format/Decorate'

import FilterAndSort from '../../../src/nyc/ol/source/FilterAndSort'

import OlFeature from 'ol/Feature'
import OlGeomPoint from 'ol/geom/Point'
import OlLayerVector from 'ol/layer/Vector'
import OlStyleStyle from 'ol/style/Style'

import FinderApp from 'nyc/ol/FinderApp'

jest.mock('../../../src/nyc/Dialog')
jest.mock('../../../src/nyc/Directions')
jest.mock('../../../src/nyc/Share')
// jest.mock('../../../src/nyc/Tabs')
// jest.mock('../../../src/nyc/ListPager')
jest.mock('../../../src/nyc/MapLocator')

jest.mock('../../../src/nyc/lang/Translate')
jest.mock('../../../src/nyc/lang/Goog')

jest.mock('../../../src/nyc/ol/Basemap')
jest.mock('../../../src/nyc/ol/Filters')
jest.mock('../../../src/nyc/ol/LocationMgr')
jest.mock('../../../src/nyc/ol/MultiFeaturePopup')
jest.mock('../../../src/nyc/ol/FeatureTip')

jest.mock('../../../src/nyc/ol/format/CsvPoint')
// jest.mock('../../../src/nyc/ol/format/Decorate')

jest.mock('../../../src/nyc/ol/source/FilterAndSort')

jest.mock('ol/layer/Vector')
jest.mock('ol/style/Style')



test('FIXME!!!', () => {})

const format = new CsvPoint({})
const style = new OlStyleStyle({})
const filterChoiceOptions = []

beforeEach(() => {
  $.resetMocks()
  Dialog.mockClear()
  Directions.mockClear()
  Share.mockClear()
  // Tabs.mockClear()
  // ListPager.mockClear()
  MapLocator.mockClear()

  Translate.mockClear()
  Goog.mockClear()

  Basemap.mockClear()
  Filters.mockClear()
  LocationMgr.mockClear()
  MultiFeaturePopup.mockClear()
  FeatureTip.mockClear()

  CsvPoint.mockClear()
  // Decorate.mockClear()

  FilterAndSort.mockClear()

  OlLayerVector.mockClear()
  OlStyleStyle.mockClear()
})
afterEach(() => {
  $('body').empty()
})

test('constructor', () => {
  expect.assertions(60)

  const finderApp = new FinderApp({
    title: 'Finder App',
    splashOptions: {message: 'splash page message'},
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: format,
    facilityStyle: style,
    filterTabTitle: 'Filter Title',
    filterChoiceOptions: filterChoiceOptions,
    geoclientUrl: 'http://geoclient'
  })

  expect(finderApp.pager instanceof ListPager).toBe(true)
  expect(finderApp.pager.getContainer().length).toBe(1)
  expect(finderApp.pager.getContainer().get(0)).toBe($('#facilities div[role="region"]').get(0))

  expect(Basemap).toHaveBeenCalledTimes(1)
  expect(Basemap.mock.calls[0][0]).toEqual({target: 'map'})

  expect(FilterAndSort).toHaveBeenCalledTimes(1)
  expect(FilterAndSort.mock.calls[0][0].url).toBe('http://facility')
  expect(FilterAndSort.mock.calls[0][0].format instanceof Decorate).toBe(true)
  expect(FilterAndSort.mock.calls[0][0].format.parentFormat).toBe(format);
  expect(FilterAndSort.mock.calls[0][0].format.decoration).toBe(FinderApp.DEFAULT_DECORATIONS);

  expect(OlLayerVector).toHaveBeenCalledTimes(1)
  expect(OlLayerVector.mock.calls[0][0].source).toBe(finderApp.source)
  expect(OlLayerVector.mock.calls[0][0].style).toBe(style)

  expect(finderApp.map.addLayer).toHaveBeenCalledTimes(1)
  expect(finderApp.map.addLayer.mock.calls[0][0]).toBe(finderApp.layer)

  expect(MultiFeaturePopup).toHaveBeenCalledTimes(1)
  expect(MultiFeaturePopup.mock.calls[0][0].map).toBe(finderApp.map)
  expect(MultiFeaturePopup.mock.calls[0][0].layers.length).toBe(1)
  expect(MultiFeaturePopup.mock.calls[0][0].layers[0]).toBe(finderApp.layer)

  expect(finderApp.location).toEqual({})

  expect(FeatureTip).toHaveBeenCalledTimes(1)
  expect(FeatureTip.mock.calls[0][0].map).toBe(finderApp.map)
  expect(FeatureTip.mock.calls[0][0].tips.length).toBe(1)
  expect(FeatureTip.mock.calls[0][0].tips[0].layer).toBe(finderApp.layer)
  expect(typeof FeatureTip.mock.calls[0][0].tips[0].label).toBe('function')

  expect(FeatureTip.mock.calls[0][0].tips[0].label({getName: () => {return 'Fred'}}).html).toBe('Fred')

  expect(LocationMgr).toHaveBeenCalledTimes(1)
  expect(LocationMgr.mock.calls[0][0].map).toBe(finderApp.map)
  expect(LocationMgr.mock.calls[0][0].url).toBe('http://geoclient')
  expect(finderApp.locationMgr.on).toHaveBeenCalledTimes(2)
  expect(finderApp.locationMgr.on.mock.calls[0][0]).toBe('geocoded')
  expect(finderApp.locationMgr.on.mock.calls[0][1]).toBe(finderApp.located)
  expect(finderApp.locationMgr.on.mock.calls[0][2]).toBe(finderApp)
  expect(finderApp.locationMgr.on.mock.calls[1][0]).toBe('geolocated')
  expect(finderApp.locationMgr.on.mock.calls[1][1]).toBe(finderApp.located)
  expect(finderApp.locationMgr.on.mock.calls[1][2]).toBe(finderApp)

  expect(Filters).toHaveBeenCalledTimes(1)
  expect(Filters.mock.calls[0][0].target).toBe('#filters')
  expect(Filters.mock.calls[0][0].source).toBe(finderApp.source)
  expect(Filters.mock.calls[0][0].choiceOptions).toBe(filterChoiceOptions)
  expect(finderApp.filters.on).toHaveBeenCalledTimes(1)
  expect(finderApp.filters.on.mock.calls[0][0]).toBe('change')
  expect(finderApp.filters.on.mock.calls[0][1]).toBe(finderApp.resetList)
  expect(finderApp.filters.on.mock.calls[0][2]).toBe(finderApp)

  expect(finderApp.tabs instanceof Tabs).toBe(true)
  expect(finderApp.tabs.tabs.children().length).toBe(3)

  expect(finderApp.view.fit).toHaveBeenCalledTimes(1)
  expect(finderApp.view.fit.mock.calls[0][0]).toBe(Basemap.EXTENT)
  expect(finderApp.view.fit.mock.calls[0][1].size).toEqual([100, 100])
  expect(finderApp.view.fit.mock.calls[0][1].duration).toBe(500)

  expect(Dialog).toHaveBeenCalledTimes(1)
  expect(Dialog.mock.calls[0][0]).toBe('splash')
  expect(Dialog.mock.instances[0].ok.mock.calls[0][0].message).toBe('splash page message')
  expect(Dialog.mock.instances[0].ok.mock.calls[0][0].buttonText[0]).toBe('Continue')

  expect(Share).toHaveBeenCalledTimes(1)
  expect(Share.mock.calls[0][0].target).toBe('#map')

  expect(Goog).toHaveBeenCalledTimes(1)
  expect(Goog.mock.calls[0][0].target).toBe('#map')
  expect(Goog.mock.calls[0][0].languages).toBe(Translate.DEFAULT_LANGUAGES)
  expect(Goog.mock.calls[0][0].button).toBe(true)
})

describe('zoomTo', () => {
  test('zoomTo map tab button hidden', () => {
    expect.assertions(10)
    const feature = new OlFeature({geometry: new OlGeomPoint([0, 0])})
    
    const finderApp = new FinderApp({
      title: 'Finder App',
      splashOptions: {message: 'splash page message'},
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    expect($('#tabs .btns h2:first-of-type').length).toBe(1)
    $('#tabs .btns h2:first-of-type').hide()
    finderApp.zoomTo(feature)

    expect(finderApp.popup.hide).toHaveBeenCalledTimes(1)

    expect(finderApp.map.once).toHaveBeenCalledTimes(1)
    expect(finderApp.map.once.mock.calls[0][0]).toBe('moveend')
    expect(typeof finderApp.map.once.mock.calls[0][1]).toBe('function')

    expect(finderApp.popup.showFeature).toHaveBeenCalledTimes(1)
    expect(finderApp.popup.showFeature.mock.calls[0][0]).toBe(feature)
    
    expect(finderApp.view.animate).toHaveBeenCalledTimes(1)
    expect(finderApp.view.animate.mock.calls[0][0].center).toEqual(feature.getGeometry().getCoordinates())
    expect(finderApp.view.animate.mock.calls[0][0].zoom).toBe(MapLocator.ZOOM_LEVEL)
  })

  test('zoomTo map tab button visible', () => {
    expect.assertions(12)
    const feature = new OlFeature({geometry: new OlGeomPoint([0, 0])})
    
    const finderApp = new FinderApp({
      title: 'Finder App',
      splashOptions: {message: 'splash page message'},
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    finderApp.tabs.open = jest.fn()

    expect($('#tabs .btns h2:first-of-type').length).toBe(1)
    $('#tabs .btns h2:first-of-type').show()
    finderApp.zoomTo(feature)

    expect(finderApp.tabs.open).toHaveBeenCalledTimes(1)
    expect(finderApp.tabs.open.mock.calls[0][0]).toBe('#map')

    expect(finderApp.popup.hide).toHaveBeenCalledTimes(1)

    expect(finderApp.map.once).toHaveBeenCalledTimes(1)
    expect(finderApp.map.once.mock.calls[0][0]).toBe('moveend')
    expect(typeof finderApp.map.once.mock.calls[0][1]).toBe('function')

    expect(finderApp.popup.showFeature).toHaveBeenCalledTimes(1)
    expect(finderApp.popup.showFeature.mock.calls[0][0]).toBe(feature)
    
    expect(finderApp.view.animate).toHaveBeenCalledTimes(1)
    expect(finderApp.view.animate.mock.calls[0][0].center).toEqual(feature.getGeometry().getCoordinates())
    expect(finderApp.view.animate.mock.calls[0][0].zoom).toBe(MapLocator.ZOOM_LEVEL)
  })  
})

test('directionsTo', () => {
  expect.assertions(17)
  
  const feature = new OlFeature({geometry: new OlGeomPoint([0, 1])})
  feature.getName = () => {
    return 'feature name'
  }
  feature.getFullAddress = () => {
    return 'feature address'
  }
  const finderApp = new FinderApp({
    title: 'Finder App',
    splashOptions: {message: 'splash page message'},
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: format,
    facilityStyle: style,
    filterTabTitle: 'Filter Title',
    filterChoiceOptions: filterChoiceOptions,
    geoclientUrl: 'http://geoclient',
    directionsUrl: 'http://directions'
  })

  finderApp.directionsTo(feature)

  expect(Directions).toHaveBeenCalledTimes(1)
  expect(finderApp.directions.directions).toHaveBeenCalledTimes(1)
  expect(finderApp.directions.directions.mock.calls[0][0].from).toBe('')
  expect(finderApp.directions.directions.mock.calls[0][0].to).toBe('feature address')
  expect(finderApp.directions.directions.mock.calls[0][0].facility).toBe('feature name')
  expect(finderApp.directions.directions.mock.calls[0][0].origin).toEqual({})
  expect(finderApp.directions.directions.mock.calls[0][0].destination.name).toBe('feature name')
  expect(finderApp.directions.directions.mock.calls[0][0].destination.coordinate).toEqual([0, 1])

  finderApp.location = {
    name: 'user location',
    type: 'geolocated',
    coordinate: [1, 0]
  }

  finderApp.directionsTo(feature)

  expect(Directions).toHaveBeenCalledTimes(1)
  expect(finderApp.directions.directions).toHaveBeenCalledTimes(2)
  expect(finderApp.directions.directions.mock.calls[1][0].from).toBe('0,0.000008983152841195214')
  expect(finderApp.directions.directions.mock.calls[1][0].to).toBe('feature address')
  expect(finderApp.directions.directions.mock.calls[1][0].facility).toBe('feature name')
  expect(finderApp.directions.directions.mock.calls[1][0].origin.name).toBe('user location')
  expect(finderApp.directions.directions.mock.calls[1][0].origin.coordinate).toEqual([1, 0])
  expect(finderApp.directions.directions.mock.calls[1][0].destination.name).toBe('feature name')
  expect(finderApp.directions.directions.mock.calls[1][0].destination.coordinate).toEqual([0, 1])
})

test('createFilters', () => {
  expect.assertions(8)
  
  const finderApp = new FinderApp({
    title: 'Finder App',
    splashOptions: {message: 'splash page message'},
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: format,
    facilityStyle: style,
    geoclientUrl: 'http://geoclient'
  })

  const filters = finderApp.createFilters('mock-filterChoiceOptions')

  expect(Filters).toHaveBeenCalledTimes(1)
  expect(Filters.mock.calls[0][0].target).toBe('#filters')
  expect(Filters.mock.calls[0][0].source).toBe(finderApp.source)
  expect(Filters.mock.calls[0][0].choiceOptions).toBe('mock-filterChoiceOptions')

  expect(filters.on).toHaveBeenCalledTimes(1)
  expect(filters.on.mock.calls[0][0]).toBe('change')
  expect(filters.on.mock.calls[0][1]).toBe(finderApp.resetList)
  expect(filters.on.mock.calls[0][2]).toBe(finderApp)
})

test('showSplash', () => {
  expect.assertions(7)
  
  const finderApp = new FinderApp({
    title: 'Finder App',
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: format,
    facilityStyle: style,
    geoclientUrl: 'http://geoclient'
  })

  finderApp.locationMgr.search.input.focus.mockReset()
  $('#tabs').attr('aria-hidden', true)

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        expect($('#tabs').attr('aria-hidden')).toBe('false')
        expect(finderApp.locationMgr.search.input.focus).toHaveBeenCalledTimes(1)
        resolve(true)
      }, 500)
    })
  }

  finderApp.showSplash({message: 'splash page message'})
  
  expect(Dialog).toHaveBeenCalledTimes(1)
  expect(Dialog.mock.calls[0][0]).toBe('splash')
  expect(Dialog.mock.instances[0].ok.mock.calls[0][0].message).toBe('splash page message')
  expect(Dialog.mock.instances[0].ok.mock.calls[0][0].buttonText[0]).toBe('Continue')
  
  return test().then(success => {expect(success).toBe(true)})
})

describe('createTabs', () => {
  test('createTabs called from constructor no filters titles provided no splash', () => {
    expect.assertions(13)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      geoclientUrl: 'http://geoclient'
    })

    expect(finderApp.tabs instanceof Tabs).toBe(true)
    expect($('#tabs').attr('aria-hidden')).toBe(undefined)
    expect(finderApp.tabs.tabs.children().length).toBe(2)
    expect(finderApp.tabs.tabs.find('#map').length).toBe(1)
    expect(finderApp.tabs.tabs.find('#map').data('btn').html()).toBe('Map')
    expect(finderApp.tabs.tabs.find('#facilities').length).toBe(1)
    expect(finderApp.tabs.tabs.find('#facilities').data('btn').html()).toBe('Facility Title')
  
    expect($.mocks.resize).toHaveBeenCalledTimes(1)
    expect($.mocks.resize.mock.instances[0].get(0)).toBe(window)

    expect($.mocks.proxy).toHaveBeenCalled()
    const lastCall = $.mocks.proxy.mock.calls.length - 1
    expect($.mocks.proxy.mock.calls[lastCall][0]).toBe(finderApp.adjustTabs)
    expect($.mocks.proxy.mock.calls[lastCall][1]).toBe(finderApp)

    expect($.mocks.resize.mock.calls[0][0]).toBe($.mocks.proxy.returnedValues[lastCall])
  })

  test('createTabs called from constructor has filters titles not provided has splash', () => {
    expect.assertions(15)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient',
      splashOptions: {}
    })

    expect(finderApp.tabs instanceof Tabs).toBe(true)
    expect($('#tabs').attr('aria-hidden')).toBe('true')
    expect(finderApp.tabs.tabs.children().length).toBe(3)
    expect(finderApp.tabs.tabs.find('#map').length).toBe(1)
    expect(finderApp.tabs.tabs.find('#map').data('btn').html()).toBe('Map')
    expect(finderApp.tabs.tabs.find('#facilities').length).toBe(1)
    expect(finderApp.tabs.tabs.find('#facilities').data('btn').html()).toBe('Facilities')
    expect(finderApp.tabs.tabs.find('#filters').length).toBe(1)
    expect(finderApp.tabs.tabs.find('#filters').data('btn').html()).toBe('Filters')
  
    expect($.mocks.resize).toHaveBeenCalledTimes(1)
    expect($.mocks.resize.mock.instances[0].get(0)).toBe(window)

    expect($.mocks.proxy).toHaveBeenCalled()
    const lastCall = $.mocks.proxy.mock.calls.length - 1
    expect($.mocks.proxy.mock.calls[lastCall][0]).toBe(finderApp.adjustTabs)
    expect($.mocks.proxy.mock.calls[lastCall][1]).toBe(finderApp)

    expect($.mocks.resize.mock.calls[0][0]).toBe($.mocks.proxy.returnedValues[lastCall])
  })
})

test('expandDetail', () => {
  expect.assertions(1)

  const finderApp = new FinderApp({
    title: 'Finder App',
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: format,
    facilityStyle: style,
    geoclientUrl: 'http://geoclient'
  })

  finderApp.popup.pan = jest.fn()

  finderApp.expandDetail()
  
  expect(finderApp.popup.pan).toHaveBeenCalledTimes(1)
})

describe('adjustTabs', () => {
  const activeElement = nyc.activeElement
  beforeEach(() => {
    $('body').append('<div id="directions" style="display:none"></div>')
  })
  afterEach(() => {
    nyc.activeElement = activeElement
    $('#directions').remove()
  })

  test('adjustTabs full width', () => {
    expect.assertions(2)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      geoclientUrl: 'http://geoclient'
    })

    finderApp.tabs.open = jest.fn()

    $(window).width(500)
    finderApp.tabs.getContainer().width(500)

    finderApp.adjustTabs()

    expect(finderApp.tabs.open).toHaveBeenCalledTimes(1)
    expect(finderApp.tabs.open.mock.calls[0][0]).toBe('#map')
  })

  test('adjustTabs not full width', () => {
    expect.assertions(2)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    finderApp.tabs.open = jest.fn()

    $(window).width(500)
    finderApp.tabs.getContainer().width(400)

    finderApp.adjustTabs()

    expect(finderApp.tabs.open).toHaveBeenCalledTimes(1)
    expect(finderApp.tabs.open.mock.calls[0][0]).toBe('#facilities')
  })

  test('adjustTabs activeElement isTextInput', () => {
    expect.assertions(1)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    finderApp.tabs.open = jest.fn()

    $(window).width(500)
    finderApp.tabs.getContainer().width(400)

    nyc.activeElement = () => {
      return {isTextInput: true}
    }

    finderApp.adjustTabs()

    expect(finderApp.tabs.open).toHaveBeenCalledTimes(0)
  })

  test('adjustTabs directions visible', () => {
    expect.assertions(1)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      geoclientUrl: 'http://geoclient',
      directionsUrl: 'http://directions'
    })

    finderApp.tabs.open = jest.fn()

    $(window).width(500)
    finderApp.tabs.getContainer().width(500)

    $('#directions').show()

    finderApp.adjustTabs()

    expect(finderApp.tabs.open).toHaveBeenCalledTimes(0)
  })
})

describe('tabChange', () => {
  test('tabChange tabs do not fill screen', () => {
    expect.assertions(3)
  
    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })
  
    $('#map').attr('aria-hidden', true)
    finderApp.tabs.getContainer().width(400)
    $(window).width(900)
    $('#map').width(500)
    $('#map').height(400)
  
    finderApp.tabChange()
  
    expect($('#map').attr('aria-hidden')).toBe('false')
    expect(finderApp.map.setSize).toHaveBeenCalledTimes(2)
    expect(finderApp.map.setSize.mock.calls[1][0]).toEqual([500, 400])
  })

  test('tabChange tabs do fill screen', () => {
    expect.assertions(3)
  
    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })
  
    $('#map').attr('aria-hidden', true)
    finderApp.tabs.getContainer().width(500)
    $(window).width(500)
    $('#map').width(500)
    $('#map').height(400)
  
    finderApp.tabChange()
  
    expect($('#map').attr('aria-hidden')).toBe('true')
    expect(finderApp.map.setSize).toHaveBeenCalledTimes(2)
    expect(finderApp.map.setSize.mock.calls[1][0]).toEqual([500, 400])
  })
})

test('located', () => {
  expect.assertions(2)

  const finderApp = new FinderApp({
    title: 'Finder App',
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: format,
    facilityStyle: style,
    filterTabTitle: 'Filter Title',
    filterChoiceOptions: filterChoiceOptions,
    geoclientUrl: 'http://geoclient'
  })

  finderApp.resetList = jest.fn()

  finderApp.located('mock-location')

  expect(finderApp.location).toBe('mock-location')
  expect(finderApp.resetList).toHaveBeenCalledTimes(1)
})

describe('resetList', () => {
  test('resetList is filter event has coordinate', () => {
    expect.assertions(7)

    const features = [{}, {}]
    FilterAndSort.features = features

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    finderApp.location = {coordinate: [0, 0]}
    finderApp.pager.reset = jest.fn()

    finderApp.resetList(finderApp.filters)

    expect($('#tabs .btns .btn-2').hasClass('filtered')).toBe(true)

    expect(finderApp.popup.hide).toHaveBeenCalledTimes(1)

    expect(finderApp.pager.reset).toHaveBeenCalledTimes(1)
    expect(finderApp.pager.reset.mock.calls[0][0]).toBe(features)

    expect(finderApp.source.getFeatures).toHaveBeenCalledTimes(0)
    expect(finderApp.source.sort).toHaveBeenCalledTimes(1)
    expect(finderApp.source.sort.mock.calls[0][0]).toBe(finderApp.location.coordinate)
  })

  test('resetList no filter event no coordinate', () => {
    expect.assertions(7)

    const features = [{}, {}]
    FilterAndSort.features = features

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    finderApp.pager.reset = jest.fn()

    finderApp.resetList()

    expect($('#tabs .btns h2.btn-2').hasClass('filtered')).toBe(false)

    expect(finderApp.popup.hide).toHaveBeenCalledTimes(1)

    expect(finderApp.pager.reset).toHaveBeenCalledTimes(1)
    expect(finderApp.pager.reset.mock.calls[0][0]).toBe(features)

    expect(finderApp.source.sort).toHaveBeenCalledTimes(0)
    expect(finderApp.source.getFeatures).toHaveBeenCalledTimes(1)
    expect(finderApp.source.getFeatures.mock.calls[0][0]).toBe(finderApp.location.coordinate)
  })
})

test('parentFormat', () => {
  expect.assertions(2)

  const format = {parentFormat: 'mock-format'}

  const finderApp = new FinderApp({
    title: 'Finder App',
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: format,
    facilityStyle: style,
    filterTabTitle: 'Filter Title',
    filterChoiceOptions: filterChoiceOptions,
    geoclientUrl: 'http://geoclient'
  })

  expect(finderApp.parentFormat(format)).toBe('mock-format')  

  delete format.parentFormat

  expect(finderApp.parentFormat(format)).toBe(format)  
})

describe('decorations', () => {

  test('decorations none supplied', () => {
    expect.assertions(3)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    const decorations = finderApp.decorations({}, {})

    expect(decorations.length).toBe(2)
    expect(decorations[0]).toBe(FinderApp.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
  })

  test('decorations supplied on parentFormat', () => {
    expect.assertions(4)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    const decoratedFormat = {
      parentFormat: {
        decorations: [{foo: 'bar', bar: 'foo'}]
      }
    }
    const decorations = finderApp.decorations({}, decoratedFormat)

    expect(decorations.length).toBe(3)
    expect(decorations[0]).toBe(FinderApp.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
    expect(decorations[2]).toBe(decoratedFormat.parentFormat.decorations[0])
  })

  test('decorations supplied on format', () => {
    expect.assertions(4)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    const decoratedFormat = {
      decorations: [{foo: 'bar', bar: 'foo'}]
    }

    const decorations = finderApp.decorations({}, decoratedFormat)

    expect(decorations.length).toBe(3)
    expect(decorations[0]).toBe(FinderApp.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
    expect(decorations[2]).toBe(decoratedFormat.decorations[0])
  })

  test('decorations supplied on parentFormat', () => {
    expect.assertions(4)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    const decoratedFormat = {
      parentFormat: {
        decorations: [{foo: 'bar', bar: 'foo'}]
      }
  }
    const decorations = finderApp.decorations({}, decoratedFormat)

    expect(decorations.length).toBe(3)
    expect(decorations[0]).toBe(FinderApp.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
    expect(decorations[2]).toBe(decoratedFormat.parentFormat.decorations[0])
  })

  test('decorations supplied on options', () => {
    expect.assertions(4)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    const options = {
      decorations: [{foo: 'bar', bar: 'foo'}]
    }

    const decorations = finderApp.decorations(options, {})

    expect(decorations.length).toBe(3)
    expect(decorations[0]).toBe(FinderApp.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
    expect(decorations[2]).toBe(options.decorations[0])
  })

  test('decorations supplied on all the things', () => {
    expect.assertions(6)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    const options = {
      decorations: [{foo: 'bar', bar: 'foo'}]
    }
    const decoratedFormat = {
      parentFormat: {
        decorations: [{doo: 'fus', wtf: 'lol'}]
      },
      decorations: [{you: 'me', me: 'you'}]
    }

    const decorations = finderApp.decorations(options, decoratedFormat)

    expect(decorations.length).toBe(5)
    expect(decorations[0]).toBe(FinderApp.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
    expect(decorations[2]).toBe(decoratedFormat.parentFormat.decorations[0])
    expect(decorations[3]).toBe(decoratedFormat.decorations[0])
    expect(decorations[4]).toBe(options.decorations[0])
  })
})

describe('ready', () => {
  const ready = nyc.ready
  afterEach(() => {
    nyc.ready = ready
  })

  test('ready facilitySearch false', () => {
    expect.assertions(5)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      facilitySearch: false,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    nyc.ready = jest.fn()
    finderApp.pager.reset = jest.fn()

    finderApp.ready('mock-features')

    expect(finderApp.pager.reset).toHaveBeenCalledTimes(1)
    expect(finderApp.pager.reset.mock.calls[0][0]).toBe('mock-features')

    expect(finderApp.locationMgr.search.setFeatures).toHaveBeenCalledTimes(0)

    expect(nyc.ready).toHaveBeenCalledTimes(1)
    expect(nyc.ready.mock.calls[0][0].get(0)).toBe(document.body)
  })

  test('ready facilitySearch true', () => {
    expect.assertions(6)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    nyc.ready = jest.fn()
    finderApp.pager.reset = jest.fn()
    finderApp.facilitySearch = true

    finderApp.ready('mock-features')

    expect(finderApp.pager.reset).toHaveBeenCalledTimes(1)
    expect(finderApp.pager.reset.mock.calls[0][0]).toBe('mock-features')

    expect(finderApp.locationMgr.search.setFeatures).toHaveBeenCalledTimes(1)
    expect(finderApp.locationMgr.search.setFeatures.mock.calls[0][0]).toEqual({features: 'mock-features'})

    expect(nyc.ready).toHaveBeenCalledTimes(1)
    expect(nyc.ready.mock.calls[0][0].get(0)).toBe(document.body)
  })

  test('ready has facilitySearch options', () => {
    expect.assertions(7)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    nyc.ready = jest.fn()
    finderApp.pager.reset = jest.fn()
    finderApp.facilitySearch = {name: 'mock-options'}
    finderApp.ready('mock-features')

    expect(finderApp.pager.reset).toHaveBeenCalledTimes(1)
    expect(finderApp.pager.reset.mock.calls[0][0]).toBe('mock-features')

    expect(finderApp.locationMgr.search.setFeatures).toHaveBeenCalledTimes(1)
    expect(finderApp.locationMgr.search.setFeatures.mock.calls[0][0]).toBe(finderApp.facilitySearch)
    expect(finderApp.locationMgr.search.setFeatures.mock.calls[0][0].features).toBe('mock-features')

    expect(nyc.ready).toHaveBeenCalledTimes(1)
    expect(nyc.ready.mock.calls[0][0].get(0)).toBe(document.body)
  })
})

describe('handleButton', () => {
  let target
  const mockFinder = {}
  const mockFeature = {app: mockFinder}
  beforeEach(() => {
    mockFinder.zoomTo = jest.fn()
    mockFinder.directionsTo = jest.fn()
    target = $('<div></div>')
    target.data('feature', mockFeature)
    target = target.get(0)
    $('body').append(target)
  })
  afterEach(() => {
    $(target).remove()
  })

  test('handleButton', () => {
    expect.assertions(6)
    
    $(target).addClass('map')

    FinderApp.FEATURE_DECORATIONS.handleButton({currentTarget: target})

    expect(mockFinder.directionsTo).toHaveBeenCalledTimes(0)
    expect(mockFinder.zoomTo).toHaveBeenCalledTimes(1)
    expect(mockFinder.zoomTo.mock.calls[0][0]).toBe(mockFeature)

    $(target).removeClass('map')

    FinderApp.FEATURE_DECORATIONS.handleButton({currentTarget: target})

    expect(mockFinder.zoomTo).toHaveBeenCalledTimes(1)
    expect(mockFinder.directionsTo).toHaveBeenCalledTimes(1)
    expect(mockFinder.directionsTo.mock.calls[0][0]).toBe(mockFeature)
  })
})

describe('FEATURE_DECORATIONS', () => {
  let extendedDecorations
  beforeEach(() => {
    extendedDecorations = {app: {expandDetail: jest.fn()}}
    $.extend(extendedDecorations, FinderApp.FEATURE_DECORATIONS, {
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

  test('getName', () => {
    expect.assertions(1)
    expect(() => {
      FinderApp.FEATURE_DECORATIONS.getName()
    }).toThrow('A getName decoration must be provided')
  })

  test('getAddress1', () => {
    expect.assertions(1)
    expect(() => {
      FinderApp.FEATURE_DECORATIONS.getAddress1()
    }).toThrow('A getAddress1 decoration must be provided to use default html method')
  })

  test('getAddress2', () => {
    expect.assertions(1)
    expect(FinderApp.FEATURE_DECORATIONS.getAddress2()).toBe('')
  })

  test('getCityStateZip', () => {
    expect.assertions(1)
    expect(() => {
      FinderApp.FEATURE_DECORATIONS.getCityStateZip()
    }).toThrow('A getCityStateZip decoration must be provided to use default html method')
  })

  test('getPhone', () => {
    expect.assertions(1)
    expect(FinderApp.FEATURE_DECORATIONS.getPhone()).toBe(undefined)
  })

  test('getEmail', () => {
    expect.assertions(1)
    expect(FinderApp.FEATURE_DECORATIONS.getEmail()).toBe(undefined)
  })

  test('getWebsite', () => {
    expect.assertions(1)
    expect(FinderApp.FEATURE_DECORATIONS.getWebsite()).toBe(undefined)
  })

  test('cssClass', () => {
    expect.assertions(1)
    expect(FinderApp.FEATURE_DECORATIONS.cssClass()).toBe(undefined)
  })

  test('detailsHtml', () => {
    expect.assertions(1)
    expect(FinderApp.FEATURE_DECORATIONS.detailsHtml()).toBe(undefined)
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
      '<div class="addr"><div class="ln1">Address line 1</div><div class="ln2">Address line 2</div><div class="ln3">City, State Zip</div></div>'
    )
  })

  test('addressHtml no line 2', () => {
    expect.assertions(2)
    extendedDecorations.getAddress2 = () => {return ''}
    const html = extendedDecorations.addressHtml()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="addr"><div class="ln1">Address line 1</div><div class="ln3">City, State Zip</div></div>'
    )
  })

  test('getFullAddress', () => {
    expect.assertions(1)
    const html = extendedDecorations.addressHtml()
    expect(extendedDecorations.getFullAddress()).toBe(
      'Address line 1\nAddress line 2,\nCity, State Zip'
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

  test('sreen reader distanceHtml has distance in feet', () => {
    expect.assertions(2)
    extendedDecorations.getDistance = () => {return {distance: 1000, units: 'ft'}}
    const html = extendedDecorations.distanceHtml(true)
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="dist screen-reader-only">0.19 miles</div>'
    )
  })

  test('sreen reader distanceHtml has distance in meters', () => {
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
    expect.assertions(2)
    const html = extendedDecorations.html()
    expect(html.length).toBe(1)
    expect($('<div></div>').append(html).html()).toBe(
      '<div class="facility css-class"><h3 class="name notranslate">A Name</h3><div class="addr"><div class="ln1">Address line 1</div><div class="ln2">Address line 2</div><div class="ln3">City, State Zip</div></div><a class="btn rad-all phone btn-dark" role="button" href="tel:212-867-5309">212-867-5309</a><a class="btn rad-all email btn-dark" role="button" href="mailto:email@email.com">Email</a><a class="btn rad-all web btn-dark" target="blank" role="button" href="http://website">Website</a><button class="btn rad-all map btn-dark"><span class="screen-reader-only">Locate this facility on the </span>Map</button><button class="btn rad-all dir btn-dark">Directions</button><div class="dtl"><div class="clps rad-all"><button class="btn rad-all" aria-pressed="false" id="clsp-btn-1" aria-controls="clsp-pnl-1">Details</button><div class="content rad-bot" aria-expanded="false" aria-collapsed="true" aria-hidden="true" style="display: none;" id="clsp-pnl-1" aria-labelledby="clsp-btn-1"></div></div></div></div>'
    )
  })
})

  test('filter apply button focuses facilities', () => {
    expect.assertions(2)

    const finderApp = new FinderApp({
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    })

    finderApp.tabs.open = jest.fn()

    $('#filters button.screen-reader-only').trigger('click')

    expect(finderApp.tabs.open).toHaveBeenCalledTimes(1)
    expect(finderApp.tabs.open.mock.calls[0][0]).toBe('#facilities')
  })