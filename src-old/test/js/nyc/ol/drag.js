QUnit.module('nyc.ol.Drag', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('constructor', function(assert){
  assert.expect(5);

  var layer = new ol.layer.Vector();

  var drag = new nyc.ol.Drag(layer);

  assert.ok(drag.layer == layer);
  assert.ok(drag.handleDownEvent === nyc.ol.Drag.prototype.handleDownEvent);
  assert.ok(drag.handleDragEvent === nyc.ol.Drag.prototype.handleDragEvent);
  assert.ok(drag.handleMoveEvent === nyc.ol.Drag.prototype.handleMoveEvent);
  assert.ok(drag.handleUpEvent === nyc.ol.Drag.prototype.handleUpEvent);
});

QUnit.test('handleDownEvent (hit)', function(assert){
  assert.expect(4);

  var layer = new ol.layer.Vector();
  var feature = new ol.Feature();
  var mockMap = {
    forEachFeatureAtPixel: function(pix, fn){
      assert.equal(pix, 'mock-pixel');
      return fn(feature, layer);
    }
  };

  var drag = new nyc.ol.Drag(layer);

  var result = drag.handleDownEvent({
    map: mockMap,
    pixel: 'mock-pixel',
    coordinate: 'mock-coordinate'
  });

  assert.ok(result);
  assert.ok(drag.feature === feature);
  assert.equal(drag.coords, 'mock-coordinate');
});

QUnit.test('handleDownEvent (no hit)', function(assert){
  assert.expect(4);

  var layer = new ol.layer.Vector();
  var feature = new ol.Feature();
  var mockMap = {
    forEachFeatureAtPixel: function(pix, fn){
      assert.equal(pix, 'mock-pixel');
      return fn(feature, 'mock-layer');
    }
  };

  var drag = new nyc.ol.Drag(layer);

  var result = drag.handleDownEvent({
    map: mockMap,
    pixel: 'mock-pixel',
    coordinate: 'mock-coordinate'
  });

  assert.notOk(result);
  assert.notOk(drag.feature);
  assert.notOk(drag.coords);
});

QUnit.test('handleDragEvent', function(assert){
  assert.expect(4);

  var layer = new ol.layer.Vector();

  var geometry = new ol.geom.Point([0, 0]);
  geometry.translate = function(x, y){
    assert.equal(x, 3 - 1);
    assert.equal(y, 4 - 10);
  };

  var drag = new nyc.ol.Drag(layer);

  drag.feature = new ol.Feature({geometry: geometry});
  drag.coords = [1, 10];

  drag.handleDragEvent({coordinate: [3, 4]});

  assert.equal(drag.coords[0], 3);
  assert.equal(drag.coords[1], 4);
});

QUnit.test('handleMoveEvent (hit)', function(assert){
  assert.expect(2);

  var layer = new ol.layer.Vector();
  var feature = new ol.Feature();
  this.TEST_OL_MAP.forEachFeatureAtPixel = function(pix, fn){
    assert.equal(pix, 'mock-pixel');
    return fn(feature, layer);
  };

  var drag = new nyc.ol.Drag(layer);

  drag.handleMoveEvent({
    map: this.TEST_OL_MAP,
    pixel: 'mock-pixel'
  });

  assert.equal($(this.TEST_OL_MAP.getViewport()).css('cursor'), 'move');
});

QUnit.test('handleMoveEvent (no hit)', function(assert){
  assert.expect(4);

  var layer = new ol.layer.Vector();
  var feature = new ol.Feature();
  this.TEST_OL_MAP.forEachFeatureAtPixel = function(pix, fn){
    assert.equal(pix, 'mock-pixel');
    return fn(feature, 'mock-layer');
  };

  var drag = new nyc.ol.Drag(layer);

  assert.ok(this.TEST_OL_MAP.getViewport());
  var cursor = $(this.TEST_OL_MAP.getViewport()).css('cursor');
  assert.notEqual(cursor, 'move');

  drag.handleMoveEvent({
    map: this.TEST_OL_MAP,
    pixel: 'mock-pixel'
  });

  assert.equal($(this.TEST_OL_MAP.getViewport()).css('cursor'), cursor);
});

QUnit.test('handleUpEvent', function(assert){
  assert.expect(5);

  var layer = new ol.layer.Vector();

  var drag = new nyc.ol.Drag(layer);

  drag.coords = 'mock-coords';
  drag.feature = 'mock-feature';
  drag.setActive = function(active){
    assert.notOk(active);
  };

  $(this.TEST_OL_MAP.getViewport()).css('cursor', 'move');

  assert.notOk(drag.handleUpEvent({
    map: this.TEST_OL_MAP
  }));

  assert.notEqual($(this.TEST_OL_MAP.getViewport()).css('cursor'), 'move');
  assert.notOk(drag.coords);
  assert.notOk(drag.feature);

});
