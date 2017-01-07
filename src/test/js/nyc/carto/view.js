QUnit.module('nyc.carto.View', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.MOCK_SYMBOLIZER;
		delete this.MOCK_LEGEND;
	}
});
QUnit.test('visibility', function(assert){
	assert.expect(2);

	var view = new nyc.carto.SqlView({layer: this.MOCK_CARTODB_LAYER});
	
	view.visibility(true);
	assert.equal(this.MOCK_CARTODB_LAYER.showHide, 'show');
	view.visibility(false);
	assert.equal(this.MOCK_CARTODB_LAYER.showHide, 'hide');
});

