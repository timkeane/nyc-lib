import MapMgr from 'nyc/ol/MapMgr'
import FrameworkMap from 'nyc/ol/FrameworkMap'

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
  mapTarget = $('<div id="map"></div>')
  $('body').append(mapTarget)
})
afterEach(() => {
  mapTarget.remove()
})

describe('constructor', () => {
  test('constructor no optional params', () => {
    expect.assertions(2)
    const frameworkMap = new FrameworkMap(options)
    expect(frameworkMap instanceof MapMgr).toBe(true)
    expect(frameworkMap instanceof FrameworkMap).toBe(true)
  })
})