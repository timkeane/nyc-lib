QUnit.module('nyc.carto.HeatSymbolizer', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('symbolize', function(assert){
	assert.expect(38);
	
	var MockMap = function(){
		this.zoom = -1;
		this.getZoom = function(){
			return this.zoom;
		}
	};
	nyc.inherits(MockMap, nyc.EventHandling);
	var map = new MockMap();
	var layer = this.MOCK_CARTODB_LAYER;
	
	var options = {
		map: map,
		layer: layer,
		css: '#carto_css{marker-width:${size};}' +
			'#carto_css_2{marker-width:${sizePlus2};}' +
			'#carto_css_4{marker-width:${sizePlus4};}'
	};
	var symbolizer = new nyc.carto.HeatSymbolizer(options);

	for (var zoom = 0; zoom < 19; zoom++){
		var idx = zoom - 10;
		var size = symbolizer.sizes[idx] || 1;
		map.zoom = zoom;
		symbolizer.one(nyc.carto.Symbolizer.EventType.SYMBOLIZED, function(css){
			assert.equal(css, '#carto_css{marker-width:' + size + ';}' +
					'#carto_css_2{marker-width:' + (size + 2) + ';}' +
					'#carto_css_4{marker-width:' + (size + 4) + ';}')
			assert.equal(layer.css, css);
		});
		map.trigger('zoomend');
	}

});

QUnit.module('nyc.carto.JenksSymbolizer', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('symbolize (has outlierFilter, 5 bins returned)', function(assert){
	assert.expect(3);
	
	var options = {
		cartoSql: this.MOCK_CARTO_SQL,
		jenksColumn: 'jenks_col',
		baseCss: '#carto_css{}',
		cssRules: ['#rule1[${value}]{}', '#rule2[${value}]{}', '#rule3[${value}]{}', '#rule4[${value}]{}', '#rule5[${value}]{}'],
		outlierFilter: 'outlierFilter'
	};
	this.MOCK_CARTO_SQL.returnDatas = [{rows: [{cdb_jenksbins: [1, 2, 3, 4, 5]}]}]; 
	
	var symbolizer = new nyc.carto.JenksSymbolizer(options);
	symbolizer.on(nyc.carto.Symbolizer.EventType.SYMBOLIZED, function(bins){
		assert.deepEqual(bins, [1, 2, 3, 4, 5]);
	});
	
	symbolizer.symbolize(this.MOCK_CARTODB_LAYER);
	
	assert.equal(this.MOCK_CARTO_SQL.sqls[0], 'SELECT CDB_JENKSBINS(ARRAY_AGG(a.jenks_col::numeric), 5) FROM (LAYER_SQL) a WHERE a.jenks_col IS NOT NULL AND outlierFilter');
	assert.equal(this.MOCK_CARTODB_LAYER.css, '#carto_css{}#rule5[5]{}#rule4[4]{}#rule3[3]{}#rule2[2]{}#rule1[1]{}'); 
});

QUnit.test('symbolize (no outlierFilter, 4 bins returned)', function(assert){
	assert.expect(3);
	
	var options = {
		cartoSql: this.MOCK_CARTO_SQL,
		jenksColumn: 'jenks_col',
		baseCss: '#carto_css{}',
		cssRules: ['#rule1[${value}]{}', '#rule2[${value}]{}', '#rule3[${value}]{}', '#rule4[${value}]{}', '#rule5[${value}]{}']
	};
	this.MOCK_CARTO_SQL.returnDatas = [{rows: [{cdb_jenksbins: [1, 2, 3, 4]}]}]; 
	
	var symbolizer = new nyc.carto.JenksSymbolizer(options);
	symbolizer.on(nyc.carto.Symbolizer.EventType.SYMBOLIZED, function(bins){
		assert.deepEqual(bins, [1, 2, 3, 4]);
	});
	
	symbolizer.symbolize(this.MOCK_CARTODB_LAYER);
	
	assert.equal(this.MOCK_CARTO_SQL.sqls[0], 'SELECT CDB_JENKSBINS(ARRAY_AGG(a.jenks_col::numeric), 5) FROM (LAYER_SQL) a WHERE a.jenks_col IS NOT NULL');
	assert.equal(this.MOCK_CARTODB_LAYER.css, '#carto_css{}#rule4[4]{}#rule3[3]{}#rule2[2]{}#rule1[1]{}'); 
});
