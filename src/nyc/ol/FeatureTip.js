import $ from 'jquery'

import OlOverlay from 'ol/overlay'

import nyc from 'nyc/nyc'

/**
 * @desc A class for providing tool tips on mouseover for vector features
 * @public
 * @class
 * @constructor
 */
class FeatureTip extends OlOverlay {
  /**
   * @desc Create an instance of FeatureTip
   * @public
   * @constructor
   * @param {FeatureTip.Options} options Constructor options
   */
  constructor(options) {
    const element = $(options.map.getTargetElement()).find('f-tip').get(0)
    super({
      id: nyc.nextId('FeatureTip'),
      element: element || $(FeatureTip.HTML).get(0)
    })
    this.setMap(options.map)
    this.map = this.getMap()
    this.tip = $(this.getElement())
  	this.addTips(options.tips)
  	options.map.on('pointermove', $.proxy(this.label, this))
  	$(options.map.getViewport()).mouseout($.proxy(this.hide, this))
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
	 * @param {Array<FeatureTip.TipDef>} tips The tip definitions to add
	 */
	addTips(tips) {
		tips.forEach(def => {
			def.layer.nycTip = def.label
		})
	}
	/**
	 * @private
	 * @method
	 * @param {ol.MapEvent} event
	 */
	label(event) {
		const px = event.pixel
		const lbl = this.map.forEachFeatureAtPixel(px, function(f, lyr) {
			return f && lyr && lyr.getVisible() && lyr.nycTip ? lyr.nycTip.call(f) : null
		})
		if (lbl) {
			this.tip.html(lbl.text).addClass(lbl.cssClass || '')
      this.setPosition(event.coordinate)
      this.tip.show()
			this.position(lbl, px)
		}else{
			this.hide()
		}
	}
	/**
	 * @private
	 * @param {nyc.ol.FeatureLabel} lbl
	 * @param {ol.Pixel} px
	 */
	position(lbl, px) {
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
 * @property {FeatureTip.LabelFunction} label A function to generate tips
 */
FeatureTip.TipDef

/**
 * @desc Label function that runs in the scope of the feature and returns a {@link FeatureTip.Label}
 * @public
 * @typedef {function():FeatureTip.Label}
 */
FeatureTip.LabelFunction

/**
 * @desc Object type to return from a feature's label function
 * @public
 * @typedef {Object}
 * @property {string} text The tip text
 * @property {string=} cssClass A CSS class to apply to the tip
 */
FeatureTip.Label

/**
 * @desc Object to hold constructor option for FeatureTip
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map
 * @property {Array<FeatureTip.TipDef>} tips The tip definitions
 */
FeatureTip.Options

/**
 * @private
 * @const
 * @type {string}
 */
FeatureTip.HTML = '<div class="f-tip" role="tooltip"></div>'

export default FeatureTip
