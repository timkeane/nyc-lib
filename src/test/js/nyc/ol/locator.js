QUnit.module('nyc.ol.Locator', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('zoomLocation (coordinates)', function(assert){
	assert.expect(6);
	
	var done = assert.async();
	
	var source = new ol.source.Vector();
	var layer = new ol.layer.Vector({source: source});
	this.TEST_OL_MAP.addLayer(layer);
	
	var locator = new nyc.ol.Locator({map: this.TEST_OL_MAP, layer: layer});
	
	locator.zoomLocation({coordinates: [1, 2]}, function(){
		assert.equal(locator.layerSource.getFeatures().length, 1);
		assert.deepEqual(locator.layerSource.getFeatures()[0].getGeometry().getCoordinates(), [1, 2]);
		assert.deepEqual(locator.view.getCenter(), [1, 2]);
		assert.equal(locator.view.getZoom(), locator.zoom);
		assert.equal(locator.view.getZoom(), nyc.ol.Locate.ZOOM_LEVEL);
		assert.equal(locator.layerSource.getFeatures().length, 1);
		done();
	});
});

QUnit.test('zoomLocation (geoJsonGeometry)', function(assert){
	assert.expect(4);
	
	var done = assert.async();
	
	var source = new ol.source.Vector();
	var layer = new ol.layer.Vector({source: source});
	this.TEST_OL_MAP.addLayer(layer);
	
	var locator = new nyc.ol.Locator({map: this.TEST_OL_MAP, layer: layer});
	
	locator.view.fit = function(extent, size){
		assert.deepEqual(locator.layerSource.getFeatures()[0].getGeometry().getExtent(), [0, 0, 1, 1]);	
		assert.deepEqual(extent, [0, 0, 1, 1]);	
		assert.deepEqual(size, locator.map.getSize());	
	};
	
	locator.zoomLocation(
		{
			geoJsonGeometry: {
				type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]	
			}
		},
		function(){
			assert.ok(true);
			done();
		}
	);
});
