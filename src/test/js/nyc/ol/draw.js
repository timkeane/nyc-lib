QUnit.module('nyc.ol.Draw', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('constructor (defaults)', function(assert){
	assert.expect(27);

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
	assert.deepEqual(draw.storage, new nyc.ol.storage.Local());
	assert.equal(draw.storeKey, document.location.href.replace(document.location.search, '') + 'nyc.ol.Draw.features');
	assert.deepEqual(draw.layer.getSource(), draw.source);
	assert.deepEqual(draw.layer.getStyle(), draw.defaultStyle);
	assert.equal(draw.layer.getZIndex(), 100);
	assert.ok($.inArray(draw.layer, this.TEST_OL_MAP.getLayers().getArray()) > -1);
	assert.deepEqual(draw.accuaracyLayer.getSource(), draw.source);
	assert.deepEqual(draw.accuaracyLayer.getStyle(), draw.accuracyStyle);
	assert.equal(draw.accuaracyLayer.getZIndex(), 0);
	assert.ok(draw.accuaracyLayer.getVisible());
	assert.ok($.inArray(draw.accuaracyLayer, this.TEST_OL_MAP.getLayers().getArray()) > -1);
	assert.deepEqual(draw.mover.layer, draw.layer)
	assert.notOk(draw.mover.getActive());
	assert.ok($.inArray(draw.mover, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.deepEqual(draw.tracker.map, this.TEST_OL_MAP);

	draw.tracker.dispatchEvent({type: nyc.ol.Tracker.EventType.UPDATED, target: draw.tracker});

	nyc.ol.Draw.prototype.restore = restore;
	nyc.ol.Draw.prototype.createModify = createModify;
	nyc.ol.Draw.prototype.buttonMenu = buttonMenu;
});

QUnit.test('constructor (showAccuracy=false)', function(assert){
	assert.expect(27);

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
		map: this.TEST_OL_MAP,
		showAccuracy: false
	});

	assert.deepEqual(draw.map, this.TEST_OL_MAP);
	assert.deepEqual(draw.view, this.TEST_OL_MAP.getView());
	assert.equal(draw.features.getLength(), 0);
	assert.equal(draw.source.getFeatures().length, 0);
	assert.deepEqual(draw.source.getFeatures(), draw.features.getArray());
	assert.deepEqual(draw.viewport.get(0), this.TEST_OL_MAP.getViewport());
	assert.deepEqual(draw.removed, []);
	assert.deepEqual(draw.geoJson, new ol.format.GeoJSON());
	assert.deepEqual(draw.storage, new nyc.ol.storage.Local());
	assert.equal(draw.storeKey, document.location.href.replace(document.location.search, '') + 'nyc.ol.Draw.features');
	assert.deepEqual(draw.layer.getSource(), draw.source);
	assert.deepEqual(draw.layer.getStyle(), draw.defaultStyle);
	assert.equal(draw.layer.getZIndex(), 100);
	assert.ok($.inArray(draw.layer, this.TEST_OL_MAP.getLayers().getArray()) > -1);
	assert.deepEqual(draw.accuaracyLayer.getSource(), draw.source);
	assert.deepEqual(draw.accuaracyLayer.getStyle(), draw.accuracyStyle);
	assert.equal(draw.accuaracyLayer.getZIndex(), 0);
	assert.notOk(draw.accuaracyLayer.getVisible());
	assert.ok($.inArray(draw.accuaracyLayer, this.TEST_OL_MAP.getLayers().getArray()) > -1);
	assert.deepEqual(draw.mover.layer, draw.layer)
	assert.notOk(draw.mover.getActive());
	assert.ok($.inArray(draw.mover, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.deepEqual(draw.tracker.map, this.TEST_OL_MAP);

	draw.tracker.dispatchEvent({type: nyc.ol.Tracker.EventType.UPDATED, target: draw.tracker});

	nyc.ol.Draw.prototype.restore = restore;
	nyc.ol.Draw.prototype.createModify = createModify;
	nyc.ol.Draw.prototype.buttonMenu = buttonMenu;
});

QUnit.test('constructor (custom styles)', function(assert){
	assert.expect(27);

	var style = function(){/* mock style */};
	var accuracyStyle = function(){/* mock accuracyStyle */};

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
		map: this.TEST_OL_MAP,
		style: style,
		accuracyStyle: accuracyStyle
	});

	assert.deepEqual(draw.map, this.TEST_OL_MAP);
	assert.deepEqual(draw.view, this.TEST_OL_MAP.getView());
	assert.equal(draw.features.getLength(), 0);
	assert.equal(draw.source.getFeatures().length, 0);
	assert.deepEqual(draw.source.getFeatures(), draw.features.getArray());
	assert.deepEqual(draw.viewport.get(0), this.TEST_OL_MAP.getViewport());
	assert.deepEqual(draw.removed, []);
	assert.deepEqual(draw.geoJson, new ol.format.GeoJSON());
	assert.deepEqual(draw.storage, new nyc.ol.storage.Local());
	assert.equal(draw.storeKey, document.location.href.replace(document.location.search, '') + 'nyc.ol.Draw.features');
	assert.deepEqual(draw.layer.getSource(), draw.source);
	assert.deepEqual(draw.layer.getStyle(), style);
	assert.equal(draw.layer.getZIndex(), 100);
	assert.ok($.inArray(draw.layer, this.TEST_OL_MAP.getLayers().getArray()) > -1);
	assert.deepEqual(draw.accuaracyLayer.getSource(), draw.source);
	assert.deepEqual(draw.accuaracyLayer.getStyle(), accuracyStyle);
	assert.equal(draw.accuaracyLayer.getZIndex(), 0);
	assert.ok(draw.accuaracyLayer.getVisible());
	assert.ok($.inArray(draw.accuaracyLayer, this.TEST_OL_MAP.getLayers().getArray()) > -1);
	assert.deepEqual(draw.mover.layer, draw.layer)
	assert.notOk(draw.mover.getActive());
	assert.ok($.inArray(draw.mover, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.deepEqual(draw.tracker.map, this.TEST_OL_MAP);

	draw.tracker.dispatchEvent({type: nyc.ol.Tracker.EventType.UPDATED, target: draw.tracker});

	nyc.ol.Draw.prototype.restore = restore;
	nyc.ol.Draw.prototype.createModify = createModify;
	nyc.ol.Draw.prototype.buttonMenu = buttonMenu;
});

QUnit.test('setGpsAccuracyLimit', function(assert){
	assert.expect(4);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	assert.equal(draw.accuracyLimit, 0);
	assert.equal(draw.tracker.accuracyLimit, 0);

	draw.setGpsAccuracyLimit(500);

	assert.equal(draw.accuracyLimit, 500);
	assert.equal(draw.tracker.accuracyLimit, 500);
});

QUnit.test('active', function(assert){
	assert.expect(5);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	assert.notOk(draw.active());

	draw.drawer = {getActive: function(){return true;}};
	assert.ok(draw.active());

	delete draw.drawer;
	assert.notOk(draw.active());

	draw.tracker = {getTracking: function(){return true;}};
	assert.ok(draw.active());

	delete draw.tracker;
	assert.notOk(draw.active());
});

QUnit.test('activate (nyc.ol.Draw.Type.NONE)', function(assert){
	assert.expect(5);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.deactivate = function(){assert.ok(true);};

	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.NONE);
	assert.equal(draw.type, nyc.ol.Draw.Type.NONE);

	assert.notOk($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.notOk($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
});

QUnit.test('activate (nyc.ol.Draw.Type.POINT)', function(assert){
	assert.expect(6);

	var actualEvents = [];

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.deactivate = function(){assert.ok(true);};
	draw.triggerFeatureEvent = function(event){
		actualEvents.push(event);
	};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.POINT);
	assert.equal(draw.type, nyc.ol.Draw.Type.POINT);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
});

QUnit.test('activate (nyc.ol.Draw.Type.LINE)', function(assert){
	assert.expect(6);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.deactivate = function(){assert.ok(true);};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.LINE);
	assert.equal(draw.type, nyc.ol.Draw.Type.LINE);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
});

QUnit.test('activate (nyc.ol.Draw.Type.POLYGON)', function(assert){
	assert.expect(6);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.deactivate = function(){assert.ok(true);};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.POLYGON);
	assert.equal(draw.type, nyc.ol.Draw.Type.POLYGON);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
});

QUnit.test('activate (nyc.ol.Draw.Type.CIRCLE)', function(assert){
	assert.expect(6);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.deactivate = function(){assert.ok(true);};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.CIRCLE);
	assert.equal(draw.type, nyc.ol.Draw.Type.CIRCLE);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
});

QUnit.test('activate (nyc.ol.Draw.Type.SQUARE)', function(assert){
	assert.expect(6);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.deactivate = function(){assert.ok(true);};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.SQUARE);
	assert.equal(draw.type, nyc.ol.Draw.Type.SQUARE);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
});

QUnit.test('activate (nyc.ol.Draw.Type.BOX)', function(assert){
	assert.expect(6);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.deactivate = function(){assert.ok(true);};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.BOX);
	assert.equal(draw.type, nyc.ol.Draw.Type.BOX);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
});

QUnit.test('activate (nyc.ol.Draw.Type.FREE)', function(assert){
	assert.expect(6);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.deactivate = function(){assert.ok(true);};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.FREE);
	assert.equal(draw.type, nyc.ol.Draw.Type.FREE);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
});

QUnit.test('activate (nyc.ol.Draw.Type.GPS)', function(assert){
	assert.expect(6);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.deactivate = function(){assert.ok(true);};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.GPS);
	assert.equal(draw.type, nyc.ol.Draw.Type.GPS);

	assert.notOk($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.notOk($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
});
