import NycLocalStorage from 'nyc/LocalStorage'

/**
 * @desc Class to provide access to localStorage and filesystem
 * @public
 * @class
 * @extends {nyc.storage.Local}
 * @constructor
 */
export default class LocalStorage extends NycLocalStorage {
	constructor() {
		super()
	}
	/**
	 * @public
	 * @override
	 * @method
	 * @param {L.Map} map
	 * @param {string|Array<Object>} features
	 * @param {string} projcs
	 * @return {L.Layer}
	 */
	addToMap(map, features, projcs) {
		const dataProjection = this.customProj(projcs)
		if (typeof features === 'string') {
			features = JSON.parse(features)
		}
		features = features.features ? features.features : features

		const layer = L.geoJSON(features, {
			coordsToLatLng: (coord) => {
	 		 if (dataProjection) {
	 			 coord = proj4(dataProjection, 'EPSG:4326', coord)
	 		 }
	 		 return [coord[1], coord[0], coord[2]]
	 	 }
		})
		map.addLayer(layer)
		return layer
	}
}

