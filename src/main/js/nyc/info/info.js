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
	 * @desc Return all featues of the specified layer within a the specified distance of a point
	 * @public
	 * @method
	 * @param {nyc.info.Info.NearestRequest} options
	 */
	nearest: function(options){
		this.ajax(nyc.info.Info.NEAREST_URL, this.getValues(options));
	},
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
	 * @desc Return all address features within a distance of a point
	 * @public
	 * @method
	 * @param {nyc.info.Info.ProximityRequest} options
	 */
	proximity: function(x, y, distance, epsg){
		this.ajax(nyc.info.Info.PROXIMITY_URL, this.getValues(options));
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
		var coordinates = options.coordinates || []; 
		var projection = options.projection || 'EPSG:900913';
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
	 * @param {nyc.info.Info.PointRequest|nyc.info.Info.ProximityRequest} options
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
		if (url == nyc.info.Info.PROXIMITY_URL){
			return nyc.info.Info.EventType.PROXIMITY
		}
		if (url == nyc.info.Info.NEAREST_URL){
			return nyc.info.Info.EventType.NEAREST
		}
		return nyc.info.Info.EventType.INFO;
	}
};

nyc.inherits(nyc.info.Info, nyc.EventHandling);
nyc.inherits(nyc.info.Info, nyc.ReplaceTokens);

/**
 * @desc Valid distances for address proximity searches
 * @public
 * @enum {string}
 */
nyc.info.Info.PROXIMITY_DISTANCE = {
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
nyc.info.Info.NEAREST_DISTANCE = {
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
nyc.info.Info.EventType = {
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
 * @property {nyc.info.Info.PROXIMITY_DISTANCE} [distance=100:feet] The distance  
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
 * @desc Object type to hold options for {@link nyc.info.Info#nearest}
 * @public
 * @typedef {Object}
 * @property {Array<number>} coordinates Coordinates
 * @property {string} namespace The namespace for the layer 
 * @property {string} layer The layer name 
 * @property {nyc.info.Info.PROXIMITY_DISTANCE} [distance=1000:feet] The distance  
 * @property {string} [projection=EPSG:900913] The projection of input coordinates and output features 
 * @property {function(Object)=} callback Callback function that recieves GeoJSON FeatureCollection 
 */
nyc.info.Info.NearestRequest;

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Info.INFO_POINT_URL = 'https://10.155.206.37/info/epsg:${epsg}/coord/${x}/${y}';
/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Info.INFO_BIN_URL = 'https://10.155.206.37/info/epsg:${epsg}/bin/${binOrBbl}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Info.INFO_BBL_URL = 'https://10.155.206.37/info/epsg:${epsg}/bbl/${binOrBbl}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Info.PROXIMITY_URL = 'https://10.155.206.37/proximity/address/${distance}/epsg:${epsg}/${x}/${y}';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.info.Info.NEAREST_URL = 'https://10.155.206.37/nearest/${distance}/${namespace}:${layer}/epsg:${epsg}/${x}/${y}';

