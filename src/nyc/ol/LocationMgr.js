/**
 * @module nyc/ol/LocationMgr
 */

import $ from 'jquery'
import NycLocationMgr from 'nyc/LocationMgr'
import NycGeoclient from 'nyc/Geoclient'
import NycOlLocator from 'nyc/ol/Locator'
import NycOlMapLocator from 'nyc/ol/MapLocator'
import NycOlZoom from 'nyc/ol/Zoom'
import NycOlGeolocate from 'nyc/ol/Geolocate'
import NycOlSearch from 'nyc/ol/Search'

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
    const map = options.map
    let searchTarget
    if (options.searchTarget !== undefined) {
      searchTarget = options.searchTarget
    } else {
      searchTarget = $(map.getTargetElement()).find('.ol-overlaycontainer-stopevent')
    }
  
    super({
      zoom: new NycOlZoom(map),
      geolocate: new NycOlGeolocate(map),
      search: new NycOlSearch(searchTarget),
      locator: new NycOlLocator({
        geocoder: new NycGeoclient({url: options.url})
      }),
      mapLocator: new NycOlMapLocator({map: map})
    })
  }
}

/**
 * @desc Constructor options for {@link module:nyc/ol/LocationMgr~LocationMgr}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 * @property {string} url The geoclient URL
 * @property {jQuery|Element|string=} searchTarget The DOM target for the search box
 */
LocationMgr.Options

export default LocationMgr
