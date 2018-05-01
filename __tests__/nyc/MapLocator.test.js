import MapLocator from 'nyc/MapLocator'

test('everything', () => {
  const mapLocator = new MapLocator()
  expect(mapLocator instanceof MapLocator).toBe(true)
  expect(() => {mapLocator.zoomLocation()}).toThrow('Not implemented')
  expect(() => {mapLocator.setLocation()}).toThrow('Not implemented')
})
