/**
 * @module nyc/lang/Translate
 */

import $ from 'jquery'

import Container from 'nyc/Container'

/**
 * @desc Class for language translation using the Google Translate Gadget
 * @public
 * @class
 * @extends module:nyc/Container~Container
 * @fires module:nyc/lang/Translate~Translate#ready
 * @fires module:nyc/lang/Translate~Translate#change
 */
class Translate extends Container {
  /**
   * @desc Create an instance of Translate
   * @public
   * @constructor
   * @param {module:nyc/lang/Translate~Translate.Options} options Constructor options
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
   * @param {jQuery.Event} event Event object
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
    this.css()
    this.trigger('change', this)
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
   * @desc Gets a cookie value
   * @access protected
   * @method
   * @return {string} cookie
   */
  getCookieValue() {
    return ''
  }
  /**
   * @private
   * @method
   * @param {jQuery|Element|string} target The target container
   */
  render(target) {
    const codes = []
    const div = $(Translate.HTML)
    $(target).append(div)
    const select = this.find('select')
    Object.keys(this.languages).forEach(lang => {
      const code = this.languages[lang].code
      const opt = $('<option></option>').attr('value', code).html(this.languages[lang].native)
      select.append(opt)
      codes.push(lang)
      this.hints.push(this.languages[lang].hint)
      this.namedCodes[code] = lang
    })
    this.codes = codes.toString()
    this.find('select').change($.proxy(this.translate, this))
    this.selectDefault()
    this.showHint()
    if (this.button) {
      $('#lng').addClass('button')
    }
    select.focus(() => {
      select.prev().addClass('focused')
    })
    select.blur(() => {
      select.prev().removeClass('focused')
    })
    this.trigger('ready', this)
  }
  /**
   * @private
   * @method
   */
  css() {
    $('body')[this.code === this.defaultLanguage ? 'removeClass' : 'addClass']('translated')
  }
  /**
   * @private
   * @method
   * @return {string} Default language
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
      const hint = this.find('.hint')
      let h = 0
      setInterval(() => {
        hint.html(hints[h] || 'Translate')
        h += 1
        if (h === hints.length) {
          h = 0
        }
      }, 1000)
    }
  }
}

/**
 * @desc Constructor options for {@link module:nyc/lang/Translate~Translate}
 * @public
 * @typedef {Object}
 * @property {(String|Element|JQuery)} target The DOM element that will provide language choices
 * @property {Translate.Choices} languages The languages to provide
 * @property {Object<string,Object<string,string>>} messages The language-specific message bundles
 * @property {string} [defaultLanguage='en'] The default language
 * @property {boolean} [button=false] Show as a button
 */
Translate.Options

/**
 * @desc A language choice for {@link module:nyc/lang/Translate~Translate.Choices}
 * @public
 * @typedef {Object}
 * @property {string} code The language code
 * @property {string} name The language name
 * @property {string} native The display value for the language
 * @property {string=} hint The translation of the word 'Translate' in the language
 */
Translate.Choice

/**
 * @desc A mapping of {@link  module:nyc/lang/Translate~Translate.Choice} objects to language codes
 * @public
 * @typedef {Object<string, module:nyc/lang/Translate~Translate.Choice>}
 */
Translate.Choices

/**
 * @desc Default languages for NYC
 * @public
 * @const
 * @type {module:nyc/lang/Translate~Translate.Choices}
 */
Translate.DEFAULT_LANGUAGES = {
  en: {code: 'en', name: 'English', native: 'English', hint: 'Translate'},
  ar: {code: 'ar', name: 'Arabic', native: '&#x627;&#x644;&#x639;&#x631;&#x628;&#x64A;&#x629;', hint: '&#x62A;&#x631;&#x62C;&#x645;'},
  bn: {code: 'bn', name: 'Bengali', native: '&#x9AC;&#x9BE;&#x999;&#x9BE;&#x9B2;&#x9BF;', hint: '&#x985;&#x9A8;&#x9C1;&#x9AC;&#x9BE;&#x9A6; &#x995;&#x9B0;&#x9BE;'},
  'zh-CN': {code: 'zh-CN', name: 'Chinese (Simplified)', native: '&#x4E2D;&#x56FD;', hint: '&#x7FFB;&#x8BD1;'},
  fr: {code: 'fr', name: 'French', native: 'Fran&#231;ais', hint: 'Traduire'},
  ht: {code: 'ht', name: 'Haitian Creole', native: 'Krey&#242;l Ayisyen', hint: 'Tradui'},
  ko: {code: 'ko', name: 'Korean', native: '&#xD55C;&#xAD6D;&#xC758;', hint: '&#xBC88;&#xC5ED;'},
  ru: {code: 'ru', name: 'Russian', native: 'P&#x443;&#x441;&#x441;&#x43A;&#x438;&#x439;', hint: '&#x43F;&#x435;&#x440;&#x435;&#x432;&#x435;&#x441;&#x442;&#x438;'},
  es: {code: 'es', name: 'Spanish', native: 'Espa&#241;ol', hint: 'Traducir'},
  ur: {code: 'ur', name: 'Urdu', native: '&#x627;&#x631;&#x62F;&#x648;', hint: '&#x62A;&#x631;&#x62C;&#x645;&#x6C1; &#x6A9;&#x631;&#x6CC;&#x6BA;'}
}

/**
 * @desc The class has completed initialization
 * @event module:nyc/lang/Translate~Translate#ready
 * @type {boolean}
 */

/**
 * @desc The language value has changed
 * @event module:nyc/lang/Translate~Translate#change
 * @type {string}
 */

/**
 * @private
 * @const
 * @type {string}
 */
Translate.HTML = '<div id="lng" role="region" aria-label="Translate this page into another language">' +
  '<div class="btn-sq rad-all"><span class ="hint notranslate">Translate</span></div>' +
  '<select class="notranslate" translate="no" title="Translate..." araia-label="Translate..."></select>' +
  '<div id="lng-goog"></div>' +
'</div>'

export default Translate
