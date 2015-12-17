QUnit.module('nyc.carto.SqlJenksSymbolizer', {
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
	
	var symbolizer = new nyc.carto.SqlJenksSymbolizer(options);
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
	
	var symbolizer = new nyc.carto.SqlJenksSymbolizer(options);
	symbolizer.on(nyc.carto.Symbolizer.EventType.SYMBOLIZED, function(bins){
		assert.deepEqual(bins, [1, 2, 3, 4]);
	});
	
	symbolizer.symbolize(this.MOCK_CARTODB_LAYER);
	
	assert.equal(this.MOCK_CARTO_SQL.sqls[0], 'SELECT CDB_JENKSBINS(ARRAY_AGG(a.jenks_col::numeric), 5) FROM (LAYER_SQL) a WHERE a.jenks_col IS NOT NULL');
	assert.equal(this.MOCK_CARTODB_LAYER.css, '#carto_css{}#rule4[4]{}#rule3[3]{}#rule2[2]{}#rule1[1]{}'); 
});

QUnit.module('nyc.carto.ParamsJenksSymbolizer', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('symbolize (maxBins bins returned)', function(assert){
	assert.expect(3);

	var layer = this.MOCK_CARTODB_LAYER;
	
	var sql = this.MOCK_NYC_CARTO_SQL;
	sql.returnData = {rows: [{cdb_jenksbins: [1, 2, 3, 4, 6]}]}; 

	var symbolizer = new nyc.carto.ParamsJenksSymbolizer(this.MOCK_NYC_CARTO_SQL, 5);
	symbolizer.on(nyc.carto.Symbolizer.EventType.SYMBOLIZED, function(bins){
		assert.equal(sql.filterValues, 'MOCK_FILTER_VALUES');
		assert.deepEqual(bins, [1, 2, 3, 4, 6]);
		assert.deepEqual(layer.params, {bin0: 1, bin1: 2, bin2: 3, bin3: 4, bin4: 6});
	});
	
	symbolizer.symbolize(layer, 'MOCK_FILTER_VALUES');
});

QUnit.test('symbolize (less than maxBins bins returned)', function(assert){
	assert.expect(3);

	var layer = this.MOCK_CARTODB_LAYER;
	
	var sql = this.MOCK_NYC_CARTO_SQL;
	sql.returnData = {rows: [{cdb_jenksbins: [1, 2, 3, 4]}]}; 

	var symbolizer = new nyc.carto.ParamsJenksSymbolizer(this.MOCK_NYC_CARTO_SQL, 5);
	symbolizer.on(nyc.carto.Symbolizer.EventType.SYMBOLIZED, function(bins){
		assert.equal(sql.filterValues, 'MOCK_FILTER_VALUES');
		assert.deepEqual(bins, [1, 2, 3, 4]);
		assert.deepEqual(layer.params, {bin0: 1, bin1: 2, bin2: 3, bin3: 4, bin4: null});
	});
	
	symbolizer.symbolize(layer, 'MOCK_FILTER_VALUES');
});