var nyc = nyc || {};

/** 
 * @public 
 * @namespace
 */
nyc.jq = nyc.jq || {};

nyc.jq.ui = {
	/**
	 * @private
	 * @static
	 * @member {string}
	 */
	js: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
	/**
	 * @desc Load JQueryUI
	 * @public
	 * @static
	 * @method 
	 * @param {function} callback A function to call once JQueryUI has loaded {@see https://api.jquery.com/jquery.getscript/}
	 */
	load: function(callback){
		if (!$.ui || !$.ui.draggable){
			$.getScript(this.js, function(script, status, xhr){
				if (callback) callback(script, status, xhr);
				/* Fix JQueryMobile widgets that will be broken by loading JQueryUI */
				$('.nyc-choice input').checkboxradio({});
			});
		}else{
			if (callback) callback(script, status, xhr);
			$('.nyc-choice input').checkboxradio({});
		}
	}
};