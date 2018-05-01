/**
 * @module nyc/LocationMgr
 */

import EventHandling from 'nyc/EventHandling'
import Locator from 'nyc/Locator'
import ZoomSearch from 'nyc/ZoomSearch'

/**
 * @desc A class for managing user-specified location information
 * @public
 * @class
 * @extends {EventHandling}
 * @constructor
 * @param {LocationMgr.Options} options Constructor options
 * @fires Locator#geocode
 * @fires Locator#geolocation
 */
class LocationMgr extends EventHandling {
  constructor(options) {
    super()
    /**
     * @desc The search controls
     * @public
     * @member {ZoomSearch}
     */
    this.controls = options.controls
    /**
     * @private
     * @member {Locator}
     */
    this.locator = options.locator
    /**
     * @private
     * @member {nyc.Locator}
     */
    this.mapLocator = options.mapLocator
    /**
     * @private
     * @member {nyc.Dialog}
     */
    //this.dialog = new nyc.Dialog()
    /**
     * @private
     * @member {boolean}
     */
    this.autoLocate = options.autoLocate || false
    this.locator.on(Locator.EventType.GEOCODE, this.located, this)
    this.locator.on(Locator.EventType.GEOLOCATION, this.located, this)
    this.locator.on(Locator.EventType.AMBIGUOUS, this.ambiguous, this)
    this.locator.on(Locator.EventType.ERROR, this.error, this)
    this.controls.on(ZoomSearch.EventType.SEARCH, this.locator.search, this.locator)
    this.controls.on(ZoomSearch.EventType.GEOLOCATE, this.locator.locator, this.locator)
    this.controls.on(ZoomSearch.EventType.DISAMBIGUATED, this.located, this)
    this.locateFromQueryString()
  }
	/**
	 * @desc Geocode an input string representing a location
	 * @public
	 * @method
	 * @param {Locator.Result} data The location
	 */
	setLocation(data) {
		this.mapLocator.setLocation(data)
	}
	/** 
	 * @private 
	 * @method
	 */
	error() {
		this.controls.searching(false)
    //this.dialog.ok({message: 'Failed to contact geocoder'})
    console.error('Failed to contact geocoder')
	}
	/** 
	 * @private 
	 * @method
	 * @param {Locator.Ambiguous} data
	 */
	ambiguous(data) {
    this.controls.searching(false)
		if (data.possible.length) {
			this.controls.disambiguate(data)
		} else {
      //this.dialog.ok({message: 'The location you entered was not understood'})
      console.warn('The location you entered was not understood')
		}
	}
	/**
	 * @private
	 * @method
	 * @param {Locator.Result} data 
	 */
	located(data) {
		this.controls.val(data.type === Locator.EventType.GEOLOCATION ? '' : data.name)
		this.mapLocator.zoomLocation(data => {
			this.trigger(data.type, data)
		})
	}
	/** 
	 * @private 
	 * @method
	 */
	locateFromQueryString() {
    const qstr = document.location.search
    const args = {}
		try {
      qstr.substr(1).split("&").foEach(param => {
        const p = params.split("=")
        args[p[0]] = decodeURIComponent(p[1])
      })
		} catch (ignore) {}
		if (args.address) {
			this.locator.search(args.address)
		} else if (this.autoLocate) {
			this.locator.locate()
		}
	}
}

/**
 * @desc Object type to hold constructor options for {@link LocationMgr}
 * @public
 * @typedef {Object}
 * @property {ZoomSearch} controls The UX controls for user input
 * @property {Locator} locator The geocoding and geolocation provider
 * @property {nyc.Locator} mapLocator The mapLocator used to manipulate a map
 * @property {boolean} [autoLocate=false] Automatically locator using device geolocation on load
 */
LocationMgr.Options

export default LocationMgr


