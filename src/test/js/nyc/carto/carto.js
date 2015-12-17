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