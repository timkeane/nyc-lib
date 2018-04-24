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

const nyc = {
	/**
	 * @desc Provide inheritance functionality
	 * @public
	 * @static
	 * @function
	 * @param {function()} childCtor The child constructor
	 * @param {function()} parentCtor The parent constructor
	 */
	inherits(childCtor, parentCtor) {
		Object.keys(parentCtor.prototype).forEach(function(member) {
			if (!(member in childCtor.prototype)) {
				childCtor.prototype[member] = parentCtor.prototype[member]
			}
		})
	}
}

export { nyc }
