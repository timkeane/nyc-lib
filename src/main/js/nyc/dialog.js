var nyc = nyc || {};

/** 
 * @desc Class for alert and yes/no dialogs
 * @public 
 * @class
 * @constructor
 */
nyc.Dialog = function(){
	this.container = $(nyc.Dialog.HTML);
	$('body').append(this.container);
	this.container.trigger('create');
	this.okElems = this.container.find('.btn-ok');
	this.yesNoElems = this.container.find('.btn-yes, .btn-no');
	this.inputElems = this.container.find('input').parent();
	this.inputElems = this.inputElems.add(this.container.find('.btn-submit, .btn-cancel'));
	this.msg = this.container.find('.dia-msg');
	this.okElems.click($.proxy(this.ok, this));	
	this.yesNoElems.click($.proxy(this.yesNo, this));
	this.inputElems.click($.proxy(this.input, this));
};

nyc.Dialog.prototype = {
	/**
	 * @private
	 * @member {JQuery}
	 */
	container: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	okElems: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	yesNoElems: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	inputElems: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	msg: null,
	/**
	 * @desc Show the dialog
	 * @public
	 * @method
	 * @param {nyc.Dialog.Type} type The type of dialog
	 * @param {string} msg The message to display
	 */
	show: function(type, msg){
		this.inputElems.css('display', type == nyc.Dialog.Type.INPUT ? 'inline-block' : 'none');
		this.okElems.css('display', type == nyc.Dialog.Type.OK ? 'inline-block' : 'none');
		this.yesNoElems.css('display', type == nyc.Dialog.Type.YES_NO ? 'inline-block' : 'none');
		this.msg.html(msg);
		this.container.fadeIn();
	},
	/**
	 * @private
	 * @method
	 */
	hide: function(){
		this.container.fadeOut();
	},
	ok: function(event){
		this.trigger(nyc.Dialog.EventType.OK, true);
		this.hide();
	},
	/**
	 * @private
	 * @method
	 * @param {Object} event
	 */
	yesNo: function(event){
		this.trigger(nyc.Dialog.EventType.YES_NO, $(event.target).hasClass('btn-yes'));
		this.hide();
	},
	/**
	 * @private
	 * @method
	 * @param {Object} event
	 */
	input: function(event){
		var target = event.target, result = false;
		if (target.tagName != 'INPUT'){
			if ($(target).hasClass('btn-submit')){
				result = this.container.find('input').val();
			}
			this.trigger(nyc.Dialog.EventType.INPUT, result);
			this.hide();
		}
	}
};

nyc.inherits(nyc.Dialog, nyc.EventHandling);

/**
 * @desc Dialog type
 * @public
 * @enum
 * @type {string}
 */
nyc.Dialog.Type = {
	/**
	 * @desc Dialog with OK button
	 */
	OK: 'ok',
	/**
	 * @desc Dialog with Yes and No buttons
	 */
	YES_NO: 'yes-no',
	/**
	 * @desc Dialog to accept user input
	 */
	INPUT: 'input'
};

/**
 * @desc Dialog event type
 * @public
 * @enum
 * @type {string}
 */
nyc.Dialog.EventType = {
	/**
	 * @desc Dialog ok event type
	 */
	OK: 'ok',
	/**
	 * @desc Dialog yes-no event type
	 */
	YES_NO: 'yes-no',
	/**
	 * @desc Dialog input event type
	 */
	INPUT: 'input'
};

/**
 * @private
 * @const
 * @type {string}
 */
nyc.Dialog.HTML = '<div class="dia-container">' +
	'<div class="dia">' +
	'<div class="dia-msg"></div>' +
	'<input>' +
	'<div class="dia-btns">' +
		'<button class="btn-ok">OK</button>' +
		'<button class="btn-yes">Yes</button>' +
		'<button class="btn-no">No</button>' +
		'<button class="btn-submit">OK</button>' +		
		'<button class="btn-cancel">Cancel</button>' +
		'</div>' +
	'</div>' +
'</div>'
