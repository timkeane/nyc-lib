import $ from 'jquery'

import Translate from 'nyc/lang/Translate'
import Goog from 'nyc/lang/Goog'

const languages = {
    en: {code: 'en', name: 'English'},
    ar: {code: 'ar', name: 'Arabic' , hint: 'Translate-ar'},
    bn: {code: 'bn', name: 'Bengali', hint: 'Translate-bn'},
    cn: {code: 'cn', name: 'Chinese', hint: 'Translate-cn'},
    fr: {code: 'fr', name: 'French', hint: 'Translate-fr'},
    ht: {code: 'ht', name: 'Hatian', hint: 'Translate-ht'},
    ko: {code: 'ko', name: 'Korean' , hint: 'Translate-ko'},
    ru: {code: 'ru', name: 'Russian', hint: 'Translate-ru'},
    es: {code: 'es', name: 'Spanish', hint: 'Translate-es'},
    ur: {code: 'ur', name: 'Urdu', hint: 'Translate-ur'}
}
const expectedCodes = {en: 'en', ar: 'ar', bn: 'bn', cn: 'cn', fr: 'fr', ht: 'ht', ko: 'ko', ru: 'ru', es: 'es', ur: 'ur'}
const expectedHints = [undefined, 'Translate-ar', 'Translate-bn', 'Translate-cn', 'Translate-fr', 'Translate-ht', 'Translate-ko', 'Translate-ru', 'Translate-es', 'Translate-ur']

const googleMock = {
  translate: {
    TranslateElement: (options, target) => {
      return {options: options, target: target}
    }
  }
}
googleMock.translate.TranslateElement.InlineLayout = {SIMPLE: 0}

let target
let iframe
const getScript = $.getScript
const google = window.google
beforeEach(() => {
  window.google = googleMock
  target = $('<div></div>')
  $('body').append(target)
  iframe = $('<iframe class="goog-te-menu-frame"><iframe>')
  $('body').append(iframe)
  $.getScript = () => {
    let html = ''
    Object.values(languages).forEach(language => {
      html += `<a class="goog-te-menu2-item"><span class="text">${language.name}</span></a>`
    })
    iframe.get(0).contentDocument.write(html)
    nycTranslateInstance.init()
  }
})
afterEach(() => {
  window.google = google
  target.remove()
  iframe.remove()
  $.getScript = getScript
})

test('constructor is button', () => {
  const translate = new Goog({
    target: target,
    languages: languages,
    button: true
  })

  expect(translate instanceof Translate).toBe(true)
  expect(translate instanceof Goog).toBe(true)

  expect(translate.find('#lng').hasClass('button')).toBe(true)
  expect(translate.defaultLanguage).toBe('en')
	expect(translate.languages).toBe(languages)
	expect(translate.isButton).toBe(undefined)
	expect(translate.hints).toEqual(expectedHints)
	expect(translate.namedCodes).toEqual(expectedCodes)
})

test('constructor not button', () => {
  const translate = new Goog({
    target: target,
    languages: languages
  })

  expect(translate instanceof Translate).toBe(true)
  expect(translate instanceof Goog).toBe(true)

  expect(translate.goog.target).toBe('lng-goog')
  expect(translate.goog.options.pageLanguage).toBe('en')
  expect(translate.goog.options.includedLanguages).toBe(translate.codes)
  expect(translate.goog.options.layout).toBe(googleMock.translate.TranslateElement.InlineLayout.SIMPLE)
  expect(translate.goog.options.autoDisplay).toBe(false)

  expect(translate.find('#lng').hasClass('button')).toBe(false)
  expect(translate.defaultLanguage).toBe('en')
	expect(translate.languages).toBe(languages)
	expect(translate.isButton).toBe(undefined)
	expect(translate.hints).toEqual(expectedHints)
	expect(translate.namedCodes).toEqual(expectedCodes)
})

describe('translate', () => {
  const showOriginalText = Goog.prototype.showOriginalText
  beforeEach(() => {
    Goog.prototype.showOriginalText = jest.fn()
  })
  afterEach(() => {
    Goog.prototype.showOriginalText = showOriginalText
  })

  test('translate', async () => {
    expect.assertions(11)

  	const translate = new Goog({
      target: target,
      languages: languages
    })

    const items = $('iframe.goog-te-menu-frame:first').contents().find('.goog-te-menu2-item span.text')
    expect(items.length).toBe(10)
    Object.keys(languages).forEach(code => {
      const choice = languages[code].name
      $(items).each((_, span) => {
      if (choice !== 'English' && $(span).text() === choice) {
      $(span).one('click', () => {
            expect($(span).text()).toBe(choice)
          })
        }
      })
      $('#lng select').val(code).trigger('change')
    })

    expect(Goog.prototype.showOriginalText).toHaveBeenCalledTimes(1)
  })

})

test('getCookie', () => {
  document.cookie = 'foo=bar'
  document.cookie = 'googtrans=/en/ar'
  document.cookie = 'bar=foo'

  const translate = new Goog({
    target: target,
    languages: languages
  })

  expect(translate.getCookie()).toBe('/en/ar')
})
