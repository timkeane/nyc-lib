/**
 * @module nyc/Basemap
 */

import $ from 'jQuery'

/**
 * @desc An abstract class for creating and manipulating the NYC basemap
 * @public
 * @abstract
 * @class
 */
export default class Basemap {
    /**
     * @desc Constructs an instance of Basemap
     * @public
     * @constructor
     * @param {Basemap.Options} options Constructor options
     */
    constructor(options) {
        let target = $(options.target)
        if (target.length === 0) {
            try {
              target = $('#' + options.target)
            } catch (ignore) { }
        }
        if (target.length === 0) {
          throw `target ${options.target} does not exist`
        }
        target.on('drop', $.proxy(this.loadLayer, this))
        target.on('dragover', function(event){
            event.preventDefault()
        })
    }
    /**
	 * @desc Get the storage used for laoding and saving data
	 * @public
	 * @abstract
	 * @method
	 * @return {storage.Local} srorage
	 */
	getStorage(year) {
		throw 'Not Implemented'
	}
	/**
	 * @desc Show photo layer
	 * @public
	 * @abstract
	 * @method
	 * @param {number} layer The photo year to show
	 */
	showPhoto(year) {
		throw 'Not Implemented'
	}
	/**
	 * @desc Show the specified label layer
	 * @public
	 * @abstract
	 * @method
	 * @param labelType {Basemap.LabelType} The label type to show
	 */
	showLabels(labelType) {
		throw 'Not Implemented'
	}
	/**
	 * @desc Hide photo layer
	 * @public
	 * @abstract
	 * @method
	 */
	hidePhoto() {
		throw 'Not Implemented'
	}
	/**
	 * @desc Returns the base layers
	 * @public
	 * @abstract
	 * @method
	 * @return {Basemap.BaseLayers}
	 */
	getBaseLayers() {
		throw 'Not Implemented'
	}
	/**
	 * @desc Returns the base layers
	 * @public
	 * @method
	 * @return {Basemap.BaseLayers}
	 */
	 loadLayer(event) {
		 const transfer = event.originalEvent.dataTransfer
		 event.preventDefault()
		 event.stopPropagation()
		 if (transfer && transfer.files.length){
			 const storage = this.getStorage()
			 const files = transfer.files
			 files.forEach(file => {
				 const ext = file.name.split('.').pop().toLowerCase()
				 if (ext === 'json'){
					 storage.loadGeoJsonFile(map, null, file)
				 }
			 })
			 storage.loadShapeFile(map, null, files)
		 }
	 }
	/**
	 * @desc Returns the base layers
	 * @access protected
	 * @method
	 * @return {Basemap.BaseLayers}
	 */
	sortedPhotos() {
		const sorted = []
		for (const photo in this.photos){
			sorted.push(this.photos[photo])
		}
		/* sort descending on the first 4 digits - puts 2001-2 in the proper place */
		return sorted.sort(function(a, b){
            const aName = a.name || a.get('name')
            const bName = b.name || b.get('name')
			return bName.substr(0, 4) - aName.substr(0, 4)
		})
	}
}

/**
 * @desc Object type to hold constructor options for {@link Basemap}
 * @public
 * @typedef {Object}
 * @property {Element|JQuery|string} target The target DOM node for creating the map
 */
Basemap.Options

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
 * @desc Object type to hold base layers
 * @public
 * @typedef {Object}
 * @property {Object} base The base layer
 * @property {Object<string, ol.layer.Base|L.Layer>} labels The label layers
 * @property {Object<string, ol.layer.Base|L.Layer>} photos The photo layers
 */
Basemap.BaseLayers
