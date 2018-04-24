import Basemap from '../../src/nyc/Basemap'
import $ from 'jQuery'

test('constructor pass target id only', () => {
    const target = $('<div id="map"></div>')
    $('body').append(target)

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