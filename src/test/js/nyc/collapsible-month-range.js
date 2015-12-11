QUnit.module('nyc.MonthRangePicker', {});

QUnit.test('constructor', function(assert){
	assert.expect(7);
		
	var div = $('<div id="test-div"><div>stuff</div></div>');
	$('body').append(div);

	var dateRange = new nyc.MonthRangePicker({
		target: div,
		title: 'Date Range',
		minMonth: 2,
		minYear: 2011,
		maxMonth: 5,
		maxYear: 2013
	});
	
	var selects = $('#test-div select');
	
	assert.equal(selects.length, 2);
	
	assert.ok(selects.get(0) === dateRange.min.get(0));
	assert.ok(selects.get(1) === dateRange.max.get(0));
	
	assert.equal(dateRange.min.children().length, 28);
	assert.equal(dateRange.max.children().length, 28);
	
	assert.deepEqual({
		start: dateRange.localeDate('2013-06-01'),
		end: dateRange.localeDate('2013-06-30')
	}, dateRange.val());
	
	assert.equal(
		dateRange.localeDate('2013-06-01').toLocaleDateString() + ' - ' + 
		dateRange.localeDate('2013-06-30').toLocaleDateString(),
		dateRange.currentVal.html()
	);
	div.remove();
});

QUnit.test('firstOfMonth', function(assert){
	assert.expect(12);
	
	var dateRange = new nyc.MonthRangePicker({
		target: '',
		title: 'Date Range',
		minMonth: 2,
		minYear: 2011,
		maxMonth: 5,
		maxYear: 2013
	});
	for (var i = 0; i < 12; i++){
		var m = dateRange.pad(i + 1);
		assert.deepEqual(dateRange.firstOfMonth(i, 2015), dateRange.localeDate('2015-' + m +'-01'));		
	}
});

QUnit.test('lastOfMonth (not leap year)', function(assert){
	assert.expect(12);
	
	var dateRange = new nyc.MonthRangePicker({
		target: '',
		title: 'Date Range',
		minMonth: 2,
		minYear: 2011,
		maxMonth: 5,
		maxYear: 2013
	});
	var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	for (var i = 0; i < 12; i++){
		var m = dateRange.pad(i + 1);
		var d = dateRange.pad(days[i]);
		assert.deepEqual(dateRange.lastOfMonth(i, 2015), dateRange.localeDate('2015-' + m +'-' + d));		
	}
});

QUnit.test('lastOfMonth (leap year)', function(assert){
	assert.expect(12);
	
	var dateRange = new nyc.MonthRangePicker({
		target: '',
		title: 'Date Range',
		minMonth: 2,
		minYear: 2011,
		maxMonth: 5,
		maxYear: 2013
	});
	var days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	for (var i = 0; i < 12; i++){
		var m = dateRange.pad(i + 1);
		var d = dateRange.pad(days[i]);
		assert.deepEqual(dateRange.lastOfMonth(i, 2016), dateRange.localeDate('2016-' + m +'-' + d));		
	}
});

QUnit.test('localeDate', function(assert){
	assert.expect(2);

	var dateRange = new nyc.MonthRangePicker({
		target: '',
		title: 'Date Range',
		minMonth: 2,
		minYear: 2011,
		maxMonth: 5,
		maxYear: 2013
	});

	var now = new Date();
	assert.deepEqual(dateRange.localeDate(), new Date(now.getTime() + (now.getTimezoneOffset() * 60000)));
	
	var then = new Date('2015-10-01');
	assert.deepEqual(dateRange.localeDate('2015-10-01'), new Date(then.getTime() + (then.getTimezoneOffset() * 60000)));
});

QUnit.test('disable options out of range', function(assert){
	assert.expect(28 * 28 * 2);
		
	var div = $('<div id="test-div"><div>stuff</div></div>');
	$('body').append(div);

	var dateRange = new nyc.MonthRangePicker({
		target: div,
		title: 'Date Range',
		minMonth: 2,
		minYear: 2011,
		maxMonth: 5,
		maxYear: 2013
	});
	
	var minOpts = dateRange.min.children();
	var maxOpts = dateRange.max.children();
	
	minOpts.each(function(i, min){
		dateRange.min.val(min.value).trigger('change');
		maxOpts.each(function(j, max){
			assert[i <= j ? 'equal' : 'notEqual']($(max).css('display'), 'block');
		});
	});

	maxOpts.each(function(i, max){
		dateRange.max.val(max.value).trigger('change');
		minOpts.each(function(j, min){
			assert[i >= j ? 'equal' : 'notEqual']($(min).css('display'), 'block');
		});
	});

	div.remove();
});

QUnit.test('changed', function(assert){
	assert.expect(2);
	
	var div = $('<div id="test-div"><div>stuff</div></div>');
	$('body').append(div);

	var dateRange = new nyc.MonthRangePicker({
		target: div,
		title: 'Date Range',
		minMonth: 2,
		minYear: 2011,
		maxMonth: 5,
		maxYear: 2013
	});
	
	dateRange.one('change', function(){
		assert.deepEqual({
			start: dateRange.localeDate('2011-06-01'),
			end: dateRange.localeDate('2013-06-30')
		}, dateRange.val());
	});
	dateRange.min.val(dateRange.min.children().get(3).value).trigger('change');

	dateRange.one('change', function(){
		assert.deepEqual({
			start: dateRange.localeDate('2011-06-01'),
			end: dateRange.localeDate('2011-07-31')
		}, dateRange.val());
	});
	dateRange.max.val(dateRange.max.children().get(4).value).trigger('change');

	div.remove();
});