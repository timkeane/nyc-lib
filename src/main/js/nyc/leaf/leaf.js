var nyc = nyc || {};
/** 
 * @public 
 * @namespace
 */
nyc.leaf = nyc.leaf || {};

/** 
 * @external L.LatLng 
 * @see http://leafletjs.com/
 */
/** 
 * @external L.LatLngBounds 
 * @see http://leafletjs.com/
 */
/** 
 * @external L.Map 
 * @see http://leafletjs.com/
 */
/** 
 * @external L.Layer 
 * @see http://leafletjs.com/
 */
/** 
 * @external L.GeoJson 
 * @see http://leafletjs.com/
 */

/**
 * @deprecated
 * @desc The  bounds of New York City
 * @public 
 * @const
 * @type {L.LatLngBounds}
 */
nyc.leaf.EXTENT = L.latLngBounds([40.496, -74.257], [40.916, -73.699]);

/**
 * @deprecated
 * @desc The center of New York City
 * @public 
 * @const
 * @type {L.LatLng}
 */
nyc.leaf.CENTER = L.latLng([40.7033127, -73.979681]);
