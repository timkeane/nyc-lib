/**
 * @module nyc/LocalStorage
 */

import $ from 'jquery'

/**
 * @desc Class to provide access to localStorage and filesystem
 * @public
 * @class
 */
class LocalStorage {
  /**
   * @desc Check if download is available
   * @public
   * @method
   * @return {boolean}
   */
  canDownload(name, data) {
	  return 'download' in $('<a></a>').get(0)
  }
  /**
   * @desc Save data to a file prompting the user with a file dialog
   * @public
   * @method
   * @param {string} name File name
   * @param {string} data JSON data to write to file
   */
  saveGeoJson(name, data) {
    const href = `data:application/jsoncharset=utf-8,${encodeURIComponent(data)}`
    const a = $('<a class="file-dwn"><img></a>')
    $('body').append(a)
    a.attr('href', href).attr('download', name).find('img').trigger('click')
    a.remove()
  }
  /**
   * @desc Set data in localStorage if available
   * @public
   * @method
   * @param {string} key Storage key
   * @param {string} data Data to store
   */
  setItem(key, data) {
    if ('localStorage' in window) {
      localStorage.setItem(key, data)
    }
  }
  /**
	 * @desc Get data from localStorage if available
	 * @public
	 * @method
	 * @param {string} key Storage key
	 * @return {string}
	 */
	getItem(key) {
		if ('localStorage' in window) {
			return localStorage.getItem(key)
		}
  }
  /**
	 * @desc Remove data from localStorage if available
	 * @public
	 * @method
	 * @param {string} key Storage key
	 * @return {string}
	 */
	removeItem(key) {
		if ('localStorage' in window) {
			return localStorage.removeItem(key)
		}
  }
  /**
	 * @desc Open a text file from local disk
	 * @public
	 * @method
	 * @param {function} callback The callback function to receive file content
	 * @param {File=} file File
	 */
	readTextFile(callback, file) {
		const reader = new FileReader()
		reader.onload = () => {
			callback(reader.result)
		}
		if (!file) {
			const input = $('<input class="file-in" type="file">')
			$('body').append(input)
			input.change(event => {
				input.remove()
				reader.readAsText(event.target.files[0])
			})
			input.trigger('click')
		} else {
			reader.readAsText(file)
		}
  }
	/**
	 * @desc Open a GeoJSON file from local disk
	 * @public
	 * @method
	 * @param {ol.Map|L.Map} map The map in which the data will be displayed
	 * @param {function=} callback The callback function to receive the added ol.vector.Layer
	 * @param {File=} file File
	 */
	loadGeoJsonFile(map, callback, file) {
		this.readTextFile(geoJson => {
			const layer = this.addToMap(map, geoJson)
			if (callback) callback(layer)
		}, file)
  }
	/**
	 * @desc Open a shapefile from local disk
	 * @public
	 * @method
	 * @param {ol.Map|L.Map} map The map in which the data will be displayed
	 * @param {function=} callback The callback function to receive the added ol.vector.Layer
	 * @param {FileList=} files Files (.shp, .dbf, .prj)
	 * @see https://github.com/mbostock/shapefile
	 */
	loadShapeFile(map, callback, files) {
		if (!files) {
			const me = this
			const input = $('<input class="file-in" type="file" multiple>')
			$('body').append(input)
			input.change(event => {
				me.getShpDbfPrj(map, event.target.files, callback)
				input.remove()
			})
			input.trigger('click')
		} else {
			this.getShpDbfPrj(map, files, callback)
		}
  }
	/**
	 * @private
	 * @method
	 * @param {ol.Map|L.Map} map
	 * @param {FileList} file
	 * @param {function} callback
	*/
	getShpDbfPrj(map, files, callback) {
		let shp, dbf, prj
		Object.values(files).forEach(file => {
			const name = file.name
			const ext = name.substr(name.length - 4).toLowerCase()
			if (ext === '.shp') shp = file
			else if (ext === '.dbf') dbf = file
			else if (ext === '.prj') prj = file
		})
		if (shp) {
			this.readPrj(prj, projcs => {
				this.readShpDbf(map, shp, dbf, projcs, callback)
			})
		} else if (callback) {
			callback()
		}
  }
	/**
	 * @private
	 * @method
	 * @param {File} prj
	 * @param {function} callback
	*/
	readPrj(prj, callback) {
		if (prj) {
			this.readTextFile(callback, prj)
		} else {
			callback()
		}
  }
	/**
	 * @private
	 * @method
	 * @param {ol.Map|L.Map} map
	 * @param {File} shp
	 * @param {File} dbf
	 * @param {string} projcs
	 * @param {function} callback
	*/
	readShpDbf(map, shp, dbf, projcs, callback) {
		let shpBuffer, dbfBuffer
		const shpReader = new FileReader()
		shpReader.onload = event => {
			shpBuffer = event.target.result
			if (dbfBuffer || !dbf) {
				this.readShp(map, shpBuffer, dbfBuffer, projcs, callback)
			}
		}
		const dbfReader = new FileReader()
		dbfReader.onload = event => {
			dbfBuffer = event.target.result
			if (shpBuffer) {
				this.readShp(map, shpBuffer, dbfBuffer, projcs, callback)
			}
		}
		shpReader.readAsArrayBuffer(shp)
		if (dbf) dbfReader.readAsArrayBuffer(dbf)
  }
	/**
	 * @private
	 * @method
	 * @param {ol.Map|L.Map} map
	 * @param {string|ArrayBuffer} shp
	 * @param {string|ArrayBuffer} dbf
	 * @param {function} callback
	*/
	readShp(map, shp, dbf, projcs, callback) {
		const me = this
    let features = []
		LocalStorage.shapefile.open(shp, dbf)
		  .then(source => {
				source.read()
				.then(function collect(result) {
					if (result.done) {
						const layer = me.addToMap(map, features, projcs)
						if (callback) callback(layer)
						return
					} else {
						features.push(result.value)
					}
					return source.read().then(collect)
				})
			}).catch(error => {
				console.error(error)
			})
  }
	/**
	 * @public
	 * @abstract
	 * @method
	 * @param {ol.Map|L.Map} map
	 * @param {string|Array<Object>} features
	 * @param {string} projcs
	 * @return {Object}
	*/
	addToMap(map, features, projcs) {
		throw 'Not implemented'
  }
	/**
	 * @private
	 * @method
	 * @param {string} projcs
	  * @return {string|undefined}
	*/
	customProj(projcs) {
		if (projcs) {
			proj4.defs('shp:prj', projcs)
			return 'shp:prj'
		}
	}
}

LocalStorage.shapefile = require('shapefile')

export default LocalStorage
