/**
 * @module nyc/ol/LocationMgr
 */

import NycLocationMgr from 'nyc/LocationMgr'
import NycGeoclient from 'nyc/Geoclient'
import NycOlLocator from 'nyc/ol/Locator'
import NycOlMapLocator from 'nyc/ol/MapLocator'
import NycOlZoomSearch from 'nyc/ol/ZoomSearch'

/**
 * @desc A class for managing user-specified location information
 * @public
 * @class
 * @extends module:nyc/LocationMgr~LocationMgr
 * @fires module:nyc/Locator~Locator#geocoded
 * @fires module:nyc/Locator~Locator#geolocated
 */
class LocationMgr extends NycLocationMgr {
  /**
   * @desc Create an instance of LocationMgr
   * @public
   * @constructor
   * @param {module:nyc/ol/LocationMgr~LocationMgr.Options} options Constructor options
   */
  constructor(options) {
    super({
      zoomSearch: new NycOlZoomSearch(options.map),
      locator: new NycOlLocator({
        geocoder: new NycGeoclient({url: options.url})
      }),
      mapLocator: new NycOlMapLocator({map: options.map})
    })
  }
}

/**
 * @desc Constructor options for {@link module:nyc/ol/LocationMgr~LocationMgr}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 * @property {string} url The geoclient URL
 */
LocationMgr.Options

export default LocationMgr
