import nyc from 'nyc'
import Directions from 'nyc/Directions'
import Contanier from 'nyc/Container'
import Tabs from 'nyc/Tabs'
import Dialog from '../../src/nyc/Dialog'
import TripPlanHack from '../../src/nyc/mta/TripPlanHack'
import MockMutationObserver from '../MutationObserver.mock'

import googleMock from '../google.mock'

jest.mock('../../src/nyc/Dialog')
jest.mock('../../src/nyc/mta/TripPlanHack')

beforeEach(() => {
  $.resetMocks()
  googleMock.resetMocks()
  Dialog.mockClear()
  TripPlanHack.mockClear()
})
afterEach(() => {
  $('body').empty()
  delete global.directions
})

describe('constructor', () => {
  const tripPlanHack = Directions.prototype.tripPlanHack
  const mode = Directions.prototype.mode
  const key = Directions.prototype.key
  
  test('constructor no args', () => {
    expect.assertions(27)

    const dir = new Directions()

    expect(dir instanceof Contanier).toBe(true)
    expect(dir instanceof Directions).toBe(true)

    expect(dir.getContainer().get(0)).toBe($('body').get(0))
    expect(global.directions).toBe(dir)
    
    expect(dir.tabs.find('.tab').length).toBe(2)
    expect(dir.tabs.find('#map-tab.tab').length).toBe(1)
    expect(dir.tabs.find('#route-tab.tab').length).toBe(1)

    expect(dir.map).toBeNull()
    expect(dir.service).toBeNull()
    expect(dir.renderer).toBeNull()
    expect(dir.args).toBeNull()

    expect($('#transit').length).toBe(1)
    expect(dir.modeBtn).toBe($('#transit').get(0))
    expect(dir.url).toBe(`${Directions.GOOGLE_URL}&callback=directions.init`)
    expect(dir.routeTarget.length).toBe(1)
    expect(dir.routeTarget.get(0)).toBe(dir.find('#route-tab div.route').get(0))
    expect(dir.lastDir).toBe('')
    
    expect(dir.styles).toBe(Directions.DEFAULT_STYLES)
    expect($.mocks.proxy).toHaveBeenCalledTimes(5)
    
    expect($.mocks.proxy.mock.calls[2][0]).toBe(dir.tripPlanHack)
    expect($.mocks.proxy.mock.calls[2][1]).toBe(dir)

    expect($.mocks.proxy.mock.calls[3][0]).toBe(dir.mode)
    expect($.mocks.proxy.mock.calls[3][1]).toBe(dir)

    expect($.mocks.proxy.mock.calls[4][0]).toBe(dir.key)
    expect($.mocks.proxy.mock.calls[4][1]).toBe(dir)

    dir.find('#fld-from input').focus()
    expect($.mocks.select).toHaveBeenCalledTimes(1)
    expect($.mocks.select.mock.instances[0].get(0)).toBe(dir.find('#fld-from input').get(0))
  })

  test('constructor with args', () => {
    expect.assertions(25)

    const dir = new Directions({
      url: 'http://directions.url', 
      styles: 'mock-styles'
    })

    expect(dir instanceof Contanier).toBe(true)
    expect(dir instanceof Directions).toBe(true)

    expect(dir.getContainer().get(0)).toBe($('body').get(0))
    expect(global.directions).toBe(dir)
    
    expect(dir.tabs.find('.tab').length).toBe(2)
    expect(dir.tabs.find('#map-tab.tab').length).toBe(1)
    expect(dir.tabs.find('#route-tab.tab').length).toBe(1)

    expect(dir.map).toBeNull()
    expect(dir.service).toBeNull()
    expect(dir.renderer).toBeNull()
    expect(dir.args).toBeNull()

    expect($('#transit').length).toBe(1)
    expect(dir.modeBtn).toBe($('#transit').get(0))
    expect(dir.url).toBe('http://directions.url&callback=directions.init')
    expect(dir.routeTarget.length).toBe(1)
    expect(dir.routeTarget.get(0)).toBe(dir.find('#route-tab div.route').get(0))
    expect(dir.lastDir).toBe('')
    
    expect(dir.styles).toBe('mock-styles')
    expect($.mocks.proxy).toHaveBeenCalledTimes(5)
    
    expect($.mocks.proxy.mock.calls[2][0]).toBe(dir.tripPlanHack)
    expect($.mocks.proxy.mock.calls[2][1]).toBe(dir)

    expect($.mocks.proxy.mock.calls[3][0]).toBe(dir.mode)
    expect($.mocks.proxy.mock.calls[3][1]).toBe(dir)

    expect($.mocks.proxy.mock.calls[4][0]).toBe(dir.key)
    expect($.mocks.proxy.mock.calls[4][1]).toBe(dir)
  })
})

describe('back to finder', () => {
  const tog = $('<div aria-hidden="true"></div>')
  beforeEach(() => {
    $('body').append(tog)
    tog.hide()
  })
  afterEach(() => {
    tog.remove()
  })

  test('back to finder', () => {
    expect.assertions(3)
  
    const dir = new Directions({toggle: tog})
  
    $('#directions').show()

    $('#back-to-map').trigger('click')

    expect(tog.css('display')).toBe('block')
    expect(tog.attr('aria-hidden')).toBe('false')
    expect($('#directions').css('display')).toBe('none')
  })
})

test('init', () => {
  expect.assertions(22)

  const dir = new Directions()
  
  dir.args = 'mock-args'
  dir.directions = jest.fn()
  dir.zoom = jest.fn()

  dir.init()

  expect(dir.map.type).toBe('mock-map')
  expect(google.maps.Map).toHaveBeenCalledTimes(1)
  expect($('#map-tab div.map').length).toBe(1)
  expect(google.maps.Map.mock.calls[0][0]).toBe($('#map-tab div.map').get(0))
  expect(google.maps.Map.mock.calls[0][1].mapTypeId).toBe(google.maps.MapTypeId.ROADMAP)
  expect(google.maps.Map.mock.calls[0][1].backgroundColor).toBe('#D3D3D3')
  expect(google.maps.Map.mock.calls[0][1].panControl).toBe(false)
  expect(google.maps.Map.mock.calls[0][1].streetViewControl).toBe(false)
  expect(google.maps.Map.mock.calls[0][1].mapTypeControl).toBe(false)
  expect(google.maps.Map.mock.calls[0][1].zoomControl).toBe(false)
  expect(google.maps.Map.mock.calls[0][1].maxZoom).toBe(18)
  expect(google.maps.Map.mock.calls[0][1].styles).toBe(dir.styles)

  expect(dir.service.type).toBe('mock-service')
  expect(google.maps.DirectionsService).toHaveBeenCalledTimes(1)

  expect(dir.renderer.type).toBe('mock-renderer')
  expect(google.maps.DirectionsRenderer).toHaveBeenCalledTimes(1)

  expect(dir.directions).toHaveBeenCalledTimes(1)
  expect(dir.directions.mock.calls[0][0]).toBe('mock-args')

  dir.find('.btn-z-in').trigger('click')
  expect(dir.zoom).toHaveBeenCalledTimes(1)
  expect(dir.zoom.mock.calls[0][0].target).toBe(dir.find('.btn-z-in').get(0))

  dir.find('.btn-z-out').trigger('click')
  expect(dir.zoom).toHaveBeenCalledTimes(2)
  expect(dir.zoom.mock.calls[1][0].target).toBe(dir.find('.btn-z-out').get(0))
})

describe('directions', () => {
  test('directions no map', () => {
    expect.assertions(17)

    const dir = new Directions()

    $('#directions').hide()

    dir.handleResp = jest.fn()

    const args = {
      from: 'from addr',
      to: 'to addr',
      facility: 'facility name',
      mode: 'DRIVING'
    }
    dir.directions(args)

    expect($.mocks.getScript).toHaveBeenCalledTimes(1)
    expect(dir.map.type).toBe('mock-map')
    expect($('#fld-from input').val()).toBe(args.from)
    expect($('#fld-to').html()).toBe(args.to)
    expect($('#fld-facility').html()).toBe(args.facility)
    expect($.mocks.slideDown).toHaveBeenCalledTimes(1)
    expect($.mocks.slideDown.mock.instances[0].get(0)).toBe($('#directions').get(0))
    expect($('#directions').css('display')).toBe('block')
    expect(dir.lastDir).toBe(`${args.from}|${args.to}|${args.mode}`)
    expect(dir.service.route).toHaveBeenCalledTimes(1)
    expect(dir.service.route.mock.calls[0][0].origin).toBe(args.from)
    expect(dir.service.route.mock.calls[0][0].destination).toBe(args.to)
    expect(dir.service.route.mock.calls[0][0].travelMode).toBe(google.maps.TravelMode[args.mode])
    expect(dir.handleResp).toHaveBeenCalledTimes(1)
  
    dir.directions(args)
    expect($.mocks.slideDown).toHaveBeenCalledTimes(2)
    expect($.mocks.slideDown.mock.instances[1].get(0)).toBe($('#directions').get(0))
    expect(dir.service.route).toHaveBeenCalledTimes(1)
  })

  test('directions has map', () => {
    expect.assertions(13)

    const dir = new Directions()

    dir.map = new google.maps.Map()
    dir.service = new google.maps.DirectionsService()

    $('#directions').hide()

    dir.handleResp = jest.fn()

    const args = {
      from: 'from addr',
      to: 'to addr',
      facility: 'facility name',
      mode: 'DRIVING'
    }
    dir.directions(args)

    expect($.mocks.getScript).toHaveBeenCalledTimes(0)
    expect($('#fld-from input').val()).toBe(args.from)
    expect($('#fld-to').html()).toBe(args.to)
    expect($('#fld-facility').html()).toBe(args.facility)
    expect($.mocks.slideDown).toHaveBeenCalledTimes(1)
    expect($.mocks.slideDown.mock.instances[0].get(0)).toBe($('#directions').get(0))
    expect($('#directions').css('display')).toBe('block')
    expect(dir.lastDir).toBe(`${args.from}|${args.to}|${args.mode}`)
    expect(dir.service.route).toHaveBeenCalledTimes(1)
    expect(dir.service.route.mock.calls[0][0].origin).toBe(args.from)
    expect(dir.service.route.mock.calls[0][0].destination).toBe(args.to)
    expect(dir.service.route.mock.calls[0][0].travelMode).toBe(google.maps.TravelMode[args.mode])
    expect(dir.handleResp).toHaveBeenCalledTimes(1)
  })

  test('directions from in input no mode', () => {
    expect.assertions(13)

    const dir = new Directions()

    dir.map = new google.maps.Map()
    dir.service = new google.maps.DirectionsService()

    $('#directions').hide()
    $('#fld-from input').val('from addr')

    dir.handleResp = jest.fn()

    const args = {
      to: 'to addr',
      facility: 'facility name'
    }
    dir.directions(args)

    expect($.mocks.getScript).toHaveBeenCalledTimes(0)
    expect(args.from).toBe($('#fld-from input').val())
    expect($('#fld-to').html()).toBe(args.to)
    expect($('#fld-facility').html()).toBe(args.facility)
    expect($.mocks.slideDown).toHaveBeenCalledTimes(1)
    expect($.mocks.slideDown.mock.instances[0].get(0)).toBe($('#directions').get(0))
    expect($('#directions').css('display')).toBe('block')
    expect(dir.lastDir).toBe(`${args.from}|${args.to}|TRANSIT`)
    expect(dir.service.route).toHaveBeenCalledTimes(1)
    expect(dir.service.route.mock.calls[0][0].origin).toBe(args.from)
    expect(dir.service.route.mock.calls[0][0].destination).toBe(args.to)
    expect(dir.service.route.mock.calls[0][0].travelMode).toBe(google.maps.TravelMode.TRANSIT)
    expect(dir.handleResp).toHaveBeenCalledTimes(1)
  })

  test('directions no from', () => {
    expect.assertions(9)

    const dir = new Directions()

    dir.map = new google.maps.Map()
    dir.service = new google.maps.DirectionsService()

    $('#directions').hide()

    dir.handleResp = jest.fn()

    const args = {
      to: 'to addr',
      facility: 'facility name',
      mode: 'DRIVING'
    }
    dir.directions(args)

    expect($.mocks.getScript).toHaveBeenCalledTimes(0)
    expect($('#fld-from input').val()).toBe('')
    expect($('#fld-to').html()).toBe(args.to)
    expect($('#fld-facility').html()).toBe(args.facility)
    expect($.mocks.slideDown).toHaveBeenCalledTimes(1)
    expect($.mocks.slideDown.mock.instances[0].get(0)).toBe($('#directions').get(0))
    expect($('#directions').css('display')).toBe('block')
    expect(dir.lastDir).toBe('')
    expect(dir.service.route).toHaveBeenCalledTimes(0)
  })
})

describe('monitor', () => {
  const mutationObserver = window.MutationObserver
  const interval = window.setInterval
  beforeEach(() => {
    window.setInterval = jest.fn()
  })
  afterEach(() => {
    MockMutationObserver.resetMock()
    window.setInterval = interval
    window.MutationObserver = mutationObserver
  })

  test ('monitor has MutationObserver', () => {
    expect.assertions(11)

    window.MutationObserver = MockMutationObserver

    const dir = new Directions()

    $.resetMocks()

    expect(dir.monitoring).toBe(false)

    dir.monitor()

    expect(dir.monitoring).toBe(true)

    expect($.mocks.proxy).toHaveBeenCalledTimes(1)
    expect($.mocks.proxy.mock.calls[0][0]).toBe(dir.routeAlt)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(dir)
    expect(MockMutationObserver.constructorCalls.length).toBe(1)
    expect(MockMutationObserver.constructorCalls[0]).toBe($.mocks.proxy.returnedValues[0])

    expect(MockMutationObserver.observeCalls.length).toBe(1)
    expect(MockMutationObserver.observeCalls[0][0]).toBe(dir.find('.route').get(0))
    expect(MockMutationObserver.observeCalls[0][1]).toEqual({childList: true})
  
    expect(window.setInterval).toHaveBeenCalledTimes(0)
  })

  test('monitor no MutationObserver', () => {
    expect.assertions(7)

    delete window.MutationObserver

    const dir = new Directions()

    expect(dir.monitoring).toBe(false)

    $.resetMocks()

    dir.monitor()

    expect(dir.monitoring).toBe(true)

    expect(window.setInterval).toHaveBeenCalledTimes(1)

    expect($.mocks.proxy).toHaveBeenCalledTimes(1)
    expect($.mocks.proxy.mock.calls[0][0]).toBe(dir.routeAlt)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(dir)
    expect(window.setInterval.mock.calls[0][0]).toBe($.mocks.proxy.returnedValues[0])
  })
})

describe('routeAlt', () => {
  let imgs
  beforeEach(() => {
    imgs = $('<img><img><img><img><img><img>')
    imgs.get(0).className = 'adp-marker2'
    imgs.get(1).src = 'http://google.com/us-ny-mta/A.png'
    imgs.get(2).src = 'http://google.com/us-ny-mta/7X.png'
    imgs.get(3).src = 'http://google.com/mode/walk.png'
    imgs.get(4).src = 'http://google.com/mode/bus2.png'
    imgs.get(5).className = 'adp-marker2'
  })
  afterEach(() => {
    imgs.remove()
  })

  test('routeAlt', () => {
    expect.assertions(6)

    const dir = new Directions()

    $('.route').append(imgs)

    dir.routeAlt()

    expect(imgs.get(0).alt).toBe('Start location ')
    expect(imgs.get(1).alt).toBe('Take the A train ')
    expect(imgs.get(2).alt).toBe('Take the 7 Express train ')
    expect(imgs.get(3).alt).toBe('Walk ')
    expect(imgs.get(4).alt).toBe('Take the bus ')
    expect(imgs.get(5).alt).toBe('End location ')
  })
})

describe('handleResp', () => {
  test('handleResp OK no origin coordinate', () => {
    expect.assertions(12)

    const dir = new Directions()
    dir.args = {origin: {}}

    dir.map = new google.maps.Map()
    dir.renderer = new google.maps.DirectionsRenderer()

    dir.on('change', (event) => {
      expect(event.response).toBe(google.maps.okResponse)
      expect(event.status).toBe(google.maps.okResponse.status)
    })

    dir.handleResp(google.maps.okResponse, google.maps.okResponse.status)

    expect(dir.renderer.setOptions).toHaveBeenCalledTimes(1)
    expect(dir.renderer.setOptions.mock.calls[0][0].map).toBe(dir.map)
    expect($(dir.routeTarget).length).toBe(1)
    expect(dir.renderer.setOptions.mock.calls[0][0].panel).toBe($(dir.routeTarget).get(0))
    expect(dir.renderer.setOptions.mock.calls[0][0].directions).toBe(google.maps.okResponse)
  
    expect($('#fld-from input').val()).toBe(google.maps.okResponse.routes[0].legs[0].start_address.replace(/\, USA/, ''))
    expect($('#fld-to').html()).toBe(google.maps.okResponse.routes[0].legs[0].end_address.replace(/\, USA/, ''))
  
    expect(dir.args.origin.name).toBe(google.maps.okResponse.routes[0].legs[0].start_address.replace(/\, USA/, ''))
    expect(dir.args.origin.coordinate).toEqual([1, 0])
    expect(dir.args.origin.projection).toBe('EPSG:4326')
  })

  test('handleResp OK has origin coordinate', () => {
    expect.assertions(9)

    const dir = new Directions()
    dir.args = {origin: {coordinate: [1, 0]}}

    dir.map = new google.maps.Map()
    dir.renderer = new google.maps.DirectionsRenderer()

    dir.on('change', (event) => {
      expect(event.response).toBe(google.maps.okResponse)
      expect(event.status).toBe(google.maps.okResponse.status)
    })

    dir.handleResp(google.maps.okResponse, google.maps.okResponse.status)

    expect(dir.renderer.setOptions).toHaveBeenCalledTimes(1)
    expect(dir.renderer.setOptions.mock.calls[0][0].map).toBe(dir.map)
    expect($(dir.routeTarget).length).toBe(1)
    expect(dir.renderer.setOptions.mock.calls[0][0].panel).toBe($(dir.routeTarget).get(0))
    expect(dir.renderer.setOptions.mock.calls[0][0].directions).toBe(google.maps.okResponse)
  
    expect($('#fld-from input').val()).toBe(google.maps.okResponse.routes[0].legs[0].start_address.replace(/\, USA/, ''))
    expect($('#fld-to').html()).toBe(google.maps.okResponse.routes[0].legs[0].end_address.replace(/\, USA/, ''))
  })

  test('handleResp SOL', () => {
    expect.assertions(7)

    const dir = new Directions()
    dir.args = {from: 'from addr', to: 'to addr'}

    dir.map = new google.maps.Map()
    dir.renderer = new google.maps.DirectionsRenderer()

    dir.on('change', (event) => {
      expect(event.response).toBe(google.maps.badResponse)
      expect(event.status).toBe(google.maps.badResponse.status)
    })

    dir.handleResp(google.maps.badResponse, google.maps.badResponse.status)

    expect(dir.renderer.setOptions).toHaveBeenCalledTimes(0)
  
    expect($('#fld-from input').val()).toBe('')
    expect($('#fld-to').html()).toBe('')

    expect(Dialog).toHaveBeenCalledTimes(1)
    expect(Dialog.mock.instances[0].ok.mock.calls[0][0].message).toBe(
      `Could not determine directions from '${dir.args.from}' to '${dir.args.to}'`
    )
  })
})

test('zoom', () => {
  expect.assertions(6)

  const dir = new Directions()

  dir.map = new google.maps.Map()

  dir.zoom({target: dir.find('.btn-z-in').get(0)})
  expect(dir.map.getZoom).toHaveBeenCalledTimes(1)
  expect(dir.map.setZoom).toHaveBeenCalledTimes(1)
  expect(dir.map.setZoom.mock.calls[0][0]).toBe(11)

  dir.zoom({target: dir.find('.btn-z-out').get(0)})
  expect(dir.map.getZoom).toHaveBeenCalledTimes(2)
  expect(dir.map.setZoom).toHaveBeenCalledTimes(2)
  expect(dir.map.setZoom.mock.calls[1][0]).toBe(9)
})

test('mode', () => {
  expect.assertions(28)

  const dir = new Directions()
  
  dir.directions =jest.fn()

  expect($('#transit').hasClass('active')).toBe(true)
  expect($('#bike').hasClass('active')).toBe(false)
  expect($('#walk').hasClass('active')).toBe(false)
  expect($('#car').hasClass('active')).toBe(false)

  dir.mode({target: dir.find('#bike').get(0)})

  expect($('#transit').hasClass('active')).toBe(false)
  expect($('#bike').hasClass('active')).toBe(true)
  expect($('#walk').hasClass('active')).toBe(false)
  expect($('#car').hasClass('active')).toBe(false)
  expect(dir.directions).toHaveBeenCalledTimes(1)
  expect(dir.directions.mock.calls[0][0].mode).toBe('BICYCLING')

  dir.mode({target: dir.find('#walk').get(0)})

  expect($('#transit').hasClass('active')).toBe(false)
  expect($('#bike').hasClass('active')).toBe(false)
  expect($('#walk').hasClass('active')).toBe(true)
  expect($('#car').hasClass('active')).toBe(false)
  expect(dir.directions).toHaveBeenCalledTimes(2)
  expect(dir.directions.mock.calls[0][0].mode).toBe('WALKING')

  dir.mode({target: dir.find('#car').get(0)})

  expect($('#transit').hasClass('active')).toBe(false)
  expect($('#bike').hasClass('active')).toBe(false)
  expect($('#walk').hasClass('active')).toBe(false)
  expect($('#car').hasClass('active')).toBe(true)
  expect(dir.directions).toHaveBeenCalledTimes(3)
  expect(dir.directions.mock.calls[0][0].mode).toBe('DRIVING')

  dir.mode({target: dir.find('#transit').get(0)})

  expect($('#transit').hasClass('active')).toBe(true)
  expect($('#bike').hasClass('active')).toBe(false)
  expect($('#walk').hasClass('active')).toBe(false)
  expect($('#car').hasClass('active')).toBe(false)
  expect(dir.directions).toHaveBeenCalledTimes(4)
  expect(dir.directions.mock.calls[0][0].mode).toBe('TRANSIT')
})

test('key', () => {
  expect.assertions(4)

  const dir = new Directions()
  dir.args = {from: null}

  dir.directions =jest.fn()
  $('#fld-from input').val('from addr')

  dir.key({keyCode: 39})
  expect(dir.args.from).toBeNull()

  dir.key({keyCode: 13})
  expect(dir.args.from).toBe('from addr')
  expect(dir.directions).toHaveBeenCalledTimes(1)
  expect(dir.directions.mock.calls[0][0]).toBe(dir.args)
})

test('tripPlanHack', () => {
  expect.assertions(4)

  const dir = new Directions()
  dir.args = {}

  dir.tripPlanHack()

  expect(dir.args.accessible).toBe(true)
  expect(TripPlanHack).toHaveBeenCalledTimes(1)
  expect(TripPlanHack.mock.instances[0].directions).toHaveBeenCalledTimes(1)
  expect(TripPlanHack.mock.instances[0].directions.mock.calls[0][0]).toBe(dir.args)
})