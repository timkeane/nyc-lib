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

    const geocoder = options.geocoder || new NycGeoclient({url: options.url})

    super({
      search: new NycOlSearch(searchTarget),
      zoom: new NycOlZoom(map),
      dialogTarget: options.dialogTarget,
      geolocate: new NycOlGeolocate(map),
      locator: new NycOlLocator({geocoder: geocoder}),
      mapLocator: new NycOlMapLocator({map: map})
    })
  }
}

/**
 * @desc Constructor options for {@link module:nyc/ol/LocationMgr~LocationMgr}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 * @property {string=} url The geoclient URL if geocoder is not provided
 * @property {module:nyc/Geocoder~Geocoder=} geocoder The geocoder if geoclient URL is not provided
 * @property {jQuery|Element|string=} searchTarget The DOM target for the search box
 * @property {jQuery|Element|string} [dialogTarget=body] The DOM target in which to display error dialog
 */
LocationMgr.Options

export default LocationMgr
