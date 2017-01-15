var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc Class for managing SQL views on layers 
 * @public
 * @class
 * @extends {nyc.carto.SqlTemplate}
 * @mixes {nyc.carto.View}
 * @constructor
 * @param {nyc.carto.SqlView.Options} options Constructor options
 * @fires nyc.carto.View#updated
 */
nyc.carto.SqlView = function(options){
	var me = this;
	me.name = options.name;
	me.layer = options.layer;
	me.sqlTemplate = options.sqlTemplate;
	me.filters = options.filters;
	me.symbolizer = options.symbolizer;
	me.descriptionTemplate = options.descriptionTemplate || '';
	me.legend = options.legend;
};

nyc.carto.SqlView.prototype = {
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
	 * @member {nyc.carto.Symbolizer}
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
	 * @param {Object<string, Object<string, string>>} filterValues The values object used along with the view's filters and sqlTemlate to modify the query for this view
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
	}
};

nyc.inherits(nyc.carto.SqlView, nyc.carto.View);
nyc.inherits(nyc.carto.SqlView, nyc.carto.SqlTemplate);

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.View}
 * @public
 * @typedef {Object}
 * @property {string} name A name for the view
 * @property {cartodb.CartoDBLayer.SubLayer} layer The layer managed by the view
 * @property {string} sqlTemplate The template with optional replacement tokens for generating queries on the layer
 * @property {Object<string, string>}  filters The filters used with the sqlTemplate for generating queries on the layer
 * @property {string=} descriptionTemplate The template with optional replacement tokens for the chart description
 * @property {nyc.carto.Symbolizer=} symbolizer The symbolizer used to change the layer's CartoCSS as its underlying data changes
 * @property {nyc.Legend=} legend The legend for this view
 */
nyc.carto.SqlView.Options;

/**
 * @desc Class for managing named instances of {@link nyc.carto.View} 
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
 * @desc Carto data access class
 * @public
 * @class
 * @extends {nyc.carto.SqlTemplate}
 * @constructor
 * @param {cartodb.SQL} cartoSql The object used to query Carto data 
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
	 * @param {function(Object)} callback The callback function to receive data from Carto
	 */
	data: function(filterValues, callback){
		var sql = this.sql(this.sqlTemplate, filterValues, this.filters);
		this.cartoSql.execute(sql).done(callback);
	}
};

nyc.inherits(nyc.carto.Dao, nyc.carto.SqlTemplate);
