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
	$.each(this.inputs, function(_, input){
		$(input).prop('checked', true).checkboxradio('refresh');
	});
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
		var me = this, labels = [], values = [];
		$.each(me.inputs, function(_, input){
			if (input.prop('checked')){
				var choice = me.choices[input.val() * 1];
				labels.push(choice.label);
				values.push(choice.value);
			}
		});
		this.value = values;
		this.currentVal.html(labels.toString().replace(/,/, ', '));
		this.trigger('change', values);
	}		
};

nyc.inherits(nyc.Check, nyc.Choice);
