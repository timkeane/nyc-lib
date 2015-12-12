QUnit.module('nyc.carto.SqlTemplate', {});

QUnit.test('sql', function(assert){
	assert.expect(3);

	var sql = new nyc.carto.SqlTemplate();
	var template = "SELECT '${something}' AS something FROM everything WHERE ${where}";
	var filters = {
	   col_a: "col_a = '${col_a}'",	
	   col_b: "col_b > ${col_b}",	
	   col_c: "col_c BETWEEN ${col_c_0} AND ${col_c_1}"
	};

	var result = sql.sql(template, {something: {something: 'nothing'}, col_a: {col_a: 'valueA'}}, filters);
	assert.equal(result, "SELECT 'nothing' AS something FROM everything WHERE col_a = 'valueA'");

	result = sql.sql(template, {something: {something: 'nothing'}, col_a: {col_a: 'valueA'}, col_b: {col_b: 100}}, filters);
	assert.equal(result, "SELECT 'nothing' AS something FROM everything WHERE col_a = 'valueA' AND col_b > 100");

	result = sql.sql(template, {something: {something: 'nothing'}, col_a: {col_a: 'valueA'}, col_b: {col_b: 100}, col_c: {col_c_0: 1, col_c_1: 2}}, filters);
	assert.equal(result, "SELECT 'nothing' AS something FROM everything WHERE col_a = 'valueA' AND col_b > 100 AND col_c BETWEEN 1 AND 2");
});

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

QUnit.module('nyc.carto.View', {
	beforeEach: function(assert){
		setup(assert, this);
		var MockSymbolizer = function(){};
		MockSymbolizer.prototype = {
			layer: null,
			symbolize: function(layer){
				this.layer = layer;
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
		
	var locationSql = 
		"SELECT\n" +
		"  ROW_NUMBER() OVER() AS cartodb_id,\n" +
		"  a.the_geom_webmercator,\n" +
		"  a.crime_count,\n" +
		" '${displayType}' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS crime_count, the_geom_webmercator\n" +
		"    FROM stg_crime_location\n" +
		"    WHERE ${where}\n" +
		"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
		"    GROUP BY the_geom_webmercator\n" +
		"  ) a";
		  					
	var filters = {
		type: "type = '${type}'",
		mo: "mo BETWEEN ${start} AND ${end}"
	};

	var view = new nyc.carto.View({
		name: 'precinct',
		layer: this.MOCK_CARTODB_LAYER,
		sqlTemplate: locationSql,
		descriptionTemplate: '<b>${displayType} per 1000 Residents by Location<br>${displayDates}</b>',
		filters: filters,
		symbolizer: this.MOCK_SYMBOLIZER,
		legend: this.MOCK_LEGEND
	});
	
	view.one('updated', function(html){
		assert.equal(html, 'legendHtml');
	});
	
	view.update({mo: {start: '0', end: '1'}, displayType:{displayType: 'type'}, type: {type: 'type'}}, {displayType: 'type', displayDates: 'dates'});
	
	assert.equal(
		this.MOCK_CARTODB_LAYER.sql, 		
		"SELECT\n" +
		"  ROW_NUMBER() OVER() AS cartodb_id,\n" +
		"  a.the_geom_webmercator,\n" +
		"  a.crime_count,\n" +
		" 'type' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS crime_count, the_geom_webmercator\n" +
		"    FROM stg_crime_location\n" +
		"    WHERE mo BETWEEN 0 AND 1 AND type = 'type'\n" +
		"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
		"    GROUP BY the_geom_webmercator\n" +
		"  ) a"
	);
	assert.deepEqual(this.MOCK_SYMBOLIZER.layer, this.MOCK_CARTODB_LAYER);
	assert.equal(this.MOCK_LEGEND.desc, '<b>type per 1000 Residents by Location<br>dates</b>');
	assert.equal(this.MOCK_LEGEND.bins, 'bins');
});

QUnit.test('update (no symbolizer)', function(assert){
	assert.expect(4);
		
	var locationSql = 
		"SELECT\n" +
		"  ROW_NUMBER() OVER() AS cartodb_id,\n" +
		"  a.the_geom_webmercator,\n" +
		"  a.crime_count,\n" +
		" '${displayType}' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS crime_count, the_geom_webmercator\n" +
		"    FROM stg_crime_location\n" +
		"    WHERE ${where}\n" +
		"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
		"    GROUP BY the_geom_webmercator\n" +
		"  ) a";
	var filters = {
		type: "type = '${type}'",
		mo: "mo BETWEEN ${start} AND ${end}"
	};

	var view = new nyc.carto.View({
		name: 'precinct',
		layer: this.MOCK_CARTODB_LAYER,
		sqlTemplate: locationSql,
		descriptionTemplate: '<b>${displayType} per 1000 Residents by Location<br>${displayDates}</b>',
		filters: filters,
		legend: this.MOCK_LEGEND
	});
	
	view.one('updated', function(html){
		assert.equal(html, 'legendHtml');
	});
	
	view.update({mo: {start: '0', end: '1'}, displayType:{displayType: 'type'}, type: {type: 'type'}}, {displayType: 'type', displayDates: 'dates'});
	
	assert.equal(
		this.MOCK_CARTODB_LAYER.sql, 		
		"SELECT\n" +
		"  ROW_NUMBER() OVER() AS cartodb_id,\n" +
		"  a.the_geom_webmercator,\n" +
		"  a.crime_count,\n" +
		" 'type' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS crime_count, the_geom_webmercator\n" +
		"    FROM stg_crime_location\n" +
		"    WHERE mo BETWEEN 0 AND 1 AND type = 'type'\n" +
		"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
		"    GROUP BY the_geom_webmercator\n" +
		"  ) a"
	);
	assert.equal(this.MOCK_LEGEND.desc, '<b>type per 1000 Residents by Location<br>dates</b>');
	assert.notOk(this.MOCK_LEGEND.bins);
});

QUnit.test('visibility', function(assert){
	assert.expect(2);

	var view = new nyc.carto.View({layer: this.MOCK_CARTODB_LAYER});
	
	view.visibility(true);
	assert.equal(this.MOCK_CARTODB_LAYER.showHide, 'show');
	view.visibility(false);
	assert.equal(this.MOCK_CARTODB_LAYER.showHide, 'hide');
});

QUnit.module('nyc.carto.Dao', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('data', function(assert){
	assert.expect(2);
	
	var cartoSql = this.MOCK_CARTO_SQL;
	var locationSql = 
		"SELECT\n" +
		"  ROW_NUMBER() OVER() AS cartodb_id,\n" +
		"  a.the_geom_webmercator,\n" +
		"  a.crime_count,\n" +
		" '${displayType}' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS crime_count, the_geom_webmercator\n" +
		"    FROM stg_crime_location\n" +
		"    WHERE ${where}\n" +
		"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
		"    GROUP BY the_geom_webmercator\n" +
		"  ) a";
	var filters = {
			type: "type = '${type}'",
			mo: "mo BETWEEN ${start} AND ${end}"
		};

	var dao = new nyc.carto.Dao(cartoSql, locationSql, filters);
	this.MOCK_CARTO_SQL.returnDatas = ['returnData'];
	
	dao.data({mo: {start: '0', end: '1'}, displayType:{displayType: 'type'}, type: {type: 'type'}}, function(data){
		assert.equal(data, 'returnData');
		assert.equal(
			cartoSql.sqls[0], 		
			"SELECT\n" +
			"  ROW_NUMBER() OVER() AS cartodb_id,\n" +
			"  a.the_geom_webmercator,\n" +
			"  a.crime_count,\n" +
			" 'type' AS type,\n" +
			"  ST_X(a.the_geom_webmercator) AS x,\n" +
			"  ST_Y(a.the_geom_webmercator) AS y\n" +
			"FROM\n" +
			"  (\n" +
			"    SELECT\n" +
			"    COUNT(*) AS crime_count, the_geom_webmercator\n" +
			"    FROM stg_crime_location\n" +
			"    WHERE mo BETWEEN 0 AND 1 AND type = 'type'\n" +
			"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
			"    GROUP BY the_geom_webmercator\n" +
			"  ) a"
		);
	});
});
