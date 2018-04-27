import Locator from 'nyc/Locator'
import EventHandling from 'nyc/EventHandling'

test('everything', () => {
    const locator = new Locator()
    expect(locator instanceof EventHandling).toBe(true)
    expect(locator instanceof Locator).toBe(true)
    expect(() => {locator.search('')}).toThrow('Not implemented')
    expect(() => {locator.locate()}).toThrow('Not implemented')
    expect(() => {locator.track()}).toThrow('Not implemented')
    expect(() => {locator.accuracyDistance(0)}).toThrow('Not implemented')
})
