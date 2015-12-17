var nyc = nyc || {};
/** 
 * @public 
 * @namespace
 */
nyc.carto = nyc.carto || {};

/** 
 * @external cartodb.Layer 
 * @see http://cartodb.com/
 */
/** 
 * @external cartodb.SQL 
 * @see http://cartodb.com/
 */

/**
 * @desc Class for retrieving data from CartoDB
 * @public
 * @class
 * @constructor
 * @param {string} namedQuery A named query available on the server
 * @param {string=} url The server URL
 */
nyc.carto.Sql = function(namedQuery, url){
	this.namedQuery = namedQuery; 
	this.url = url || nyc.carto.Sql.DEFAULT_URL; 
};

nyc.carto.Sql.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	namedQuery: null,
	/**
	 * @private
	 * @member {string}
	 */
	url: null,
	/**
	 * @desc Execute the named query
	 * @public
	 * @method 
	 */
	execute: function(filterValues, callback){
		$.ajax({
			url: this.url,
			data: {
				namedQuery: this.namedQuery,
				filterValues: filterValues
			},
			success: callback
		});
	}
};

/**
 * @desc The default URL for {@link nyc.carto.Sql}
 * @public 
 * @const
 * @type {string}
 */
nyc.carto.Sql.DEFAULT_URL = '/carto/named-query';

/**
 * @desc Class for replacing values in SQL strings and appending filters to the WHERE clause
 * @public
 * @class
 * @extends {nyc.ReplaceTokens}
 * @constructor
 */
nyc.carto.SqlTemplate = function(){};

nyc.carto.SqlTemplate.prototype = {
	/**
	 * @public
	 * @method 
	 * @param {string} template The SQL template with optional replacement tokens
	 * @param {Object<string, Object<string, string>>} values The replacement values
	 * @param {Object<string, string>=} filters The filters to append to the WHERE clause (i.e. )
	 * @return {string} The SQL statement
	 * @example 
	 * var template = "SELECT * FROM bike WHERE ${where}";
	 * var values =  {
	 *   color: {value: "red"},
	 *   gear: {low: 10, high: 18}
	 * };
	 * var filters = {
	 *   color: "color = '${value}'",
	 *   gear: "gear BETWEEN ${low} AND ${high}"
	 * };
	 * var sqlTmpl = nyc.carto.SqlTemplate();
	 * sqlTmpl.sql(template, values, filters);
	 * //Returns "SELECT * FROM bike WHERE color = 'red' AND gear BETWEEN 10 AND 18"
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