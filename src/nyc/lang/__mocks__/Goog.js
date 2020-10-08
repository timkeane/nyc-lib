import EventHandling from 'nyc/EventHandling'

const mock = jest.fn().mockImplementation(() => {
  const goog = new EventHandling()
  goog.init = jest.fn()
  goog.translate = jest.fn()
  return goog
})

export default mock
