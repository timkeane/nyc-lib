var nyc = nyc || {};

/**
 * @desc Collapsible control
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.Collapsible.Options} options Constructor options
 */
nyc.Collapsible = function(options){
	var heading = $('<h3></h3>');

	this.container = $(options.target).append(options.content);
	this.currentVal = $('<span class="current-value"></span>');

	heading.html(options.title || '')
		.append(this.currentVal);


	$(options.target).prepend(heading)
		.collapsible()
		.collapsible('option', {
			collapsed: !options.expanded,
			collapsedIcon: 'carat-d',
			expandedIcon: 'carat-u'
		}).addClass('ctl-collapse');

};

nyc.Collapsible.prototype = {
	/**
	 * @desc A JQuery element representation of the container
	 * @public
	 * @member {JQuery}
	 */
	container: null,
	/**
	 * @desc A JQuery element used to display a readable representation of the current value
	 * @public
	 * @member {JQuery}
	 */
	currentVal: null
};

nyc.inherits(nyc.Collapsible, nyc.EventHandling);

/**
 * @desc Constructor options for {@link nyc.Collapsible}
 * @public
 * @typedef {Object}
 * @property {Element|JQuery|string} target The target DOM node for creating the collapsible control
 * @property {string} title The title to display
 * @property {Element|JQuery|string=} content Content for the collapsible control
 * @property {boolean} [expanded=false] The intial state of the collapsible control
 */
nyc.Collapsible.Options;
