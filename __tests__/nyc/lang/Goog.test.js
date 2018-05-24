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

let googleIframeMenu
let googleIframeButton
const createIframes = () => {
  let html = ''
  googleIframeMenu = $('<iframe class="goog-te-menu-frame"><iframe>')
  googleIframeButton = $('<iframe class="goog-te-banner-frame"><iframe>')
  $('body').append(googleIframeMenu)
  $('body').append(googleIframeButton)
  googleIframeButton.get(0).contentDocument.write('<div class="goog-te-button"><button>X</button></div><div class="goog-te-button"><button>Show original</button></div>')
  Object.values(languages).forEach(language => {
    html += `<a class="goog-te-menu2-item"><span class="text">${language.name}</span></a>`
  })
  googleIframeMenu.get(0).contentDocument.write(html)
}

let target
const getScript = $.getScript
const google = window.google
beforeEach(() => {
  $.resetMocks()
  window.google = googleMock
  target = $('<div></div>')
  $('body').append(target)
  $.getScript = () => {
    createIframes()
    nycTranslateInstance.init()
  }
})
afterEach(() => {
  window.google = google
  target.remove()
  googleIframeMenu.remove()
  googleIframeButton.remove()
  $.getScript = getScript
})

test('constructor is button', () => {
  expect.assertions(8)

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
  expect.assertions(13)

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
  expect.assertions(1)

  document.cookie = 'foo=bar'
  document.cookie = 'googtrans=/en/ar'
  document.cookie = 'bar=foo'

  const translate = new Goog({
    target: target,
    languages: languages
  })

  expect(translate.getCookie()).toBe('/en/ar')
})

describe('hack', () => {
  let inputs
  afterEach(() => {
    inputs.remove()
  })

  test('hack not translated', () => {
    expect.assertions(3)

    inputs = $('<div><input placeholder="a placeholder"><input><input placeholder="another placeholder"></div>')
    $('body').append(inputs)

    const translate = new Goog({
      target: target,
      languages: languages
    })

    expect($('span.lng-placeholder').length).toBe(2)
    expect($('span.lng-placeholder').get(0).innerHTML).toBe('a placeholder')
    expect($('span.lng-placeholder').get(1).innerHTML).toBe('another placeholder')
  })

  test('hack is translated', () => {
    expect.assertions(3)

    inputs = $('<input placeholder="a placeholder"><span class="lng-placeholder"><font>a translated</font></span><input><input placeholder="another placeholder"><span class="lng-placeholder"><font>another translated</font></span>')
    $('body').append(inputs)

    const translate = new Goog({
      target: target,
      languages: languages
    })

    expect($('input[placeholder]').length).toBe(2)
    expect($('input[placeholder]').get(0).placeholder).toBe('a translated')
    expect($('input[placeholder]').get(1).placeholder).toBe('another translated')
  })

})

test('showOriginalText', () => {
  expect.assertions(4)

  const handler = jest.fn()

  const translate = new Goog({
    target: target,
    languages: languages
  })

  $('iframe.goog-te-banner-frame:first').contents()
    .find('.goog-te-button button').click(handler)

  translate.find('select').val('fr')

  translate.showOriginalText()

  expect(handler).toHaveBeenCalledTimes(1)
  expect(translate.find('select').val()).toBe('en')

  translate.showOriginalText()

  expect(handler).toHaveBeenCalledTimes(2)
  expect(translate.find('select').val()).toBe('en')
})

test('translate needs to wait for google to load', () => {
  expect.assertions(4)

  const input = $('<input value="en">')
  const handler = jest.fn()
  const event = {target: input.get(0)}

  const translate = new Goog({
    target: target,
    languages: languages
  })

  $('iframe').remove()

  translate.on('change', handler)

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        expect(handler).toHaveBeenCalled()
        expect(handler.mock.calls[0][0]).toBe(translate)
        expect(translate.lang()).toBe('en')
        resolve(true)              
      }, 500)
    })
  }
  translate.translate(event)

  createIframes()

  return test().then(success => {expect(success).toBe(true)})
})