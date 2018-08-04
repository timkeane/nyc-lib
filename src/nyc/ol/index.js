/**
 * @module nyc/ol
 */

import {createXYZ as olTileGridCreateXYZ} from 'ol/tilegrid'

/**
 * @desc Namespace for NYC mapping functionality for OpenLayers
 * @public
 * @namespace
 */
const ol = {
  TILE_HOSTS: 'maps{1-4}.nyc.gov',
  /**
  * @desc The tile grid for NYC tiled layers
  * @public
  * @const {ol.tilegrid.TileGrid}
  */
  TILE_GRID: olTileGridCreateXYZ({minZoom: 8, maxZoom: 21}) 
}

export default ol

