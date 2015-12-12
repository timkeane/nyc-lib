var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * Class for providing tool tips on mouseover for vector features
 * @public
 * @class
 * @constructor
 * @param {ol.Map} map The OpenLayers map with which the user will interact
 * @param {Array<nyc.ol.FeatureTip.TipDef>=} tipDefs The tip definitions
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
	/** 
	 * @private
	 * @member {ol.Map}
	 */
	map: null,
	/** 
	 * @private
	 * @member {Element}
	 */
	mapDiv: null,
	/** 
	 * @private
	 * @member {JQuery}
	 */
	tip: null,
	/** 
	 * @private
	 * @member {JQuery}
	 */
	helper: null,
	/**
	 * @desc Hide the feature tip
	 * @public
	 * @method
	 */
	hide: function(){
		this.tip.fadeOut();
	},
	/**
	 * @desc Adds tip definitions
	 * @public
	 * @method
	 * @param {Array<nyc.ol.FeatureTip.TipDef>} tipDefs The tip definitions to add
	 */
	addtipDefs: function(tipDefs){
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
	},
	/**
	 * @private
	 * @method
	 * @param {ol.source.VectorEvent} event
	 */
	label: function(event){
			var px = this.map.getEventPixel(event.originalEvent),
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
 * @desc Object with configuration options for feature tips 
 * @public
 * @typedef {Object}
 * @property {ol.source.Vector} source The source of the features
 * @property {nyc.ol.FeatureTip.LabelFunction} labelFunction A function to generate tips
 */
nyc.ol.FeatureTip.TipDef;

/**
 * @desc Label function that runs in the scope of the feature and returns a {@link nyc.ol.FeatureTip.Label}
 * @public
 * @typedef {function():nyc.ol.FeatureTip.Label}
 */
nyc.ol.FeatureTip.LabelFunction;

/**
 * @desc Object type to return from a feature's label function
 * @public
 * @typedef {Object}
 * @property {string} text The tip text
 * @property {string=} cssClass A CSS class to apply to the tip 
 */
nyc.ol.FeatureTip.Label;


