var nyc = nyc || {};

/** 
 * @public 
 * @namespace
 */
nyc.template = nyc.template || {};

/** 
 * @public 
 * @namespace
 */
nyc.template.facility = nyc.template.facility || {};

/**
 * @desc Facility type configuration for {@link nyc.template.facility.Type}
 * @public
 * @typedef {Object}
 * @property {string} url URL to a square icon image
 * @property {number} [size=64] The width of the icon image
 */
nyc.template.facility.Icon;


/**
 * @desc Facility type configuration for {@link nyc.template.facility.Types}
 * @public
 * @typedef {Object}
 * @property {string} name The alias for the coded values in the CSV type column
 * @property {nyc.template.facility.Icon=} icon An icon to display as a map marker for a facility of this type
 */
nyc.template.facility.Type;

/**
 * @desc Facility types configuration for {@link nyc.template.facility.MapConfig}
 * @public
 * @typedef {Object}
 * @property {string} column Name of the CSV column containing the facility type
 * @property {Object<string, nyc.template.facility.Type>=} facilityTypes Facility types mapped by the type value from the facility type column
 */
nyc.template.facility.Types;

/**
 * @desc Map configuration for templated facility map
 * @public
 * @typedef {Object}
 * @property {string} url URL to a facility CSV file
 * @property {string} [xCol=x|X|x_coord|X_COORD] Name of the CSV column containing X coordinate of facility location
 * @property {string} [yCol=y|Y|y_coord|Y_COORD] Name of the CSV column containing Y coordinate of facility location
 * @property {string} geoclientAppId A Geoclient application id
 * @property {string} geoclientAppKey A Geoclient API key
 * @property {boolean} [autoLocate=false] Automatically locate using device geolocation
 * @property {string} [selectionColor=rgba(255,255,0,0.5)] Color for highlighting selected facilities
 * @property {function():(string|Element|JQuery)} htmlRow A function where 'this' is an instance of ol.Feature, and returns an HTML table row
 * @property {function(Object<string, Object>):boolean=} click A function to call when a facility is clicked on the map or in the table
 * @property {string=} css URL to custom CSS
 * @property {nyc.template.facility.Types=} facilityTypes Facility types mapped by the type value from the facility CSV
 */
nyc.template.facility.MapConfig;
