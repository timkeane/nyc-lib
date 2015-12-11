var nyc = nyc || {};
/** 
 * @public 
 * @namespace
 */
nyc.ol = nyc.ol || {};

/** 
 * @external ol.Coordinate 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.Extent 
 * @see http://openlayers.org/ 
 */
/**
 *  @external ol.Feature 
 *  @see http://openlayers.org/ 
 */
/** 
 * @external ol.Map 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.MapBrowserEvent 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.proj.Projection 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.source.Vector 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.source.VectorEvent 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.layer.Tile 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.Pixel 
 * @see http://openlayers.org/ 
 */
/** 
 * @external olx.source.VectorOptions 
 * @see http://openlayers.org/ 
 */
/** 
 * @external olx.source.GeoJSONOptions 
 * @see http://openlayers.org/ 
 */
/** 
 * @external olx.OverlayOptions 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.style.Style 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.format.GeoJSON 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.format.WKT 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.source.TileImage 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.interaction.Interaction 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.interaction.Pointer 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.interaction.Pointer 
 * @see http://openlayers.org/ 
 */
	
/**
 * @public 
 * @const
 * @type {ol.Extent}
 */
nyc.ol.EXTENT = [912090, 119053, 1068317, 273931];

/**
 * @const
 * @type {ol.Coordinate}
 */
nyc.ol.CENTER = [990203, 196492];

/**
 * @public
 * @typedef {Object}
 * @property {ol.Feature} feature
 * @property {string} wkt
 */
nyc.ol.Feature;

/**
 * @public
 * @typedef {Object}
 * @property {nyc.ol.Feature} feature
 * @property {string} type
 */
nyc.ol.FeatureEvent;

/**
 * @public
 * @enum {string}
 */
nyc.ol.FeatureEventType = {
	ADD: 'addfeature',
	CHANGE: 'changefeature',
	REMOVE: 'removefeature'
};