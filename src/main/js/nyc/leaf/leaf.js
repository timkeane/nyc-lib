var nyc = nyc || {};
/** 
 * @export 
 * @namespace
 */
nyc.leaf = nyc.leaf || {};

/** @external L.LatLng */
/** @external L.LatLngBounds */
/** @external L.Map */
/** @external L.Layer */

/**
 * @desc The approximate bounding box of New York City
 * @export 
 * @public 
 * @const
 * @type {L.LatLngBounds}
 */
nyc.leaf.EXTENT = L.latLngBounds([40.496, -74.257], [40.916, -73.699]);

/**
 * @desc The approximate center point of New York City
 * @export 
 * @public 
 * @const
 * @type {L.LatLng}
 */
nyc.leaf.CENTER = L.latLng([40.7033127, -73.979681]);
