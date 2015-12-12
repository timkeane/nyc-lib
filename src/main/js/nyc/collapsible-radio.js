var nyc = nyc || {};

/**
 * @desc Collapsible radio buttons
 * @public
 * @class
 * @constructor
 * @extends {nyc.Collapsible}
 * @param {nyc.Collapsible.Options} options Constructor options
 */
nyc.Radio = function(options){
	var me = this, fieldset = $('<fieldset data-role="controlgroup"></fieldset>'), radio0;
	
	me.choices = options.choices;

	nyc.Radio.uniqueId++;
	
	me.inputs = [];
	$.each(me.choices, function(i, choice){
		var input = $('<input type="radio">').uniqueId(),
			label = $('<label></label>');
		input.attr('name', 'nyc-radio-name' + '-' + nyc.Radio.uniqueId)
			.attr('value', i);
		if (i == 0){
			radio0 = input;
			radio0.attr('checked', true);
		}
		input.click($.proxy(me.changed, me));
		label.attr('for', input.attr('id')).html(choice.label);
		fieldset.append(input).append(label);
		me.inputs.push(input);
	});
		
	$(options.target).append(fieldset).trigger('create');

	nyc.Collapsible.apply(this, [options]);
		
	setTimeout(function(){
		me.changed({target: radio0[0]});
	}, 1);
};

nyc.Radio.prototype = {
	/**
	 * @private
	 * @member {Array<Element>}
	 */
	inputs: null,
	/** 
	 * @private
	 * @method
	 * @param {Object} event
	 */
	changed: function(event){
		var choice = this.choices[event.target.value * 1];
		this.value = choice.value;
		this.currentVal.html(choice.label);
		this.trigger('change', choice);
	},
	/** 
	 * @desc Returns the value of the radio button collection
	 * @public
	 * @method
	 * @return {string} The value of the radio button collection
	 */
	val: function(){
		return this.value;
	},
	/** 
	 * @desc Enable/disable a radio button
	 * @public
	 * @method
	 * @param {string} choiceValue The value of the radio button to disable/enable
	 * @param {boolean} enabled The value of enabled
	 */
	disabled: function(choiceValue, disabled){
		var choiceIndex;
		$.each(this.choices, function(i, choice){
			if (choice.value == choiceValue){
				choiceIndex = i;
				return;
			}
		});
		$(this.inputs[choiceIndex]).prop('disabled', disabled).checkboxradio('refresh');
	}
};

nyc.inherits(nyc.Radio, nyc.Collapsible);

/** 
 * @desc Used to generate DOM ids
 * @public
 * @static {number}
 */
nyc.Radio.uniqueId = 0;