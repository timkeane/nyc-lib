import CsvAddr from 'nyc/ol/format/CsvAddr'
import CsvPoint from 'nyc/ol/format/CsvPoint'

let mockGeocoder
beforeEach(() => {
  mockGeocoder = {
    search: jest.fn()
  }
})

test('constructor', () => {
  expect.assertions(3)

  const csvAddr = new CsvAddr({
    geocoder: mockGeocoder,
    locationTemplate: '${ADDR1}, ${CITY}, NY ${ZIP}'
  })

  expect(csvAddr instanceof CsvPoint).toBe(true)
  expect(csvAddr.geocoder).toBe(mockGeocoder)
  expect(csvAddr.locationTemplate).toBe('${ADDR1}, ${CITY}, NY ${ZIP}')
})