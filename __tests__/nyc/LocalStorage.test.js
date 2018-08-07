import LocalStorage from 'nyc/LocalStorage'

import localStorageMock from '../localStorage.mock'
import FileReaderMock from '../FileReader.mock'
import shapefileMock from '../shapefile.mock'

import nyc from 'nyc'

const proj4 = nyc.proj4

beforeEach(() => {
  localStorageMock.resetMock()
  FileReaderMock.resetMock()
  shapefileMock.resetMock()
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

    FileReaderMock.resultByFile = {'mock-file': '{"foo": "bar"}'}

    const callback = (text) => {
      expect(text).toBe(FileReaderMock.resultByFile['mock-file'])
    }

    const storage = new LocalStorage()
    
    return storage.readTextFile(callback, 'mock-file')
  })

  test('readTextFile no file provided', () => {
    expect.assertions(1)

    FileReaderMock.resultByFile = {'mock-file': '{"foo": "bar"}'}

    const callback = (text) => {
      expect(text).toBe(FileReaderMock.resultByFile['mock-file'])
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

describe('loadGeoJsonFile', () => {

  test('loadGeoJsonFile has callback', () => {
    expect.assertions(4)
    
    FileReaderMock.resultByFile = {'mock-file': '{"foo": "bar"}'}

    const callback = (layer) => {
      expect(layer).toBe('mock-layer')
    }

    const storage = new LocalStorage()

    storage.addToMap = jest.fn(() => {return 'mock-layer'})

    storage.loadGeoJsonFile('mock-map', callback, 'mock-file')

    expect(storage.addToMap).toHaveBeenCalledTimes(1)
    expect(storage.addToMap.mock.calls[0][0]).toBe('mock-map')
    expect(storage.addToMap.mock.calls[0][1]).toBe(FileReaderMock.resultByFile['mock-file'])
  })

  test('loadGeoJsonFile no callback', () => {
    expect.assertions(3)
    
    FileReaderMock.resultByFile = {'mock-file': '{"foo": "bar"}'}

    const storage = new LocalStorage()

    storage.addToMap = jest.fn(() => {return 'mock-layer'})

    storage.loadGeoJsonFile('mock-map', null, 'mock-file')

    expect(storage.addToMap).toHaveBeenCalledTimes(1)
    expect(storage.addToMap.mock.calls[0][0]).toBe('mock-map')
    expect(storage.addToMap.mock.calls[0][1]).toBe(FileReaderMock.resultByFile['mock-file'])
  })

   test('loadGeoJsonFile no callback', () => {
    expect.assertions(3)
    
    FileReaderMock.resultByFile = {'mock-file': '{"foo": "bar"}'}

    const storage = new LocalStorage()

    storage.addToMap = jest.fn(() => {return 'mock-layer'})

    storage.loadGeoJsonFile('mock-map', null, 'mock-file')

    expect(storage.addToMap).toHaveBeenCalledTimes(1)
    expect(storage.addToMap.mock.calls[0][0]).toBe('mock-map')
    expect(storage.addToMap.mock.calls[0][1]).toBe(FileReaderMock.resultByFile['mock-file'])
  })
})

describe('loadShapeFile', () => {

  test('loadShapeFile no files', () => {
    expect.assertions(4)
    
    $(document).one('click', event => {
      const input = $(event.target)
      if (input.hasClass('file-in')) {
        input.trigger({
          type: 'change',
          target: {files: 'mock-files'}
        })
      }
    })
    const storage = new LocalStorage()
    
    storage.getShpDbfPrj = jest.fn()

    storage.loadShapeFile('mock-map', 'mock-callback')

    expect(storage.getShpDbfPrj).toHaveBeenCalledTimes(1)
    expect(storage.getShpDbfPrj.mock.calls[0][0]).toBe('mock-map')
    expect(storage.getShpDbfPrj.mock.calls[0][1]).toBe('mock-files')
    expect(storage.getShpDbfPrj.mock.calls[0][2]).toBe('mock-callback')
  })

  test('loadShapeFile has files', () => {
    expect.assertions(4)
    
    const storage = new LocalStorage()
    
    storage.getShpDbfPrj = jest.fn()

    storage.loadShapeFile('mock-map', 'mock-callback', 'mock-files')

    expect(storage.getShpDbfPrj).toHaveBeenCalledTimes(1)
    expect(storage.getShpDbfPrj.mock.calls[0][0]).toBe('mock-map')
    expect(storage.getShpDbfPrj.mock.calls[0][1]).toBe('mock-files')
    expect(storage.getShpDbfPrj.mock.calls[0][2]).toBe('mock-callback')
  })
})

describe('getShpDbfPrj', () => {

  test('getShpDbfPrj has shp', () => {
    expect.assertions(5)

    const mockFiles = [
      {name: 'mock-file.shp'}, 
      {name: 'mock-file.dbf'}, 
      {name: 'mock-file.shx'}, 
      {name: 'mock-file.prj'}
    ]

    FileReaderMock.resultByFile = {'mock-file.prj': 'mock-prj'}

    const storage = new LocalStorage()
    
    storage.readShpDbf = jest.fn()

    storage.getShpDbfPrj('mock-map', mockFiles)

    expect(storage.readShpDbf).toHaveBeenCalledTimes(1)
    expect(storage.readShpDbf.mock.calls[0][0]).toBe('mock-map')
    expect(storage.readShpDbf.mock.calls[0][1]).toBe(mockFiles[0])
    expect(storage.readShpDbf.mock.calls[0][2]).toBe(mockFiles[1])
    expect(storage.readShpDbf.mock.calls[0][3]).toBe('mock-prj')
  })

  test('getShpDbfPrj no shp no callback', () => {
    expect.assertions(1)

    const mockFiles = [
      {name: 'mock-file.dbf'}, 
      {name: 'mock-file.shx'}, 
      {name: 'mock-file.prj'}
    ]

    const storage = new LocalStorage()
    
    storage.readShpDbf = jest.fn()

    storage.getShpDbfPrj('mock-map', mockFiles)

    expect(storage.readShpDbf).toHaveBeenCalledTimes(0)
  })

  test('getShpDbfPrj no shp has callback', () => {
    expect.assertions(2)

    const mockFiles = [
      {name: 'mock-file.dbf'}, 
      {name: 'mock-file.shx'}, 
      {name: 'mock-file.prj'}
    ]

    const storage = new LocalStorage()
    
    storage.readShpDbf = jest.fn()

    storage.getShpDbfPrj('mock-map', mockFiles, () => {
      expect(true).toBe(true)
    })

    expect(storage.readShpDbf).toHaveBeenCalledTimes(0)
  })
})

test('readPrj', () => {
  expect.assertions(4)

  FileReaderMock.resultByFile = {'mock-file.prj': 'mock-prj'}

  const callback = jest.fn()

  const storage = new LocalStorage()

  storage.readPrj('mock-file.prj', callback)

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback.mock.calls[0][0]).toBe('mock-prj')

  storage.readPrj(null, callback)

  expect(callback).toHaveBeenCalledTimes(2)
  expect(callback.mock.calls[1][0]).toBe(undefined)
})

describe('readShpDbf', () => {

  test('readShpDbf has dbf', () => {
    expect.assertions(6)

    FileReaderMock.resultByFile = {
      'mock-file.shp': 'mock-shp-bytes',
      'mock-file.dbf': 'mock-dbf-bytes'
    }

    const storage = new LocalStorage()
    
    storage.readShp = jest.fn()

    storage.readShpDbf('mock-map', 'mock-file.shp', 'mock-file.dbf', 'mock-projcs', 'mock-callback')
  
    expect(storage.readShp).toHaveBeenCalledTimes(1)
    expect(storage.readShp.mock.calls[0][0]).toBe('mock-map')
    expect(storage.readShp.mock.calls[0][1]).toBe('mock-shp-bytes')
    expect(storage.readShp.mock.calls[0][2]).toBe('mock-dbf-bytes')
    expect(storage.readShp.mock.calls[0][3]).toBe('mock-projcs')
    expect(storage.readShp.mock.calls[0][4]).toBe('mock-callback')
  })

  test('readShpDbf no dbf', () => {
    expect.assertions(6)

    FileReaderMock.resultByFile = {
      'mock-file.shp': 'mock-shp-bytes'
    }

    const storage = new LocalStorage()
    
    storage.readShp = jest.fn()

    storage.readShpDbf('mock-map', 'mock-file.shp', null, 'mock-projcs', 'mock-callback')
  
    expect(storage.readShp).toHaveBeenCalledTimes(1)
    expect(storage.readShp.mock.calls[0][0]).toBe('mock-map')
    expect(storage.readShp.mock.calls[0][1]).toBe('mock-shp-bytes')
    expect(storage.readShp.mock.calls[0][2]).toBe(undefined)
    expect(storage.readShp.mock.calls[0][3]).toBe('mock-projcs')
    expect(storage.readShp.mock.calls[0][4]).toBe('mock-callback')
  })

  test('readShpDbf no shp', () => {
    expect.assertions(1)

    FileReaderMock.resultByFile = {
      'mock-file.dbf': 'mock-dbf-bytes'
    }

    const storage = new LocalStorage()
    
    storage.readShp = jest.fn()

    storage.readShpDbf('mock-map', null, 'mock-file.dbf', 'mock-projcs', 'mock-callback')
  
    expect(storage.readShp).toHaveBeenCalledTimes(0)
  })
})

describe('readShp', () => {

  test('readShp success with callback', () => {
    expect.assertions(9)
  
    LocalStorage.shapefile = shapefileMock.mock

    shapefileMock.features = ['mock-feature-0', 'mock-feature-1']
    
    const callback = jest.fn()

    const storage = new LocalStorage()

    storage.addToMap = jest.fn(() => {return 'mock-layer'})

    const test = async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          expect(storage.addToMap).toHaveBeenCalledTimes(1)
          expect(storage.addToMap.mock.calls[0][0]).toBe('mock-map')
          expect(storage.addToMap.mock.calls[0][1].length).toBe(2)
          expect(storage.addToMap.mock.calls[0][1][0]).toBe('mock-feature-0')
          expect(storage.addToMap.mock.calls[0][1][1]).toBe('mock-feature-1')
          expect(storage.addToMap.mock.calls[0][2]).toBe('mock-projcs')
          expect(callback).toHaveBeenCalledTimes(1)
          expect(callback.mock.calls[0][0]).toBe('mock-layer')
          resolve(true)
        }, 500)
      })
    }

    storage.readShp('mock-map', 'mock-shp', 'mock-dbf', 'mock-projcs', callback)

    return test().then(success => {expect(success).toBe(true)})
  })

  test('readShp success no callback', () => {
    expect.assertions(7)
  
    LocalStorage.shapefile = shapefileMock.mock

    shapefileMock.features = ['mock-feature-0', 'mock-feature-1']
    
    const storage = new LocalStorage()

    storage.addToMap = jest.fn(() => {return 'mock-layer'})

    const test = async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          expect(storage.addToMap).toHaveBeenCalledTimes(1)
          expect(storage.addToMap.mock.calls[0][0]).toBe('mock-map')
          expect(storage.addToMap.mock.calls[0][1].length).toBe(2)
          expect(storage.addToMap.mock.calls[0][1][0]).toBe('mock-feature-0')
          expect(storage.addToMap.mock.calls[0][1][1]).toBe('mock-feature-1')
          expect(storage.addToMap.mock.calls[0][2]).toBe('mock-projcs')
          resolve(true)
        }, 500)
      })
    }

    storage.readShp('mock-map', 'mock-shp', 'mock-dbf', 'mock-projcs')

    return test().then(success => {expect(success).toBe(true)})
  })

  test('readShp fail', () => {
    expect.assertions(2)
  
    shapefileMock.reject = true
    LocalStorage.shapefile = shapefileMock.mock

    const storage = new LocalStorage()

    storage.addToMap = jest.fn()

    const test = async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          expect(storage.addToMap).toHaveBeenCalledTimes(0)
          resolve(true)
        }, 500)
      })
    }

    storage.readShp('mock-map', 'mock-shp', 'mock-dbf', 'mock-projcs')

    return test().then(success => {expect(success).toBe(true)})
  })
})

test('addToMap', () => {
  expect.assertions(1)
  expect(() => {new LocalStorage().addToMap('anything')}).toThrow('Not implemented')
})

describe('customProj', () => {
  const prj4 = {}
  beforeEach(() => {
    proj4.defs = jest.fn()
  })

  test('customProj', () => {
    expect.assertions(5)
    
    const storage = new LocalStorage()
    
    storage.customProj()

    expect(proj4.defs).toHaveBeenCalledTimes(0)

    expect(storage.customProj('mock-projcs', proj4)).toBe('shp:prj-0')

    expect(proj4.defs).toHaveBeenCalledTimes(1)
    expect(proj4.defs.mock.calls[0][0]).toBe('shp:prj-0')
    expect(proj4.defs.mock.calls[0][1]).toBe('mock-projcs')
  })
})