QUnit.module('nyc.soda.Query');

QUnit.test('constructor', function(assert){
	assert.expect(3);
	
	var query = {
		select: 'select-something',
		where: 'where-something',
		group: 'group-by-something',
		order: 'order-by-something',
		limit: 1
	};
	
	var filters = {
		field0: ['mock-filter0a', 'mock-filter0b'],
		field1: ['mock-filter1a', 'mock-filter1b']
	};
	
	var soda = new nyc.soda.Query({
		url: 'http://soda-url',
		query: query,
		filters: filters
	});
	
	assert.equal(soda.url, 'http://soda-url');
	assert.deepEqual(soda.query, query);
	assert.deepEqual(soda.filters, filters);
});

QUnit.test('setFilters', function(assert){
	assert.expect(3);
	
	var filters0 = {
		field0: ['mock-filter0a', 'mock-filter0b'],
		field1: ['mock-filter1a', 'mock-filter1b']
	};

	var filters1 = {
		fieldA: ['mock-filterA0', 'mock-filterA1'],
		fieldB: ['mock-filterB0', 'mock-filterB1']
	};

	var soda = new nyc.soda.Query({
		filters: filters0
	});
	
	assert.deepEqual(soda.filters, filters0);
	
	soda.setFilters();

	assert.deepEqual(soda.filters, {});

	soda.setFilters(filters1);

	assert.deepEqual(soda.filters, filters1);
});

QUnit.test('addFilters', function(assert){
	assert.expect(2);
	
	var filters0 = {
		field0: ['mock-filter0a', 'mock-filter0b'],
		field1: ['mock-filter1a', 'mock-filter1b']
	};

	var filters1 = {
		fieldA: ['mock-filterA0', 'mock-filterA1'],
		fieldB: ['mock-filterB0', 'mock-filterB1']
	};

	var expected = {
		field0: ['mock-filter0a', 'mock-filter0b'],
		field1: ['mock-filter1a', 'mock-filter1b'],
		fieldA: ['mock-filterA0', 'mock-filterA1'],
		fieldB: ['mock-filterB0', 'mock-filterB1']
	};
	
	var soda = new nyc.soda.Query({
		filters: filters0
	});
	
	assert.deepEqual(soda.filters, filters0);
	
	soda.addFilters(filters1);

	assert.deepEqual(soda.filters, expected);
});

QUnit.test('setFilter', function(assert){
	assert.expect(2);
	
	var filters0 = {
		field0: ['mock-filter0a', 'mock-filter0b'],
		field1: ['mock-filter1a', 'mock-filter1b']
	};

	var filter = 'mock-filter1c';

	var expected = {
		field0: ['mock-filter0a', 'mock-filter0b'],
		field1: ['mock-filter1c']
	};
	var soda = new nyc.soda.Query({
		filters: filters0
	});
	
	assert.deepEqual(soda.filters, filters0);
	
	soda.setFilter('field1', filter);

	assert.deepEqual(soda.filters, expected);
});

QUnit.test('addFilter', function(assert){
	assert.expect(2);
	
	var filters0 = {
		field0: ['mock-filter0a', 'mock-filter0b'],
		field1: ['mock-filter1a', 'mock-filter1b']
	};

	var filter = 'mock-filter1c';

	var expected = {
		field0: ['mock-filter0a', 'mock-filter0b'],
		field1: ['mock-filter1a', 'mock-filter1b', 'mock-filter1c']
	};
	var soda = new nyc.soda.Query({
		filters: filters0
	});
	
	assert.deepEqual(soda.filters, filters0);
	
	soda.addFilter('field1', filter);

	assert.deepEqual(soda.filters, expected);
});

QUnit.test('setQuery', function(assert){
	assert.expect(17);
	
	var query0 = {
		select: 'select-something',
		where: 'where-something',
		group: 'group-by-something',
		order: 'order-by-something',
		limit: 1
	};

	var query1 = {
		select: 'select-something-different',
		limit: 2
	};

	var query2 = {
			select: 'select-something-else',
			where: 'where-something-else',
			group: 'group-by-something-else',
			order: 'order-by-something-else',
			limit: 4
		};

	var query3 = {
		where: 'where-something-else',
		order: 'order-by-something-else'
	};

	var soda = new nyc.soda.Query({
		query: query0
	});
	
	assert.deepEqual(soda.query, query0);
	
	soda.setQuery();

	assert.deepEqual(soda.query, query0);

	soda.setQuery(query1);

	assert.equal(soda.query.select, query1.select);
	assert.equal(soda.query.where, query0.where);
	assert.equal(soda.query.group, query0.group);
	assert.equal(soda.query.order, query0.order);
	assert.equal(soda.query.limit, query1.limit);

	soda.setQuery(query2);

	assert.equal(soda.query.select, query2.select);
	assert.equal(soda.query.where, query2.where);
	assert.equal(soda.query.group, query2.group);
	assert.equal(soda.query.order, query2.order);
	assert.equal(soda.query.limit, query2.limit);

	soda.setQuery(query3);

	assert.equal(soda.query.select, query2.select);
	assert.equal(soda.query.where, query3.where);
	assert.equal(soda.query.group, query2.group);
	assert.equal(soda.query.order, query3.order);
	assert.equal(soda.query.limit, query2.limit);
});

QUnit.test('execute', function(assert){
	assert.expect(8);
	
	var ajax = $.ajax;
	
	$.ajax = function(args){
		assert.equal(args.url, 'http://soda-url');
		assert.equal(args.method, 'GET');
		assert.equal(args.data, 'mock-req-data');
		args.success('mock-resp-data');
	};
		
	var filters = {
		filter0: ['mock-filter0a', 'mock-filter0b'],
		filter1: ['mock-filter1a', 'mock-filter1b']
	};
	
	var soda = new nyc.soda.Query();

	soda.setUrl = function(url){
		soda.url = url;
		assert.equal(url, 'http://soda-url');
	};
	
	soda.setQuery = function(qry){
		assert.equal(qry, 'mock-query');
	};
	
	soda.qstr = function(){
		return 'mock-req-data';
	};
	
	soda.callback = function(data, callback){
		assert.equal(data, 'mock-resp-data');
		assert.equal(callback, 'mock-callback');
	};
	
	soda.execute({
		url: 'http://soda-url',
		query: 'mock-query',
		filters: filters
	}, 'mock-callback');
	
	assert.deepEqual(soda.filters, filters);
	
	$.ajax = ajax;
});

QUnit.test('clearFilters', function(assert){
	assert.expect(2);
	
	var filters = {
		filter0: ['mock-filter0a', 'mock-filter0b'],
		filter1: ['mock-filter1a', 'mock-filter1b']
	};
	
	var expected = {
		filter1: ['mock-filter1a', 'mock-filter1b']
	};
		
	var soda = new nyc.soda.Query({
		filters: filters
	});
	
	assert.deepEqual(soda.filters, filters);
	
	soda.clearFilters('filter0');
	
	assert.deepEqual(soda.filters, expected);
});

QUnit.test('clearAllFilters', function(assert){
	assert.expect(2);
	
	var filters = {
		filter0: ['mock-filter0a', 'mock-filter0b'],
		filter1: ['mock-filter1a', 'mock-filter1b']
	};
	
	var expected = {
		filter1: ['mock-filter1a', 'mock-filter1b']
	};
		
	var soda = new nyc.soda.Query({
		filters: filters
	});
	
	assert.deepEqual(soda.filters, filters);
	
	soda.clearAllFilters();
	
	assert.deepEqual(soda.filters, {});
});

QUnit.test('getUrlAndQuery', function(assert){
	assert.expect(1);
	
	var soda = new nyc.soda.Query({
		url: 'http://soda-url'
	});
	
	soda.qstr = function(){
		return 'mock-qstr';
	};
	
	assert.equal(soda.getUrlAndQuery(), 'http://soda-url?mock-qstr');
});

QUnit.test('setUrl', function(assert){
	assert.expect(2);
	
	var soda = new nyc.soda.Query({
		url: 'http://soda-url'
	});
	
	soda.setUrl();
	
	assert.equal(soda.url, 'http://soda-url');
	
	soda.setUrl('http://new-soda-url')
	
	assert.equal(soda.url, 'http://new-soda-url');
});

QUnit.test('appendFilter', function(assert){
	assert.expect(7);
	
	var soda = new nyc.soda.Query();
	
	var where0 = soda.appendFilter('', 'field0', {op: '=', value: 'field0-value'});
	
	assert.equal(where0, "field0 = 'field0-value'");

	var where1 = soda.appendFilter(where0, 'field1', {op: '>', value: 123});
	assert.equal(where1, "field0 = 'field0-value' AND field1 > 123");

	var where2 = soda.appendFilter(where1, 'field2', {op: 'in', value: ['a', 'b', 'c']});
	assert.equal(where2, "field0 = 'field0-value' AND field1 > 123 AND field2 IN ('a', 'b', 'c')");
	
	var where3 = soda.appendFilter(where2, 'field3', {op: 'in', value: [1,2,3]});
	assert.equal(where3, "field0 = 'field0-value' AND field1 > 123 AND field2 IN ('a', 'b', 'c') AND field3 IN (1, 2, 3)");

	var where4 = soda.appendFilter(where3, 'field4', {op: 'like', value: 'wildcard%'});
	assert.equal(where4, "field0 = 'field0-value' AND field1 > 123 AND field2 IN ('a', 'b', 'c') AND field3 IN (1, 2, 3) AND field4 LIKE 'wildcard%'");

	var where5 = soda.appendFilter(where4, 'field5', {op: 'between', value: ['2017-01-01', '2017-12-31']});
	assert.equal(where5, "field0 = 'field0-value' AND field1 > 123 AND field2 IN ('a', 'b', 'c') AND field3 IN (1, 2, 3) AND field4 LIKE 'wildcard%' AND field5 BETWEEN ('2017-01-01', '2017-12-31')");

	var where6 = soda.appendFilter(where5, 'field6', {op: 'between', value: [1, 100]});
	assert.equal(where6, "field0 = 'field0-value' AND field1 > 123 AND field2 IN ('a', 'b', 'c') AND field3 IN (1, 2, 3) AND field4 LIKE 'wildcard%' AND field5 BETWEEN ('2017-01-01', '2017-12-31') AND field6 BETWEEN (1, 100)");
});

QUnit.test('qstr', function(assert){
	assert.expect(1);
	
	var query = {
		select: 'select-something',
		where: 'fieldA = 123',
		group: 'group-by-something',
		order: 'order-by-something',
		limit: 1
	};
	
	var filters = {
		field0: [{op: '!=', value: 'xyz'}, {op: '!=', value: 'abc'}],
		field1: [{op: 'in', value: [1, 2, 3]}]
	};
	
	var soda = new nyc.soda.Query({
		query: query,
		filters: filters
	});
	
	assert.equal(soda.qstr(), "%24select=select-something&%24where=fieldA+%3D+123+AND+field0+!%3D+'xyz'+AND+field0+!%3D+'abc'+AND+field1+IN+(1%2C+2%2C+3)&%24group=group-by-something&%24order=order-by-something&%24limit=1");
});

QUnit.test('callback (csv)', function(assert){
	assert.expect(3);	
	
	var toObjects = $.csv.toObjects;
	
	$.csv.toObjects = function(data){
		assert.equal(data, 'mock-csv-data');
		return 'mock-resp-data';
	};
	
	var soda = new nyc.soda.Query({
		url: 'http://soda-url/data.csv?123'
	});
	
	var callback = function(data, sda){
		assert.equal(data, 'mock-resp-data');
		assert.equal(sda, soda);
	};
	
	soda.callback('mock-csv-data', callback);
	
	$.csv.toObjects = toObjects;
});

QUnit.test('callback (not csv)', function(assert){
	assert.expect(2);	
	
	var toObjects = $.csv.toObjects;
	
	$.csv.toObjects = function(data){
		assert.ok(false);
	};
	
	var soda = new nyc.soda.Query({
		url: 'http://soda-url/data.json?123'
	});
	
	var callback = function(data, sda){
		assert.equal(data, 'mock-resp-data');
		assert.equal(sda, soda);
	};
	
	soda.callback('mock-resp-data', callback);
	
	$.csv.toObjects = toObjects;
});
