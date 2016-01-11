QUnit.module('nyc.util');

QUnit.test('formatNumberHtml (default)', function(assert){
	assert.expect(3);
	var small = $('<div class="fmt-num">123</div>');
	var million = $('<div class="fmt-num">1000000</div>');
	var decimal = $('<div class="fmt-num">1234.1234567</div>');
	$('body').append([small, million, decimal]);
	
	nyc.util.formatNumberHtml({elements: '.fmt-num'});
	
	assert.equal(small.html(), '123');
	assert.equal(million.html(), '1,000,000');
	assert.equal(decimal.html(), '1,234.1235');

	small.remove();
	million.remove();
	decimal.remove();
});

QUnit.test('formatNumberHtml (decimal)', function(assert){
	assert.expect(3);
	var small = $('<div class="fmt-num">123</div>');
	var million = $('<div class="fmt-num">1000000</div>');
	var decimal = $('<div class="fmt-num">1234.1234567</div>');
	$('body').append([small, million, decimal]);
	
	nyc.util.formatNumberHtml({elements: '.fmt-num', options: {style:"decimal", minimumFractionDigits: 3}});
	
	assert.equal(small.html(), '123.000');
	assert.equal(million.html(), '1,000,000.000');
	assert.equal(decimal.html(), '1,234.123');

	small.remove();
	million.remove();
	decimal.remove();
});

QUnit.test('formatNumberHtml (currency)', function(assert){
	assert.expect(3);
	var small = $('<div class="fmt-num">123</div>');
	var million = $('<div class="fmt-num">1000000</div>');
	var decimal = $('<div class="fmt-num">1234.1234567</div>');
	$('body').append([small, million, decimal]);
	
	nyc.util.formatNumberHtml({elements: '.fmt-num', options: {style:"currency", currency: 'USD'}});
	
	assert.equal(small.html(), '$123.00');
	assert.equal(million.html(), '$1,000,000.00');
	assert.equal(decimal.html(), '$1,234.12');

	small.remove();
	million.remove();
	decimal.remove();
});

QUnit.test('formatNumberHtml (default - fr)', function(assert){
	assert.expect(3);
	var small = $('<div class="fmt-num">123</div>');
	var million = $('<div class="fmt-num">1000000</div>');
	var decimal = $('<div class="fmt-num">1234.1234567</div>');
	$('body').append([small, million, decimal]);
	
	nyc.util.formatNumberHtml({elements: '.fmt-num', lang: 'fr'});
	
	assert.equal(small.html(), '123');
	assert.equal(million.html(), '1&nbsp;000&nbsp;000');
	assert.equal(decimal.html(), '1&nbsp;234,1235');

	small.remove();
	million.remove();
	decimal.remove();
});

QUnit.test('formatNumberHtml (decimal - fr)', function(assert){
	assert.expect(3);
	var small = $('<div class="fmt-num">123</div>');
	var million = $('<div class="fmt-num">1000000</div>');
	var decimal = $('<div class="fmt-num">1234.1234567</div>');
	$('body').append([small, million, decimal]);
	
	nyc.util.formatNumberHtml({elements: '.fmt-num', lang: 'fr', options: {style:"decimal", minimumFractionDigits: 3}});
	
	assert.equal(small.html(), '123,000');
	assert.equal(million.html(), '1&nbsp;000&nbsp;000,000');
	assert.equal(decimal.html(), '1&nbsp;234,123');

	small.remove();
	million.remove();
	decimal.remove();
});

QUnit.test('formatNumberHtml (currency - fr)', function(assert){
	assert.expect(3);
	var small = $('<div class="fmt-num">123</div>');
	var million = $('<div class="fmt-num">1000000</div>');
	var decimal = $('<div class="fmt-num">1234.1234567</div>');
	$('body').append([small, million, decimal]);
	
	nyc.util.formatNumberHtml({elements: '.fmt-num', lang: 'fr', options: {style:"currency", currency: 'EUR'}});
	
	assert.equal(small.html(), '123,00&nbsp;€');
	assert.equal(million.html(), '1&nbsp;000&nbsp;000,00&nbsp;€');
	assert.equal(decimal.html(), '1&nbsp;234,12&nbsp;€');

	small.remove();
	million.remove();
	decimal.remove();
});

QUnit.test('preventDblEventHandler', function(assert){
	assert.expect(0);
});