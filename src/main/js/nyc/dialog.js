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
	this.container = $(nyc.Dialog.HTML).trigger('create');
	$('body').append(this.container);
	this.container.trigger('create');
	this.okElems = this.container.find('.btn-ok');
	this.yesNoElems = this.container.find('.btn-yes, .btn-no');
	this.inputElems = this.container.find('input.dia-input').parent();
	this.inputElems = this.inputElems.add(this.container.find('.btn-submit, .btn-cancel'));
	this.inputElem = this.container.find('input.dia-input');
	
	this.loginElems = this.container.find('input.dia-user').parent();
	this.loginElems = this.loginElems.add(this.container.find('input.dia-pw').parent());
	this.loginElems = this.loginElems.add(this.container.find('.btn-ok, .btn-cancel'));
	this.userElem = this.container.find('input.dia-user');
	this.pwElem = this.container.find('input.dia-pw');
	
	this.msgElem = this.container.find('.dia-msg');
	$('.btn-ok').click($.proxy(this.hndlOk, this));
	$('.btn-ok').click($.proxy(this.hndlLogin, this));	
	$('.btn-yes, .btn-no').click($.proxy(this.hndlYesNo, this));
	$('.btn-submit, .btn-no, .btn-cancel').click($.proxy(this.hndlInput, this));
	$(document).keyup($.proxy(this.hndlKey, this));
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
	 * @desc Show the ok dialog
	 * @public
	 * @method
	 * @param {nyc.Dialog.Options} options Dialog options
	 */
	login: function(options){
		this.buttons(nyc.Dialog.Type.LOGIN);
		this.show(nyc.Dialog.Type.LOGIN, options);
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
			case nyc.Dialog.Type.LOGIN:
				container.find('.btn-ok').html('OK').attr('href', '#');
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
		this.currentType = type;
		this.container.removeClass('dia-3-btns');	
		this.container.find('.ui-link').removeClass('ui-link');
		this.loginElems.css('display', 'none');
		this.inputElems.css('display', type == nyc.Dialog.Type.INPUT ? 'inline-block' : 'none');
		this.okElems.css('display', type == nyc.Dialog.Type.OK ? 'inline-block' : 'none');
		this.yesNoElems.css('display', type == nyc.Dialog.Type.YES_NO ? 'inline-block' : 'none');
		if (type == nyc.Dialog.Type.LOGIN){
			this.loginElems.css('display', 'inline-block');
		}
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
		var container = this.container;
		container.fadeOut(function(){
			container.find('input').val('');
		});
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Dialog.EventType} type 
	 * @param {(boolean|string|Object)} result 
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
	 * @param {JQuery.Event} event
	 * @return {boolean}
	 */
	cancel: function(event){
		var cancel = $(event.target).hasClass('btn-cancel');
		if (cancel) this.hide();
		return cancel;
	},
	hndlOk: function(event){
		if (this.currentType == nyc.Dialog.Type.OK){
			this.hndlAny(nyc.Dialog.EventType.OK, true);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	hndlYesNo: function(event){
		if (!this.cancel(event)){
			if (this.currentType == nyc.Dialog.Type.YES_NO_CANCEL || this.currentType == nyc.Dialog.Type.YES_NO){
				this.hndlAny(nyc.Dialog.EventType.YES_NO, $(event.target).hasClass('btn-yes'));
			}
		}
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	hndlInput: function(event){
		if (!this.cancel(event) && this.currentType == nyc.Dialog.Type.INPUT){
			this.hndlAny(nyc.Dialog.EventType.INPUT, this.inputElem.val());
		}
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	hndlLogin: function(event){
		if (!this.cancel(event) && this.currentType == nyc.Dialog.Type.LOGIN){
			this.hndlAny(nyc.Dialog.EventType.LOGIN, {user: this.userElem.val(), password: this.pwElem.val()});
		}
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	hndlKey: function(event){
		if (this.container.css('display') == 'block'){
			if (event.keyCode == 13 && event.target.tagName.toUpperCase() == 'INPUT'){
				this.hndlOk(event);
				this.hndlYesNo(event);
				this.hndlInput(event);
				this.hndlLogin(event);
			}else if (event.keyCode == 27){
				this.hide();
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
	INPUT: 'input',
	/**
	 * @desc Dialog to accept user name and password
	 */
	LOGIN: 'login'
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
	'<input class="dia-input">' +
	'<input class="dia-login dia-user" placeholder="Enter user name">' +
	'<input class="dia-login dia-pw" type="password" placeholder="Enter password">' +
	'<div class="dia-btns">' +
		'<a class="btn-ok" data-role="button">OK</a>' +
		'<a class="btn-yes" data-role="button">Yes</a>' +
		'<a class="btn-no" data-role="button">No</a>' +
		'<a class="btn-submit" data-role="button">OK</a>' +		
		'<a class="btn-cancel" data-role="button">Cancel</a>' +
		'</div>' +
	'</div>' +
'</div>'
