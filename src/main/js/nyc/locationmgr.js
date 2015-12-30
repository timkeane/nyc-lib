var nyc = nyc || {};

/**
 * @desc A class for managing user-specified location information
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.LocationMgr.Options} options Constructor options
 * @fires nyc.Locate#geocode
 * @fires nyc.Locate#geolocation
 */
nyc.LocationMgr = function(options){
	this.controls = options.controls;
	this.locate = options.locate;
	this.locator = options.locator;
	this.autoLocate = options.autoLocate || this.autoLocate;
	this.dialog = new nyc.Dialog();
	this.locate.on(nyc.Locate.EventType.GEOCODE, this.located, this);
	this.locate.on(nyc.Locate.EventType.GEOLOCATION, this.located, this);
	this.locate.on(nyc.Locate.EventType.AMBIGUOUS, this.ambiguous, this);
	this.controls.on(nyc.ZoomSearch.EventType.SEARCH, this.locate.search, this.locate);
	this.controls.on(nyc.ZoomSearch.EventType.GEOLOCATE, this.locate.locate, this.locate);
	this.controls.on(nyc.ZoomSearch.EventType.DISAMBIGUATED, this.located, this);
	this.locateFromQueryString();
};

nyc.LocationMgr.prototype = {
	/**
	 * @private
	 * @member {nyc.ZoomSearch}
	 */
	controls: null,
	/**
	 * @private
	 * @member {nyc.Locate}
	 */
	locate: null,
	/**
	 * @private
	 * @member {nyc.Locator}
	 */
	locator: null,
	/**
	 * @private
	 * @member {nyc.Dialog}
	 */
	dialog: null,
	/**
	 * @private
	 * @member {boolean}
	 */
	autoLocate: false,
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.Ambiguous} data
	 */
	ambiguous: function(data){
		if (data.possible.length){
			this.controls.disambiguate(data);
		}else{
			this.controls.searching(false);
			this.dialog.ok('The location you entered was not understood');
		}
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Locate.Result} data 
	 */
	located: function(data){
		this.controls.val(data.type == nyc.Locate.EventType.GEOLOCATION ? '' : data.name);
		this.locator.zoomLocation(data);
		this.trigger(data.type, data);
	},
	/** 
	 * @private 
	 * @method
	 */
	locateFromQueryString: function(){
		var qstr = document.location.search, args = {};
		try{
			var params = qstr.substr(1).split("&");
			for (var i = 0; i < params.length; i++){
				var p = params[i].split("=");
				args[p[0]] = decodeURIComponent(p[1]);
			}
		}catch(ignore){}
		if (args.address){
			this.locate.search(args.address);
		}else if (this.autoLocate){
			this.locate.locate();
		}
	}
};

nyc.inherits(nyc.LocationMgr, nyc.EventHandling);

/**
 * @desc Object type to hold constructor options for {@link nyc.LocationMgr}
 * @public
 * @typedef {Object}
 * @property {nyc.ZoomSearch} controls The UX controls for user input
 * @property {nyc.Locate} locate The geocoding and geolocation provider
 * @property {nyc.Locator} locator The locator used to manipulate a map
 * @property {boolean} [autoLocate=false] Automatically locate using device geolocation on load
 */
nyc.LocationMgr.Options;

