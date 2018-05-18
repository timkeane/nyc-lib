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
  expect.assertions(25)

  const finderApp = new FinderApp({
    title: 'Finder App',
    splashContent: 'splash page message',
    facilityTabTitle: 'Facility Title',
    facilityUrl: 'http://facility',
    facilityFormat: format,
    facilityStyle: style,
    filterTabTitle: 'Filter Title',
    filterChoiceOptions: [],
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
})
