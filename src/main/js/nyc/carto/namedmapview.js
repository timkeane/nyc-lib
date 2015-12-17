var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc Class for managing SQL views on layers 
 * @public
 * @class
 * @extends {nyc.carto.SqlTemplate}
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.carto.NamedMapView.Options} options Constructor options
 * @fires nyc.carto.View#updated
 */
nyc.carto.NamedMapView = function(options){
	var me = this;
	me.name = options.name;
	me.layer = options.layer;
	me.sqlTemplate = options.sqlTemplate;
	me.filters = options.filters;
	me.symbolizer = options.symbolizer;
	me.descriptionTemplate = options.descriptionTemplate || '';
	me.legend = options.legend;
};

nyc.carto.NamedMapView.prototype = {
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
	 * @param {Object<string, Object<string, string>>} filterValues The values object used along with the view's named map to modify the query for this view
	 * @param {Object<string, string>} descriptionValues The values objects for replacing tokens in the descriptionTemplate
	 */
	update: function(filterValues, descriptionValues){
		var me = this, desc = me.replace(me.descriptionTemplate, descriptionValues);
		me.layer.setParams(this.params(filterValues));
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
	 * @private
	 * @method
	 * @param {Object<string, Object<string, string>>} filterValues
	 * @return {Object<string, Object>}
	 */
	pramas: function(filterValues){
		var params = {};
		for (var filter in filterValues){
			for (var value in filter){
				params[value] = filter[value];
			}
		}
		return params;
	}
};

nyc.inherits(nyc.carto.NamedMapView, nyc.carto.View);

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.View}
 * @public
 * @typedef {Object}
 * @property {string} name A name for the view
 * @property {cartodb.Layer} layer The layer managed by the view
 * @property {Object<string, string>}  filters The filters used for generating queries on the layer
 * @property {string=} descriptionTemplate The template with optional replacement tokens for the chart description
 * @property {nyc.carto.Symbolizer=} symbolizer The symbolizer used to change the layer's CartoCSS as its underlying data changes
 * @property {nyc.Legend=} legend The legend for this view
 */
nyc.carto.SqlView.Options;
