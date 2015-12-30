var nyc = nyc || {};

/**
 * @desc An interface for managing map location
 * @public
 * @interface
 */
nyc.Locator = function(){};

nyc.Locator.prototype = {
	/**
	 * @public
	 * @abstract
	 * @method
	 * @param {nyc.Locate.Result} data The location to which the map will be oriented
	 */
	zoomLocation: function(){
		throw 'Must be implemented';
	}
};
