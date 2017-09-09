var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc A North arrow
 * @public
 * @class
 * @constructor
 * @param {ol.Map} map The map on which to place the North arrow
 */
nyc.ol.NorthArrow = function(map){
	this.view = map.getView();
	this.view.on('change:rotation', this.rotate, this);
	this.arrow = $('<div class="north-arrow"></div>');
	$(map.getTarget()).append(this.arrow);
	this.rotate();
};

nyc.ol.NorthArrow.prototype = {
	/**
	 * @private
	 * @member {ol.View}
	 */
	view: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	arrow: null,
	/**
	 * @desc Show the North arrow
	 * @public
	 * @method
	 */
	show: function(){
		this.arrow.show();
	},
	/**
	 * @desc Hide the North arrow
	 * @public
	 * @method
	 */
	hide: function(){
		this.arrow.hide();
	},
	/**
	 * @private
	 * @method
	 */
	rotate: function(){
		var rotation = 'rotate(' + this.view.getRotation() + 'rad)';
		this.arrow.css({
			transform: rotation, 
			'-webkit-transform': rotation,
			'-ms-transform': rotation
		});
	}
};
