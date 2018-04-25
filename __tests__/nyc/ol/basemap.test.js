import OlMap from 'ol/map'
import Basemap from 'nyc/ol/Basemap'
import $ from 'jQuery'

let target
beforeEach(() => {
  target = $('<div id="map"></div>')
  $('body').append(target)
})

afterEach(() => {
  target.remove()
})

test('constructor', () => {
  const basemap = new Basemap({target: 'map'})
  expect(basemap instanceof OlMap).toBe(true)
  expect(basemap instanceof Basemap).toBe(true)
})
