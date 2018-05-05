/**
 * @module nyc/Dialog
 */

import $ from 'jquery'

import Container from 'nyc/Container'

/**
 * @desc Class for alert, yes/no and input dialogs
 * @public
 * @class
 */
class Dialog extends Container {
	/**
	 * @desc Creates an instance of Dialog
	 * @public
	 * @constructor
	 */
	constructor() {
		super($(Dialog.HTML))
		$('body').append(this.getContainer())
		/**
		 * @private
		 * @member {JQuery}
		 */
		this.okBtns = this.getElem('.btn-ok')
		/**
		 * @private
		 * @member {JQuery}
		 */
		this.yesNoBtns = this.getElem('.btn-yes, .btn-no')
		/**
		 * @private
		 * @member {JQuery}
		 */
	 	this.inputBtns = this.getElem('.btn-submit, .btn-cancel')
		/**
		 * @private
		 * @member {JQuery}
		 */
	 	this.field = this.getElem('input')
		/**
		 * @private
		 * @member {JQuery}
		 */
		this.msg = this.getElem('.dia-msg')
		$('.btn-ok').click($.proxy(this.hndlOk, this))
		$('.btn-ok').click($.proxy(this.hndlLogin, this))
		$('.btn-yes, .btn-no').click($.proxy(this.hndlYesNo, this))
		$('.btn-submit, .btn-no, .btn-cancel').click($.proxy(this.hndlInput, this))
		$(document).keyup($.proxy(this.hndlKey, this))
	}
	/**
	 * @desc Show the ok dialog
	 * @public
	 * @method
	 * @param {Dialog.Options} options Dialog options
	 */
	ok(options) {
		this.buttons(Dialog.Type.OK, options)
		this.show(Dialog.Type.OK, options)
		this.getElem('.btn-ok').focus()
		this.callback = options.callback
	}
	/**
	 * @desc Show the input dialog
	 * @public
	 * @method
	 * @param {Dialog.Options} options Dialog options
	 */
	input(options) {
		this.buttons(Dialog.Type.INPUT, options)
		this.field.attr('placeholder', options.placeholder || '')
		this.show(Dialog.Type.INPUT, options)
		this.field.focus()
	}
	/**
	 * @desc Show the yes-no dialog
	 * @public
	 * @method
	 * @param {Dialog.Options} options Dialog options
	 */
	yesNo(options) {
		this.buttons(Dialog.Type.YES_NO, options)
		this.show(Dialog.Type.YES_NO, options)
		this.getElem('.btn-yes').focus()
	}
	/**
	 * @desc Show the yes-no dialog
	 * @public
	 * @method
	 * @param {Dialog.Options} options Dialog options
	 */
	yesNoCancel(options) {
		this.buttons(Dialog.Type.YES_NO_CANCEL, options)
		this.show(Dialog.Type.YES_NO_CANCEL, options)
		this.getElem('.btn-yes').focus()
	}
	/**
	 * @private
	 * @method
	 * @param {Dialog.Type} type
	 * @param {Array<string>=} buttonText
	 * @param {Array<string>=} buttonHref
	 */
	buttons(type, options) {
		const buttonText = options.buttonText || []
		const buttonHref = options.buttonHref || []
		switch(type) {
			case Dialog.Type.OK:
				this.getElem('.btn-ok').html(buttonText[0] || 'OK')
					.attr('href', buttonHref[0] || '#')
				break
			case Dialog.Type.LOGIN:
				this.getElem('.btn-ok').html('OK').attr('href', '#')
				break
			case Dialog.Type.INPUT:
				this.getElem('.btn-submit').html(buttonText[0] || 'Submit')
					.attr('href', buttonHref[0] || '#')
				this.getElem('.btn-cancel').html(buttonText[1] || 'Cancel')
					.attr('href', buttonHref[1] || '#')
				break
			case Dialog.Type.YES_NO:
				this.getElem('.btn-yes').html(buttonText[0] || 'Yes')
					.attr('href', buttonHref[0] || '#')
				this.getElem('.btn-no').html(buttonText[1] || 'No')
					.attr('href', buttonHref[1] || '#')
				break
			case Dialog.Type.YES_NO_CANCEL:
				this.getElem('.btn-yes').html(buttonText[0] || 'Yes')
					.attr('href', buttonHref[0] || '#')
				this.getElem('.btn-no').html(buttonText[1] || 'No')
					.attr('href', buttonHref[1] || '#')
				this.getElem('.btn-cancel').html(buttonText[2] || 'Cancel')
					.attr('href', buttonHref[2] || '#')
		}
	}
	/**
	 * @private
	 * @method
	 * @param {Dialog.Type} type
	 * @param {Dialog.Options} options
	 */
	show(type, options) {
		this.currentType = type
		this.getContainer().removeClass('dia-3-btns')
		this.getElem('.ui-link').removeClass('ui-link')
		this.inputBtns.css('display', type == Dialog.Type.INPUT ? 'inline-block' : 'none')
		this.field.css('display', type == Dialog.Type.INPUT ? 'block' : 'none')
		this.okBtns.css('display', type == Dialog.Type.OK ? 'inline-block' : 'none')
		this.yesNoBtns.css('display', type == Dialog.Type.YES_NO ? 'inline-block' : 'none')
		if (type == Dialog.Type.YES_NO_CANCEL) {
			this.yesNoBtns.css('display', 'inline-block')
			this.getElem('.btn-cancel').css('display', 'inline-block')
			this.getContainer().addClass('dia-3-btns')
		}
		this.msg.html(options.message || '')
		this.getContainer().fadeIn()
		this.callback = options.callback
	}
	/**
	 * @private
	 * @method
	 * @param {function()} afterHide
	 */
	hide(afterHide) {
		var me = this
		me.container.fadeOut(function(){
			me.getElem('input').val('')
			if (afterHide){
				afterHide()
			}
		})
	}
	/**
	 * @private
	 * @method
	 * @param {Dialog.EventType} type
	 * @param {(boolean|string|Object)} result
	 */
	hndlAny(type, result) {
		var me = this
		me.hide(function(){
			if (me.callback){
				me.callback(result)
				me.callback = null
			}
			me.trigger(type, result)
		})
	}
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 * @return {boolean}
	 */
	cancel(event) {
		var cancel = $(event.target).hasClass('btn-cancel')
		if (cancel) this.hide()
		return cancel
	}
	hndlOk(event) {
		if (this.currentType == Dialog.Type.OK){
			this.hndlAny(Dialog.EventType.OK, true)
		}
	}
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	hndlYesNo(event) {
		if (!this.cancel(event)) {
			if (this.currentType == Dialog.Type.YES_NO_CANCEL || this.currentType == Dialog.Type.YES_NO){
				this.hndlAny(Dialog.EventType.YES_NO, $(event.target).hasClass('btn-yes'))
			}
		}
	}
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	hndlInput(event) {
		if (this.currentType == Dialog.Type.INPUT){
			var value = this.cancel(event) ? '' : this.field.val()
			this.hndlAny(Dialog.EventType.INPUT, value)
		}
	}
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	hndlKey(event) {
		if (this.getContainer().css('display') == 'block'){
			if (event.keyCode == 13 && event.target.tagName.toUpperCase() == 'INPUT'){
				this.hndlOk(event)
				this.hndlYesNo(event)
				this.hndlInput(event)
				this.hndlLogin(event)
			}else if (event.keyCode == 27 && this.currentType != Dialog.Type.OK){
				this.hide()
			}
		}
	}
}

/**
 * @desc Dialog type
 * @public
 * @enum {string}
 */
Dialog.Type = {
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
}

/**
 * @desc Dialog event type
 * @public
 * @enum {string}
 */
Dialog.EventType = {
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
	INPUT: 'input',
	/**
	 * @desc Dialog login event type
	 */
	LOGIN: 'login'
}

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
Dialog.Options

/**
 * @private
 * @const
 * @type {string}
 */
Dialog.HTML = '<div class="dia-container">' +
	'<div class="dia">' +
	'<div class="dia-msg"></div>' +
	'<input class="rad-all">' +
	'<div class="dia-btns">' +
		'<button class="btn rad-all btn-ok">OK</button>' +
		'<button class="btn rad-all btn-yes">Yes</button>' +
		'<button class="btn rad-all btn-no">No</button>' +
		'<button class="btn rad-all btn-submit">OK</button>' +
		'<button class="btn rad-all btn-cancel">Cancel</button>' +
		'</div>' +
	'</div>' +
'</div>'

export default Dialog
