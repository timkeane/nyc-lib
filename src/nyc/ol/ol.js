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
 * @public
 * @deprecated
 * @const
 * @type {ol.Extent}
 */
ol.EXTENT = [912090, 119053, 1068317, 273931]

/**
 * @const
 * @deprecated
 * @type {ol.Coordinate}
 */
ol.CENTER = [990203, 196492]

/**
 * @desc Enumeration for feature event types
 * @public
 * @enum {string}
 */
ol.FeatureEventType = {
	/**
	 * @desc The addfeature event type
	 */
	ADD: 'addfeature',
	/**
	 * @desc The changefeature event type
	 */
	CHANGE: 'changefeature',
	/**
	 * @desc The removefeature event type
	 */
	REMOVE: 'removefeature'
}

/**
 * @desc The tile grid for NYC TMS layers
 * @public
 * @type {ol.tilegrid.TileGrid}
 */
ol.TILE_GRID = olTilegrid.createXYZ({minZoom: 8, maxZoom: 21})

export default ol
