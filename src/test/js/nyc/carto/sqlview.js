QUnit.module('nyc.carto.SqlView', {
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
		"  a.entity_count,\n" +
		" '${displayType}' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS entity_count, the_geom_webmercator\n" +
		"    FROM entity_table\n" +
		"    WHERE ${where}\n" +
		"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
		"    GROUP BY the_geom_webmercator\n" +
		"  ) a";
		  					
	var filters = {
		type: "type = '${type}'",
		mo: "mo BETWEEN ${start} AND ${end}"
	};

	var view = new nyc.carto.SqlView({
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
		"  a.entity_count,\n" +
		" 'type' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS entity_count, the_geom_webmercator\n" +
		"    FROM entity_table\n" +
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
		"  a.entity_count,\n" +
		" '${displayType}' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS entity_count, the_geom_webmercator\n" +
		"    FROM entity_table\n" +
		"    WHERE ${where}\n" +
		"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
		"    GROUP BY the_geom_webmercator\n" +
		"  ) a";
	var filters = {
		type: "type = '${type}'",
		mo: "mo BETWEEN ${start} AND ${end}"
	};

	var view = new nyc.carto.SqlView({
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
		"  a.entity_count,\n" +
		" 'type' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS entity_count, the_geom_webmercator\n" +
		"    FROM entity_table\n" +
		"    WHERE mo BETWEEN 0 AND 1 AND type = 'type'\n" +
		"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
		"    GROUP BY the_geom_webmercator\n" +
		"  ) a"
	);
	assert.equal(this.MOCK_LEGEND.desc, '<b>type per 1000 Residents by Location<br>dates</b>');
	assert.notOk(this.MOCK_LEGEND.bins);
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
		"  a.entity_count,\n" +
		" '${displayType}' AS type,\n" +
		"  ST_X(a.the_geom_webmercator) AS x,\n" +
		"  ST_Y(a.the_geom_webmercator) AS y\n" +
		"FROM\n" +
		"  (\n" +
		"    SELECT\n" +
		"    COUNT(*) AS entity_count, the_geom_webmercator\n" +
		"    FROM entity_table\n" +
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
			"  a.entity_count,\n" +
			" 'type' AS type,\n" +
			"  ST_X(a.the_geom_webmercator) AS x,\n" +
			"  ST_Y(a.the_geom_webmercator) AS y\n" +
			"FROM\n" +
			"  (\n" +
			"    SELECT\n" +
			"    COUNT(*) AS entity_count, the_geom_webmercator\n" +
			"    FROM entity_table\n" +
			"    WHERE mo BETWEEN 0 AND 1 AND type = 'type'\n" +
			"    	AND ST_CONTAINS(ST_MAKEENVELOPE(-74.257, 40.496, -73.699, 40.916, 4326), the_geom)\n" +
			"    GROUP BY the_geom_webmercator\n" +
			"  ) a"
		);
	});
});
