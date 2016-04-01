var nyc = nyc || {};

/**
 * @desc A class to generate legend HTML
 * @public
 * @class
 * @extends {nyc.ReplaceTokens}
 * @constructor
 * @param {Array<Object>=} list The list to page through
 */
nyc.ListPager = function(list, pageSize){
	this.list = list;
};

nyc.ListPager.prototype = {
	/**
	 * @private
	 * @member {Array<Object>}
	 */
	list: null,
	/**
	 * @private
	 * @member {number}
	 */
	index: 0,
	/**
	 * @desc Resets the pager with a new list
	 * @public
	 * @method
	 * @param {Array<Object>=} list The list to page through
	 */
	reset: function(list){
		this.list = list;
		this.index = 0;
	},
	/**
	 * @desc Returns next page from the list
	 * @public
	 * @method
	 * @param {number} [pageSize=10] The length of the list for the next page
	 * @return {Array<Object>} The HTML element for the legend wrapped in a JQuery object
	 */
	next: function(pageSize){
		pageSize = pageSize || 10;
		var result = this.list.slice(this.index, this.index + pageSize);
		this.index = this.index + pageSize;
		return result;
	}
};