/**
 * @module nyc/BasemapHelper
 */

import $ from 'jQuery'

/**
 * @desc A helper object for creating and manipulating the NYC basemap
 * @public
 * @abstract
 * @class
 */
const BasemapHelper = {
  /**
   * @desc Get the storage used for laoding and saving data
	 * @access protected
   * @abstract
   * @method
   * @return {storage.Local} srorage
   */
	getStorage: function(year) {
		throw 'Not Implemented'
	},
	/**
	 * @desc Show photo layer
	 * @public
	 * @abstract
	 * @method
	 * @param {number} layer The photo year to show
	 */
	showPhoto: function(year) {
		throw 'Not Implemented'
	},
	/**
	 * @desc Show the specified label layer
	 * @public
	 * @abstract
	 * @method
	 * @param labelType {BasemapHelper.LabelType} The label type to show
	 */
	showLabels: function(labelType) {
		throw 'Not Implemented'
	},
	/**
	 * @desc Hide photo layer
	 * @public
	 * @abstract
	 * @method
	 */
	hidePhoto: function() {
		throw 'Not Implemented'
	},
	/**
	 * @desc Returns the base layers
	 * @public
	 * @abstract
	 * @method
	 * @return {BasemapHelper.BaseLayers}
	 */
	getBaseLayers: function() {
		throw 'Not Implemented'
	},
  /**
 	 * @desc Hook up events
   * @access protected
 	 * @method
   * @param {Element} target The DOM node for the map
   */
  hookupEvents: function(node) {
    $(node).on('drop', $.proxy(this.loadLayer, this))
    $(node).on('dragover', function(event){
      event.preventDefault()
    })
  },
	/**
	 * @desc Returns the base layers
   * @access protected
	 * @method
	 * @return {BasemapHelper.BaseLayers}
	 */
	 loadLayer: function(event) {
		 const transfer = event.originalEvent.dataTransfer
		 event.preventDefault()
		 event.stopPropagation()
		 if (transfer && transfer.files.length){
			 const storage = this.getStorage()
			 const files = transfer.files
			 const ext = files[0].name.split('.').pop().toLowerCase()
			 if (ext === 'json'){
				 storage.loadGeoJsonFile(this, null, files[0])
			 } else {
         storage.loadShapeFile(this, null, files)
       }
		 }
	 },
	/**
	 * @desc Returns the base layers
	 * @access protected
	 * @method
	 * @return {BasemapHelper.BaseLayers}
	 */
	sortedPhotos: function() {
		const sorted = []
    Object.keys(this.photos).forEach(photo => {
      sorted.push(this.photos[photo])
    })
		/* sort descending on the first 4 digits - puts 2001-2 in the proper place */
		return sorted.sort(function(a, b) {
      const aName = a.name || a.get('name')
      const bName = b.name || b.get('name')
			return bName.substr(0, 4) - aName.substr(0, 4)
		})
	}
}

/**
 * @desc Enumerator for label types
 * @public
 * @enum {string}
 */
BasemapHelper.LabelType = {
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
 * @desc Object type to hold base layers
 * @public
 * @typedef {Object}
 * @property {Object} base The base layer
 * @property {Object<string, ol.layer.Base|L.Layer>} labels The label layers
 * @property {Object<string, ol.layer.Base|L.Layer>} photos The photo layers
 */
BasemapHelper.BaseLayers

export default BasemapHelper
