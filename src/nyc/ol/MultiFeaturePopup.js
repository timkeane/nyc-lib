/**
 * @module nyc/ol/MultiFeaturePopup
 */

import $ from 'jquery'

import olExtent from 'ol/extent'

import nyc from 'nyc/nyc'
import ItemPager from 'nyc/ItemPager'
import FeaturePopup from 'nyc/ol/FeaturePopup'

/**
 * @desc A class to display popups on a map
 * @public
 * @class
 * @extends {ol.Overlay}
 * @constructor
 * @see http://www.openlayers.org/
 */
class MultiFeaturePopup extends FeaturePopup {
  /**
   * @desc Create an instance of FeaturePopup
   * @public
   * @constructor
   * @param {FeaturePopup.Options} options Constructor options
   * @see http://www.openlayers.org/
   */
  constructor(options) {
    super(options)
    /**
     * @private
     * @member {Array<ol.layer.Vector>}
     */
    this.layers = []
    /**
     * @private
     * @member {ItemPager}
     */
    this.pager = new ItemPager({
      target: this.content
    })
    this.addLayers(options.layers)
    this.pager.on('change', this.pan, this)
  }
  /**
   * @desc Show the popup
   * @public
   * @method
   * @param {Array<ol.Feature>} features The features
   */
  showFeatures(features, coordinate) {
    coordinate = coordinate || olExtent.getCenter(features[0].getGeometry().getExtent())
    this.pager.show(features)
    this.show({coordinate: coordinate})
  }
  /**
   * @method
   * @override
   * @param {ol.MapBrowserEvent} event
   */
  mapClick(event) {
    const id = this.getId()
    const features = []
    this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      if (layer.get('popup-id') === id) {
        features.push(feature)
      }
    })
    if (features.length) this.showFeatures(features, event.coordinate)
  }
}

export default MultiFeaturePopup
