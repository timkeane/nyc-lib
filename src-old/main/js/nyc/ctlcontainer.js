var nyc = nyc || {};

/**
 * @desc  An abstract class for accessing a control container and elements within it
 * @public
 * @class
 * @constructor
 */
nyc.CtlContainer = function(){};

nyc.CtlContainer.prototype = {
	/**
	 * @desc A method to return a control container HTML element wrapped in a JQuery
	 * @public
	 * @abstract
	 * @method
	 * @return {JQuery} The the control container HTML element wrapped in a JQuery
	 */
	getContainer: function(){
		throw 'Must be implemented';
	},
	/**
	 * @desc A method to return an element in the container
	 * @public
	 * @abstract
	 * @method
	 * @return {JQuery} The element
	 */
	getElem: function(selector){
		return this.getContainer().find(selector);
	}
};