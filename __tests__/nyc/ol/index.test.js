import ol from 'nyc/ol'

import {createXYZ} from 'ol/tilegrid'

test('tileGrid', () => {
  expect.assertions(2)
  expect(ol.TILE_GRID).toEqual(createXYZ({minZoom: 8, maxZoom: 21}))
  expect(ol.TILE_HOSTS).toEqual('maps{1-4}.nyc.gov')
})