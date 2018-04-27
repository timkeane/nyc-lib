var nyc = nyc || {};

/**
 * @desc A class to generate legend HTML
 * @public
 * @class
 * @extends {nyc.ReplaceTokens}
 * @constructor
 * @param {string} legendTemplate The template with an optional replacement token for the caption (${caption})
 */
nyc.Legend = function(legendTemplate){
	this.legendTemplate = legendTemplate;
};

nyc.Legend.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	legendTemplate: null,
	/**
	 * @desc Returns the legend HTML as a JQuery object
	 * @public
	 * @method
	 * @param {string} caption A legend caption
	 * @return {JQuery} The HTML element for the legend wrapped in a JQuery object
	 */
	html: function(caption){
		return $(this.replace(this.legendTemplate, {caption: caption}));
	}
};

nyc.inherits(nyc.Legend, nyc.ReplaceTokens);

/**
 * @desc A class to generate legend HTML with classifications for bins or buckets
 * @public
 * @class
 * @extends {nyc.Legend}
 * @constructor
 * @param {string} name The name of the legend
 * @param {nyc.BinLegend.SymbolType} symbolType The symbol type for the legend
 * @param {nyc.BinLegend.BinType} binType The bin type for the legend
 * 
 */
nyc.BinLegend = function(name, symbolType, binType){
	this.name = name;
	this.symbolType = symbolType;
	this.binType = binType;
};

nyc.BinLegend.prototype = {
	/**
	 * @private
	 * @member {nyc.BinLegend.SymbolType}
	 */
	symbolType: null,
	/**
	 * @private
	 * @member {nyc.BinLegend.BinType}
	 */
	binType: null,
	/**
	 * @private
	 * @member {string}
	 */
	rangeTemplate: '<tr><td class="leg-bin leg-bin-${index}"><img alt="${op0} ${from} ${and} ${op1} ${to}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">${op0} <span class="fmt-num">${from}</span> ${and} ${op1} <span class="fmt-num">${to}</span></td></tr>',
	/**
	 * @private
	 * @member {string}
	 */
	valueTemplate: '<tr><td class="leg-bin leg-bin-${index}"><img alt="${value}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">${value}</td></tr>',
	/**
	 * @desc Returns the legend HTML as a JQuery object
	 * @public
	 * @override
	 * @method
	 * @param {string} caption A legend caption
	 * @param {Array<string|number>} bins The legend classifications
	 * @return {JQuery} The HTML element for the legend wrapped in a JQuery object
	 */
	html: function(caption, bins){
		var me = this, table = $('<table class="legend"></table>'), tbody = $('<tbody></tbody');
		table.append('<caption>' + caption + '</caption>');
		table.append(tbody);
		table.addClass(this.symbolType);
		table.addClass(this.binType);
		table.addClass(this.name.replace(/ /g, '-'));
		$.each(bins, function(i, bin){
			if (me.binType != nyc.BinLegend.BinType.VALUE){
				tbody.append(me.rangeBin(i, bins[i - 1], bin));
			}else{
				tbody.append(me.valueBin(bin));
			}
		});
		return table;
	},
	/**
	 * @private
	 * @method
	 * @param {number} index
	 * @param {number} from
	 * @param {number} to
	 */
	rangeBin: function(index, from, to){
		return this.replace(this.rangeTemplate, {
			index: index, 
			op0: index == 0 ? '' : '>', 
			op1: index == 0 && this.binType == nyc.BinLegend.BinType.RANGE_INT ? '' : '<=', 
			from: isNaN(from) ? '' : from, 
			and: index == 0 ? '' : 'and', 
			to: to
		});
	},
	/**
	 * @private
	 * @method
	 * @param {number} index
	 * @param {(string|number)} value
	 * @return {Object}
	 */
	valueBin: function(index, value){
		return this.replace(this.valueTemplate, {index: index, value: value});
	}
};

nyc.inherits(nyc.BinLegend, nyc.Legend);

/**
 * @desc Enumeration for legend symbol type
 * @public
 * @enum {string}
 */
nyc.BinLegend.SymbolType = {
	/**
	 * @desc Polygon symbol
	 */
	POLYGON: 'leg-polygon',
	/**
	 * @desc Line symbol
	 */
	LINE: 'leg-line',
	/**
	 * @desc Point symbol
	 */
	POINT: 'leg-point',
	/**
	 * @desc Graduated point symbol
	 */
	GRADUATED_POINT: 'leg-grad-point'
};

/**
 * Enumeration for legend bin type
 * @public
 * @enum {string}
 */
nyc.BinLegend.BinType = {
	/**
	 * @desc Range of numbers
	 */
	RANGE_NUMBER: 'leg-range-num',
	/**
	 * @desc Range of integers
	 */
	RANGE_INT: 'leg-range-int',
	/**
	 * @desc Range of values
	 */
	VALUE: 'leg-value'
};
