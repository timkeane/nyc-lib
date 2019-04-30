/**
 * @module nyc/ol/format/Waze
 */

import OlFeature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import OlFormatFeature from 'ol/format/Feature'
import OlFormatFormatType from 'ol/format/FormatType'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Circle from 'ol/style/Circle'
/**
 * @desc Class to create features from Carto SQL API data.  This format requires the presence of a WTK geometry in the source data with the column name wkt_geom.
 * @public
 * @class
 * @extends ol.format.Feature
 * @see http://openlayers.org/en/latest/apidoc/module-ol_format_Feature-FeatureFormat.html
 */
class Waze extends OlFormatFeature {
  /**
   * @desc Create an instance of CartoSql
   * @public
   * @constructor
   * @param {module:nyc/ol/format/Waze~Waze.Options} options Constructor options
   */
  constructor(options) {
    super()
    options = options || {}
    /**
     * @private
     * @member {ol.ProjectionLike}
     */
    this.dataProjection = 'EPSG:4326'
    /**
     * @private
     * @member {ol.ProjectionLike}
     */
    this.featureProjection = options.featureProjection || 'EPSG:3857'
  }
  /**
   * @desc Read a single feature from a source
   * @public
   * @method
   * @param {Object} source A Waze alert or jam object
   * @return {ol.Feature} Feature
   */
  readFeature(source) {
    const feature = new OlFeature(source)
    try {
      const location = source.location
      let geom
      if (location) {
        geom = new Point([location.x, location.y])
      } else {
        const coords = []
        source.line.forEach(coord => {
          coords.push([coord.x, coord.y])
        })
        geom = new LineString(coords)
      }
      geom.transform(this.dataProjection, this.featureProjection)
      feature.setGeometry(geom)
    } catch (badGeom) {
      console.error(badGeom)
      feature.setGeometry(new Point([0, 0]))
    }
    feature.setId(source.uuid)
    feature.setStyle(Waze.Style)
    return feature
  }
  /**
   * @desc Read all features from a source
   * @public
   * @method
   * @param {string} source Response from a Carto SQL data source
   * @return {Array.<ol.Feature>} Features
   */
  readFeatures(source) {
    const features = []
    const waze = JSON.parse(source)
    waze.jams.forEach(jam => {
      features.push(this.readFeature(jam))
    })
    waze.alerts.forEach(alert => {
      features.push(this.readFeature(alert))
    })
    return features
  }
  /**
   * @desc Read the projection from a source
   * @public
   * @override
   * @method
   * @param {Document|Node|Object|string} source Source
   * @return {ol.proj.Projection} The projection
   */
  readProjection(source) {
    return 'EPSG:4326'
  }
  /**
   * @desc Get the extent from the source of the last readFeatures call
   * @public
   * @override
   * @method
   * @return {ol.Extent} The extent
   */
  getLastExtent() {
    return null
  }
  /**
   * @desc Return format type
   * @public
   * @override
   * @method
   * @return {ol.format.FormatType} The format type
   */
  getType() {
    return OlFormatFormatType.TEXT
  }
}

/**
* @desc Constructor options for {@link module:nyc/ol/format/Waze~Waze}
* @public
* @typedef {Object}
* @property {string} [featureProjection=EPSG:3857] The feature projection needed for the map
*/
Waze.Options

Waze.TypeColors = {
  ACCIDENT: 'yellow',
  JAM: 'orange',
  ROAD_CLOSED: 'red',
  WEATHERHAZARD: 'blue',
  Small: 'yellow',
  Medium: 'orange',
  Large: 'red'
}

Waze.Style = (feature, resolution) => {
  if (feature.getGeometry().getType() === 'Point') {
    return new Style({
      image: new Circle({
        radius: 5,
        stroke: new Stroke({color: '#000'}),
        fill: new Fill({
          color: Waze.TypeColors[feature.get('type')] || '#000'
        })
      })
    })
  } else {
    return new Style({
      stroke: new Stroke({
        width: 5,
        color: Waze.TypeColors[feature.get('type')] || '#000'
      })
    })
  }
} 

export default Waze
