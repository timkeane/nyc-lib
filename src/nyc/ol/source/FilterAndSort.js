/**
 * @module nyc/ol/source/FilteringAndSorting
 */

import $ from 'jquery'

import OlGeomLineString from 'ol/geom/linestring'
import OlProjProjection from 'ol/proj/projection'

import nyc from 'nyc/nyc'
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
    this.allFeatures = options.features || null
    this.on('change:autoload-complete', $.proxy(this.storeFeatures, this))
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
   * @desc Sort features by distance from a coordinate
   * @public
   * @method
   * @return {Array<ol.Feature>} features
   */
  sort(coordinate) {
    const features = this.getFeatures()
    features.sort((f0, f1) => {
      const geom0 = f0.getGeometry()
      const geom1 = f1.getGeometry()
      const dist0 = this.distance(coordinate, f0.getGeometry())
      const dist1 = this.distance(coordinate, f1.getGeometry())
      f0.set('__distance', dist0)
      f1.set('__distance', dist1)
      $.extend(f0, FilterAndSort.DistanceDecoration)
      $.extend(f1, FilterAndSort.DistanceDecoration)
      if (dist0.distance < dist1.distance) {
        return -1
      }else if (dist0.distance > dist1.distance) {
        return 1
      }
			return 0
    })
    return features
  }
  distance(coordinate, geom) {
    const line = new OlGeomLineString([coordinate, geom.getClosestPoint(coordinate)])
    const projections = this.projections(this.getFormat())
    if (projections[0]) {
      line.transform(projections[1], projections[0])
    }
    return {
      distance: line.getLength(),
      units: projections[0] ? projections[0].getUnits() : undefined
    }
  }
  projections(format) {
    const parentFormat = format ? format.parentFormat : null
    let dataProj
    let featureProj
    if (parentFormat) {
      dataProj = parentFormat.defaultDataProjection
      featureProj = parentFormat.defaultFeatureProjection || 'EPSG:3857'
    } else if (format) {
      dataProj = format.defaultDataProjection
      featureProj = format.defaultFeatureProjection || 'EPSG:3857'
    }
    if (dataProj) {
      dataProj = dataProj.getCode ? dataProj : new OlProjProjection({code: dataProj})
    }
    return [dataProj, featureProj]
  }
  storeFeatures() {
    this.allFeatures = this.getFeatures()
  }
}

/**
 * @desc Mixin for features
 * @private
 * @typedef {Object}
 */
FilterAndSort.DistanceDecoration = {
  getDistance() {
    return this.get('__distance')
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
