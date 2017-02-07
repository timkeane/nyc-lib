var nyc = nyc || {};
nyc.info = nyc.info || {};

/**
 * @desc A class for retrieving proximity information
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @mixes nyc.ReplaceTokens
 * @constructor
 * @fires nyc.Elected#info
 */
nyc.info.Elected = function(){};

nyc.info.Elected.prototype = {
	/**
	 * @desc Return all building and tax lot features at a point
	 * @public
	 * @method
	 * @param {nyc.info.Elected.InfoOptions} options
	 */
	info: function(options){

	},
	/**
	 * @private
	 * @method
	 * @param {string} url
	 * @param {nyc.ProximityInfo.InfoPointOptions|nyc.ProximityInfo.ProximityOptions} options
	 */
	ajax: function(url, options){
		var me = this;
		$.ajax({
			url: me.replace(url, options),
			success: function(data){
				if (options.callback){
					options.callback(data);
				}
				me.trigger(me.eventType(url), data);
			}
		})
	},
};

/**
 * @desc The result of a info request
 * @event nyc.info.Elected#info
 * @type {Object}
 */

/**
 * @desc Object type to hold options for {@link nyc.info.Elected#info}
 * @public
 * @typedef {Object}
 * @property {string} borough The NYC borough 
 * @property {string} council The NYC Council District 
 * @property {string} senate The NYS Senate District 
 * @property {string} assembly The NYS Assembly District 
 * @property {string} congress The US Congressional District 
 */
nyc.info.Elected.InfoOptions;