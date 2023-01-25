/**
 * @module nyc/ol/source/FilterAndSort
 */

import $ from 'jquery'

import {get as olProjGetProjection} from 'ol/proj'
import OlGeomLineString from 'ol/geom/LineString'
import AutoLoad from './AutoLoad'

import {get as olProjGet} from 'ol/proj'

const FEET_PRE_METER = 3.28084

/**
 * @desc Class to filter and sort features
 * @public
 * @class
 * @extends Autoload
 */
class FilterAndSort extends AutoLoad {
  /**
   * @desc Create an instance of FilterAndSort
   * @public
   * @constructor
   * @param {olx.source.VectorOptions} options Constructor options
   * @param {boolean} [metric=false] Use metric units
   */
  constructor(options, metric) {
    super(options)
    /**
     * @private
     * @member {boolean}
     */
    this.metric = metric
    /**
     * @private
     * @member {Array<ol.Feature>}
     */
    this.allFeatures = options.features || []
    this.storeFeatures = this.storeFeatures.bind(this);
    this.on('change:autoload-complete', this.storeFeatures)
  }
  /**
   * @desc Filters the features of this source
   * @public
   * @method
   * @param {Array<Array<module:nyc/ol/source/FilterAndSort~FilterAndSort.Filter>>} filters Used to filter features by attributes
   * @return {Array<ol.Feature>} An array of features contained in this source that are the result of the intersection of the applied filters
   */
  filter(filters) {
    const filteredFeatures = this.allFeatures.filter(feature => {
      return filters.every(fltrs => {
        return fltrs.some(flt => {
          return $.inArray(feature.get(flt.property), flt.values) > -1
        })
      })
    })
    this.clear(true)
    this.addFeatures(filteredFeatures)
    return filteredFeatures
  }
  /**
   * @private
   * @method
   * @param {ol.Coordinate} coordinate The coordinate from which to measure distance to features
   * @param {Number=} count The number of features to return
   * @return {Array<ol.Feature>} The features, each decorated with a getDistance function that returns a {@link module:nyc/ol/source/FilterAndSort~FilterAndSort.Distance} object
   */
  doSort(coordinate, count) {
    const features = this.getFeatures()
    features.sort((f0, f1) => {
      const dist0 = this.distance(coordinate, f0.getGeometry())
      const dist1 = this.distance(coordinate, f1.getGeometry())
      if (count === undefined) {
        f0.set('__distance', dist0)
        f1.set('__distance', dist1)
        $.extend(f0, FilterAndSort.DistanceDecoration)
        $.extend(f1, FilterAndSort.DistanceDecoration)
      }
      if (dist0.distance < dist1.distance) {
        return -1
      } else if (dist0.distance > dist1.distance) {
        return 1
      }
      return 0
    })
    if (count > 0) {
      return features.slice(0, count)
    }
    return features
  }
  /**
   * @desc Sort features by distance from a coordinate
   * @public
   * @method
   * @param {ol.Coordinate} coordinate The coordinate from which to measure distance to features
   * @return {Array<ol.Feature>} The features, each decorated with a getDistance function that returns a {@link module:nyc/ol/source/FilterAndSort~FilterAndSort.Distance} object
   */
  sort(coordinate) {
    return this.doSort(coordinate)
  }
  /**
   * @desc Get nearest n features from a coordinate
   * @public
   * @method
   * @param {ol.Coordinate} coordinate The coordinate from which to measure distance to features
   * @param {Number=} count The number of features to return
   * @return {Array<ol.Feature>} The features
   */
  nearest(coordinate, count) {
    return this.doSort(coordinate, count)
  }
  /**
   * @private
   * @method
   * @param {ol.Coordinate} coordinate The OpenLayers coordinate object
   * @param {ol.geom.Geometry} geom The OpenLayers geometry object
   * @return {module:nyc/FilterAndSort~FilterAndSort.Distance} Distance object
   */
  distance(coordinate, geom) {
    if (!geom) {
      return {distance: Infinity, units: 'ft'}
    }
    const line = new OlGeomLineString([coordinate, geom.getClosestPoint(coordinate)])
    const projections = this.projections(this.getFormat())
    let units = projections[1].getUnits()
    if (projections[0] && projections[0].getUnits() !== 'degrees') {
      line.transform(projections[1], projections[0])
      units = projections[0].getUnits()
    }
    if (units !== 'ft' && !this.metric) {
      return {distance: line.getLength() * FEET_PRE_METER, units: 'ft'}
    }
    return {distance: line.getLength(), units: units}
  }
  /**
   * @private
   * @method
   * @param {ol.format.Feature} format OpenLayers format
   * @return {Array<ol.proj.Projection>} Array of projections
   */
  projections(format) {
    const parentFormat = format ? format.parentFormat : null
    let dataProj = 'EPSG:3857'
    let featureProj = 'EPSG:3857'
    if (parentFormat) {
      dataProj = olProjGet(parentFormat.dataProjection)
      featureProj = olProjGet(parentFormat.featureProjection || 'EPSG:3857')
    } else if (format) {
      dataProj = olProjGet(format.dataProjection)
      featureProj = olProjGet(format.featureProjection || 'EPSG:3857')
    }
    return [olProjGetProjection(dataProj), olProjGetProjection(featureProj)]
  }
  /**
   * @desc Remove a feature
   * @public
   * @override
   * @method
   * @param {ol.Feature} feature The feature to remove
   */
  removeFeature(feature) {
    super.removeFeature(feature)
    const idx = $.inArray(feature, this.allFeatures)
    this.allFeatures.splice(idx, 1)
  }
  /**
   * @private
   * @method
   */
  storeFeatures() {
    this.allFeatures = this.getFeatures()
  }
}

/**
 * @public
 * @typedef {Object}
 * @property {number} distance The distance
 * @property {string} units The distance units
 */
FilterAndSort.Distance

/**
 * @desc Argument object for {@link module:nyc/ol/source/FilterAndSort~FilterAndSort#filter}
 * @public
 * @typedef {Object}
 * @property {string} property The property name on which to filter features
 * @property {Array<string>} values The values used to filter features
 */
FilterAndSort.Filter

/**
 * @desc Mixin for features
 * @private
 * @typedef {Object<string, function>}
 */
FilterAndSort.DistanceDecoration = {
  /**
   * @desc Mixin for features
   * @private
   * @method
   * @return {module:nyc/FilterAndSort~FilterAndSort.Distance} Distance
   */
  getDistance() {
    return this.get('__distance')
  }
}

export default FilterAndSort
