import $ from 'jquery'

import ZoomSearch from 'nyc/ZoomSearch';
import Container from 'nyc/Container';

let container
beforeEach(() => {
  container = $('<div id="map"></div>')
  $('body').append(container)
})

afterEach(() => {
  container.remove()
})

test('constructor', () => {
  const render = ZoomSearch.prototype.render
  ZoomSearch.prototype.render = jest.fn()

  const zoomSearch = new ZoomSearch(container)
  expect(zoomSearch instanceof Container).toBe(true)
  expect(zoomSearch instanceof ZoomSearch).toBe(true)
  expect(zoomSearch.isAddrSrch).toBe(true)
  expect(ZoomSearch.prototype.render).toHaveBeenCalledTimes(1)

  ZoomSearch.prototype.render = render
})

test('abstract methods', () => {
  const render = ZoomSearch.prototype.render
  ZoomSearch.prototype.render = jest.fn()

  const zoomSearch = new ZoomSearch(container)
  expect(ZoomSearch.prototype.render).toHaveBeenCalledTimes(1)
  expect(() => {zoomSearch.zoom('event')}).toThrow('Not implemented')
  expect(() => {zoomSearch.featureAsLocation('feature', 'options')}).toThrow('Not implemented')

  ZoomSearch.prototype.render = render
})

test('render and hookupEvents called from constructor', () => {
  const key = ZoomSearch.prototype.key
  const select = ZoomSearch.prototype.select
  const zoom = ZoomSearch.prototype.zoom
  const geolocate = ZoomSearch.prototype.geolocate
  ZoomSearch.prototype.key = jest.fn()
  ZoomSearch.prototype.select = jest.fn()
  ZoomSearch.prototype.zoom = jest.fn()
  ZoomSearch.prototype.geolocate = jest.fn()

  const zoomSearch = new ZoomSearch(container)

  expect(container.html()).toBe($('<div></div>').append(ZoomSearch.HTML).html())

  expect(zoomSearch.input.length).toBe(1)
  expect(zoomSearch.input.get(0)).toBe(container.find('.srch input').get(0))

  expect(zoomSearch.list.length).toBe(1)
  expect(zoomSearch.list.get(0)).toBe(container.find('.srch ul').get(0))

  zoomSearch.input.trigger('keydown')
  zoomSearch.input.trigger('change')
  expect(ZoomSearch.prototype.key).toHaveBeenCalledTimes(2)
  expect(ZoomSearch.prototype.key.mock.calls[0][0].type).toBe('keydown')
  expect(ZoomSearch.prototype.key.mock.calls[0][0].target).toBe(zoomSearch.input.get(0))
  expect(ZoomSearch.prototype.key.mock.calls[1][0].type).toBe('change')
  expect(ZoomSearch.prototype.key.mock.calls[1][0].target).toBe(zoomSearch.input.get(0))

  zoomSearch.input.trigger('focus')
  expect(ZoomSearch.prototype.select).toHaveBeenCalledTimes(1)

  container.find('.btn-z-in, .btn-z-out').trigger('click')
  expect(ZoomSearch.prototype.zoom).toHaveBeenCalledTimes(2)
  expect(ZoomSearch.prototype.zoom.mock.calls[0][0].type).toBe('click')
  expect(ZoomSearch.prototype.zoom.mock.calls[0][0].target).toBe(container.find('.btn-z-in').get(0))
  expect(ZoomSearch.prototype.zoom.mock.calls[1][0].type).toBe('click')
  expect(ZoomSearch.prototype.zoom.mock.calls[1][0].target).toBe(container.find('.btn-z-out').get(0))

  container.find('.btn-geo').trigger('click')
  expect(ZoomSearch.prototype.geolocate).toHaveBeenCalledTimes(1)
  expect(ZoomSearch.prototype.geolocate.mock.calls[0][0].type).toBe('click')
  expect(ZoomSearch.prototype.geolocate.mock.calls[0][0].target).toBe(container.find('.btn-geo').get(0))

  ZoomSearch.prototype.key = key
  ZoomSearch.prototype.select = select
  ZoomSearch.prototype.zoom = zoom
  ZoomSearch.prototype.geolocate = geolocate
})

test('select', () => {
  const select = jest.fn()

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.input.on('select', select)

  zoomSearch.select()

  expect(select).toHaveBeenCalledTimes(1)
  expect(select.mock.calls[0][0].type).toBe('select')
  expect(select.mock.calls[0][0].target).toBe(zoomSearch.input.get(0))
})

test('key keyCode 13 isAddrSrch true', () => {
  expect.assertions(2)

  const event = {keyCode: 13}

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.isAddrSrch = true
  zoomSearch.triggerSearch = jest.fn()
  zoomSearch.list.show()

  zoomSearch.key(event)

  expect(zoomSearch.triggerSearch).toHaveBeenCalledTimes(1)

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(zoomSearch.list.css('display'))
      }, 500)
    })
  }
  return test().then(visible => expect(visible).toBe('none'))
})

test('key keyCode 13 isAddrSrch false', () => {
  expect.assertions(2)

  const event = {keyCode: 13}

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.isAddrSrch = false
  zoomSearch.triggerSearch = jest.fn()
  zoomSearch.list.hide()

  zoomSearch.key(event)

  expect(zoomSearch.triggerSearch).toHaveBeenCalledTimes(0)

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(zoomSearch.list.css('display'))
      }, 500)
    })
  }
  return test().then(visible => expect(visible).toBe('block'))
})

test('key keyCode not 13 isAddrSrch false', () => {
  expect.assertions(2)

  const event = {keyCode: 39}

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.isAddrSrch = false
  zoomSearch.triggerSearch = jest.fn()
  zoomSearch.list.hide()

  zoomSearch.key(event)

  expect(zoomSearch.triggerSearch).toHaveBeenCalledTimes(0)

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
      resolve(zoomSearch.list.css('display'))
      }, 500)
    })
  }
  return test().then(visible => expect(visible).toBe('block'))
})

test('key keyCode not 13 isAddrSrch true', () => {
  expect.assertions(2)

  const event = {keyCode: 13}

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.isAddrSrch = false
  zoomSearch.triggerSearch = jest.fn()
  zoomSearch.list.hide()

  zoomSearch.key(event)

  expect(zoomSearch.triggerSearch).toHaveBeenCalledTimes(0)

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(zoomSearch.list.css('display'))
      }, 500)
    })
  }
  return test().then(visible => expect(visible).toBe('block'))
})

test('geolocate', () => {
  const handler = jest.fn()

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.input.val('an address')
  zoomSearch.on(ZoomSearch.EventType.GEOLOCATE, handler)

  zoomSearch.geolocate()

  expect(zoomSearch.input.val()).toBe('')
  expect(handler).toHaveBeenCalledTimes(1)
})

test('triggerSearch has value', () => {
  const handler = jest.fn()

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.searching = jest.fn()
  zoomSearch.input.val('an address')
  zoomSearch.on(ZoomSearch.EventType.SEARCH, handler)

  zoomSearch.triggerSearch()

  expect(zoomSearch.searching).toHaveBeenCalledTimes(1)
  expect(zoomSearch.searching.mock.calls[0][0]).toBe(true)
  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0]).toBe('an address')
})

test('triggerSearch no value', () => {
  const handler = jest.fn()

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.searching = jest.fn()
  zoomSearch.input.val('')
  zoomSearch.on(ZoomSearch.EventType.SEARCH, handler)

  zoomSearch.triggerSearch()

  zoomSearch.input.val(' ')

  zoomSearch.triggerSearch()

  expect(zoomSearch.searching).toHaveBeenCalledTimes(0)
  expect(handler).toHaveBeenCalledTimes(0)
})

test('val', () => {
  const zoomSearch = new ZoomSearch(container)

  zoomSearch.searching = jest.fn()
  zoomSearch.input.val('an address')

  expect(zoomSearch.val()).toBe('an address')
  expect(zoomSearch.input.val()).toBe('an address')
  expect(zoomSearch.searching).toHaveBeenCalledTimes(0)

  expect(zoomSearch.val('another address')).toBe('another address')
  expect(zoomSearch.input.val()).toBe('another address')
  expect(zoomSearch.searching).toHaveBeenCalledTimes(1)
  expect(zoomSearch.searching.mock.calls[0][0]).toBe(false)
})

test('disambiguate no possible', () => {
  const ambiguous = {
    input: 'an address',
    possible: []
  }

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.searching = jest.fn()
  zoomSearch.emptyList = jest.fn()

  zoomSearch.disambiguate(ambiguous)

  expect(zoomSearch.searching).toHaveBeenCalledTimes(1)
  expect(zoomSearch.searching.mock.calls[0][0]).toBe(false)
})

test('disambiguate has possible', () => {
  const ambiguous = {
    input: 'an address',
    possible: [{name: 'possible 1'}, {name: 'possible 2'}]
  }

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.listItem = function(options, data) {
    return $('<li></li>')
		  .addClass(options.layerName)
      .html(data.name)
  }
  zoomSearch.searching = jest.fn()
  zoomSearch.emptyList = jest.fn()
  zoomSearch.list.hide()

  zoomSearch.disambiguate(ambiguous)

  expect(zoomSearch.searching).toHaveBeenCalledTimes(1)
  expect(zoomSearch.searching.mock.calls[0][0]).toBe(false)
  expect(zoomSearch.emptyList).toHaveBeenCalledTimes(1)
  expect(zoomSearch.emptyList.mock.calls[0][0]).toBe(true)

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(zoomSearch.list.css('display'))
      }, 500)
    })
  }
  expect(zoomSearch.list.children().length).toBe(2)
  expect(zoomSearch.list.children().get(0).tagName.toUpperCase()).toBe('LI')
  expect($(zoomSearch.list.children().get(0)).html()).toBe('possible 1')
  expect($(zoomSearch.list.children().get(0)).hasClass('addr')).toBe(true)
  expect(zoomSearch.list.children().get(1).tagName.toUpperCase()).toBe('LI')
  expect($(zoomSearch.list.children().get(1)).html()).toBe('possible 2')
  expect($(zoomSearch.list.children().get(1)).hasClass('addr')).toBe(true)

  return test().then(visible => expect(visible).toBe('block'))
})

test('searching', () => {
})

test('setFeatures/sortAlphapetically no nameField no displayField has placeholder', () => {
  const options = {
    layerName: 'a-layer',
    placeholder: 'a placeholder...',
    features: [
      {properties: {name: 'feature 3'}},
      {properties: {name: 'feature 1'}},
      {properties: {name: 'feature 2'}},
      {properties: {name: 'feature 2'}},
      {properties: {name: 'feature 4'}}
    ]
  }

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.emptyList = jest.fn()
  zoomSearch.listItem = function(options, data) {
    return $('<li></li>')
		  .addClass(options.layerName)
      .html(data.name)
  }
  zoomSearch.featureAsLocation = function(feature, opts) {
    expect(opts).toBe(options)
    return feature.properties
  }

  zoomSearch.setFeatures(options)

  expect(zoomSearch.input.attr('placeholder')).toBe('a placeholder...')
  expect(container.find('.retention').children().length).toBe(5)
  expect($(container.find('.retention').children().get(0)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(0)).html()).toBe('feature 1')
  expect($(container.find('.retention').children().get(1)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(1)).html()).toBe('feature 2')
  expect($(container.find('.retention').children().get(2)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(2)).html()).toBe('feature 2')
  expect($(container.find('.retention').children().get(3)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(3)).html()).toBe('feature 3')
  expect($(container.find('.retention').children().get(4)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(4)).html()).toBe('feature 4')

  expect(zoomSearch.emptyList).toHaveBeenCalledTimes(1)
})

test('setFeatures/sortAlphapetically has nameField has displayField no placeholder', () => {
  const options = {
    layerName: 'a-layer',
    nameField: 'label',
    displayField: 'label',
    features: [
      {
        properties: {label: 'feature 3'}, 
        get: function(prop){return this.properties[prop]}
      },
      {
        properties: {label: 'feature 1'}, 
        get: function(prop){return this.properties[prop]}
      },
      {
        properties: {label: 'feature 2'}, 
        get: function(prop){return this.properties[prop]}
      }
    ]
  }

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.emptyList = jest.fn()
  zoomSearch.listItem = function(options, data) {
    return $('<li></li>')
		  .addClass(options.layerName)
      .html(data.label)
  }
  zoomSearch.featureAsLocation = function(feature, opts) {
    expect(opts).toBe(options)
    return feature.properties
  }

  zoomSearch.setFeatures(options)

  expect(zoomSearch.input.attr('placeholder')).toBe('Search for an address...')
  expect(container.find('.retention').children().length).toBe(3)
  expect($(container.find('.retention').children().get(0)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(0)).html()).toBe('feature 1')
  expect($(container.find('.retention').children().get(1)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(1)).html()).toBe('feature 2')
  expect($(container.find('.retention').children().get(2)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(2)).html()).toBe('feature 3')

  expect(zoomSearch.emptyList).toHaveBeenCalledTimes(1)
})

test('removeFeatures', () => {
  const zoomSearch = new ZoomSearch(container)

  zoomSearch.list.html('<li class="a-layer"></li><li class="b-layer"></li><li class="a-layer"></li>')
  container.find('.retention').html('<li class="a-layer"></li><li class="a-layer"></li><li class="b-layer"></li>')

  zoomSearch.removeFeatures('a-layer')

  expect(zoomSearch.list.children().length).toBe(1)
  expect($(zoomSearch.list.children().get(0)).hasClass('a-layer')).toBe(false)
  expect(container.find('.retention').children().length).toBe(1)
  expect($(container.find('.retention').children().get(0)).hasClass('a-layer')).toBe(false)
})

test('listItem addr no displayField', () => {
  const options = {
    layerName: 'addr',
    nameField: 'name',
    displayField: 'display'
  }
  const data = {name: 'a name', data: {}}

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.disambiguated = jest.fn()

  const li = zoomSearch.listItem(options, data)

  expect(li.length).toBe(1)
  expect(li.get(0).tagName.toUpperCase()).toBe('LI')
  expect(li.hasClass('addr')).toBe(true)
  expect(li.hasClass('feature')).toBe(false)
  expect(li.hasClass('notranslate')).toBe(true)
  expect(li.attr('translate')).toBe('no')
  expect(li.html()).toBe('a name')
  expect(li.data('nameField')).toBe('name')
  expect(li.data('displayField')).toBe('display')
  expect(li.data('location')).toBe(data)

  li.trigger('click')
  expect(zoomSearch.disambiguated).toHaveBeenCalledTimes(1)
  expect(zoomSearch.disambiguated.mock.calls[0][0].type).toBe('click')
  expect(zoomSearch.disambiguated.mock.calls[0][0].target).toBe(li.get(0))
})

test('listItem not addr has displayField', () => {
  const options = {
    layerName: 'a-layer',
    nameField: 'name',
    displayField: 'label'
  }

  const data = {name: 'a name', data: {label: 'a label'}}

  const zoomSearch = new ZoomSearch(container)

  zoomSearch.disambiguated = jest.fn()

  const li = zoomSearch.listItem(options, data)

  expect(li.length).toBe(1)
  expect(li.get(0).tagName.toUpperCase()).toBe('LI')
  expect(li.hasClass('addr')).toBe(false)
  expect(li.hasClass('feature')).toBe(true)
  expect(li.hasClass('notranslate')).toBe(true)
  expect(li.attr('translate')).toBe('no')
  expect(li.html()).toBe('a label')
  expect(li.data('nameField')).toBe('name')
  expect(li.data('displayField')).toBe('label')
  expect(li.data('location')).toBe(data)

  li.trigger('click')
  expect(zoomSearch.disambiguated).toHaveBeenCalledTimes(1)
  expect(zoomSearch.disambiguated.mock.calls[0][0].type).toBe('click')
  expect(zoomSearch.disambiguated.mock.calls[0][0].target).toBe(li.get(0))
})

test('emptyList disambiguating', () => {
  const zoomSearch = new ZoomSearch(container)

  zoomSearch.list.html('<li id="addr-1" class="addr"></li><li id="addr-2" class="addr"></li><li id="addr-3" class="addr"></li>')
  container.find('.retention').html('<li id="feature-1" class="feature"></li><li id="feature-2" class="feature"></li><li id="feature-3" class="feature"></li>')

  zoomSearch.emptyList(true)

  expect(zoomSearch.list.children().length).toBe(0)
  expect(container.find('.retention').children().length).toBe(6)
  expect(container.find('.retention').children().get(0).id).toBe('feature-1')
  expect(container.find('.retention').children().get(0).className).toBe('feature')
  expect(container.find('.retention').children().get(1).id).toBe('feature-2')
  expect(container.find('.retention').children().get(1).className).toBe('feature')
  expect(container.find('.retention').children().get(2).id).toBe('feature-3')
  expect(container.find('.retention').children().get(2).className).toBe('feature')
  expect(container.find('.retention').children().get(3).id).toBe('addr-1')
  expect(container.find('.retention').children().get(3).className).toBe('addr')
  expect(container.find('.retention').children().get(4).id).toBe('addr-2')
  expect(container.find('.retention').children().get(4).className).toBe('addr')
  expect(container.find('.retention').children().get(5).id).toBe('addr-3')
  expect(container.find('.retention').children().get(5).className).toBe('addr')
})

test('emptyList not disambiguating', () => {
  const zoomSearch = new ZoomSearch(container)

  zoomSearch.list.html('<li class="addr"></li><li class="addr"></li><li class="addr"></li>')
  container.find('.retention').html('<li class="feature"></li><li class="feature"></li><li class="feature"></li>')

  zoomSearch.emptyList(false)

  expect(zoomSearch.list.children().length).toBe(3)
  zoomSearch.list.children().each((_, li) => {
    expect($(li).hasClass('feature')).toBe(true)
    expect($(li).hasClass('addr')).toBe(false)
  })
  expect(container.find('.retention').children().length).toBe(3)
  container.find('.retention').children().each((_, li) => {
    expect($(li).hasClass('feature')).toBe(false)
    expect($(li).hasClass('addr')).toBe(true)
  })
})

test('disambiguated is LI', () => {
  expect.assertions(6)

  const handler = jest.fn()
  const data = {name: 'a name', data: {label: 'a label'}}
  const li = $('<li class="feature">a label</li>')
    .data('location', data)
  
  const zoomSearch = new ZoomSearch(container)

  zoomSearch.emptyList = jest.fn()
  zoomSearch.list.append(li).show()
  zoomSearch.on(ZoomSearch.EventType.DISAMBIGUATED, handler)

  zoomSearch.disambiguated({target: li.get(0)})

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0]).toBe(data)
  expect(handler.mock.calls[0][0].isFeature).toBe(true)
  expect(zoomSearch.val()).toBe('a name')
  
  expect(zoomSearch.emptyList).toHaveBeenCalledTimes(1)

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(zoomSearch.list.css('display'))
      }, 500)
    })
  }
  return test().then(visible => expect(visible).toBe('none'))

})

test('disambiguated is child of LI', () => {
  expect.assertions(6)

  const handler = jest.fn()
  const data = {name: 'a name', data: {label: '<span>a label</span>'}}
  const li = $('<li class="feature"><span>a label</span></li>')
    .data('location', data)
  
  const zoomSearch = new ZoomSearch(container)

  zoomSearch.emptyList = jest.fn()
  zoomSearch.list.append(li).show()
  zoomSearch.on(ZoomSearch.EventType.DISAMBIGUATED, handler)

  zoomSearch.disambiguated({target: li.children().get(0)})

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0]).toBe(data)
  expect(handler.mock.calls[0][0].isFeature).toBe(true)
  expect(zoomSearch.val()).toBe('a name')
  
  expect(zoomSearch.emptyList).toHaveBeenCalledTimes(1)

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(zoomSearch.list.css('display'))
      }, 500)
    })
  }
  return test().then(visible => expect(visible).toBe('none'))

})