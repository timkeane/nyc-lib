var nyc = nyc || {};

/**
 * @desc A class for retrieving proximity information
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @mixes nyc.ReplaceTokens
 * @constructor
 * @param {nyc.Geoclient} geoclient A GeoClient instance
 * @fires nyc.ProximityInfo#info
 * @fires nyc.ProximityInfo#proximity
 */
nyc.ProximityInfo = function(){};

nyc.ProximityInfo.prototype = {
	/**
	 * @desc Return all building and tax lot features at a point
	 * @public
	 * @method
	 * @param {nyc.ProximityInfo.InfoPointOptions|nyc.ProximityInfo.InfoBinBblOptions} options
	 */
	info: function(options){
		this.whichInfo(this.getValues(options))
	},
	/**
	 * @desc Return all address features within a buffer of a point
	 * @public
	 * @method
	 * @param {nyc.ProximityInfo.ProximityOptions} options
	 */
	proximity: function(x, y, buffer, epsg){
		this.ajax(nyc.ProximityInfo.PROXIMITY, this.getValues(options));
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.ProximityInfo.InfoPointOptions|nyc.ProximityInfo.InfoBinBblOptions} options
	 */
	whichInfo: function(options){
		if (!options.binOrBbl){
			this.ajax(nyc.ProximityInfo.INFO_POINT_URL, options);
		}else if (options.binOrBbl.length == 7){
			this.ajax(nyc.ProximityInfo.INFO_BIN_URL, options);
		}else{
			this.ajax(nyc.ProximityInfo.INFO_BBL_URL, options);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.ProximityInfo.InfoPointOptions|nyc.ProximityInfo.ProximityOptions} options
	 * @return {Object}
	 */
	getValues: function(options){
		var buffer = nyc.ProximityInfo.BUFFER[options.buffer] || 100;
		var coordinates = options.coordinates || []; 
		var projection = options.projection || 'EPSG:900913';
		var binOrBbl = options.binOrBbl ? options.binOrBbl.trim() : '';
		if ((binOrBbl.length != 7 && binOrBbl.length != 10) && (isNaN(coordinates[0]) || isNaN(coordinates[1]))){
			throw 'invalid options';
		}
		return {
			buffer: buffer,
			binOrBbl: binOrBbl,
			epsg: projection.split(':')[1],
			x: coordinates[0],
			y: coordinates[1],
			callback: options.callback
		}
	},
	/**
	 * @private
	 * @method
	 * @param {string} url
	 * @param {nyc.ProximityInfo.InfoPointOptions|nyc.ProximityInfo.ProximityOptions} options
	 */
	ajax: function(url, options){
		var me = this;
		$.ajax({
			url: me.replace(url, options),
			success: function(data){
				if (options.callback){
					options.callback(data);
				}
				me.trigger(me.eventType(url), data);
			}
		})
	},
	/**
	 * @private
	 * @method
	 * @param {string} url
	 */
	eventType: function(url){
		return url == nyc.ProximityInfo.PROXIMITY_URL ? 
				nyc.ProximityInfo.EventType.PROXIMITY : nyc.ProximityInfo.EventType.INFO;
	}
};

nyc.inherits(nyc.ProximityInfo, nyc.EventHandling);
nyc.inherits(nyc.ProximityInfo, nyc.ReplaceTokens);

/**
 * @desc Valid buffer distances for address proximity searches
 * @public
 * @enum {number}
 */
nyc.ProximityInfo.BUFFER = {
	50: 50,
	100: 100,
	200: 200,
	400: 400
};

/**
 * @desc Enumeration for proximity and info types
 * @public
 * @enum {string}
 */
nyc.ProximityInfo.EventType = {
	/**
	 * @desc The info event type
	 */
	INFO: 'info',
	/**
	 * @desc The proximity event type
	 */
	PROXIMITY: 'proximity'
};

/**
 * @desc The result of a proximity request
 * @event nyc.ProximityInfo#proximity
 * @type {Object}
 */

/**
 * @desc The result of a info request
 * @event nyc.ProximityInfo#info
 * @type {Object}
 */

/**
 * @desc Object type to hold options for {@link nyc.ProximityInfo#proximity}
 * @public
 * @typedef {Object}
 * @property {Array<number>} coordinates Coordinates
 * @property {nyc.ProximityInfo.BUFFER} [buffer=100] The buffer distance in feet  
 * @property {string} [projection="EPSG:900913"] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that recieves GeoJSON FeatureCollection 
 */
nyc.ProximityInfo.ProximityOptions;

/**
 * @desc Object type to hold options for {@link nyc.ProximityInfo#info}
 * @public
 * @typedef {Object}
 * @property {Array<number>} coordinates Coordinates
 * @property {string} [projection="EPSG:900913"] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that recieves GeoJSON FeatureCollection 
 */
nyc.ProximityInfo.InfoPointOptions;

/**
 * @desc Object type to hold options for {@link nyc.ProximityInfo#info}
 * @public
 * @typedef {Object}
 * @property {string} binOrBbl A valid BIN or BBL 
 * @property {string} [projection="EPSG:900913"] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that receives GeoJSON FeatureCollection 
 */
nyc.ProximityInfo.InfoBinBblOptions;

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ProximityInfo.INFO_POINT_URL = 'http://10.155.206.37/info/epsg:${epsg}/coord/${x}/${y}';
/**
 * @private
 * @const
 * @type {string}
 */
nyc.ProximityInfo.INFO_BIN_URL = 'http://10.155.206.37/info/epsg:${epsg}/bin/${binOrBbl}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ProximityInfo.INFO_BBL_URL = 'http://10.155.206.37/info/epsg:${epsg}/bbl/${binOrBbl}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ProximityInfo.PROXIMITY_URL = 'http://10.155.206.37/proximity/address/${buffer}:feet/epsg:${epsg}/${x}/${y}';

