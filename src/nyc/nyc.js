/**
 * @module nyc
 */
import proj4 from 'proj4'

proj4.defs(
	'EPSG:2263',
	'+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'
)
proj4.defs(
	'EPSG:6539',
	'+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs'
)

 /**
  * @desc Top level namespace for nyc mapping
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
		Object.keys(mixin).forEach(member => {
				obj[member] = mixin[member]
			})
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
	}
  }

export default nyc
