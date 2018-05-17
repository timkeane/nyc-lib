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

import FinderApp from 'nyc/ol/FinderApp'

jest.mock('../../../src/nyc/Dialog')
jest.mock('../../../src/nyc/Share')
jest.mock('../../../src/nyc/Tabs')
jest.mock('../../../src/nyc/ListPager')
jest.mock('../../../src/nyc/MapLocator')

jest.mock('../../../src/nyc/lang/Translate')
jest.mock('../../../src/nyc/lang/Goog')

jest.mock('../../../src/nyc/ol/Basemap')
jest.mock('../../../src/nyc/ol/Filters')
jest.mock('../../../src/nyc/ol/LocationMgr')
jest.mock('../../../src/nyc/ol/MultiFeaturePopup')
jest.mock('../../../src/nyc/ol/FeatureTip')

jest.mock('../../../src/nyc/ol/format/CsvPoint')
jest.mock('../../../src/nyc/ol/format/Decorate')

jest.mock('../../../src/nyc/ol/source/FilterAndSort')

jest.mock('ol/layer/vector')

beforeEach(() => {
  CsvPoint.mockClear()
  ListPager.mockClear()
  Dialog.mockClear() '../../../src/nyc/Dialog'
  Share.mockClear() '../../../src/nyc/Share'
  import Tabs.mockClear() '../../../src/nyc/Tabs'
  ListPager.mockClear() '../../../src/nyc/ListPager'
  MapLocator.mockClear() '../../../src/nyc/MapLocator'

  Translate.mockClear() '../../../src/nyc/lang/Translate'
  Goog.mockClear() '../../../src/nyc/lang/Goog'

  Basemap.mockClear() '../../../src/nyc/ol/Basemap'
  Filters.mockClear() '../../../src/nyc/ol/Filters'
  LocationMgr.mockClear() '../../../src/nyc/ol/LocationMgr'
  MultiFeaturePopup.mockClear() '../../../src/nyc/ol/MultiFeaturePopup'
  FeatureTip.mockClear() '../../../src/nyc/ol/FeatureTip'

  CsvPoint.mockClear() '../../../src/nyc/ol/format/CsvPoint'
  Decorate.mockClear() '../../../src/nyc/ol/format/Decorate'

  FilterAndSort.mockClear() '../../../src/nyc/ol/source/FilterAndSort'

  OlLayerVector from 'ol/layer/vector'
})

test('constructor', () => {
  expect.assertions(0)

  const csv = new CsvPoint({})

  console.warn(CsvPoint);
  console.warn(CsvPoint.mock);

  const pager = new ListPager({})

  console.warn(ListPager);
  console.warn(ListPager.mock);
})
