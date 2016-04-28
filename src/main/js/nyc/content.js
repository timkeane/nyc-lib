var nyc = nyc || {};

/** 
 * @desc A class to provide messages with substitution values
 * @public 
 * @class
 * @constructor
 * @param {Object<string, string>|Array<Object<string, string>>} messages The messages with optional tokens mapped by message id
 */
nyc.Content = function(messages){
	var messageMap = [];
	messages = $.isArray(messages) ? messages : [messages];
	$.each(messages, function(_, map){
		for (msg in map){
			messageMap[msg] = map[msg];
		}
	});
	this.messages = messageMap;
};

nyc.Content.prototype = {
	/** 
	 * @private
	 * @member {Object<string, string>}
	 */
	messages: null,
	/**
	 * @desc Returns a content message with substituted valeus
	 * @public
	 * @method
	 * @param {string} msgId The id for the message
	 * @param {Object<string, string>=} values The substitution values
	 * @return {string} The message with substituted values if provided
	 */
	message: function(msgId, values){
		return this.replace(this.messages[msgId], values || {});			
	}
};

nyc.inherits(nyc.Content, nyc.ReplaceTokens);

/** 
 * @desc A class to load csv data into a hash
 * @public 
 * @class
 * @constructor
 * @param {string} url The CSV data with a key column and a value column
 * @param {function(Object<string, string>)} callback A callback function to receive the data
 */
nyc.CsvContent = function(url, callback){
	$.ajax({
		url: url,
		success: function(csvData){
			var csvRows = $.csv.toObjects(csvData), result = {};
			$.each(csvRows, function(_, row){
				result[row.key] = row.value;
			});
			callback(result);
		}
	});
};
