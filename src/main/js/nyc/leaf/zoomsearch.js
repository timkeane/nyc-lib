var nyc = nyc || {};
nyc.leaf = nyc.leaf || {};

/**
 * @desc Class for providing a set of buttons to zoom and search.
 * @public
 * @class
 * @constructor
 * @extends {nyc.ZoomSearch}
 * @param {L.Map} map The Leaflet map that will be controlled 
 * @param {boolean} [useSearchTypeMenu=false] Use search types menu
 * @fires nyc.ZoomSearch#search
 * @fires nyc.ZoomSearch#geolocate
 * @fires nyc.ZoomSearch#disambiguated
 */
nyc.leaf.ZoomSearch = function(map, useSearchTypeMenu){
	this.map = map;
	nyc.ZoomSearch.apply(this, [useSearchTypeMenu]);
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
		return $(this.map.getContainer()).parent();
	},
	/**
	 * @desc Handle the zoom event triggered by user interaction
	 * @public
	 * @override
	 * @method
	 * @param event The DOM event triggered by the zoom buttons
	 */
	zoom: function(event){
		this.map.setZoom(this.map.getZoom() + ($(event.target).data('zoom-incr') * 1));
	}
};

nyc.inherits(nyc.leaf.ZoomSearch, nyc.ZoomSearch);
