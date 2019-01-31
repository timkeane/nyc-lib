import MapMgr from 'nyc/ol/MapMgr'
import FrameworkMap from 'nyc/ol/FrameworkMap'
import Basemap from 'nyc/ol/Basemap'
import LocationMgr from 'nyc/ol/LocationMgr'
import FilterAndSort from 'nyc/ol/source/FilterAndSort'
import Layer from 'ol/layer/Vector'
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom'

import Search from '../../../src/nyc/ol/Search'

jest.mock('../../../src/nyc/ol/Search')

const options = {
  facilityUrl: 'facility-url',
  geoclientUrl: 'geoclient-url',
  mapTarget: '#map',
  searchTarget: undefined,
  listTarget: undefined,
  facilityType: undefined,
  iconUrl: undefined,
  facilityStyle: undefined,
  facilitySearch: true,
  mouseWheelZoom: false
}

let mapTarget
beforeEach(() => {
  Search.mockReset()
  mapTarget = $('<div id="map"></div>')
  $('body').append(mapTarget)
})
afterEach(() => {
  mapTarget.remove()
})

describe('constructor', () => {
  test('constructor no optional params', () => {
    expect.assertions(17)

    const frameworkMap = new FrameworkMap(options)

    expect(frameworkMap instanceof MapMgr).toBe(true)
    expect(frameworkMap instanceof FrameworkMap).toBe(true)
    
    expect(frameworkMap.map instanceof Basemap).toBe(true)
    expect(frameworkMap.map.getInteractions().getArray().length).toBe(6)

    frameworkMap.map.getInteractions().forEach(i => {
      expect(i instanceof MouseWheelZoom).toBe(false)
    })

    expect(frameworkMap.source instanceof FilterAndSort).toBe(true)
    expect(frameworkMap.layer instanceof Layer).toBe(true)
    expect(frameworkMap.locationMgr instanceof LocationMgr).toBe(true)
    expect(Search).toHaveBeenCalledTimes(1)
    expect(mapTarget.find('.ol-overlaycontainer-stopevent').length).toBe(1)
    expect(Search.mock.calls[0][0].get(0)).toBe(mapTarget.find('.ol-overlaycontainer-stopevent').get(0))
    expect(frameworkMap.pager).toBeUndefined()
  })

  test('constructor with iconUrl params', () => {
    expect.assertions(17)
  })
  test('constructor all optional params', () => {
    expect.assertions(17)

    options.searchTarget = '#search'
    options.listTarget = '#list'
    options.facilityType = 'Cool Places'
    options.iconUrl = 'icon.png'
    options.facilityStyle = undefined
    options.facilitySearch = false
    options.mouseWheelZoom = true

    const frameworkMap = new FrameworkMap(options)

    expect(frameworkMap instanceof MapMgr).toBe(true)
    expect(frameworkMap instanceof FrameworkMap).toBe(true)

    expect(frameworkMap.map instanceof Basemap).toBe(true)
    expect(frameworkMap.map.getInteractions().getArray().length).toBe(6)

    frameworkMap.map.getInteractions().forEach(i => {
      expect(i instanceof MouseWheelZoom).toBe(false)
    })

    expect(frameworkMap.source instanceof FilterAndSort).toBe(true)
    expect(frameworkMap.layer instanceof Layer).toBe(true)
    expect(frameworkMap.locationMgr instanceof LocationMgr).toBe(true)
    expect(Search).toHaveBeenCalledTimes(1)
    expect(mapTarget.find('.ol-overlaycontainer-stopevent').length).toBe(1)
    expect(Search.mock.calls[0][0].get(0)).toBe(mapTarget.find('.ol-overlaycontainer-stopevent').get(0))
    expect(frameworkMap.pager).toBeUndefined()
  })
})

