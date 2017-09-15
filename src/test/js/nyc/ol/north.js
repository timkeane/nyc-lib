QUnit.module('nyc.ol.NorthArrow', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(4);

  var rotate = nyc.ol.NorthArrow.prototype.rotate;
  nyc.ol.NorthArrow.prototype.rotate = function(){
    assert.ok(true);
  };

  var north = new nyc.ol.NorthArrow(this.TEST_OL_MAP);

  assert.equal(north.arrow.length, 1);
  assert.ok(north.arrow.parent().get(0) === this.TEST_OL_MAP.getTarget());

  north.view.dispatchEvent('change:rotation');

  nyc.ol.NorthArrow.prototype.rotate = rotate;
});

QUnit.test('rotate', function(assert){
	assert.expect(4);

  var north = new nyc.ol.NorthArrow(this.TEST_OL_MAP);

  north.view.setRotation(1);

  var arrow = north.arrow.get(0);
  assert.equal(arrow.style.transform, 'rotate(1rad)');
  assert.equal(arrow.style['-webkit-transform'], 'rotate(1rad)');

  north.view.setRotation(2);
  assert.equal(arrow.style.transform, 'rotate(2rad)');
  assert.equal(arrow.style['-webkit-transform'], 'rotate(2rad)');
});
