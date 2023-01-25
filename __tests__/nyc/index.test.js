import nyc from 'nyc'

beforeEach(() => {
  $.resetMocks()
})


test('capitalize', () => {
  expect.assertions(2)

  let words = 'the quick brown fox jumped over the lazy dog'
  expect(nyc.capitalize(words)).toBe('The Quick Brown Fox Jumped Over The Lazy Dog')

  words = 'THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG'
  expect(nyc.capitalize(words)).toBe('The Quick Brown Fox Jumped Over The Lazy Dog')
})

test('nextId', () => {
  expect.assertions(6)

  const prefix1 = 'foo'
  const prefix2 = 'bar'
  expect(nyc.nextId(prefix1)).toBe('foo-0')
  expect(nyc.nextId(prefix2)).toBe('bar-0')
  expect(nyc.nextId(prefix1)).toBe('foo-1')
  expect(nyc.nextId(prefix2)).toBe('bar-1')
  expect(nyc.nextId(prefix1)).toBe('foo-2')
  expect(nyc.nextId(prefix2)).toBe('bar-2')
})

test('html has htm method', () => {
  expect.assertions(2)

  const object = {
    html() {
      return '<div>Some HTML</div>'
    }
  }

  expect(nyc.html(object).get(0).tagName).toBe('DIV')
  expect(nyc.html(object).html()).toBe('Some HTML')
})

test('html has getProperties method', () => {
  expect.assertions(6)

  const object = {
    getProperties() {
      return {
        foo: 'bar',
        bar: 'foo',
        doo: 'fus'
      }
    }
  }

  expect(nyc.html(object).get(0).tagName).toBe('DIV')
  expect(nyc.html(object).hasClass('nyc-html')).toBe(true)
  expect(nyc.html(object).children().length).toBe(3)
  expect($(nyc.html(object).children().get(0)).html()).toBe('<span class="fld">foo</span><span class="val">bar</span>')
  expect($(nyc.html(object).children().get(1)).html()).toBe('<span class="fld">bar</span><span class="val">foo</span>')
  expect($(nyc.html(object).children().get(2)).html()).toBe('<span class="fld">doo</span><span class="val">fus</span>')
})

test('html has properties field', () => {
  expect.assertions(6)

  const object = {
    properties: {
      foo: 'bar',
      bar: 'foo',
      doo: 'fus'
    }
  }

  expect(nyc.html(object).get(0).tagName).toBe('DIV')
  expect(nyc.html(object).hasClass('nyc-html')).toBe(true)
  expect(nyc.html(object).children().length).toBe(3)
  expect($(nyc.html(object).children().get(0)).html()).toBe('<span class="fld">foo</span><span class="val">bar</span>')
  expect($(nyc.html(object).children().get(1)).html()).toBe('<span class="fld">bar</span><span class="val">foo</span>')
  expect($(nyc.html(object).children().get(2)).html()).toBe('<span class="fld">doo</span><span class="val">fus</span>')
})

test('html plain object', () => {
  expect.assertions(6)

  const object = {
    foo: 'bar',
    bar: 'foo',
    doo: 'fus'
  }

  expect(nyc.html(object).get(0).tagName).toBe('DIV')
  expect(nyc.html(object).hasClass('nyc-html')).toBe(true)
  expect(nyc.html(object).children().length).toBe(3)
  expect($(nyc.html(object).children().get(0)).html()).toBe('<span class="fld">foo</span><span class="val">bar</span>')
  expect($(nyc.html(object).children().get(1)).html()).toBe('<span class="fld">bar</span><span class="val">foo</span>')
  expect($(nyc.html(object).children().get(2)).html()).toBe('<span class="fld">doo</span><span class="val">fus</span>')
})

test('loading/loaded', () => {
  expect.assertions(7)

  const body = $('body')
  body.addClass('loading').attr('aria-hidden', true)
  nyc.loading(body)
  expect(body.children().first().attr('id')).toBe('loading')
  expect(body.children().first().css('display')).toBe('block')

  nyc.ready()

  expect(body.hasClass('loading')).toBe(false)
  expect(body.attr('aria-hidden')).toBe('false')
  expect($.mocks.fadeOut).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeOut.mock.instances[0].get(0)).toBe(body.children().get(0))
  expect(body.children().first().css('display')).toBe('none')
})

test('cacheBust', () => {
  expect.assertions(1)

  const minutes = 10

  expect(nyc.cacheBust(minutes)).toBe(
    (() => {
      const offset = 1000 * 60 * minutes
      return Math.round(new Date().getTime() / offset) * offset
    })()
  )
})

describe('activeElement', () => {
  beforeEach(() => {
    $('body').empty()
    $('body').append('<div tabindex="0"></div><input>')
  })
  afterEach(() => {
    $('body').empty()
  })

  test('activeElement is not text input', () => {
    expect.assertions(4)

    $('div').trigger('focus')

    const activeElement = nyc.activeElement()

    expect($('body').find('div').length).toBe(1)
    expect($('body').find('input').length).toBe(1)
    expect(activeElement.activeElement).toBe($('body').find('div').get(0))
    expect(activeElement.isTextInput).toBe(false)
  })

  test('activeElement is text input', () => {
    expect.assertions(4)

    $('input').focus()

    const activeElement = nyc.activeElement()

    expect($('body').find('div').length).toBe(1)
    expect($('body').find('input').length).toBe(1)
    expect(activeElement.activeElement).toBe($('body').find('input').get(0))
    expect(activeElement.isTextInput).toBe(true)
  })
})

// describe.only('noSpaceBarScroll', () => {
//   let div
//   let a
//   let input
//   let select
//   let textarea
//   let event
//   const open = window.open
//   const location = nyc.location
//   beforeEach(() => {
//     nyc.noSpaceBarScroll()
//     window.open = jest.fn()
//     nyc.location = jest.fn()
//     event = {type: 'keypress', preventDefault: jest.fn()}
//     div = $('<div></div>')
//     a = $('<a></a>')
//     select = $('<select></select>')
//     input = $('<input>')
//     textarea = $('<textarea></textarea>')
//     $('body').append([div, a, input, textarea])
//   })
//   afterEach(() => {
//     $(document).off('keypress', nyc.noSpaceBarHandler)
//     window.open = open
//     nyc.location = location
//     $('body').empty()
//   })

//   test('noSpaceBarScroll div', () => {
//     expect.assertions(5)
    
//     event.target = div.get(0)
//     event.key = ' '
//     div.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(1)

//     event.key = 'Enter'
//     div.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)

//     event.key = 'foo'
//     div.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)
    
//     expect(nyc.location).toHaveBeenCalledTimes(0)
//     expect(window.open).toHaveBeenCalledTimes(0)
//   })

//   test('noSpaceBarScroll select', () => {
//     expect.assertions(5)
    
//     event.target = select.get(0)
//     event.key = ' '
//     select.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(0)

//     event.key = 'Enter'
//     select.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(0)

//     event.key = 'foo'
//     select.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(0)
    
//     expect(nyc.location).toHaveBeenCalledTimes(0)
//     expect(window.open).toHaveBeenCalledTimes(0)
//   })

//   test('noSpaceBarScroll a href #', () => {
//     expect.assertions(8)
    
//     const handler = jest.fn()

//     event.target = a.click(handler).attr('href', '#').get(0)
//     event.key = ' '
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(1)
//     expect(handler).toHaveBeenCalledTimes(1)

//     event.key = 'Enter'
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)
//     expect(handler).toHaveBeenCalledTimes(2)

//     event.key = 'foo'
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)
//     expect(handler).toHaveBeenCalledTimes(2)

//     expect(nyc.location).toHaveBeenCalledTimes(0)
//     expect(window.open).toHaveBeenCalledTimes(0)    
//   })

//   test('noSpaceBarScroll a no href', () => {
//     expect.assertions(8)
    
//     const handler = jest.fn()

//     event.target = a.click(handler).get(0)
//     event.key = ' '
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(1)
//     expect(handler).toHaveBeenCalledTimes(1)

//     event.key = 'Enter'
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)
//     expect(handler).toHaveBeenCalledTimes(2)

//     event.key = 'foo'
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)
//     expect(handler).toHaveBeenCalledTimes(2)

//     expect(nyc.location).toHaveBeenCalledTimes(0)
//     expect(window.open).toHaveBeenCalledTimes(0)
//   })

//   test.only('noSpaceBarScroll a has href', () => {
//     expect.assertions(6)
    
//     event.target = a.attr('href', 'https://maps.nyc.gov').get(0)
//     event.key = ' '
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(1)
//     expect(window.location).toBe('https://maps.nyc.gov')

//     event.key = 'Enter'
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)
//     expect(window.location).toBe('https://maps.nyc.gov')


//     event.key = 'foo'
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)
//     expect(window.open).toHaveBeenCalledTimes(0)
//   })

//   test('noSpaceBarScroll a has href and target', () => {
//     expect.assertions(9)
    
//     event.target = a.attr({href: 'https://maps.nyc.gov', target: 'blank'}).get(0)
//     event.key = ' '
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(1)
//     expect(window.open).toHaveBeenCalledTimes(1)
//     expect(window.open.mock.calls[0][0]).toBe('https://maps.nyc.gov')

//     event.key = 'Enter'
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)
//     expect(window.open).toHaveBeenCalledTimes(2)
//     expect(window.open.mock.calls[1][0]).toBe('https://maps.nyc.gov')


//     event.key = 'foo'
//     a.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(2)
//     expect(window.open).toHaveBeenCalledTimes(2)

//     expect(nyc.location).toHaveBeenCalledTimes(0)
//   })

//   test('noSpaceBarScroll input', () => {
//     expect.assertions(5)
    
//     event.target = input.get(0)
//     event.key = ' '
//     input.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(0)

//     event.key = 'Enter'
//     input.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(0)


//     event.key = 'foo'
//     input.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(0)
    
//     expect(window.open).toHaveBeenCalledTimes(0)
//     expect(nyc.location).toHaveBeenCalledTimes(0)
//   })

//   test('noSpaceBarScroll textarea', () => {
//     expect.assertions(5)
    
//     event.target = textarea.get(0)
//     event.key = ' '
//     textarea.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(0)

//     event.key = 'Enter'
//     textarea.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(0)


//     event.key = 'foo'
//     textarea.trigger(event)
//     expect(event.preventDefault).toHaveBeenCalledTimes(0)
    
//     expect(window.open).toHaveBeenCalledTimes(0)
//     expect(nyc.location).toHaveBeenCalledTimes(0)
//   })
// })

test('removeDups', () => {
  expect.assertions(2)
  expect(nyc.removeDups([1,2,3,4,4,5,6,6])).toEqual([1,2,3,4,5,6])
  expect(nyc.removeDups(['1','2','3','4','4','5','6','6'])).toEqual(['1','2','3','4','5','6'])
})
