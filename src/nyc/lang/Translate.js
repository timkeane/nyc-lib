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
   * @param {Translate.Options} options Constructor options
   */
   constructor(options) {
     super(options.target)
     global.nycTranslateInstance = this
     /**
      * @private
      * @member {string}
      */
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
     * @member {Object<string,Object<string,string>>}
     */
    this.messages = options.messages
    /**
     * @private
     * @member {Object<string,Object<string,string>>}
     */
    this.defaultMessages = null
    if (this.messages) {
      if (!this.messages[this.defaultLanguage]) {
        this.defaultLanguage = this.defaultLang()
      }
      if (!this.messages[this.defaultLanguage]) {
        this.defaultLanguage = 'en'
      }
      this.defaultMessages = this.messages[this.defaultLanguage]
    }
    /**
     * @private
     * @member {string}
     */
    this.code = this.defaultLanguage
  	this.render(options.target)
  }
	/**
	 * @desc Sets the chosen language and performs message substitution
	 * @public
	 * @method
   * @param {JQuery.Event} event
	 */
   translate(event) {
	   const lang = $(event.target).val()
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
	   this.trigger(Translate.EventType.CHANGE, this)
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
	getCookieValue() {
    return ''
  }
  /**
	 * @private
	 * @method
   * @param {JQuery|Element|string}
	 */
  render(target) {
    const codes = []
    const div = $(Translate.HTML)
    $(target).append(div)
    Object.keys(this.languages).forEach(lang => {
      const code = this.languages[lang].code
      const opt = $('<option></option>').attr('value', code).html(this.languages[lang].native)
      this.find('select').append(opt)
      codes.push(lang)
      this.hints.push(this.languages[lang].hint)
      this.namedCodes[code] = lang
    })
    this.codes = codes.toString()
    $('body').addClass('lang-en')
    this.find('select').change($.proxy(this.translate, this))
    this.selectDefault()
    this.showHint()
    if (this.button) {
      $('#lng').addClass('button')
    }
    this.trigger(Translate.EventType.READY, this)
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
		return navigator.language.split('-')[0]
	}
	/**
	 * @private
	 * @method
	 */
	selectDefault() {
		const defLang = this.defaultLang()
		const cookie = this.getCookieValue()
    const exact = []
    const possible = []
    Object.values(this.languages).forEach(language => {
      const code = language.code
      if (cookie.indexOf(code) === 0) {
				exact.push(code)
			} else if (cookie.indexOf(defLang) === 0) {
        possible.push(code)
      }
    })
    const lang = exact[0] || possible[0] || 'en'
    this.find('select').val(this.languages[lang].code).trigger('change')
	}
  /**
   * @private
   * @method
   */
  showHint() {
    if (!this.button) {
      const hints = this.hints
      let h = 0
    	setInterval(() => {
        this.find('.hint').html(hints[h] || 'Translate')
    		h++
    		if (h === hints.length) h = 0
    	}, 1000)
    }
  }
}

/**
 * @desc Constructor for {@link Translate}
 * @public
 * @typedef {Object}
 * @property {(String|Element|JQuery)} target The HTML DOM element that will provide language choices
 * @property {Translate.Choices} languages The languages to provide
 * @property {Object<string,Object<string,string>>} messages The language-specific message bundles
 * @property {string} [defaultLanguage='en'] The default language
 * @property {boolean} [button=false] Show as a button
 */
Translate.Options

/**
 * @desc Enumeration for Translate event types
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
 * @desc A language choice for {@link Translate.Choices}
 * @public
 * @typedef {Object}
 * @property {string} code The language code
 * @property {string} name The language name
 * @property {string} native The display value for the language
 * @property {string=} hint The translation of the word 'Translate' in the language
 */
Translate.Choice

/**
 * @desc A mapping of {@link Translate.Choice} objects to language codes
 * @public
 * @typedef {Object<string, Translate.Choice>}
 */
Translate.Choices

/**
 * @desc The class has completed initialization
 * @event Translate#ready
 * @type {boolean}
 */

/**
 * @desc The language value has changed
 * @event Translate#change
 * @type {string}
 */

/**
 * @private
 * @const
 * @type {string}
 */
Translate.HTML = '<div id="lng">' +
  '<button class="btn-sq rad-all">' +
    '<span class ="hint notranslate">Translate</span>' +
    '<select class="notranslate" translate="no" title="Translate..." araia-label="Translate..."></select>' +
  '</button>' +
  '<div id="lng-goog"></div>' +
'</div>'

export default Translate
