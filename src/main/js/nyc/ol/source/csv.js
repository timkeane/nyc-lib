nyc.ol.source.CsvPointFeatureLoader = function(options) {
	return function(extent, resolution){
		var src = this;	
		$.ajax({
			url: options.url,
			dataType: 'text',
			success: function(csvData){
				var csvFeatures = $.csv.toObjects(csvData), features = [];
				$.each(csvFeatures, function(_, f){
					var feature = new ol.Feature(f);
					feature.setGeometry(new ol.geom.Point([f[options.xCol], f[options.yCol]]));
					src.addFeature(feature);
				});
			}
		});
	}
};
