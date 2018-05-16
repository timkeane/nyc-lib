/**
 * @module nyc/LocationMgr
 */

import EventHandling from 'nyc/EventHandling'
import Locator from 'nyc/Locator'
import ZoomSearch from 'nyc/ZoomSearch'
import Dialog from 'nyc/Dialog'

/**
 * @desc A class for managing user-specified location information
 * @public
 * @class
 * @extends {module:nyc/EventHandling~EventHandling}
 * @fires module:nyc/Locator#geocode
 * @fires module:nyc/Locator#geolocation
 */
class LocationMgr extends EventHandling {
  /**
   * @desc Create an instance of LocationMgr
   * @public
   * @constructor
   * @param {module:nyc/LocationMgr~LocationMgr.Options} options Constructor options
   */
  constructor(options) {
    super()
    /**
     * @desc The search zoomSearch
     * @public
     * @member {module:nyc/ZoomSearch~ZoomSearch}
     */
    this.zoomSearch = options.zoomSearch
    /**
     * @private
     * @member {module:nyc/Locator~Locator}
     */
    this.locator = options.locator
    /**
     * @private
     * @member {module:nyc/MapLocator~MapLocator}
     */
    this.mapLocator = options.mapLocator
    /**
     * @private
     * @member {module:nyc/Dialog~Dialog}
     */
    this.dialog = new Dialog()
    /**
     * @private
     * @member {boolean}
     */
    this.autoLocate = options.autoLocate || false
    this.hookupEvents()
    this.locateFromQueryString(document.location.search)
  }
	/**
	 * @desc Geocode an input string representing a location
	 * @public
	 * @method
	 * @param {module:nyc/Locator~Locator.Result} data The location
	 */
	setLocation(data) {
		this.mapLocator.setLocation(data)
	}
  /**
	 * @private
	 * @method
	 */
   hookupEvents() {
     this.locator.on(Locator.EventType.GEOCODE, this.located, this)
     this.locator.on(Locator.EventType.GEOLOCATION, this.located, this)
     this.locator.on(Locator.EventType.AMBIGUOUS, this.ambiguous, this)
     this.locator.on(Locator.EventType.ERROR, this.error, this)
     this.zoomSearch.on(ZoomSearch.EventType.DISAMBIGUATED, this.located, this)
     this.zoomSearch.on(ZoomSearch.EventType.SEARCH, this.locator.search, this.locator)
     this.zoomSearch.on(ZoomSearch.EventType.GEOLOCATE, this.locator.locate, this.locator)
   }
   /**
 	 * @private
   * @method
   * @param {string} qstr
 	 */
 	locateFromQueryString(qstr) {
    const args = {}
 		try {
       qstr.substr(1).split("&").forEach(param => {
         const p = param.split("=")
         args[p[0]] = decodeURIComponent(p[1])
       })
 		} catch (ignore) {}
 		if (args.address) {
 			this.locator.search(args.address)
 		} else if (this.autoLocate) {
 			this.locator.locate()
 		}
 	}
  /**
	 * @private
	 * @method
	 * @param {module:nyc/Locator~Locator.Result} data
	 */
	located(data) {
		this.zoomSearch.val(data.type === Locator.EventType.GEOLOCATION ? '' : data.name)
		this.mapLocator.zoomLocation(data, () => {
			this.trigger(data.type, data)
		})
	}
	/**
	 * @private
	 * @method
	 * @param {module:nyc/Locator~Locator.Ambiguous} data
	 */
	ambiguous(data) {
		if (data.possible.length) {
			this.zoomSearch.disambiguate(data)
		} else {
      this.dialog.ok({message: 'The location you entered was not understood'})
		}
	}
  /**
	 * @private
	 * @method
	 */
	error() {
    this.dialog.ok({message: 'Failed to contact geocoder'})
	}
}

/**
 * @desc Object type to hold constructor options for {@link LocationMgr}
 * @public
 * @typedef {Object}
 * @property {module:nyc/ZoomSearch~ZoomSearch} zoomSearch The UX zoom search controls for user input
 * @property {module:nyc/Locator~Locator} locator The geocoding and geolocation provider
 * @property {module:nyc/MapLocator~MapLocator} mapLocator The mapLocator used to manipulate a map
 * @property {boolean} [autoLocate=false] Automatically locator using device geolocation on load
 */
LocationMgr.Options

export default LocationMgr
