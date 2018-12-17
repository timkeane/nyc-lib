/**
 * @module nyc/ol/Locator
 */

import $ from 'jquery'

import nyc from 'nyc'

import NycLocator from 'nyc/Locator'

import OlGeolocation from 'ol/Geolocation'
import {toStringHDMS as olCoordinanteToStringHDMS} from 'ol/coordinate';
import {containsCoordinate} from 'ol/extent'

import {register as olProjRegister} from 'ol/proj/proj4'

const proj4 = nyc.proj4
olProjRegister(proj4)

/**
 * @desc A class for geocoding and geolocating in OpenLayers
 * @public
 * @class
 * @extends module:nyc/Locator~Locator
 */
class Locator extends NycLocator {
/**
 * @desc Create an instance of Locator
 * @public
 * @constructor
 * @param {module:nyc/ol/Locator~Locator.Options} options Constructor options
 */
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
    const name = olCoordinanteToStringHDMS(p)
    p = proj4('EPSG:4326', this.projection, p)
    if (this.withinLimit(p)) {
      if (this.locating) {
        this.track(false)
        this.locating = false
      }
      this.trigger('geolocated', {
        coordinate: p,
        heading: geo.getHeading(),
        accuracy: geo.getAccuracy() / this.metersPerUnit(),
        type: 'geolocated',
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
  withinLimit(coordinates) {
    return this.extentLimit ? containsCoordinate(this.extentLimit, coordinates) : true
  }
}

/**
 * @desc constructor options for {@link module:nyc/ol/Locator~Locator}
 * @public
 * @typedef {Object}
 * @property {module:nyc/Geocoder~Geocoder} geocoder A geocoder
 * @property {string} [projection=EPSG:3857] The EPSG code of the projection for output geometries (i.e. EPSG:2263)
 * @property {ol.Extent=} extentLimit Geolocation coordinates outside of this bounding box are ignored
 */
Locator.Options

export default Locator
