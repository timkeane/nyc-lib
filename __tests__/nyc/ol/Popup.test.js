import $ from 'jquery'

import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlOverlay from 'ol/Overlay'

import Popup from 'nyc/ol/Popup'

let map
let tip
let target
beforeEach(() => {
  $.resetMocks()
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
    expect.assertions(8)

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
  expect.assertions(10)

  const popup = new Popup({map: map})

  popup.setPosition = jest.fn()
  popup.pan = jest.fn()
  popup.map.getPixelFromCoordinate = jest.fn()

  popup.show({
    html: 'popup content',
    coordinate: [1, 1]
  })

  expect(popup.popup.css('display')).toBe('block')
  expect($.mocks.fadeIn).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeIn.mock.instances[0].get(0)).toBe(popup.getElement())

  expect($('.f-tip').css('display')).toBe('none')
  expect($.mocks.fadeOut).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeOut.mock.instances[0].get(0)).toBe($('.f-tip').get(0))

  expect(popup.content.html()).toBe('popup content')
  expect(popup.pan).toHaveBeenCalledTimes(1)
  expect(popup.setPosition).toHaveBeenCalledTimes(1)
  expect(popup.setPosition.mock.calls[0][0]).toEqual([1, 1])
})

test('show without html', () => {
  expect.assertions(10)
  
  const popup = new Popup({map: map})

  popup.setPosition = jest.fn()
  popup.pan = jest.fn()
  popup.map.getPixelFromCoordinate = jest.fn()

  popup.content.html('pre-existing')

  popup.show({coordinate: [1, 1]})

  expect(popup.popup.css('display')).toBe('block')
  expect($.mocks.fadeIn).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeIn.mock.instances[0].get(0)).toBe(popup.getElement())

  expect($('.f-tip').css('display')).toBe('none')
  expect($.mocks.fadeOut).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeOut.mock.instances[0].get(0)).toBe($('.f-tip').get(0))

  expect(popup.content.html()).toBe('pre-existing')
  expect(popup.pan).toHaveBeenCalledTimes(1)
  expect(popup.setPosition).toHaveBeenCalledTimes(1)
  expect(popup.setPosition.mock.calls[0][0]).toEqual([1, 1])
})

test('hide', () => {
  expect.assertions(3)
  
  const popup = new Popup({map: map})

  popup.popup.show()

  popup.hide()

  expect(popup.popup.css('display')).toBe('none')
  expect($.mocks.fadeOut).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeOut.mock.instances[0].get(0)).toBe(popup.getElement())
})

test('hideTip', () => {
  expect.assertions(4)

  const event = {
      stopPropagation: jest.fn()
  }

  const popup = new Popup({map: map})

  popup.hideTip(event)

  expect(event.stopPropagation).toHaveBeenCalledTimes(1)

  expect($('.f-tip').css('display')).toBe('none')
  expect($.mocks.fadeOut).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeOut.mock.instances[0].get(0)).toBe($('.f-tip').get(0))
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
    expect.assertions(0)

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
    expect.assertions(0)

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

    popup.fullscreen = () => {return true}

    popup.pan()
  })

  test('pan fromTop > 0 and fromBottom = 0 and fromRight > 0 and fromLeft = 0', () => {
    expect.assertions(0)

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

describe('fullscreen', () => {
  test('is fullscreen', () => {
    expect.assertions(5)
    
    const popup = new Popup({map: map})

    $(map.getTargetElement()).data('height', 500)
    $(popup.getElement()).data('height', 510)

    
    expect(popup.fullscreen()).toBe(true)
    expect($(map.getTargetElement()).children().last().hasClass('fullscreen')).toBe(true)
    expect($(map.getTargetElement()).children().last().children().first().get(0)).toBe(popup.content.get(0))
  
    $(map.getTargetElement()).children().last().children().last().trigger('click')
  
    expect($('.fullscreen').length).toBe(0)
    expect($(popup.getElement()).find('.content').get(0)).toBe(popup.content.get(0))
  })

  test('not fullscreen', () => {
    expect.assertions(1)
    
    const popup = new Popup({map: map})

    $(popup.map.getTargetElement()).data('height', 500)
    $(popup.getElement()).data('height', 410)

    expect(popup.fullscreen()).toBe(undefined)
  })
})
