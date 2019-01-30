/**
 * @module nyc/ol/FrameworkMap
 */

import $ from 'jquery'
import MapMgr from 'nyc/ol/MapMgr'
import StandardCsv from 'nyc/ol/format/StandardCsv'
import CsvPoint from 'nyc/ol/format/CsvPoint'

/**
 * @desc Class that provides {@link module:nyc/ol/Basemap~Basemap}, {@link module:nyc/ol/LocationMgr~LocationMgr} and displays facility data from CSV
 * @public
 * @class
 * @extends module:nyc/ol/MapMgr~MapMgr
 */
class FrameworkMap extends MapMgr {
  /**
   * @desc Create an instance of FrameworkMap
   * @public
   * @constructor
   * @param {module:nyc/ol/MapMgr~MapMgr.Options} options Constructor options
   */
  constructor(options) {
    if (options.facilitySearch !== false) {
      options.facilitySearch = {nameField: StandardCsv.NAME}
    }
    super(options)
    this.pager.find('h2.info.screen-reader-only').removeClass('screen-reader-only')
  }
  /**
   * @desc Crreate the parent format for the source
   * @public
   * @override
   * @param {module:nyc/ol/MapMgr~MapMgr.Options} options Constructor options
   * @returns {ol.format.Feature} The parent format
   */
  createParentFormat(options) {
    return new CsvPoint({
      url: options.facilityUrl,
      autoDetect: true
    })
  }  
  /**
   * @public
   * @override
   * @method
   * @param {module:nyc/ol/MapMgr~MapMgr.Options} options Constructor options
   * @returns {Array<Object<string, Object>>} The combined decorations
   */
  createDecorations(options) {
    const decorations = options.decorations || []
    decorations.push({app: this})
    decorations.push(MapMgr.FEATURE_DECORATIONS)
    decorations.push(FrameworkMap.FEATURE_DECORATIONS)
    return decorations
  }
}

FrameworkMap.FEATURE_DECORATIONS = {
  /**
   * @desc Returns the name of a facility feature
   * @public
   * @method
   * @returns {string} The name
   */
  getName() {
    return this.get(StandardCsv.NAME)
  },
  /**
   * @desc Returns the address line 1 of a facility feature
   * @public
   * @method
   * @returns {string} The address line 1
   */
  getAddress1() {
    return this.get(StandardCsv.ADDR1)
  },
  /**
   * @desc Returns the address line 2 of a facility feature
   * @public
   * @method
   * @returns {string} The address line 2
   */
  getAddress2() {
    return this.get(StandardCsv.ADDR2) || ''
  },
  /**
   * @desc Returns the city, state zip line of a facility feature
   * @public
   * @method
   * @returns {string} The city, state and zip
   */
  getCityStateZip() {
    return `${this.get(StandardCsv.CITY) || this.get(StandardCsv.BORO)}, ${this.get(StandardCsv.STATE) || 'NY'} ${this.get(StandardCsv.ZIP)}`
  },
  /**
   * @desc Returns the phone number for a facility feature
   * @public
   * @method
   * @returns {string} The phone number
   */
  getPhone() {
    return this.get(StandardCsv.PHONE) || ''
  },
  /**
   * @desc Returns the email for a facility feature
   * @public
   * @method
   * @returns {string} The email
   */
  getEmail() {
    return this.get(StandardCsv.EMAIL) || ''
  },
  /**
   * @desc Returns the website URL for a facility feature
   * @public
   * @method
   * @returns {string} The web site URL
   */
  getWebsite() {
    return this.get(StandardCsv.WEBSITE) || ''
  },
  /**
   * @desc Returns additional details for the facility feature
   * @public
   * @method
   * @returns {JQuery|Element|string} The detail HTML
   */
  detailsHtml() {
    const detail = this.get(StandardCsv.DETAIL)
    if (detail) {
      return $('<div></div>').append(detail)
    }
  }
}

export default FrameworkMap
