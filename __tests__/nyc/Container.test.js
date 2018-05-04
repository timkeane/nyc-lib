import $ from 'jquery'

import Container from 'nyc/Container'
import EventHandling from 'nyc/EventHandling'

test('everything', () => {
  const parent = $('<div></div>')
  const child = $('<p></p>')

  parent.append(child)
  const container = new Container(parent)

  expect(container instanceof Container).toBe(true)
  expect(container instanceof EventHandling).toBe(true)
  expect(container.getContainer().get(0)).toBe(parent.get(0))
  expect(container.getElem('p').get(0)).toBe(child.get(0))
})
