/**
 * @module nyc/o/LocationMgr
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
 * @extends {nyc.LocationMgr}
 * @fires Locator#geocode
 * @fires Locator#geolocation
 */
class LocationMgr extends NycLocationMgr {
  /**
   * @desc Create an instance of LocationMgr
   * @public
   * @constructor
   * @param {LocationMgr.Options} options Constructor options
   */
  constructor(options) {
    super({
      zoomSearch: new NycOlZoomSearch(options.map),
      locator: new NycOlLocator({
        geocoder: new NycGeoclient({url: options.url})
      }),
      mapLocator: new NycOlMapLocator({map: map})
    })
  }
}

/**
 * @desc Object type to hold constructor options for {@link LocationMgr}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 * @property {string} url The geoclient URL
 */
LocationMgr.Options

export default LocationMgr
