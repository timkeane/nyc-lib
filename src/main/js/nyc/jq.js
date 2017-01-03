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
	 * @member {nyc.jq.ui.LoadState}
	 */
	loadState: 0,
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
	 * @param {function()} callback A function to call once JQueryUI has loaded {@see https://api.jquery.com/jquery.getscript/}
	 */
	load: function(callback){
		if (nyc.jq.ui.loadState == 0 && (!$.ui || !$.ui.sortable)){
			nyc.jq.ui.loadState = 1;
			$.getScript(this.js, function(script, status, xhr){
				nyc.jq.ui.loadState = 2;
				/* Fix JQueryMobile widgets that will be broken by loading JQueryUI */
				$('.nyc-choice input').checkboxradio({});
				nyc.jq.ui.fixCss(callback);
			});
		}else if (this.loadState == 1){
			setTimeout(function(){
				nyc.jq.ui.load(callback);
			}, 100);
		}else{
			$('.nyc-choice input').checkboxradio({});
			nyc.jq.ui.fixCss(callback);			
		}
	},
	/**
	 * @private
	 * @static
	 * @method 
	 * @param {function()} callback
	 */
	fixCss: function(callback){
		$('.nyc-choice label.ui-radio-on').removeClass('ui-radio-on').addClass('ui-radio-off');		
		if (callback){
			callback();
		}
	}
};

/** 
 * @desc Enumerator for popup event types
 * @public
 * @enum {number}
 */
nyc.jq.ui.LoadState = {
	NOT_LOADED: 0,
	LOADING: 1,
	LOADED: 2
};