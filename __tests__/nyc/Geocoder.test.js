import EventHandling from 'nyc/EventHandling'
import Geocoder from 'nyc/Geocoder'

test('everything', () => {
  expect.assertions(3)

  const geocoder = new Geocoder()
  
  expect(geocoder instanceof EventHandling).toBe(true)
  expect(geocoder instanceof Geocoder).toBe(true)
  expect(() => {geocoder.search('anything')}).toThrow('Not implemented')
})
