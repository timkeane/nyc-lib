import $ from 'jquery'
import NycGeolocate from 'nyc/Geolocate'
import Geolocate from 'nyc/ol/Geolocate'

let map
let div
let tip
beforeEach(() => {
  div = $('<div id="map"></div>')
  tip = $('<div class="f-tip"></div>')
  $('body').append(div.append(tip))
  map = {
    getTargetElement: () => {
      return div.get(0)
    }
  }
})

afterEach(() => {
  div.remove()
  map = undefined
})

test('constructor', () => {
  expect.assertions(2)

  const geolocate = new Geolocate(map)
  expect(geolocate instanceof NycGeolocate).toBe(true)
  expect(geolocate instanceof Geolocate).toBe(true)
})

test('container click dblclick mouseover mousemove', () => {
  expect.assertions(8)

  const container = new Geolocate(map).getContainer()

  tip.show()
  expect(tip.css('display')).toBe('block')
  container.trigger('click')
  expect(tip.css('display')).toBe('none')

  tip.show()
  expect(tip.css('display')).toBe('block')
  container.trigger('dblclick')
  expect(tip.css('display')).toBe('none')

  tip.show()
  expect(tip.css('display')).toBe('block')
  container.trigger('mouseover')
  expect(tip.css('display')).toBe('none')

  tip.show()
  expect(tip.css('display')).toBe('block')
  container.trigger('mousemove')
  expect(tip.css('display')).toBe('none')

})
