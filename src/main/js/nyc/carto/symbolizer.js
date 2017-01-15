var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc An interface for symbolizing Carto layers
 * @public
 * @extends {nyc.EventHandling}
 * @extends {nyc.ReplaceTokens}
 * @interface
 */
nyc.carto.Symbolizer = function(){};

nyc.inherits(nyc.carto.Symbolizer, nyc.ReplaceTokens);
nyc.inherits(nyc.carto.Symbolizer, nyc.EventHandling);

/** 
 * @desc Enumerator for symbolizer event types
 * @public
 * @enum {string}
 */
nyc.carto.Symbolizer.EventType = {
	/**
	 * @desc The symbolized event fired after a symbolizer completes its symbolize function
	 */
	SYMBOLIZED: 'symbolized' 
};

/**
 * @desc The result of symbolization 
 * @event nyc.carto.Symbolizer#symbolized
 * @type {Object}
 */




