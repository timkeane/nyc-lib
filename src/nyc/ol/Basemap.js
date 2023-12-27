import $ from 'jquery'
import View from 'ol/View'
import Map from 'ol/Map'
import olms from 'ol-mapbox-style'
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom'
import DragPan from 'ol/interaction/DragPan'
import DragZoom from 'ol/interaction/DragZoom'
import KeyboardPan from 'ol/interaction/KeyboardPan'
import KeyboardZoom from 'ol/interaction/KeyboardZoom'
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom'
import PinchZoom from 'ol/interaction/PinchZoom'
import LocalStorage from './LocalStorage'
import LayerTile from 'ol/layer/Tile'
import SourceXYZ from 'ol/source/XYZ'
import nycOl from './'
import GeoJSON from 'ol/format/GeoJSON'
import proj4 from 'proj4'

class Basemap extends Map {
  constructor(options) {
    options = options || {}
    const viewProvided = options.view instanceof View
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

    /**
     * @private
     * @member {boolean}
     */
    this.mvt = options.mvt
    /**
     * @private
     * @member {Object<string, LayerTile>}
     */
    this.labels = {}
    /**
     * @private
     * @member {number}
     */
    this.latestPhoto = 0
    /**
    * @private
    * @member {LayerTile}
    */
    this.base = null
    /**
     * @private
     * @member {Object<string, OlLayerTile>}
     */
    this.photos = {}
    /**
     * @private
     * @member {module:nyc/LocalStorage~LocalStorage}
     */
    this.storage = new LocalStorage()

    if (options.mvt) {
      olms(this, Basemap.MVT_BASEMAP_STYLE_URL).then(map => {
        const layers = map.getLayers().getArray()
        this.base = layers[layers.length - 1]
        olms(this, Basemap.MVT_PHOTO_LABEL_STYLE_URL).then(mp => {
          const lyrs = mp.getLayers().getArray()
          lyrs[lyrs.length - 1].setVisible(false)
          this.labels.photos = lyrs[lyrs.length - 1]
          this.labels.photos.setVisible(false)
          this.setupPhotos(options)
        }).catch(err => console.error(err))
      }).catch(err => console.error(err))
    } else {
      this.base = new LayerTile({
        extent: this.layerExtent(Basemap.UNIVERSE_EXTENT, options.view),
        source: new SourceXYZ({url: Basemap.BASE_URL})
      })
      this.addLayer(this.base)
      Object.entries(Basemap.LABEL_URLS).forEach(([labelType, url]) => {
        this.labels[labelType] = new LayerTile({
          extent: this.layerExtent(Basemap.LABEL_EXTENT, options.view),
          source: new SourceXYZ({url}),
          zIndex: 1000,
          visible: labelType === Basemap.LabelType.BASE
        })
        this.addLayer(this.labels[labelType])
      })
    }
    this.setupPhotos(options)
    this.hookupEvents(this.getTargetElement())
    this.defaultExtent(viewProvided)
  }
  /**
   * @desc Returns the base layers
   * @public
   * @method
   * @return {nyc.Basemap.BaseLayers} Base layers
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
   * @method
   * @return {module:nyc/ol/LocalStorage~LocalStorage} storage
   */
  getStorage() {
    return this.storage
  }
  /**
   * @private
   * @method
   * @param {Object} options Options
   */
  setupPhotos(options) {
    Object.entries(Basemap.PHOTO_URLS).forEach(([year, url]) => {
      const photo = new LayerTile({
        extent: this.layerExtent(Basemap.PHOTO_EXTENT, options.view),
        source: new SourceXYZ({url}),
        visible: false
      })
      if ((year.split('-')[0] * 1) > this.latestPhoto) {
        this.latestPhoto = year
      }
      photo.set('name', year)
      this.addLayer(photo)
      photo.on('change:visible', this.photoChange.bind(this))
      this.photos[year] = photo
    })
  }
  /**
   * @private
   * @method
   * @param {ol.Extent} extent Extent
   * @param {ol.View|undefined} view The OpenLayers view
   * @return {ol.Extent} The layer extent
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
        this.showLabels(Basemap.LabelType.PHOTO)
        return true
      }
    })
    if (!isPhoto) {
      this.showLabels(Basemap.LabelType.BASE)
    }
  }
  /**
   * @desc Show photo layer
   * @public
   * @method
   * @param {number=} year The photo year to show - shows the latest year if not provided
   */
  showPhoto(year) {
    this.hidePhoto()
    this.photos[(year || this.latestPhoto) + ''].setVisible(true)
    if (!this.mvt) {
      this.showLabels(Basemap.LabelType.PHOTO)
    }
  }
  /**
   * @desc Hide photo layer
   * @public
   * @method
   */
  hidePhoto() {
    this.showLabels(Basemap.LabelType.BASE)
    Object.entries(this.photos).forEach(([year, layer]) => {
      layer.setVisible(false)
    })
  }
  /**
   * @desc Show the specified label layer
   * @public
   * @method
   * @param {nyc.Basemap.BaseLayers} labelType The label type to show
   */
  showLabels(labelType) {
    if (!this.mvt && this.labels.base) {
      this.labels.base.setVisible(labelType === Basemap.LabelType.BASE);
    }
    if (this.labels.photo) {
      this.labels.photo.setVisible(labelType === Basemap.LabelType.PHOTO);
    }
  }
  /**
   * @private
   * @method
   * @param {boolean} viewProvided was the view provided?
   */
  defaultExtent(viewProvided) {
    if (!viewProvided) {
      this.getView().fit(Basemap.EXTENT, this.getSize())
    }
  }
  /**
   * @desc Hook up events
   * @public
   * @method
   * @param {Element} node The DOM node for the map
   */
  hookupEvents(node) {
    $(node).on('drop', this.loadLayer.bind(this))
    $(node).on('dragover', (event) => {
      event.preventDefault()
    })
  }
  /**
   * @desc Loads a layer from a file
   * @public
   * @method
   * @param {jQuery.Event} event Event object
   */
  loadLayer(event) {
    const transfer = event.originalEvent.dataTransfer
    event.preventDefault()
    event.stopPropagation()
    if (transfer && transfer.files.length) {
      const files = transfer.files
      const ext = files[0].name.split('.').pop().toLowerCase()
      if (ext === 'json') {
        this.storage.loadGeoJsonFile(this, null, files[0])
      } else {
        this.storage.loadShapeFile(this, null, files)
      }
    }
  }
  /**
   * @desc Save source as GeoJSON
   * @public
   * @method
   * @param {ol.source.Vector} source The source
   * @param {string=} name The name of the file to write
   */
  saveGeoJson(source, name) {
    const format = new GeoJSON({
      featureProjection: this.getView().getProjection(),
      dataProjection: 'EPSG:4326'
    })
    this.storage.saveGeoJson(name || 'layer.json', format.writeFeatures(source.getFeatures()))
  }
  /**
   * @desc Returns the photo layers ordered by year
    * @public
    * @method
    * @return {Array<ol.layer.Base|L.Layer>} Array of photo layers
    */
  sortedPhotos() {
    const sorted = []
    Object.keys(this.photos).forEach(photo => {
      sorted.push(this.photos[photo])
    })
    /* sort descending on the first 4 digits - puts 2001-2 in the proper place */
    return sorted.sort((a, b) => {
      const aName = a.name || a.get('name')
      const bName = b.name || b.get('name')
      return bName.substr(0, 4) - aName.substr(0, 4)
    })
  }
}

Basemap.setupView = (options) => {
  if (!(options.view instanceof View)) {
    options.view = new View({
      center: Basemap.CENTER,
      minZoom: 8,
      maxZoom: 21,
      zoom: 8,
      constrainRotation: 1
    })
  }
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

/* @private
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
  '2018': `https://${nycOl.TILE_HOSTS}/tms/1.0.0/photo/2018/{z}/{x}/{-y}.png8`,
  '2020': 'https://tiles.arcgis.com/tiles/yG5s3afENB5iO9fj/arcgis/rest/services/NYC_Orthos_-_2020/MapServer/tile/{z}/{y}/{x}',
  '2022': 'https://tiles.arcgis.com/tiles/yG5s3afENB5iO9fj/arcgis/rest/services/DO_NOT_USE_NYC_2022_Orthos_WMA/MapServer/tile/{z}/{y}/{x}'
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
 * @desc Enumerator for label types
 * @public
 * @enum {string}
 */
Basemap.LabelType = {
  /**
   * @desc Label type for base layer
   */
  BASE: 'base',
  /**
   * @desc Label type for photo layer
   */
  PHOTO: 'photo'
}

/**
 * @desc The URLs of the alternate base map tiles
 * @private
 * @const
 * @type {string}
 */
Basemap.MVT_BASEMAP_STYLE_URL = 'https://www.arcgis.com/sharing/rest/content/items/2ee3ac7f481548c88d53ea50268525e7/resources/styles/root.json?f=json'
Basemap.MVT_PHOTO_LABEL_STYLE_URL = 'https://nyc.maps.arcgis.com/sharing/rest/content/items/c7afdaef353f46c4a1196b4d2f296abe/resources/styles/root.json?f=pjson'
export default Basemap
