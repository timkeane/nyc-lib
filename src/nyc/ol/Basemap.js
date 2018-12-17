/**
 * @module nyc/ol/Basemap
 */

import $ from 'jquery'

import nyc from 'nyc'
import nycOl from 'nyc/ol'
import BasemapHelper from 'nyc/BasemapHelper'
import LocalStorage from 'nyc/ol/LocalStorage'

import OlPluggableMap from 'ol/PluggableMap'

import CanvasMapRenderer from 'ol/renderer/canvas/Map'
import CanvasTileLayerRenderer from 'ol/renderer/canvas/TileLayer'
import CanvasVectorLayerRenderer from 'ol/renderer/canvas/VectorLayer'

import DoubleClickZoom from 'ol/interaction/DoubleClickZoom'
import DragPan from 'ol/interaction/DragPan'
import DragZoom from 'ol/interaction/DragZoom'
import KeyboardPan from 'ol/interaction/KeyboardPan'
import KeyboardZoom from 'ol/interaction/KeyboardZoom'
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom'
import PinchZoom from 'ol/interaction/PinchZoom'

import OlView from 'ol/View'
import OlSourceXYZ from 'ol/source/XYZ'
import OlLayerTile from 'ol/layer/Tile'

import {register as olProjRegister} from 'ol/proj/proj4'

const proj4 = nyc.proj4
olProjRegister(proj4)

/**
 * @desc Class that provides an ol.Map with base layers, labels, and drag-and-drop
 * @public
 * @class
 * @extends ol.PluggableMap
 * @mixes module:nyc/BasemapHelper~BasemapHelper
 * @see http://openlayers.org/en/latest/apidoc/module-ol_PluggableMap.html
 */
class Basemap extends OlPluggableMap {
  /**
   * @desc Create an instance of Basemap
   * @public
   * @constructor
   * @param {olx.MapOptions} options Constructor options
   * @param {number} [preload=0] Preload option for base layer
   */
  constructor(options, preload) {
    const viewProvided = options.view instanceof OlView
    Basemap.setupView(options)
    if (!options.interactions) {
      options.interactions = [
        new DoubleClickZoom(),
        new DragPan(),
        new PinchZoom(),
        new KeyboardPan(),
        new KeyboardZoom(),
        new MouseWheelZoom(),
        new DragZoom()
      ]
    }
    super(options)
    nyc.mixin(this, [BasemapHelper])
    /**
  	 * @private
  	 * @member {number}
  	 */
  	this.latestPhoto = 0
    /**
  	 * @private
  	 * @member {OlLayerTile}
  	 */
  	this.base = null
    /**
  	 * @private
  	 * @member {Object<string, OlLayerTile>}
  	 */
  	this.labels = {}
    /**
  	 * @private
  	 * @member {Object<string, OlLayerTile>}
  	 */
  	this.photos = {}
    /**
  	 * @private
  	 * @member {storage.Local}
  	 */
    this.storage = new LocalStorage()
    this.setupLayers(options, preload)
    this.defaultExtent(viewProvided)
    this.hookupEvents(this.getTargetElement())
  }
  createRenderer() {
    const renderer = new CanvasMapRenderer(this)
    renderer.registerLayerRenderers([
      CanvasTileLayerRenderer,
      CanvasVectorLayerRenderer
    ])
    return renderer
  }
  /**
   * @desc Show photo layer
   * @public
   * @override
   * @method
	 * @param year {number=} The photo year to show - shows the latest year if not provided
   */
  showPhoto(year) {
  	this.hidePhoto()
    this.photos[(year || this.latestPhoto) + ''].setVisible(true)
  	this.showLabels('photo')
  }
  /**
   * @desc Hide photo layer
   * @public
   * @override
   * @method
   */
  hidePhoto() {
    this.base.setVisible(true)
  	this.showLabels(BasemapHelper.LabelType.BASE)
    Object.entries(this.photos).forEach(([year, layer]) => {
      layer.setVisible(false)
    })
  }
  /**
   * @desc Show the specified label layer
   * @public
   * @override
   * @method
   * @param labelType {nyc.Basemap.BaseLayers} The label type to show
   */
  showLabels(labelType) {
  	this.labels.base.setVisible(labelType === BasemapHelper.LabelType.BASE)
  	this.labels.photo.setVisible(labelType === BasemapHelper.LabelType.PHOTO)
  }
  /**
   * @desc Returns the base layers
   * @public
   * @override
   * @method
   * @return {nyc.Basemap.BaseLayers}
   */
  getBaseLayers() {
  	return {
  		base: this.base,
  		labels: this.labels,
  		photos: this.photos
  	}
  }
  /**
	 * @desc Get the storage used for loading and saving data
   * @access protected
   * @override
   * @method
   * @return {nyc.ol.storage.Local} srorage
   */
  getStorage() {
  	return this.storage
  }
  /**
   * @private
   * @method
   * @param {boolean} viewProvided
   */
  defaultExtent(viewProvided) {
    if (!viewProvided) {
      this.getView().fit(Basemap.EXTENT, this.getSize())
    }
  }
  /**
   * @private
   * @method
   * @param {Object} options
   * @param {number} [preload=0]
   */
  setupLayers(options, preload) {
    this.base = new OlLayerTile({
      extent: this.layerExtent(Basemap.UNIVERSE_EXTENT, options.view),
      source: new OlSourceXYZ({
        url: Basemap.BASE_URL,
        projection: 'EPSG:3857'
      }),
      preload: preload || 0
    })
    this.addLayer(this.base)

    Object.entries(Basemap.LABEL_URLS).forEach(([labelType, url]) => {
      this.labels[labelType] = new OlLayerTile({
        extent: this.layerExtent(Basemap.LABEL_EXTENT, options.view),
        source: new OlSourceXYZ({
          url: url,
          projection: 'EPSG:3857'
        }),
        zIndex: 1000,
        visible: labelType == 'base'
      })
      this.addLayer(this.labels[labelType])
    })

    Object.entries(Basemap.PHOTO_URLS).forEach(([year, url]) => {
      const photo = new OlLayerTile({
        extent: this.layerExtent(Basemap.PHOTO_EXTENT, options.view),
        source: new OlSourceXYZ({
          url: url,
          projection: 'EPSG:3857'
        }),
        visible: false
      })
      if ((year.split('-')[0] * 1) > this.latestPhoto) {
        this.latestPhoto = year
      }
      photo.set('name', year)
      this.addLayer(photo)
      photo.on('change:visible', $.proxy(this.photoChange, this))
      this.photos[year] = photo
    })
  }
  /**
   * @private
   * @method
   * @param extent {ol.Extent} extent
   * @param view {ol.View|undefined} extent
   */
  layerExtent(extent, view) {
  	if (view && view.getProjection().getCode() !== 'EPSG:3857') {
      const fr = 'EPSG:3857'
      const to = 'EPSG:2263'
      const bl = proj4(fr, to, [extent[0], extent[1]])
      const tr = proj4(fr, to, [extent[2], extent[3]])
      return [bl[0], bl[1], tr[0], tr[1]]
  	}
  	return extent
  }
  /**
   * @private
   * @method
   */
  photoChange() {
    let isPhoto = false
    Object.entries(this.photos).some(([year, layer]) => {
      isPhoto = layer.getVisible()
      if (isPhoto) {
  			this.showLabels(BasemapHelper.LabelType.PHOTO)
  			return true
  		}
  	})
    if (!isPhoto) {
      this.showLabels(BasemapHelper.LabelType.BASE)
    }
  }
}

/**
 * @private
 * @static
 * @method
 * @param {Object} options
 */
Basemap.setupView = (options) => {
  if (!(options.view instanceof OlView)) {
    options.view = new OlView({
      center: Basemap.CENTER,
      minZoom: 8,
      maxZoom: 21,
      zoom: 8,
      constrainRotation: 1
    })
  }
}

/**
 * @desc The URL of the New York City base map tiles
 * @private
 * @const
 * @type {string}
 */
Basemap.BASE_URL = `https://${nycOl.TILE_HOSTS}/tms/1.0.0/carto/basemap/{z}/{x}/{-y}.jpg`

/**
 * @desc The URLs of the New York City aerial imagery map tiles
 * @private
 * @const
 * @type {Object<string, string>}
 */
Basemap.PHOTO_URLS = {
  '1924': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/1924/{z}/{x}/{-y}.png8`,
  '1951': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/1951/{z}/{x}/{-y}.png8`,
  '1996': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/1996/{z}/{x}/{-y}.png8`,
  '2001-2': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2001-2/{z}/{x}/{-y}.png8`,
  '2004': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2004/{z}/{x}/{-y}.png8`,
  '2006': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2006/{z}/{x}/{-y}.png8`,
  '2008': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2008/{z}/{x}/{-y}.png8`,
  '2010': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2010/{z}/{x}/{-y}.png8`,
  '2012': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2012/{z}/{x}/{-y}.png8`,
  '2014': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2014/{z}/{x}/{-y}.png8`,
  '2016': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2016/{z}/{x}/{-y}.png8`,
  '2018': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2018/{z}/{x}/{-y}.png8`
}

/**
 * @desc The URLs of the New York City base map label tiles
 * @private
 * @const
 * @type {Object<string, string>}
 */
Basemap.LABEL_URLS = {
  base: `https://${nycOl.TILE_HOSTS}/tms/1.0.0/carto/label/{z}/{x}/{-y}.png8`,
  photo: `https://${nycOl.TILE_HOSTS}/tms/1.0.0/carto/label-lt/{z}/{x}/{-y}.png8`
}

/**
 * @private
 * @const
 * @type {ol.Extent}
 */
Basemap.UNIVERSE_EXTENT = [-8453323, 4774561, -7983695, 5165920]

/**
 * @desc The bounds of New York City
 * @public
 * @const
 * @type {ol.Extent}
 */
Basemap.EXTENT = [-8266522, 4937867, -8203781, 5000276]

/**
 * @desc The center of New York City
 * @public
 * @const
 * @type {ol.Coordinate}
 */
Basemap.CENTER = [-8235252, 4969073]

/**
 * @private
 * @const
 * @type {ol.Extent}
 */
Basemap.LABEL_EXTENT = [-8268000, 4870900, -8005000, 5055500]

/**
 * @private
 * @const
 * @type {ol.Extent}
 */
Basemap.PHOTO_EXTENT = [-8268357, 4937238, -8203099, 5001716]

export default Basemap
