var nyc = nyc || {};

/**
 * @desc  An abstract class for accessing the map container and elements within it
 * @public
 * @class
 * @constructor
 */
nyc.MapContainer = function(){};

nyc.MapContainer.prototype = {
	/**
	 * @desc A method to return the map container  HTML element wrapped in a JQuery
	 * @public
	 * @abstract
	 * @method
	 * @return {JQuery} The the map container HTML element wrapped in a JQuery
	 */
	container: function(){
		throw 'Must be implemented';
	},
	/**
	 * @desc A method to return an element in the container
	 * @public
	 * @abstract
	 * @method
	 * @return {JQuery} The element
	 */
	element: function(selector){
		return this.container().find(selector);
	}
};