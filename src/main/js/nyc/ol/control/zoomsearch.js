var nyc = nyc || {};
nyc.ol = nyc.ol || {};
/** 
 * @public 
 * @namespace
 */
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class for providing a set of buttons to zoom and search.
 * @public
 * @class
 * @extends {nyc.ZoomSearch}
 * @constructor
 * @param {ol.Map} map The OpenLayers map that will be controlled 
 * @param {boolean} [useSearchTypeMenu=false] Use search types menu
 * @fires nyc.ZoomSearch#search
 * @fires nyc.ZoomSearch#geolocate
 * @fires nyc.ZoomSearch#disambiguated
 */
nyc.ol.control.ZoomSearch = function(map, useSearchTypeMenu){
	this.map = map;
	this.view = map.getView();
	this.geoJson = new ol.format.GeoJSON();
	nyc.ZoomSearch.apply(this, [useSearchTypeMenu]);
	this.getElem('.z-srch').on('click dblclick mouseover mousemove', function(){$('.feature-tip').hide();});
};

nyc.ol.control.ZoomSearch.prototype = {
	/**
	 * @private
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {ol.View}
	 */
	view: null,
	/**
	 * @private
	 * @member {ol.format.GeoJSON}
	 */
	geoJson: null,
	/**
	 * @desc A method to return the map container  HTML element wrapped in a JQuery
	 * @public
	 * @override
	 * @method
	 * @return {JQuery} The the map container HTML element wrapped in a JQuery
	 */
	getContainer: function(){
		return $(this.map.getTarget());
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
		var geom = feature.getGeometry(), type = geom.getType(), data = feature.getProperties();
		data.__feature_label = feature.get(options.labelField || options.nameField);
		return {
			name: feature.get(options.nameField), 
			coordinates: type == 'Point' ? geom.getCoordinates() : undefined,
			geoJsonGeometry: JSON.parse(this.geoJson.writeGeometry(geom)), 
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
		var view = this.view;
		this.map.beforeRender(ol.animation.zoom({resolution: view.getResolution()}));
		view.setZoom(view.getZoom() + $(event.target).data('zoom-incr'));
	}
};

nyc.inherits(nyc.ol.control.ZoomSearch, nyc.ZoomSearch);
