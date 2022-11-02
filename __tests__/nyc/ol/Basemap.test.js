import nyc from 'nyc'
import Basemap from 'nyc/ol/Basemap'
import LocalStorage from 'nyc/ol/LocalStorage'

import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlLayerTile from 'ol/layer/Tile'
import OlSourceXYZ from 'ol/source/XYZ'
import OlProjection from 'ol/proj/Projection'

const proj4 = nyc.proj4

let target
beforeEach(() => {
  target = $('<div id="map"></div>')
  $('body').append(target)
})

afterEach(() => {
  target.remove()
})

describe('constructor tests', () => {
  const setupView = Basemap.setupView
  const setupPhotos = Basemap.prototype.setupPhotos
  const defaultExtent = Basemap.prototype.defaultExtent
  const hookupEvents = Basemap.prototype.hookupEvents
  beforeEach(() => {
    Basemap.setupView = jest.fn()
    Basemap.prototype.setupPhotos = jest.fn()
    Basemap.prototype.defaultExtent = jest.fn()
    Basemap.prototype.hookupEvents = jest.fn()
  })
  afterEach(() => {
    Basemap.setupView = setupView
    Basemap.prototype.setupPhotos = setupPhotos
    Basemap.prototype.defaultExtent = defaultExtent
    Basemap.prototype.hookupEvents = hookupEvents
  })

  test('constructor no view in options, has interations in options', () => {
    expect.assertions(11)

    const options = {
      target: 'map',
      interactions: []
    }

    const basemap = new Basemap(options)

    expect(basemap instanceof OlMap).toBe(true)
    expect(basemap instanceof Basemap).toBe(true)

    expect(basemap.getInteractions().getLength()).toBe(0)

    expect(Basemap.setupView).toHaveBeenCalledTimes(1)
    expect(Basemap.setupView.mock.calls[0][0]).toEqual(options)

    expect(Basemap.prototype.setupPhotos).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.setupPhotos.mock.calls[0][0]).toEqual(options)

    expect(Basemap.prototype.defaultExtent).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.defaultExtent.mock.calls[0][0]).toBe(false)

    expect(Basemap.prototype.hookupEvents).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.hookupEvents.mock.calls[0][0]).toBe(target.get(0))
  })

  test('constructor has view in options, no interations in options', () => {
    expect.assertions(11)

    const view = new OlView({})
    const options = {target: 'map', view: view}

    const basemap = new Basemap(options)

    expect(basemap instanceof OlMap).toBe(true)
    expect(basemap instanceof Basemap).toBe(true)

    expect(basemap.getInteractions().getLength()).toBe(7)

    expect(Basemap.setupView).toHaveBeenCalledTimes(1)
    expect(Basemap.setupView.mock.calls[0][0]).toEqual(options)

    expect(Basemap.prototype.setupPhotos).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.setupPhotos.mock.calls[0][0]).toEqual(options)

    expect(Basemap.prototype.defaultExtent).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.defaultExtent.mock.calls[0][0]).toBe(true)

    expect(Basemap.prototype.hookupEvents).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.hookupEvents.mock.calls[0][0]).toBe(target.get(0))
  })
})

test('showPhoto no year', () => {
  expect.assertions(31)

  const basemap = new Basemap({target: 'map'})

  expect(Object.entries(basemap.photos).length).toBe(13)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(false)
  })
  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)

  basemap.showPhoto()

  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(year === basemap.latestPhoto)
  })
  expect(basemap.labels.base.getVisible()).toBe(false)
  expect(basemap.labels.photo.getVisible()).toBe(true)
})

test('showPhoto 1996', () => {
  expect.assertions(31)

  const basemap = new Basemap({target: 'map'})

  expect(Object.entries(basemap.photos).length).toBe(13)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(false)
  })
  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)

  basemap.showPhoto(1996)

  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(year === '1996')
  })
  expect(basemap.labels.base.getVisible()).toBe(false)
  expect(basemap.labels.photo.getVisible()).toBe(true)
})

test('hidePhoto', () => {
  expect.assertions(31)

  const basemap = new Basemap({target: 'map'})

  basemap.showPhoto(1996)

  expect(Object.entries(basemap.photos).length).toBe(13)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(year === '1996')
  })
  expect(basemap.labels.base.getVisible()).toBe(false)
  expect(basemap.labels.photo.getVisible()).toBe(true)

  basemap.hidePhoto()

  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(false)
  })
  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)
})

test('showLabels', () => {
  expect.assertions(6)

  const basemap = new Basemap({target: 'map'})

  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)

  basemap.showLabels(Basemap.LabelType.PHOTO)

  expect(basemap.labels.base.getVisible()).toBe(false)
  expect(basemap.labels.photo.getVisible()).toBe(true)

  basemap.showLabels(Basemap.LabelType.BASE)
  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)
})

test('getBaseLayers', () => {
  expect.assertions(22)

  const basemap = new Basemap({target: 'map'})

  const baseLayers = basemap.getBaseLayers()
  expect(Object.entries(baseLayers).length).toBe(3)

  expect(baseLayers.base instanceof OlLayerTile).toBe(true)
  expect(baseLayers.base).toBe(basemap.base)

  expect(baseLayers.labels).toBe(basemap.labels)
  expect(Object.entries(baseLayers.labels).length).toBe(2)
  expect(baseLayers.labels.base instanceof OlLayerTile).toBe(true)
  expect(baseLayers.labels.photo instanceof OlLayerTile).toBe(true)

  expect(baseLayers.photos).toBe(basemap.photos)
  expect(Object.entries(baseLayers.photos).length).toBe(13)
  Object.entries(baseLayers.photos).forEach(([year, layer]) => {
    expect(layer instanceof OlLayerTile).toBe(true)
  })
})

test('getStorage', () => {
  expect.assertions(1)

  const basemap = new Basemap({target: 'map'})
  expect(basemap.getStorage() instanceof LocalStorage).toBe(true)
})

test('defaultExtent view not provided', () => {
  expect.assertions(3)

  const basemap = new Basemap({target: 'map'})

  const fit = jest.fn()
  basemap.getView = () => {
    return {fit: fit}
  }
  basemap.defaultExtent(false)

  expect(fit).toHaveBeenCalledTimes(1)
  expect(fit.mock.calls[0][0]).toBe(Basemap.EXTENT)
  expect(fit.mock.calls[0][1]).toBe(basemap.getSize())
})

test('defaultExtent view is provided', () => {
  expect.assertions(1)

  const basemap = new Basemap({target: 'map'})

  const fit = jest.fn()
  basemap.getView = () => {
    return {fit: fit}
  }
  basemap.defaultExtent(true)

  expect(fit).toHaveBeenCalledTimes(0)
})

test('setupPhotos as called by constructor', () => {
  expect.assertions(93)

  const basemap = new Basemap({target: 'map'})

  let i = 3
  expect(Object.entries(basemap.photos).length).toBe(13)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(basemap.photos[year] instanceof OlLayerTile).toBe(true)
    expect(basemap.photos[year]).toBe(basemap.getLayers().getArray()[i])
    expect(basemap.photos[year].getVisible()).toBe(false)
    expect(basemap.photos[year].getExtent()).toEqual(Basemap.PHOTO_EXTENT)
    expect(basemap.photos[year].getSource() instanceof OlSourceXYZ).toBe(true)
    expect(basemap.photos[year].getSource().getProjection().getCode()).toBe('EPSG:3857')
    if (year !== '2020') {
      expect(basemap.photos[year].getSource().getUrls()).toEqual([
        `https://maps1.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`,
        `https://maps2.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`,
        `https://maps3.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`,
        `https://maps4.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`
      ])
    } else {
      expect(basemap.photos[year].getSource().getUrls()).toEqual([
        'https://tiles.arcgis.com/tiles/yG5s3afENB5iO9fj/arcgis/rest/services/NYC_Orthos_-_2020/MapServer/tile/{z}/{y}/{x}'
      ])
    }
    i = i + 1
  })
  expect(i).toBe(16)
})


test('layerExtent', () => {
  expect.assertions(2)

  const basemap = new Basemap({target: 'map'})

  const extent0 = Basemap.EXTENT
  const epsg0 = 'EPSG:3857'
  const epsg1 = 'EPSG:2263'
  const bl = proj4(epsg0, epsg1, [extent0[0], extent0[1]])
  const tr = proj4(epsg0, epsg1, [extent0[2], extent0[3]])
  const extent1 = [bl[0], bl[1], tr[0], tr[1]]
  const view = {
    getProjection: () => {
      return new OlProjection({code: epsg1})
    }
  }

  expect(basemap.layerExtent(extent0, undefined)).toBe(extent0)
  expect(basemap.layerExtent(extent0, view)).toEqual(extent1)
})

test('photoChange triggered by visible change', () => {
  expect.assertions(68)

  const basemap = new Basemap({target: 'map'})

  expect(Object.entries(basemap.photos).length).toBe(13)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(false)
  })

  expect(basemap.labels.photo.getVisible()).toBe(false)
  expect(basemap.labels.base.getVisible()).toBe(true)

  Object.entries(basemap.photos).forEach(([year, layer]) => {
    layer.setVisible(true)
    expect(basemap.labels.base.getVisible()).toBe(false)
    expect(basemap.labels.photo.getVisible()).toBe(true)
    layer.setVisible(false)
    expect(basemap.labels.base.getVisible()).toBe(true)
    expect(basemap.labels.photo.getVisible()).toBe(false)
  })
})

test('setupView no view in options', () => {
  expect.assertions(5)
  
  const options = {}

  Basemap.setupView(options)

  expect(options.view instanceof OlView).toBe(true)
  expect(options.view.getCenter()).toEqual(Basemap.CENTER)
  expect(options.view.getMinZoom()).toBe(8)
  expect(options.view.getMaxZoom()).toBe(21)
  expect(options.view.getZoom()).toBe(8)
})

test('setupView has view in options', () => {
  expect.assertions(1)
  
  const view = new OlView({})
  const options = {view: view}

  Basemap.setupView(options)

  expect(options.view).toBe(view)
})
