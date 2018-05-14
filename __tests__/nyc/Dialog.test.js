import Container from 'nyc/Container'
import Dialog from 'nyc/Dialog'

import $ from '../../mocks/jquery.mock'

beforeEach(() => {
  $.resetMocks()
})
afterEach(() => {
  $('.dia-container').remove()
})

test('constructor', () => {
  expect.assertions(16)

  const dialog = new Dialog()

  expect(dialog instanceof Container).toBe(true)
  expect(dialog instanceof Dialog).toBe(true)
  expect(dialog.getContainer().hasClass('dia-container')).toBe(true)
  expect(dialog.getContainer().parent().get(0)).toBe(document.body)
  expect(dialog.okBtn.length).toBe(1)
  expect(dialog.okBtn.hasClass('btn-ok')).toBe(true)
  expect(dialog.yesNoBtns.length).toBe(2)
  expect(dialog.yesNoBtns.get(0)).toBe(dialog.find('.btn-yes').get(0))
  expect(dialog.yesNoBtns.get(1)).toBe(dialog.find('.btn-no').get(0))
  expect(dialog.inputBtns.length).toBe(2)
  expect(dialog.inputBtns.get(0)).toBe(dialog.find('.btn-submit').get(0))
  expect(dialog.inputBtns.get(1)).toBe(dialog.find('.btn-cancel').get(0))
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
        expect(dialog.find('.btn-yes').css('display')).toBe('none')
        expect(dialog.find('.btn-no').css('display')).toBe('none')
        expect(dialog.find('.btn-submit').css('display')).toBe('none')
        expect(dialog.find('.btn-cancel').css('display')).toBe('none')
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

  dialog.ok({message: 'a message'}).then((result) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(result).toBe(true)
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
        expect(dialog.find('.btn-yes').css('display')).toBe('none')
        expect(dialog.find('.btn-no').css('display')).toBe('none')
        expect(dialog.find('.btn-submit').css('display')).toBe('inline-block')
        expect(dialog.find('.btn-cancel').css('display')).toBe('inline-block')
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
  dialog.find('.btn-submit').trigger('click')

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
  dialog.find('.btn-cancel').trigger('click')

  expect(dialog.hide).toHaveBeenCalledTimes(1)
})

test('yesNo check buttons', () => {
  expect.assertions(9)

  const dialog = new Dialog()

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(dialog.find('.btn-yes').is(':focus')).toBe(true)
        expect(dialog.okBtn.css('display')).toBe('none')
        expect(dialog.find('.btn-yes').css('display')).toBe('inline-block')
        expect(dialog.find('.btn-no').css('display')).toBe('inline-block')
        expect(dialog.find('.btn-submit').css('display')).toBe('none')
        expect(dialog.find('.btn-cancel').css('display')).toBe('none')
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

  dialog.yesNo({message: 'a message'}).then((result) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(result).toBe(true)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.find('.btn-yes').trigger('click')
})

test('yesNo click no', async () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.yesNo({message: 'a message'}).then((result) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(result).toBe(false)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.find('.btn-no').trigger('click')
})

test('yesNoCancel check buttons', () => {
  expect.assertions(9)

  const dialog = new Dialog()

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(dialog.find('.btn-yes').is(':focus')).toBe(true)
        expect(dialog.okBtn.css('display')).toBe('none')
        expect(dialog.find('.btn-yes').css('display')).toBe('inline-block')
        expect(dialog.find('.btn-no').css('display')).toBe('inline-block')
        expect(dialog.find('.btn-submit').css('display')).toBe('none')
        expect(dialog.find('.btn-cancel').css('display')).toBe('inline-block')
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

  dialog.yesNoCancel({message: 'a message'}).then((result) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(result).toBe(true)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.find('.btn-yes').trigger('click')
})

test('yesNoCancel click no', async () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.yesNoCancel({message: 'a message'}).then((result) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(result).toBe(false)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.find('.btn-no').trigger('click')
})

test('yesNoCancel click cancel', async () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.show = jest.fn()
  dialog.hide = jest.fn()

  dialog.yesNoCancel({message: 'a message'}).then((result) => {
    expect(dialog.hide).toHaveBeenCalledTimes(1)
    expect(result).toBe(undefined)
  })

  expect(dialog.show).toHaveBeenCalledTimes(1)

  dialog.find('.btn-cancel').trigger('click')
})

test('buttons Dialog.Type.OK', () => {
  expect.assertions(4)

  const dialog = new Dialog()

  dialog.buttons(Dialog.Type.OK, {})

  expect(dialog.okBtn.html()).toBe('OK')
  expect(dialog.okBtn.attr('href')).toBe('#')

  dialog.buttons(Dialog.Type.OK, {
    buttonText: ['foo'],
    buttonHref: ['bar']
  })

  expect(dialog.okBtn.html()).toBe('foo')
  expect(dialog.okBtn.attr('href')).toBe('bar')
})

test('buttons Dialog.Type.INPUT', () => {
  expect.assertions(8)

  const dialog = new Dialog()

  dialog.buttons(Dialog.Type.INPUT, {})

  expect(dialog.find('.btn-submit').html()).toBe('Submit')
  expect(dialog.find('.btn-submit').attr('href')).toBe('#')
  expect(dialog.find('.btn-cancel').html()).toBe('Cancel')
  expect(dialog.find('.btn-cancel').attr('href')).toBe('#')

  dialog.buttons(Dialog.Type.INPUT, {
    buttonText: ['foo', 'bar'],
    buttonHref: ['doo', 'fus']
  })

  expect(dialog.find('.btn-submit').html()).toBe('foo')
  expect(dialog.find('.btn-submit').attr('href')).toBe('doo')
  expect(dialog.find('.btn-cancel').html()).toBe('bar')
  expect(dialog.find('.btn-cancel').attr('href')).toBe('fus')
})

test('buttons Dialog.Type.YES_NO', () => {
  expect.assertions(8)

  const dialog = new Dialog()

  dialog.buttons(Dialog.Type.YES_NO, {})

  expect(dialog.find('.btn-yes').html()).toBe('Yes')
  expect(dialog.find('.btn-yes').attr('href')).toBe('#')
  expect(dialog.find('.btn-no').html()).toBe('No')
  expect(dialog.find('.btn-no').attr('href')).toBe('#')

  dialog.buttons(Dialog.Type.YES_NO, {
    buttonText: ['foo', 'bar'],
    buttonHref: ['doo', 'fus']
  })

  expect(dialog.find('.btn-yes').html()).toBe('foo')
  expect(dialog.find('.btn-yes').attr('href')).toBe('doo')
  expect(dialog.find('.btn-no').html()).toBe('bar')
  expect(dialog.find('.btn-no').attr('href')).toBe('fus')
})

test('buttons Dialog.Type.YES_NO_CANCEL', () => {
  expect.assertions(12)

  const dialog = new Dialog()

  dialog.buttons(Dialog.Type.YES_NO_CANCEL, {})

  expect(dialog.find('.btn-yes').html()).toBe('Yes')
  expect(dialog.find('.btn-yes').attr('href')).toBe('#')
  expect(dialog.find('.btn-no').html()).toBe('No')
  expect(dialog.find('.btn-no').attr('href')).toBe('#')
  expect(dialog.find('.btn-cancel').html()).toBe('Cancel')
  expect(dialog.find('.btn-cancel').attr('href')).toBe('#')

  dialog.buttons(Dialog.Type.YES_NO_CANCEL, {
    buttonText: ['foo', 'bar', 'lol'],
    buttonHref: ['doo', 'fus', 'wtf']
  })

  expect(dialog.find('.btn-yes').html()).toBe('foo')
  expect(dialog.find('.btn-yes').attr('href')).toBe('doo')
  expect(dialog.find('.btn-no').html()).toBe('bar')
  expect(dialog.find('.btn-no').attr('href')).toBe('fus')
  expect(dialog.find('.btn-cancel').html()).toBe('lol')
  expect(dialog.find('.btn-cancel').attr('href')).toBe('wtf')
})

test('hide', () => {
  expect.assertions(3)

  const dialog = new Dialog()

  dialog.getContainer().show()

  dialog.hide()

  expect($.mocks.fadeOut).toHaveBeenCalledTimes(1)
  expect($.mocks.fadeOut.mock.instances[0].get(0)).toBe(dialog.getContainer().get(0))
  expect(dialog.getContainer().css('display')).toBe('none')
})
