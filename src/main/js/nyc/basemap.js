var nyc = nyc || {};

/**
 * @desc An interface for creating and manipulating the NYC basemap 
 * @public
 * @interface
 */
nyc.Basemap = function(){};

nyc.Basemap.prototype = {
	/** 
	 * @desc Show photo layer
	 * @public
	 * @abstract
	 * @method	
	 * @param layer {number} The photo year to show
	 */
	showPhoto: function(year){
		throw 'Not Implemented';
	},
	/** 
	 * @desc Show the specified label layer
	 * @public
	 * @abstract
	 * @method	
	 * @param labelType {nyc.Basemap.LabelType} The label type to show
	 */
	showLabels: function(labelType){
		throw 'Not Implemented';
	},
	/** 
	 * @desc Hide photo layer
	 * @public
	 * @abstract
	 * @method	
	 */
	hidePhoto: function(){
		throw 'Not Implemented';
	},
	/** 
	 * @desc Returns the base layers
	 * @public
	 * @abstract
	 * @method
	 * @return {nyc.Basemap.BaseLayers}
	 */
	getBaseLayers: function(){
		throw 'Not Implemented';
	}	
};


/** 
 * @desc Enumerator for label types
 * @public
 * @enum {string}
 */
nyc.Basemap.LabelType = {
	/**
	 * @desc Label type for base layer
	 */
	BASE: 'base',
	/**
	 * @desc Label type for photo layer
	 */
	PHOTO: 'photo'
};

/**
 * @desc Object type to hold base layers
 * @public
 * @typedef {Object}
 * @property {Object} base The base layer
 * @property {<string, ol.layer.Base|L.Layer>} labels The label layers 
 * @property {<number, ol.layer.Base|L.Layer>} photos The photo layers 
 */
nyc.Basemap.BaseLayers;
