/**
 * @module nyc/leaf/Basemap
 */

import nyc from 'nyc'
import leaf from 'nyc/leaf'
import BasemapHelper from 'nyc/BasemapHelper'
import LocalStorage from 'nyc/leaf/LocalStorage'

import L from 'leaflet'

/**
 * @desc Class that provides an L.Map with base layers and labels
 * @public
 * @class
 * @extends L.Map
 * @mixes module:nyc/BasemapHelper~BasemapHelper
 * @see http://leafletjs.com/
 */
class Basemap {
/**
 * @desc Create an instance of Basemap
 * @public
 * @extends {L.Map}
 * @param {module:nyc/leaf/Basemap~Basemap.Options} options Constructor options
 * @constructor
 */
  constructor(options) {
    const map = L.map(options.target)
    nyc.mixin(map, [BasemapHelper])
    /**
     * @private
     * @member {number}
     */
    map.latestPhoto = 0
    /**
     * @private
     * @member {L.TileLayer}
     */
    map.base = null
    /**
     * @private
     * @member {Object<string, L.TileLayer>}
     */
    map.labels = {}
    /**
     * @private
     * @member {Object<string, L.TileLayer>}
     */
    map.photos = {}
    /**
     * @private
     * @member {storage.Local}
     */
    map.storage = new LocalStorage()
    this.setupLayers(map, options)
    map.fitBounds(Basemap.EXTENT)
    map.hookupEvents(map.getContainer())
    return map
  }
  /**
   * @private
   * @method
   * @param {L.Map} map The Leaflet map
   * @param {module:nyc/BasemapHelper~BasemapHelper.Options} options Options
   */
  setupLayers(map, options) {
    map.base = L.tileLayer(Basemap.BASE_URL, {
      minNativeZoom: 8,
      maxNativeZoom: 21,
      subdomains: '1234',
      tms: true,
      bounds: Basemap.UNIVERSE_EXTENT,
      zIndex: 0
    })
    map.base.name = 'base'
    map.addLayer(map.base)

    Object.entries(Basemap.LABEL_URLS).forEach(([labelType, url]) => {
      map.labels[labelType] = L.tileLayer(Basemap.LABEL_URLS[labelType], {
        minNativeZoom: 8,
        maxNativeZoom: 21,
        subdomains: '1234',
        tms: true,
        bounds: Basemap.LABEL_EXTENT,
        zIndex: 1000
      })
      map.labels[labelType].name = labelType
      if (labelType == 'base') {
        map.addLayer(map.labels[labelType])
      }
    })

    Object.entries(Basemap.PHOTO_URLS).forEach(([year, url]) => {
      const photo = L.tileLayer(url, {
        minNativeZoom: 8,
        maxNativeZoom: 21,
        subdomains: '1234',
        tms: true,
        bounds: Basemap.PHOTO_EXTENT,
        zIndex: 1
      })
      if ((year.split('-')[0] * 1) > map.latestPhoto) {
        map.latestPhoto = year
      }
      photo.name = year
      map.photos[year] = photo
      map.photos[year] = photo
    })
  }
  /**
   * @desc Get the storage used for loading and saving data
   * @public
   * @override
   * @method
   * @return {module:nyc/leaf/LocalStorage~LocalStorage} srorage
   */
  getStorage(year) {
    return this.storage
  }

  /**
   * @desc Show photo layer
   * @public
   * @override
   * @method
   * @param {number=} year The photo year to show - shows the latest year if not provided
   */
  showPhoto(year) {
    year = year || this.latestPhoto
    this.hidePhoto()
    this.addLayer(this.photos[year + ''])
    this.showLabels('photo')
  }
  /**
   * @desc Show labels by type
   * @public
   * @override
   * @method
   * @param {module:nyc/BasemapHelper~BasemapHelper} labelType The label type to show
   */
  showLabels(labelType) {
    this[labelType == BasemapHelper.LabelType.BASE ? 'addLayer' : 'removeLayer'](this.labels.base)
    this[labelType == BasemapHelper.LabelType.PHOTO ? 'addLayer' : 'removeLayer'](this.labels.photo)
  }

  /**
   * @desc Hide photo layer
   * @public
   * @override
   * @method
   */
  hidePhoto() {
    this.showLabels(BasemapHelper.LabelType.BASE)
    Object.keys(this.photos).map(photoYear => {
      if (this.hasLayer(this.photos[photoYear])) {
        this.removeLayer(this.photos[photoYear])
      }
    })
  }
  /**
   * @desc Returns the base layers
   * @public
   * @override
   * @method
   * @return {module:nyc/BasemapHelper~BasemapHelper.BaseLayers} Base layer object
   */
  getBaseLayers() {
    return {
      base: this.base,
      labels: this.labels,
      photos: this.photos
    }
  }
}
/**
 * @desc Constructor options for {@link module:nyc/leaf/Basemap~Basemap}
 * @public
 * @typedef {Object}
 * @property {Element|string} target The target DOM node for creating the map
 */
Basemap.Options;

/**
 * @desc The URL of the New York City base map tiles
 * @private
 * @const
 * @type {string}
 */
Basemap.BASE_URL = `https://${leaf.TILE_HOSTS}/tms/1.0.0/carto/basemap/{z}/{x}/{y}.jpg`

/**
 * @desc The URLs of the New York City aerial imagery map tiles
 * @private
 * @const
 * @type {Object<string, string>}
 */
Basemap.PHOTO_URLS = {
  '1924': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/1924/{z}/{x}/{y}.png8`,
  '1951': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/1951/{z}/{x}/{y}.png8`,
  '1996': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/1996/{z}/{x}/{y}.png8`,
  '2001-2': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/2001-2/{z}/{x}/{y}.png8`,
  '2004': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/2004/{z}/{x}/{y}.png8`,
  '2006': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/2006/{z}/{x}/{y}.png8`,
  '2008': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/2008/{z}/{x}/{y}.png8`,
  '2010': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/2010/{z}/{x}/{y}.png8`,
  '2012': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/2012/{z}/{x}/{y}.png8`,
  '2014': `https://${leaf.TILE_HOSTS}/tms/1.0.0/photo/2014/{z}/{x}/{y}.png8`
}

/**
 * @desc The URLs of the New York City base map label tiles
 * @private
 * @const
 * @type {Object<string, string>}
 */
Basemap.LABEL_URLS = {
  base: `https://${leaf.TILE_HOSTS}/tms/1.0.0/carto/label/{z}/{x}/{y}.png8`,
  photo: `https://${leaf.TILE_HOSTS}/tms/1.0.0/carto/label-lt/{z}/{x}/{y}.png8`
}

/**
 * @private
 * @const
 * @type {L.LatLngBounds}
 */
Basemap.UNIVERSE_EXTENT = L.latLngBounds([39.3682, -75.9374], [42.0329, -71.7187])
/**
 * @desc The bounds of New York City
 * @public
 * @const
 * @type {L.LatLngBounds}
 */
Basemap.EXTENT = L.latLngBounds([40.4931, -74.2594], [40.9181, -73.6958])
/**
 * @desc The center of New York City
 * @public
 * @const
 * @type {L.LatLng}
 */
Basemap.CENTER = L.latLng([40.7033127, -73.979681])
/**
 * @private
 * @const
 * @type {L.LatLngBounds}
 */
Basemap.LABEL_EXTENT = L.latLngBounds([40.0341, -74.2727], [41.2919, -71.9101])
/**
 * @private
 * @const
 * @type {L.LatLngBounds}
 */
Basemap.PHOTO_EXTENT = L.latLngBounds([40.4888, -74.2759], [40.9279, -73.6896])

nyc.inherits(L.Map, Basemap)

export default Basemap
