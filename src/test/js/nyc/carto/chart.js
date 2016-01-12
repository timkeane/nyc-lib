QUnit.module('nyc.nyc.carto.Chart', {
	beforeEach: function(assert){
		setup(assert, this);
		this.SQL_TEMPLATE = 
			"SELECT\n" +
			"  p.boro,\n" +
			"  p.pop,\n" +
			"  p.pct,\n" +
			"  '${displayType}' AS type,\n" +
			"  ROUND((1000*c.crime_count/p.pop)::numeric, 4) AS per1000\n" +
			"FROM\n" +
			"  stg_crime_precinct p,\n" +
			"  (\n" +
			"    SELECT COUNT(*) as crime_count, pct\n" + 
			"      FROM stg_crime_location\n" +
			"      WHERE ${where}\n" +
			"      GROUP BY pct\n" +
			"  ) c\n" +
			"WHERE p.pct = c.pct\n" +
			"	AND p.pct NOT IN (22, -99)\n" +
			"ORDER BY p.pct";
		this.FILTERS = {
			type: "type = '${type}'",
			mo: "mo BETWEEN ${start} AND ${end}"
		};
		this.SERIES_SQL = [
			"SELECT\n" +
			"  p.boro,\n" +
			"  p.pop,\n" +
			"  p.pct,\n" +
			"  'Crimes' AS type,\n" +
			"  ROUND((1000*c.crime_count/p.pop)::numeric, 4) AS per1000\n" +
			"FROM\n" +
			"  stg_crime_precinct p,\n" +
			"  (\n" +
			"    SELECT COUNT(*) as crime_count, pct\n" + 
			"      FROM stg_crime_location\n" +
			"      WHERE mo BETWEEN 201507 AND 201507\n" +
			"      GROUP BY pct\n" +
			"  ) c\n" +
			"WHERE p.pct = c.pct\n" +
			"	AND p.pct NOT IN (22, -99)\n" +
			"ORDER BY p.pct",	
			"SELECT\n" +
			"  p.boro,\n" +
			"  p.pop,\n" +
			"  p.pct,\n" +
			"  'Crimes' AS type,\n" +
			"  ROUND((1000*c.crime_count/p.pop)::numeric, 4) AS per1000\n" +
			"FROM\n" +
			"  stg_crime_precinct p,\n" +
			"  (\n" +
			"    SELECT COUNT(*) as crime_count, pct\n" + 
			"      FROM stg_crime_location\n" +
			"      WHERE mo BETWEEN 201407 AND 201407\n" +
			"      GROUP BY pct\n" +
			"  ) c\n" +
			"WHERE p.pct = c.pct\n" +
			"	AND p.pct NOT IN (22, -99)\n" +
			"ORDER BY p.pct"
        ];
		this.FILTER_VALUES = [{
				mo: {start: 201507, end: 201507},
				displayType: {displayType: 'Crimes'},
				pct: {pct: 7},
				boro: {boro: 1},
				boroName: {boroName: 'Manhattan'}
			},
			{
				mo: {start: 201407, end: 201407},
				displayType: {displayType: 'Crimes'},
				pct: {pct: 7},
				boro: {boro: 1},
				boroName: {boroName: 'Manhattan'}
		}];
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('chart (isSame = false)', function(assert){
	assert.expect(8);
	
	var me = this;
	
	this.MOCK_CARTO_SQL.returnDatas = [{rows: 'dataset0'}, {rows: 'dataset1'}];
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: null,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	
	chart.updateData = function(datasets){
		assert.equal(datasets.length, 2);
		assert.equal(datasets[0], 'dataset0');
		assert.equal(datasets[1], 'dataset1');
	};
	
	chart.title = function(titleNode, descriptionValues){
		assert.equal(titleNode, 'MockTitleNode');
		assert.equal(descriptionValues, 'descriptions');
	};
	
	chart.isSame = function(sqls){
		assert.equal(sqls.length, 2);
		assert.equal(sqls[0], me.SERIES_SQL[0]);
		assert.equal(sqls[1], me.SERIES_SQL[1]);
		return false;
	};
	
	chart.chart(
		this.FILTER_VALUES,
		'MockTitleNode',
		'descriptions'
	);
});

QUnit.test('chart (isSame = true)', function(assert){
	assert.expect(6);
	
	var me = this;
	
	this.MOCK_CARTO_SQL.returnDatas = [{rows: 'dataset0'}, {rows: 'dataset1'}];
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: null,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});

	var same = false;
	chart.isSame = function(sqls){
		assert.equal(sqls.length, 2);
		assert.equal(sqls[0], me.SERIES_SQL[0]);
		assert.equal(sqls[1], me.SERIES_SQL[1]);
		return same;
	};
	same = true;
	
	chart.chart(
		this.FILTER_VALUES,
		'MockTitleNode',
		'descriptions'
	);
	
	chart.render = function(canvas, datasets){
		assert.notOk(true);
	};
	
	chart.title = function(titleNode, descriptionValues){
		assert.notOk(true);
	};
	
	chart.chart(
		this.FILTER_VALUES,
		'MockTitleNode',
		'descriptions'
	);
});

QUnit.test('chart (only one series)', function(assert){
	assert.expect(6);
	
	var me = this;
	
	this.MOCK_CARTO_SQL.returnDatas = [{rows: 'dataset0'}];
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: null,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	
	chart.updateData = function(datasets){
		assert.equal(datasets.length, 1);
		assert.equal(datasets[0], 'dataset0');
	};
	
	chart.title = function(titleNode, descriptionValues){
		assert.equal(titleNode, 'MockTitleNode');
		assert.equal(descriptionValues, 'descriptions');
	};
	
	chart.isSame = function(sqls){
		assert.equal(sqls.length, 1);
		assert.equal(sqls[0], me.SERIES_SQL[0]);
		return false;
	};
	
	chart.chart(
		[this.FILTER_VALUES[0]],
		'MockTitleNode',
		'descriptions'
	);
});

QUnit.test('isSame', function(assert){
	assert.expect(3);
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: null,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	
	assert.notOk(chart.isSame(['sql1', 'sql2']));
	chart.prevSqls = ['sql1'];
	assert.notOk(chart.isSame(['sql1', 'sql2']));
	chart.prevSqls = ['sql1', 'sql2'];
	assert.ok(chart.isSame(['sql1', 'sql2']));
});

QUnit.test('title', function(assert){
	assert.expect(2);
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: null,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	
	var div = $('<div></div>');
	
	chart.title(div, {displayType: 'Felony Assaults', seriesTitles: ['7/1/2015 - 7/31/2015', '7/1/2014 - 7/31/2014']});
	assert.equal(div.html(), '<div>Felony Assaults per 1000 Residents</div><div class="chart-series chart-series-0"><div class="chart-series-icon"></div>7/1/2015 - 7/31/2015</div><div class="chart-series chart-series-1"><div class="chart-series-icon"></div>7/1/2014 - 7/31/2014</div>');
	
	chart.title(div, {displayType: 'Felony Assaults', seriesTitles: ['7/1/2015 - 7/31/2015']});
	assert.equal(div.html(), '<div>Felony Assaults per 1000 Residents</div><div class="chart-series chart-series-0"><div class="chart-series-icon"></div>7/1/2015 - 7/31/2015</div>');

	div.remove();
});

QUnit.test('updateData', function(assert){
	assert.expect(2);
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: null,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	chart.render = function(){
		assert.ok(true);
	};
	
	var dataset0 = [{pct: 1, per1000: 2}, {pct: 2, per1000: 3}, {pct: 3, per1000: 4}];
	var dataset1 = [{pct: 1, per1000: 3}, {pct: 2, per1000: 2}, {pct: 3, per1000: 1}];
	
	chart.updateData([dataset0, dataset1]);
	
	assert.deepEqual(
			chart.currentData, 
		{
			datasets: [
	            {
		      		data: [2, 3, 4],
		       		fillColor: 'black',
		       		strokeColor: 'transparent'
		       	},
		       	{
		       		data: [3, 2, 1],
		       		fillColor: 'rgba(0,0,0,0.3)',
		       		strokeColor: 'transparent'
		       	}
	       	],
	       	labels: ['1 (label)', '2 (label)', '3 (label)']
		}
	);
});

QUnit.test('tip', function(assert){
	assert.expect(5);
	
	var canvas = $('<canvas style="position:absolute;left:100px;top:200px;"></canvas>');
	var div = $('<div id="chart-tip"></div>');
	$('body').append(div);
	$('body').append(canvas);
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: canvas,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	
	assert.equal(div.css('display'), 'block');
	
	chart.tip();
	assert.equal(div.css('display'), 'none');
	
	chart.tip({
		chart: {canvas: canvas.get(0)},
		title: 'Chart title',
		labels: ['label1', 'lable2'],
		x: 0,
		y: 100
	});
	assert.equal(div.css('display'), 'block');
	assert.equal(div.css('left'), '100px');
	assert.equal(div.css('top'), '290px');
	
	div.remove();
	canvas.remove();
});

QUnit.test('render', function(assert){
	assert.expect(7);
	
	var canvas = $('<canvas></canvas>');

	var mockBarChart = {
		destroy: function(){
			assert.ok(true);
		}
	};
	var MockChart = function(ctx){
		assert.deepEqual(ctx, canvas.get(0).getContext('2d'));
	};
	MockChart.prototype = {
		Bar: function(data){
			assert.equal(data, 'mockData');
			return mockBarChart;
		}
	};
	
	ActualChart = Chart;
	Chart = MockChart;
	
	var chart = new nyc.carto.Chart({
		cartoSql: this.MOCK_CARTO_SQL,
		canvas: canvas,
		sqlTemplate: this.SQL_TEMPLATE,
		descriptionTemplate: '<div>${displayType} per 1000 Residents</div>',
		dataColumn: 'per1000',
		labelColumn: 'pct',
		filters: this.FILTERS,
		labelLookupFunction: function(lbl){return lbl + ' (label)';}
	});
	chart.currentData = 'mockData';
	
	chart.render();
	assert.deepEqual(canvas.data('chart'), mockBarChart);
	//do it again to test that the last chart created is destroyed
	chart.render();	
	assert.deepEqual(canvas.data('chart'), mockBarChart);

	Chart = ActualChart;

});