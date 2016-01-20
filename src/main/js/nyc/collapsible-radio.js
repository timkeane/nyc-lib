var nyc = nyc || {};

/**
 * @desc Collapsible radio button collection
 * @public
 * @class
 * @extends {nyc.Choice}
 * @constructor
 * @param {nyc.Choice.Options} options Constructor options
 */
nyc.Radio = function(options){
	nyc.Choice.apply(this, [options]);	
	$(this.inputs[0]).attr('checked', true).trigger('changed');
};

nyc.Radio.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	type: 'radio',
	/** 
	 * @public
	 * @method
	 * @param {Object} event The change event object 
	 */
	changed: function(event){
		var choice = this.choices[event.target.value * 1];
		this.value = choice.value;
		this.currentVal.html(choice.label);
		this.trigger('change', choice);
	}		
};

nyc.inherits(nyc.Radio, nyc.Choice);
