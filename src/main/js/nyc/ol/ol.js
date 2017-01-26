var nyc = nyc || {};
/** 
 * @public 
 * @namespace
 */
nyc.ol = nyc.ol || {};

/** 
 * @external ol.format.Feature 
 * @see http://openlayers.org/ 
 */
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
 * @external ol.source.Vector 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.source.VectorEvent 
 * @see http://openlayers.org/ 
 */
/** 
 * @external ol.layer.Layer 
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
 * @external ol.render.Event 
 * @see http://openlayers.org/ 
 */

/**
 * @public
 * @deprecated
 * @const
 * @type {ol.Extent}
 */
nyc.ol.EXTENT = [912090, 119053, 1068317, 273931];

/**
 * @const
 * @deprecated
 * @type {ol.Coordinate}
 */
nyc.ol.CENTER = [990203, 196492];

/**
 * @desc Enumeration for feature event types
 * @public
 * @enum {string}
 */
nyc.ol.FeatureEventType = {
	/**
	 * @desc The addfeature event type
	 */
	ADD: 'addfeature',
	/**
	 * @desc The changefeature event type
	 */
	CHANGE: 'changefeature',
	/**
	 * @desc The removefeature event type
	 */
	REMOVE: 'removefeature'
};
