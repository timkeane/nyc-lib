var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.geoserver = nyc.ol.geoserver || {};

/**
 * @desc A class that intercepts XMLHttpRequests and set a GeoServer-specific header for authentication
 * @public
 * @class
 * @constructor
 * @fires nyc.ol.geoserver.Creds#fail
 */
nyc.ol.geoserver.Creds = function(){};

nyc.ol.geoserver.Creds.prototype = {
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
		nyc.ol.geoserver.Creds.servers[server] = this;
	}
};

/**
 * @private
 * @static
 * @method
 */ 
nyc.ol.geoserver.Creds.xhrOpenWithCreds = function(){
	nyc.ol.geoserver.Creds.xhrOpen.apply(this, arguments);
	for (var svr in nyc.ol.geoserver.Creds.servers){
		if (arguments[1].indexOf(svr) == 0){
			var creds = nyc.ol.geoserver.Creds.servers[svr];
			this.setRequestHeader('X-Credentials', 'private-user=' + creds.user + '&private-pw=' + creds.password);
			nyc.ol.geoserver.Creds.modifyReadyStateChanged(this, creds);
		}
	}
};

/**
 * @private
 * @static
 * @method
 * @param {XMLHttpRequest} xhr
 * @param {nyc.ol.geoserver.Creds} creds
 */ 
nyc.ol.geoserver.Creds.modifyReadyStateChanged = function(xhr, creds){
	var chg = xhr.onreadystatechange;
	xhr.onreadystatechange = function(){
		if (chg){
			chg();
		}
		if (this.readyState == XMLHttpRequest.DONE && this.status != 200){
			creds.trigger('fail', this);
		}
	};
};

nyc.inherits(nyc.ol.geoserver.Creds, nyc.EventHandling);

nyc.ol.geoserver.Creds.servers;
nyc.ol.geoserver.Creds.xhrOpen;

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