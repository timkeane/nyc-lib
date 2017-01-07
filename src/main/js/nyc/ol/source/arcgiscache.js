var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.source = nyc.ol.source || {};

/**
 * @deprecated
 * @desc Class for source that provides tiles from an ArcGIS Server tile cache
 * @public
 * @class
 * @extends {ol.source.TileImage}
 * @constructor
 * @param {nyc.ol.source.AcrGisCache.Options} options Constructor options
 */
nyc.ol.source.AcrGisCache = function(options){

	ol.source.TileImage.call(this, options);
	
	/** 
	 * @private 
	 * @member {string} 
	 */
	this.imageExtension = options.imageExtension;
	/** 
	 * @private 
	 * @member {string} 
	 */
	this.url = options.url ? options.url : null;
	/** 
	 * @private 
	 * @member {Array<string>} 
	 */
	this.urls = options.urls ? options.urls : [];	
	/** 
	 * @private 
	 * @member {number} 
	 */
	this.urlIdx = 0;
	
	/**
	 * @private
	 * @override
	 * @method
	 * @param {ol.Coordinate} tileCoord
	 * @param {number} pixelRatio
	 * @param {string} projection
	 * @return {string}
	 */
	this.defaultTileUrlFunction = function(tileCoord, pixelRatio, projection) {	
		var z = 'L' + this.pad(tileCoord[0].toString(), 2),
			x = 'C' + this.pad(tileCoord[1].toString(), 8),
			y = 'R' + this.pad((-tileCoord[2] - 1).toString(), 8);
		return this.nextUrl() + z + '/' + y + '/' + x + '.' + this.imageExtension;
	};
	
	/**
	 * @private
	 * @method
	 * @param {string} num
	 * @param {number} len
	 * @param {number} radix
	 * @return {string}
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
	 * @method
	 * @return {string}
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

/**
 * @deprecated
 * @desc Object type to hold constructor options for {@link nyc.ol.source.AcrGisCache}
 * @typedef {Object} 
 * @property {string} imageExtension The image extension for tiles
 * @property {string=} url The base URL for tiles
 * @property {Array<string>=} urls An array of base URLs for tiles
 * @see http://www.openlayers.org/
 */
nyc.ol.source.AcrGisCache.Options;
