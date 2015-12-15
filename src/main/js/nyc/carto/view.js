var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc Class for replacing values in SQL strings and appending filters to the WHERE clause
 * @public
 * @class
 * @extends {nyc.ReplaceTokens}
 * @constructor
 */
nyc.carto.SqlTemplate = function(){};

nyc.carto.SqlTemplate.prototype = {
	/**
	 * @public
	 * @method 
	 * @param {string} template The SQL template with optional replacement tokens
	 * @param {Object<string, Object<string, string>>} values The replacement values
	 * @param {Object<string, string>=} filters The filters to append to the WHERE clause (i.e. )
	 * @return {string} The SQL statement
	 * @example 
	 * var template = "SELECT * FROM bike WHERE ${where}";
	 * var values =  {
	 *   color: {value: "red"},
	 *   gear: {low: 10, high: 18}
	 * };
	 * var filters = {
	 *   color: "color = '${value}'",
	 *   gear: "gear BETWEEN ${low} AND ${high}"
	 * };
	 * var sqlTmpl = nyc.carto.SqlTemplate();
	 * sqlTmpl.sql(template, values, filters);
	 * //Returns "SELECT * FROM bike WHERE color = 'red' AND gear BETWEEN 10 AND 18"
	 */
	sql: function(template, values, filters){
		var result = new String(template), where = '';
		for (var column in values){
			var filter = filters ? new String(filters[column] || '') : '', vals = values[column];
			if (values){
				result = this.replace(result, vals);
				filter = this.replace(filter, vals);
				if (where && filter){
					where += ' AND ';
				}
				where += filter;				
			}
		}
		result = this.replace(result, {where: where});
		return result;
	}
};

nyc.inherits(nyc.carto.SqlTemplate, nyc.ReplaceTokens);

/**
 * @desc An interface for symbolizing CartoDB layers
 * @public
 * @class
 * @constructor
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

/**
 * @desc Class for managing SQL views on layers 
 * @public
 * @class
 * @extends {nyc.carto.SqlTemplate}
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.carto.View.Options} options Constructor options
 * @fires nyc.carto.View#updated
 */
nyc.carto.View = function(options){
	var me = this;
	me.name = options.name;
	me.layer = options.layer;
	me.sqlTemplate = options.sqlTemplate;
	me.filters = options.filters;
	me.symbolizer = options.symbolizer;
	me.descriptionTemplate = options.descriptionTemplate || '';
	me.legend = options.legend;
};

nyc.carto.View.prototype = {
	/**
	 * @private
	 * @member {cartodb.Layer}
	 */
	layer: null,
	/**
	 * @private
	 * @member {string}
	 */
	sqlTemplate: null,
	/**
	 * @private
	 * @member {string}
	 */
	descriptionTemplate: null,
	/**
	 * @private
	 * @member {Object}
	 */
	filters: null,
	/**
	 * @private
	 * @member {nyc.carto.JenksSymbolizer}
	 */
	symbolizer: null,
	/**
	 * @private
	 * @member {nyc.Legend}
	 */
	legend: null,
	/**
	 * @desc Update the view by modifying the data for the layer
	 * @public
	 * @method
	 * @param {Object<string, Object<string, string>>} filterValues The values object used along with the views filters and sqlTemlate to modify the query for this view
	 * @param {Object<string, string>} descriptionValues The values objects for replacing tokens in the descriptionTemplate
	 */
	update: function(filterValues, descriptionValues){
		var me = this,
			sql = me.sql(me.sqlTemplate, filterValues, me.filters),
			desc = me.replace(me.descriptionTemplate, descriptionValues);
		me.layer.setSQL(sql);
		if (me.legend){
			if (me.symbolizer){
				me.symbolizer.one(nyc.carto.Symbolizer.EventType.SYMBOLIZED, function(bins){
					me.trigger(nyc.carto.ViewEventType.UPDATED, me.legend.html(desc, bins));
				});
				me.symbolizer.symbolize(me.layer);
			}else{
				me.trigger(nyc.carto.ViewEventType.UPDATED, me.legend.html(desc));
			}
		}else{
			me.trigger(nyc.carto.ViewEventType.UPDATED, '');			
		}
	},
	/**
	 * @desc Change the visibility of the view's layer
	 * @public
	 * @method
	 * @param {boolean} visible
	 */
	visibility: function(visible){
		this.layer[visible ? 'show' : 'hide']();
	}
};

nyc.inherits(nyc.carto.View, nyc.EventHandling);
nyc.inherits(nyc.carto.View, nyc.carto.SqlTemplate);

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.View}
 * @public
 * @typedef {Object}
 * @property {string} name A name for the view
 * @property {cartodb.Layer} layer The layer managed by the view
 * @property {string} sqlTemplate The template with optional replacement tokens for generating queries on the layer
 * @property {Object<string, string>}  filters The filters used with the sqlTemplate for generating queries on the layer
 * @property {string=} descriptionTemplate The template with optional replacement tokens for the chart description
 * @property {nyc.carto.JenksSymbolizer=} symbolizer The symbolized used to change the layer its underlying data changes
 * @property {nyc.Legend=} legend The legend for this view
 */
nyc.carto.View.Options;

/**
 * @desc Legend HTML generated after a view modifies a the data for its layer 
 * @event nyc.carto.View#updated
 * @type {string} 
 */

/**
 * @desc Class for managing named instances of nyc.View 
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {Array<nyc.carto.View>} views An array of views with names unique to this instance
 * @fires nyc.carto.ViewSwitcher#updated
 */
nyc.carto.ViewSwitcher = function(views){
	var me = this;
	me.views = {}; 
	$.each(views, function(_, view){
		me.views[view.name] = view;
		view.on(nyc.carto.ViewEventType.UPDATED, function(legendHtml){
			me.trigger(nyc.carto.ViewEventType.UPDATED, legendHtml);
		});
	});
};

nyc.carto.ViewSwitcher.prototype = {
	/**
	 * @private
	 * @member {Object.<string, nyc.carto.View>}
	 */
	views: null,
	/**
	 * @desc Switch to and modify a named view
	 * @method
	 * @param {string} viewName The name of the view to switch to
	 * @param {Object<string, Object<string, string>>} filterValues The values object used along with the views filters and sqlTemlate to modify the query for this view
	 * @param {Object<string, string>} descriptionValues The values objects for replacing tokens in the descriptionTemplate
	 */
	switchView: function(viewName, filterValues, descriptionValues){
		var activeView;
		$('.cartodb-infowindow').fadeOut();
		for (var name in this.views) {
			var view = this.views[name];
			if (view){
				view.visibility(false);
				if (viewName == name){
					activeView = view;
					view.update(filterValues, descriptionValues);
				}
			}
		}
		activeView.visibility(true);
	}
};

nyc.inherits(nyc.carto.ViewSwitcher, nyc.EventHandling);

/**
 * @desc CartoDB data access class
 * @public
 * @class
 * @extends {nyc.carto.SqlTemplate}
 * @constructor
 * @param {cartodb.SQL} cartoSql The object used to query CartoDB data 
 * @param {string} sqlTemplate The template with optional replacement tokens for generating queries for cartoSql
 * @param {Object<string, string>} filters The filters used with the sqlTemplate for generating queries for cartoSql
 */
nyc.carto.Dao = function(cartoSql, sqlTemplate, filters){
	this.cartoSql = cartoSql;
	this.sqlTemplate = sqlTemplate;
	this.filters = filters;
};

nyc.carto.Dao.prototype = {
	/**
	 * @private
	 * @member {cartodb.SQL}
	 */
	cartoSql: null,
	/**
	 * @private
	 * @member {Object}
	 */
	filters: null,
	/**
	 * @private
	 * @member {string}
	 */
	sqlTemplate: null, 
	/**
	 * @public
	 * @method
	 * @param {Object<string, Object<string, string>>} filterValues The values object used along with the views filters and sqlTemlate to modify the query for this view
	 * @param {function(Object)} callback The callback function to receive data from CartoDB
	 */
	data: function(filterValues, callback){
		var sql = this.sql(this.sqlTemplate, filterValues, this.filters);
		this.cartoSql.execute(sql).done(callback);
	}
};

nyc.inherits(nyc.carto.Dao, nyc.carto.SqlTemplate);
