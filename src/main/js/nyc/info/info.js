var nyc = nyc || {};

/** 
 * @public 
 * @namespace
 */
nyc.info = nyc.info || {};

/**
 * @desc A class for retrieving proximity information
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @mixes nyc.ReplaceTokens
 * @constructor
 * @fires nyc.info.Info#info
 * @fires nyc.info.Info#proximity
 */
nyc.info.Info = function(){};

nyc.info.Info.prototype = {
	/**
	 * @desc Return all building and tax lot features at a point
	 * @public
	 * @method
	 * @param {nyc.info.Info.PointRequest|nyc.info.Info.BinBblRequest} options
	 */
	info: function(options){
		this.whichInfo(this.getValues(options))
	},
	/**
	 * @desc Return all address features within a buffer of a point
	 * @public
	 * @method
	 * @param {nyc.info.Info.ProximityRequest} options
	 */
	proximity: function(x, y, buffer, epsg){
		this.ajax(nyc.info.Info.PROXIMITY, this.getValues(options));
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.info.Info.PointRequest|nyc.info.Info.BinBblRequest} options
	 */
	whichInfo: function(options){
		if (!options.binOrBbl){
			this.ajax(nyc.info.Info.INFO_POINT_URL, options);
		}else if (options.binOrBbl.length == 7){
			this.ajax(nyc.info.Info.INFO_BIN_URL, options);
		}else{
			this.ajax(nyc.info.Info.INFO_BBL_URL, options);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.info.Info.PointRequest|nyc.info.Info.ProximityRequest} options
	 * @return {Object}
	 */
	getValues: function(options){
		var buffer = nyc.info.Info.BUFFER[options.buffer] || 100;
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
	 * @param {nyc.info.Info.PointRequest|nyc.info.Info.ProximityRequest} options
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
		return url == nyc.info.Info.PROXIMITY_URL ? 
				nyc.info.Info.EventType.PROXIMITY : nyc.info.Info.EventType.INFO;
	}
};

nyc.inherits(nyc.info.Info, nyc.EventHandling);
nyc.inherits(nyc.info.Info, nyc.ReplaceTokens);

/**
 * @desc Valid buffer distances in feet for address proximity searches
 * @public
 * @enum {number}
 */
nyc.info.Info.BUFFER = {
	/**
	 * @desc 50 feet
	 */
	50: 50,
	/**
	 * @desc 100 feet
	 */
	100: 100,
	/**
	 * @desc 200 feet
	 */
	200: 200,
	/**
	 * @desc 400 feet
	 */
	400: 400
};

/**
 * @desc Enumeration for proximity and info types
 * @public
 * @enum {string}
 */
nyc.info.Info.EventType = {
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
 * @event nyc.info.Info#proximity
 * @type {Object}
 */

/**
 * @desc The result of a info request
 * @event nyc.info.Info#info
 * @type {Object}
 */

/**
 * @desc Object type to hold options for {@link nyc.info.Info#proximity}
 * @public
 * @typedef {Object}
 * @property {Array<number>} coordinates Coordinates
 * @property {nyc.info.Info.BUFFER} [buffer=100] The buffer distance in feet  
 * @property {string} [projection=EPSG:900913] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that recieves GeoJSON FeatureCollection 
 */
nyc.info.Info.ProximityRequest;

/**
 * @desc Object type to hold options for {@link nyc.info.Info#info}
 * @public
 * @typedef {Object}
 * @property {Array<number>} coordinates Coordinates
 * @property {string} [projection=EPSG:900913] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that recieves GeoJSON FeatureCollection 
 */
nyc.info.Info.PointRequest;

/**
 * @desc Object type to hold options for {@link nyc.info.Info#info}
 * @public
 * @typedef {Object}
 * @property {string} binOrBbl A valid BIN or BBL 
 * @property {string} [projection=EPSG:900913] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that receives GeoJSON FeatureCollection 
 */
nyc.info.Info.BinBblRequest;

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Info.INFO_POINT_URL = 'http://10.155.206.37/info/epsg:${epsg}/coord/${x}/${y}';
/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Info.INFO_BIN_URL = 'http://10.155.206.37/info/epsg:${epsg}/bin/${binOrBbl}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Info.INFO_BBL_URL = 'http://10.155.206.37/info/epsg:${epsg}/bbl/${binOrBbl}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Info.PROXIMITY_URL = 'http://10.155.206.37/proximity/address/${buffer}:feet/epsg:${epsg}/${x}/${y}';

