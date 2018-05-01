import Container from 'nyc/Container'
import EventHandling from 'nyc/EventHandling'

test('everything', () => {
  const container = new Container()
  expect(container instanceof Container).toBe(true)
  expect(container instanceof EventHandling).toBe(true)
  expect(() => {container.getContainer()}).toThrow('Not implemented')
  expect(() => {container.getElem('selector')}).toThrow('Not implemented')
})

