/**
 * @module nyc/MapLocator
 */

/**
 * @desc An abstract class for managing map location
 * @public
 * @abstract
 * @class
 */
class MapLocator {
  /**
   * @desc Zoom to the provided loacation then optionally invoke a callback function
   * @public
   * @abstract
   * @method
   * @param {module:nyc/Locator~Locator.Result} data The location to which the map will be oriented
   * @param {module:nyc/MapLocator~MapLocator#zoomLocationCallback=} callback The function to call after the locator has zoomed to the location
   */
  zoomLocation(data, callback) {
    throw 'Not implemented'
  }
  /**
   * @desc Set the location to the provided loacation without moving the map
   * @public
   * @abstract
   * @method
   * @param {module:nyc/Locator~Locator.Result} data The location
   */
  setLocation(data) {
    throw 'Not implemented'
  }
  /**
   * @desc Get the projection of the map
   * @public
   * @abstract
   * @method
   * @returns {string} The map projection
   */
  getProjection() {
    throw 'Not implemented'
  }
}

/**
 * @desc Callback for {@link module:nyc/MapLocator~MapLocator#zoomLocation}
 * @public
 * @callback module:nyc/MapLocator~MapLocator#zoomLocationCallback
 */

/**
 * @desc The default zoom level when zooming to locations
 * @const
 * @type {number}
 */
MapLocator.ZOOM_LEVEL = 17

export default MapLocator
