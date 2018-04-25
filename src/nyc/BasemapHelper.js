/**
 * @module nyc/BasemapHelper
 */

import $ from 'jQuery'
import IBasemap from './Basemap'

/**
 * @desc A helper object for creating and manipulating the NYC basemap
 * @public
 * @abstract
 * @class
 */
const BasemapHelper = {
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
	 * @return {Basemap.BaseLayers}
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
	 * @return {Basemap.BaseLayers}
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

export default BasemapHelper
