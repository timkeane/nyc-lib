import $ from 'jquery'

import Container from 'nyc/Container'
import Dialog from 'nyc/Dialog'

afterEach(() => {
  $('.dia-container').remove()
})

test('constructor', () => {
  const dialog = new Dialog()

  expect(dialog instanceof Container).toBe(true)
  expect(dialog instanceof Dialog).toBe(true)
  expect(dialog.getContainer().hasClass('dia-container')).toBe(true)
  expect(dialog.getContainer().parent().get(0)).toBe(document.body)
  expect(dialog.okBtn.length).toBe(1)
  expect(dialog.okBtn.hasClass('btn-ok')).toBe(true)
  expect(dialog.yesNoBtns.length).toBe(2)
  expect(dialog.yesNoBtns.get(0)).toBe(dialog.getElem('.btn-yes').get(0))
  expect(dialog.yesNoBtns.get(1)).toBe(dialog.getElem('.btn-no').get(0))
  expect(dialog.inputBtns.length).toBe(2)
  expect(dialog.inputBtns.get(0)).toBe(dialog.getElem('.btn-submit').get(0))
  expect(dialog.inputBtns.get(1)).toBe(dialog.getElem('.btn-cancel').get(0))
  expect(dialog.okBtn.length).toBe(1)
  expect(dialog.field.get(0).tagName).toBe('INPUT')
  expect(dialog.msg.length).toBe(1)
  expect(dialog.msg.hasClass('dia-msg')).toBe(true)
})

test('ok check buttons', () => {
  expect.assertions(9)

  const dialog = new Dialog()

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(dialog.okBtn.is(':focus')).toBe(true)
        expect(dialog.okBtn.css('display')).toBe('inline-block')
        expect(dialog.getElem('.btn-yes').css('display')).toBe('none')
        expect(dialog.getElem('.btn-no').css('display')).toBe('none')
        expect(dialog.getElem('.btn-submit').css('display')).toBe('none')
        expect(dialog.getElem('.btn-cancel').css('display')).toBe('none')
        expect(dialog.field.css('display')).toBe('none')
        expect(dialog.msg.html()).toBe('a message')
        resolve(true)
      }, 500)
    })
  }

  dialog.ok({message: 'a message'})

  return test().then(result => expect(result).toBe(true))
})

test('ok esc key does not resolve promise', () => {
  expect.assertions(2)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.ok({message: 'a message'})

  expect(dialog.show).toHaveBeenCalledTimes(1)

  $(document).trigger({type: 'keyup', keyCode: 27})

  expect(dialog.hide).toHaveBeenCalledTimes(0)
})

test('ok click', async () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.ok({message: 'a message'}).then((ok) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(ok).toBe(true)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.okBtn.trigger('click')
})

test('input check buttons', () => {
  expect.assertions(9)

  const dialog = new Dialog()

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(dialog.field.is(':focus')).toBe(true)
        expect(dialog.okBtn.css('display')).toBe('none')
        expect(dialog.getElem('.btn-yes').css('display')).toBe('none')
        expect(dialog.getElem('.btn-no').css('display')).toBe('none')
        expect(dialog.getElem('.btn-submit').css('display')).toBe('inline-block')
        expect(dialog.getElem('.btn-cancel').css('display')).toBe('inline-block')
        expect(dialog.field.css('display')).toBe('block')
        expect(dialog.msg.html()).toBe('a message')
        resolve(true)
      }, 500)
    })
  }

  dialog.input({message: 'a message', placeholder: 'a placeholder'})

  return test().then(result => expect(result).toBe(true))
})

test('input esc key resolves promise', () => {
  expect.assertions(2)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.input({message: 'a message'})

  expect(dialog.show).toHaveBeenCalledTimes(1)

  $(document).trigger({type: 'keyup', keyCode: 27})

  expect(dialog.hide).toHaveBeenCalledTimes(1)
})

test('input return key resolves promise', () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.input({message: 'a message'}).then(result => expect(result).toBe('abc'))

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.field.val('abc')
  dialog.field.trigger({type: 'keyup', keyCode: 13})

  expect(dialog.hide).toHaveBeenCalledTimes(1)
})

test('input click submit', () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.input({message: 'a message'}).then(result => expect(result).toBe('abc'))

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.field.val('abc')
  dialog.getElem('.btn-submit').trigger('click')

  expect(dialog.hide).toHaveBeenCalledTimes(1)
})

test('input click cancel', () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.input({message: 'a message'}).then(result => expect(result).toBe(undefined))

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.field.val('abc')
  dialog.getElem('.btn-cancel').trigger('click')

  expect(dialog.hide).toHaveBeenCalledTimes(1)
})

test('yesNo check buttons', () => {
  expect.assertions(9)

  const dialog = new Dialog()

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(dialog.getElem('.btn-yes').is(':focus')).toBe(true)
        expect(dialog.okBtn.css('display')).toBe('none')
        expect(dialog.getElem('.btn-yes').css('display')).toBe('inline-block')
        expect(dialog.getElem('.btn-no').css('display')).toBe('inline-block')
        expect(dialog.getElem('.btn-submit').css('display')).toBe('none')
        expect(dialog.getElem('.btn-cancel').css('display')).toBe('none')
        expect(dialog.field.css('display')).toBe('none')
        expect(dialog.msg.html()).toBe('a message')
        resolve(true)
      }, 500)
    })
  }

  dialog.yesNo({message: 'a message'})

  return test().then(result => expect(result).toBe(true))
})

test('yesNo esc key does not resolve promise', () => {
  expect.assertions(2)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.yesNo({message: 'a message'})

  expect(dialog.show).toHaveBeenCalledTimes(1)

  $(document).trigger({type: 'keyup', keyCode: 27})

  expect(dialog.hide).toHaveBeenCalledTimes(0)
})

test('yesNo click yes', async () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.yesNo({message: 'a message'}).then((ok) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(ok).toBe(true)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.getElem('.btn-yes').trigger('click')
})

test('yesNo click no', async () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.yesNo({message: 'a message'}).then((ok) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(ok).toBe(false)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.getElem('.btn-no').trigger('click')
})

test('yesNoCancel check buttons', () => {
  expect.assertions(9)

  const dialog = new Dialog()

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(dialog.getElem('.btn-yes').is(':focus')).toBe(true)
        expect(dialog.okBtn.css('display')).toBe('none')
        expect(dialog.getElem('.btn-yes').css('display')).toBe('inline-block')
        expect(dialog.getElem('.btn-no').css('display')).toBe('inline-block')
        expect(dialog.getElem('.btn-submit').css('display')).toBe('none')
        expect(dialog.getElem('.btn-cancel').css('display')).toBe('inline-block')
        expect(dialog.field.css('display')).toBe('none')
        expect(dialog.msg.html()).toBe('a message')
        resolve(true)
      }, 500)
    })
  }

  dialog.yesNoCancel({message: 'a message'})

  return test().then(result => expect(result).toBe(true))
})

test('yesNoCancel esc key resolves promise', () => {
  expect.assertions(2)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.yesNoCancel({message: 'a message'})

  expect(dialog.show).toHaveBeenCalledTimes(1)

  $(document).trigger({type: 'keyup', keyCode: 27})

  expect(dialog.hide).toHaveBeenCalledTimes(1)
})

test('yesNoCancel click yes', async () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.yesNoCancel({message: 'a message'}).then((ok) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(ok).toBe(true)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.getElem('.btn-yes').trigger('click')
})

test('yesNoCancel click no', async () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.yesNoCancel({message: 'a message'}).then((ok) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(ok).toBe(false)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.getElem('.btn-no').trigger('click')
})
