import Search from 'nyc/Search'
import Container from 'nyc/Container'
import AutoComplete from 'nyc/AutoComplete'


let input
let container
beforeEach(() => {
  input = $('<input>')
  container = $('<div id="map"></div>')
  $('body').append(container).append(input)
})

afterEach(() => {
  input.remove()
  container.remove()
})

test('constructor target is input', () => {
  expect.assertions(5)

  const search = new Search(input)
  expect(search instanceof Container).toBe(true)
  expect(search instanceof Search).toBe(true)
  expect(search.isAddrSrch).toBe(true)
  expect(search.getContainer().html()).toBe('<div class="srch input-group" role="search"><input class="rad-all" type="text" data-msg-key="search-addr-input" data-msg-attr="placeholder" placeholder="Search for an address..."><button class="btn btn-srch btn-primary btn-lg">Search</button></div><ul class="rad-all" role="region" label="Possible matches for your search"></ul><ul class="retention"></ul>')
  expect(search.getContainer().hasClass('srch-ctl')).toBe(true)
})

test('constructor target is map', () => {
  expect.assertions(5)

  const search = new Search(container)
  expect(search instanceof Container).toBe(true)
  expect(search instanceof Search).toBe(true)
  expect(search.isAddrSrch).toBe(true)
  expect(search.getContainer().html()).toBe($(Search.HTML).html())
  expect(search.getContainer().hasClass('srch-ctl')).toBe(true)
})

test('abstract method featureAsLocation', () => {
  expect.assertions(1)

  const search = new Search(container)
  expect(() => {search.featureAsLocation('feature', 'options')}).toThrow('Not implemented')
})

describe('hookupEvents called from constructor', () => {
  const key = Search.prototype.key
  const zoom = Search.prototype.zoom
  const geolocate = Search.prototype.geolocate
  const listClick = Search.prototype.listClick
  beforeEach(() => {
    Search.prototype.key = jest.fn()
    Search.prototype.zoom = jest.fn()
    Search.prototype.geolocate = jest.fn()
    Search.prototype.listClick = jest.fn()
  })
  afterEach(() => {
    Search.prototype.key = key
    Search.prototype.zoom = zoom
    Search.prototype.geolocate = geolocate
    Search.prototype.listClick = listClick
  })

  test('hookupEvents', () => {
    expect.assertions(12)

    const search = new Search(container)

    expect(search.input.length).toBe(1)
    expect(search.input.get(0)).toBe(container.find('.srch input').get(0))

    expect(search.list.length).toBe(1)
    expect(search.list.get(0)).toBe(container.find('ul.rad-all').get(0))
    expect(search.retention.length).toBe(1)
    expect(search.retention.get(0)).toBe(container.find('ul.retention').get(0))

    search.input.trigger('keyup')
    search.input.trigger('change')
    expect(Search.prototype.key).toHaveBeenCalledTimes(2)
    expect(Search.prototype.key.mock.calls[0][0].type).toBe('keyup')
    expect(Search.prototype.key.mock.calls[0][0].target).toBe(search.input.get(0))
    expect(Search.prototype.key.mock.calls[1][0].type).toBe('change')
    expect(Search.prototype.key.mock.calls[1][0].target).toBe(search.input.get(0))

    search.input.trigger('focus')

    $(document).trigger('mouseup')
    expect(Search.prototype.listClick).toHaveBeenCalledTimes(1)
  })
})

test('key keyCode is 13 and isAddrSrch is true', () => {
  expect.assertions(3)

  const search = new Search(container)

  search.triggerSearch = jest.fn()
  search.filterList = jest.fn()
  search.list.show()

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 500)
    })
  }

  search.key({keyCode: 13})

  expect(search.triggerSearch).toHaveBeenCalledTimes(1)
  expect(search.filterList).toHaveBeenCalledTimes(0)

  return test().then(visible => expect(visible).toBe('none'))
})

test('key keyCode not 13 and isAddrSrch is true', () => {
  expect.assertions(3)

  const search = new Search(container)

  search.triggerSearch = jest.fn()
  search.filterList = jest.fn()
  search.list.show()

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 500)
    })
  }

  search.key({keyCode: 39})

  expect(search.triggerSearch).toHaveBeenCalledTimes(0)
  expect(search.filterList).toHaveBeenCalledTimes(1)

  return test().then(visible => expect(visible).toBe('block'))
})

test('key keyCode not 13 and isAddrSrch is false', () => {
  expect.assertions(3)

  const search = new Search(container)

  search.isAddrSrch = false
  search.triggerSearch = jest.fn()
  search.filterList = jest.fn()
  search.list.show()

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 500)
    })
  }

  search.key({keyCode: 39})

  expect(search.triggerSearch).toHaveBeenCalledTimes(0)
  expect(search.filterList).toHaveBeenCalledTimes(1)

  return test().then(visible => expect(visible).toBe('block'))
})

test('key keyCode is 13 and isAddrSrch is false', () => {
  expect.assertions(3)

  const search = new Search(container)

  search.isAddrSrch = false
  search.triggerSearch = jest.fn()
  search.filterList = jest.fn()
  search.list.show()

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 500)
    })
  }

  search.key({keyCode: 13})

  expect(search.triggerSearch).toHaveBeenCalledTimes(0)
  expect(search.filterList).toHaveBeenCalledTimes(1)

  return test().then(visible => expect(visible).toBe('block'))
})

test('clearTxt', () => {
  expect.assertions(4)

  const search = new Search(container)

  search.val = jest.fn()
  search.clearBtn = jest.fn()

  search.clearTxt()

  expect(search.val).toHaveBeenCalledTimes(1)
  expect(search.val.mock.calls[0][0]).toBe('')
  expect(search.clearBtn).toHaveBeenCalledTimes(1)
  expect(search.input.is(':focus')).toBe(true)
})

test('clearBtn', () => {
  expect.assertions(1)

  const search = new Search(container)

  search.clearBtn()
  expect(search.clear.css('display')).toBe('none')
})

test('filterList no autoComplete', () => {
  expect.assertions(2)

  const search = new Search(container)

  search.emptyList = jest.fn()
  search.showList = jest.fn()

  search.filterList()

  expect(search.emptyList).toHaveBeenCalledTimes(1)
  expect(search.showList).toHaveBeenCalledTimes(1)
})


test('filterList no input', () => {
  expect.assertions(2)

  const search = new Search(container)

  search.autoComplete = 'mock-auto-complete'
  search.emptyList = jest.fn()
  search.showList = jest.fn()

  search.filterList()

  expect(search.emptyList).toHaveBeenCalledTimes(1)
  expect(search.showList).toHaveBeenCalledTimes(1)
})

test('filterList has autoComplete and input', () => {
  expect.assertions(6)

  const search = new Search(container)

  search.val('typed')
  search.autoComplete = {filter: jest.fn()}
  search.emptyList = jest.fn()
  search.showList = jest.fn()

  search.filterList()

  expect(search.emptyList).toHaveBeenCalledTimes(0)
  expect(search.showList).toHaveBeenCalledTimes(1)
  expect(search.autoComplete.filter).toHaveBeenCalledTimes(1)
  expect(search.autoComplete.filter.mock.calls[0][0]).toBe(search.retention)
  expect(search.autoComplete.filter.mock.calls[0][1]).toBe(search.list)
  expect(search.autoComplete.filter.mock.calls[0][2]).toBe('typed')
})

test('showList with focus', () => {
  expect.assertions(4)

  const search = new Search(container)

  search.list.append('<li data-id="one"><a href="#">one</li><li data-id="two"><a href="#">two</a></li>').hide()

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 1000)
    })
  }

  search.showList(true)

  return test().then(visible => {
    expect(visible).toBe('block')
    expect(search.list.children().length).toBe(2)
    expect(search.list.children().first().find('a').attr('tabindex')).toBe('0')
    expect(search.list.children().first().find('a').is(':focus')).toBe(true)
  })
})

test('showList without focus', () => {
  expect.assertions(4)

  const search = new Search(container)

  search.list.append('<li>one</li><li>two</li>').hide()

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 1000)
    })
  }

  search.showList(false)

  return test().then(visible => {
    expect(visible).toBe('block')
    expect(search.list.children().length).toBe(2)
    expect(search.list.children().first().attr('tabindex')).not.toBe('0')
    expect(search.list.children().first().is(':focus')).not.toBe(true)
  })
})

test('triggerSearch has value', () => {
  expect.assertions(2)

  const handler = jest.fn()

  const search = new Search(container)

  search.input.val('an address')
  search.on('search', handler)

  search.triggerSearch()

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0]).toBe('an address')
})

test('triggerSearch no value', () => {
  expect.assertions(1)

  const handler = jest.fn()

  const search = new Search(container)

  search.input.val('')
  search.on('search', handler)

  search.triggerSearch()

  search.input.val(' ')

  search.triggerSearch()

  expect(handler).toHaveBeenCalledTimes(0)
})

test('val', () => {
  expect.assertions(4)

  const search = new Search(container)

  search.input.val('an address')

  expect(search.val()).toBe('an address')
  expect(search.input.val()).toBe('an address')

  expect(search.val('another address')).toBe('another address')
  expect(search.input.val()).toBe('another address')
})

test('disambiguate no possible', () => {
  expect.assertions(1)

  const ambiguous = {
    input: 'an address',
    possible: []
  }

  const search = new Search(container)

  search.showList = jest.fn()

  search.disambiguate(ambiguous)

  expect(search.showList).toHaveBeenCalledTimes(0)
})

test('disambiguate has possible', () => {
  expect.assertions(9)

  const ambiguous = {
    input: 'an address',
    possible: [{name: 'possible 1'}, {name: 'possible 2'}]
  }

  const search = new Search(container)

  search.listItem = (options, data) => {
    return $('<li></li>')
		  .addClass(options.layerName)
      .html(data.name)
  }
  search.emptyList = jest.fn()
  search.showList = jest.fn()

  search.disambiguate(ambiguous)

  expect(search.emptyList).toHaveBeenCalledTimes(1)
  expect(search.showList).toHaveBeenCalledTimes(1)
  expect(search.list.children().length).toBe(2)
  expect(search.list.children().get(0).tagName.toUpperCase()).toBe('LI')
  expect($(search.list.children().get(0)).html()).toBe('possible 1')
  expect($(search.list.children().get(0)).hasClass('addr')).toBe(true)
  expect(search.list.children().get(1).tagName.toUpperCase()).toBe('LI')
  expect($(search.list.children().get(1)).html()).toBe('possible 2')
  expect($(search.list.children().get(1)).hasClass('addr')).toBe(true)
})

test('setFeatures/sortAlphapetically no nameField no displayField has placeholder', () => {
  expect.assertions(26)

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

  const search = new Search(container)

  search.emptyList = jest.fn()
  search.listItem = (options, data) => {
    return $('<li></li>')
		  .addClass(options.layerName)
      .html(data.name)
  }
  search.featureAsLocation = (feature, opts) => {
    expect(opts).toBe(options)
    return feature.properties
  }

  expect(search.autoComplete).toBe(null)

  search.setFeatures(options)

  expect(search.autoComplete instanceof AutoComplete).toBe(true)

  expect(search.input.attr('placeholder')).toBe('a placeholder...')
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

  expect(search.emptyList).toHaveBeenCalledTimes(1)

  const autoComplete = search.autoComplete
  search.setFeatures(options)
  expect(autoComplete).toBe(search.autoComplete)
})

test('setFeatures/sortAlphapetically has nameField has displayField no placeholder', () => {
  expect.assertions(18)

  const options = {
    layerName: 'a-layer',
    nameField: 'label',
    displayField: 'label',
    features: [
      {
        properties: {label: 'feature 3'},
        get(prop) {return this.properties[prop]}
      },
      {
        properties: {label: 'feature 1'},
        get(prop) {return this.properties[prop]}
      },
      {
        properties: {label: 'feature 2'},
        get(prop) {return this.properties[prop]}
      }
    ]
  }

  const search = new Search(container)

  search.emptyList = jest.fn()
  search.listItem = (options, data) => {
    return $('<li></li>')
		  .addClass(options.layerName)
      .html(data.label)
  }
  search.featureAsLocation = (feature, opts) => {
    expect(opts).toBe(options)
    return feature.properties
  }

  expect(search.autoComplete).toBe(null)

  search.setFeatures(options)

  expect(search.autoComplete instanceof AutoComplete).toBe(true)

  expect(search.input.attr('placeholder')).toBe('Search for an address...')
  expect(container.find('.retention').children().length).toBe(3)
  expect($(container.find('.retention').children().get(0)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(0)).html()).toBe('feature 1')
  expect($(container.find('.retention').children().get(1)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(1)).html()).toBe('feature 2')
  expect($(container.find('.retention').children().get(2)).hasClass('a-layer')).toBe(true)
  expect($(container.find('.retention').children().get(2)).html()).toBe('feature 3')

  expect(search.emptyList).toHaveBeenCalledTimes(1)

  const autoComplete = search.autoComplete
  search.setFeatures(options)
  expect(autoComplete).toBe(search.autoComplete)
})

test('removeFeatures', () => {
  expect.assertions(4)

  const search = new Search(container)

  search.list.html('<li class="a-layer"></li><li class="b-layer"></li><li class="a-layer"></li>')
  container.find('.retention').html('<li class="a-layer"></li><li class="a-layer"></li><li class="b-layer"></li>')

  search.removeFeatures('a-layer')

  expect(search.list.children().length).toBe(1)
  expect($(search.list.children().get(0)).hasClass('a-layer')).toBe(false)
  expect(container.find('.retention').children().length).toBe(1)
  expect($(container.find('.retention').children().get(0)).hasClass('a-layer')).toBe(false)
})

test('listItem addr no displayField', () => {
  expect.assertions(13)

  const options = {
    layerName: 'addr',
    nameField: 'name',
    displayField: 'display'
  }
  const data = {name: 'a name', data: {}}

  const search = new Search(container)

  search.disambiguated = jest.fn()

  const li = search.listItem(options, data)

  expect(li.length).toBe(1)
  expect(li.get(0).tagName.toUpperCase()).toBe('LI')
  expect(li.hasClass('addr')).toBe(true)
  expect(li.hasClass('feature')).toBe(false)
  expect(li.hasClass('notranslate')).toBe(true)
  expect(li.attr('translate')).toBe('no')
  expect(li.html()).toBe('<a href="#">a name</a>')
  expect(li.data('nameField')).toBe('name')
  expect(li.data('displayField')).toBe('display')
  expect(li.data('location')).toBe(data)

  li.trigger('click')
  expect(search.disambiguated).toHaveBeenCalledTimes(1)
  expect(search.disambiguated.mock.calls[0][0].type).toBe('click')
  expect(search.disambiguated.mock.calls[0][0].currentTarget).toBe(li.get(0))
})

test('listItem not addr has displayField', () => {
  expect.assertions(13)

  const options = {
    layerName: 'a-layer',
    nameField: 'name',
    displayField: 'label'
  }

  const data = {name: 'a name', data: {label: 'a label'}}

  const search = new Search(container)

  search.disambiguated = jest.fn()

  const li = search.listItem(options, data)

  expect(li.length).toBe(1)
  expect(li.get(0).tagName.toUpperCase()).toBe('LI')
  expect(li.hasClass('addr')).toBe(false)
  expect(li.hasClass('feature')).toBe(true)
  expect(li.hasClass('notranslate')).toBe(true)
  expect(li.attr('translate')).toBe('no')
  expect(li.html()).toBe('<a href="#">a label</a>')
  expect(li.data('nameField')).toBe('name')
  expect(li.data('displayField')).toBe('label')
  expect(li.data('location')).toBe(data)

  li.trigger('click')
  expect(search.disambiguated).toHaveBeenCalledTimes(1)
  expect(search.disambiguated.mock.calls[0][0].type).toBe('click')
  expect(search.disambiguated.mock.calls[0][0].currentTarget).toBe(li.get(0))
})

test('emptyList', () => {
  expect.assertions(9)
  const search = new Search(container)

  search.list.append('<li data-id="one"><a href="#">one</li><li data-id="two"><a href="#">two</a></li>')

  search.emptyList()

  expect(search.list.children().length).toBe(0)
  expect(search.retention.children().length).toBe(2)
  expect($(search.retention.children().get(0)).find('a').html()).toBe('one')
  expect($(search.retention.children().get(1)).find('a').html()).toBe('two')

  search.list.append('<li data-id="one"><a href="#">one</li><li data-id="three"><a href="#">three</a></li>')
  
  search.emptyList()

  expect(search.list.children().length).toBe(0)
  expect(search.retention.children().length).toBe(3)
  expect($(search.retention.children().get(0)).find('a').html()).toBe('one')
  expect($(search.retention.children().get(1)).find('a').html()).toBe('two')
  expect($(search.retention.children().get(2)).find('a').html()).toBe('three')
})

test('disambiguated is LI', () => {
  expect.assertions(6)

  const handler = jest.fn()
  const data = {name: 'a name', data: {label: 'a label'}}
  const li = $('<li class="feature">a label</li>')
    .data('location', data)

  const search = new Search(container)

  search.emptyList = jest.fn()
  search.list.append(li).show()
  search.on('disambiguated', handler)

  search.disambiguated({currentTarget: li.get(0)})

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0]).toBe(data)
  expect(handler.mock.calls[0][0].isFeature).toBe(true)
  expect(search.val()).toBe('a name')

  expect(search.emptyList).toHaveBeenCalledTimes(1)

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 500)
    })
  }
  return test().then(visible => expect(visible).toBe('none'))
})

test('listClick list closed', () => {
  expect.assertions(1)

  const handler = jest.fn()

  const search = new Search(container)

  const li = $('<li></li>')
  const event = {
    originalEvent: {
      target: li.get(0)
    }
  }
  search.list.append(li).hide()
  li.on('click', handler)

  search.listClick(event)
  expect(handler).toHaveBeenCalledTimes(0)
})

test('listClick list open but not clicked', () => {
  expect.assertions(2)
  const handler = jest.fn()

  const search = new Search(container)

  const li = $('<li></li>')
  const event = {
    originalEvent: {
      target: document.body
    }
  }
  search.list.append(li).show()
  li.on('click', handler)

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 500)
    })
  }

  search.listClick(event)

  expect(handler).toHaveBeenCalledTimes(0)
  return test().then(visible => expect(visible).toBe('none'))
})

test('listClick list open is clicked but no autoComplete', () => {
  expect.assertions(2)
  const handler = jest.fn()

  const search = new Search(container)

  const li = $('<li></li>')
  const event = {
    originalEvent: {
      target: li.get(0)
    }
  }
  search.list.append(li).show()
  li.on('click', handler)

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 500)
    })
  }

  search.listClick(event)

  expect(handler).toHaveBeenCalledTimes(0)
  return test().then(visible => expect(visible).toBe('block'))
})

test('listClick list open is clicked and has autoComplete', () => {
  expect.assertions(2)
  const handler = jest.fn()

  const search = new Search(container)

  search.autoComplete = 'mock-auto-complete'

  const li = $('<li></li>')
  const event = {
    originalEvent: {
      target: li.get(0)
    }
  }
  search.list.append(li).show()
  li.on('click', handler)

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(search.list.css('display'))
      }, 500)
    })
  }

  search.listClick(event)

  expect(handler).toHaveBeenCalledTimes(1)
  return test().then(visible => expect(visible).toBe('block'))
})