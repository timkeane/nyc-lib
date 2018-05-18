import Dialog from '../../../src/nyc/Dialog'
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

import OlLayerVector from 'ol/layer/vector'
import OlStyleStyle from 'ol/style/style'

import FinderApp from 'nyc/ol/FinderApp'

jest.mock('../../../src/nyc/Dialog')
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

jest.mock('ol/layer/vector')
jest.mock('ol/style/style')

const format = new CsvPoint({})
const style = new OlStyleStyle({})
const filterChoiceOptions = []
beforeEach(() => {
  Dialog.mockClear()
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
})

test('constructor', () => {
  expect.assertions(60)

  const finderApp = new FinderApp({
    title: 'Finder App',
    splashContent: 'splash page message',
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
  expect(finderApp.pager.getContainer().get(0)).toBe($('#facilities').get(0))

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
  expect(finderApp.locationMgr.on.mock.calls[0][0]).toBe('geocode')
  expect(finderApp.locationMgr.on.mock.calls[0][1]).toBe(finderApp.located)
  expect(finderApp.locationMgr.on.mock.calls[0][2]).toBe(finderApp)
  expect(finderApp.locationMgr.on.mock.calls[1][0]).toBe('geolocate')
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
  expect(Dialog.mock.instances[0].ok.mock.calls[0][0].buttonText[0]).toBe('Continue...')

  expect(Share).toHaveBeenCalledTimes(1)
  expect(Share.mock.calls[0][0].target).toBe('#map')

  expect(Goog).toHaveBeenCalledTimes(1)
  expect(Goog.mock.calls[0][0].target).toBe('#map')
  expect(Goog.mock.calls[0][0].languages).toBe(Translate.DEFAULT_LANGUAGES)
  expect(Goog.mock.calls[0][0].button).toBe(true)
})
