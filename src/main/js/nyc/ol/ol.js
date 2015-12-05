/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.ol = nyc.ol || {};

/**
 * @const
 * @type {ol.extent}
 */
nyc.ol.EXTENT = [912090, 119053, 1068317, 273931];

/**
 * @const
 * @type {ol.Coordinate}
 */
nyc.ol.CENTER = [990203, 196492];

/**
 * @export
 * @typedef {Object}
 * @property {ol.Feature} feature
 * @property {string} wkt
 */
nyc.ol.Feature;

/**
 * @export
 * @typedef {Object}
 * @property {nyc.ol.Feature} feature
 * @property {string} type
 */
nyc.ol.FeatureEvent;

/**
 * @export
 * @enum {string}
 */
nyc.ol.FeatureEventType = {
	ADD: 'addfeature',
	CHANGE: 'changefeature',
	REMOVE: 'removefeature'
};