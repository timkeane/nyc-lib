var nyc = nyc || {};
nyc.ol = nyc.ol || {};
/** 
 * @public 
 * @namespace
 */
nyc.ol.geoserver = nyc.ol.geoserver || {};

/**
 * @desc A class that persists features using a GeoServer WFST 
 * @public
 * @class
 * @constructor
 * @param {nyc.ol.geoserver.FeatureTxn.Options} options Constructor options
 * @see http://www.geoserver.org/
 */
nyc.ol.geoserver.FeatureTxn = function(options){
	this.url = options.wfsUrl;
	this.geomColumn = options.geomColumn;
	this.success = options.success;
	this.error = options.error;
	this.format = new ol.format.WFS();
	this.serializer = new XMLSerializer();
	this.options = {
		gmlOptions: {srsName: options.projection},
		featureNS: options.namespace,
		featureType: options.typeName
	};
};

nyc.ol.geoserver.FeatureTxn.prototype = {
	/**
	 * @private
	 * @member {string}
	 */ 
	url: null,
	/**
	 * @private
	 * @member {string}
	 */ 
	geomColumn: null,
	/**
	 * @private
	 * @member {function()}
	 */ 
	success: null,
	/**
	 * @private
	 * @member {function()}
	 */ 
	error: null,
	/**
	 * @private
	 * @member {ol.format.WFS}
	 */ 
	format: null,
	/**
	 * @private
	 * @member {XMLSerializer}
	 */ 
	serializer: null,
	/**
	 * @private
	 * @member {Object}
	 */ 
	options: null,
	/**
	 * @desc Authenticate with the WFS
	 * @public
	 * @method
	 * @param {nyc.ol.geoserver.FeatureTxn.Auth}  Authorization options
	 */ 
	auth: function(options){
	    var isLoggedIn = this.isLoggedIn;
		$.ajax({
	        url: options.url,
	        data: 'username=' + options.user + '&password=' + options.password,
	        type: 'POST',
	        contentType: 'application/x-www-form-urlencoded',
	        success: function(response){
	            if (isLoggedIn(response)){
	            	options.callback(true);
	            }else{
	            	this.error(arguments);
	            }
	        },
	        error: function(){
	        	options.callback(false);
	        }
	    });
	},
	/**
	 * @desc Insert a new feature in the layer
	 * @public
	 * @method
	 * @param {ol.Feature} feature
	 */ 
	add: function(feature){
		var me = this, clone = me.clone(feature), node = me.format.writeTransaction([clone], null, null, me.options);
		$.ajax({
			type: 'POST',
			url: this.url,
			data: this.serializer.serializeToString(node),
			contentType: 'text/xml',
			success: function(data){
				me.success(arguments);
			},
			error: function(data){
				me.error(arguments);
			}
		});
	},
	/**
	 * @desc Delete a feature from the layer
	 * @public
	 * @method
	 * @param {ol.Feature} feature
	 */ 
	remove: function(feature){
		var me = this, clone = me.clone(feature), node = me.format.writeTransaction(null, null, [clone], me.options);
		$.ajax({
			type: 'POST',
			url: this.url,
			data: this.serializer.serializeToString(node),
			contentType: 'text/xml',
			success: function(data){
				me.success(arguments);
			},
			error: function(data){
				me.error(arguments);
			}
		});
	},
	/**
	 * @desc Modify a feature of the layer
	 * @public
	 * @method
	 * @param {ol.Feature} feature
	 */ 
	update: function(feature){
		var me = this, clone = me.clone(feature), node = me.format.writeTransaction(null, [clone], null, me.options);
		$.ajax({
			type: 'POST',
			url: this.url,
			data: this.serializer.serializeToString(node),
			contentType: 'text/xml',
			success: function(data){
				me.success(arguments);
			},
			error: function(data){
				me.error(arguments);
			}
		});
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Feature} feature
	 */ 
	clone: function(feature){
		var clone = new ol.Feature(), props = feature.getProperties();
		clone.setId(feature.getId());
		delete props.geometry;
		props[this.geomColumn] = feature.getGeometry(); 
		clone.setProperties(props);
		return clone;
	},
	/**
	 * @private
	 * @method
	 * @param {string} feature
	 */ 
	isLoggedIn: function(response){
		var rx = new RegExp('<span class\=\"username\">(.|\n)*?<\/span>');
		return rx.exec(response) != null;
	}
}

/**
 * @desc Object type to hold constructor options for {@link nyc.ol.geoserver.GetFeature}
 * @public
 * @typedef {Object}
 * @property {string} wfsUrl A GeoServer WFS-T URL (i.e. http://localhost/geoserver/wfs) 
 * @property {string} namespace The namespace URI of the layer to which features will be written
 * @property {string} typeName The type name of the layer from which to retrieve features
 * @property {string} geomColumn The name of the layer's geometry column that will be queried
 * @property {string} projection The projection
 * @property {function()} success A success callback
 * @property {function(string)} error An error callback that receives a WFS exception
 */
nyc.ol.geoserver.FeatureTxn.Options;

/**
 * @desc Object type to hold auth options for {@link nyc.ol.geoserver.GetFeature#auth}
 * @public
 * @typedef {Object}
 * @property {string} url A GeoServer login URL 
 * @property {string} user The user name
 * @property {string} password The password
 * @property {function(boolean)} callback Success/failure callback
 */
nyc.ol.geoserver.FeatureTxn.Auth;

