import Basemap from '../../src/nyc/Basemap'
import $ from 'jQuery'

let target
beforeEach(() => {
  target = $('<div id="map"></div>')
  $('body').append(target)
})

afterEach(() => {
  target.remove()
})

test('constructor pass target as DOM node', () => {
  const loadLayer = Basemap.prototype.loadLayer
  Basemap.prototype.loadLayer = jest.fn(event => {
    expect(event.target).toBe(target.get(0))
  })

  const basemap = new Basemap({target: target.get(0)})

  target.trigger('drop')
  expect(Basemap.prototype.loadLayer).toHaveBeenCalledTimes(1)

  const dragHandler = jest.fn(event => {
    expect(event.isDefaultPrevented()).toBe(true)
  })
  target.on('dragover', dragHandler)
  target.trigger('dragover')
  expect(dragHandler).toHaveBeenCalledTimes(1)

  Basemap.prototype.loadLayer = loadLayer
})

test('constructor pass target as jQuery', () => {
  const loadLayer = Basemap.prototype.loadLayer
  Basemap.prototype.loadLayer = jest.fn(event => {
    expect(event.target).toBe(target.get(0))
  })

  const basemap = new Basemap({target})

  target.trigger('drop')
  expect(Basemap.prototype.loadLayer).toHaveBeenCalledTimes(1)

  const dragHandler = jest.fn(event => {
    expect(event.isDefaultPrevented()).toBe(true)
  })
  target.on('dragover', dragHandler)
  target.trigger('dragover')
  expect(dragHandler).toHaveBeenCalledTimes(1)

  Basemap.prototype.loadLayer = loadLayer
})

test('constructor pass target as jQuery selector', () => {
  const loadLayer = Basemap.prototype.loadLayer
  Basemap.prototype.loadLayer = jest.fn(event => {
      expect(event.target).toBe(target.get(0))
  })

  const basemap = new Basemap({target: '#map'})

  target.trigger('drop')
  expect(Basemap.prototype.loadLayer).toHaveBeenCalledTimes(1)

  const dragHandler = jest.fn(event => {
    expect(event.isDefaultPrevented()).toBe(true)
  })
  target.on('dragover', dragHandler)
  target.trigger('dragover')
  expect(dragHandler).toHaveBeenCalledTimes(1)

  Basemap.prototype.loadLayer = loadLayer
})

test('constructor pass target as jQuery selector that returns nothing', () => {
  const test = jest.fn(error => {
    expect(error).toBe('target #fred does not exist')
  })
  try {
    const basemap = new Basemap({target: '#fred'})
  } catch (error) {
    test(error)
  }
  expect(test).toHaveBeenCalledTimes(1)
})

test('constructor pass target id only', () => {
  const loadLayer = Basemap.prototype.loadLayer
  Basemap.prototype.loadLayer = jest.fn(event => {
    expect(event.target).toBe(target.get(0))
  })

  const basemap = new Basemap({target: 'map'})

  target.trigger('drop')
  expect(Basemap.prototype.loadLayer).toHaveBeenCalledTimes(1)

  const dragHandler = jest.fn(event => {
    expect(event.isDefaultPrevented()).toBe(true)
  })
  target.on('dragover', dragHandler)
  target.trigger('dragover')
  expect(dragHandler).toHaveBeenCalledTimes(1)

  Basemap.prototype.loadLayer = loadLayer
})

test('constructor pass target as target id that returns nothing', () => {
  const test = jest.fn(error => {
    expect(error).toBe('target fred does not exist')
  })
  try {
    const basemap = new Basemap({target: 'fred'})
  } catch (error) {
    test(error)
  }
  expect(test).toHaveBeenCalledTimes(1)
})

test('loadLayer', () => {
  Basemap.prototype.getStorage = function() {
    return mockStorage
  }

  const basemap = new Basemap({target})

  const mockJsonEvent = {
    originalEvent: {
      dataTransfer: {
        files: [{name: 'layer.json'}]
      }
    },
    preventDefault: jest.fn(),
    stopPropagation: jest.fn()
  }
  const mockShpEvent = {
    originalEvent: {
      dataTransfer: {
        files: [
          {name: 'layer.shp'},
          {name: 'layer.dbf'},
          {name: 'layer.shx'},
          {name: 'layer.prj'}
        ]
      }
    },
    preventDefault: jest.fn(),
    stopPropagation: jest.fn()
  }
  const mockStorage = {
    loadGeoJsonFile: jest.fn((map, callback, file) => {
      expect(map).toBe(basemap)
      expect(callback).toBeNull()
      expect(file).toBe(mockJsonEvent.originalEvent.dataTransfer.files[0])
    }),
    loadShapeFile: jest.fn((map, callback, files) => {
      expect(map).toBe(basemap)
      expect(callback).toBeNull()
      expect(files).toBe(mockShpEvent.originalEvent.dataTransfer.files)
    })
  }

  basemap.loadLayer(mockJsonEvent)
  expect(mockStorage.loadGeoJsonFile).toHaveBeenCalledTimes(1)
  expect(mockJsonEvent.preventDefault).toHaveBeenCalledTimes(1)
  expect(mockJsonEvent.stopPropagation).toHaveBeenCalledTimes(1)

  basemap.loadLayer(mockShpEvent)
  expect(mockStorage.loadShapeFile).toHaveBeenCalledTimes(1)
  expect(mockShpEvent.preventDefault).toHaveBeenCalledTimes(1)
  expect(mockShpEvent.stopPropagation).toHaveBeenCalledTimes(1)
})

test('sortedPhotos', () => {
  const basemap = new Basemap({target})
  basemap.photos = {
    '1951': {
      get: function(key) {
        if (key === 'name')
          return '1951'
      }
    },
    '1996': {name: '1996'},
    '1924': {name: '1924'},
    '2004': {
      get: function(key) {
        if (key === 'name')
          return '2004'
      }
    },
    '2014': {name: '2014'},
    '2006': {name: '2006'},
    '2001-2': {name: '2001-2'},
    '2008': {name: '2008'},
    '2010-11': {name: '2010-11'},
    '2012': {
      get: function(key) {
        if (key === 'name')
          return '2012'
      }
    },
    '2016': {name: '2016'}
  }

  const sorted = basemap.sortedPhotos()

  expect(sorted[10]).toBe(basemap.photos['1924'])
  expect(sorted[9]).toBe(basemap.photos['1951'])
  expect(sorted[8]).toBe(basemap.photos['1996'])
  expect(sorted[7]).toBe(basemap.photos['2001-2'])
  expect(sorted[6]).toBe(basemap.photos['2004'])
  expect(sorted[5]).toBe(basemap.photos['2006'])
  expect(sorted[4]).toBe(basemap.photos['2008'])
  expect(sorted[3]).toBe(basemap.photos['2010-11'])
  expect(sorted[2]).toBe(basemap.photos['2012'])
  expect(sorted[1]).toBe(basemap.photos['2014'])
  expect(sorted[0]).toBe(basemap.photos['2016'])
  expect(sorted.length).toBe(11)
})
