QUnit.module('nyc.leaf.Locator', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('zoomLocation', function(assert){
	assert.expect(9);
	
	var icon = L.icon({
	    iconUrl: 'img/me0.svg',
	    iconSize: [38, 95],
	    iconAnchor: [22, 94]
	});
	
	var locator = new nyc.leaf.Locator({
		map: this.TEST_LEAF_MAP,
		icon: icon,
		style: function(){
			return {weight: 10, color: 'black', fill: false};
		}
	});
	
	assert.notOk(locator.layer);
	
	locator.zoomLocation({coordinates: [1, 2]}, function(){
		assert.deepEqual(locator.layer.getLatLng(), L.latLng(2, 1));
		assert.deepEqual(locator.layer.options.icon, icon);
		assert.deepEqual(locator.map.getCenter(), L.latLng(2, 1));
		assert.equal(locator.map.getZoom(), locator.zoom);
		assert.equal(locator.map.getZoom(), nyc.leaf.Locate.ZOOM_LEVEL);		
	});

	
	locator.map.fitBounds = function(bounds){
		assert.deepEqual(locator.layer.getBounds(), L.latLngBounds(L.latLng(0, 0), L.latLng(1, 1)));	
		assert.deepEqual(bounds, L.latLngBounds(L.latLng(0, 0), L.latLng(1, 1)));	
	};
	locator.zoomLocation(
		{
			geoJsonGeometry: {
				type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]	
			}
		},
		function(){
			assert.ok(true);
		}
	);
});
