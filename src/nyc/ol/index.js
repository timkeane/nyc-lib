/**
 * @module nyc/ol
 */

import nyc from '../index'
import {createXYZ as olTileGridCreateXYZ} from 'ol/tilegrid'
import {register as olProjRegister} from 'ol/proj/proj4'

olProjRegister(nyc.proj4)

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

