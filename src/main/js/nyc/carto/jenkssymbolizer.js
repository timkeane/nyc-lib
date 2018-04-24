var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc Class for managing SQL views on layers 
 * @class
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @mixes nyc.carto.Symbolizer
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
	 * @param {cartodb.CartoDBLayer.SubLayer} layer The layer to symbolize
	 */
	symbolize: function(layer){
		var me = this, jenksSql = me.replace(me.jenksSql, {sql: layer.getSQL()});
		me.cartoSql.execute(jenksSql).done(function(data){
			var bins = me.bins(data);
			me.applyCss(layer, bins);
			me.trigger(nyc.carto.Symbolizer.EventType.SYMBOLIZED, bins);
		});
	},
	/**
	 * @private 
	 * @method 
	 * @param {cartodb.CartoDBLayer.SubLayer} layer
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
	 * @param {Object} data
	 * @return {Array<number>}
	 */
	bins: function(data){
		var bins = [], jenksbins = data.rows[0].cdb_jenksbins;
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

nyc.inherits(nyc.carto.JenksSymbolizer, nyc.EventHandling);
nyc.inherits(nyc.carto.JenksSymbolizer, nyc.carto.Symbolizer);

/**
 * @desc The Jenks breaks applied to the CartoCS of the layer 
 * @event nyc.carto.JenksSymbolizer#symbolized
 * @type {Array<number>}
 */

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.SqlJenksSymbolizer}
 * @public
 * @typedef {Object}
 * @property {cartodb.SQL} cartoSql The object used to query Carto data 
 * @property {string} jenksColumn The data column for calculating Jenks natural breaks in the data
 * @property {Array<string>} cssRules An array of CartoCSS with the token ${value} to be replaced by the Jenks calculated values
 * @property {string=} baseCss CartoCSS that remains unchanged regardless of changing data
 * @property {string=} outlierFilter An SQL condition used to restrict the data used in the Jenks calculation
 */
nyc.carto.JenksSymbolizer.Options;

