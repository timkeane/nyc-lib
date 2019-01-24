import Zoom from 'nyc/Zoom'
import Container from 'nyc/Container'
import AutoComplete from 'nyc/AutoComplete'

let container
beforeEach(() => {
  container = $('<div id="map"></div>')
  $('body').append(container)
})

afterEach(() => {
  container.remove()
})

test('constructor', () => {
  expect.assertions(3)

  const zoom = new Zoom(container)
  expect(zoom instanceof Container).toBe(true)
  expect(zoom instanceof Zoom).toBe(true)
  expect(zoom.getContainer().hasClass('zoom')).toBe(true)
})

test('abstract method zoom', () => {
  expect.assertions(1)

  const zoom = new Zoom(container)
  expect(() => {zoom.zoom('event')}).toThrow('Not implemented')
})

describe('click events', () => {
  const zoomOrig = Zoom.prototype.zoom
  beforeEach(() =>{
    Zoom.prototype.zoom = jest.fn()
  })
  afterEach(() =>{
    Zoom.prototype.zoom = zoomOrig
  })
  
  test('click events', () => {
    expect.assertions(4)
  
    const zoom = new Zoom(container)
  
    zoom.find('.btn-z-in').trigger('click')
  
    expect(zoom.zoom).toHaveBeenCalledTimes(1)
    expect(zoom.zoom.mock.calls[0][0].target).toBe(zoom.find('.btn-z-in').get(0))

    zoom.find('.btn-z-out').trigger('click')
  
    expect(zoom.zoom).toHaveBeenCalledTimes(2)
    expect(zoom.zoom.mock.calls[1][0].target).toBe(zoom.find('.btn-z-out').get(0))
  })
})
