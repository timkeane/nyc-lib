QUnit.module('nyc.ol.source.AcrGisCache');

QUnit.test("defaultTileUrlFunction", function(assert){
	assert.expect(2);
	
	var source = new nyc.ol.source.AcrGisCache({});
	source.imageExtension = 'jpg';
	source.nextUrl = function(){
		return 'nexturl/';
	};
	source.pad = function(num, len){
		return 'padded-' + num;
	};
	
	assert.equal(source.defaultTileUrlFunction([0, 1, -1]), 'nexturl/Lpadded-0/Rpadded-0/Cpadded-1.jpg');	
	assert.equal(source.defaultTileUrlFunction([0, 1, -2]), 'nexturl/Lpadded-0/Rpadded-1/Cpadded-1.jpg');	
});

QUnit.test("pad", function(assert){
	assert.expect(231);
	
	var source = new nyc.ol.source.AcrGisCache({});
	
	var pad = function(num, len){
		var str = Number(num).toString(16);
		while (str.length < len) {
			str = '0' + str;
		}
		return str;
	};

	for (var i = 0; i < 33; i++){
		for (var p = 2; p < 9; p++){
			assert.equal(source.pad(i, p), pad(i, p));						
		}
	}
});

QUnit.test("nextUrl", function(assert){
	assert.expect(7);

	var source = new nyc.ol.source.AcrGisCache({});
	source.urls = [];
	source.url = 'url';
	
	assert.equal(source.nextUrl(), 'url/');
	assert.equal(source.nextUrl(), 'url/');
	
	source.urls = ['url1', 'url2', 'url3', 'url4'];
	source.url = null;

	assert.equal(source.nextUrl(), 'url2/');
	assert.equal(source.nextUrl(), 'url3/');
	assert.equal(source.nextUrl(), 'url4/');
	assert.equal(source.nextUrl(), 'url1/');
	assert.equal(source.nextUrl(), 'url2/');
});

