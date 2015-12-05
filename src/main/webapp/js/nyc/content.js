/** @export */
window.nyc = window.nyc || {};

/** @export */
nyc.Content = (function(){	
	/**
	 * nyc.Content - a class to manage content messages
	 * 
	 * @constructor
	 * @param {Object} messages
	 * 
	 */
	var contentClass = function(messages){
		this.messages = messages;
	};
	
	contentClass.prototype = {
		/** @private */
		messages: null,
		/**
		 * Returns a content message with substituted valeus
		 * 
		 * @export
		 * @param {string} msgId
		 * @param {Object} values
		 * @return {string}
		 */
		message: function(msgId, values){
			var result = this.messages[msgId];
			for (var val in values){
				result = result.replace(new RegExp('\\$\\{' + val + '\\}', 'g'), values[val]);
			}
			return result;			
		}
	};
	
	return contentClass;
	
}());

