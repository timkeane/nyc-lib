var nyc = nyc || {};

/**
 * @desc A class to handle DOM style attribute mutations in IE browsers before version 11
 * @public
 * @class
 * @constructor
 * @param {function(Object)} handler The function that will handle mutations

 */
MutationObserver = function(handler){
	this.handler = handler;
};

MutationObserver.prototype = {
	/**
	 * @private
	 * @member {function(Object)}
	 */
	handler: null,
	/**
	 * @desc Observe DOM mutations of the specified element
	 * @public
	 * @method
	 * @param element The DOM element to observe
	 */
	observe: function(element, observations){
		for (var observation in observations){
			if (observation != 'attributes'){
				console.warn('Unsupported observation - only style attribute changes can be observed');
			}
		}
		if (observations.attributes){
			var me = this;
			$(element).on('DOMAttrModified', function(event){
				var style = me.styleAsString(element);
				if (element.oldStyle != style){
					element.oldStyle = style;
					me.handler([{
						attributeName: 'style',
						target: element
					}]);
				}
			});
		}
	},
	/**
	 * @private
	 * @method
	 * @param {Object} element
	 */
	styleAsString: function(element){
		var style =  element.style, result = '';
		for (var prop in style){
			if (typeof style[prop] == 'string'){
				result += (prop + ':' + style[prop] + ';');
			}
		}
		return result;
	}
};
