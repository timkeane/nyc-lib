import LocalStorage from 'nyc/LocalStorage'

import localStorageMock from '../localStorage.mock'
import FileReaderMock from '../FileReader.mock'

const shapefile = require('shapefile')

jest.mock('shapefile')

beforeEach(() => {
  localStorageMock.resetMock()
  FileReaderMock.resetMock()
})
afterEach(() => {
  localStorageMock.unmock()
  FileReaderMock.unmock()
})

test('canDownload', () => {
  expect.assertions(1)

  const storage = new LocalStorage()
  expect(storage.canDownload()).toBe(true)
})

test('saveGeoJson', () => {
  expect.assertions(3)

  const storage = new LocalStorage()

  $(document).one('click', event => {
    const img = $(event.target)
    const a = img.parent()
    expect(img.get(0).tagName).toBe('IMG')
    expect(a.hasClass('file-dwn')).toBe(true)
    expect(a.attr('href')).toBe(`data:application/jsoncharset=utf-8,${encodeURIComponent('{"data":"geo-stuff"}')}`)
  })

  return storage.saveGeoJson('file', '{"data":"geo-stuff"}')
})

test('setItem', () => {
  expect.assertions(4)

  const storage = new LocalStorage()

  storage.setItem('foo', 'bar')

  expect(window.localStorage.setItem).toHaveBeenCalledTimes(1)
  expect(window.localStorage.setItem.mock.calls[0][0]).toBe('foo')
  expect(window.localStorage.setItem.mock.calls[0][1]).toBe('bar')

  delete window.localStorage

  storage.setItem('bar', 'foo')

  expect(window.localStorage).toBe(undefined)
})

test('getItem', () => {
  expect.assertions(4)

  const storage = new LocalStorage()

  window.localStorage.data.foo = 'bar'

  expect(storage.getItem('foo')).toBe('bar')

  expect(window.localStorage.getItem).toHaveBeenCalledTimes(1)
  expect(window.localStorage.getItem.mock.calls[0][0]).toBe('foo')

  delete window.localStorage

  storage.getItem('bar')

  expect(window.localStorage).toBe(undefined)
})

test('removeItem', () => {
  expect.assertions(3)

  const storage = new LocalStorage()

  window.localStorage.data.foo = 'bar'

  storage.removeItem('foo')

  expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1)
  expect(window.localStorage.removeItem.mock.calls[0][0]).toBe('foo')

  delete window.localStorage

  storage.removeItem('bar')

  expect(window.localStorage).toBe(undefined)
})

describe('readTextFile', () => {

  test('readTextFile file provided', () => {
    expect.assertions(1)

    FileReaderMock.expectedFile = 'mock-file'
    FileReaderMock.result = '{"foo": "bar"}'

    const callback = (text) => {
      expect(text).toBe(FileReaderMock.result)
    }

    const storage = new LocalStorage()
    
    return storage.readTextFile(callback, 'mock-file')
  })

  test('readTextFile no file provided', () => {
    expect.assertions(1)

    FileReaderMock.expectedFile = 'mock-file'
    FileReaderMock.result = '{"foo": "bar"}'

    const callback = (text) => {
      expect(text).toBe(FileReaderMock.result)
    }

    $(document).one('click', event => {
      const input = $(event.target)
      if (input.hasClass('file-in')) {
        input.trigger({
          type: 'change',
          target: {files: ['mock-file']}
        })
      }
    })

    const storage = new LocalStorage()
    
    return storage.readTextFile(callback)
  })
})