import Container from 'nyc/Container'
import Tabs from 'nyc/Tabs'

let target
let tab0
let tab1
let tab2
let options
beforeEach(() => {
  target = $('<div></div>')
  tab0 = $('<div>tab 0</div>')
  tab1 = $('<div>tab 1</div>')
  tab2 = $('<div>tab 2</div>')
  options = {
    target: target,
    tabs: [
      {tab: tab0, title: 'Tab One'},
      {tab: tab1, title: 'Tab Two'},
      {tab: tab2, title: 'Tab Three'}
    ]
  }
})
afterEach(() => {
  target.remove()
  tab0.remove()
  tab1.remove()
  tab2.remove()
})

test('contructor default active', () => {
  expect.assertions(36)

  const tabs = new Tabs(options)

  expect(tabs instanceof Container).toBe(true)
  expect(tabs instanceof Tabs).toBe(true)

  expect(tabs.active.length).toBe(1)
  expect(tabs.active.get(0)).toBe(tab0.get(0))
  expect(tabs.active.hasClass('active')).toBe(true)
  expect(tabs.active.attr('aria-hidden')).toBe('false')
  expect(tabs.active.attr('aria-selected')).toBe('true')

  expect(tabs.find('.tab').length).toBe(3)
  expect(tabs.find('.tab').get(0)).toBe(tab0.get(0))
  expect(tabs.find('.tab').get(1)).toBe(tab1.get(0))
  expect(tabs.find('.tab').get(2)).toBe(tab2.get(0))

  expect($(tabs.find('.tab').get(0)).hasClass('active')).toBe(true)
  expect($(tabs.find('.tab').get(1)).hasClass('active')).toBe(false)
  expect($(tabs.find('.tab').get(2)).hasClass('active')).toBe(false)

  expect($(tabs.find('.tab').get(0)).attr('aria-hidden')).toBe('false')
  expect($(tabs.find('.tab').get(1)).attr('aria-hidden')).toBe('true')
  expect($(tabs.find('.tab').get(2)).attr('aria-hidden')).toBe('true')

  expect($(tabs.find('.tab').get(0)).attr('aria-selected')).toBe('true')
  expect($(tabs.find('.tab').get(1)).attr('aria-selected')).toBe('false')
  expect($(tabs.find('.tab').get(2)).attr('aria-selected')).toBe('false')
  
  expect($(tabs.find('.tab').get(0)).hasClass('tab-0')).toBe(true)
  expect($(tabs.find('.tab').get(1)).hasClass('tab-1')).toBe(true)
  expect($(tabs.find('.tab').get(2)).hasClass('tab-2')).toBe(true)

  expect(tabs.find('h2.btn').length).toBe(3)
  expect(tabs.find('h2.btn').get(0).innerHTML).toBe('<a href="#">Tab One</a>')
  expect(tabs.find('h2.btn').get(1).innerHTML).toBe('<a href="#">Tab Two</a>')
  expect(tabs.find('h2.btn').get(2).innerHTML).toBe('<a href="#">Tab Three</a>')

  expect($(tabs.find('h2.btn').get(0)).hasClass('active')).toBe(true)
  expect($(tabs.find('h2.btn').get(1)).hasClass('active')).toBe(false)
  expect($(tabs.find('h2.btn').get(2)).hasClass('active')).toBe(false)

  expect($(tabs.find('h2.btn').get(0)).attr('aria-pressed')).toBe('true')
  expect($(tabs.find('h2.btn').get(1)).attr('aria-pressed')).toBe('false')
  expect($(tabs.find('h2.btn').get(2)).attr('aria-pressed')).toBe('false')

  expect($(tabs.find('h2.btn').get(0)).hasClass('btn-0')).toBe(true)
  expect($(tabs.find('h2.btn').get(1)).hasClass('btn-1')).toBe(true)
  expect($(tabs.find('h2.btn').get(2)).hasClass('btn-2')).toBe(true)
})

test('contructor provide active', () => {
  expect.assertions(36)

  options.tabs[1].active = true

  const tabs = new Tabs(options)

  expect(tabs instanceof Container).toBe(true)
  expect(tabs instanceof Tabs).toBe(true)

  expect(tabs.active.length).toBe(1)
  expect(tabs.active.get(0)).toBe(tab1.get(0))
  expect(tabs.active.hasClass('active')).toBe(true)
  expect(tabs.active.attr('aria-hidden')).toBe('false')
  expect(tabs.active.attr('aria-selected')).toBe('true')

  expect(tabs.find('.tab').length).toBe(3)
  expect(tabs.find('.tab').get(0)).toBe(tab0.get(0))
  expect(tabs.find('.tab').get(1)).toBe(tab1.get(0))
  expect(tabs.find('.tab').get(2)).toBe(tab2.get(0))

  expect($(tabs.find('.tab').get(0)).hasClass('active')).toBe(false)
  expect($(tabs.find('.tab').get(1)).hasClass('active')).toBe(true)
  expect($(tabs.find('.tab').get(2)).hasClass('active')).toBe(false)

  expect($(tabs.find('.tab').get(0)).attr('aria-hidden')).toBe('true')
  expect($(tabs.find('.tab').get(1)).attr('aria-hidden')).toBe('false')
  expect($(tabs.find('.tab').get(2)).attr('aria-hidden')).toBe('true')

  expect($(tabs.find('.tab').get(0)).attr('aria-selected')).toBe('false')
  expect($(tabs.find('.tab').get(1)).attr('aria-selected')).toBe('true')
  expect($(tabs.find('.tab').get(2)).attr('aria-selected')).toBe('false')
  
  expect($(tabs.find('.tab').get(0)).hasClass('tab-0')).toBe(true)
  expect($(tabs.find('.tab').get(1)).hasClass('tab-1')).toBe(true)
  expect($(tabs.find('.tab').get(2)).hasClass('tab-2')).toBe(true)

  expect(tabs.find('h2.btn').length).toBe(3)
  expect(tabs.find('h2.btn').get(0).innerHTML).toBe('<a href="#">Tab One</a>')
  expect(tabs.find('h2.btn').get(1).innerHTML).toBe('<a href="#">Tab Two</a>')
  expect(tabs.find('h2.btn').get(2).innerHTML).toBe('<a href="#">Tab Three</a>')

  expect($(tabs.find('h2.btn').get(0)).hasClass('active')).toBe(false)
  expect($(tabs.find('h2.btn').get(1)).hasClass('active')).toBe(true)
  expect($(tabs.find('h2.btn').get(2)).hasClass('active')).toBe(false)

  expect($(tabs.find('h2.btn').get(0)).attr('aria-pressed')).toBe('false')
  expect($(tabs.find('h2.btn').get(1)).attr('aria-pressed')).toBe('true')
  expect($(tabs.find('h2.btn').get(2)).attr('aria-pressed')).toBe('false')

  expect($(tabs.find('h2.btn').get(0)).hasClass('btn-0')).toBe(true)
  expect($(tabs.find('h2.btn').get(1)).hasClass('btn-1')).toBe(true)
  expect($(tabs.find('h2.btn').get(2)).hasClass('btn-2')).toBe(true)
})

test('open', () => {
  expect.assertions(34)

  const tabs = new Tabs(options)

  tabs.open('.tab-2')

  expect(tabs.active.length).toBe(1)
  expect(tabs.active.get(0)).toBe(tab2.get(0))
  expect(tabs.active.hasClass('active')).toBe(true)
  expect(tabs.active.attr('aria-hidden')).toBe('false')
  expect(tabs.active.attr('aria-selected')).toBe('true')

  expect(tabs.find('.tab').length).toBe(3)
  expect(tabs.find('.tab').get(0)).toBe(tab0.get(0))
  expect(tabs.find('.tab').get(1)).toBe(tab1.get(0))
  expect(tabs.find('.tab').get(2)).toBe(tab2.get(0))

  expect($(tabs.find('.tab').get(0)).hasClass('active')).toBe(false)
  expect($(tabs.find('.tab').get(1)).hasClass('active')).toBe(false)
  expect($(tabs.find('.tab').get(2)).hasClass('active')).toBe(true)

  expect($(tabs.find('.tab').get(0)).attr('aria-hidden')).toBe('true')
  expect($(tabs.find('.tab').get(1)).attr('aria-hidden')).toBe('true')
  expect($(tabs.find('.tab').get(2)).attr('aria-hidden')).toBe('false')

  expect($(tabs.find('.tab').get(0)).attr('aria-selected')).toBe('false')
  expect($(tabs.find('.tab').get(1)).attr('aria-selected')).toBe('false')
  expect($(tabs.find('.tab').get(2)).attr('aria-selected')).toBe('true')
  
  expect($(tabs.find('.tab').get(0)).hasClass('tab-0')).toBe(true)
  expect($(tabs.find('.tab').get(1)).hasClass('tab-1')).toBe(true)
  expect($(tabs.find('.tab').get(2)).hasClass('tab-2')).toBe(true)

  expect(tabs.find('h2.btn').length).toBe(3)
  expect(tabs.find('h2.btn').get(0).innerHTML).toBe('<a href="#">Tab One</a>')
  expect(tabs.find('h2.btn').get(1).innerHTML).toBe('<a href="#">Tab Two</a>')
  expect(tabs.find('h2.btn').get(2).innerHTML).toBe('<a href="#">Tab Three</a>')

  expect($(tabs.find('h2.btn').get(0)).hasClass('active')).toBe(false)
  expect($(tabs.find('h2.btn').get(1)).hasClass('active')).toBe(false)
  expect($(tabs.find('h2.btn').get(2)).hasClass('active')).toBe(true)

  expect($(tabs.find('h2.btn').get(0)).attr('aria-pressed')).toBe('false')
  expect($(tabs.find('h2.btn').get(1)).attr('aria-pressed')).toBe('false')
  expect($(tabs.find('h2.btn').get(2)).attr('aria-pressed')).toBe('true')

  expect($(tabs.find('h2.btn').get(0)).hasClass('btn-0')).toBe(true)
  expect($(tabs.find('h2.btn').get(1)).hasClass('btn-1')).toBe(true)
  expect($(tabs.find('h2.btn').get(2)).hasClass('btn-2')).toBe(true)
})

test('btnClick', () => {
  expect.assertions(2)

  const tabs = new Tabs(options)

  expect(tabs.active.get(0)).toBe(tab0.get(0))

  $(tabs.find('h2.btn').get(1)).trigger('click')

  expect(tabs.active.get(0)).toBe(tab1.get(0))
})
