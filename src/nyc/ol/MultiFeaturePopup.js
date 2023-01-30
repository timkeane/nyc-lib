/**
 * @module nyc/ol/MultiFeaturePopup
 */

import {getCenter as olExtentGetCenter} from 'ol/extent'

import ItemPager from '../ItemPager'
import FeaturePopup from './FeaturePopup'

/**
 * @desc A class to display popups on a map
 * @public
 * @class
 * @extends module:nyc/ol/FeaturePopup~FeaturePopup
 */
class MultiFeaturePopup extends FeaturePopup {
  /**
   * @desc Create an instance of MultiFeaturePopup
   * @public
   * @constructor
   * @param {module:nyc/ol/FeaturePopup~FeaturePopup.Options} options Constructor options
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
     * @member {module:nyc/ItemPager~ItemPager}
     */
    this.pager = new ItemPager({
      target: this.content
    })
    this.addLayers(options.layers)
    this.pager.on('change', this.paged, this)
  }
  /**
   * @desc Show the popup
   * @public
   * @override
   * @method
   * @param {ol.Feature} feature The feature
   */
  showFeature(feature) {
    this.showFeatures([feature])
  }
  /**
   * @desc Show the HTML rendered features in the popup
   * @public
   * @method
   * @param {Array<ol.Feature>} features The features
   * @param {ol.Coordinate} coordinate The coordinate
   */
  showFeatures(features, coordinate) {
    coordinate = coordinate || olExtentGetCenter(features[0].getGeometry().getExtent())
    this.pager.show(features)
    this.show({coordinate: coordinate})
  }
  /**
   * @desc Handles map click events
   * @method
   * @override
   * @param {ol.MapBrowserEvent} event Event object
   */
  mapClick(event) {
    const id = this.getId()
    const features = []
    this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      if (layer.get('popup-id') === id) {
        features.push(feature)
      }
    })
    if (features.length) {
      this.showFeatures(features, event.coordinate)
    }
  }
  /**
   * @private
   * @method
   * @param {module:nyc/ItemPager~ItemPager} pager Pager
   */
  paged(pager) {
    this.cssClass(pager.item.cssClass ? pager.item.cssClass() : '')
    this.pan()
  }
}

export default MultiFeaturePopup
