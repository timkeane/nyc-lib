var nyc = nyc || {};

/** 
 * @desc Class for alert, yes/no and input dialogs
 * @public 
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @fires nyc.Dialog#ok
 * @fires nyc.Dialog#yesno
 * @fires nyc.Dialog#input
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
	this.inputElem.keyup($.proxy(this.hndlInput, this));
};

nyc.Dialog.prototype = {
	/**
	 * @desc The dialog container
	 * @public
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
	 * @param {nyc.Dialog.Options} options Dialog options
	 */
	ok: function(options){
		this.buttons(nyc.Dialog.Type.OK, options.buttonText, options.buttonHref);
		this.show(nyc.Dialog.Type.OK, options);
		this.container.find('.btn-ok').focus();
		this.callback = options.callback;
	},
	/**
	 * @desc Show the input dialog
	 * @public
	 * @method
	 * @param {nyc.Dialog.Options} options Dialog options
	 */
	input: function(options){
		this.buttons(nyc.Dialog.Type.INPUT, options.buttonText, options.buttonHref);
		this.inputElem.attr('placeholder', options.placeholder || '');
		this.show(nyc.Dialog.Type.INPUT, options);
		this.inputElem.focus();
	},
	/**
	 * @desc Show the yes-no dialog
	 * @public
	 * @method
	 * @param {nyc.Dialog.Options} options Dialog options
	 */
	yesNo: function(options){
		this.buttons(nyc.Dialog.Type.YES_NO, options.buttonText, options.buttonHref);
		this.show(nyc.Dialog.Type.YES_NO, options);
		this.container.find('.btn-yes').focus();
	},
	/**
	 * @desc Show the yes-no dialog
	 * @public
	 * @method
	 * @param {nyc.Dialog.Options} options Dialog options
	 */
	yesNoCancel: function(options){
		this.buttons(nyc.Dialog.Type.YES_NO_CANCEL, options.buttonText, options.buttonHref);
		this.show(nyc.Dialog.Type.YES_NO_CANCEL, options);
		this.container.find('.btn-yes').focus();
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Dialog.Type} type
	 * @param {Array<string>=} buttonText
	 * @param {Array<string>=} buttonHref
	 */
	buttons: function(type, buttonText, buttonHref){
		var container = this.container;
		buttonText = buttonText || [];
		buttonHref = buttonHref || [];
		switch(type) {
			case nyc.Dialog.Type.OK:
				container.find('.btn-ok').html(buttonText[0] || 'OK')
					.attr('href', buttonHref[0] || '#');
				break;
			case nyc.Dialog.Type.INPUT:
				container.find('.btn-submit').html(buttonText[0] || 'Submit')
					.attr('href', buttonHref[0] || '#');
				container.find('.btn-cancel').html(buttonText[1] || 'Cancel')
					.attr('href', buttonHref[1] || '#');
				break;
			case nyc.Dialog.Type.YES_NO:
				container.find('.btn-yes').html(buttonText[0] || 'Yes')
					.attr('href', buttonHref[0] || '#');
				container.find('.btn-no').html(buttonText[1] || 'No')
					.attr('href', buttonHref[1] || '#');
				break;
			case nyc.Dialog.Type.YES_NO_CANCEL:
				container.find('.btn-yes').html(buttonText[0] || 'Yes')
					.attr('href', buttonHref[0] || '#');
				container.find('.btn-no').html(buttonText[1] || 'No')
					.attr('href', buttonHref[1] || '#');
				container.find('.btn-cancel').html(buttonText[2] || 'Cancel')
					.attr('href', buttonHref[2] || '#');
		}
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Dialog.Type} type
	 * @param {nyc.Dialog.Options} options
	 */
	show: function(type, options){
		this.container.removeClass('dia-3-btns');	
		this.container.find('.ui-link').removeClass('ui-link');
		this.inputElems.css('display', type == nyc.Dialog.Type.INPUT ? 'inline-block' : 'none');
		this.okElems.css('display', type == nyc.Dialog.Type.OK ? 'inline-block' : 'none');
		this.yesNoElems.css('display', type == nyc.Dialog.Type.YES_NO ? 'inline-block' : 'none');
		if (type == nyc.Dialog.Type.YES_NO_CANCEL){
			this.yesNoElems.css('display', 'inline-block');
			this.container.find('.btn-cancel').css('display', 'inline-block');	
			this.container.addClass('dia-3-btns');	
		}
		this.msgElem.html(options.message);
		this.container.fadeIn();
		this.callback = options.callback;
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
	/**
	 * @private
	 * @method
	 * @param {Object} event
	 * @return {boolean}
	 */
	cancel: function(event){
		var cancel = $(event.target).hasClass('btn-cancel');
		if (cancel) this.hide();
		return cancel;
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
		if (!this.cancel(event)){
			this.hndlAny(nyc.Dialog.EventType.YES_NO, $(event.target).hasClass('btn-yes'));
		}
	},
	/**
	 * @private
	 * @method
	 * @param {Object} event
	 */
	hndlInput: function(event){
		if (!this.cancel(event)){
			if (event.keyCode == 13 || $(event.target).hasClass('btn-submit')){
				this.hndlAny(nyc.Dialog.EventType.INPUT, this.inputElem.val());
			}
		}
	}
};

nyc.inherits(nyc.Dialog, nyc.EventHandling);

/**
 * @desc Dialog type
 * @public
 * @enum {string}
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
	 * @desc Dialog with Yes, No and Cancel buttons
	 */
	YES_NO_CANCEL: 'yes-no-cancel',
	/**
	 * @desc Dialog to accept user input
	 */
	INPUT: 'input'
};

/**
 * @desc Dialog event type
 * @public
 * @enum {string}
 */
nyc.Dialog.EventType = {
	/**
	 * @desc Dialog ok event type
	 */
	OK: 'ok',
	/**
	 * @desc Dialog yes-no event type
	 */
	YES_NO: 'yesno',
	/**
	 * @desc Dialog input event type
	 */
	INPUT: 'input'
};

/**
 * @desc The result of a dialog event
 * @event nyc.Dialog#ok
 * @type {boolean}
 */

/**
 * @desc The result of a dialog event
 * @event nyc.Dialog#yesno
 * @type {boolean}
 */

/**
 * @desc The result of a dialog event
 * @event nyc.Dialog#input
 * @type {string}
 */

/**
 * @desc Dialog options.
 * @public
 * @typedef {Object}
 * @property {string} message Message text
 * @property {Array<string>=} buttonText Button text list
 * @property {Array<string>=} buttonHref Button href list
 * @property {string=} placeholder Placeholder text for input dialog
 * @property {function(Object)=} callback Callback function
 */
nyc.Dialog.Options;

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
		'<a class="btn-ok" data-role="button">OK</a>' +
		'<a class="btn-yes" data-role="button">Yes</a>' +
		'<a class="btn-no" data-role="button">No</a>' +
		'<a class="btn-submit" data-role="button">OK</a>' +		
		'<a class="btn-cancel" data-role="button">Cancel</a>' +
		'</div>' +
	'</div>' +
'</div>'
