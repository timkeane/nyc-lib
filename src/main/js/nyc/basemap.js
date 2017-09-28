var nyc = nyc || {};

/**
 * @desc An abstract class for creating and manipulating the NYC basemap
 * @public
 * @abstract
 * @class
 * @constructor
 * @param {nyc.Basemap.Options} options Constructor options
 */
nyc.Basemap = function(options){
	var target = $(options.target);
	target.on('drop', $.proxy(this.loadLayer, this));
	target.on('dragover', function(event){
		event.preventDefault();
	});
};

nyc.Basemap.prototype = {
	/**
	 * @desc Get the storage used for laoding and saving data
	 * @public
	 * @abstract
	 * @method
	 * @return {nyc.storage.Local} srorage
	 */
	getStorage: function(year){
		throw 'Not Implemented';
	},
	/**
	 * @desc Show photo layer
	 * @public
	 * @abstract
	 * @method
	 * @param {number} layer The photo year to show
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
	},
	/**
	 * @desc Returns the base layers
	 * @public
	 * @method
	 * @return {nyc.Basemap.BaseLayers}
	 */
	 loadLayer: function(event){
		 var transfer = event.originalEvent.dataTransfer;
		 event.preventDefault();
		 event.stopPropagation();
		 if (transfer && transfer.files.length){
			 var storage = this.getStorage();
			 var files = transfer.files;
			 $.each(files, function(){
				 var ext = this.name.split('.').pop().toLowerCase();
				 if (ext == 'json'){
					 storage.loadGeoJsonFile(map, null, this);
				 }
			 });
			 storage.loadShapeFile(map, null, files);
		 }
	 },
	/**
	 * @desc Returns the base layers
	 * @public
	 * @method
	 * @return {nyc.Basemap.BaseLayers}
	 */
	sortedPhotos: function(){
		var sorted = [];
		for (var photo in this.photos){
			sorted.push(this.photos[photo]);
		}
		/* sort descending on the first 4 digits - puts 2001-2 in the proper place */
		return sorted.sort(function(a, b){
			var aName = a.name || a.get('name'), bName = b.name || b.get('name');
			return bName.substr(0, 4) - aName.substr(0, 4);
		});
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
 * @property {Object<string, ol.layer.Base|L.Layer>} labels The label layers
 * @property {Object<string, ol.layer.Base|L.Layer>} photos The photo layers
 */
nyc.Basemap.BaseLayers;

/**
 * @desc Object type to hold constructor options for {@link nyc.Basemap}
 * @public
 * @typedef {Object}
 * @property {Element|JQuery|string} target The target DOM node for creating the map
 */
nyc.Basemap.Options;
