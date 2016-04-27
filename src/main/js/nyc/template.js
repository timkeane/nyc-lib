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
 * @desc Facility icon configuration for {@link nyc.template.facility.Type} or {@link nyc.template.facility.MapConfig}
 * @public
 * @typedef {Object}
 * @property {string=} url URL to a square icon image
 * @property {string} [stroke=rgba(0,0,0,1)] A stroke color for the pin icon if no URL is specified
 * @property {string=} [fill=rgba(0,0,0,0.5)] A fill color for the pin icon if no URL is specified
 * @property {number} [size=64] The width of the icon image if a URL is specified
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
 * @desc Map configuration for templated facility map. Either xCol and yCol or a geomParser are required.
 * @public
 * @typedef {Object}
 * @property {string} url URL to a facility CSV file
 * @property {string=} xCol Name of the CSV column containing X coordinate or longitude of facility location. Either xCol and yCol or a geomParser are required.
 * @property {string=} yCol Name of the CSV column containing Y coordinate or latitude of facility location. Either xCol and yCol or a geomParser are required.
 * @property {Function(Array<Object>)=} geomParser A function to parse a point from a CSV row. Either xCol and yCol or a geomParser are required.
 * @property {string=} projection The EPSG code for the coordinate data (if not provided EPSG:4326 will be assumed for longitude and latitude coordinates, otherwise EPSG:2263 will be assumed)
 * @property {string} geoclientAppId A Geoclient application id
 * @property {string} geoclientAppKey A Geoclient API key
 * @property {nyc.template.facility.Icon=} icon An icon to apply to all facility features if icons are not specified for facility types
 * @property {boolean} [autoLocate=false] Automatically locate using device geolocation
 * @property {string} [selectionColor=rgba(255,255,0,0.5)] Color for highlighting selected facilities
 * @property {function():(string|Element|JQuery)} [htmlRow] A function where 'this' is an instance of ol.Feature, and returns an HTML table row - exclude to eliminate tabular display of facilities
 * @property {function(Object<string, Object>):boolean} [click] A function that takes an {(Object<string, Object>} argument to call when a facility is clicked on the map or in the table
 * @property {string=} css URL to custom CSS
 * @property {nyc.template.facility.Types=} facilityTypes Facility types mapped by the type value from the facility CSV
 */
nyc.template.facility.MapConfig;
