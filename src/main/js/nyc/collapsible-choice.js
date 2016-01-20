var nyc = nyc || {};

/**
 * @desc Collapsible choice control
 * @public
 * @abstract
 * @class
 * @extends {nyc.Collapsible}
 * @constructor
 * @param {nyc.Choice.Options} options Constructor options
 */
nyc.Choice = function(options){
	var me = this, fieldset = $('<fieldset data-role="controlgroup"></fieldset>'), radio0;
	
	me.choices = options.choices;

	nyc.Choice.uniqueId++;
	
	me.inputs = [];
	$.each(me.choices, function(i, choice){
		var input = $('<input type="' + me.type + '">').uniqueId(),
			label = $('<label></label>');
		input.attr('name', 'nyc-radio-name' + '-' + nyc.Choice.uniqueId)
			.attr('value', i);
		if (i == 0){
			radio0 = input;
		}
		input.click($.proxy(me.changed, me));
		label.attr('for', input.attr('id')).html(choice.label);
		fieldset.append(input).append(label);
		me.inputs.push(input);
	});
		
	$(options.target).append(fieldset).trigger('create');

	nyc.Collapsible.apply(this, [options]);
};

nyc.Choice.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	type: null,
	/**
	 * @private
	 * @member {Array<Element>}
	 */
	inputs: null,
	/** 
	 * @public
	 * @abstract
	 * @method
	 * @param {Object} event The change event object 
	 */
	changed: function(event){
		throw 'Must be implemented';
	},
	/** 
	 * @desc Returns the value of the radio button collection
	 * @public
	 * @method
	 * @return {string|Array<string>} The value of the radio button collection
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

nyc.inherits(nyc.Choice, nyc.Collapsible);

/** 
 * @desc Used to generate DOM ids
 * @public
 * @static {number}
 */
nyc.Choice.uniqueId = 0;

/**
 * @desc A choice for {@link nyc.Choice.Options}
 * @public
 * @typedef {Object}
 * @property {string} label The label for the choice
 * @property {string} value The value of the choice
 */
nyc.Choice.Choice;

/**
 * @desc Constructor options for {@link nyc.Choice}
 * @public
 * @typedef {Object}
 * @property {Element|JQuery|string} target The target DOM node for creating the collapsible choice control
 * @property {string} title The title to display
 * @property {Array<nyc.Choice.Choice>} choices The choices for the user
 */
nyc.Choice.Options;