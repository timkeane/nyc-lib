/**
 * @module nyc/ol/FrameworkMap
 */

import $ from 'jquery'
import StandardCsv from 'nyc/ol/format/StandardCsv'
import CsvPoint from 'nyc/ol/format/CsvPoint'
import Decorate from 'nyc/ol/format/Decorate'
import AutoLoad from 'nyc/ol/source/AutoLoad'
import Basemap from 'nyc/ol/Basemap'
import LocationMgr from 'nyc/ol/LocationMgr'
import MultiFeaturePopup from 'nyc/ol/MultiFeaturePopup'
import FinderApp from 'nyc/ol/FinderApp'
import Layer from 'ol/layer/Vector'
import {defaults as interactionDefaults} from 'ol/interaction'

/**
 * @desc Class that provides an nyc.ol.Basemap with controls and data from CSV
 * @public
 * @class
 */
class FrameworkMap {
  /**
   * @desc Create an instance of Basemap
   * @public
   * @constructor
   * @param {module:nyc/ol/FrameworkMap~FrameworkMap.Options} options Constructor options
   */
  constructor(options) {
    /**
     * @desc The data to display in the map layer
     * @public
     * @member {module:nyc/ol/format/CsvPoint~CsvPoint}
     */
    this.source = new AutoLoad({
      url: options.csvUrl,
      format: new Decorate({
        decorations: this.getDecorations(options.decorations),
        parentFormat: new CsvPoint({autoDetect: true})
      })
    })
    this.source.autoLoad()
    /**
     * @desc The layer to display on the map
     * @public
     * @member {module:nyc/ol/Basemap~Basemap}
     */
    this.layer = new Layer({
      source: this.source,
      zIndex: 1000
    })
    /**
     * @desc The map
     * @public
     * @member {module:nyc/ol/Basemap~Basemap}
     */
    this.map = new Basemap({
      target: $(options.mapTarget).get(0),
      interactions: interactionDefaults({
        mouseWheelZoom: options.mouseWheelZoom === true
      }),
      layers: [this.layer]
    })
    new LocationMgr({
      map: this.map,
      searchTarget: options.searchTarget,
      url: options.geoclientUrl
    })
    new MultiFeaturePopup({
      map: this.map,
      layers: [this.layer]
    })
  }
  /**
   * @private
   * @method
   * @param {Array<Object<string, Object>>|undefined} decorations Optional decorations
   * @returns {Array<Object<string, Object>>} The combined decorations
   */
  getDecorations(decorations) {
    decorations = decorations || []
    decorations.push(FinderApp.FEATURE_DECORATIONS)
    decorations.push(FrameworkMap.DECORATIONS)
    return decorations
  }
}

FrameworkMap.DECORATIONS = {
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
    return `${this.get(StandardCsv.CITY)}, ${this.get(StandardCsv.STATE) || ''} ${this.get(StandardCsv.ZIP)}`
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

/**
 * @desc Constructor options for {@link module:nyc/ol/FrameworkMap~FrameworkMap}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} mapTarget The DOM target for the map
 * @property {string} geoclientUrl The geoclient URL
 * @property {string} csvUrl The CSV data URL for locations to map
 * @property {jQuery|Element|string=} searchTarget The DOM target for the search box
 * @property {Array<Object<string, Object>>=} decorations Feature decorations
 * @property {boolean} [mouseWheelZoom=false] Allow mouse wheel map zooming
 */
FrameworkMap.Options

export default FrameworkMap
