var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc An interface for symbolizing CartoDB layers
 * @public
 * @interface
 */
nyc.carto.Symbolizer = function(){};

nyc.inherits(nyc.carto.Symbolizer, nyc.ReplaceTokens);
nyc.inherits(nyc.carto.Symbolizer, nyc.EventHandling);

/** 
 * @desc Enumerator for symbolizer event types
 * @enum {string}
 */
nyc.carto.Symbolizer.EventType = {
	/**
	 * @desc The symbolized event fired after a symbolizer completes its symbolize function
	 */
	SYMBOLIZED: 'symbolized' 
};

/**
 * @desc The result of symbolization 
 * @event nyc.carto.Symbolizer#symbolized
 * @type {Object}
 */

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
		var css = this.css, idx = this.map.getZoom() - (19 - this.sizes.length),
		size = this.sizes[idx] || 1;
		css = this.replace(css, {size: size, sizePlus2: size + 2, sizePlus4: size + 4});
		this.layer.setCartoCSS(css);
		this.trigger(nyc.carto.Symbolizer.EventType.SYMBOLIZED, css);
	}
};

nyc.inherits(nyc.carto.HeatSymbolizer, nyc.carto.Symbolizer);

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.HeatSymbolizer}
 * @public
 * @typedef {Object}
 * @property {L.Map} map The Leaflet map containing the heat map layer
 * @property {carto.Layer} layer The CartoDB heat map layer
 * @property {string} css CartoCSS with optional replacement tokens for rendering the heat map (valid tokens are ${size}, ${sizePlus2} and ${sizePlus4})
 * @property {Array<Number>} [sizes=[2, 4, 8, 16, 32, 64, 128, 256, 512]] An array of marker sizes for replacing tokens in the css where the last number in the array is to be used at zoom level 18
 */
nyc.carto.HeatSymbolizer.Options;

/**
 * @desc The CartoCSS applied to the heat map layer
 * @event nyc.carto.HeatSymbolizer#symbolized
 * @type {String}
 */

/**
 * @desc Class for managing SQL views on layers 
 * @class
 * @public
 * @class
 * @implements {nyc.carto.Symbolizer}
 * @extends {nyc.carto.SqlTemplate}
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.carto.JenksSymbolizer.Options} options Constructor options
 * @fires nyc.carto.JenksSymbolizer#symbolized
 */
nyc.carto.JenksSymbolizer = function(options){
	this.cartoSql = options.cartoSql;
	this.baseCss = options.baseCss || '';
	this.cssRules = options.cssRules;
	this.jenksSql = this.replace(this.jenksSql, {column: options.jenksColumn, binCount: options.cssRules.length});
	if (options.outlierFilter){
		this.jenksSql += (' AND ' + options.outlierFilter);
	}
};

nyc.carto.JenksSymbolizer.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	jenksSql: 'SELECT CDB_JENKSBINS(ARRAY_AGG(a.${column}::numeric), ${binCount}) FROM (${sql}) a WHERE a.${column} IS NOT NULL',
	/**
	 * @private
	 * @member {cartodb.SQL}
	 */
	cartoSql: null,
	/**
	 * @private
	 * @member {string}
	 */
	baseCss: null,
	/**
	 * @private
	 * @member {Array<string>}
	 */
	cssRules: null,
	/** 
	 * @public
	 * @method 
	 * @param {cartodb.Layer} layer The layer to symbolize
	 */
	symbolize: function(layer){
		var me = this, jenksSql = me.replace(me.jenksSql, {sql: layer.getSQL()});
		me.cartoSql.execute(jenksSql).done(function(data){
			var bins = me.bins(data.rows[0].cdb_jenksbins);
			me.applyCss(layer, bins);
			me.trigger(nyc.carto.Symbolizer.EventType.SYMBOLIZED, bins);
		});
	},
	/**
	 * @private 
	 * @method 
	 * @param {cartodb.Layer} layer
	 * @param {Array<number>} bins
	 */
	applyCss: function(layer, bins){
		var css = this.baseCss;
		if (bins){
			for (var i = bins.length - 1; i >= 0; i--){
				css += this.replace(this.cssRules[i], {value: bins[i]});
			};
		}
		layer.setCartoCSS(css);
	},
	/**
	 * @private 
	 * @method 
	 * @param {Object} jenksbins
	 * @return {Array<number>}
	 */
	bins: function(jenksbins){
		var bins = [];
		if (jenksbins){
			bins.push(jenksbins[0]);
			for (var bin in jenksbins){
				if ($.inArray(jenksbins[bin], bins) == -1){
					bins.push(jenksbins[bin]);
				}
			}
			while (bins[0] == null){
				bins.shift();
			}
		}
		return bins;
	}
};

nyc.inherits(nyc.carto.JenksSymbolizer, nyc.carto.SqlTemplate);
nyc.inherits(nyc.carto.JenksSymbolizer, nyc.carto.Symbolizer);

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.JenksSymbolizer}
 * @public
 * @typedef {Object}
 * @property {cartodb.SQL} cartoSql The object used to query CartoDB data 
 * @property {string} jenksColumn The data column for calculating Jenks natural breaks in the data
 * @property {Array<string>} cssRules An array of CartoCSS with the token ${value} to be replaced by the Jenks calculated values
 * @property {string=} baseCss CartoCSS that remains unchanged regardless of changing data
 * @property {string=} outlierFilter An SQL condition used to restrict the data used in the Jenks calculation
 */
nyc.carto.JenksSymbolizer.Options;

/** 
 * @desc Enumerator for symbolizer event types
 * @enum {string}
 */

/**
 * @desc The Jenks breaks applied to the CartoCS of the layer 
 * @event nyc.carto.JenksSymbolizer#symbolized
 * @type {Array<number>}
 */

/** 
 * @desc Enumerator for symbolizer event types
 * @enum {string}
 */
nyc.carto.ViewEventType = {
	/**
	 * @desc The update event type
	 */
	UPDATED: 'updated' 
};
