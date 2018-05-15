import Container from 'nyc/Container'
import Translate from 'nyc/lang/Translate'

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
const messages = {
  en: {
    msg1: 'msg1-en',
    msg2: 'msg2-en',
    msg3: 'msg3-en'
  },
  ar: {
    msg1: 'msg1-ar',
    msg3: 'msg3-ar'
  },
  es: {
    msg1: 'msg1-es',
    msg2: 'msg2-es',
    msg3: 'msg3-es'
  }
}
const expectedCodes = {en: 'en', ar: 'ar', bn: 'bn', cn: 'cn', fr: 'fr', ht: 'ht', ko: 'ko', ru: 'ru', es: 'es', ur: 'ur'}
const expectedHints = [undefined, 'Translate-ar', 'Translate-bn', 'Translate-cn', 'Translate-fr', 'Translate-ht', 'Translate-ko', 'Translate-ru', 'Translate-es', 'Translate-ur']

let target
let content
beforeEach(() => {
  $.resetMocks()
  target = $('<div></div>')
  $('body').append(target)
  content = $('<div><h3 class="msg1">msg1-en</h3><a class="msg2" data-msg-key="msg3" data-msg-attr="href" href="msg3-en">msg2-en</a><div class="msg1">msg1-en</div></div>')
  $('body').append(content)
})
afterEach(() => {
  target.remove()
  content.remove()
})

test('constructor is button', () => {
  expect.assertions(10)

  const translate = new Translate({
    target: target,
    languages: languages,
    messages: messages,
    button: true
  })

  expect(translate instanceof Container).toBe(true)
  expect(translate instanceof Translate).toBe(true)

  expect(translate.find('#lng').hasClass('button')).toBe(true)
  expect(translate.defaultLanguage).toBe('en')
  expect(translate.defaultMessages).toBe(messages.en)
	expect(translate.messages).toBe(messages);
	expect(translate.languages).toBe(languages);
	expect(translate.isButton).toBe(undefined)
	expect(translate.hints).toEqual(expectedHints)
	expect(translate.namedCodes).toEqual(expectedCodes)
})

test('constructor not button', () => {
  expect.assertions(10)

  const translate = new Translate({
    target: target,
    languages: languages,
    messages: messages
  })

  expect(translate instanceof Container).toBe(true)
  expect(translate instanceof Translate).toBe(true)

  expect(translate.find('#lng').hasClass('button')).toBe(false)
  expect(translate.defaultLanguage).toBe('en')
  expect(translate.defaultMessages).toBe(messages.en)
	expect(translate.messages).toBe(messages);
	expect(translate.languages).toBe(languages);
	expect(translate.isButton).toBe(undefined)
	expect(translate.hints).toEqual(expectedHints)
	expect(translate.namedCodes).toEqual(expectedCodes)
})

test('constructor (is button, defaultLanguage in messages)', () => {
  expect.assertions(2)

  const translate = new Translate({
		target: target,
		languages: languages,
		defaultLanguage: 'ar',
		messages: messages
	})

  expect(translate.defaultLanguage).toBe('ar')
  expect(translate.defaultMessages).toBe(messages.ar)
})

test('constructor (is button, defaultLanguage not messages)', () => {
  const translate = new Translate({
		target: target,
		languages: languages,
		defaultLanguage: 'yi',
		messages: messages
	})

  expect(translate.defaultLanguage).toBe('en')
  expect(translate.defaultMessages).toBe(messages.en)
})

test('constructor (is button, defaultLanguage in messages)', () => {
  expect.assertions(2)

  const translate = new Translate({
		target: target,
		languages: languages,
		defaultLanguage: 'ar',
		messages: messages
	})

  expect(translate.defaultLanguage).toBe('ar')
  expect(translate.defaultMessages).toBe(messages.ar)
})

describe('defaultLanguage from system', () => {
  const defaultLang = Translate.prototype.defaultLang
  afterEach(() => {
    Translate.prototype.defaultLang = defaultLang
  })

  test('constructor (is button, system defaultLanguage available)', () => {
    expect.assertions(2)

    Translate.prototype.defaultLang = () => {return 'es'}
    const translate = new Translate({
  		target: target,
  		languages: languages,
  		defaultLanguage: 'yi',
  		messages: messages
  	})

    expect(translate.defaultLanguage).toBe('es')
    expect(translate.defaultMessages).toBe(messages.es)
  })

  test('constructor (is button, system defaultLanguage available)', () => {
    expect.assertions(2)

    Translate.prototype.defaultLang = () => {return 'ru'}
    const translate = new Translate({
  		target: target,
  		languages: languages,
  		defaultLanguage: 'yi',
  		messages: messages
  	})

    expect(translate.defaultLanguage).toBe('en')
    expect(translate.defaultMessages).toBe(messages.en)
  })
})

test('translate', () => {
  expect.assertions(21)

  const handler = jest.fn()

  const translate = new Translate({
    target: target,
    languages: languages,
    messages: messages
  })

  translate.on(Translate.EventType.CHANGE, handler)

  translate.find('select').val('es').trigger('change')

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0]).toBe(translate)
  expect(translate.lang()).toBe('es')
  expect(content.find('h3').html()).toBe(messages.es.msg1)
  expect(content.find('a').html()).toBe(messages.es.msg2)
  expect(content.find('a').attr('href')).toBe(messages.es.msg3)
  expect(content.find('div').html()).toBe(messages.es.msg1)

  translate.find('select').val('ru').trigger('change')

  expect(handler).toHaveBeenCalledTimes(2)
  expect(handler.mock.calls[0][0]).toBe(translate)
  expect(translate.lang()).toBe('ru')
  expect(content.find('h3').html()).toBe(messages.en.msg1)
  expect(content.find('a').html()).toBe(messages.en.msg2)
  expect(content.find('a').attr('href')).toBe(messages.en.msg3)
  expect(content.find('div').html()).toBe(messages.en.msg1)

  translate.find('select').val('ar').trigger('change')

  expect(handler).toHaveBeenCalledTimes(3)
  expect(handler.mock.calls[0][0]).toBe(translate)
  expect(translate.lang()).toBe('ar')
  expect(content.find('h3').html()).toBe(messages.ar.msg1)
  expect(content.find('a').html()).toBe(messages.en.msg2)
  expect(content.find('a').attr('href')).toBe(messages.ar.msg3)
  expect(content.find('div').html()).toBe(messages.ar.msg1)
})

describe('selectDefault', () => {
  const getCookieValue = Translate.prototype.getCookieValue
  afterEach(() => {
    Translate.prototype.getCookieValue = getCookieValue
  })

  test('selectDefault matches cookie', () => {
    expect.assertions(1)

    Translate.prototype.getCookieValue = () => {
      return 'fr-CA'
    }

    const translate = new Translate({
      target: target,
      languages: languages,
      messages: messages
    })

    expect(translate.lang()).toBe('fr')
  })

  test('selectDefault cookie is defaultLanguage', () => {
    expect.assertions(1)

    Translate.prototype.getCookieValue = () => {
      return 'en-US'
    }

    const translate = new Translate({
      target: target,
      languages: languages,
      messages: messages
    })

    expect(translate.lang()).toBe('en')
  })

  test('selectDefault does not match cookie', () => {
    expect.assertions(1)

    Translate.prototype.getCookieValue = () => {
      return 'zh-CN'
    }

    const translate = new Translate({
      target: target,
      languages: languages,
      messages: messages
    })

    expect(translate.lang()).toBe('en')
  })
})

test('showHint is button', () => {
  expect.assertions(0)

  const translate = new Translate({
    target: target,
    languages: languages,
    messages: messages,
    button: true
  })

  translate.showHint()
})

test('showHint not button', () => {
  expect.assertions(expectedHints.length + 1)
  jest.setTimeout((expectedHints.length + 1) * 1000)

  const translate = new Translate({
    target: target,
    languages: languages,
    messages: messages
  })

  const test = async () => {
    return new Promise((resolve) => {
      let i = 0
      setInterval(() => {
        const code = translate.codes.split(',')[i]
        expect(translate.find('.hint').html()).toBe(languages[code].hint || 'Translate')
        i++
        if (i === translate.hints.length) {
          resolve(true)
        }
      }, 1000)
    })
  }

  translate.showHint()

  return test().then(success => expect(success).toBe(true))
})
