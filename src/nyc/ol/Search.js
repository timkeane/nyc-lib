/**
 * @module nyc/ol/Search
 */

import $ from 'jquery'

import OlGeoJSON from 'ol/format/GeoJSON'
import {getCenter as olExtentGetCenter} from 'ol/extent'

import NycSearch from 'nyc/Search'
import NycLocator from 'nyc/Locator'

/**
 * @desc Class for providing a set of buttons to zoom and search.
 * @public
 * @class
 * @extends {module:nyc/Search~Search}
 * @fires module:nyc/Search~Search#search
 * @fires module:nyc/Search~Search#disambiguated
 */
class Search extends NycSearch {
  /**
   * @desc Create an instance of Search
   * @constructor
   * @param {jQuery|Element|string} target The target
   */
  constructor(target) {
    super(target)
    /**
     * @private
     * @member {ol.format.GeoJSON}
     */
    this.geoJson = new OlGeoJSON()
    this.getContainer().on('click dblclick mouseover mousemove', () => {
      $('.f-tip').hide()
    })
  }
  /**
   * @public
   * @override
   * @method
   * @param {ol.Feature} feature The feature object
   * @param {module:nyc/Search~Search.FeatureSearchOptions} options Describes how to convert feature
   * @return {module:nyc/Locator~Locator.Result} The location
   */
  featureAsLocation(feature, options) {
    const geom = feature.getGeometry()
    return {
      name: options.nameField ? feature.get(options.nameField) : feature.getName(),
      coordinate: olExtentGetCenter(geom.getExtent()),
      geometry: JSON.parse(this.geoJson.writeGeometry(geom)),
      data: feature.getProperties(),
      type: 'geocoded',
      accuracy: NycLocator.Accuracy.HIGH
    }
  }
}

export default Search
