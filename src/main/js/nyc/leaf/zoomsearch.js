var nyc = nyc || {};
nyc.leaf = nyc.leaf || {};

/**
 * @desc Class for providing a set of buttons to zoom and search.
 * @public
 * @class
 * @extends {nyc.ZoomSearch}
 * @constructor
 * @param {L.Map} map The Leaflet map that will be controlled 
 * @param {boolean} [useSearchTypeMenu=false] Use search types menu
 * @fires nyc.ZoomSearch#search
 * @fires nyc.ZoomSearch#geolocate
 * @fires nyc.ZoomSearch#disambiguated
 */
nyc.leaf.ZoomSearch = function(map, useSearchTypeMenu){
	this.map = map;
	nyc.ZoomSearch.apply(this, [useSearchTypeMenu]);
	this.container().find('.ctl-z-srch').on('click dblclick mouseover mousemove', this.stopEvent);
};

nyc.leaf.ZoomSearch.prototype = {
	/**
	 * @private
	 * @member {L.Map}
	 */
	map: null,
	/**
	 * @desc A method to return the map container  HTML element wrapped in a JQuery
	 * @public
	 * @override
	 * @method
	 * @return {JQuery} The the map container HTML element wrapped in a JQuery
	 */
	container: function(){
		return $(this.map.getContainer());
	},
	/**
	 * @public
	 * @override
	 * @method
	 * @param {Object} feature The feature object
	 * @param {nyc.ZoomSearch.FeatureSearchOptions} options The options passed to setFeature
	 * @return {nyc.Locate.Result}
	 */
	featureAsLocation: function(feature, options){
		var geom = feature.geometry, data = feature.properties;
		data.__feature_label = data[options.labelField || options.nameField];
		return {
			name: data[options.nameField],
			coordinates: geom.type == "Point" ? geom.coordinates : undefined,
			geoJsonGeometry: geom, 
			data: data,
			type: nyc.Locate.ResultType.GEOCODE,
			accuracy: nyc.Geocoder.Accuracy.HIGH
		}
	},
	/**
	 * @desc Handle the zoom event triggered by user interaction
	 * @public
	 * @override
	 * @method
	 * @param event The DOM event triggered by the zoom buttons
	 */
	zoom: function(event){
		var z = this.map.getZoom() + ($(event.target).data('zoom-incr') * 1);
		if (z >= 0 && z <= this.map.getMaxZoom()){
			this.map.setZoom(z);			
		}
	},
	/**
	 * @private
	 * @method
	 * @param {Object} event
	 */
	stopEvent: function(event){
		L.DomEvent.disableClickPropagation(event.target);
		$('.cartodb-tooltip').hide();
	}
};

nyc.inherits(nyc.leaf.ZoomSearch, nyc.ZoomSearch);

/**
 * @desc The expected maximum available zoom level
 * @public
 * @const
 * @type {number}
 */
nyc.leaf.ZoomSearch.MAX_ZOOM = 18;
