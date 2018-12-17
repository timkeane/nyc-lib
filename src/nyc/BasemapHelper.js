/**
 * @module nyc/BasemapHelper
 */

import $ from 'jquery'

/**
 * @desc A helper object for creating and manipulating the NYC basemap
 * @public
 * @mixin
 */
const BasemapHelper = {
  /**
   * @desc Hook up events
   * @public
   * @method
   * @param {Element} node The DOM node for the map
   */
  hookupEvents(node) {
    $(node).on('drop', $.proxy(this.loadLayer, this))
    $(node).on('dragover', (event) => {
      event.preventDefault()
    })
  },
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
  },
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
  },
  /**
   * @desc Enumerator for label types
   * @public
   * @enum {string}
   */
  LabelType: {
    /**
     * @desc Label type for base layer
     */
    BASE: 'base',
    /**
     * @desc Label type for photo layer
     */
    PHOTO: 'photo'
  }
}

/**
 * @desc Object type to hold base layers
 * @public
 * @typedef {Object}
 * @property {Object} base The base layer
 * @property {Object<string, ol.layer.Base|L.Layer>} labels The label layers
 * @property {Object<string, ol.layer.Base|L.Layer>} photos The photo layers
 */
BasemapHelper.BaseLayers

export default BasemapHelper
