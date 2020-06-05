/* global google, nycTranslateInstance */
/**
 * @module nyc/lang/Goog
 */

import $ from 'jquery'

import Translate from 'nyc/lang/Translate'

/*
 * @private
 * @constant {string}
 */
const ATTRS_TO_TRANSLATE = ['alt', 'placeholder']

/**
 * @desc Class for language translation using the Google Translate Gadget
 * @public
 * @class
 * @extends module:nyc/lang/Translate~Translate
 * @constructor
 * @fires module:nyc/lang/Translate~Translate#ready
 * @fires module:nyc/lang/Translate~Translate#change
 */
class Goog extends Translate {
  /**
   * @desc Create an instance of Goog
   * @public
   * @constructor
   * @param {module:nyc/lang/Translate~Translate.Options} options Constructor options
   */
  constructor(options) {
    super(options)
    this.hack()
    setInterval(this.hack, 500)
    $.getScript('https://translate.google.com/translate_a/element.js?cb=nycTranslateInstance.init')
  }
  /**
   * @desc Callback to set up Google Translate
   * @public
   * @method
   */
  init() {
    nycTranslateInstance.goog = new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: nycTranslateInstance.codes,
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'lng-goog')
    $('#lng select').val(nycTranslateInstance.defaultLanguage)
    nycTranslateInstance.selectDefault()
    nycTranslateInstance.translate()
    nycTranslateInstance.trigger('ready', nycTranslateInstance)
  }
  /**
   * @desc Sets the chosen language and initiates Google Translation
   * @public
   * @override
   * @method
   */
  translate() {
    const choices = $('iframe.goog-te-menu-frame:first').contents().find('.goog-te-menu2-item span.text')
    clearTimeout(nycTranslateInstance.timeout)
    if (choices.length) {
      this.code = $('#lng select').val()
      const lang = this.languages[this.code].name
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
      this.css('goog')
      this.trigger('change', this)
    } else {
      nycTranslateInstance.timeout = setTimeout(() => {
        nycTranslateInstance.translate()
      }, 200)
    }
  }
  /**
   * @desc Gets the google translate cookie value
   * @access protected
   * @override
   * @method
   * @return {string} Value from cookie
   */
  getCookieValue() {
    let cookie = this.getCookie()
    if (cookie) {
      cookie = cookie.split('/')
      cookie = cookie[2]
      return this.languages[cookie] ? this.namedCodes[cookie] : cookie
    }
    return this.defaultLanguage || 'en'
  }
  /**
   * @private
   * @method
   * @override
   * @return {string} cookie
   */
  getCookie() {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length)
      }
      if (cookie.indexOf('googtrans=') === 0) {
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
     * google translate doesn't translate certain attributes
     * so we'll add a hidden span after input elements that have those attributes
     * then use the attribute text for the span HTML
     * then apply the translation of the span back to the attribute
     */
    if ($('body').hasClass('translated')) {
      ATTRS_TO_TRANSLATE.forEach(attr => {
        $(`*[${attr}]`).each(function(_, node) {
          if (!$(node).data(attr)) {
            const span = $(`<span class="lng ${attr}" aria-hidden="true">${$(node).attr(attr)}</span>`)
            $('body').append(span)
            $(node).data(attr, span)
          } else {
            const valueHolder = $(node).data(attr)
            $(node).attr(attr, valueHolder.text())
          }
        })
      })
      $('body').css('top', 'auto')
      $('#goog-gt-tt').remove()
    }
  }
  /**
   * @private
   * @method
   */
  showOriginalText() {
    const googBar = $('iframe.goog-te-banner-frame:first')
    $(googBar.contents().find('.goog-te-button button')).each((_, button) => {
      if ($(button).text() === 'Show original') {
        const code = this.find('select').val()
        $(button).trigger('click')
        if (this.languages[code].name !== 'English') {
          this.find('select').val(this.defaultLanguage)
        }
        return false
      }
    })
  }
}

export default Goog
