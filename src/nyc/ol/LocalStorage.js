import OlFormatGeoJSON from 'ol/format/geojson'
import OlSourceVector from 'ol/source/vector'
import OlLayerVector from 'ol/layer/vector'

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
	 * @param {ol.Map} map
	 * @param {string|Array<Object>} features
	 * @param {string} projcs
	 * @return {ol.layer.Vector}
	 */
	addToMap (map, features, projcs) {
		const options = {
			featureProjection: map.getView().getProjection(),
			dataProjection: this.customProj(projcs)
		}
		if (typeof features === 'object') {
			features = {type: 'FeatureCollection', features: features}
		}
		features = new OlFormatGeoJSON().readFeatures(features, options)
		const source = new OlSourceVector()
		const layer = new OlLayerVector({source: source})
		source.addFeatures(features)
		map.addLayer(layer)
		return layer
	}
}

