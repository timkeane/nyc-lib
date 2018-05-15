import Container from 'nyc/Container'
import ReplaceTokens from 'nyc/ReplaceTokens'
import Share from 'nyc/Share'

const manifest = '{"name": "App Name", "description": "App Description"}'

let target
beforeEach(() => {
  $.resetMocks()
  fetch.resetMocks()
  target = $('<div></div>')
  $('body').append(target)
})
afterEach(() => {
  target.remove()
})

test('constructor', () => {
  expect.assertions(5)

  const values = JSON.parse(manifest)
  values.url = document.location
  const div = $('<div></div>')
  div.append(new ReplaceTokens().replace(Share.HTML, values))

  fetch.mockResponseOnce(manifest)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(share.getContainer().html())
      }, 500)
    })
  }

  expect(share instanceof Container).toBe(true)
  expect(share instanceof Share).toBe(true)
  expect(share.getContainer().length).toBe(1)

  return test().then(html => {
    expect(html.length).toBe(1515)
    expect(html).toBe(div.html())
  })
})

test('show', () => {
  expect.assertions(7)

  fetch.mockResponseOnce(manifest)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(share.find('.btns').length).toBe(1)
        share.find('.btns').hide()
        expect(share.find('.btns').css('display')).toBe('none')
        share.find('.btn-shr').trigger('click')
        expect($.mocks.fadeToggle).toHaveBeenCalledTimes(1)
        expect($.mocks.fadeToggle.mock.instances.length).toBe(1)
        expect($.mocks.fadeToggle.mock.instances[0].get(0)).toBe(share.find('.btns').get(0))
        expect(share.find('.btns').css('display')).toBe('block')
        resolve(true)
      }, 500)
    })
  }

  return test().then(success => expect(success).toBe(true))
})

test('hide button click', () => {
  expect.assertions(7)

  fetch.mockResponseOnce(manifest)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(share.find('.btns').length).toBe(1)
        share.find('.btns').show()
        expect(share.find('.btns').css('display')).toBe('block')
        share.find('.btn-shr').trigger('click')
        expect($.mocks.fadeToggle).toHaveBeenCalledTimes(1)
        expect($.mocks.fadeToggle.mock.instances.length).toBe(1)
        expect($.mocks.fadeToggle.mock.instances[0].get(0)).toBe(share.find('.btns').get(0))
        expect(share.find('.btns').css('display')).toBe('none')
        resolve(true)
      }, 500)
    })
  }

  return test().then(success => expect(success).toBe(true))
})

test('hide other click', () => {
  expect.assertions(10)

  fetch.mockResponseOnce(manifest)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(share.find('.btns').length).toBe(1)
        share.find('.btns').hide()

        share.find('.btn-shr').trigger('click')
        expect($.mocks.fadeToggle).toHaveBeenCalledTimes(1)
        expect($.mocks.fadeToggle.mock.instances.length).toBe(1)
        expect($.mocks.fadeToggle.mock.instances[0].get(0)).toBe(share.find('.btns').get(0))
        expect(share.find('.btns').css('display')).toBe('block')

        share.find('.email').trigger('click')
        expect($.mocks.fadeOut).toHaveBeenCalledTimes(1)
        expect($.mocks.fadeOut.mock.instances.length).toBe(1)
        expect($.mocks.fadeOut.mock.instances[0].get(0)).toBe(share.find('.btns').get(0))
        expect(share.find('.btns').css('display')).toBe('none')

        resolve(true)
      }, 500)
    })
  }

  return test().then(success => expect(success).toBe(true))
})

test('hide already hiding', () => {
  expect.assertions(8)

  fetch.mockResponseOnce(manifest)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(share.find('.btns').length).toBe(1)
        share.find('.btns').show()

        share.find('.btn-shr').trigger('click')
        expect($.mocks.fadeToggle).toHaveBeenCalledTimes(1)
        expect($.mocks.fadeToggle.mock.instances.length).toBe(1)
        expect($.mocks.fadeToggle.mock.instances[0].get(0)).toBe(share.find('.btns').get(0))
        expect(share.find('.btns').css('display')).toBe('none')
        share.find('.btns').css('opacity', 0)

        share.find('.email').trigger('click')
        expect($.mocks.fadeOut).toHaveBeenCalledTimes(0)
        expect(share.find('.btns').css('display')).toBe('none')

        resolve(true)
      }, 500)
    })
  }

  return test().then(success => expect(success).toBe(true))
})
