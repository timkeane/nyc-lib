/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.ol = nyc.ol || {};
/** @export */
nyc.ol.source = nyc.ol.source || {};

/**
 * Class that extends ol.source.GeoJSON for providing features decorated by an array of mixin objects
 * @export
 * @constructor
 * @extends {ol.source.Vector}
 * @param {olx.source.VectorOptions=} options Vector source options.
 * @param {Array.<Object>}  decorationMixins An array of objects whose members will be added to all features created by this source
 */
nyc.ol.source.Decorating = function(options, decorationMixins){
	options = options || {};
	options.loader = options.loader || nyc.ol.source.Decorating.xhrLoader;
	this.featuresloaded = false;
	this.featureloaderror = false;
	this._url = options.url;
	this._format = options.format;
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
 * A one-time xhr loader for features
 *  
 * @private
 * @param {ol.Extent} extent
 * @param {number} resolution
 * @param {ol.proj.Projection} projection
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
			    me.set('featuresloaded', true);  
			},
			error: function(){
			    me.set('featureloaderror', true);  
			}
		});		
	}
};

/**
 * @export
 * @return {boolean}
 */
nyc.ol.source.Decorating.prototype.isXhrFeaturesLoaded = function(){
    return this._xhrFeaturesLoaded;    
};

/**
 * Enum for feature loading event type
 * @export
 * @enum {string}
 */
nyc.ol.source.Decorating.LoaderEventType = {
	FEATURESLOADED: 'change:featuresloaded',
	FEATURELOADERROR: 'change:featureloaderror'
};

