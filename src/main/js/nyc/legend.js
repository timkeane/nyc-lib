var nyc = nyc || {};

/**
 * @export
 * @class
 * @desc A class to generate legend HTML
 * @constructor
 * @extends {nyc.ReplaceTokens}
 * @param {string} legendTemplate
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
	 * @export
	 * @method
	 * @param {string} caption
	 * @return {JQuery}
	 */
	html: function(caption){
		return $(this.replace(this.legendTemplate, {caption: caption}));
	}
};

nyc.inherits(nyc.Legend, nyc.ReplaceTokens);

/**
 * @export
 * @class
 * @desc A class to generate legend HTML for bins or buckets
 * @constructor
 * @extends {nyc.Legend}
 * @param {string} name
 * @param {nyc.BinLegend.SymbolType} symbolType
 * @param {nyc.BinLegend.BinType} binType
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
	rangeTemplate: '<tr><td class="leg-bin leg-bin-${index}"><img alt="${op0} ${from} ${and} ${op1} ${to}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">${op0} ${from} ${and} ${op1} ${to}</td></tr>',
	/**
	 * @private
	 * @member {string}
	 */
	valueTemplate: '<tr><td class="leg-bin leg-bin-${index}"><img alt="${value}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">${value}</td></tr>',
	/**
	 * @export
	 * @method
	 * @param {string} caption
	 * @param {Array<string|number>} bins
	 * @return {JQuery}
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
	 * @param {string|number} value
	 * @return {Object}
	 */
	valueBin: function(index, value){
		return this.replace(this.valueTemplate, {index: index, value: value});
	}
};

nyc.inherits(nyc.BinLegend, nyc.Legend);

/**
 * Enumeration for legend symbol type
 * @export
 * @enum {string}
 */
nyc.BinLegend.SymbolType = {
	POLYGON: 'leg-polygon',
	LINE: 'leg-line',
	POINT: 'leg-point',
	GRADUATED_POINT: 'leg-grad-point'
};

/**
 * Enumeration for legend bin type
 * @export
 * @enum {string}
 */
nyc.BinLegend.BinType = {
	RANGE_FLOAT: 'leg-range-float',
	RANGE_INT: 'leg-range-int',
	VALUE: 'leg-value'
};
