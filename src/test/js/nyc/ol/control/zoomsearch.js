QUnit.module('nyc.ol.control.ZoomSearch', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('zoom', function(assert){
	assert.expect(2);

	var control = new nyc.ol.control.ZoomSearch(this.TEST_OL_MAP);
	var zoom = this.TEST_OL_MAP.getView().getZoom();
	$('#btn-z-in').trigger('click');
	assert.equal(this.TEST_OL_MAP.getView().getZoom(), zoom + 1);
	$('#btn-z-out').trigger('click');
	assert.equal(this.TEST_OL_MAP.getView().getZoom(), zoom);
});

QUnit.test('container', function(assert){
	assert.expect(1);

	var control = new nyc.ol.control.ZoomSearch(this.TEST_OL_MAP);
	assert.deepEqual(control.container(), $(this.TEST_OL_MAP.getViewport()).find('.ol-overlaycontainer-stopevent'));
});
