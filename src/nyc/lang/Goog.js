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
const ATTRS_TO_TRANSLATE = ['placeholder', 'title', 'alt', 'aria-label']

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
    /**
     * @private
     * @member {boolean}
     */
    this.monitoring = false
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
    nycTranslateInstance.hack()
    nycTranslateInstance.trigger('ready', nycTranslateInstance)
  }
  /**
   * @desc Sets the chosen language and initiates Google Translation
   * @public
   * @override
   * @method
   * @param {jQuery.Event} event Event object
   */
  translate(event) {
    const choices = $('iframe.goog-te-menu-frame:first').contents().find('.goog-te-menu2-item span.text')
    clearTimeout(nycTranslateInstance.timeout)
    if (event && choices.length) {
      this.code = $(event.target).val()
      const lang = this.languages[this.code].name
      if (lang === 'English') {
        this.showOriginalText()
      } else {
        $(choices).each((_, choice) => {
          if ($(choice).text() === lang) {
            $(choice).trigger('click')
            nycTranslateInstance.monitor()
            return false
          }
        })
      }
      this.css('goog')
      this.trigger('change', this)
    } else {
      nycTranslateInstance.timeout = setTimeout(() => {
        nycTranslateInstance.translate(event)
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
      return cookie
    }
    return ''
  }
  /**
   * @private
   * @method
   */
  monitor() {
    if (!this.monitoring) {
      this.monitoring = true
      if ('MutationObserver' in window) {
        new MutationObserver(this.hack)
          .observe(document.body, {childList: true, subtree: true})
      } else {
        setInterval(this.hack, 500)
      }
    }
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
    ATTRS_TO_TRANSLATE.forEach(attr => {
      $(`*[${attr}]`).each(function(_, input) {
        const next = $(input).next()
        if (!next.hasClass(`lng ${attr}`)) {
          $(input).after(`<span class="lng ${attr}">${$(input).attr(attr)}</span>`)
        } else {
          let text = next.html()
          $.each(next.find('font'), (idx, font) => {
            text = $(font).html()
          })
          $(input).attr(attr, text)
        }
      })
    })
    $('body').css('top', 'auto')
    $('#goog-gt-tt').remove()
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
          this.find('select').val('en')
        }
        return false
      }
    })
  }
}

export default Goog
