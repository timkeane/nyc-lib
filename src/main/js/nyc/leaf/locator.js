var nyc = nyc || {};
nyc.leaf = nyc.leaf || {};

/**
 * @desc An class for managing map location
 * @public
 * @class
 * @implements {nyc.Locator}
 * @constructor
 * @property {L.Map} map The map on which location will be managed
 * @property {(function(L.GeoJson):Object)=} style The style function for the user-specified locations that will be displayed
 *@property {number} [zoom={@link nyc.leaf.Locate.ZOOM_LEVEL}]  zoom The zoom level used when locating cooordinates
 */
nyc.leaf.Locator = function(map, style, zoom){
	this.map = map;
	this.style = style || this.style;
	this.zoom = zoom !== undefined ? zoom : nyc.leaf.Locate.ZOOM_LEVEL;
};

nyc.leaf.Locator.prototype = {
	/**
	 * @private
	 * @member {L.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {L.Marker|L.GeoJson}
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
		this.layer = L.marker(coords, {style: this.style}).addTo(this.map);
		this.map.setView(coords, nyc.leaf.Locate.ZOOM_LEVEL, {pan: {animate: true}, zoom: {animate: true}});
	}
};
