/**
 * @module nyc/Basemap
 */

/**
 * @desc An interface required for manipulating the NYC basemap
 * @public
 * @abstract
 * @interface
 */
class Basemap {
  /**
   * @desc Get the storage used for laoding and saving data
	 * @access protected
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
	 * @param labelType {BasemapHelper.LabelType} The label type to show
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
	 * @return {BasemapHelper.BaseLayers}
	 */
	getBaseLayers() {
		throw 'Not Implemented'
	}
  /**
 	 * @desc Hook up events
   * @access protected
 	 * @method
   * @param {Element} target The DOM node for the map
   */
  hookupEvents(node) {
    $(node).on('drop', $.proxy(this.loadLayer, this))
    $(node).on('dragover', function(event){
      event.preventDefault()
    })
  }
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
 * @desc Object type to hold base layers
 * @public
 * @typedef {Object}
 * @property {Object} base The base layer
 * @property {Object<string, ol.layer.Base|L.Layer>} labels The label layers
 * @property {Object<string, ol.layer.Base|L.Layer>} photos The photo layers
 */
Basemap.BaseLayers

export default Basemap
