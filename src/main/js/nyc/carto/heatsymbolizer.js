var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc Class for managing heat map rendering based on zoom level
 * @public
 * @class
 * @implements {nyc.carto.Symbolizer}
 * @extends {nyc.ReplaceTokens}
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.carto.HeatSymbolizer.Options} options Constructor options
 * @fires nyc.carto.HeatSymbolizer#symbolized
 */
nyc.carto.HeatSymbolizer = function(options){
	this.map = options.map;
	this.layer = options.layer;
	this.css = options.css;
	this.map.on('zoomend', $.proxy(this.symbolize, this));
	this.sizes = options.sizes || [2, 4, 8, 16, 32, 64, 128, 256, 512];
};

nyc.carto.HeatSymbolizer.prototype = {
	/**
	 * @private
	 * @member {Array<Number>}
	 */
	sizes: null,
	/**
	 * @private
	 * @method
	 */
	symbolize: function(){
		var css = '';
		if (this.canSetCss()){
			css = this.setCss();
		}else{
			this.setParams();
		}
		this.trigger(nyc.carto.Symbolizer.EventType.SYMBOLIZED, css);
	},
	/**
	 * @private
	 * @method
	 */
	getSize: function(){
		var idx = this.map.getZoom() - (19 - this.sizes.length);
		return this.sizes[idx] || 1;
	},
	/**
	 * @private
	 * @method
	 * @return {string}
	 */
	setCss: function(){
		var css = this.css, size = this.getSize();
		css = this.replace(css, {size: size, sizePlus2: size + 2, sizePlus4: size + 4});
		this.layer.setCartoCSS(css);
		return css;
	},
	/**
	 * @private
	 * @method
	 */
	setParams: function(){
		var size = this.getSize();
		this.layer.setParams({size: size, sizePlus2: size + 2, sizePlus4: size + 4});
	},
	/**
	 * @private
	 * @method
	 * @return {boolean}
	 */
	canSetCss: function(){
		try {
			this.layer.getCartoCSS();
		}catch(ex){
			return false;
		}
		return true;
	}
};

nyc.inherits(nyc.carto.HeatSymbolizer, nyc.carto.Symbolizer);

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.HeatSymbolizer}
 * @public
 * @typedef {Object}
 * @property {L.Map} map The Leaflet map containing the heat map layer
 * @property {carto.Layer} layer The CartoDB heat map layer
 * @property {Array<Number>} [sizes=[2, 4, 8, 16, 32, 64, 128, 256, 512]] An array of marker sizes for replacing tokens in the css where the last number in the array is to be used at zoom level 18
 * @property {string=} css CartoCSS with optional replacement tokens for rendering the heat map (valid tokens are ${size}, ${sizePlus2} and ${sizePlus4})
 */
nyc.carto.HeatSymbolizer.Options;

/**
 * @desc The CartoCSS applied to the heat map layer
 * @event nyc.carto.HeatSymbolizer#symbolized
 * @type {String}
 */