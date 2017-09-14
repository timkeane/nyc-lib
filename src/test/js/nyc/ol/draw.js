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
	assert.expect(17);

	var feature = new ol.Feature({geometry: new ol.geom.Point([1, 2])});
	var actualEvents = [];
	var drawCondition = function(){/* mock-condition-proxy */};
	var mockFreehandCondition = function(){/* mock-freehandCondition-proxy */};

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var proxy = $.proxy;
	$.proxy = function(fn, scope){
		if (fn === draw.drawCondition && scope == draw){
			return drawCondition;
		}
		if (fn === draw.freehandCondition && scope == draw){
			return mockFreehandCondition;
		}
		return proxy(fn, scope);
	};

	draw.deactivate = function(){assert.ok(true);};
	draw.triggerFeatureEvent = function(event){
		actualEvents.push(event);
	};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.POINT);
	assert.equal(draw.type, nyc.ol.Draw.Type.POINT);
	assert.deepEqual(draw.drawer.getProperties().condition, drawCondition);
	assert.deepEqual(draw.drawer.getProperties().freehandCondition, mockFreehandCondition);
	assert.equal(draw.drawer.getProperties().type, nyc.ol.Draw.Type.POINT);
	assert.notOk(draw.drawer.getProperties().geometryFunction);
	assert.notOk(draw.drawer.getProperties().maxPoints);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	draw.source.addFeature(feature);
	assert.equal(actualEvents.length, 1);
	assert.equal(actualEvents[0].type, 'addfeature');
	assert.deepEqual(actualEvents[0].feature, feature);

	feature.set('changed', true);
	assert.equal(actualEvents.length, 2);
	assert.equal(actualEvents[1].type, 'changefeature');
	assert.deepEqual(actualEvents[1].feature, feature);

	$.proxy = proxy;
});

QUnit.test('activate (nyc.ol.Draw.Type.LINE)', function(assert){
	assert.expect(17);

	var feature = new ol.Feature({geometry: new ol.geom.LineString([[1, 2], [3, 4]])});
	var actualEvents = [];
	var drawCondition = function(){/* mock-condition-proxy */};
	var mockFreehandCondition = function(){/* mock-freehandCondition-proxy */};

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var proxy = $.proxy;
	$.proxy = function(fn, scope){
		if (fn === draw.drawCondition && scope == draw){
			return drawCondition;
		}
		if (fn === draw.freehandCondition && scope == draw){
			return mockFreehandCondition;
		}
		return proxy(fn, scope);
	};

	draw.deactivate = function(){assert.ok(true);};
	draw.triggerFeatureEvent = function(event){
		actualEvents.push(event);
	};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.LINE);
	assert.equal(draw.type, nyc.ol.Draw.Type.LINE);
	assert.deepEqual(draw.drawer.getProperties().condition, drawCondition);
	assert.deepEqual(draw.drawer.getProperties().freehandCondition, mockFreehandCondition);
	assert.equal(draw.drawer.getProperties().type, nyc.ol.Draw.Type.LINE);
	assert.notOk(draw.drawer.getProperties().geometryFunction);
	assert.notOk(draw.drawer.getProperties().maxPoints);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	draw.source.addFeature(feature);
	assert.equal(actualEvents.length, 1);
	assert.equal(actualEvents[0].type, 'addfeature');
	assert.deepEqual(actualEvents[0].feature, feature);

	feature.set('changed', true);
	assert.equal(actualEvents.length, 2);
	assert.equal(actualEvents[1].type, 'changefeature');
	assert.deepEqual(actualEvents[1].feature, feature);

	$.proxy = proxy;
});

QUnit.test('activate (nyc.ol.Draw.Type.POLYGON)', function(assert){
	assert.expect(17);

	var feature = new ol.Feature({geometry: new ol.geom.Polygon([[1, 2], [3, 4], [5, 6], [1, 2]])});
	var actualEvents = [];
	var drawCondition = function(){/* mock-condition-proxy */};
	var mockFreehandCondition = function(){/* mock-freehandCondition-proxy */};

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var proxy = $.proxy;
	$.proxy = function(fn, scope){
		if (fn === draw.drawCondition && scope == draw){
			return drawCondition;
		}
		if (fn === draw.freehandCondition && scope == draw){
			return mockFreehandCondition;
		}
		return proxy(fn, scope);
	};

	draw.deactivate = function(){assert.ok(true);};
	draw.triggerFeatureEvent = function(event){
		actualEvents.push(event);
	};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.POLYGON);
	assert.equal(draw.type, nyc.ol.Draw.Type.POLYGON);
	assert.deepEqual(draw.drawer.getProperties().condition, drawCondition);
	assert.deepEqual(draw.drawer.getProperties().freehandCondition, mockFreehandCondition);
	assert.equal(draw.drawer.getProperties().type, nyc.ol.Draw.Type.POLYGON);
	assert.notOk(draw.drawer.getProperties().geometryFunction);
	assert.notOk(draw.drawer.getProperties().maxPoints);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	draw.source.addFeature(feature);
	assert.equal(actualEvents.length, 1);
	assert.equal(actualEvents[0].type, 'addfeature');
	assert.deepEqual(actualEvents[0].feature, feature);

	feature.set('changed', true);
	assert.equal(actualEvents.length, 2);
	assert.equal(actualEvents[1].type, 'changefeature');
	assert.deepEqual(actualEvents[1].feature, feature);

	$.proxy = proxy;
});

QUnit.test('activate (nyc.ol.Draw.Type.CIRCLE)', function(assert){
	assert.expect(17);

	var feature = new ol.Feature({geometry: new ol.geom.Circle([1, 2], 1)});
	var actualEvents = [];
	var drawCondition = function(){/* mock-condition-proxy */};
	var mockFreehandCondition = function(){/* mock-freehandCondition-proxy */};

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var proxy = $.proxy;
	$.proxy = function(fn, scope){
		if (fn === draw.drawCondition && scope == draw){
			return drawCondition;
		}
		if (fn === draw.freehandCondition && scope == draw){
			return mockFreehandCondition;
		}
		return proxy(fn, scope);
	};

	draw.deactivate = function(){assert.ok(true);};
	draw.triggerFeatureEvent = function(event){
		actualEvents.push(event);
	};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.CIRCLE);
	assert.equal(draw.type, nyc.ol.Draw.Type.CIRCLE);
	assert.deepEqual(draw.drawer.getProperties().condition, drawCondition);
	assert.deepEqual(draw.drawer.getProperties().freehandCondition, mockFreehandCondition);
	assert.equal(draw.drawer.getProperties().type, nyc.ol.Draw.Type.CIRCLE);
	assert.notOk(draw.drawer.getProperties().geometryFunction);
	assert.notOk(draw.drawer.getProperties().maxPoints);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	draw.source.addFeature(feature);
	assert.equal(actualEvents.length, 1);
	assert.equal(actualEvents[0].type, 'addfeature');
	assert.deepEqual(actualEvents[0].feature, feature);

	feature.set('changed', true);
	assert.equal(actualEvents.length, 2);
	assert.equal(actualEvents[1].type, 'changefeature');
	assert.deepEqual(actualEvents[1].feature, feature);

	$.proxy = proxy;
});

QUnit.test('activate (nyc.ol.Draw.Type.SQUARE)', function(assert){
	assert.expect(18);

	var feature = new ol.Feature({geometry: new ol.geom.Polygon([[0, 1], [1, 1], [1, 2], [2, 2], [0, 2], [0, 1]])});
	var actualEvents = [];
	var drawCondition = function(){/* mock condition proxy */};
	var mockFreehandCondition = function(){/* mock freehandCondition proxy */};
	var mockCreateRegularPolygon = function(){/* mock createRegularPolygon */};

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var proxy = $.proxy;
	$.proxy = function(fn, scope){
		if (fn === draw.drawCondition && scope == draw){
			return drawCondition;
		}
		if (fn === draw.freehandCondition && scope == draw){
			return mockFreehandCondition;
		}
		return proxy(fn, scope);
	};

	var createRegularPolygon = ol.interaction.Draw.createRegularPolygon;
	ol.interaction.Draw.createRegularPolygon = function(maxPoints){
		assert.equal(maxPoints, 4);
		return mockCreateRegularPolygon;
	};

	draw.deactivate = function(){assert.ok(true);};
	draw.triggerFeatureEvent = function(event){
		actualEvents.push(event);
	};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.SQUARE);
	assert.equal(draw.type, nyc.ol.Draw.Type.SQUARE);
	assert.deepEqual(draw.drawer.getProperties().condition, drawCondition);
	assert.deepEqual(draw.drawer.getProperties().freehandCondition, mockFreehandCondition);
	assert.equal(draw.drawer.getProperties().type, nyc.ol.Draw.Type.CIRCLE);
	assert.deepEqual(draw.drawer.getProperties().geometryFunction, mockCreateRegularPolygon);
	assert.notOk(draw.drawer.getProperties().maxPoints);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	draw.source.addFeature(feature);
	assert.equal(actualEvents.length, 1);
	assert.equal(actualEvents[0].type, 'addfeature');
	assert.deepEqual(actualEvents[0].feature, feature);

	feature.set('changed', true);
	assert.equal(actualEvents.length, 2);
	assert.equal(actualEvents[1].type, 'changefeature');
	assert.deepEqual(actualEvents[1].feature, feature);

	$.proxy = proxy;
	ol.interaction.Draw.createRegularPolygon = createRegularPolygon;
});

QUnit.test('activate (nyc.ol.Draw.Type.BOX)', function(assert){
	assert.expect(17);

	var feature = new ol.Feature({geometry: new ol.geom.Polygon([[0, 1], [1, 1], [1, 2], [2, 2], [0, 2], [0, 1]])});
	var actualEvents = [];
	var drawCondition = function(){/* mock condition proxy */};
	var mockFreehandCondition = function(){/* mock freehandCondition proxy */};
	var mockCreateRegularPolygon = function(){/* mock createRegularPolygon */};

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var proxy = $.proxy;
	$.proxy = function(fn, scope){
		if (fn === draw.drawCondition && scope == draw){
			return drawCondition;
		}
		if (fn === draw.freehandCondition && scope == draw){
			return mockFreehandCondition;
		}
		return proxy(fn, scope);
	};

	draw.deactivate = function(){assert.ok(true);};
	draw.triggerFeatureEvent = function(event){
		actualEvents.push(event);
	};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.BOX);
	assert.equal(draw.type, nyc.ol.Draw.Type.BOX);
	assert.deepEqual(draw.drawer.getProperties().condition, drawCondition);
	assert.deepEqual(draw.drawer.getProperties().freehandCondition, mockFreehandCondition);
	assert.equal(draw.drawer.getProperties().type, nyc.ol.Draw.Type.LINE);
	assert.deepEqual(draw.drawer.getProperties().geometryFunction, draw.boxGeometry);
	assert.equal(draw.drawer.getProperties().maxPoints, 2);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	draw.source.addFeature(feature);
	assert.equal(actualEvents.length, 1);
	assert.equal(actualEvents[0].type, 'addfeature');
	assert.deepEqual(actualEvents[0].feature, feature);

	feature.set('changed', true);
	assert.equal(actualEvents.length, 2);
	assert.equal(actualEvents[1].type, 'changefeature');
	assert.deepEqual(actualEvents[1].feature, feature);

	$.proxy = proxy;
});

QUnit.test('activate (nyc.ol.Draw.Type.FREE)', function(assert){
	assert.expect(17);

	var feature = new ol.Feature({geometry: new ol.geom.Polygon([[0, 1], [1, 1], [1, 2], [2, 2], [0, 2], [0, 1]])});
	var actualEvents = [];
	var drawCondition = function(){/* mock condition proxy */};
	var mockFreehandCondition = function(){/* mock freehandCondition proxy */};
	var mockCreateRegularPolygon = function(){/* mock createRegularPolygon */};

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var proxy = $.proxy;
	$.proxy = function(fn, scope){
		if (fn === draw.drawCondition && scope == draw){
			return drawCondition;
		}
		if (fn === draw.freehandCondition && scope == draw){
			return mockFreehandCondition;
		}
		return proxy(fn, scope);
	};

	draw.deactivate = function(){assert.ok(true);};
	draw.triggerFeatureEvent = function(event){
		actualEvents.push(event);
	};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.FREE);
	assert.equal(draw.type, nyc.ol.Draw.Type.FREE);
	assert.deepEqual(draw.drawer.getProperties().condition, drawCondition);
	assert.deepEqual(draw.drawer.getProperties().freehandCondition, mockFreehandCondition);
	assert.equal(draw.drawer.getProperties().type, nyc.ol.Draw.Type.LINE);
	assert.notOk(draw.drawer.getProperties().geometryFunction);
	assert.notOk(draw.drawer.getProperties().maxPoints);

	assert.ok($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.ok($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	draw.source.addFeature(feature);
	assert.equal(actualEvents.length, 1);
	assert.equal(actualEvents[0].type, 'addfeature');
	assert.deepEqual(actualEvents[0].feature, feature);

	feature.set('changed', true);
	assert.equal(actualEvents.length, 2);
	assert.equal(actualEvents[1].type, 'changefeature');
	assert.deepEqual(actualEvents[1].feature, feature);

	$.proxy = proxy;
});

QUnit.test('activate (nyc.ol.Draw.Type.GPS)', function(assert){
	assert.expect(14);

	var feature = new ol.Feature({geometry: new ol.geom.Polygon([[0, 1], [1, 1], [1, 2], [2, 2], [0, 2], [0, 1]])});
	var actualEvents = [];
	var drawCondition = function(){/* mock condition proxy */};
	var mockFreehandCondition = function(){/* mock freehandCondition proxy */};
	var mockCreateRegularPolygon = function(){/* mock createRegularPolygon */};

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.beginGpsCapture = function(){
			assert.ok(true);
	};

	var proxy = $.proxy;
	$.proxy = function(fn, scope){
		if (fn === draw.drawCondition && scope == draw){
			return drawCondition;
		}
		if (fn === draw.freehandCondition && scope == draw){
			return mockFreehandCondition;
		}
		return proxy(fn, scope);
	};

	draw.deactivate = function(){assert.ok(true);};
	draw.triggerFeatureEvent = function(event){
		actualEvents.push(event);
	};

	assert.notOk(draw.drawer);
	assert.notOk(draw.type);

	draw.activate(nyc.ol.Draw.Type.GPS);
	assert.equal(draw.type, nyc.ol.Draw.Type.GPS);
	assert.notOk(draw.drawer);

	assert.notOk($.inArray(draw.drawer, this.TEST_OL_MAP.getInteractions().getArray()) > -1);
	assert.notOk($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	draw.source.addFeature(feature);
	assert.equal(actualEvents.length, 1);
	assert.equal(actualEvents[0].type, 'addfeature');
	assert.deepEqual(actualEvents[0].feature, feature);

	feature.set('changed', true);
	assert.equal(actualEvents.length, 2);
	assert.equal(actualEvents[1].type, 'changefeature');
	assert.deepEqual(actualEvents[1].feature, feature);

	$.proxy = proxy;
});

QUnit.test('getFeatures', function(assert){
	assert.expect(16);

	var existingFeature0 = new ol.Feature({geometry: new ol.geom.Point([0, 1])});
	existingFeature0._changed = true;
	var existingFeature1 = new ol.Feature({geometry: new ol.geom.Point([1, 2])});
	var existingFeature2 = new ol.Feature({geometry: new ol.geom.Point([2, 3])});
	var existingFeature3 = new ol.Feature({geometry: new ol.geom.Point([3, 4])});
	existingFeature3._changed = true;
	var existingFeature4 = new ol.Feature({geometry: new ol.geom.Point([-1, 0])});

	var newFeature0 = new ol.Feature({geometry: new ol.geom.Point([4, 5])});
	newFeature0._added = true;
	var newFeature1 = new ol.Feature({geometry: new ol.geom.Point([6, 7])});
	newFeature1._added = true;
	var newFeature2 = new ol.Feature({geometry: new ol.geom.Point([7, 8])});
	newFeature2._added = true;

	var testFeatures = [
		existingFeature0,
		existingFeature2,
		existingFeature3,
		newFeature0,
		newFeature2
	];

	var testRemovedFeatures = [
		existingFeature1,
		existingFeature4,
		newFeature1
	];

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var features = draw.getFeatures();
	assert.equal(features.added.length, 0);
	assert.equal(features.changed.length, 0);
	assert.equal(features.unchanged.length, 0);
	assert.equal(features.removed.length, 0);

	draw.setFeatures(testFeatures);
	draw.removed = testRemovedFeatures;

	features = draw.getFeatures();

	assert.equal(features.added.length, 2);
	assert.equal(features.changed.length, 2);
	assert.equal(features.unchanged.length, 1);
	assert.equal(features.removed.length, 3);

	assert.ok($.inArray(newFeature0, features.added) > -1);
	assert.ok($.inArray(newFeature2, features.added) > -1);

	assert.ok($.inArray(existingFeature0, features.changed) > -1);
	assert.ok($.inArray(existingFeature3, features.changed) > -1);

	assert.ok($.inArray(existingFeature2, features.unchanged) > -1);

	assert.ok($.inArray(existingFeature1, features.removed) > -1);
	assert.ok($.inArray(existingFeature4, features.removed) > -1);
	assert.ok($.inArray(newFeature1, features.removed) > -1);
});

QUnit.test('setFeatures', function(assert){
	assert.expect(6);

	var existingFeature0 = new ol.Feature({geometry: new ol.geom.Point([0, 1])});
	var existingFeature1 = new ol.Feature({geometry: new ol.geom.Point([1, 2])});
	var existingFeature2 = new ol.Feature({geometry: new ol.geom.Point([2, 3])});
	var existingFeature3 = new ol.Feature({geometry: new ol.geom.Point([3, 4])});

	var newFeature0 = new ol.Feature({geometry: new ol.geom.Point([4, 5])});
	var newFeature1 = new ol.Feature({geometry: new ol.geom.Point([6, 7])});
	var newFeature2 = new ol.Feature({geometry: new ol.geom.Point([7, 8])});

	var existingFeatures = [
		existingFeature0,
		existingFeature1,
		existingFeature2,
		existingFeature3
	];

	var newFeatures = [
		newFeature0,
		newFeature1,
		newFeature2
	];

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	assert.equal(draw.source.getFeatures().length, 0);

	draw.removed = ['mockFeature0', 'mockFeature1'];
	draw.source.addFeatures(existingFeatures);
	draw.setFeatures(newFeatures);

	assert.equal(draw.removed.length, 0);
	assert.equal(draw.source.getFeatures().length, 3);
	assert.ok($.inArray(newFeature0, draw.source.getFeatures()) > -1);
	assert.ok($.inArray(newFeature1, draw.source.getFeatures()) > -1);
	assert.ok($.inArray(newFeature2, draw.source.getFeatures()) > -1);
});

QUnit.test('removeFeature', function(assert){
	assert.expect(6);

	var existingFeature0 = new ol.Feature({geometry: new ol.geom.Point([0, 1])});
	var existingFeature1 = new ol.Feature({geometry: new ol.geom.Point([1, 2])});
	var existingFeature2 = new ol.Feature({geometry: new ol.geom.Point([2, 3])});
	var existingFeature3 = new ol.Feature({geometry: new ol.geom.Point([3, 4])});

	var existingFeatures = [
		existingFeature0,
		existingFeature1,
		existingFeature2,
		existingFeature3
	];

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.source.addFeatures(existingFeatures);
	assert.equal(draw.source.getFeatures().length, 4);
	assert.equal(draw.removed.length, 0);

	draw.removeFeature(existingFeature2);

	assert.equal(draw.source.getFeatures().length, 3);
	assert.equal(draw.removed.length, 1);
	assert.equal(draw.removed[0], existingFeature2);
	assert.notOk($.inArray(existingFeature2, draw.source.getFeatures()) > -1);
});

QUnit.test('clear', function(assert){
	assert.expect(4);

	var existingFeature0 = new ol.Feature({geometry: new ol.geom.Point([0, 1])});
	var existingFeature1 = new ol.Feature({geometry: new ol.geom.Point([1, 2])});
	var existingFeature2 = new ol.Feature({geometry: new ol.geom.Point([2, 3])});
	var existingFeature3 = new ol.Feature({geometry: new ol.geom.Point([3, 4])});

	var existingFeatures = [
		existingFeature0,
		existingFeature1,
		existingFeature2,
		existingFeature3
	];

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.store = function(){assert.ok(true);};

	draw.source.addFeatures(existingFeatures);
	draw.removed = ['mockFeature0', 'mockFeature1'];
	draw.gpsTrack = 'mockTrack';

	draw.clear();

	assert.equal(draw.source.getFeatures().length, 0);
	assert.equal(draw.removed.length, 0);
	assert.notOk(draw.gpsTrack);
});

QUnit.test('deactivate (drawing)', function(assert){
	assert.expect(11);

	var feature = new ol.Feature({geometry: new ol.geom.Point([1, 2])});

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.triggerFeatureEvent = function(event){
		assert.notOk(true);
	};

	draw.activate(nyc.ol.Draw.Type.CIRCLE);
	draw.mnuBtn.addClass('point line polygon circle square box free gps');

	draw.deactivate();

	assert.notOk(draw.type);
	assert.notOk(draw.mnuBtn.hasClass('point'));
	assert.notOk(draw.mnuBtn.hasClass('line'));
	assert.notOk(draw.mnuBtn.hasClass('polygon'));
	assert.notOk(draw.mnuBtn.hasClass('circle'));
	assert.notOk(draw.mnuBtn.hasClass('square'));
	assert.notOk(draw.mnuBtn.hasClass('box'));
	assert.notOk(draw.mnuBtn.hasClass('free'));
	assert.notOk(draw.mnuBtn.hasClass('gps'));
	assert.notOk(draw.drawer);
	assert.notOk($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	//make sure event handler is disconnected
	draw.source.addFeature(feature);
	feature.set('changed', true);
});

QUnit.test('deactivate (tracking)', function(assert){
	assert.expect(14);

	var feature = new ol.Feature({geometry: new ol.geom.Point([1, 2])});

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.closePolygon = function(eventType, feature){
		assert.equal(eventType, nyc.ol.FeatureEventType.CHANGE);
		assert.deepEqual(feature, draw.gpsTrack);
	};

	draw.activate(nyc.ol.Draw.Type.GPS);
	draw.mnuBtn.addClass('point line polygon circle square box free gps');

	draw.triggerFeatureEvent = function(event){
		assert.notOk(true);
	};

	draw.deactivate();

	assert.notOk(draw.type);
	assert.notOk(draw.tracker.getTracking());
	assert.notOk(draw.mnuBtn.hasClass('point'));
	assert.notOk(draw.mnuBtn.hasClass('line'));
	assert.notOk(draw.mnuBtn.hasClass('polygon'));
	assert.notOk(draw.mnuBtn.hasClass('circle'));
	assert.notOk(draw.mnuBtn.hasClass('square'));
	assert.notOk(draw.mnuBtn.hasClass('box'));
	assert.notOk(draw.mnuBtn.hasClass('free'));
	assert.notOk(draw.mnuBtn.hasClass('gps'));
	assert.notOk(draw.drawer);
	assert.notOk($.inArray(draw.modify, this.TEST_OL_MAP.getInteractions().getArray()) > -1);

	//make sure event handler is disconnected
	draw.source.addFeature(feature);
	feature.set('changed', true);
});

QUnit.test('createModify', function(assert){
	assert.expect(2);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	this.TEST_OL_MAP.removeInteraction(draw.modify);
	delete draw.modify;

	var deleteCondition = function(){/* mock deleteCondition proxy */};
	var proxy = $.proxy;
	$.proxy = function(fn, scope){
		if (fn === draw.deleteCondition && scope == draw){
			return deleteCondition;
		}
		return proxy(fn, scope);
	};

	draw.createModify();

	assert.ok(draw.modify.getProperties().features === draw.features);
	assert.ok(draw.modify.getProperties().deleteCondition === deleteCondition);

	$.proxy = proxy;
});

QUnit.test('boxGeometry', function(assert){
	assert.expect(14);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var box;
	var start = [0, 1];
	var end = [1, 2];

	box = draw.boxGeometry([start, end], box);
	assert.equal(box.getCoordinates().length, 1);
	assert.equal(box.getCoordinates()[0].length, 5);
	assert.deepEqual(box.getCoordinates()[0][0], start);
	assert.deepEqual(box.getCoordinates()[0][1], [start[0], end[1]]);
	assert.deepEqual(box.getCoordinates()[0][2], end);
	assert.deepEqual(box.getCoordinates()[0][3], [end[0], start[1]]);
	assert.deepEqual(box.getCoordinates()[0][4], start);

	start = [10, 20];
	end = [30, 40];

	box = draw.boxGeometry([start, end], box);
	assert.equal(box.getCoordinates().length, 1);
	assert.equal(box.getCoordinates()[0].length, 5);
	assert.deepEqual(box.getCoordinates()[0][0], start);
	assert.deepEqual(box.getCoordinates()[0][1], [start[0], end[1]]);
	assert.deepEqual(box.getCoordinates()[0][2], end);
	assert.deepEqual(box.getCoordinates()[0][3], [end[0], start[1]]);
	assert.deepEqual(box.getCoordinates()[0][4], start);
});

QUnit.test('deleteCondition', function(assert){
	assert.expect(5);

	var singleClick = ol.events.condition.singleClick;
	var noModifierKeys = ol.events.condition.noModifierKeys;
	ol.events.condition.singleClick = function(event){
		return event.singleClick;
	};
	ol.events.condition.noModifierKeys = function(event){
		return event.noModifierKeys;
	};

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.escape = function(){
		assert.ok(true);
	};

	assert.notOk(draw.deleteCondition({singleClick: false, noModifierKeys: false}));
	assert.notOk(draw.deleteCondition({singleClick: true, noModifierKeys: false}));
	assert.ok(draw.deleteCondition({singleClick: true, noModifierKeys: true}));
	assert.notOk(draw.deleteCondition({singleClick: false, noModifierKeys: true}));

	ol.events.condition.singleClick = singleClick;
	ol.events.condition.noModifierKeys = noModifierKeys;
});

QUnit.test('drawCondition', function(assert){
	assert.expect(20);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var div = $('<div></div>');
	var originalEvent = {target: div};

	originalEvent.button = 1;
	originalEvent.shiftKey = false;
	div.removeClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.ok(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = false;
	div.removeClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = true;
	div.removeClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = true;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = true;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(true);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 1;
	originalEvent.shiftKey = true;
	div.removeClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 1;
	originalEvent.shiftKey = false;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 1;
	originalEvent.shiftKey = false;
	div.removeClass('draw-mnu-btn');
	draw.mover.setActive(true);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 1;
	originalEvent.shiftKey = true;
	div.removeClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = true;
	div.removeClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = true;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = true;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(true);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 1;
	originalEvent.shiftKey = false;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = false;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = true;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(false);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = true;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(true);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 1;
	originalEvent.shiftKey = false;
	div.removeClass('draw-mnu-btn');
	draw.mover.setActive(true);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 1;
	originalEvent.shiftKey = false;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(true);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 1;
	originalEvent.shiftKey = true;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(true);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));

	originalEvent.button = 2;
	originalEvent.shiftKey = true;
	div.addClass('draw-mnu-btn');
	draw.mover.setActive(true);
	assert.notOk(draw.drawCondition({originalEvent: originalEvent}));
});

QUnit.test('freehandCondition', function(assert){
	assert.expect(18);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	draw.drawCondition = function(mapEvt){
		return mapEvt.condition;
	};

	draw.type = nyc.ol.Draw.Type.NONE;
	assert.notOk(draw.freehandCondition({condition: false}));
	assert.notOk(draw.freehandCondition({condition: true}));

	draw.type = nyc.ol.Draw.Type.POINT;
	assert.notOk(draw.freehandCondition({condition: false}));
	assert.notOk(draw.freehandCondition({condition: true}));

	draw.type = nyc.ol.Draw.Type.LINE;
	assert.notOk(draw.freehandCondition({condition: false}));
	assert.notOk(draw.freehandCondition({condition: true}));

	draw.type = nyc.ol.Draw.Type.POLYGON;
	assert.notOk(draw.freehandCondition({condition: false}));
	assert.notOk(draw.freehandCondition({condition: true}));

	draw.type = nyc.ol.Draw.Type.CIRCLE;
	assert.notOk(draw.freehandCondition({condition: false}));
	assert.notOk(draw.freehandCondition({condition: true}));

	draw.type = nyc.ol.Draw.Type.SQUARE;
	assert.notOk(draw.freehandCondition({condition: false}));
	assert.notOk(draw.freehandCondition({condition: true}));

	draw.type = nyc.ol.Draw.Type.BOX;
	assert.notOk(draw.freehandCondition({condition: false}));
	assert.notOk(draw.freehandCondition({condition: true}));

	draw.type = nyc.ol.Draw.Type.GPS;
	assert.notOk(draw.freehandCondition({condition: false}));
	assert.notOk(draw.freehandCondition({condition: true}));

	draw.type = nyc.ol.Draw.Type.FREE;
	assert.notOk(draw.freehandCondition({condition: false}));
	assert.ok(draw.freehandCondition({condition: true}));
});

QUnit.test('accuracyStyle', function(assert){
	assert.expect(10);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var feature = new ol.Feature({
		geometry: new ol.geom.Point([1, 2]),
		accuracy: 100
	});

	var resolution = nyc.ol.TILE_GRID.getResolutions()[0];
	var style = draw.accuracyStyle(feature, resolution);
	assert.equal(style.getImage().getRadius(), 100/resolution);
	assert.equal(style.getImage().getFill().getColor(), 'rgba(255,255,0,.03)');
	assert.equal(style.getImage().getStroke().getColor(), 'rgba(255,255,0,1)');
	assert.equal(style.getImage().getStroke().getWidth(), .25);
	assert.equal(style.getZIndex(), 100);

	feature.set('accuracy', 20)
	resolution = nyc.ol.TILE_GRID.getResolutions()[15];
	style = draw.accuracyStyle(feature, resolution);
	assert.equal(style.getImage().getRadius(), 20/resolution);
	assert.equal(style.getImage().getFill().getColor(), 'rgba(255,255,0,.03)');
	assert.equal(style.getImage().getStroke().getColor(), 'rgba(255,255,0,1)');
	assert.equal(style.getImage().getStroke().getWidth(), .25);
	assert.equal(style.getZIndex(), 100);
});

QUnit.test('defaultStyle', function(assert){
	assert.expect(18);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	var feature = new ol.Feature({
		geometry: new ol.geom.Point([1, 2]),
		accuracy: 100
	});

	var resolution = nyc.ol.TILE_GRID.getResolutions()[0];
	var style = draw.defaultStyle(feature, resolution);

	assert.equal(style.length, 3);
	assert.equal(style[0].getFill().getColor(), 'rgba(255,255,255,.2)');
	assert.equal(style[0].getZIndex(), 0);

	assert.equal(style[1].getStroke().getColor(), 'red');
	assert.equal(style[1].getStroke().getWidth(), 3);
	assert.equal(style[1].getZIndex(), 200);

	assert.equal(style[2].getImage().getRadius(), 3);
	assert.equal(style[2].getImage().getFill().getColor(), 'red');
	assert.equal(style[2].getZIndex(), 300);

	feature.set('accuracy', undefined);
	resolution = nyc.ol.TILE_GRID.getResolutions()[17];
	style = draw.defaultStyle(feature, resolution);

	assert.equal(style.length, 3);
	assert.equal(style[0].getFill().getColor(), 'rgba(255,255,255,.2)');
	assert.equal(style[0].getZIndex(), 0);

	assert.equal(style[1].getStroke().getColor(), 'red');
	assert.equal(style[1].getStroke().getWidth(), 3);
	assert.equal(style[1].getZIndex(), 200);

	assert.equal(style[2].getImage().getRadius(), 7);
	assert.equal(style[2].getImage().getFill().getColor(), 'red');
	assert.equal(style[2].getZIndex(), 300);
});

QUnit.test('getGpsTrack', function(assert){
	assert.expect(12);

	var draw = new nyc.ol.Draw({
		map: this.TEST_OL_MAP
	});

	assert.notOk(draw.gpsTrack);
	assert.notOk($.inArray(draw.gpsTrack, draw.features.getArray()) > -1);
	var track0 = draw.getGpsTrack();

	assert.notOk(track0.getGeometry().getCoordinates().length);
	assert.equal(track0.getGeometry().getLayout(), 'XYZM');
	assert.ok(track0 === draw.gpsTrack);

	draw.source.clear();
	var track1 = draw.getGpsTrack();
	assert.notOk(track1.getGeometry().getCoordinates().length);
	assert.equal(track1.getGeometry().getLayout(), 'XYZM');
	assert.ok(track1 === draw.gpsTrack);

	var track2 = draw.getGpsTrack();
	assert.notOk(track1.getGeometry().getCoordinates().length);
	assert.equal(track1.getGeometry().getLayout(), 'XYZM');
	assert.ok(track2 === draw.gpsTrack);
	assert.ok(track2 === track1);
});
