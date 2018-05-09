import $ from 'jquery'

import OlMap from 'ol/map'
import OlView from 'ol/view'
import OlOverlay from 'ol/overlay'

import Popup from 'nyc/ol/Popup'

let map
let tip
let target
beforeEach(() => {
  tip = $('<div class="f-tip"></div>')
  $('body').append(tip)
  target = $('<div></div>').css({width: '500px', height: '500px'})
  $('body').append(target)
  map = new OlMap({
    target: target.get(0),
    view: new OlView({
      center: [0, 0],
      zoom: 0
    })
  })
})
afterEach(() => {
  target.remove()
  tip.remove()
})

describe('constructor and events', () => {
  const hide = Popup.prototype.hide
  const hideTip = Popup.prototype.hideTip
  beforeEach(() => {
    Popup.prototype.hide = jest.fn()
    Popup.prototype.hideTip = jest.fn()
  })
  afterEach(() => {
    Popup.prototype.hide = hide
    Popup.prototype.hideTip = hideTip
  })

  test('constructor and events', () => {
    const popup = new Popup({map: map})

    expect(popup instanceof OlOverlay).toBe(true)
    expect(popup instanceof Popup).toBe(true)
    expect(popup.getId()).toBe('Popup-0')
    expect(popup.popup.html()).toBe($(Popup.HTML).html())
    expect(popup.getElement()).toBe(popup.popup.get(0))
    expect(popup.margin).toEqual([10, 10, 10, 10])

    popup.popup.find('.btn-x').trigger('click')
    popup.popup.find('.btn-x').trigger('tap')
    popup.popup.trigger('mouseover')
    popup.popup.trigger('mousemove')

    expect(Popup.prototype.hide).toHaveBeenCalledTimes(2)
    expect(Popup.prototype.hideTip).toHaveBeenCalledTimes(2)
  })
})

test('show with html', () => {
  const popup = new Popup({map: map})

  popup.setPosition = jest.fn()
  popup.pan = jest.fn()
  popup.map.getPixelFromCoordinate = jest.fn()

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          popup.popup.css('display') === 'block' &&
          $('.f-tip').css('display') === 'none'
        )
      }, 600)
    })
  }

  popup.show({
    html: 'popup content',
    coordinate: [1, 1]
  })

  expect(popup.content.html()).toBe('popup content')
  expect(popup.pan).toHaveBeenCalledTimes(1)
  expect(popup.setPosition).toHaveBeenCalledTimes(1)
  expect(popup.setPosition.mock.calls[0][0]).toEqual([1, 1])

  return test().then(passed => expect(passed).toBe(true))
})

test('show without html', () => {
  const popup = new Popup({map: map})

  popup.setPosition = jest.fn()
  popup.pan = jest.fn()
  popup.map.getPixelFromCoordinate = jest.fn()

  popup.content.html('pre-existing')

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          popup.popup.css('display') === 'block' &&
          $('.f-tip').css('display') === 'none'
        )
      }, 600)
    })
  }

  popup.show({
    coordinate: [1, 1]
  })

  expect(popup.content.html()).toBe('pre-existing')
  expect(popup.pan).toHaveBeenCalledTimes(1)
  expect(popup.setPosition).toHaveBeenCalledTimes(1)
  expect(popup.setPosition.mock.calls[0][0]).toEqual([1, 1])

  return test().then(passed => expect(passed).toBe(true))
})

test('hide', () => {
  const popup = new Popup({map: map})

  popup.popup.show()

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          popup.popup.css('display') === 'none'
        )
      }, 500)
    })
  }

  popup.hide()

  return test().then(passed => expect(passed).toBe(true))
})

test('hideTip', () => {
  const event = {
      stopPropagation: jest.fn()
  }

  const popup = new Popup({map: map})

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          tip.css('display') === 'none'
        )
      }, 500)
    })
  }

  popup.hideTip(event)

  expect(event.stopPropagation).toHaveBeenCalledTimes(1)

  return test().then(passed => expect(passed).toBe(true))
})

describe('pan', () => {
  const getOffset = OlOverlay.prototype.getOffset
  beforeEach(() => {
    OlOverlay.prototype.getOffset = jest.fn()
    OlOverlay.prototype.getOffset.mockReturnValue([0, 0])
  })
  afterEach(() => {
    OlOverlay.prototype.getOffset = getOffset
  })

  test('pan fromTop < 0 and fromRight < 0', () => {
    const css = {
      bottom: '10px',
      left: '100px',
      width: '300px',
      height: '300px'
    }

    const popup = new Popup({map: map})

    popup.setPosition([0, 0])
    popup.content.html('some content')

    popup.map.getPixelFromCoordinate = jest.fn()
    popup.map.getPixelFromCoordinate
      .mockReturnValueOnce([400, 50])
      .mockReturnValueOnce([250, 250])
    popup.map.getSize = jest.fn()
    popup.map.getSize.mockReturnValue([500, 500])

    popup.popup.css(css)
    popup.popup.show()

    popup.pan()

    popup.popup.hide()

    popup.pan()
  })

  test('pan fromTop > 0 and fromBottom < 0 and fromRight > 0 and fromLeft < 0', () => {
    const css = {
      bottom: '10px',
      left: '100px',
      width: '300px',
      height: '300px'
    }

    const popup = new Popup({map: map})

    popup.setPosition([0, 0])
    popup.content.html('some content')

    popup.map.getPixelFromCoordinate = jest.fn()
    popup.map.getPixelFromCoordinate
      .mockReturnValueOnce([-100, 495])
      .mockReturnValueOnce([250, 250])
    popup.map.getSize = jest.fn()
    popup.map.getSize.mockReturnValue([500, 500])

    popup.popup.css(css)
    popup.popup.show()

    popup.pan()

    popup.popup.hide()

    popup.pan()
  })

  test('pan fromTop > 0 and fromBottom = 0 and fromRight > 0 and fromLeft = 0', () => {
    const css = {
      bottom: '10px',
      left: '100px',
      width: '300px',
      height: '300px'
    }

    const popup = new Popup({map: map})

    popup.setPosition([0, 0])
    popup.content.html('some content')

    popup.map.getPixelFromCoordinate = jest.fn()
    popup.map.getPixelFromCoordinate
      .mockReturnValueOnce([-90, 480])
      .mockReturnValueOnce([250, 250])
    popup.map.getSize = jest.fn()
    popup.map.getSize.mockReturnValue([500, 500])

    popup.popup.css(css)
    popup.popup.show()

    popup.pan()

    popup.popup.hide()

    popup.pan()
  })
})
