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
	var point = function(csvRow, srcProj, viewProj){
		var coordinates;
		if (options.geomParser){
			coordinates = options.geomParser(csvRow);
		}else{
			coordinates = [csvRow[options.xCol] * 1, csvRow[options.yCol] * 1];
		}
		return new ol.geom.Point(proj4(srcProj || 'EPSG:4326', viewProj.getCode(), coordinates));
	};
	return function(extent, resolution, projection){
		var src = this;
		if (!src.featuresloaded){
			$.ajax({
				url: options.url,
				dataType: 'text',
				success: function(csvData){
					var csvRows = $.csv.toObjects(csvData), features = [];
					$.each(csvRows, function(i, csvRow){
						try{
							var feature = new ol.Feature(csvRow);
							feature.setId(i);
							feature.setGeometry(point(csvRow, options.projection, projection));
							src.addFeature(feature);							
						}catch(e){
							console.warn('bad record', csvRow, e);
						}
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
	};
};

nyc.ol.source.CsvPointFeatureLoader.prototype = {};

/**
 * @desc Constructor options for {nyc.ol.source.CsvPointFeatureLoader}. Either xCol and yCol or a geomParser are required.
 * @public
 * @typedef {Object}
 * @property {string} url URL to a CSV file
 * @property {string=} xCol Name of the CSV column containing X coordinate of feature location. Either xCol and yCol or a geomParser are required.
 * @property {string=} yCol Name of the CSV column containing Y coordinate of feature location. Either xCol and yCol or a geomParser are required.
 * @property {Function(Array<Object>)=} geomParser A function to parse a point from a CSV row
 * @property {string} projection Source data projection
 */
nyc.ol.source.CsvPointFeatureLoader.Options;

/** 
 * @public 
 * @namespace
 */
nyc.ol.source.socrata = nyc.ol.source.socrata || {};

/**
 * @desc Creates a function for parsing coordinate data from a Socrata CSV data source
 * @public
 * @class
 * @constructor
 * @param {string} geomCol The name of the CSV column containing the coordinates "(lat, lng)"
 * @returns {function(Array<Object>)}
 */
nyc.ol.source.socrata.PointParser = function(geomCol){
	var regExp = /\(([^)]+)\)/;
	return function(csvRow){
		var matches = regExp.exec(csvRow[geomCol]), coords = matches[matches.length  -1];
		coords = coords.split(',');
		return [coords[1] * 1, coords[0] * 1];
	};
};