import proj4 from 'proj4'

import Locator from 'nyc/Locator'
import Geoclient from 'nyc/Geoclient'

test('constructor no projection', () => {
  const url = 'http://geoclient.url.gov/'
  const geoclient = new Geoclient(url)

  expect(geoclient.url).toBe(`${url}&input=`)
  expect(geoclient.projection).toBe('EPSG:3857')
})
