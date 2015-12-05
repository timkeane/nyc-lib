/** 
 * @export 
 * @namespace
 */
window.nyc = window.nyc || {};

/**
 * @export
 * @class
 * @classdesc Abstract collapsible widget
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
	 * @export
	 * @member {string}
	 */
	currentVal: null
};

nyc.inherits(nyc.Collapsible, nyc.EventHandling);