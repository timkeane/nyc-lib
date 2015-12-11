var nyc = nyc || {};
nyc.leaf = nyc.leaf || {};

/**
 * @export
 * @class
 * @desc Class for providing a set of buttons to zoom and search.
 * @constructor
 * @extends {nyc.ZoomSearch}
 * @param {L.Map} map
 * @param {(boolean|undefined)} useSearchTypeMenu
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
	 * @private
	 * @method
	 * @return {JQuery}
	 */
	container: function(){
		return $(this.map.getContainer()).parent();
	},
	/**
	 * @private
	 * @method
	 * @param {Object} e
	 */
	zoom: function(e){
		this.map.setZoom(this.map.getZoom() + ($(e.target).data('zoom-incr') * 1));
	}
};

nyc.inherits(nyc.leaf.ZoomSearch, nyc.ZoomSearch);