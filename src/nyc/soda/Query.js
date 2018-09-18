/**
 * @module nyc/soda/Query
 */

import nyc from 'nyc'
import Papa from 'papaparse'

 /**
 * @desc A class for querying NYC OpenData using the Socrata SODA API
 * @public
 * @class
 * @see https://opendata.cityofnewyork.us/
 * @see https://dev.socrata.com/consumers/getting-started.html
 */

class Query {
  /**
   * @desc Create an instance of Query
   * @public
   * @constructor
   * @param {Object} options Constructor options
   */
  constructor(options){
		/**
		 * @private
		 * @member {string}
		 */
		this.url = options.url
		/**
		 * @private
		 * @member {string}
		 */
		this.appToken = options.appToken
		/**
		 * @private
		 * @member {nyc.soda.Query.Query}
		 */
		this.query = options.query
		/**
		 * @private
		 * @member {Object<string, Array<nyc.soda.Query.Filter>>} 
		 */
		this.filters = {}
		this.setFilters(options.filters)

	}
	/**
	 * @desc Set app token for SODA api request
	 * @public
	 * @method
	 * @param {string} appToken Authentication token for SODA api
	 */
	setAppToken(appToken){
		this.appToken = appToken || this.appToken
	}
	
	/**
	 * @desc Overwrite a filter for the query
	 * @public
	 * @method
	 * @param {string} field The field to which the filter will be applied
	 * @param {nyc.soda.Query.Filter} filter The filter to apply to the field
	 */
	setFilter(field, filter){
		this.filters[field] = [filter]
	}

	/**
	 * @desc Overwrite all filters for the query
	 * @public
	 * @method
	 * @param {Object<string, Array<nyc.soda.Query.Filter>>} filters Filter arrays mapped to field names
	 */
	setFilters(filters){
		this.filters = filters || {}
	}
	
	/**
	 * @desc Add a filter to the query
	 * @public
	 * @method
	 * @param {string} field The field to which the filter will be applied
	 * @param {nyc.soda.Query.Filter} filters The filter to apply to the field
	 */
	addFilter(field, filter){
		this.filters[field] = this.filters[field] || []
		this.filters[field].push(filter)
	}

	/**
	 * @desc Append filter for each field to where clause
	 * @private
	 * @method
	 * @param {string} where The current where clause
	 * @param {string} field The field where filters will be applied 
	 * @param {nyc.soda.Query.Filter} filter The filter to be applied to field
	 * @return {string}
	 */
	appendFilter(where, field, filter){
		let value = filter.value || '';
		filter.op = filter.op.toUpperCase();
		if (typeof value === 'string'){
			if (value.toUpperCase() === 'NULL'){
				value = 'NULL';
			}else{
				value = `'${value}'`;
			}
		}else if (typeof value === 'number'){
			value = value + '';
		}else if ($.isArray(value)){
			if (typeof value[0] === 'number'){
				value = `(${value.join(', ')})`
			}else{
				value = `('${value.join("', '")}')`
			}
		}
		return Query.and(where, `${field} ${filter.op} ${value}`);
	}

	/**
	 * @desc Clear all filters on specified field
	 * @public
	 * @method
	 * @param {string} field The field to which the filter will be cleared 
	 */
	clearFilters(field){
		delete this.filters[field];
	}	

	/**
	 * @desc Clear all filters on all fields
	 * @public
	 * @method
	 */
	clearAllFilters(){
		this.filters = {};
	}

	/**
	 * @desc Set the base query to which filters can be added
	 * @public
	 * @method
	 * @param {nyc.soda.Query.Query} query the query
	 */
	setQuery(q){
		q = q || {};
		this.query.select = q.select || this.query.select
		this.query.where = q.where || this.query.where || ''
		this.query.group = q.group || this.query.group
		this.query.order = q.order || this.query.order
		this.query.limit = q.limit || this.query.limit
	}

	/** 
	 * @desc Set the url for which queries can be added to
	 * @private
	 * @method
	 * @param {string} url
	 */
	setUrl(url){
		this.url = url || this.url
	}

	/**
	 * @desc Get the SODA API call URL that was last requested or will be requested with the current query and filter settings
	 * @public
	 * @method
	 * @return {string} The SODA API call URL
	 */
	getUrlAndQuery(){
		return this.url + '?' + this.qstr();
	}

	/**
	 * @desc Execute the query
	 * @public
	 * @method
	 * @param {nyc.soda.Query.Options} options The execution options
	 * @param {function(Object<string, Object>, nyc.soda.Query)} callback A callback function to receive the data and a reference to this query
	 */
	execute(options, callback){
		let me = this, filters, csv;
		options = options || {};
		filters = options.filters || {};
		me.setUrl(options.url);
		me.setQuery(options.query);
		me.setAppToken(options.appToken);

		Object.keys(filters).forEach(field => {
			me.filters[`$${field}`] = filters[field]
		})

		const url = me.url + '?' + me.qstr()


		fetch(url).then(response => {
				return response.text()
		}).then(text => {
			me.callback(text, callback)
		})

	}

	/** 
	 * @desc Parses response from query depending on file type, and executes passed-in callback
	 * @private
	 * @method
	 * @param data {Object}
	 * @param {function(Object<string, Object>, nyc.soda.Query)} callback
	 */
	callback(text, callback) {
		let data
		if (this.csv()) {
			data = Papa.parse(text, {header: true}).data
		} else {
			data = JSON.parse(text)
		}
		//if callback function is passed, executes it
		if (callback) {
			callback(data, this);
		}
	}

	/** 
	 * @desc Checks if file is .csv type
	 * @private
	 * @method
	 * @return {boolean}
	 */
	csv(){
		let idxCsv = this.url.indexOf('.csv');
		let idxQstr = this.url.indexOf('?');
		let len = this.url.length;
		let csvPos = len - idxCsv;
		let qstrPos = len - idxQstr;
		return idxCsv > -1 && (csvPos === 4 || (qstrPos === csvPos - 4));
	}

	/** 
	 * @desc Generates query string to be appended to url
	 * @private
	 * @method
	 * @return {string}
	 */
	qstr() {
		let qry = {}
		Object.keys(this.query).forEach(clause => {
			qry[`$${clause}`] = this.query[clause]
		})
		if(this.filters.length > 0){
			Object.keys(this.filters).forEach(field => {
				this.filters[field].forEach(filter => {
					qry.$where = this.appendFilter(qry.$where, field, filter)
				})
			})
		}
		if (this.appToken) {
			qry.$$app_token = this.appToken
		}
		return $.param(qry)
	}	
}

/**
 * @desc Append to a where clause with AND 
 * @public
 * @static
 * @function
 * @param where {string} The current where clause
 * @param clause {string} The new clause to append to the current where clause
 * @return {string} The modified where clause
 */
Query.and = (where, clause) => {
	if (where) {
		if (clause) {
			return `${where}  AND ${clause}`
		}
		return where
	}
	return clause
}


/**
 * @desc Filter object for {nyc.soda.Query}
 * @public
 * @typedef {Object}
 * @property {string} op Filter operator (=, !=, >, <, >=, <=, IN, NOT IN, BETWEEN, NOT BETWEEN)
 * @property {string|number|Array<string>|Array<number>} value Filter value
 */
Query.Filter;

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
Query.Query;

/**
 * @desc Constructor options for {nyc.soda.Query}
 * @public
 * @typedef {Object}
 * @property {string=} url SODA URL
 * @property {string=} appToken SODA $$app_token parameter
 * @property {nyc.soda.Query.Query=} query Query options
 * @property {Object<string, Array<nyc.soda.Query.Filter>>=} filters Filter arrays mapped to field names
 */
Query.Options;

 
 export default Query