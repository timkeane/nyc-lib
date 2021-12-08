/**
 * @module nyc/LocationMgr
 */
import nyc from 'nyc'
import EventHandling from 'nyc/EventHandling'
import Dialog from 'nyc/Dialog'

const proj4 = nyc.proj4

/**
 * @desc A class for managing user-specified location information
 * @public
 * @class
 * @extends module:nyc/EventHandling~EventHandling
 * @fires module:nyc/Locator~Locator#geocoded
 * @fires module:nyc/Locator~Locator#geolocated
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
     * @desc The Zoom
     * @public
     * @member {module:nyc/Zoom~Zoom}
     */
    this.zoom = options.zoom
    /**
     * @desc The Geolocate
     * @public
     * @member {module:nyc/Geolocate~Geolocate}
     */
    this.geolocate = options.geolocate
    /**
     * @desc The Search
     * @public
     * @member {module:nyc/Search~Search}
     */
    this.search = options.search
    /**
     * @desc The Locator
     * @public
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
    this.dialog = new Dialog({
      target: options.dialogTarget
    })
    /**
     * @private
     * @member {boolean}
     */
    this.autoLocate = options.autoLocate || false
    this.hookupEvents()
    this.locateFromQueryString(document.location.search)
  }
  /**
   * @desc Zoom and center on the provided location
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
    this.locator.on('geocoded', this.located, this)
    this.locator.on('geolocated', this.located, this)
    this.locator.on('ambiguous', this.ambiguous, this)
    this.locator.on('error', this.error, this)
    this.search.on('disambiguated', this.located, this)
    this.search.on('search', this.locator.search, this.locator)
    this.geolocate.on('geolocate', this.locator.locate, this.locator)
  }
  /**
   * @desc Navigate the map to a given location
   * @public
   * @method
   * @param {string} location A location
   */
  goTo(location) {
    if (location.indexOf('EPSG') > -1) {
      location = location.split(',')
      const proj = this.mapLocator.getProjection().getCode()
      const coord = proj4(location[2], proj, [location[0] * 1, location[1] * 1])
      this.mapLocator.zoomLocation({coordinate: coord})
    } else {
      this.locator.search(location)
    }
  }
  /**
   * @private
   * @method
   * @param {string} qstr Query string
   */
  locateFromQueryString(qstr) {
    const args = {}
    try {
      qstr = decodeURIComponent(qstr)
      qstr.substr(1).split('&').forEach(param => {
        const p = param.split('=')
        args[p[0]] = decodeURIComponent(p[1])
      })
    } catch (ignore) {
      /* empty */
    }
    if (args.location) {
      this.goTo(args.location)
    } else if (this.autoLocate) {
      this.locator.locate()
    }
  }
  /**
   * @private
   * @method
   * @param {module:nyc/Locator~Locator.Result} data Result data
   */
  located(data) {
    this.search.val(data.type === 'geolocated' ? '' : data.name)
    if (data.coordinate) {
      this.mapLocator.zoomLocation(data, () => {
        this.trigger(data.type, data)
      })
    } else {
      this.search.triggerSearch(data.name)
    }
  }
  /**
   * @private
   * @method
   * @param {module:nyc/Locator~Locator.Ambiguous} data Data
   */
  ambiguous(data) {
    if (data.possible.length) {
      this.search.disambiguate(data)
    } else {
      const message = '<span class="msg-unk-addr">The location you entered was not understood</span>'
      this.dialog.ok({message})
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
 * @desc Constructor options for {@link module:nyc/LocationMgr~LocationMgr}
 * @public
 * @typedef {Object}
 * @property {module:nyc/Zoom~Zoom} zoom The UX zoom control for user input
 * @property {module:nyc/Geolocate~Geolocate} geolocate The UX geolocate control for user input
 * @property {module:nyc/Search~Search} search The UX search control for user input
 * @property {module:nyc/Locator~Locator} locator The geocoding and geolocation provider
 * @property {module:nyc/MapLocator~MapLocator} mapLocator The mapLocator used to manipulate a map
 * @property {boolean} [autoLocate=false] Automatically locator using device geolocation on load
 * @property {jQuery|Element|string} [dialogTarget=body] The DOM target in which to display error dialog
 */
LocationMgr.Options

export default LocationMgr
