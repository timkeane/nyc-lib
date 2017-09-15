QUnit.module('nyc.ol.Drag', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
		$('.draw-btn, .draw-btn-mnu, .draw-ctx-mnu').remove();
	}
});

QUnit.test('constructor', function(assert){
  assert.expect(0);
});
