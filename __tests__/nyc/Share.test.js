import $ from 'jquery'

import Container from 'nyc/Container'
import ReplaceTokens from 'nyc/ReplaceTokens'

const manifest = '{"name": "App Name", "description": "App Description"}'
const fetchMock = require('fetch-mock')
fetchMock.get('./manifest.webmanifest', manifest);

const Share = require('nyc/Share').default

let target
beforeEach(() => {
  target = $('<div></div>')
  $('body').append(target)
})
afterEach(() => {
  target.remove()
})

test('constructor', () => {
  let share
  const values = JSON.parse(manifest)
  values.url = document.location
  const div = $('<div></div>')
  div.append(new ReplaceTokens().replace(Share.HTML, values))

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(share.getContainer().html())
      }, 500)
    })
  }

  share = new Share({target: target})

  expect(share instanceof Container).toBe(true)
  expect(share instanceof Share).toBe(true)
  expect(share.getContainer().length).toBe(1)
  expect().toBe()

  return test().then(html => {
    expect(html.length).toBe(1515)
    expect(html).toBe(div.html())
  })
})

test('show', () => {
  expect.assertions(2)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(share.find('.btns').length).toBe(1)
        share.find('.btns').hide()
        share.find('.btn-shr').trigger('click')
        setTimeout(() => {
          resolve(share.find('.btns').css('display'))
        }, 500)
      }, 500)
    })
  }

  return test().then(display => expect(display).toBe('block'))
})

test('hide button click', () => {
  expect.assertions(3)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(share.find('.btns').length).toBe(1)
        share.find('.btns').show()
        expect(share.find('.btns').css('display')).toBe('block')
        share.find('.btn-shr').trigger('click')
        setTimeout(() => {
          resolve(share.find('.btns').css('display'))
        }, 500)
      }, 500)
    })
  }

  return test().then(display => expect(display).toBe('none'))
})

test('hide other click', () => {
  expect.assertions(3)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(share.find('.btns').length).toBe(1)
        share.find('.btns').hide()
        share.find('.btn-shr').trigger('click')
        setTimeout(() => {
          expect(share.find('.email').length).toBe(1)
          share.find('.email').trigger('click')
          setTimeout(() => {
            resolve(share.find('.btns').css('display'))
          }, 500)
        }, 500)
      }, 500)
    })
  }

  return test().then(display => expect(display).toBe('none'))
})
