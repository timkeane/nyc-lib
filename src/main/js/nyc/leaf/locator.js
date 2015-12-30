var nyc = nyc || {};
nyc.leaf = nyc.leaf || {};

/**
 * @desc An class for managing map location
 * @public
 * @class
 * @implements {nyc.Locator}
 * @constructor
 * @param {nyc.leaf.Locator.Options} options Constructor options
 */
nyc.leaf.Locator = function(options){
	this.map = options.map;
	this.icon = options.icon;
	this.style = options.style;
	this.zoom = options.zoom !== undefined ? options.zoom : nyc.leaf.Locate.ZOOM_LEVEL;
};

nyc.leaf.Locator.prototype = {
	/**
	 * @private
	 * @member {L.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {L.GeoJson|L.Marker}
	 */
	layer: null,
	/**
	 * @private
	 * @member {function(L.GeoJson):Object}
	 */
	style: null,
	/**
	 * @public
	 * @override
	 * @method
	 * @param {nyc.Locate.Result} data The location to which the map will be oriented
	 */
	zoomLocation: function(data){
		var geoJson = data.geoJsonGeometry;
		if (this.layer){
			this.map.removeLayer(this.layer);			
		}
		if (geoJson && geoJson.type != "Point"){
			this.locatedGeoJson(data);
		}else{
			this.locatedCoords(data);
		}
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.Result} data
	 */
	locatedGeoJson: function(data){
		this.layer = L.geoJson(
			{type: 'Feature', geometry: data.geoJsonGeometry}, 
			{style: this.style}
		).addTo(this.map);
		this.map.fitBounds(this.layer.getBounds());
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.Result} data
	 */
	locatedCoords: function(data){
		var coords = data.coordinates;
		coords = [coords[1], coords[0]];
		this.layer = L.marker(coords, {icon: this.icon, title: data.name}).addTo(this.map);
		this.map.setView(coords, nyc.leaf.Locate.ZOOM_LEVEL, {pan: {animate: true}, zoom: {animate: true}});
	}
};

/**
 * @desc Object type to hold constructor options for {@link nyc.leaf.Locator}
 * @public
 * @typedef {Object}
 * @property {L.Map} map The map on which location will be managed
 * @property {L.Icon=} icon The icon with which coordinates will be marked
 * @property {(function(L.GeoJson):Object)=} style The style function for geoJSON geometries that will be displayed
 * @property {number} [zoom={@link nyc.leaf.Locate.ZOOM_LEVEL}] The zoom level used when locating coordinates
 */
nyc.leaf.Locator.Options;
