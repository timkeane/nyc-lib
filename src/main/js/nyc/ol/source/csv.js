nyc.ol.source.CsvPointFeatureLoader = function(options) {
	var point = function(csvRow){
		var x = csvRow[options.xCol] || csvRow.x || csvRow.X || csvRow.x_coord || csvRow.X_COORD;
		var y = csvRow[options.yCol] || csvRow.y || csvRow.Y || csvRow.y_coord || csvRow.Y_COORD;
		return new ol.geom.Point([x * 1, y * 1]);
	};
	return function(extent, resolution){
		var src = this;	
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
				src.set('featuresloaded', true);  
			}
		});
	}
};
