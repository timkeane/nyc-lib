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
	
	var locator = new nyc.ol.Locator({map: this.TEST_OL_MAP});
	
	locator.zoomLocation({coordinates: [1, 2]}, function(){
		assert.equal(locator.source.getFeatures().length, 1);
		assert.deepEqual(locator.source.getFeatures()[0].getGeometry().getCoordinates(), [1, 2]);
		assert.deepEqual(locator.view.getCenter(), [1, 2]);
		assert.equal(locator.view.getZoom().toFixed(0), locator.zoom);
		assert.equal(locator.view.getZoom().toFixed(0), nyc.ol.Locate.ZOOM_LEVEL);
		assert.equal(locator.source.getFeatures().length, 1);
		done();
	});
});

QUnit.test('zoomLocation (geometry)', function(assert){
	assert.expect(4);
	
	var done = assert.async();
	
	var locator = new nyc.ol.Locator({map: this.TEST_OL_MAP});
	
	locator.view.fit = function(extent, size){
		assert.deepEqual(locator.source.getFeatures()[0].getGeometry().getExtent(), [0, 0, 1, 1]);	
		assert.deepEqual(extent, [0, 0, 1, 1]);	
		assert.deepEqual(size, locator.map.getSize());	
	};
	
	locator.zoomLocation(
		{
			geometry: {
				type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]	
			}
		},
		function(){
			assert.ok(true);
			done();
		}
	);
});
