var nyc = nyc || {};
nyc.carto = nyc.carto || {};

nyc.carto.View = function(){};

/**
 * @desc An interface for managing views on layers
 * @public
 * @class
 * @constructor
 * @param {cartodb.Layer}
 */
nyc.carto.View = function(layer){
	this.layer = layer;
};

nyc.carto.View.prototype = {
	/**
	 * @private
	 * @member {cartodb.Layer}
	 */
	layer: null,
	/**
	 * @desc Change the visibility of the view's layer
	 * @public
	 * @method
	 * @param {boolean} visible
	 */
	visibility: function(visible){
		this.layer[visible ? 'show' : 'hide']();
	},
	/**
	 * @desc Update the view by modifying the data for the layer
	 * @public
	 * @method
	 * @abstract
	 * @param {Object<string, Object<string, string>>} filterValues The values object used to modify the query for this view
	 * @param {Object<string, string>} descriptionValues The values objects for replacing tokens in the descriptionTemplate
	 */
	update: function(filterValues, descriptionValues){
		throw 'Must be implemented';
	}
};

nyc.inherits(nyc.carto.View, nyc.EventHandling);

/**
 * @desc Legend HTML generated after a view modifies the data for its layer 
 * @event nyc.carto.View#updated
 * @type {string} 
 */

/** 
 * @desc Enumerator for view event types
 * @enum {string}
 */
nyc.carto.ViewEventType = {
	/**
	 * @desc The update event type
	 */
	UPDATED: 'updated' 
};
