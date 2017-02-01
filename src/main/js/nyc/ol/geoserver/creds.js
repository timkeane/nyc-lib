var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.geoserver = nyc.ol.geoserver || {};

/**
 * @desc A class that intercepts XMLHttpRequests and set a GeoServer-specific header for authentication
 * @protected
 * @class
 * @constructor
 * @fires nyc.ol.geoserver.Creds#fail
 */
nyc.ol.geoserver.Creds = function(){
	this.servers = {};
};

nyc.ol.geoserver.Creds.prototype = {
	/*
	 * @private
	 * @member {Object<string, nyc.ol.geoserver.Creds.Credentials>}
	 */
	servers: null,
	/**
	 * @desc Set credentials for a specific GeoServer instance
	 * @public
	 * @method
	 * @param {string} server A GeoServer endpoint
	 * @param {nyc.ol.geoserver.Creds.Credentials} credentials The user name and password
	 */ 
	setCredentials: function(server, credentials){
		this.user = credentials.user;
		this.password = credentials.password;
		if (!nyc.ol.geoserver.Creds.servers){
			nyc.ol.geoserver.Creds.servers = {};
			nyc.ol.geoserver.Creds.xhrOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = nyc.ol.geoserver.Creds.xhrOpenWithCreds;
		}
		this.servers[server] = credentials;
	}
};

/**
 * @private
 * @static
 * @method
 */ 
nyc.ol.geoserver.Creds.xhrOpenWithCreds = function(){
	var servers = nyc.ol.geoserver.Creds.INSTANCE.servers;
	nyc.ol.geoserver.Creds.xhrOpen.apply(this, arguments);
	for (var svr in servers){
		if (arguments[1].indexOf(svr) == 0){
			var creds = servers[svr];
			this.setRequestHeader('X-Credentials', 'private-user=' + creds.user + '&private-pw=' + creds.password);
			nyc.ol.geoserver.Creds.modifyReadyStateChanged(this);
		}
	}
};

/**
 * @private
 * @static
 * @method
 * @param {XMLHttpRequest} xhr
 */ 
nyc.ol.geoserver.Creds.modifyReadyStateChanged = function(xhr){
	var chg = xhr.onreadystatechange;
	xhr.onreadystatechange = function(){
		if (chg){
			chg();
		}
		if (this.readyState == XMLHttpRequest.DONE && this.status != 200){
			nyc.ol.geoserver.Creds.INSTANCE.trigger(nyc.ol.geoserver.Creds.EventType.FAIL, this);
		}
	};
};

nyc.inherits(nyc.ol.geoserver.Creds, nyc.EventHandling);

/**
 * @private
 * @const
 * @type {nyc.ol.geoserver.Creds}
 */
nyc.ol.geoserver.Creds.INSTANCE;

/** 
 * @desc A factory method to get the singleton instance of {@link nyc.ol.geoserver.Creds}
 * @public
 * @function 
 */
nyc.ol.geoserver.Creds.getInstance = function(){
	nyc.ol.geoserver.Creds.INSTANCE = nyc.ol.geoserver.Creds.INSTANCE || new nyc.ol.geoserver.Creds();
	return nyc.ol.geoserver.Creds.INSTANCE;
};

/**
 * @desc Credential event type
 * @public
 * @enum {string}
 */
nyc.ol.geoserver.Creds.EventType = {
	/**
	 * @desc Fail event type
	 */
	FAIL: 'fail'
};

/**
 * @desc The result of failed GeoServer authentication
 * @event nyc.ol.geoserver.Creds#fail
 * @type {XMLHttpRequest}
 */

/**
 * @desc Object type to hold user name and password
 * @public
 * @typedef {Object}
 * @property {string} user The user name
 * @property {string} password The password
 */
nyc.ol.geoserver.Creds.Credentials;

/**
 * @private
 * @type {function()}
 */
nyc.ol.geoserver.Creds.xhrOpen;