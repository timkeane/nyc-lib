import OlFormatGeoJSON from 'ol/format/geojson'
import OlSourceVector from 'ol/source/vector'
import OlLayerVector from 'ol/layer/vector'

import NycLocalStorage from 'nyc/LocalStorage'

/**
 * @desc Class to provide access to localStorage and filesystem
 * @public
 * @class
 * @extends module:nyc/LocalStorage~LocalStorage
 */
export default class LocalStorage extends NycLocalStorage {
	/**
	 * @desc Create an instance pf LocalStorage
	 * @public
	 * @constructor
	 */
	constructor() {
		super()
	}
	/**
	 * @public
	 * @override
	 * @method
	 * @param {ol.Map} map The map on which to display the new layer
	 * @param {string|Array<Object>} features The features from which to create the new layer
	 * @param {string} projcs The projection
	 * @return {ol.layer.Vector} The new layer
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

