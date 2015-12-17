QUnit.module('nyc.carto.ParamsView', {
	beforeEach: function(assert){
		setup(assert, this);
		var MockSymbolizer = function(){};
		MockSymbolizer.prototype = {
			layer: null,
			filterValues: null,
			symbolize: function(layer, filterValues){
				this.layer = layer;
				this.filterValues = filterValues;
				this.trigger(nyc.carto.Symbolizer.EventType.SYMBOLIZED, 'bins');
			}
		};
		nyc.inherits(MockSymbolizer, nyc.EventHandling);
		
		this.MOCK_SYMBOLIZER = new MockSymbolizer();
		
		this.MOCK_LEGEND = {
			desc: null,
			bins: null,
			html: function(desc, bins){
				this.desc = desc;
				this.bins = bins;
				return 'legendHtml';
			}
		};
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.MOCK_SYMBOLIZER;
		delete this.MOCK_LEGEND;
	}
});

QUnit.test('update (has symbolizer)', function(assert){
	assert.expect(5);
		  					
	var view = new nyc.carto.ParamsView({
		name: 'precinct',
		layer: this.MOCK_CARTODB_LAYER,
		descriptionTemplate: '<b>${displayType} per 1000 Residents by Location<br>${displayDates}</b>',
		symbolizer: this.MOCK_SYMBOLIZER,
		legend: this.MOCK_LEGEND
	});
	
	view.one('updated', function(html){
		assert.equal(html, 'legendHtml');
	});
	
	view.update({mo: {start: '0', end: '1'}, displayType:{displayType: 'displayType'}, type: {type: 'type'}}, {displayType: 'displayType', displayDates: 'dates'});
	
	assert.deepEqual(
		this.MOCK_CARTODB_LAYER.params, 		
		{start: '0', end: '1', displayType: 'displayType', type: 'type'}
	);
	assert.deepEqual(this.MOCK_SYMBOLIZER.layer, this.MOCK_CARTODB_LAYER);
	assert.equal(this.MOCK_LEGEND.desc, '<b>displayType per 1000 Residents by Location<br>dates</b>');
	assert.equal(this.MOCK_LEGEND.bins, 'bins');
});

QUnit.test('update (no symbolizer)', function(assert){
	assert.expect(4);
		
	var view = new nyc.carto.ParamsView({
		name: 'precinct',
		layer: this.MOCK_CARTODB_LAYER,
		descriptionTemplate: '<b>${displayType} per 1000 Residents by Location<br>${displayDates}</b>',
		legend: this.MOCK_LEGEND
	});
	
	view.one('updated', function(html){
		assert.equal(html, 'legendHtml');
	});
	
	view.update({mo: {start: '0', end: '1'}, displayType:{displayType: 'displayType'}, type: {type: 'type'}}, {displayType: 'displayType', displayDates: 'dates'});
	
	assert.deepEqual(
		this.MOCK_CARTODB_LAYER.params, 		
		{start: '0', end: '1', displayType: 'displayType', type: 'type'}
		);
	assert.equal(this.MOCK_LEGEND.desc, '<b>displayType per 1000 Residents by Location<br>dates</b>');
	assert.notOk(this.MOCK_LEGEND.bins);
});

