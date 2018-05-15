import Container from 'nyc/Container'
import Collapsible from 'nyc/Collapsible'

let target
let content
beforeEach(() => {
  $.resetMocks()
  target = $('<div></div>')
  content = $('<p>content</p>')
  $('body').append(target).append(content)
})
afterEach(() => {
  target.remove()
  content.remove()
})

test('constructor expanded', () => {
  const collapsible = new Collapsible({
    target: target,
    title: 'Collapsible Title',
    content: content
  })

  expect(collapsible instanceof Container).toBe(true)
  expect(collapsible instanceof Collapsible).toBe(true)

  expect(collapsible.find('h3').length).toBe(1)
  expect(collapsible.btn.get(0)).toBe(collapsible.find('h3').get(0))
  expect(collapsible.btn.hasClass('rad-top')).toBe(true)
  expect(collapsible.find('.content').length).toBe(1)
  expect(collapsible.content.get(0)).toBe(collapsible.find('.content').get(0))
  expect(collapsible.content.css('display')).toBe('block')
  expect(collapsible.find('h3 button').hasClass('expd')).toBe(false)
  expect(collapsible.find('h3:contains("Collapsible Title")').get(0)).toBe(collapsible.btn.get(0))
})

test('constructor collapsed', () => {
  const collapsible = new Collapsible({
    target: target,
    title: 'Collapsible Title',
    content: content,
    collapsed: true
  })

  expect(collapsible instanceof Container).toBe(true)
  expect(collapsible instanceof Collapsible).toBe(true)

  expect(collapsible.find('h3').length).toBe(1)
  expect(collapsible.btn.get(0)).toBe(collapsible.find('h3').get(0))
  expect(collapsible.btn.hasClass('rad-top')).toBe(false)
  expect(collapsible.find('.content').length).toBe(1)
  expect(collapsible.content.get(0)).toBe(collapsible.find('.content').get(0))
  expect(collapsible.content.css('display')).toBe('none')
  expect(collapsible.find('h3 button').hasClass('expd')).toBe(true)
  expect(collapsible.find('h3:contains("Collapsible Title")').get(0)).toBe(collapsible.btn.get(0))
})

test('toggle', () => {
  const collapsible = new Collapsible({
    target: target,
    title: 'Collapsible Title',
    content: content
  })

  expect(collapsible.find('h3 button').hasClass('expd')).toBe(false)
  expect(collapsible.content.css('display')).toBe('block')

  collapsible.toggle()

  expect($.mocks.slideUp).toHaveBeenCalledTimes(1)
  expect($.mocks.slideUp.mock.instances[0].get(0)).toBe(collapsible.content.get(0))
  expect(collapsible.find('h3 button').hasClass('expd')).toBe(true)
  expect(collapsible.content.css('display')).toBe('none')

  collapsible.toggle()

  expect($.mocks.slideDown).toHaveBeenCalledTimes(1)
  expect($.mocks.slideDown.mock.instances[0].get(0)).toBe(collapsible.content.get(0))
  expect(collapsible.find('h3 button').hasClass('expd')).toBe(false)
  expect(collapsible.content.css('display')).toBe('block')
})
