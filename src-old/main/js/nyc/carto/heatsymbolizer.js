var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc Class for managing heat map rendering based on zoom level
 * @public
 * @class
 * @implements {nyc.carto.Symbolizer}
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
		this.trigger(nyc.carto.Symbolizer.EventType.SYMBOLIZED, this.setCss());
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
	}
};

nyc.inherits(nyc.carto.HeatSymbolizer, nyc.carto.Symbolizer);

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.HeatSymbolizer}
 * @public
 * @typedef {Object}
 * @property {L.Map} map The Leaflet map containing the heat map layer
 * @property {carto.Layer} layer The Carto heat map layer
 * @property {string} css CartoCSS with optional replacement tokens for rendering the heat map (valid tokens are ${size}, ${sizePlus2} and ${sizePlus4})
 * @property {Array<Number>} [sizes=[2, 4, 8, 16, 32, 64, 128, 256, 512]] An array of marker sizes for replacing tokens in the css where the last number in the array is to be used at zoom level 18
 */
nyc.carto.HeatSymbolizer.Options;

/**
 * @desc The CartoCSS applied to the heat map layer
 * @event nyc.carto.HeatSymbolizer#symbolized
 * @type {string}
 */