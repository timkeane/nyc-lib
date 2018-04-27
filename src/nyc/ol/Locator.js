/**
 * @module nyc/ol/Locator
 */

import $ from 'jquery'

import NycLocator from 'nyc/Locator'
import Geoclient from 'nyc/Geoclient'

import OlGeolocation from 'ol/geolocation'
import olCoordinate from 'ol/coordinate'
import olExtent from 'ol/extent'

/**
 * @desc A class for geocoding and geolocating
 * @public
 * @class
 * @extends {nyc/Locator}
 * @constructor
 * @param {nyc/ol/Locator/Options} options Constructor options
 */
class Locator extends Geoclient {
  constructor(options) {
    super(options)
    /**
  	 * @private
  	 * @member {boolean}
  	 */
  	this.locating = false
  	/**
  	 * @private
  	 * @member {ol.Extent}
  	 */
    this.extentLimit = options.extentLimit
    /**
  	 * @private
  	 * @member {ol.Geolocation}
  	 */
    this.geolocation = new OlGeolocation({
  		trackingOptions: {
  			maximumAge: 10000,
  			enableHighAccuracy: true,
  			timeout: 600000
  		}
  	})
    this.geolocation.on('change', $.proxy(this.geolocationChange, this))
  	this.geolocation.on('error', $.proxy(this.geolocationError, this))
  }
  /**
	 * @desc Locate once using device geolocation
	 * @public
   * @override
	 * @method
	 */
	locate() {
		this.locating = true
		this.geolocation.setTracking(true)
	}
	/**
	 * @desc Track using device geolocation
	 * @public
   * @override
	 * @method
	 * @param {boolean} track Track or not
	 */
	track(track) {
		this.geolocation.setTracking(track)
	}
  /**
   * @private
   * @method
   * @param {Object} error
   */
  geolocationError(error) {
    console.error(error.message, error)
  }
  /**
   * @private
   * @method
   */
  geolocationChange() {
    const geo = this.geolocation
    let p = geo.getPosition()
		const name = olCoordinate.toStringHDMS(p)
		p = this.project(geo.getPosition())
    if (this.withinLimit(p)) {
      if (this.locating) {
        this.track(false)
        this.locating = false
      }
      this.trigger(NycLocator.EventType.GEOLOCATION, {
        coordinate: p,
        heading: geo.getHeading(),
        accuracy: geo.getAccuracy() / this.metersPerUnit(),
        type: NycLocator.ResultType.GEOLOCATION,
        name: name
      })
    }
  }
  /**
	 * @private
	 * @method
	 * @param {ol.Coordinate} coordinates
	 * @return {boolean}
	 */
	withinLimit(coordinates){
		return this.extentLimit ? olExtent.containsCoordinate(this.extentLimit, coordinates) : true
	}
}

/**
 * @desc constructor options for {nyc/ol/Locator}
 * @public
 * @typedef {Object}
 * @property {string} url The URL for accessing the Geoclient API
 * @property {string} [projection=EPSG:3857] The EPSG code of the projection for output geometries (i.e. EPSG:2263)
 * @property {ol.Extent=} extentLimit Geolocation coordinates outside of this bounding box are ignored
 */
Locator.Options

export default Locator
