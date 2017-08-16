/** 
 * @public 
 * @namespace
 */
nyc.soda = nyc.soda || {};

/**
 * @desc An class for querying NYC OpenData using the Socrata SODA API
 * @public
 * @class
 * @constructor
 * @see https://opendata.cityofnewyork.us/
 * @see https://dev.socrata.com/consumers/getting-started.html
 */
nyc.soda.Query = function(options){
	options = options || {};
	this.query = {};
	this.setUrl(options.url);
	this.setQuery(options.query);
	this.clearAllFilters();
	this.setFilters(options.filters);
};

nyc.soda.Query.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	url: null,
	/**
	 * @private
	 * @member {nyc.soda.Query.Query}
	 */
	query: null,
	/**
	 * @private
	 * @member {Object<string, Array<nyc.soda.Query.Filter>>} 
	 */
	filters: null,
	/**
	 * @desc Overwrite filters for the query
	 * @public
	 * @method
	 * @param {Object<string, Array<nyc.soda.Query.Filter>>} filters Filter arrays mapped to field names
	 */
	setFilters: function(filters){
		this.filters = filters || {};
	},
	/**
	 * @desc Add filters to the query
	 * @public
	 * @method
	 * @param {Object<string, Array<nyc.soda.Query.Filter>>} filters Filter arrays mapped to field names
	 */
	addFilters: function(filters){
		var me = this;
		for (var field in filters){
			$.each(filters[field], function(){
				me.addFilter(field, this);
			});
		}
	},
	/**
	 * @desc Overwrite a filter for the query
	 * @public
	 * @method
	 * @param {string} field The field to which the filter will be applied
	 * @param {nyc.soda.Query.Filter} filters The filter to apply to the field
	 */
	setFilter: function(field, filter){
		this.filters[field] = [filter];
	},
	/**
	 * @desc Add a filter to the query
	 * @public
	 * @method
	 * @param {string} field The field to which the filter will be applied
	 * @param {nyc.soda.Query.Filter} filters The filter to apply to the field
	 */
	addFilter: function(field, filter){
		this.filters[field] = this.filters[field] || [];
		this.filters[field].push(filter);
	},
	/**
	 * @desc Set the base query to which filters can be added
	 * @public
	 * @method
	 * @param {nyc.soda.Query.Query} query the query
	 */
	setQuery: function(query){
		query = query || {};
		this.query.select = query.select || this.query.select;
		this.query.where = query.where || this.query.where;
		this.query.group = query.group || this.query.group;
		this.query.order = query.order || this.query.order;
		this.query.limit = query.limit || this.query.limit;
	},
	/**
	 * @desc Execute the query
	 * @public
	 * @method
	 * @param {nyc.soda.Query.Options} options The execution options
	 * @param {function(Object<string, Object>, nyc.soda.Query)} callback A callback function to receive the data and a reference to this query
	 */
	execute: function(options, callback){
		var me = this, filters, csv;
		options = options || {};
		filters = options.filters || {};
		me.setUrl(options.url);
		me.setQuery(options.query);
		for (var field in filters){
			me.filters[field] = filters[field];
		}
		$.ajax({
			url: me.url,
			method: 'GET',
			data: me.qstr(),
			success: function(data){
				me.callback(data, callback);
			}
		});
	},
	/**
	 * @desc Clear all filters on a field
	 * @public
	 * @method
	 * @param {string=} field The field whose filters will be cleared.
	 */
	clearFilters: function(field){
		delete this.filters[field];
	},
	/**
	 * @desc Clear all filters on all fields
	 * @public
	 * @method
	 */
	clearAllFilters: function(){
		this.filters = {};
	},
	/**
	 * @desc Get the SODA API call URL that was last requested or will be requested with the current query and filter settings
	 * @public
	 * @method
	 * @return {string} The SODA API call URL
	 */
	getUrlAndQuery: function(){
		return this.url + '?' + this.qstr();
	},
	/** 
	 * @private
	 * @method
	 * @param url {string}
	 */
	setUrl: function(url){
		this.url = url || this.url;
	},
	/**
	 * @private
	 * @method
	 * @param {string} field 
	 * @param {nyc.soda.Query.Filter} filters
	 * @return {string}
	 */
	appendFilter: function(where, field, filter){
		var value = filter.value;
		filter.op = filter.op.toUpperCase();
		if (typeof value == 'string'){
			if (value.toUpperCase() == 'NULL'){
				value = 'NULL';
			}else{
				value = "'" + value + "'";
			}
		}else if (typeof value == 'number'){
			value = value + '';
		}else if ($.isArray(value)){
			if (typeof value[0] == 'number'){
				value = '(' + value.toString() + ')';
			}else{
				value = "('" + value.join("', '") + "')";
			}
		}
		return nyc.soda.Query.and(where, field + ' ' + filter.op + ' ' + value);
	},
	/** 
	 * @private
	 * @method
	 * @return {string}
	 */
	qstr: function(){
		var me = this, qry = {};
		for (var p in me.query){
			qry['$' + p] = me.query[p];
		}
		for (var field in me.filters){
			$.each(me.filters[field], function(){
				qry.$where = me.appendFilter(qry.$where, field, this);
			});
		}
		return $.param(qry);
	},
	/** 
	 * @private
	 * @method
	 * @param data {Object}
	 * @param {function(Object<string, Object>, nyc.soda.Query)} callback
	 */
	callback: function(data, callback){
		var data = this.csv() ? $.csv.toObjects(data) : data; 
		if (callback) {
			callback(data, this);
		}
	},
	/** 
	 * @private
	 * @method
	 * @return {boolean}
	 */
	csv: function(){
		var idxCsv = this.url.indexOf('.csv');
		var idxQstr = this.url.indexOf('?');
		var len = this.url.length;
		var csvPos = len - idxCsv;
		var qstrPos = len - idxQstr;
		return idxCsv > -1 && (csvPos == 4 || (qstrPos == csvPos - 4));
	}
};

/**
 * @desc Append to a where clause with AND 
 * @public
 * @static
 * @function
 * @param where {string} The current where clause
 * @param clause {string} The new clause to append to the current where clause
 * @return {string} The modified where clause
 */
nyc.soda.Query.and = function(where, clause){
	if (where){
		if (clause){
			return where + ' AND ' + clause;
		}
		return where;	
	}
	return clause;
};

/**
 * @desc Filter object for {nyc.soda.Query}
 * @public
 * @typedef {Object}
 * @property {string} op Filter operator (=, !=, >, <, >=, <=, IN, NOT IN, BETWEEN, NOT BETWEEN)
 * @property {string|number|Array<string>|Array<number>} value Filter value
 */
nyc.soda.Query.Filter;

/**
 * @desc Query object for {nyc.soda.Query}
 * @public
 * @typedef {Object}
 * @property {string=} select SODA $select parameter
 * @property {string=} where SODA $where parameter
 * @property {string=} group SODA $group parameter
 * @property {string=} order SODA $order parameter
 * @property {number=} limit SODA $limit parameter
 */
nyc.soda.Query.Query;

/**
 * @desc Constructor options for {nyc.soda.Query}
 * @public
 * @typedef {Object}
 * @property {string=} url SODA URL
 * @property {nyc.soda.Query.Query=} query Query options
 * @property {Object<string, Array<nyc.soda.Query.Filter>>=} filters Filter arrays mapped to field names
 */
nyc.soda.Query.Options;


