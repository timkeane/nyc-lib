var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/** @external cartodb.Layer */
/** @external cartodb.SQL */

/**
 * @export
 * @class
 * @classdesc Class for replacing values in SQL strings
 * @constructor
 * @extends {nyc.ReplaceTokens}
 */
nyc.carto.SqlTemplate = function(){};
nyc.carto.SqlTemplate.prototype = {
	/**
	 * @private
	 * @method 
	 * @param {string} template
	 * @param {Object} values
	 * @param {Object=} filters
	 * @return {string}
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
 * Object type to hold constructor options for nyc.carto.HeatSymbolizer
 * @export
 * @typedef {Object}
 * @property {L.Map} map
 * @property {carto.Layer} layer
 * @property {string} css
 */
nyc.carto.HeatSymbolizer;

/**
 * @export
 * @class
 * @classdesc Class for managing heatmap symbolization 
 * @constructor
 * @extends {nyc.ReplaceTokens}
 * @mixes {nyc.EventHandling}
 * @param {nyc.carto.HeatSymbolizer} options
 */
nyc.carto.HeatSymbolizer = function(options){
	this.map = options.map;
	this.layer = options.layer;
	this.css = options.css;
	this.map.on('zoomend', $.proxy(this.symbolize, this));
};

nyc.carto.HeatSymbolizer.prototype = {
	sizes: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
	symbolize: function(){
		var css = this.css, idx = this.map.getZoom() - 10,
		size = this.sizes[idx] || 1;
		css = this.replace(css, {size: size, sizePlus2: size + 2, sizePlus4: size + 4});
		this.layer.setCartoCSS(css);
		this.trigger('symbolized', css);
	}
};
nyc.inherits(nyc.carto.HeatSymbolizer, nyc.ReplaceTokens);
nyc.inherits(nyc.carto.HeatSymbolizer, nyc.EventHandling);

/**
 * Object type to hold constructor options for nyc.carto.JenksSymbolizer
 * @export
 * @typedef {Object}
 * @property {cartodb.SQL} cartoSql
 * @property {string} jenksColumn
 * @property {string} baseCss
 * @property {Array<string>} cssRules 
 * @property {string=} outlierFilter
 */
nyc.carto.JenksSymbolizerOptions;

/**
 * @export
 * @class
 * @classdesc Class for managing SQL views on layers 
 * @constructor
 * @extends {nyc.carto.SqlTemplate}
 * @mixes {nyc.EventHandling}
 * @param {nyc.carto.JenksSymbolizerOptions} options
 */
nyc.carto.JenksSymbolizer = function(options){
	this.cartoSql = options.cartoSql;
	this.baseCss = options.baseCss;
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
	 * @export 
	 * @method 
	 * @param {cartodb.Layer} layer
	 */
	symbolize: function(layer){
		var me = this, jenksSql = me.replace(me.jenksSql, {sql: layer.getSQL()});
		me.cartoSql.execute(jenksSql).done(function(data){
			var bins = me.bins(data.rows[0].cdb_jenksbins);
			me.applyCss(layer, bins);
			me.trigger('symbolized', bins);
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

nyc.inherits(nyc.carto.JenksSymbolizer, nyc.EventHandling);
nyc.inherits(nyc.carto.JenksSymbolizer, nyc.carto.SqlTemplate);

/**
 * Object type to hold constructor options for nyc.carto.View
 * @export
 * @typedef {Object}
 * @property {string} name
 * @property {cartodb.Layer} layer
 * @property {string} sqlTemplate
 * @property {string} descriptionTemplate
 * @property {Object} filters
 * @property {nyc.carto.JenksSymbolizer} symbolizer
 * @property {string} legendTemplate
 */
nyc.carto.ViewOptions;

/**
 * @export
 * @class
 * @classdesc Class for managing SQL views on layers 
 * @constructor
 * @extends {nyc.carto.SqlTemplate}
 * @mixes {nyc.EventHandling}
 * @param {string} name
 * @param {cartodb.Layer} layer
 * @param {string} sqlTemplate
 * @param {Object} filters
 * @param {nyc.Legend} legend
 * @param {string=} descriptionTemplate
 * @param {nyc.carto.JenksSymbolizer=} symbolizer
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
	 * @member {Array<Object>}
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
	 * @export
	 * @method
	 * @param {Object} filterValues
	 * @param {Object} descriptionValues
	 */
	update: function(filterValues, descriptionValues){
		var me = this,
			sql = me.sql(me.sqlTemplate, filterValues, me.filters),
			desc = me.replace(me.descriptionTemplate, descriptionValues);
		me.layer.setSQL(sql);
		if (me.symbolizer){
			me.symbolizer.one('symbolized', function(bins){
				me.trigger('updated', me.legend.html(desc, bins));
			});
			me.symbolizer.symbolize(me.layer);
		}else{
			me.trigger('updated', me.legend.html(desc));
		}
	},
	/**
	 * @export
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
 * @export
 * @class
 * @classdesc Class for managing named instances of nyc.View 
 * @constructor
 * @extends {nyc.EventHandling}
 * @param {Array<nyc.carto.View>} views
 */
nyc.carto.ViewSwitcher = function(views){
	var me = this;
	me.views = {}; 
	$.each(views, function(_, view){
		me.views[view.name] = view;
		view.on('updated', function(legendHtml){
			me.trigger('updated', legendHtml);
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
	 * @export
	 * @method
	 * @param {string} viewName
	 * @param {Object} filterValues
	 * @param {Object} descriptionValues
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
 * @export
 * @class
 * @classdesc CartoDB data access class
 * @constructor
 * @extends {nyc.carto.SqlTemplate}
 * @param {cartodb.SQL} cartoSql
 * @param {string} sqlTemplate
 * @param {Object} filters
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
	 * @export
	 * @method
	 * @param {Object} filterValues
	 * @param {function(Object)} callback
	 */
	data: function(filterValues, callback){
		var sql = this.sql(this.sqlTemplate, filterValues, this.filters);
		this.cartoSql.execute(sql).done(callback);
	}
};

nyc.inherits(nyc.carto.Dao, nyc.carto.SqlTemplate);
