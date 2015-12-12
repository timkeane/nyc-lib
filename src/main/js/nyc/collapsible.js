var nyc = nyc || {};

/**
 * @desc Abstract collapsible widget
 * @public
 * @class
 * @constructor
 * @extends {nyc.EventHandling}
 * @param {Object} options
 */
nyc.Collapsible = function(options){
	var heading = $('<h3></h3>');

	this.currentVal = $('<span class="current-value"></span>');
	
	heading.html(options.title || '')
		.append(this.currentVal);
	
	$(options.target).prepend(heading)
		.collapsible()
		.collapsible('option', {collapsedIcon: 'carat-d', expandedIcon: 'carat-u'});
};

nyc.Collapsible.prototype = {
	/**
	 * @public
	 * @member {string}
	 */
	currentVal: null
};

nyc.inherits(nyc.Collapsible, nyc.EventHandling);