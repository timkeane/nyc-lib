/**
 * @module nyc/soda/Query
 */

import nyc from 'nyc'

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
	 * @param {string} appToken
	 */
	setAppToken(appToken){
		this.appToken = appToken || this.appToken
	}
	/**
	 * @desc Overwrite a filter for the query
	 * @public
	 * @method
	 * @param {string} field The field to which the filter will be applied
	 * @param {nyc.soda.Query.Filter} filters The filter to apply to the field
	 */
	setFilter(field, filter){
		this.filters[field] = [filter]
	}
	/**
	 * @desc Overwrite filters for the query
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
	 * @desc Clear all filters on a field
	 * @public
	 * @method
	 * @param {string=} field The field whose filters will be cleared.
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
		this.query.where = q.where || this.query.where
		this.query.group = q.group || this.query.group
		this.query.order = q.order || this.query.order
		this.query.limit = q.limit || this.query.limit
	}
	/** 
	 * @private
	 * @method
	 * @param url {string}
	 */
	setUrl(url){
		this.url = url || this.url
	}
	
 }

 Query.options
 Query.Filter
 
 export default Query