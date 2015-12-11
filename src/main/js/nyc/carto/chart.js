var nyc = nyc || {};
/** 
 * @export 
 * @namespace
 */
nyc.carto = nyc.carto || {};

/**
 * Object type to hold constructor options for nyc.carto.Chart
 * @export
 * @typedef {Object}
 * @property {JQuery|Element|string} canvas
 * @property {cartodb.SQL} cartoSql
 * @property {string} sqlTemplate
 * @property {string} descriptionTemplate
 * @property {string} dataColumn 
 * @property {string} labelColumn 
 * @property {Object} filters 
 * @property {Object=} chartOptions 
 * @property {Array<Object>=} seriesOptions 
 * @property {function(string):string=} labelLookupFunction 
 */
nyc.carto.ChartOptions;

/**
 * @export
 * @class
 * @classdesc Class for charting views on layers 
 * @constructor
 * @extends {nyc.carto.SqlTemplate}
 * @mixes {nyc.EventHandling}
 * @param {nyc.carto.ChartOptions} options
 * 
 */
nyc.carto.Chart = function(options){
	this.cartoSql = options.cartoSql;
	this.canvas = $(options.canvas);
	this.sqlTemplate = options.sqlTemplate;
	this.descriptionTemplate = options.descriptionTemplate;
	this.dataColumn = options.dataColumn;
	this.labelColumn = options.labelColumn;
	this.filters = options.filters;
	this.chartOptions = options.chartOptions || {scaleFontColor: 'black', scaleLineColor: 'rgba(0,0,0,0.3)', customTooltips: this.tip};
	this.seriesOptions = options.seriesOptions || [{fillColor: 'black', strokeColor: 'transparent'}, {fillColor: 'rgba(0,0,0,0.3)', strokeColor: 'transparent'}];
	this.labelLookupFunction = options.labelLookupFunction || function(lbl){return lbl;};
};

nyc.carto.Chart.prototype = {
	/**
	 * @private
	 * @member {Array<string>}
	 */
	prevSqls: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	canvas: null,
	/** 
	 * @export 
	 * @method 
	 * @param {JQuery} canvas
	 * @param {Array<Object>} filterValuesArray
	 * @param {JQuery|Element|string} titleNode
	 * @param {Array<Object>} descriptionValues
	 */ 
	chart: function(filterValuesArray, titleNode, descriptionValues){
		var me = this, sqls = [], datasets = [];
		$.each(filterValuesArray, function(_, filterValues){
			sqls.push(me.sql(me.sqlTemplate, filterValues, me.filters));
		});		
		if (!me.isSame(sqls)){
			me.prevSqls = sqls;
			$.each(sqls, function(_, sql){
				me.cartoSql.execute(sql).done(
					function(data){
						datasets.push(data.rows);
						if (datasets.length == filterValuesArray.length){
							me.title(titleNode, descriptionValues);
							me.render(datasets);
						}
					}
				);
			});		
		}
	},
	/**
	 * @private
	 * @method 
	 * @param {Array<string>} sqls 
	 * @return {boolean}
	 */
	isSame: function(sqls){
		if (!this.prevSqls || sqls.length != this.prevSqls.length) return false;
		for (var i = 0; i < sqls.length; ++i) {
			if (sqls[i] != this.prevSqls[i]) return false;
		}
		return true;
	},
	/**
	 * @private
	 * @method 
	 * @param {JQuery|Element|string} titleNode 
	 * @param {Object} descriptionValues 
	 */
	title: function(titleNode, descriptionValues){
		var me = this;
		$(titleNode).addClass('chart-title');
		$(titleNode).html(this.replace(this.descriptionTemplate, descriptionValues));
		$.each(descriptionValues.seriesTitles, function(i, title){
			var html = new String(nyc.carto.Chart.SERIES_HTML);
			$(titleNode).append(me.replace(html, {index: i, title: title}));
		});
	},
	/**
	 * @private
	 * @method 
	 * @param {Array<Object>} datasets
	 * @return {Object}
	 */
	data: function(datasets){
		var dataCol = this.dataColumn,
			labelCol = this.labelColumn,
			labelLookupFunction = this.labelLookupFunction,
			seriesOptions =  this.seriesOptions,
			data = {labels: [], datasets: []};
		$.each(datasets, function(i, rows){
			var labels = [], dataset = seriesOptions[i];
			dataset.data = [];
			$.each(rows, function(_, row){
				if (i == 0){
					data.labels.push(labelLookupFunction(row[labelCol]));
				}
				dataset.data.push(row[dataCol]);
			});
			data.datasets.push(dataset);
		});
		return data;
	},
	/**
	 * @private
	 * @method 
	 * @param {Object} tooltip 
	 */
	tip: function(tooltip) {
		var tip = $('#chart-tip');
		if (tooltip){
			var offset = $(tooltip.chart.canvas).offset();        	
			if (!tip.length){
				tip = $('<div id="chart-tip"></div>');
				$('body').append(tip);
			};
			tip.html('<div class="chart-tip-title">' + tooltip.title + '</div>');
			$.each(tooltip.labels, function(i, label){
				tip.append('<div class="chart-tip-' + i + '">' + label + '</div>');
			});
			tip.css({
				left: offset.left + tooltip.x + 'px',
				top: offset.top + tooltip.y - 10 + 'px'
			}).show();
		}else{
			tip.hide();
		}
    },
	/**
	 * @private
	 * @method 
	 * @param {JQuery} canvas 
	 * @param {Array<Object>} datasets 
	 */
	render: function(datasets){
		var chart = this.canvas.data('chart'), ctx = this.canvas.get(0).getContext('2d'), data = this.data(datasets);
		if (chart) chart.destroy();
		chart = new Chart(ctx).Bar(data, this.chartOptions);
		this.canvas.data('chart', chart);
	}
};

nyc.inherits(nyc.carto.Chart, nyc.EventHandling);
nyc.inherits(nyc.carto.Chart, nyc.carto.SqlTemplate);

/**
 * @private
 * @const
 * @type {string}
 */
nyc.carto.Chart.SERIES_HTML = '<div class="chart-series chart-series-${index}"><div class="chart-series-icon"></div>${title}</div>';