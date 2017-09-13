QUnit.module('nyc.ol.Draw', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('constructor (defaults)', function(assert){
	assert.expect(24);

	var restore = nyc.ol.Draw.prototype.restore;
	var createModify = nyc.ol.Draw.prototype.createModify;
	var buttonMenu = nyc.ol.Draw.prototype.buttonMenu;
	var updateTrack = nyc.ol.Draw.prototype.updateTrack;

	var testFn = function(){
		assert.ok(true);
	};
	nyc.ol.Draw.prototype.restore = testFn;
	nyc.ol.Draw.prototype.createModify = testFn;
	nyc.ol.Draw.prototype.buttonMenu = testFn;
	nyc.ol.Draw.prototype.updateTrack = testFn;

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	assert.deepEqual(draw.map, this.TEST_OL_MAP);
	assert.deepEqual(draw.view, this.TEST_OL_MAP.getView());
	assert.equal(draw.features.getLength(), 0);
	assert.equal(draw.source.getFeatures().length, 0);
	assert.deepEqual(draw.source.getFeatures(), draw.features.getArray());
	assert.deepEqual(draw.viewport.get(0), this.TEST_OL_MAP.getViewport());
	assert.deepEqual(draw.removed, []);
	assert.deepEqual(draw.geoJson, new ol.format.GeoJSON());
	assert.equal(draw.storeKey, document.location.href.replace(document.location.search, '') + 'nyc.ol.Draw.features');
	assert.deepEqual(draw.layer.getSource(), draw.source);
	assert.deepEqual(draw.layer.getStyle(), draw.defaultStyle);
	assert.equal(draw.layer.getZIndex(), 100);
	assert.ok($.inArray(draw.layer, this.TEST_OL_MAP.getLayers().getArray()) > -1);
	assert.deepEqual(draw.accuaracyLayer.getSource(), draw.source);
	assert.deepEqual(draw.accuaracyLayer.getStyle(), draw.accuracyStyle);
	assert.equal(draw.accuaracyLayer.getZIndex(), 0);
	assert.ok($.inArray(draw.accuaracyLayer, this.TEST_OL_MAP.getLayers().getArray()) > -1);
	assert.deepEqual(draw.mover.layer, draw.layer)
	assert.notOk(draw.mover.getActive());
	assert.deepEqual(draw.tracker.map, this.TEST_OL_MAP);

	draw.tracker.dispatchEvent({type: nyc.ol.Tracker.EventType.UPDATED, target: draw.tracker});

	nyc.ol.Draw.prototype.restore = restore;
	nyc.ol.Draw.prototype.createModify = createModify;
	nyc.ol.Draw.prototype.buttonMenu = buttonMenu;
});
