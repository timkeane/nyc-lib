QUnit.module('nyc.Legend', {});

QUnit.test('html', function(assert){
	assert.expect(2);
	
	var legend = new nyc.Legend('<div>my legend caption is ${caption}, so there!</div>');
	var result = legend.html('"My Caption"');
	assert.equal(result.get(0).tagName, 'DIV');
	assert.equal(result.html(), 'my legend caption is "My Caption", so there!');
});

QUnit.module('nyc.BinLegend', {});

QUnit.test('html (nyc.BinLegend.SymbolType.POLYGON, nyc.BinLegend.BinType.RANGE_NUMBER)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.POLYGON, nyc.BinLegend.BinType.RANGE_NUMBER);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', [0.1, 1.5, 2.7, 5.0, 10.1]));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-polygon leg-range-num my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="   <= 0.1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>  &lt;= <span class="fmt-num">0.1</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt="> 0.1 and <= 1.5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">0.1</span> and &lt;= <span class="fmt-num">1.5</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt="> 1.5 and <= 2.7" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">1.5</span> and &lt;= <span class="fmt-num">2.7</span></td></tr><tr><td class="leg-bin leg-bin-3"><img alt="> 2.7 and <= 5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">2.7</span> and &lt;= <span class="fmt-num">5</span></td></tr><tr><td class="leg-bin leg-bin-4"><img alt="> 5 and <= 10.1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">5</span> and &lt;= <span class="fmt-num">10.1</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.POLYGON, nyc.BinLegend.BinType.RANGE_INT)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.POLYGON, nyc.BinLegend.BinType.RANGE_INT);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', [1, 5, 7, 8, 10]));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-polygon leg-range-int my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="    1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>   <span class="fmt-num">1</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt="> 1 and <= 5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">1</span> and &lt;= <span class="fmt-num">5</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt="> 5 and <= 7" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">5</span> and &lt;= <span class="fmt-num">7</span></td></tr><tr><td class="leg-bin leg-bin-3"><img alt="> 7 and <= 8" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">7</span> and &lt;= <span class="fmt-num">8</span></td></tr><tr><td class="leg-bin leg-bin-4"><img alt="> 8 and <= 10" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">8</span> and &lt;= <span class="fmt-num">10</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.POLYGON, nyc.BinLegend.BinType.RANGE_VALUE)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.POLYGON, nyc.BinLegend.BinType.RANGE_VALUE);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', ['a', 'b', 'c']));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-polygon my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="   <= a" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>  &lt;= <span class="fmt-num">a</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt=">  and <= b" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num"></span> and &lt;= <span class="fmt-num">b</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt=">  and <= c" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num"></span> and &lt;= <span class="fmt-num">c</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.LINE, nyc.BinLegend.BinType.RANGE_NUMBER)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.LINE, nyc.BinLegend.BinType.RANGE_NUMBER);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', [0.1, 1.5, 2.7, 5.0, 10.1]));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-line leg-range-num my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="   <= 0.1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>  &lt;= <span class="fmt-num">0.1</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt="> 0.1 and <= 1.5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">0.1</span> and &lt;= <span class="fmt-num">1.5</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt="> 1.5 and <= 2.7" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">1.5</span> and &lt;= <span class="fmt-num">2.7</span></td></tr><tr><td class="leg-bin leg-bin-3"><img alt="> 2.7 and <= 5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">2.7</span> and &lt;= <span class="fmt-num">5</span></td></tr><tr><td class="leg-bin leg-bin-4"><img alt="> 5 and <= 10.1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">5</span> and &lt;= <span class="fmt-num">10.1</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.LINE, nyc.BinLegend.BinType.RANGE_INT)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.LINE, nyc.BinLegend.BinType.RANGE_INT);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', [1, 5, 7, 8, 10]));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-line leg-range-int my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="    1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>   <span class="fmt-num">1</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt="> 1 and <= 5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">1</span> and &lt;= <span class="fmt-num">5</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt="> 5 and <= 7" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">5</span> and &lt;= <span class="fmt-num">7</span></td></tr><tr><td class="leg-bin leg-bin-3"><img alt="> 7 and <= 8" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">7</span> and &lt;= <span class="fmt-num">8</span></td></tr><tr><td class="leg-bin leg-bin-4"><img alt="> 8 and <= 10" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">8</span> and &lt;= <span class="fmt-num">10</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.LINE, nyc.BinLegend.BinType.RANGE_VALUE)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.LINE, nyc.BinLegend.BinType.RANGE_VALUE);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', ['a', 'b', 'c']));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-line my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="   <= a" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>  &lt;= <span class="fmt-num">a</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt=">  and <= b" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num"></span> and &lt;= <span class="fmt-num">b</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt=">  and <= c" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num"></span> and &lt;= <span class="fmt-num">c</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.POINT, nyc.BinLegend.BinType.RANGE_NUMBER)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.POINT, nyc.BinLegend.BinType.RANGE_NUMBER);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', [0.1, 1.5, 2.7, 5.0, 10.1]));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-point leg-range-num my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="   <= 0.1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>  &lt;= <span class="fmt-num">0.1</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt="> 0.1 and <= 1.5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">0.1</span> and &lt;= <span class="fmt-num">1.5</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt="> 1.5 and <= 2.7" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">1.5</span> and &lt;= <span class="fmt-num">2.7</span></td></tr><tr><td class="leg-bin leg-bin-3"><img alt="> 2.7 and <= 5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">2.7</span> and &lt;= <span class="fmt-num">5</span></td></tr><tr><td class="leg-bin leg-bin-4"><img alt="> 5 and <= 10.1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">5</span> and &lt;= <span class="fmt-num">10.1</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.POINT, nyc.BinLegend.BinType.RANGE_INT)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.POINT, nyc.BinLegend.BinType.RANGE_INT);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', [1, 5, 7, 8, 10]));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-point leg-range-int my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="    1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>   <span class="fmt-num">1</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt="> 1 and <= 5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">1</span> and &lt;= <span class="fmt-num">5</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt="> 5 and <= 7" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">5</span> and &lt;= <span class="fmt-num">7</span></td></tr><tr><td class="leg-bin leg-bin-3"><img alt="> 7 and <= 8" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">7</span> and &lt;= <span class="fmt-num">8</span></td></tr><tr><td class="leg-bin leg-bin-4"><img alt="> 8 and <= 10" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">8</span> and &lt;= <span class="fmt-num">10</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.POINT, nyc.BinLegend.BinType.RANGE_VALUE)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.POINT, nyc.BinLegend.BinType.RANGE_VALUE);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', ['a', 'b', 'c']));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-point my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="   <= a" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>  &lt;= <span class="fmt-num">a</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt=">  and <= b" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num"></span> and &lt;= <span class="fmt-num">b</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt=">  and <= c" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num"></span> and &lt;= <span class="fmt-num">c</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.GRADUATED_POINT, nyc.BinLegend.BinType.RANGE_NUMBER)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.GRADUATED_POINT, nyc.BinLegend.BinType.RANGE_NUMBER);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', [0.1, 1.5, 2.7, 5.0, 10.1]));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-grad-point leg-range-num my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="   <= 0.1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>  &lt;= <span class="fmt-num">0.1</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt="> 0.1 and <= 1.5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">0.1</span> and &lt;= <span class="fmt-num">1.5</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt="> 1.5 and <= 2.7" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">1.5</span> and &lt;= <span class="fmt-num">2.7</span></td></tr><tr><td class="leg-bin leg-bin-3"><img alt="> 2.7 and <= 5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">2.7</span> and &lt;= <span class="fmt-num">5</span></td></tr><tr><td class="leg-bin leg-bin-4"><img alt="> 5 and <= 10.1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">5</span> and &lt;= <span class="fmt-num">10.1</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.GRADUATED_POINT, nyc.BinLegend.BinType.RANGE_INT)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.GRADUATED_POINT, nyc.BinLegend.BinType.RANGE_INT);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', [1, 5, 7, 8, 10]));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-grad-point leg-range-int my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="    1" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>   <span class="fmt-num">1</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt="> 1 and <= 5" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">1</span> and &lt;= <span class="fmt-num">5</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt="> 5 and <= 7" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">5</span> and &lt;= <span class="fmt-num">7</span></td></tr><tr><td class="leg-bin leg-bin-3"><img alt="> 7 and <= 8" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">7</span> and &lt;= <span class="fmt-num">8</span></td></tr><tr><td class="leg-bin leg-bin-4"><img alt="> 8 and <= 10" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num">8</span> and &lt;= <span class="fmt-num">10</span></td></tr></tbody></table>'
	);
});

QUnit.test('html (nyc.BinLegend.SymbolType.GRADUATED_POINT, nyc.BinLegend.BinType.RANGE_VALUE)', function(assert){
	assert.expect(1);
	
	var legend = new nyc.BinLegend('my legend', nyc.BinLegend.SymbolType.GRADUATED_POINT, nyc.BinLegend.BinType.RANGE_VALUE);	
	var div = $('<div></div>');
	div.append(legend.html('"My Caption"', ['a', 'b', 'c']));
	
	assert.equal(
		div.html(), 
		'<table class="legend leg-grad-point my-legend"><caption>"My Caption"</caption><tbody><tr><td class="leg-bin leg-bin-0"><img alt="   <= a" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc"> <span class="fmt-num"></span>  &lt;= <span class="fmt-num">a</span></td></tr><tr><td class="leg-bin leg-bin-1"><img alt=">  and <= b" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num"></span> and &lt;= <span class="fmt-num">b</span></td></tr><tr><td class="leg-bin leg-bin-2"><img alt=">  and <= c" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></td><td class="leg-bin-desc">&gt; <span class="fmt-num"></span> and &lt;= <span class="fmt-num">c</span></td></tr></tbody></table>'
	);
});

