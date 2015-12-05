/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.ol = nyc.ol || {};
/** @export */
nyc.ol.source = nyc.ol.source || {};

/**
 * @typedef {olx.source.TileImageOptions}
 * @property {string} imageExtension
 * @property {(string|undefined)} url
 * @property {(Array.<string>|undefined)} urls
 */
nyc.ol.source.AcrGisCacheOptions;

/**
 * Class for sources providing tiles from an ArcGIS Server tile cache.
 * @export
 * @constructor
 * @extends {ol.source.TileImage}
 * @param {nyc.ol.source.AcrGisCacheOptions} options ArcGIS Server tile cache options.
 */
nyc.ol.source.AcrGisCache = function(options){

	ol.source.TileImage.call(this, options);
	
	/** @private */
	this.imageExtension = options.imageExtension;
	/** @private */
	this.url = options.url ? options.url : null;
	/** @private */
	this.urls = options.urls ? options.urls : [];	
	/** @private */
	this.urlIdx = 0;
	
	/**
	 * @private
	 * @param {ol.Coordinate} tileCoord
	 * @param {number} pixelRatio
	 * @param {ol.proj.Projection} projection
	 * @return {string} url
	 */
	this.defaultTileUrlFunction = function(tileCoord, pixelRatio, projection) {	
		var z = 'L' + this.pad(tileCoord[0].toString(), 2),
			x = 'C' + this.pad(tileCoord[1].toString(), 8),
			y = 'R' + this.pad((-tileCoord[2] - 1).toString(), 8);
		return this.nextUrl() + z + '/' + y + '/' + x + '.' + this.imageExtension;
	};
	
	/**
	 * @private
	 * @param {string} num
	 * @param {number} len
	 * @param {number} radix
	 * @return {string} padded
	 */
	this.pad = function(num, len) {
		var str = Number(num).toString(16);
		while (str.length < len) {
			str = '0' + str;
		}
		return str;
	};
	
	/**
	 * @private
	 * @return {string} url
	 */
	this.nextUrl = function(){
		if (this.urls.length){
			this.urlIdx = this.urlIdx < this.urls.length - 1 ? (this.urlIdx + 1) : 0;
			return this.urls[this.urlIdx] + '/';
		}else{
			return this.url + '/';
		}
	};

	this.tileUrlFunction = options.tileUrlFunction || this.defaultTileUrlFunction;
};

ol.inherits(nyc.ol.source.AcrGisCache, ol.source.TileImage);

