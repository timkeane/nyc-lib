var nyc = nyc || {};
nyc.ol = nyc.ol || {};
/** 
 * @public 
 * @namespace
 */
nyc.ol.layer = nyc.ol.layer || {};

/**
 * @desc Class that extends ol.layer.Tile to create the NYC base map layer
 * @public
 * @class
 * @extends {ol.layer.Tile}
 * @constructor
 * @param {Object} [options={@link nyc.ol.layer.BaseLayer.DEFAULT_OPTIONS}] Constructor options
 * @see http://www.openlayers.org/
 */
nyc.ol.layer.BaseLayer = function(options){
	ol.layer.Tile.call(this, options || nyc.ol.layer.BaseLayer.DEFAULT_OPTIONS);
};

ol.inherits(nyc.ol.layer.BaseLayer, ol.layer.Tile);

/**
 * @desc Resolutions for zoom levels 0 - 10 
 * @public
 * @const
 * @type {Array<number>}
 */
nyc.ol.layer.BaseLayer.RESOLUTIONS = [434.027777777778, 303.819444444444, 222.222222222222, 111.111111111111, 55.5555555555556, 27.7777777777778, 13.8888888888889, 6.94444444444444, 3.47222222222222, 1.73611111111111, 0.868055555555556];

/**
 * @desc The origin of the New York City base map tiles 
 * @public
 * @const
 * @type {ol.Coordinate}
 */
nyc.ol.layer.BaseLayer.ORIGIN = [700000, 440000];

/**
 * @desc The extent of the New York City base map tiles 
 * @public
 * @const
 * @type {ol.Extent}
 */
nyc.ol.layer.BaseLayer.EXTENT = [700000, -4444.4444444447, 1366666.6666667, 440000];

/**
 * @desc The size of the New York City base map tiles 
 * @public
 * @const
 * @type {number}
 */
nyc.ol.layer.BaseLayer.TILE_SIZE = 512;

/**
 * @desc The URL of the New York City base map tiles 
 * @public
 * @const
 * @type {Array<string>}
 */
nyc.ol.layer.BaseLayer.BASIC_URLS = ['//maps.nyc.gov/gis/data/tiles/basic/', '//maps1.nyc.gov/gis/data/tiles/basic/', '//maps2.nyc.gov/gis/data/tiles/basic/', '//maps3.nyc.gov/gis/data/tiles/basic/'];

/**
 * @desc The URL of the New York City ortho image tiles 
 * @public
 * @const
 * @type {Array<string>}
 */
nyc.ol.layer.BaseLayer.ORTHO_URLS = ['//maps.nyc.gov/gis/data/tiles/orthosLatest/', '//maps1.nyc.gov/gis/data/tiles/orthosLatest/', '//maps2.nyc.gov/gis/data/tiles/orthosLatest/', '//maps3.nyc.gov/gis/data/tiles/orthosLatest/'];

/**
 * @desc The file extension of the New York City base map tiles 
 * @public
 * @type {string}
 */
nyc.ol.layer.BaseLayer.IMAGE_EXTENSION = 'jpg';

/**
 * @desc The tile options used to create the New York City base map tile layer
 * @public
 * @const
 * @type {Object}
 */
nyc.ol.layer.BaseLayer.BASIC_OPTIONS = {
	source: new nyc.ol.source.AcrGisCache({
		crossOrigin: 'Anonymous',
		urls: nyc.ol.layer.BaseLayer.BASIC_URLS,
		imageExtension : nyc.ol.layer.BaseLayer.IMAGE_EXTENSION,
		projection: 'EPSG:2263',
		tileGrid: new ol.tilegrid.TileGrid({
			origin: nyc.ol.layer.BaseLayer.ORIGIN,
			extent: nyc.ol.layer.BaseLayer.EXTENT,
			resolutions: nyc.ol.layer.BaseLayer.RESOLUTIONS,
			tileSize: nyc.ol.layer.BaseLayer.TILE_SIZE
		})
	})
};

/**
 * @desc The default tile options used to create the New York City base map tile layer
 * @public
 * @const
 * @type {Object}
 * @see http://www.openlayers.org/
 */
nyc.ol.layer.BaseLayer.DEFAULT_OPTIONS = nyc.ol.layer.BaseLayer.BASIC_OPTIONS;

/**
 * @desc The tile options used to create the New York City ortho image tile layer
 * @public
* @const
* @type {Object}
 * @see http://www.openlayers.org/
*/
nyc.ol.layer.BaseLayer.ORTHO_OPTIONS = {
	source: new nyc.ol.source.AcrGisCache({
		crossOrigin: 'Anonymous',
		urls: nyc.ol.layer.BaseLayer.ORTHO_URLS,
		imageExtension : nyc.ol.layer.BaseLayer.IMAGE_EXTENSION,
		projection: 'EPSG:2263',
		tileGrid: new ol.tilegrid.TileGrid({
			origin: nyc.ol.layer.BaseLayer.ORIGIN,
			extent: nyc.ol.layer.BaseLayer.EXTENT,
			resolutions: nyc.ol.layer.BaseLayer.RESOLUTIONS,
			tileSize: nyc.ol.layer.BaseLayer.TILE_SIZE
		})
	})
};



