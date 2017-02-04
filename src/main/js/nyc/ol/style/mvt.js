var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.style = nyc.ol.style || {};

/** 
 * @public 
 * @namespace
 */
nyc.ol.style.mvt = nyc.ol.style.mvt || {};

/**
 * @desc A function to create a composite style function for an ol.layer.TileVector layer with format ol.format.MVT that extracts point features and renders them into a separate ol.layer.Vector layer
 * @public
 * @function
 * @param {nyc.ol.style.mvt.WithPointConversionOptions} options Options for creating the style function
 * @return {ol.StyleFunction} The style function
 */
nyc.ol.style.mvt.withPointConversion = function(options){
	var currentTile;
	var grid = options.mvtLayer.getSource().getTileGrid();
	var source = new ol.source.Vector({});
	options.map.addLayer(new ol.layer.Vector({
		source: source,
		style: options.pointStyle,
		zIndex: options.mvtLayer.getZIndex() + 1
	}));
	var layerRenderer = options.map.getRenderer().getLayerRenderer(options.mvtLayer);
	layerRenderer.drawTileImage = function(){
		currentTile = arguments[0];
		ol.renderer.canvas.VectorTileLayer.prototype.drawTileImage.apply(this, arguments);
	};
	return function(mvtFeature, resolution){
		if (mvtFeature.getGeometry().getType() == 'Point'){
			var fid = mvtFeature.get(options.fidProperty);
			if (!source.getFeatureById(fid)){
				var converted = nyc.ol.style.mvt.convertPointFeature(options.map, grid, currentTile, mvtFeature, fid);
				source.addFeature(converted);
			}
		}else{
			return options.featureStyle(mvtFeature, resolution);
		}
	}
};

/**
 * @desc Object type to hold arguments for {@link nyc.ol.style.mvt.withPointConversion}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map onto which the point feature will be rendered
 * @property {ol.VectorTile} tile The tile containing the point feature
 * @property {string} fidProperty The property name containing a unique id for features
 * @property {ol.StyleFunction} featureStyle The style function for non-point features 
 * @property {ol.StyleFunction} pointStyle The style function for point features 
 */
nyc.ol.style.mvt.WithPointConversionOptions;

/**
 * @desc A function to convert ol.render.Feature to ol.Feature
 * @private
 * @function
 * @param {ol.Map} map The map onto which the point feature will be rendered
 * @param {ol.tilegrid.TileGrid} grid The tile grid containing the tile being rendered
 * @param {ol.VectorTile} tile The tile containing the point feature
 * @param {ol.render.Feature} feature The point feature
 * @param {string|number} fid A unique id for the converted point feature
 * @return {ol.Feature} feature The converted point feature
 */
nyc.ol.style.mvt.convertPointFeature = function(map, grid, tile, feature, fid){
	var tileCoord = tile.getTileCoord();
	var extent = grid.getTileCoordExtent(tileCoord);
	var unitsPerPixel = grid.getResolution(tileCoord[0]);
	var pixel = feature.getOrientedFlatCoordinates();
	var x = extent[0] + (pixel[0] * unitsPerPixel);
	var y = extent[3] - (pixel[1] * unitsPerPixel);
	var point = new ol.geom.Point([x, y]);
	var converted = new ol.Feature(feature.getProperties());
	converted.setId(fid);
	converted.setGeometry(point);
	return converted;
};