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
})

test('constructor pass target as jQuery', () => {
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
})

test('constructor pass target as jQuery selector', () => {
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
