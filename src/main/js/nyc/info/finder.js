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
 * @fires nyc.info.Finder#info
 * @fires nyc.info.Finder#proximity
 */
nyc.info.Finder = function(){};

nyc.info.Finder.prototype = {
	/**
	 * @desc Return all featues of the specified layer within a the specified distance of a point
	 * @public
	 * @method
	 * @param {nyc.info.Finder.NearestRequest} options
	 */
	nearest: function(options){
		this.ajax(nyc.info.Finder.NEAREST_URL, this.getValues(options));
	},
	/**
	 * @desc Return all building and tax lot features at a point
	 * @public
	 * @method
	 * @param {nyc.info.Finder.PointRequest|nyc.info.Finder.BinBblRequest} options
	 */
	info: function(options){
		this.whichInfo(this.getValues(options))
	},
	/**
	 * @desc Return all address features within a distance of a point
	 * @public
	 * @method
	 * @param {nyc.info.Finder.ProximityRequest} options
	 */
	proximity: function(x, y, distance, epsg){
		this.ajax(nyc.info.Finder.PROXIMITY_URL, this.getValues(options));
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.info.Finder.PointRequest|nyc.info.Finder.BinBblRequest} options
	 */
	whichInfo: function(options){
		if (!options.binOrBbl){
			this.ajax(nyc.info.Finder.INFO_POINT_URL, options);
		}else if (options.binOrBbl.length == 7){
			this.ajax(nyc.info.Finder.INFO_BIN_URL, options);
		}else{
			this.ajax(nyc.info.Finder.INFO_BBL_URL, options);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.info.Finder.PointRequest|nyc.info.Finder.ProximityRequest} options
	 * @return {Object}
	 */
	getValues: function(options){
		var coordinates = options.coordinates || []; 
		var projection = options.projection || 'EPSG:3857';
		var binOrBbl = options.binOrBbl ? options.binOrBbl.trim() : '';
		var distance = options.distance || '100:feet';
		if (options.layer) {
			distance = options.distance || '1000:feet';
		}
		if ((binOrBbl.length != 7 && binOrBbl.length != 10) && (isNaN(coordinates[0]) || isNaN(coordinates[1]))){
			throw 'invalid options';
		}
		return {
			namespace: options.namespace,
			layer: options.layer,
			distance: distance,
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
	 * @param {nyc.info.Finder.PointRequest|nyc.info.Finder.ProximityRequest} options
	 */
	ajax: function(url, options){
		var me = this;
		$.ajax({
			url: me.replace(url, options),
			success: function(data){
				data.request = options;
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
		if (url == nyc.info.Finder.PROXIMITY_URL){
			return nyc.info.Finder.EventType.PROXIMITY
		}
		if (url == nyc.info.Finder.NEAREST_URL){
			return nyc.info.Finder.EventType.NEAREST
		}
		return nyc.info.Finder.EventType.INFO;
	}
};

nyc.inherits(nyc.info.Finder, nyc.EventHandling);
nyc.inherits(nyc.info.Finder, nyc.ReplaceTokens);

/**
 * @desc Valid distances for address proximity searches
 * @public
 * @enum {string}
 */
nyc.info.Finder.PROXIMITY_DISTANCE = {
		/**
		 * @desc 50 feet
		 */
		'50ft': '50:feet',
		/**
		 * @desc 100 feet
		 */
		'100ft': '100:feet',
		/**
		 * @desc 200 feet
		 */
		'200ft': '200:feet',
		/**
		 * @desc 400 feet
		 */
		'400ft': '400:feet',
		/**
		 * @desc 15 meters
		 */
		'15m': '15:meters',
		/**
		 * @desc 30 meters
		 */
		'30m': '30:meters',
		/**
		 * @desc 60 meters
		 */
		'60m': '60:meters',
		/**
		 * @desc 120 meters
		 */
		'120m': '120:meters'
};

/**
 * @desc Valid distances for nearest searches
 * @public
 * @enum {number}
 */
nyc.info.Finder.NEAREST_DISTANCE = {
		/**
		 * @desc 500 feet
		 */
		'500ft': '500:feet',
		/**
		 * @desc 1000 feet
		 */
		'1000ft': '1000:feet',
		/**
		 * @desc 1 mile
		 */
		'1mi': '5280:feet',
		/**
		 * @desc 5 miles
		 */
		'5mi': '26400:feet',
		/**
		 * @desc 150 meters
		 */
		'150m': '150:meters',
		/**
		 * @desc 300 meters
		 */
		'300m': '300:meters',
		/**
		 * @desc 1.5 kilometers
		 */
		'1.5km': '1500:meters',
		/**
		 * @desc 8 kilometers
		 */
		'8km': '8000:meters'
};

/**
 * @desc Enumeration for proximity and info types
 * @public
 * @enum {string}
 */
nyc.info.Finder.EventType = {
	/**
	 * @desc The info event type
	 */
	INFO: 'info',
	/**
	 * @desc The proximity event type
	 */
	PROXIMITY: 'proximity',
	/**
	 * @desc The nearest event type
	 */
	NEAREST: 'nearest'
};

/**
 * @desc The result of a proximity request
 * @event nyc.info.Finder#proximity
 * @type {Object}
 */

/**
 * @desc The result of a info request
 * @event nyc.info.Finder#info
 * @type {Object}
 */

/**
 * @desc Object type to hold options for {@link nyc.info.Finder#proximity}
 * @public
 * @typedef {Object}
 * @property {Array<number>} coordinates Coordinates
 * @property {nyc.info.Finder.PROXIMITY_DISTANCE} [distance=100:feet] The distance  
 * @property {string} [projection=EPSG:3857] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that recieves GeoJSON FeatureCollection 
 */
nyc.info.Finder.ProximityRequest;

/**
 * @desc Object type to hold options for {@link nyc.info.Finder#info}
 * @public
 * @typedef {Object}
 * @property {Array<number>} coordinates Coordinates
 * @property {string} [projection=EPSG:3857] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that recieves GeoJSON FeatureCollection 
 */
nyc.info.Finder.PointRequest;

/**
 * @desc Object type to hold options for {@link nyc.info.Finder#info}
 * @public
 * @typedef {Object}
 * @property {string} binOrBbl A valid BIN or BBL 
 * @property {string} [projection=EPSG:3857] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that receives GeoJSON FeatureCollection 
 */
nyc.info.Finder.BinBblRequest;

/**
 * @desc Object type to hold options for {@link nyc.info.Finder#nearest}
 * @public
 * @typedef {Object}
 * @property {Array<number>} coordinates Coordinates
 * @property {string} namespace The namespace for the layer 
 * @property {string} layer The layer name 
 * @property {nyc.info.Finder.PROXIMITY_DISTANCE} [distance=1000:feet] The distance  
 * @property {string} [projection=EPSG:3857] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that receives GeoJSON FeatureCollection 
 */
nyc.info.Finder.NearestRequest;

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Finder.INFO_POINT_URL = '/info/epsg:${epsg}/coord/${x}/${y}';
/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Finder.INFO_BIN_URL = '/info/epsg:${epsg}/bin/${binOrBbl}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Finder.INFO_BBL_URL = '/info/epsg:${epsg}/bbl/${binOrBbl}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Finder.PROXIMITY_URL = '/proximity/address/${distance}/epsg:${epsg}/${x}/${y}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Finder.NEAREST_URL = '/nearest/${distance}/${namespace}:${layer}/epsg:${epsg}/${x}/${y}';

