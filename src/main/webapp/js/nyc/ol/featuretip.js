/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.ol = nyc.ol || {};

/**
 * Object type to return from a feature's label function
 * @typedef {Object}
 * @property {(string|undefined)} cssClass
 * @property {string} text
 */
nyc.ol.FeatureLabel;

/**
 * Label function to include in a tipDef
 * @typedef {function():nyc.ol.FeatureLabel}
 */
nyc.ol.FeatureLabelFunction;

/**
 * Object literal with config options for tooltips 
 * @typedef {Object}
 * @property {ol.source.Vector|ol.FeatureOverlay} source
 * @property {nyc.ol.FeatureLabelFunction} labelFunction
 */
nyc.ol.FeatureTipDef;

/**
 * Class for providing tool tips on mouseover for vector features.
 * @export
 * @constructor
 * @param {ol.Map} map
 * @param {Array.<nyc.ol.FeatureTipDef>=} tipDefs
 */
nyc.ol.FeatureTip = function(map, tipDefs){
	this.map = map;
	this.mapDiv = map.getTarget();
	if (tipDefs) this.addtipDefs(tipDefs);
	if (!$(this.mapDiv).children('.feature-tip').length)
		$(this.mapDiv).append('<div class="feature-tip" role="tooltip"></div><div class="feature-tip-helper" style="left:-1000px;top:-1000px"></div>');
	this.tip = $(this.mapDiv).children('.feature-tip');
	this.helper = $(this.mapDiv).children('.feature-tip-helper');
	$(map.getViewport()).mousemove($.proxy(this.label, this));
};

nyc.ol.FeatureTip.prototype = {
	/** @private */
	map: null,
	/** @private */
	mapDiv: null,
	/** @private */
	tip: null,
	/** @private */
	helper: null,
	/** @export */
	hide: function(){
		this.tip.fadeOut();
	},
	/**
	 * Handler of addfeature event
	 * @private
	 * @param {ol.source.VectorEvent} the event object delivered by addfeature event
	 */
	label: function(e){
			var px = this.map.getEventPixel(e.originalEvent),
				lbl = this.map.forEachFeatureAtPixel(px, function(f, _){
					return f && f.getLabel ? f.getLabel() : null;
				});
		if (lbl){
			this.tip.html(lbl.text)
				.css({left: (px[0] + 10) + 'px', top: (px[1] + 10) + 'px'})
				.show();
			this.tip[0].className = 'feature-tip ' + (lbl.cssClass || '');
			this.flip(lbl, px);
		}else{
			this.tip.fadeOut();
		}
	},
	/**
	 * Flips the tip if it is at the edge of the map
	 * @private
	 * @param {nyc.ol.FeatureLabel} lbl
	 * @param {ol.Pixel} px 
	 */
	flip: function(lbl, px){
		var width = this.helper.html(lbl.text).width(), height = this.helper.height();
		this.helper[0].className = 'feature-tip-helper ' + (lbl.cssClass || '');
		if ((this.tip.position().left + width) > $(this.mapDiv).width()){
			this.tip.css('left', px[0] - width - 10 + 'px');
		}		
		if ((this.tip.position().top + height) > $(this.mapDiv).height()){
			this.tip.css('top', px[1] - height - 10 + 'px');
		}		
	}
};

/**
 * Adds tip definitions
 * @export
 * @param {Array.<nyc.ol.FeatureTipDef>} tipDefs
 */
nyc.ol.FeatureTip.prototype.addtipDefs = function(tipDefs){
	$.each(tipDefs, function(_, def){
		var src = def.source, func = def.labelFunction, features = src.getFeatures();
		if (features.getArray) features = features.getArray();
		$.each(features, function(_, f){
			f.getLabel = func;
		});
		src.on('addfeature', function(e){
			e.feature.getLabel = func;
		});
	});		
};
