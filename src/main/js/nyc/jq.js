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
	 */
	load: function(){
		if (!$.ui || !$.ui.draggable){
			$.getScript(this.js, function(){
				/* Fix widgets that will be broken by loading JQueryUI */
				$('.nyc-choice input').checkboxradio({});
			});
		}
	}
};