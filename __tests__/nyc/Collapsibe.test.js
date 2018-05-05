import $ from 'jquery'

import Container from 'nyc/Container'
import Collapsible from 'nyc/Collapsible'

let target
let content
beforeEach(() => {
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

  expect(collapsible.getElem('h3').length).toBe(1)
  expect(collapsible.btn.get(0)).toBe(collapsible.getElem('h3').get(0))
  expect(collapsible.btn.hasClass('rad-top')).toBe(true)
  expect(collapsible.getElem('.content').length).toBe(1)
  expect(collapsible.content.get(0)).toBe(collapsible.getElem('.content').get(0))
  expect(collapsible.content.css('display')).toBe('block')
  expect(collapsible.getElem('h3 button').hasClass('expd')).toBe(false)
  expect(collapsible.getElem('h3:contains("Collapsible Title")').get(0)).toBe(collapsible.btn.get(0))
})

test('constructor collapsed', () => {
  expect.assertions(11)

  const collapsible = new Collapsible({
    target: target,
    title: 'Collapsible Title',
    content: content,
    collapsed: true
  })

  expect(collapsible instanceof Container).toBe(true)
  expect(collapsible instanceof Collapsible).toBe(true)

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(collapsible.getElem('h3').length).toBe(1)
        expect(collapsible.btn.get(0)).toBe(collapsible.getElem('h3').get(0))
        expect(collapsible.btn.hasClass('rad-top')).toBe(false)
        expect(collapsible.getElem('.content').length).toBe(1)
        expect(collapsible.content.get(0)).toBe(collapsible.getElem('.content').get(0))
        expect(collapsible.content.css('display')).toBe('none')
        expect(collapsible.getElem('h3 button').hasClass('expd')).toBe(true)
        expect(collapsible.getElem('h3:contains("Collapsible Title")').get(0)).toBe(collapsible.btn.get(0))
        resolve(true)
      }, 500)
    })
  }

  return test().then(result => expect(result).toBe(true))
})

test('toggle', () => {
  expect.assertions(3)

  const collapsible = new Collapsible({
    target: target,
    title: 'Collapsible Title',
    content: content
  })

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(collapsible.content.css('display'))
      }, 500)
    })
  }

  expect(collapsible.content.css('display')).toBe('block')

  collapsible.toggle()

  return test().then((display) => {
    expect(display).toBe('none')
    collapsible.toggle()
    return test().then((display) => {
      expect(display).toBe('block')
    })
  })
})
