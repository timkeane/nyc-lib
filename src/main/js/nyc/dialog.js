var nyc = nyc || {};

/** 
 * @desc Class for alert, yes/no and input dialogs
 * @public 
 * @class
 * @extends {nyc.EventHandling}
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
	this.inputElem = this.container.find('input');
	this.msgElem = this.container.find('.dia-msg');
	this.okElems.click($.proxy(this.hndlOk, this));	
	this.yesNoElems.click($.proxy(this.hndlYesNo, this));
	this.inputElems.click($.proxy(this.hndlInput, this));
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
	inputElem: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	msgElem: null,
	/**
	 * @private
	 * @member {function(Object)}
	 */
	callback: null,
	/**
	 * @desc Show the ok dialog
	 * @public
	 * @method
	 * @param {string} msg The message to display
	 * @param {function(boolean)=} callback Callback function
	 */
	ok: function(msg, callback){
		this.show(nyc.Dialog.Type.OK, msg);
		this.container.find('.btn-ok').focus();
		this.callback = callback;
	},
	/**
	 * @desc Show the input dialog
	 * @public
	 * @method
	 * @param {string} msg The message to display
	 * @param {string=} placeholder The placeholder for the input field
	 * @param {function(string)=} callback Callback function
	 */
	input: function(msg, placeholder, callback){
		if (typeof placeholder == 'function') {
			callback = placeholder;
			placeholder = '';
		}
		this.inputElem.attr('placeholder', placeholder || '');
		this.show(nyc.Dialog.Type.INPUT, msg);
		this.inputElem.focus();
		this.callback = callback;
	},
	/**
	 * @desc Show the yes-no dialog
	 * @public
	 * @method
	 * @param {string} msg The message to display
	 * @param {function(boolean)=} callback Callback function
	 */
	yesNo: function(msg, callback){
		this.show(nyc.Dialog.Type.YES_NO, msg);
		this.container.find('.btn-yes').focus();
		this.callback = callback;
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Dialog.Type} type
	 * @param {string} msg
	 */
	show: function(type, msg){
		this.inputElems.css('display', type == nyc.Dialog.Type.INPUT ? 'inline-block' : 'none');
		this.okElems.css('display', type == nyc.Dialog.Type.OK ? 'inline-block' : 'none');
		this.yesNoElems.css('display', type == nyc.Dialog.Type.YES_NO ? 'inline-block' : 'none');
		this.msgElem.html(msg);
		this.container.fadeIn();
	},
	/**
	 * @private
	 * @method
	 */
	hide: function(){
		var input = this.inputElem;
		this.container.fadeOut(function(){
			input.val('');
		});
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Dialog.EventType} type 
	 * @param {(boolean|string)} result 
	 */
	hndlAny: function(type, result){
		if (this.callback){
			this.callback(result);
			this.callback = null;
		}
		this.trigger(type, result);
		this.hide();
	},
	hndlOk: function(event){
		this.hndlAny(nyc.Dialog.EventType.OK, true);
	},
	/**
	 * @private
	 * @method
	 * @param {Object} event
	 */
	hndlYesNo: function(event){
		this.hndlAny(nyc.Dialog.EventType.YES_NO, $(event.target).hasClass('btn-yes'));
	},
	/**
	 * @private
	 * @method
	 * @param {Object} event
	 */
	hndlInput: function(event){
		var target = event.target, result = false;
		if (target.tagName != 'INPUT'){
			if ($(target).hasClass('btn-submit')){
				result = this.inputElem.val();
			}
			this.hndlAny(nyc.Dialog.EventType.INPUT, result);
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
nyc.Dialog.HTML = '<div class="ui-page-theme-a dia-container">' +
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
