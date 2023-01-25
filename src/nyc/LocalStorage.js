/**
 * @module nyc/LocalStorage
 */

import $ from 'jquery'
import nyc from './index'

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
   * @return {boolean} True if download is available
   */
  canDownload() {
    return 'download' in $('<a></a>').get(0)
  }
  /**
   * @desc Save GeoJSON data to a file prompting the user with a file dialog
   * @public
   * @method
   * @param {string} name File name
   * @param {string} data JSON data to write to file
   */
  saveGeoJson(name, data) {
    const href = `data:application/jsoncharset=utf-8,${encodeURIComponent(data)}`
    const a = $('<a class="file-dwn"><img></a>')
    $('body').append(a)
    a.attr({href: href, download: name}).find('img').trigger('click')
    a.remove()
  }
  /**
   * @desc Set data in browser's localStorage if available
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
   * @desc Get data from browser's localStorage if available
   * @public
   * @method
   * @param {string} key Storage key
   * @return {string} The value of the key in local storage
   */
  getItem(key) {
    if ('localStorage' in window) {
      return localStorage.getItem(key)
    }
  }
  /**
   * @desc Remove data from browser's localStorage if available
   * @public
   * @method
   * @param {string} key Storage key
   */
  removeItem(key) {
    if ('localStorage' in window) {
      localStorage.removeItem(key)
    }
  }
  /**
   * @desc Open a text file from filesystem
   * @public
   * @method
   * @param {module:nyc/LocalStorage~LocalStorage#readTextFileCallback} callback The callback function to receive file content
   * @param {File=} file File - if not provided the user will be prompted with a file dialog
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
   * @desc Open a GeoJSON file from filesystem
   * @public
   * @method
   * @param {ol.Map|L.Map} map The map in which the data will be displayed
   * @param {module:nyc/LocalStorage~LocalStorage#loadGeoJsonFileCallback} callback The callback function to receive the new layer
   * @param {File=} file File - if not provided the user will be prompted with a file dialog
   */
  loadGeoJsonFile(map, callback, file) {
    this.readTextFile(geoJson => {
      const layer = this.addToMap(map, geoJson)
      if (callback) {
        callback(layer)
      }
    }, file)
  }
  /**
   * @desc Open a shapefile from filesystem
   * @public
   * @method
   * @param {ol.Map|L.Map} map The map in which the data will be displayed
   * @param {module:nyc/LocalStorage~LocalStorage#loadShapeFileCallback} callback The callback function to receive the new layer
   * @param {FileList=} files Files (.shp, .dbf, .prj) - if not provided the user will be prompted with a file dialog
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
   * @param {ol.Map|L.Map} map The map
   * @param {FileList} files List of files
   * @param {function} callback Callback function
  */
  getShpDbfPrj(map, files, callback) {
    let shp, dbf, prj
    Object.values(files).forEach(file => {
      const name = file.name
      const ext = name.substr(name.length - 4).toLowerCase()
      if (ext === '.shp') {
        shp = file
      } else if (ext === '.dbf') {
        dbf = file
      } else if (ext === '.prj') {
        prj = file
      }
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
   * @param {File} prj Prj file
   * @param {function} callback Callback function
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
   * @param {ol.Map|L.Map} map The map
   * @param {File} shp The shp file
   * @param {File} dbf The dbf file
   * @param {string} projcs Proj coordinate reference system
   * @param {function} callback Callback function
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
    if (dbf) {
      dbfReader.readAsArrayBuffer(dbf)
    }
  }
  /**
   * @private
   * @method
   * @param {ol.Map|L.Map} map The map
   * @param {string|ArrayBuffer} shp The shp file
   * @param {string|ArrayBuffer} dbf The dbf file
   * @param {string} projcs Proj coordinate reference system
   * @param {function} callback Callback function
  */
  readShp(map, shp, dbf, projcs, callback) {
    const me = this
    const features = []
    LocalStorage.shapefile.open(shp, dbf)
      .then(source => {
        source.read()
          .then(function collect(result) {
            if (result.done) {
              const layer = me.addToMap(map, features, projcs)
              if (callback) {
                callback(layer)
              }
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
   * @param {ol.Map|L.Map} map The map on which to display the new layer
   * @param {string|Array<Object>} features The features from which to create the new layer
   * @param {string=} projcs The projection
   * @return {ol.layer.Vector|L.Layer} The new layer
  */
  addToMap(map, features, projcs) {
    throw 'Not implemented'
  }
  /**
   * @desc Add a new projection to proj4 and return the code
   * @access protected
   * @method
   * @param {string} projcs The projecion as defined in a prj file
   * @param {Object} proj4 The proj4 instance
   * @return {string|undefined} The code for the new projection
   */
  customProj(projcs, proj4) {
    if (projcs) {
      const code = nyc.nextId('shp:prj')
      proj4.defs(code, projcs)
      return code
    }
  }
}

/**
 * @desc Callback for {@link module:nyc/LocalStorage~LocalStorage#readTextFile}
 * @public
 * @callback module:nyc/LocalStorage~LocalStorage#readTextFileCallback
 * @param {string} fileContents The text contained in the file
 */

/**
 * @desc Callback for {@link module:nyc/LocalStorage~LocalStorage#loadGeoJsonFile}
 * @public
 * @callback module:nyc/LocalStorage~LocalStorage#loadGeoJsonFileCallback
 * @param {ol.layer.Vector|L.Layer} layer The layer created from the GeoJSON file
 */

/**
 * @desc Callback for {@link module:nyc/LocalStorage~LocalStorage#loadShapeFile}
 * @public
 * @callback module:nyc/LocalStorage~LocalStorage#loadShapeFileCallback
 * @param {ol.layer.Vector|L.Layer} layer The layer created from the shapefile
 */

LocalStorage.shapefile = require('shapefile')

export default LocalStorage
