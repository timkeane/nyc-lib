var nyc = nyc || {};

/**
 * @desc Collapsible checkbox collection
 * @public
 * @class
 * @extends {nyc.Choice}
 * @constructor
 * @param {nyc.Choice.Options} options Constructor options
 */
nyc.Check = function(options){
	nyc.Choice.apply(this, [options]);
	this.changed();
};

nyc.Check.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	type: 'checkbox',
	/** 
	 * @public
	 * @method
	 * @param {Object} event The change event object 
	 */
	changed: function(event){
		var me = this, display = me.currentVal; chosen = [], comma = '';
		display.empty();
		$.each(me.inputs, function(_, input){
			var choice = me.choices[input.val() * 1];
			choice.checked = false;
			if (input.prop('checked')){
				choice.checked = true;
				chosen.push(choice);
				display.append(comma + choice.label);
				comma = ', ';
			}
		});
		this.value = chosen;
		this.trigger('change', chosen);
	}		
};

nyc.inherits(nyc.Check, nyc.Choice);
