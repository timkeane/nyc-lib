import $ from 'jquery'

import Container from 'nyc/Container'
import EventHandling from 'nyc/EventHandling'

test('everything', () => {
  expect.assertions(8)

  const parent = $('<div></div>')
  const child = $('<p></p>')
  const append = $('<span></span>')

  parent.append(child)
  const container = new Container(parent)

  expect(container instanceof Container).toBe(true)
  expect(container instanceof EventHandling).toBe(true)
  expect(container.getContainer().get(0)).toBe(parent.get(0))
  expect(container.find('p').get(0)).toBe(child.get(0))
  expect(parent.children().first().get(0)).toBe(child.get(0))

  expect(container.append(append).get(0)).toBe(parent.get(0))
  expect(container.find('span').get(0)).toBe(append.get(0))
  expect(parent.children().last().get(0)).toBe(append.get(0))

})
