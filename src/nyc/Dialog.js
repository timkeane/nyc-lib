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
		this.okBtn = this.getElem('.btn-ok')
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
		this.okBtn.focus()

		const dia = this
		const ok = this.okBtn
		return new Promise((resolve) => {
			ok.one('click', () => {
				dia.hide()
				resolve(true)
			})
		})
	}
	/**
	 * @desc Show the input dialog
	 * @public
	 * @method
	 * @param {Dialog.Options} options Dialog options
	 */
	input(options) {
		const field = this.field
		this.buttons(Dialog.Type.INPUT, options)
		field.attr('placeholder', options.placeholder || '')
		this.show(Dialog.Type.INPUT, options)
		field.focus()

		const dia = this
		const input = this.inputBtns
		return new Promise((resolve) => {
			const keyup = (event) => {
				dia.hndlKey(resolve, dia, event)
			}
			$(document).keyup(keyup)
			input.one('click', (event) => {
				const cancel = $(event.target).hasClass('btn-cancel')
				$(document).off('keyup', keyup)
				dia.hide()
				resolve(cancel ? undefined : field.val())
			})
		})
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

		const dia = this
		const yesNo = this.yesNoBtns
		return new Promise((resolve) => {
			yesNo.one('click', (event) => {
				dia.hide()
				resolve($(event.target).hasClass('btn-yes'))
			})
		})
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

		const dia = this
		const yesNo = this.yesNoBtns
		const cancel = this.getElem('.btn-cancel')
		return new Promise((resolve) => {
			const keyup = (event) => {
				dia.hndlKey(resolve, dia, event)
			}
			$(document).keyup(keyup)
			yesNo.one('click', (event) => {
				$(document).off('keyup', keyup)
				dia.hide()
				resolve($(event.target).hasClass('btn-yes'))
			})
			cancel.one('click', () => {
				$(document).off('keyup', keyup)
				dia.hide()
				resolve(undefined)
			})
		})
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
		this.inputBtns.css('display', type === Dialog.Type.INPUT ? 'inline-block' : 'none')
		this.field.css('display', type === Dialog.Type.INPUT ? 'block' : 'none')
		this.okBtn.css('display', type === Dialog.Type.OK ? 'inline-block' : 'none')
		this.yesNoBtns.css('display', type === Dialog.Type.YES_NO ? 'inline-block' : 'none')
		if (type === Dialog.Type.YES_NO_CANCEL) {
			this.getContainer().addClass('dia-3-btns')
			this.yesNoBtns.css('display', 'inline-block')
			this.getElem('.btn-cancel').css('display', 'inline-block')
		}
		this.msg.html(options.message)
		this.getContainer().fadeIn()
	}
	/**
	 * @private
	 * @method
	 */
	hide() {
		const field = this.field
		this.getContainer().fadeOut(() => {
			field.val('')
		})
	}
	/**
	 * @private
	 * @method
	 * @param {function()} resolve
	 * @param {Dialog} dia
	 * @param {JQuery.Event} event
	 */
	hndlKey(resolve, dia, event) {
		if (event.keyCode === 13 && $(event.target).get(0) === dia.field.get(0)) {
			dia.hide()
			resolve(dia.field.val())
		} else if (event.keyCode === 27) {
			dia.hide()
			resolve(undefined)
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
	INPUT: 'input'
}

/**
 * @desc Dialog options.
 * @public
 * @typedef {Object}
 * @property {string} message Message text
 * @property {Array<string>=} buttonText Button text list
 * @property {Array<string>=} buttonHref Button href list
 * @property {string=} placeholder Placeholder text for input dialog
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
		'<a class="btn rad-all btn-ok">OK</a>' +
		'<a class="btn rad-all btn-yes">Yes</a>' +
		'<a class="btn rad-all btn-no">No</a>' +
		'<a class="btn rad-all btn-submit">OK</a>' +
		'<a class="btn rad-all btn-cancel">Cancel</a>' +
		'</div>' +
	'</div>' +
'</div>'

export default Dialog
