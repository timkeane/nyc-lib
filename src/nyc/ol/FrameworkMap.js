/**
 * @module nyc/ol/FrameworkMap
 */

import $ from 'jquery'
import ListPager from 'nyc/ListPager'
import StandardCsv from 'nyc/ol/format/StandardCsv'
import CsvPoint from 'nyc/ol/format/CsvPoint'
import Decorate from 'nyc/ol/format/Decorate'
import MapLocator from 'nyc/MapLocator'
import FilterAndSort from 'nyc/ol/source/FilterAndSort'
import Basemap from 'nyc/ol/Basemap'
import LocationMgr from 'nyc/ol/LocationMgr'
import MultiFeaturePopup from 'nyc/ol/MultiFeaturePopup'
import FinderApp from 'nyc/ol/FinderApp'
import FeatureTip from 'nyc/ol/FeatureTip'
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
    const decorations = this.getDecorations(options.decorations)
    /**
     * @desc The data to display in the map layer
     * @public
     * @member {module:nyc/ol/format/CsvPoint~CsvPoint}
     */
    this.source = new FilterAndSort({
      url: options.csvUrl,
      format: new Decorate({
        decorations: decorations,
        parentFormat: new CsvPoint({autoDetect: true})
      })
    })
    this.source.autoLoad().then($.proxy(this.listFeatures, this))
    /**
     * @desc The data to display in the map layer
     * @public
     * @member {module:nyc/ol/format/CsvPoint~CsvPoint}
     */
    this.pager = options.listTarget ? new ListPager({target: options.listTarget}) : undefined
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
    /**
     * @desc The view
     * @public
     * @member {ol.View}
     */
    this.view = this.map.getView()
    /**
     * @desc The LocationMgr
     * @public
     * @member {module:nyc/ol/LocationMgr~LocationMgr}
     */
    this.locationMgr = new LocationMgr({
      map: this.map,
      searchTarget: options.searchTarget,
      url: options.geoclientUrl
    })
    /**
     * @desc The popup
     * @public
     * @member {module:nyc/ol/MultiFeaturePopup~MultiFeaturePopup}
     */
    this.popup = new MultiFeaturePopup({
      map: this.map,
      layers: [this.layer]
    })
    /**
     * @private
     * @member {module:nyc/Locator~Locator.Result}
     */
    this.location = {}
    new FeatureTip({
      map: this.map,
      tips: [{
        layer: this.layer,
        label: (feature) => {
          return {html: feature.getName()}
        }
      }]
    })
    this.locationMgr.on('geocoded', this.located, this)
    this.locationMgr.on('geolcated', this.located, this)
  }
  located(location) {
    this.location = location
    if (this.pager) {
      this.listFeatures(this.source.sort(location.coordinate))
    }
  }
  /**
   * @private
   * @method
   * @param {Array<Object<string, Object>>|undefined} decorations Optional decorations
   * @returns {Array<Object<string, Object>>} The combined decorations
   */
  getDecorations(decorations) {
    decorations = decorations || []
    decorations.push({app: this})
    decorations.push(FinderApp.FEATURE_DECORATIONS)
    decorations.push(FrameworkMap.FEATURE_DECORATIONS)
    return decorations
  }
  listFeatures(features) {
   if (this.pager) {
     this.pager.find('.info').removeClass('screen-reader-only')
     this.pager.reset(features)
   }
  }
  zoomTo(feature) {
    const popup = this.popup
    popup.hide()
    this.map.once('moveend', () => {
      popup.showFeature(feature)
    })
    this.view.animate({
      center: feature.getGeometry().getCoordinates(),
      zoom: MapLocator.ZOOM_LEVEL
    })
  }
  directionsTo(feature) {
    const from = encodeURIComponent(this.location.name)
    const to = encodeURIComponent(feature.getFullAddress())
    window.open(`https://www.google.com/maps/dir/${from}/${to}`)
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
    return `${this.get(StandardCsv.CITY)}, ${this.get(StandardCsv.STATE) || 'NY'} ${this.get(StandardCsv.ZIP)}`
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
 * @property {jQuery|Element|string=} listTarget The DOM target for the list of locations in the CSV
 * @property {Array<Object<string, Object>>=} decorations Feature decorations
 * @property {boolean} [mouseWheelZoom=false] Allow mouse wheel map zooming
 */
FrameworkMap.Options

export default FrameworkMap
