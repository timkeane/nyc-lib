import Geolocate from 'nyc/Geolocate'
import Container from 'nyc/Container'

let container
beforeEach(() => {
  container = $('<div id="map"></div>')
  $('body').append(container)
})

afterEach(() => {
  container.remove()
})

test('constructor', () => {
  expect.assertions(4)

  const geolocate = new Geolocate(container)
  expect(geolocate instanceof Container).toBe(true)
  expect(geolocate instanceof Geolocate).toBe(true)
  expect(geolocate.getContainer().html()).toBe($(Geolocate.HTML).html())
  expect(geolocate.getContainer().hasClass('geoloc')).toBe(true)
})

test('geolocated', () => {
  expect.assertions(1)

  const handler = jest.fn()

  const geolocate = new Geolocate(container)

  geolocate.on('geolocate', handler)

  geolocate.find('button').trigger('click')

  expect(handler).toHaveBeenCalledTimes(1)
})
