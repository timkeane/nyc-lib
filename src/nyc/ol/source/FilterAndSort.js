/**
 * @module nyc/ol/source/FilteringAndSorting
 */

import $ from 'jquery'

import OlGeomLineString from 'ol/geom/linestring'

import AutoLoad from 'nyc/ol/source/AutoLoad'

/**
 * @desc Class to auto load all features from a URL
 * @public
 * @class
 * @extends {ol.source.Vector}
 */
class FilterAndSort extends AutoLoad {
  /**
   * @desc Creates an instance of AutoLoad
   * @public
   * @constructor
   * @extends {ol.source.Vector}
   * @param {Object} options
   */
  constructor(options) {
    super(options)
    /**
     * @private
     * @member {Array<ol.Feature>}
     */
    this.allFeatures = null
  }
  /**
   * @desc Filters the features of this source
   * @public
   * @method
   * @param {Array<FilterAndSort.Filter>} filters Used to filter features by attributes
   * @return {Array<ol.Feature>} An array of features contained in this source that are the result is the intersection of the applied filters
   */
  filter(filters) {
    const filteredFeatures = []
    const filtered = {}
    this.allFeatures = this.allFeatures || this.getFeatures()
    this.allFeatures.forEach(feature => {
  		let incl = true
  		filters.every(filter => {
  			incl = $.inArray(feature.get(filter.property), filter.values) > -1
  			return !incl
  		})
  		if (incl) {
				filtered[feature.getId()] = true
				filteredFeatures.push(feature)
  		}
  	})
  	this.clear(true)
  	this.addFeatures(filteredFeatures)
    return filteredFeatures
  }
  /**
   * @desc Sort features by distance from a coordiante
   * @public
   * @method
   * @return {Array<ol.Feature>} features
   */
  sort(coordiante) {
    const features = this.getFeatures()
    features.sort((f0, f1) => {
      const geom0 = f0.getGeometry()
      const geom1 = f1.getGeometry()
      const coord0 = geom0.getClosestPoint(coordiante)
      const coord1 = geom1.getClosestPoint(coordiante)
      const dist0 = new OlGeomLineString([coordiante, coord0]).getLength()
      const dist1 = new OlGeomLineString([coordiante, coord1]).getLength()
      f0.set('distance', dist0)
      f1.set('distance', dist1)
      if (dist0 < dist1) {
        return -1
      }else if (dist0 > dist1) {
        return 1
      }
			return 0
    })
    return features
  }
}

/**
 * @desc Object to use for filtering the features of an instance of {@see FilterAndSort}
 * @public
 * @typedef {Object}
 * @property {string} property The property name on which to filter features
 * @property {Array<string>} values The valid values for the property
 */
FilterAndSort.Filter

export default FilterAndSort
