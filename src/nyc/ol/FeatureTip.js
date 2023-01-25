/**
 * @module nyc/ol/FeatureTip
 */

import $ from 'jquery'

import OlOverlay from 'ol/Overlay'

import nyc from '../index'

/**
 * @desc A class for providing tool tips on mouseover for vector features
 * @public
 * @class
 * @extends ol.Overlay
 * @see http://openlayers.org/en/latest/apidoc/module-ol_Overlay.html
 */
class FeatureTip extends OlOverlay {
  /**
   * @desc Create an instance of FeatureTip
   * @public
   * @constructor
   * @param {module:nyc/ol/FeatureTip~FeatureTip.Options} options Constructor options
   */
  constructor(options) {
    const element = $(options.map.getTargetElement()).find('.f-tip').get(0)
    super({
      id: nyc.nextId('FeatureTip'),
      element: element || $(FeatureTip.HTML).get(0),
      stopEvent: false
    })
    this.setMap(options.map)
    this.map = this.getMap()
    this.tip = $(this.getElement())
    this.addTips(options.tips)
    this.map.on('pointermove', $.proxy(this.label, this))
    $(document).mouseover($.proxy(this.out, this))
  }
  /**
   * @desc Hide the feature tip
   * @public
   * @method
   */
  hide() {
    this.tip.fadeOut()
  }
  /**
   * @desc Adds tip definitions
   * @public
   * @method
   * @param {Array<module:nyc/ol/FeatureTip~FeatureTip.TipDef>} tips The tip definitions to add
   */
  addTips(tips) {
    tips.forEach(def => {
      def.layer.nycTip = def.label
    })
  }
  /**
   * @private
   * @method
   * @param {Object} event Event object
   */
  out(event) {
    if (!$.contains(this.map.getTargetElement(), event.target)) {
      this.hide()
    }
  }
  /**
   * @private
   * @method
   * @param {ol.MapBrowserEvent} event OpenLayers map browser event
   */
  label(event) {
    const label = this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      return layer.getVisible() && layer.nycTip ? layer.nycTip(feature) : null
    })
    if (label) {
      this.tip.html(label.html)
      this.tip.get(0).className = `f-tip ${label.css || ''}`
      this.setPosition(event.coordinate)
      this.tip.show()
      this.position()
    } else {
      this.hide()
    }
  }
  /**
   * @private
   * @method
   */
  position() {
    const size = this.map.getSize()
    const position = this.map.getPixelFromCoordinate(this.getPosition())
    const width = this.tip.width()
    const height = this.tip.height()
    const vert = position[1] + height > size[1] ? 'bottom' : 'top'
    const horz = position[0] + width > size[0] ? 'right' : 'left'
    this.setPositioning(`${vert}-${horz}`)
  }
}

/**
 * @desc Object with configuration options for feature tips
 * @public
 * @typedef {Object}
 * @property {ol.layer.Vector} layer The layer whose features will have tips
 * @property {module:nyc/ol/FeatureTip~FeatureTip.LabelFunction} label A function to generate tips
 */
FeatureTip.TipDef

/**
 * @desc Label function that returns a {@link module:nyc/ol/FeatureTip~FeatureTip.Label}
 * @public
 * @typedef {function(ol.Feature):module:nyc/ol/FeatureTip~FeatureTip.Label}
 */
FeatureTip.LabelFunction

/**
 * @desc Object type to return from a feature's label function
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} html The tip content
 * @property {string=} css A CSS class to apply to the tip
 */
FeatureTip.Label

/**
 * @desc Constructor options for {@link module:nyc/ol/FeatureTip~FeatureTip}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 * @property {Array<module:nyc/ol/FeatureTip~FeatureTip.TipDef>} tips The tip definitions
 */
FeatureTip.Options

/**
 * @private
 * @const
 * @type {string}
 */
FeatureTip.HTML = '<div class="f-tip" role="tooltip"></div>'

export default FeatureTip
