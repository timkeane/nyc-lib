var nyc = nyc || {};

/** 
 * @public 
 * @namespace
 */
nyc.util = {
	/**
	 * @desc Check if browser is IE
	 * @public
	 * @static
	 * @function
	 * @returns {boolean}
	 */
	isIe: function(){
		return 'ActiveXObject' in window;
	},
	/**
	 * @desc Check if OS is iOS
	 * @public
	 * @static
	 * @function
	 * @returns {boolean}
	 */
	isIos: function(){
		return navigator.userAgent.match(/(iPad|iPhone|iPod|iOS)/g) != null;
	},
	/**
	 * @desc Format numeric HTML content to locale specific number format
	 * @public
	 * @static
	 * @function
	 * @param {nyc.util.FormatNumberHtmlOptions} options The options for formatting numbers
	 * @returns {JQuery} The elements that have been formatted
	 */
	formatNumberHtml: function(options){
		var elems = $(options.elements);
		if ('toLocaleString' in Number){
			elems.each(function(_, n){
				var num = $(n).html();
				if (num.trim()){
					var opts = options.options || {};
					if (!options.options && num.indexOf('.') > -1){
						opts = {style:"decimal", minimumFractionDigits: 4}
					}
					if (!isNaN(num) && navigator.language){
						var lang = options.lang || navigator.language;
						num = new Number(num).toLocaleString(lang, opts);
						$(n).html(num);
					}
				}
			});					
		}
		return elems;
	},
	/**
	 * @desc A click event handler for HTML elements that will not fire twice on certain mobile devices
	 * @public
	 * @static
	 * @function
	 * @param {Object} event The event object
	 * @param {function(Object)} handler The event handler function 
	 * @param {Object=} scope The scope in which to invoke the event handler
	 */
	preventDblEventHandler: function(event, handler, scope){
		var target = $(event.target), last = target.data('last-click'), now = new Date().getTime();
		if ((last * 1) + 600 < now || !last){
			if (scope){
				handler.apply(scope, [event]);
			}else{
				handler(event);
			}
		}
		target.data('last-click', now);		
	}
};

/**
 * @desc Object type to hold arguments for {@link nyc.util.formatNumberHtml}
 * @public
 * @typedef {Object}
 * @property {JQuery|string} elements The HTML elements to format
 * @property {string=} lang The language code for formatting
 * @property {Object=} options The options for Number#toLocaleString {@see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString}
 */
nyc.util.FormatNumberHtmlOptions;

