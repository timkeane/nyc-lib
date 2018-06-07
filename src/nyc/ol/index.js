/**
 * @module nyc/ol
 */

import olTilegrid from 'ol/tilegrid'

/**
 * @desc Namespace for NYC mapping functionality for OpenLayers
 * @public
 * @namespace
 */
const ol = {}

/**
* @desc The tile grid for NYC tiled layers
* @public
* @type {ol.tilegrid.TileGrid}
*/
ol.TILE_GRID = olTilegrid.createXYZ({minZoom: 8, maxZoom: 21}) 

export default ol

