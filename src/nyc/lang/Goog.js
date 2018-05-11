/**
 * @module nyc/lang/Goog
 */

import $ from 'jquery'

import Translate from 'nyc/lang/Translate'

/**
 * @desc Class for language translation using the Google Translate Gadget
 * @public
 * @class
 * @extends {nyc.Translate}
 * @constructor
 * @param {Translate.Options} options Constructor options
 * @fires Translate.EventType#ready
 * @fires Translate.EventType#change
 */
export default class Goog extends Translate {
  /**
   * @desc Class for language translation using the Google Translate Gadget
   * @public
   * @constructor
   * @param {Translate.Options} options Constructor options
   */
  constructor(options) {
    super(options)
    $.getScript('https://translate.google.com/translate_a/element.js?cb=nycTranslateInstance.init')
  }
  /**
	 * @desc Callback to set up Google Translate
	 * @public
	 * @method
	 */
  init() {
		this.goog = new google.translate.TranslateElement({
			pageLanguage: 'en',
			includedLanguages: nycTranslateInstance.codes,
			layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
			autoDisplay: false
		}, 'lng-goog')
		nycTranslateInstance.hack()
		nycTranslateInstance.trigger(Translate.EventType.READY, nycTranslateInstance)
	}
  /**
	 * @desc Sets the chosen language and initiates Google Translation
	 * @public
   * @override
	 * @method
   * @param {JQuery.Event} event
	 */
   translate(event) {
		const choices = $('iframe.goog-te-menu-frame:first').contents().find('.goog-te-menu2-item span.text')
		if (event && choices.length) {
			const lang =  this.languages[$(event.target).val()].name
			if (lang === 'English') {
				this.showOriginalText()
			} else {
				$(choices).each((_, choice) => {
					if ($(choice).text() === lang) {
						$(choice).trigger('click')
						return false
					}
				})
			}
			this.code = this.namedCodes[lang] || 'en'
			this.css('goog-tranlated')
			this.trigger(Translate.EventType.CHANGE, this)
		} else {
			setTimeout(() => {nycTranslateInstance.translate(event)}, 200)
		}
	}
  /**
   * @access protected
   * @method
   * @override
   * @return {string}
   */
  getCookie() {
    const cookies = document.cookie.split('')
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i]
      while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length)
      if (cookie.indexOf('googtrans=') === 0 ) {
        return cookie.substring(10, cookie.length)
      }
    }
  }
  /**
	 * @private
	 * @method
	 */
	hack() {
		/*
		 * google translate doesn't translate placeholder attributes
		 * so we'll add a hidden span after input elements that have placeholders
		 * then use the placeholder text for the span
		 * then apply the translation of the span back to the placeholder
		 */
		$('input[placeholder]').each(function(_, input) {
			const next = $(input).next()
			if (!next.hasClass('lng-placeholder')) {
				$(input).after('<span class="lng-placeholder">' + $(input).attr('placeholder') + '</span>')
			} else {
				const fonts = next.find('font')
				let text = next.html()
				$.each(next.find('font'), function() {
					text = $(input).html()
				})
				$(input).attr('placeholder', text)
			}
		})
		$('body').css('top', 'auto')
		$('#goog-gt-tt').remove()
		setTimeout($.proxy(this.hack, this), 200)
	}
  /**
   * @private
   * @method
   */
  showOriginalText() {
    const googBar = $('iframe.goog-te-banner-frame:first')
    $(googBar.contents().find('.goog-te-button button')).each((_, button) => {
    	if ($(button).text() === 'Show original') {
    		$(button).trigger('click')
    		if (this.find('select').val() !== 'English') {
    			this.find('select').val('English')
    		}
    		return false
    	}
    })
  }
}
