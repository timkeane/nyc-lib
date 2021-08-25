import nyc from 'nyc'
import Basemap from 'nyc/ol/Basemap'
import LocalStorage from 'nyc/ol/LocalStorage'
import BasemapHelper from 'nyc/BasemapHelper'

import OlMap from 'ol/PluggableMap'
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
  const mixin = nyc.mixin
  const setupView = Basemap.setupView
  const setupLayers = Basemap.prototype.setupLayers
  const defaultExtent = Basemap.prototype.defaultExtent
  beforeEach(() => {
    Basemap.setupView = jest.fn()
    Basemap.prototype.setupLayers = jest.fn()
    Basemap.prototype.defaultExtent = jest.fn()
  })
  afterEach(() => {
    Basemap.setupView = setupView
    Basemap.prototype.setupLayers = setupLayers
    Basemap.prototype.defaultExtent = defaultExtent
    nyc.mixin = mixin
  })

  test('constructor no view in options, has interations in options', () => {
    expect.assertions(13)

    const options = {
      target: 'map',
      interactions: []
    }

    const hookupEvents = jest.fn(targetNode => {
      expect(targetNode).toBe(target.get(0))
    })
    nyc.mixin = jest.fn(obj => {
      obj.hookupEvents = hookupEvents
    })

    const basemap = new Basemap(options, 5)

    expect(basemap instanceof OlMap).toBe(true)
    expect(basemap instanceof Basemap).toBe(true)

    expect(basemap.getInteractions().getLength()).toBe(0)

    expect(Basemap.setupView).toHaveBeenCalledTimes(1)
    expect(Basemap.setupView.mock.calls[0][0]).toEqual(options)

    expect(Basemap.prototype.setupLayers).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.setupLayers.mock.calls[0][0]).toEqual(options)
    expect(Basemap.prototype.setupLayers.mock.calls[0][1]).toBe(5)

    expect(Basemap.prototype.defaultExtent).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.defaultExtent.mock.calls[0][0]).toBe(false)

    expect(hookupEvents).toHaveBeenCalledTimes(1)
    expect(hookupEvents.mock.calls[0][0]).toBe(target.get(0))
  })

  test('constructor has view in options, no interations in options', () => {
    expect.assertions(13)

    const view = new OlView({})
    const options = {target: 'map', view: view}

    const hookupEvents = jest.fn(targetNode => {
      expect(targetNode).toBe(target.get(0))
    })
    nyc.mixin = jest.fn(obj => {
      obj.hookupEvents = hookupEvents
    })

    const basemap = new Basemap(options, 5)

    expect(basemap instanceof OlMap).toBe(true)
    expect(basemap instanceof Basemap).toBe(true)

    expect(basemap.getInteractions().getLength()).toBe(7)

    expect(Basemap.setupView).toHaveBeenCalledTimes(1)
    expect(Basemap.setupView.mock.calls[0][0]).toEqual(options)

    expect(Basemap.prototype.setupLayers).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.setupLayers.mock.calls[0][0]).toEqual(options)
    expect(Basemap.prototype.setupLayers.mock.calls[0][1]).toBe(5)

    expect(Basemap.prototype.defaultExtent).toHaveBeenCalledTimes(1)
    expect(Basemap.prototype.defaultExtent.mock.calls[0][0]).toBe(true)

    expect(hookupEvents).toHaveBeenCalledTimes(1)
    expect(hookupEvents.mock.calls[0][0]).toBe(target.get(0))
  })
})

test('showPhoto no year', () => {
  expect.assertions(29)

  const basemap = new Basemap({target: 'map'})

  expect(Object.entries(basemap.photos).length).toBe(12)
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
  expect.assertions(29)

  const basemap = new Basemap({target: 'map'})

  expect(Object.entries(basemap.photos).length).toBe(12)
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
  expect.assertions(29)

  const basemap = new Basemap({target: 'map'})

  basemap.showPhoto(1996)

  expect(Object.entries(basemap.photos).length).toBe(12)
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

test('hidePhoto OSM', () => {
  expect.assertions(30)

  const basemap = new Basemap({target: 'map', osm: true})

  basemap.showPhoto(1996)

  expect(Object.entries(basemap.photos).length).toBe(12)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(year === '1996')
  })
  expect(basemap.labels.base).toBe(undefined)
  expect(basemap.labels.photo.getVisible()).toBe(true)

  basemap.hidePhoto()
  expect(basemap['osm'].getVisible()).toBe(true)

  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(false)
  })
  expect(basemap.labels.base).toBe(undefined)
  expect(basemap.labels.photo.getVisible()).toBe(false)
})

test('showLabels', () => {
  expect.assertions(6)

  const basemap = new Basemap({target: 'map'})

  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)

  basemap.showLabels(BasemapHelper.LabelType.PHOTO)

  expect(basemap.labels.base.getVisible()).toBe(false)
  expect(basemap.labels.photo.getVisible()).toBe(true)

  basemap.showLabels(BasemapHelper.LabelType.BASE)
  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)
})

test('showLabels OSM', () => {
  expect.assertions(6)

  const basemap = new Basemap({target: 'map', osm: true})

  expect(basemap.labels.base).toBe(undefined)
  expect(basemap.labels.photo.getVisible()).toBe(false)

  basemap.showLabels(BasemapHelper.LabelType.PHOTO)

  expect(basemap.labels.base).toBe(undefined)
  expect(basemap.labels.photo.getVisible()).toBe(true)

  basemap.showLabels(BasemapHelper.LabelType.BASE)
  expect(basemap.labels.base).toBe(undefined)
  expect(basemap.labels.photo.getVisible()).toBe(false)
})

test('getBaseLayers', () => {
  expect.assertions(21)

  const basemap = new Basemap({target: 'map'})

  const baseLayers = basemap.getBaseLayers()

  expect(Object.entries(baseLayers).length).toBe(4)

  expect(baseLayers.base instanceof OlLayerTile).toBe(true)
  expect(baseLayers.base).toBe(basemap.base)

  expect(baseLayers.labels).toBe(basemap.labels)
  expect(Object.entries(baseLayers.labels).length).toBe(2)
  expect(baseLayers.labels.base instanceof OlLayerTile).toBe(true)
  expect(baseLayers.labels.photo instanceof OlLayerTile).toBe(true)

  expect(baseLayers.photos).toBe(basemap.photos)
  expect(Object.entries(baseLayers.photos).length).toBe(12)
  Object.entries(baseLayers.photos).forEach(([year, layer]) => {
    expect(layer instanceof OlLayerTile).toBe(true)
  })
})

test('getBaseLayers OSM', () => {
  expect.assertions(21)

  const basemap = new Basemap({target: 'map', osm: true})

  const baseLayers = basemap.getBaseLayers()

  expect(Object.entries(baseLayers).length).toBe(4)

  expect(baseLayers.osm instanceof OlLayerTile).toBe(true)
  expect(baseLayers.osm).toBe(basemap.osm)

  expect(baseLayers.labels).toBe(basemap.labels)
  expect(Object.entries(baseLayers.labels).length).toBe(1)
  expect(baseLayers.labels.base instanceof OlLayerTile).toBe(false)
  expect(baseLayers.labels.photo instanceof OlLayerTile).toBe(true)

  expect(baseLayers.photos).toBe(basemap.photos)
  expect(Object.entries(baseLayers.photos).length).toBe(12)
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

test('setupLayers as called by constructor', () => {
  expect.assertions(109)

  const basemap = new Basemap({target: 'map'})

  expect(basemap.base instanceof OlLayerTile).toBe(true)
  expect(basemap.base).toBe(basemap.getLayers().getArray()[0])
  expect(basemap.base.getVisible()).toBe(true)
  expect(basemap.base.getExtent()).toEqual(Basemap.UNIVERSE_EXTENT)
  expect(basemap.base.getSource() instanceof OlSourceXYZ).toBe(true)
  expect(basemap.base.getSource().getProjection().getCode()).toBe('EPSG:3857')
  expect(basemap.base.getSource().getUrls()).toEqual([
    'https://maps1.nyc.gov/tms/1.0.0/carto/basemap/{z}/{x}/{-y}.jpg',
    'https://maps2.nyc.gov/tms/1.0.0/carto/basemap/{z}/{x}/{-y}.jpg',
    'https://maps3.nyc.gov/tms/1.0.0/carto/basemap/{z}/{x}/{-y}.jpg',
    'https://maps4.nyc.gov/tms/1.0.0/carto/basemap/{z}/{x}/{-y}.jpg'
  ])

  expect(Object.entries(basemap.labels).length).toBe(2)
  expect(basemap.labels.base instanceof OlLayerTile).toBe(true)
  expect(basemap.labels.base).toBe(basemap.getLayers().getArray()[1])
  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.base.getZIndex()).toBe(1000)
  expect(basemap.labels.base.getExtent()).toEqual(Basemap.LABEL_EXTENT)
  expect(basemap.labels.base.getSource() instanceof OlSourceXYZ).toBe(true)
  expect(basemap.labels.base.getSource().getProjection().getCode()).toBe('EPSG:3857')
  expect(basemap.labels.base.getSource().getUrls()).toEqual([
    'https://maps1.nyc.gov/tms/1.0.0/carto/label/{z}/{x}/{-y}.png8',
    'https://maps2.nyc.gov/tms/1.0.0/carto/label/{z}/{x}/{-y}.png8',
    'https://maps3.nyc.gov/tms/1.0.0/carto/label/{z}/{x}/{-y}.png8',
    'https://maps4.nyc.gov/tms/1.0.0/carto/label/{z}/{x}/{-y}.png8'
  ])

  expect(basemap.labels.photo instanceof OlLayerTile).toBe(true)
  expect(basemap.labels.photo).toBe(basemap.getLayers().getArray()[2])
  expect(basemap.labels.photo.getVisible()).toBe(false)
  expect(basemap.labels.photo.getExtent()).toEqual(Basemap.LABEL_EXTENT)
  expect(basemap.labels.photo.getSource() instanceof OlSourceXYZ).toBe(true)
  expect(basemap.labels.photo.getSource().getProjection().getCode()).toBe('EPSG:3857')
  expect(basemap.labels.photo.getSource().getUrls()).toEqual([
    'https://maps1.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8',
    'https://maps2.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8',
    'https://maps3.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8',
    'https://maps4.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8'
  ])

  let i = 3
  expect(Object.entries(basemap.photos).length).toBe(12)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(basemap.photos[year] instanceof OlLayerTile).toBe(true)
    expect(basemap.photos[year]).toBe(basemap.getLayers().getArray()[i])
    expect(basemap.photos[year].getVisible()).toBe(false)
    expect(basemap.photos[year].getExtent()).toEqual(Basemap.PHOTO_EXTENT)
    expect(basemap.photos[year].getSource() instanceof OlSourceXYZ).toBe(true)
    expect(basemap.photos[year].getSource().getProjection().getCode()).toBe('EPSG:3857')
    expect(basemap.photos[year].getSource().getUrls()).toEqual([
      `https://maps1.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`,
      `https://maps2.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`,
      `https://maps3.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`,
      `https://maps4.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`
    ])
    i++
  })
  expect(i).toBe(15)
})

test('setupLayers using OSM tiles as called by constructor', () => {
  expect.assertions(102)

  const basemap = new Basemap({target: 'map', osm: true})
  expect(basemap.base instanceof OlLayerTile).toBe(false)
  expect(basemap.osm instanceof OlLayerTile).toBe(true)

  expect(basemap.osm).toBe(basemap.getLayers().getArray()[0])
  expect(basemap.osm.getVisible()).toBe(true)
  expect(basemap.osm.getSource() instanceof OlSourceXYZ).toBe(true)
  expect(basemap.osm.getSource().getProjection().getCode()).toBe('EPSG:3857')
  expect(basemap.osm.getSource().getUrls()).toEqual(
    Basemap.OSM_URLS
  )
  
  expect(basemap.labels.base instanceof OlLayerTile).toBe(false)
  expect(Object.entries(basemap.labels).length).toBe(1) // photo layer only
  expect(basemap.labels.photo instanceof OlLayerTile).toBe(true)
  expect(basemap.labels.photo).toBe(basemap.getLayers().getArray()[1])
  expect(basemap.labels.photo.getVisible()).toBe(false)
  expect(basemap.labels.photo.getExtent()).toEqual(Basemap.LABEL_EXTENT)
  expect(basemap.labels.photo.getSource() instanceof OlSourceXYZ).toBe(true)
  expect(basemap.labels.photo.getSource().getProjection().getCode()).toBe('EPSG:3857')
  expect(basemap.labels.photo.getSource().getUrls()).toEqual([
    'https://maps1.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8',
    'https://maps2.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8',
    'https://maps3.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8',
    'https://maps4.nyc.gov/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8'
  ])

  let i = 2
  expect(Object.entries(basemap.photos).length).toBe(12)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(basemap.photos[year] instanceof OlLayerTile).toBe(true)
    expect(basemap.photos[year]).toBe(basemap.getLayers().getArray()[i])
    expect(basemap.photos[year].getVisible()).toBe(false)
    expect(basemap.photos[year].getExtent()).toEqual(Basemap.PHOTO_EXTENT)
    expect(basemap.photos[year].getSource() instanceof OlSourceXYZ).toBe(true)
    expect(basemap.photos[year].getSource().getProjection().getCode()).toBe('EPSG:3857')
    expect(basemap.photos[year].getSource().getUrls()).toEqual([
      `https://maps1.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`,
      `https://maps2.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`,
      `https://maps3.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`,
      `https://maps4.nyc.gov/tms/1.0.0/photo/${year}/{z}/{x}/{-y}.png8`
    ])
    i++
  })
  expect(i).toBe(14)
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
  expect.assertions(63)

  const basemap = new Basemap({target: 'map'})

  expect(Object.entries(basemap.photos).length).toBe(12)
  Object.entries(basemap.photos).forEach(([year, layer]) => {
    expect(layer.getVisible()).toBe(false)
  })

  expect(basemap.labels.base.getVisible()).toBe(true)
  expect(basemap.labels.photo.getVisible()).toBe(false)

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
