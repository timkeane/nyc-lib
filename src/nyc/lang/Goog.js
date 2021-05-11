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
      const lang = $('#lng select').val()
      const langName = this.languages[lang].name
      this.code = this.languages[lang].code
      if (langName === 'English') {
        this.showOriginalText()
      } else {
        $(choices).each((_, choice) => {
          if ($(choice).text() === langName) {
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
   * @desc Gets a cookie value
   * @access protected
   * @method
   * @return {string} cookie
   */
  langFromCookie() {
    let cookie = this.getCookie()
    if (cookie) {
      try {
        cookie = cookie.split('/')
        cookie = cookie[2].split('-')[0]
      } catch (e) {
        //swallow
      }
    }
    return this.namedCodes[cookie] || this.defaultLanguage || 'en'
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
    const select = $('#lng select')
    const languages = this.languages
    const defaultLanguage = this.defaultLanguage
    $(googBar.contents().find('.goog-te-button button')).each((_, button) => {
      if ($(button).text() === 'Show original') {
        const code = select.val()
        $(button).trigger('click')
        if (languages[code].name !== 'English') {
          select.val(defaultLanguage)
        }
        return false
      }
    })
  }
}

export default Goog
