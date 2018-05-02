/**
 * @module nyc/MapLocator
 */

import Locator from 'nyc/Locator'

/**
 * @desc An abstract class for managing map location
 * @public
 * @abstract
 * @class
 */
class MapLocator {
	/**
	 * @public
	 * @abstract
	 * @method
	 * @param {Locator.Result} data The location to which the map will be oriented
	 * @param {function()} callback The function to call after the locator has zoomed to the location
	 */
	zoomLocation(data, callback) {
		throw 'Not implemented'
	}
	/**
	 * @public
	 * @abstract
	 * @method
	 * @param {Locator.Result} data The location to which the map will be oriented
	 * @param {function()} callback The function to call after the locator has zoomed to the location
	 */
	setLocation(data, callback) {
		throw 'Not implemented'
	}
}

MapLocator.ZOOM_LEVEL = 17

export default  MapLocator