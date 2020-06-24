import nyc from 'nyc'

import MapMgr from '../../../src/nyc/ol/MapMgr'
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

  Basemap.resetMocks()
  Filters.mockClear()
  LocationMgr.resetMocks()
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

test('constructor mouseWheelZoom is undefined', () => {
  expect.assertions(63)

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
  expect($('#map').length).toBe(1)
  expect(Basemap.mock.calls[0][0].target).toBe($('#map').get(0))

  expect(FilterAndSort).toHaveBeenCalledTimes(1)
  expect(FilterAndSort.mock.calls[0][0].url).toBe('http://facility')
  expect(FilterAndSort.mock.calls[0][0].format instanceof Decorate).toBe(true)
  expect(FilterAndSort.mock.calls[0][0].format.parentFormat).toBe(format);
  expect(FilterAndSort.mock.calls[0][0].format.decoration).toBe(FinderApp.DEFAULT_DECORATIONS);

  expect(OlLayerVector).toHaveBeenCalledTimes(2)
  expect(OlLayerVector.mock.calls[0][0].source).toBe(finderApp.source)
  expect(OlLayerVector.mock.calls[0][0].style).toBe(style)

  expect(OlLayerVector.mock.calls[1][0].source).toBe(finderApp.highlightSource)

  expect(finderApp.map.addLayer).toHaveBeenCalledTimes(2)
  expect(finderApp.map.addLayer.mock.calls[0][0]).toBe(finderApp.layer)
  expect(finderApp.map.addLayer.mock.calls[1][0]).toBe(finderApp.highlightLayer)

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

  expect(FeatureTip.mock.calls[0][0].tips[0].label({getTip: () => {return 'Fred'}}).html).toBe('Fred')

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

  expect(Dialog).toHaveBeenCalledTimes(3)
  expect(Dialog.mock.calls[2][0]).toEqual({css: 'screen-reader-info'})
  expect(Dialog.mock.calls[1][0]).toEqual({css: 'shw-lst'})
  expect(Dialog.mock.calls[0][0]).toEqual({css: 'splash'})
  expect(Dialog.mock.instances[0].ok.mock.calls.length).toBe(0)
  expect(Dialog.mock.instances[0].yesNo.mock.calls[0][0].message).toBe('splash page message')
  expect(Dialog.mock.instances[0].yesNo.mock.calls[0][0].buttonText[0]).toBe('<span class="msg-sr-info">Screen reader instructions</span>')
  expect(Dialog.mock.instances[0].yesNo.mock.calls[0][0].buttonText[1]).toBe('<span class="msg-continue">Continue</span>')

  expect(Share).toHaveBeenCalledTimes(1)
  expect(Share.mock.calls[0][0].target).toBe('#map')

  expect(Goog).toHaveBeenCalledTimes(1),
  expect(Goog.mock.calls[0][0].target).toBe('#map')
  expect(Goog.mock.calls[0][0].languages).toBe(Translate.DEFAULT_LANGUAGES)
  expect(Goog.mock.calls[0][0].button).toBe(true)
})

test('constructor mouseWheelZoom = false', () => {
  expect.assertions(63)

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
    mouseWheelZoom: false
  })

  expect(finderApp.pager instanceof ListPager).toBe(true)
  expect(finderApp.pager.getContainer().length).toBe(1)
  expect(finderApp.pager.getContainer().get(0)).toBe($('#facilities div[role="region"]').get(0))

  expect(Basemap).toHaveBeenCalledTimes(1)
  expect($('#map').length).toBe(1)
  expect(Basemap.mock.calls[0][0].target).toBe($('#map').get(0))

  expect(FilterAndSort).toHaveBeenCalledTimes(1)
  expect(FilterAndSort.mock.calls[0][0].url).toBe('http://facility')
  expect(FilterAndSort.mock.calls[0][0].format instanceof Decorate).toBe(true)
  expect(FilterAndSort.mock.calls[0][0].format.parentFormat).toBe(format);
  expect(FilterAndSort.mock.calls[0][0].format.decoration).toBe(FinderApp.DEFAULT_DECORATIONS);

  expect(OlLayerVector).toHaveBeenCalledTimes(2)
  expect(OlLayerVector.mock.calls[0][0].source).toBe(finderApp.source)
  expect(OlLayerVector.mock.calls[0][0].style).toBe(style)

  expect(OlLayerVector.mock.calls[1][0].source).toBe(finderApp.highlightSource)

  expect(finderApp.map.addLayer).toHaveBeenCalledTimes(2)
  expect(finderApp.map.addLayer.mock.calls[0][0]).toBe(finderApp.layer)

  expect(finderApp.map.addLayer.mock.calls[1][0]).toBe(finderApp.highlightLayer)

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

  expect(FeatureTip.mock.calls[0][0].tips[0].label({getTip: () => {return 'Fred'}}).html).toBe('Fred')

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

  expect(Dialog).toHaveBeenCalledTimes(3)
  expect(Dialog.mock.calls[2][0]).toEqual({css: 'screen-reader-info'})
  expect(Dialog.mock.calls[1][0]).toEqual({css: 'shw-lst'})
  expect(Dialog.mock.calls[0][0]).toEqual({css: 'splash'})
  expect(Dialog.mock.instances[0].ok.mock.calls.length).toBe(0)
  expect(Dialog.mock.instances[0].yesNo.mock.calls[0][0].message).toBe('splash page message')
  expect(Dialog.mock.instances[0].yesNo.mock.calls[0][0].buttonText[0]).toBe('<span class="msg-sr-info">Screen reader instructions</span>')
  expect(Dialog.mock.instances[0].yesNo.mock.calls[0][0].buttonText[1]).toBe('<span class="msg-continue">Continue</span>')

  expect(Share).toHaveBeenCalledTimes(1)
  expect(Share.mock.calls[0][0].target).toBe('#map')

  expect(Goog).toHaveBeenCalledTimes(1)
  expect(Goog.mock.calls[0][0].target).toBe('#map')
  expect(Goog.mock.calls[0][0].languages).toBe(Translate.DEFAULT_LANGUAGES)
  expect(Goog.mock.calls[0][0].button).toBe(true)
})

describe('reload button', () => {
  const reload = document.location.reload
  beforeEach(() => {
    document.location.reload = jest.fn()
  })
  afterEach(() => {
    document.location.reload = reload
  })

  test('reload button', () => {
    expect.assertions(1)

    new FinderApp({
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

    $('.fnd #home').trigger('click')
    expect(document.location.reload).toHaveBeenCalledTimes(1)
  })
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
  expect.assertions(20)
  
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
    directionsUrl: 'http://directions',
    defaultDirectionsMode: 'WALKING'
  })

  finderApp.directionsTo(feature)

  expect(Directions).toHaveBeenCalledTimes(1)
  expect(Directions.mock.calls[0][0].url).toBe('http://directions')
  expect(Directions.mock.calls[0][0].toggle).toBe('#tabs')
  expect(Directions.mock.calls[0][0].mode).toBe('WALKING')

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
  expect.assertions(11)
  
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
  
  expect(Dialog).toHaveBeenCalledTimes(3)
  expect(Dialog.mock.calls[0][0]).toEqual({css: 'shw-lst'})
  expect(Dialog.mock.calls[1][0]).toEqual({css: 'screen-reader-info'})
  expect(Dialog.mock.calls[2][0]).toEqual({css: 'splash'})
  expect(Dialog.mock.instances[2].ok.mock.calls.length).toBe(0)
  expect(Dialog.mock.instances[2].yesNo.mock.calls[0][0].message).toBe('splash page message')
  expect(Dialog.mock.instances[2].yesNo.mock.calls[0][0].buttonText[0]).toBe('<span class="msg-sr-info">Screen reader instructions</span>')
  expect(Dialog.mock.instances[2].yesNo.mock.calls[0][0].buttonText[1]).toBe('<span class="msg-continue">Continue</span>')

  return test().then(success => {expect(success).toBe(true)})
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
    expect(finderApp.tabs.open.mock.calls[0][0]).toBe('#facilities')
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
    finderApp.isMobile = () => {return false}

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

    finderApp.isMobile = () => {return true}
    
    $('#map').width(500)
    $('#map').height(400)
    
    finderApp.tabChange()
  
    expect($('#map').attr('aria-hidden')).toBe('true')
    expect(finderApp.map.setSize).toHaveBeenCalledTimes(3)
    expect(finderApp.map.setSize.mock.calls[2][0]).toEqual([500, 400])
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

    finderApp.isMobile = () => {return false}
    
    $('#map').width(400)
    $('#map').height(500)

    finderApp.tabChange()
  
    expect($('#map').attr('aria-hidden')).toBe('false')
    expect(finderApp.map.setSize).toHaveBeenCalledTimes(3)
    expect(finderApp.map.setSize.mock.calls[2][0]).toEqual([400, 500])
  })
})

describe('located', () => {
  const focusFacilities = FinderApp.prototype.focusFacilities
  const resetList = FinderApp.prototype.resetList

  beforeEach(() => {
    FinderApp.prototype.focusFacilities = jest.fn()
    FinderApp.prototype.resetList = jest.fn()
  })
  afterEach(() => {
    FinderApp.prototype.focusFacilities = focusFacilities
    FinderApp.prototype.resetList = resetList
  })
  test('located', () => {
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
  
    finderApp.located('mock-location')

    expect(finderApp.location).toBe('mock-location')
    expect(finderApp.resetList).toHaveBeenCalledTimes(1)
  
    expect(finderApp.focusFacilities).toHaveBeenCalledTimes(1)
  })
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

test('createParentFormat', () => {
  expect.assertions(2)

  const fmt1 = {parentFormat: 'mock-format'}
  const fmt2 = {}

  const options = {
    title: 'Finder App',
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: fmt1,
    facilityStyle: style,
    filterTabTitle: 'Filter Title',
    filterChoiceOptions: filterChoiceOptions,
    geoclientUrl: 'http://geoclient'
  }

  const finderApp = new FinderApp(options)

  expect(finderApp.createParentFormat(options)).toBe('mock-format')  

  options.facilityFormat = fmt2

  expect(finderApp.createParentFormat(options)).toBe(fmt2)  
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

  $('#filters button.apply').trigger('click')

  expect(finderApp.tabs.open).toHaveBeenCalledTimes(1)
  expect(finderApp.tabs.open.mock.calls[0][0]).toBe('#facilities')
})

describe('createDecorations', () => {
  let options
  beforeEach(() => {
    options = {
      title: 'Finder App',
      facilityTabTitle: 'Facility Title',
      facilityUrl: 'http://facility',
      facilityFormat: format,
      facilityStyle: style,
      filterTabTitle: 'Filter Title',
      filterChoiceOptions: filterChoiceOptions,
      geoclientUrl: 'http://geoclient'
    }
  })

  test('createDecorations none provided', () => {
    expect.assertions(3)

    const finderApp = new FinderApp(options)

    const decorations = finderApp.createDecorations(options)

    expect(decorations.length).toBe(2)
    expect(decorations[0]).toBe(MapMgr.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
  })

  test('createDecorations provided with parentFormat', () => {
    expect.assertions(4)

    const finderApp = new FinderApp(options)

    options.facilityFormat = {parentFormat: {decorations: 'mock-decorations-0'}}

    const decorations = finderApp.createDecorations(options)

    expect(decorations.length).toBe(3)
    expect(decorations[0]).toBe(MapMgr.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
    expect(decorations[2]).toBe('mock-decorations-0')
  })

  test('createDecorations provided with parentFormat and format', () => {
    expect.assertions(5)

    const finderApp = new FinderApp(options)

    options.facilityFormat = {parentFormat: {decorations: 'mock-decorations-0'}, decorations: 'mock-decorations-1'}

    const decorations = finderApp.createDecorations(options)

    expect(decorations.length).toBe(4)
    expect(decorations[0]).toBe(MapMgr.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
    expect(decorations[2]).toBe('mock-decorations-0')
    expect(decorations[3]).toBe('mock-decorations-1')
  })

  test('createDecorations provided with parentFormat and format and option', () => {
    expect.assertions(6)

    const finderApp = new FinderApp(options)

    options.facilityFormat = {parentFormat: {decorations: 'mock-decorations-0'}, decorations: 'mock-decorations-1'}
    options.decorations = 'mock-decorations-2'

    const decorations = finderApp.createDecorations(options)

    expect(decorations.length).toBe(5)
    expect(decorations[0]).toBe(MapMgr.FEATURE_DECORATIONS)
    expect(decorations[1]).toEqual({app: finderApp})
    expect(decorations[2]).toBe('mock-decorations-0')
    expect(decorations[3]).toBe('mock-decorations-1')
    expect(decorations[4]).toBe('mock-decorations-2')
  })
})

describe('mobile tests', () => {
  const finderOptions = {
    title: 'Finder App',
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: format,
    facilityStyle: style,
    filterTabTitle: 'Filter Title',
    filterChoiceOptions: filterChoiceOptions,
    geoclientUrl: 'http://geoclient'
  }
  const buttonText = [
    `<span class="msg-vw-list">View ${$('#tab-btn-1').text()} list</span>`,
    '<span class="msg-vw-map">View the map</span>'
  ]
  let feature, features

  beforeEach(() => {
    feature = new OlFeature({geometry: new OlGeomPoint([0, 1])})
    feature.getName = () => {
      return 'feature name'
    }
    feature.getFullAddress = () => {
      return 'feature address'
    }
    feature.distanceHtml = () => {
      return $('<div>distance</div>')
    }
    features = [feature]
    FilterAndSort.features = features
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('mobileDiaOpts - user location', () => {
    const finderApp = new FinderApp(finderOptions)
    finderApp.location = {
      name: 'user location',
      type: 'geolocated',
      coordinate: [1, 0]
    }
    const options = {
      buttonText: buttonText,
      message: `<strong>${feature.getName()}</strong><br>` +
      '<span class="msg-closest">is closest to your location</span><br>'
    }
    
    expect(finderApp.mobileDiaOpts()).toEqual(options)
  })
  test('mobileDiaOpts - finder location == location', () => {
    const finderApp = new FinderApp(finderOptions)
    finderApp.location = {
      name: 'feature name'
    }
    const options = {
      buttonText: buttonText,
      message: `<strong>${finderApp.location.name}</strong>`
    }
    
    expect(finderApp.mobileDiaOpts()).toEqual(options)
  })
  test('mobileDiaOpts - user searches for location', () => {
    const finderApp = new FinderApp(finderOptions)
    finderApp.location = {
      name: 'user location',
      type: 'located',
      coordinate: [1, 0]
    }
    const options = {
      buttonText: buttonText,
      message: `<strong>${feature.getName()}</strong><br>` +
        '<span class="msg-closest">is closest to your location</span><br>' +
        `<strong>${finderApp.location.name}</strong>`
    }
    expect(finderApp.mobileDiaOpts()).toEqual(options)
  })
})