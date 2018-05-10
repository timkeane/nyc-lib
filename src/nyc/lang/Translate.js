/**
 * @module nyc/lang/Translate
 */

import $ from 'jquery'

import Container from 'nyc/Container'

/**
 * @desc Class for language translation using the Google Translate Gadget
 * @public
 * @class
 * @extends {nyc.Container}
 * @constructor
 * @param {Translate.Options} options Constructor options
 * @fires Translate.EventType#ready
 * @fires Translate.EventType#change
 */
class Translate extends Container {
  /**
   * @desc Class for language translation using the Google Translate Gadget
   * @public
   * @constructor
   * @param {nyc.lang.Translate.Options} options Constructor options
   */
  constructor(options) {
    super(options.target)
  	global.nycTranslateInstance = this
    this.defaultLanguage = options.defaultLanguage || 'en'
    /**
  	 * @private
  	 * @member {boolean}
  	 */
  	this.button = options.button
    /**
  	 * @private
  	 * @member {Array<string>}
  	 */
  	this.languages = options.languages
    /**
  	 * @private
  	 * @member {Array<string>}
  	 */
  	this.hints = []
    /**
  	 * @private
  	 * @member {Array<string>}
  	 */
  	this.namedCodes = {}
    /**
  	 * @private
  	 * @member {string}
  	 */
  	this.code = ''
    /**
  	 * @private
  	 * @member {string}
  	 */
  	this.defaultLanguage = ''
    if (options.messages) {
        this.messages = options.messages
        this.defaultMessages = options.messages[this.defaultLanguage] || options.messages[this.defaultLang()]
    }
  	this.render(options.target)
  }
	/**
	 * @desc Sets the chosen language and performs message substitution
	 * @public
	 * @method
	 */
   translate(event) {
	   if (event) {
		   const lang = $(event.target).val()
		   if (lang) {
			   this.code = lang
         Object.keys(this.defaultMessages).forEach(key => {
           const messages = this.messages[lang] || this.defaultMessages
           const msg = messages[key] || this.defaultMessages[key]
				   $('.' + key).html(msg)
				   $('*[data-msg-key="' + key + '"]').each((_, element) => {
					   $(element).attr($(element).data('msg-attr'), msg)
				   })
         })
			   this.css('translated')
			   this.trigger(Translate.EventType.CHANGE, this.code)
		   }
	   }
   }
	/**
	 * @desc Get the currently chosen language code
	 * @public
	 * @method
	 * @return {string} The currently chosen language code
	 */
	lang() {
		return this.code
	}
	/**
	 * @access protected
	 * @method
	 * @return {string}
	 */
	getCookieValue() {}
  /**
	 * @private
	 * @method
   * @param {JQuery|Element|string}
	 */
  render(target) {
    const codes = []
    const div = $(Translate.HTML)
    $(target).append(div)
    Object.keys(this.languages).forEach(code => {
      const name = this.languages[code].val || code
      const opt = $('<option></option>').attr('value', name).html(this.languages[code].desc)
      $('#lng select').append(opt)
      codes.push(code)
      this.hints.push(this.languages[code].hint)
      this.namedCodes[name] = code
    })
    this.codes = codes.toString()
    $('body').addClass('lang-en')
    $('#lng select').change($.proxy(this.translate, this))
    this.setChoices()
    if (this.button) {
      $('#lng').addClass('button')
    }
    if (this.messages) {
      this.trigger(Translate.EventType.READY, true)
    }
  }
  /**
	 * @private
	 * @method
   * @param {string}
	 */
	css(css) {
    const body = $('body')
		this.codes.split(',').forEach(code => {
			body.removeClass('lang-' + code)
		})
		body[this.code === this.defaultLanguage ? 'removeClass' : 'addClass'](css)
		body.addClass('lang-' + this.code)
		body.addClass(css)
	}
	/**
	 * @private
	 * @method
	 */
	defaultLang() {
		return navigator.language ? navigator.language.split('-')[0] : (this.defaultLanguage || 'en')
	}
	/**
	 * @private
	 * @method
	 */
	setChoices() {
		const defLang = this.defaultLang()
		const cookie = this.getCookieValue()
    const exact = []
    const possible = []
		this.showHint()
    Object.keys(this.languages).forEach(code => {
      if (code.indexOf(cookie) === 0) {
				exact.push(code)
			} else if (code.indexOf(defLang) === 0) {
        possible.push(code)
      }
    })
    const lang = exact[0] || possible[0] || 'en'
		$('#lng select').val(this.languages[lang].val).trigger('change')
	}
  /**
   * @private
   * @method
   */
  showHint() {
  	const hints = this.hints
    let h = 0
  	setInterval(() => {
      $('#lng .hint').html(hints[h] || 'Translate')
  		h++
  		if (h === hints.length) h = 0
  	}, 1000)
  }
}

/**
 * @desc Constructor for {@link nyc.lang.Translate}
 * @public
 * @typedef {Object}
 * @property {(String|Element|JQuery)} target The HTML DOM element that will provide language choices
 * @property {Translate.Choices} languages The languages to provide
 * @property {Object} messages The language-specific message bundles
 * @property {string} [defaultLanguage='en'] The default language
 * @property {boolean} [button=false] Show as a button
 */
Translate.Options

/**
 * @desc Enumeration for nyc.lang.Translate event types
 * @public
 * @enum {string}
 */
Translate.EventType = {
	/**
	 * @desc The ready event type
	 */
	READY: 'ready',
	/**
	 * @desc The change event type
	 */
	CHANGE: 'change'
}

/**
 * @desc A language choice for {@link nyc.lang.Translate.Choices}
 * @public
 * @typedef {Object}
 * @property {string} val The language value used by Google
 * @property {string} desc The display value for the language
 * @property {string=} hint The translation of the word 'Translate' in the language
 */
Translate.Choice

/**
 * @desc A mapping of {@link nyc.lang.Translate.Choice} objects to language codes
 * @public
 * @typedef {Object<string, nyc.lang.Translate.Choice>}
 */
Translate.Choices

/**
 * @desc The class has completed initialization
 * @event nyc.lang.Translate#ready
 * @type {boolean}
 */

/**
 * @desc The language value has changed
 * @event nyc.lang.Translate#change
 * @type {string}
 */

/**
 * @private
 * @const
 * @type {string}
 */
Translate.HTML = '<div id="lng">' +
  '<button class="btn-sq rad-all">' +
    '<span class ="hint">Translate</span>' +
    '<select class="notranslate" translate="no" title="Translate..." araia-label="Translate..."></select>' +
  '</button>' +
'</div>'

export default Translate
