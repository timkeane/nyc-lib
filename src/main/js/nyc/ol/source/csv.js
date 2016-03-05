var nyc = nyc || {};
nyc.ol = nyc.ol || {};
/** 
 * @public 
 * @namespace
 */
nyc.ol.source = nyc.ol.source || {};

/**
 * @desc A ol.FeatureLoader function for loading CSV point features
 * @public
 * @class
 * @constructor
 * @param {nyc.ol.source.CsvPointFeatureLoader.Options} options Options specifying the file parameters for loading features
 * @returns {function(ol.extent,number)}
 * @fires nyc.ol.source.Decorating#change:featuresloaded
 * @fires nyc.ol.source.Decorating#change:featureloaderror
 * @see http://www.openlayers.org/
 */
nyc.ol.source.CsvPointFeatureLoader = function(options) {
	var point = function(csvRow){
		var x = csvRow[options.xCol] || csvRow.x || csvRow.X || csvRow.x_coord || csvRow.X_COORD;
		var y = csvRow[options.yCol] || csvRow.y || csvRow.Y || csvRow.y_coord || csvRow.Y_COORD;
		return new ol.geom.Point([x * 1, y * 1]);
	};
	return function(extent, resolution){
		var src = this;	
		if (!src.featuresloaded){
			$.ajax({
				url: options.url,
				dataType: 'text',
				success: function(csvData){
					var csvRows = $.csv.toObjects(csvData), features = [];
					$.each(csvRows, function(i, csvRow){
						var feature = new ol.Feature(csvRow);
						feature.setId(i);
						feature.setGeometry(point(csvRow));
						src.addFeature(feature);
					});
					src.featuresloaded = true;  
					src.set('featuresloaded', true);  
				},
				error: function(){
					src.featureloaderror = true;  
					src.set('featureloaderror', true);  
				}
			});
		}
	}
};

nyc.ol.source.CsvPointFeatureLoader.prototype = {};

/**
 * @desc Options for {nyc.ol.source.CsvPointFeatureLoader}
 * @public
 * @typedef {Object}
 * @property {string} url URL to a CSV file
 * @property {string} [xCol=x|X|x_coord|X_COORD] Name of the CSV column containing X coordinate of feature location
 * @property {string} [yCol=y|Y|y_coord|Y_COORD] Name of the CSV column containing Y coordinate of feature location
 */
nyc.ol.source.CsvPointFeatureLoader.Options;
