import NycZoom from 'nyc/Zoom'
import Zoom from 'nyc/ol/Zoom'

class MockView {
  constructor(options) {
    this.zoom = options.zoom
  }
  getZoom() {
    return this.zoom
  }
}
class MockMap {
  constructor(options) {
    const target = options.target
    this.view = new MockView({zoom: 11})
    this.target = $(target).html('<div class="ol-overlaycontainer-stopevent"></div>')
      .get(0)
  }
  getTargetElement() {
    return this.target
  }
  getView() {
    return this.view
  }
}

let target
let mockMap
let tip

beforeEach(() => {
  target = $('<div></div>')
  $('body').append(target)
  mockMap = new MockMap({target: target})
  tip = $('<div class="f-tip"></div>')
  $('body').append(tip)
})

afterEach(() => {
  target.remove()
  tip.remove()
})

test('constructor', () => {
  expect.assertions(8)
  
  const zoom = new Zoom(mockMap)

  expect(zoom instanceof Zoom).toBe(true)
  expect(zoom instanceof NycZoom).toBe(true)
  expect(zoom.map).toBe(mockMap)
  expect(zoom.view instanceof MockView).toBe(true)
  expect(zoom.view).toBe(mockMap.getView())

  expect(zoom.getContainer().hasClass('zoom')).toBe(true)

  tip.show()
  expect(tip.css('display')).toBe('block')

  zoom.getContainer().trigger('click')

  expect(tip.css('display')).toBe('none')
})

test('zoom', () => {
  expect.assertions(5)

  const mockView = mockMap.getView()
  mockView.animate = jest.fn()

  const zoom = new Zoom(mockMap)

  const event = {
    target: $('.btn-z-in').get(0)
  }

  zoom.zoom(event)

  expect(mockView.getZoom()).toBe(11)
  expect(mockView.animate).toHaveBeenCalledTimes(1)
  expect(mockView.animate.mock.calls[0][0].zoom).toBe(12)

  event.target = zoom.getContainer().find('.btn-z-out').get(0)

  zoom.zoom(event)

  expect(mockView.animate).toHaveBeenCalledTimes(2)
  expect(mockView.animate.mock.calls[1][0].zoom).toBe(10)
})