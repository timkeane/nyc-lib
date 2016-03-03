var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.source = nyc.ol.source || {};

/**
 * @desc Class that extends ol.source.GeoJSON for providing features decorated by an array of mixin objects
 * @public
 * @class
 * @extends {ol.source.Vector}
 * @constructor
 * @param {Object=} options Vector source options
 * @param {Array<Object>}  decorationMixins An array of objects whose members will be added to all features created by this source
 * @fires nyc.ol.source.Decorating#change:featuresloaded
 * @fires nyc.ol.source.Decorating#change:featureloaderror
 * @see http://www.openlayers.org/
 */
nyc.ol.source.Decorating = function(options, decorationMixins){
	options = options || {};
	options.loader = options.loader || nyc.ol.source.Decorating.xhrLoader;
	/**
	 * @private
	 * @member {boolean}
	 */
	this.featuresloaded = false;
	/**
	 * @private
	 * @member {boolean}
	 */
	this.featureloaderror = false;
	/**
	 * @private
	 * @member {string}
	 */
	this._url = options.url;
	/**
	 * @private
	 * @member {ol.format.Feature}
	 */
	this._format = options.format;
	/**
	 * @private
	 * @member {boolean}
	 */
	this._xhrFeaturesLoaded = false;
		
	ol.source.Vector.call(this, options);
	this.on('addfeature', function(e){
	  var feature = e.feature;
	  $.each(decorationMixins, function(_, mixin){
		  for (var memb in mixin){
			  feature[memb] = mixin[memb];
		  }
	  });
  });
};

ol.inherits(nyc.ol.source.Decorating, ol.source.Vector);

/**
 * @private
 * @param {ol.Extent} extent
 * @param {number} resolution
 * @param {string} projection
 */
nyc.ol.source.Decorating.xhrLoader = function(extent, resolution, projection){
	var me = this;
	if (!me._xhrFeaturesLoaded && me._url){
		$.ajax({
			url: me._url,
			dataType: 'html',
			success: function(data){
				me.addFeatures(me._format.readFeatures(data, {featureProjection: projection}));
				me._xhrFeaturesLoaded = true;
			    me.featuresloaded = true;  
			    me.set('featuresloaded', true);  
			},
			error: function(){
			    me.featureloaderror = true;  
			    me.set('featureloaderror', true);  
			}
		});		
	}
};

/**
 * @desc Has the request for geoJSON data completed successfully
 * @public
 * @method
 * @return {boolean} The value indicating if the XHR request has successfully loaded the geoJSON data
 */
nyc.ol.source.Decorating.prototype.isXhrFeaturesLoaded = function(){
    return this._xhrFeaturesLoaded;    
};

/**
 * @desc Enumeration for feature loading event type
 * @public
 * @enum {string}
 */
nyc.ol.source.Decorating.LoaderEventType = {
	/**
	 * @desc The features loaded event type
	 */
	FEATURESLOADED: 'change:featuresloaded',
	/**
	 * @desc The feature load error event type
	 */
	FEATURELOADERROR: 'change:featureloaderror'
};

/**
 * @desc The features loaded event
 * @event nyc.ol.source.Decorating#change:featuresloaded
 * @type {boolean}
 */

/**
 * @desc The feature load error event
 * @event nyc.ol.source.Decorating#change:featureloaderror
 * @type {boolean}
 */

