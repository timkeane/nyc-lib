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
  expect.assertions(4)

  const zoom = new Zoom(container)
  expect(zoom instanceof Container).toBe(true)
  expect(zoom instanceof Zoom).toBe(true)
  expect(zoom.getContainer().hasClass('zoom')).toBe(true)
  expect(zoom.getContainer().html()).toBe('<button class="btn-z-in btn-sq rad-all" data-msg-key="msg-z-in" data-msg-attr="title" data-zoom-incr="1" title="Zoom in"><span class="screen-reader-only msg-z-in">Zoom in</span><span class="fas fa-plus" role="img"></span></button><button class="btn-z-out btn-sq rad-all" data-msg-key="msg-z-out" data-msg-attr="title" data-zoom-incr="-1" title="Zoom out"><span class="screen-reader-only msg-z-out">Zoom out</span><span class="fas fa-minus" role="img"></span></button>')
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
