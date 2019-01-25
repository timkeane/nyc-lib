/**
 * @module nyc/ol/FrameworkMap
 */

import $ from 'jquery'
import CsvPoint from 'nyc/ol/format/CsvPoint'
import AutoLoad from 'nyc/ol/source/AutoLoad'
import Basemap from 'nyc/ol/Basemap'

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
     * @desc The CsvPoint
     * @public
     * @member {module:nyc/ol/format/CsvPoint~CsvPoint}
     */
    this.format = new CsvPoint({
      x: options.x || 'X'
    })

    /**
     * @desc The Map
     * @public
     * @member {module:nyc/ol/Basemap~Basemap}
     */
    this.data = new AutoLoad()

    /**
     * @desc The Map
     * @public
     * @member {module:nyc/ol/Basemap~Basemap}
     */
    this.map = new Basemap({
      target: $(options.mapTarget).get(0)
      // interactions: ol.interaction.defaults({
      //   mouseWheelZoom: options.mouseWheelZoom === true
      // })
    })

  }
}

/**
 * @desc Constructor options for {@link module:nyc/ol/FrameworkMap~FrameworkMap}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} mapTarget The DOM target for the map
 * @property {jQuery|Element|string=} searchTarget The DOM target for the search box
 * @property {boolean} [mouseWheelZoom=false] Allow mouse wheel map zooming
 */
FrameworkMap.Options
