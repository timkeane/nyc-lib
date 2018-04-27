var nyc = nyc || {};
/** 
 * @public 
 * @namespace
 */
nyc.leaf = nyc.leaf || {};

/** 
 * @external L.LatLng 
 * @see http://leafletjs.com/reference.html
 */
/** 
 * @external L.LatLngBounds 
 * @see http://leafletjs.com/reference.html
 */
/** 
 * @external L.Map 
 * @see http://leafletjs.com/reference.html
 */
/** 
 * @external L.Layer 
 * @see http://leafletjs.com/reference.html
 */
/** 
 * @external L.GeoJson 
 * @see http://leafletjs.com/reference.html
 */

/**
 * @desc The approximate bounding box of New York City
 * @public 
 * @const
 * @type {L.LatLngBounds}
 */
nyc.leaf.EXTENT = L.latLngBounds([40.496, -74.257], [40.916, -73.699]);

/**
 * @desc The approximate center point of New York City
 * @public 
 * @const
 * @type {L.LatLng}
 */
nyc.leaf.CENTER = L.latLng([40.7033127, -73.979681]);
