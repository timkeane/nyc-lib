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
  expect.assertions(14)

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
  expect(collapsible.btn.hasClass('rad-all')).toBe(false)
  expect(collapsible.btn.attr('aria-pressed')).toBe('true')
  expect(collapsible.find('.content').length).toBe(1)
  expect(collapsible.content.get(0)).toBe(collapsible.find('.content').get(0))
  expect(collapsible.content.css('display')).toBe('block')
  expect(collapsible.content.attr('aria-expanded')).toBe('true')
  expect(collapsible.content.attr('aria-collapsed')).toBe('false')
  expect(collapsible.content.attr('aria-hidden')).toBe('false')
  expect(collapsible.find('h3:contains("Collapsible Title")').get(0)).toBe(collapsible.btn.get(0))
})

test('constructor collapsed', () => {
  expect.assertions(14)

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
  expect(collapsible.btn.hasClass('rad-all')).toBe(true)
  expect(collapsible.btn.attr('aria-pressed')).toBe('false')
  expect(collapsible.find('.content').length).toBe(1)
  expect(collapsible.content.get(0)).toBe(collapsible.find('.content').get(0))
  expect(collapsible.content.css('display')).toBe('none')
  expect(collapsible.content.attr('aria-expanded')).toBe('false')
  expect(collapsible.content.attr('aria-collapsed')).toBe('true')
  expect(collapsible.content.attr('aria-hidden')).toBe('true')
  expect(collapsible.find('h3:contains("Collapsible Title")').get(0)).toBe(collapsible.btn.get(0))
})

test('toggle via button click', () => {
  expect.assertions(18)

  const collapsible = new Collapsible({
    target: target,
    title: 'Collapsible Title',
    content: content
  })

  expect(collapsible.content.css('display')).toBe('block')
  expect(collapsible.content.attr('aria-hidden')).toBe('false')
  expect(collapsible.content.attr('aria-collapsed')).toBe('false')
  expect(collapsible.content.attr('aria-expanded')).toBe('true')

  expect(collapsible.btn.hasClass('rad-all')).toBe(false)
  expect(collapsible.btn.hasClass('rad-top')).toBe(true)

  collapsible.btn.trigger('click')

  expect(collapsible.content.css('display')).toBe('none')
  expect(collapsible.content.attr('aria-hidden')).toBe('true')
  expect(collapsible.content.attr('aria-collapsed')).toBe('true')
  expect(collapsible.content.attr('aria-expanded')).toBe('false')

  expect(collapsible.btn.hasClass('rad-all')).toBe(true)
  expect(collapsible.btn.hasClass('rad-top')).toBe(false)

  collapsible.btn.trigger('click')

  expect(collapsible.content.css('display')).toBe('block')
  expect(collapsible.content.attr('aria-hidden')).toBe('false')
  expect(collapsible.content.attr('aria-collapsed')).toBe('false')
  expect(collapsible.content.attr('aria-expanded')).toBe('true')

  expect(collapsible.btn.hasClass('rad-all')).toBe(false)
  expect(collapsible.btn.hasClass('rad-top')).toBe(true)
})