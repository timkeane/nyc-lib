/**
 * @module nyc
 */

import $ from 'jquery'

import proj4 from 'proj4'

proj4.defs(
	'EPSG:2263',
	'+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'
)
proj4.defs(
	'EPSG:6539',
	'+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs'
)
global.proj4 = proj4

 /**
  * @desc Top level namespace for NYC mapping
  * @public
  * @namespace
  */
const nyc = {
	/**
	 * @desc Provide inheritance for function-based classes using prototype
	 * @public
	 * @static
	 * @function
	 * @param {function} childCtor The constructor of the subclass
	 * @param {function} parentCtor The constructor of the superclass
	 */
	inherits(childCtor, parentCtor) {
	  nyc.copyFromParentProperties(childCtor.prototype, parentCtor.prototype)
	},
	/**
	 * @desc Provide for function-based classes to inherit from ES5 and ES6 classes
	 * @public
	 * @static
	 * @function
	 * @param {Object} childObj An instance of the subclass
	 * @param {Object} parentObj An instance of the superclass
	 */
	subclass(childObj, parentObj){
	  const parentProto = Object.getPrototypeOf(parentObj)
	  nyc.copyFromParentProperties(childObj, parentProto)
	  nyc.copyFromParentKeys(childObj, parentObj)
	},
	/**
	 * @desc Provide mixin functionality
	 * @public
	 * @static
	 * @function
	 * @param {Object} obj The target of the mixins
	 * @param {Array<Object>} mixins An array of mixin objects - last in wins
	 */
	mixin(obj, mixins) {
		mixins.forEach(mixin => {
			$.extend(obj, mixin)
		})
	},
	/**
	 * @private
	 * @static
	 * @function
	 * @param {Object} childObj
	 * @param {Object} parentObj
	 */
	copyFromParentProperties(childObj, parentObj) {
	  Object.getOwnPropertyNames(parentObj).forEach(member => {
		if (!(member in childObj)) {
		  childObj[member] = parentObj[member]
		}
	  })
	},
	/**
	 * @private
	 * @static
	 * @function
	 * @param {Object} childObj
	 * @param {Object} parentObj
	 */
	copyFromParentKeys(childObj, parentObj) {
	  Object.keys(parentObj).forEach(member => {
		if (!(member in childObj)) {
		  childObj[member] = parentObj[member]
		}
	  })
	},
  /**
	 * @public
   * @static
	 * @function
	 * @param {string} s A string
	 * @return {string} Input string with the first letter of each word capitalized
	 */
	capitalize(s) {
		const words = s.split(' ')
    let result = ''
		words.forEach(w => {
			const word = w.toLowerCase()
			result += word.substr(0, 1).toUpperCase()
			result += word.substr(1).toLowerCase()
			result += ' '
		})
		return result.trim()
	},
	/**
	 * @public
   * @static
	 * @function
	 * @param {string} prefix An id prefix
	 * @return {string} A unique id
	 */
	nextId(prefix){
		const last = nyc.uniqueIds[prefix]
		nyc.uniqueIds[prefix] = (typeof last === 'number') ? (last + 1) : 0
		return `${prefix}-${nyc.uniqueIds[prefix]}`
	},
	/**
	 * @public
   * @static
	 * @function
	 * @param {Object} object An object
	 * @return {JQuery}
	 */
	 html(object) {
		 if (typeof object.html === 'function') {
       return $(object.html())
     } else {
       const html = $('<div class="nyc-html"></div>')
       if (object.getProperties) object = object.getProperties()
			 else if (object.properties) object = object.properties
       Object.keys(object).forEach(prop => {
         html.append(`<div><span class="fld">${prop}</span><span class="val">${object[prop]}</span></div>`)
       })
			 return html
		 }
	 },
	/**
	 * @private
	 * @static
	 * @member {Object<string, number>}
	 */
	 uniqueIds: {}
}

export default nyc
