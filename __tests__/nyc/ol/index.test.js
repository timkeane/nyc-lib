import ol from 'nyc/ol'

import olTilegrid from 'ol/tilegrid'

test('tileGrid', () => {
  expect(ol.TILE_GRID).toEqual(olTilegrid.createXYZ({minZoom: 8, maxZoom: 21}))
})