QUnit.module('nyc.leaf.Locate', {
	beforeEach: function(assert){
		setup(assert, this);
		this.MOCK_GEOCODER = function(){
			this.searchedFor = null;
			this.search = function(input){
				this.searchedFor = input;
			}
		};
		nyc.inherits(this.MOCK_GEOCODER, nyc.EventHandling);
		this.MOCK_GEOCODER = new this.MOCK_GEOCODER();

		this.MOCK_MAP = function(){};
		nyc.inherits(this.MOCK_MAP, nyc.EventHandling);
		this.MOCK_MAP = new this.MOCK_MAP();
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.MOCK_GEOCODER;
		delete this.MOCK_MAP;
	}
});

QUnit.test('search', function(assert){
	assert.expect(2);
	
	var locate = new nyc.leaf.Locate(this.MOCK_MAP, this.MOCK_GEOCODER, nyc.leaf.EXTENT);
	assert.equal(locate.geocoder.searchedFor, null);
	locate.search('my address');
	assert.equal(locate.geocoder.searchedFor, 'my address');
});

QUnit.test('proxyEvent', function(assert){
	assert.expect(3);
	
	var locate = new nyc.leaf.Locate(this.MOCK_MAP, this.MOCK_GEOCODER, nyc.leaf.EXTENT);
	var geocodeData1 = {
			coordinates: [1, 2],
			accuracy: 0, 
			type: nyc.Locate.ResultType.GEOCODE,
			name: 'my address1'
	};
	var geocodeData2 = {
			coordinates: [3, 4],
			accuracy: 0, 
			type: nyc.Locate.ResultType.GEOCODE,
			name: 'my address2'
	};
	var ambiguousData = {
			input: 'my address',
			possible: [geocodeData1, geocodeData2]
	};
	locate.one(nyc.Locate.LocateEventType.GEOCODE, function(data){
		assert.deepEqual(data, geocodeData1);
	});
	this.MOCK_GEOCODER.trigger(
		nyc.Locate.LocateEventType.GEOCODE,
		geocodeData1
	);
	locate.one(nyc.Locate.LocateEventType.AMBIGUOUS, function(data){
		assert.deepEqual(data, ambiguousData);
	});
	this.MOCK_GEOCODER.trigger(
		nyc.Locate.LocateEventType.AMBIGUOUS,
		ambiguousData
	);
	locate.one(nyc.Locate.LocateEventType.ERROR, function(data){
		assert.ok(true);
	});
	this.MOCK_GEOCODER.trigger(nyc.Locate.LocateEventType.ERROR);
});

QUnit.test('locate', function(assert){
	assert.expect(6);
	var coordinates = nyc.leaf.CENTER;
	
	var test = function(data){
		assert.deepEqual(data, {
			coordinates: [nyc.leaf.CENTER.lng, nyc.leaf.CENTER.lat],
			accuracy: 2000, 
			type: nyc.Locate.ResultType.GEOLOCATION,
			name: "40° 42' 12\" N 73° 58' 47\" W"
		});
		assert.notOk();
	};

	var locate = new nyc.leaf.Locate(this.MOCK_MAP, this.MOCK_GEOCODER, nyc.leaf.EXTENT);
	locate.one(nyc.Locate.LocateEventType.GEOLOCATION, test);
	this.MOCK_MAP.trigger('locationfound', {latlng: nyc.leaf.CENTER, accuracy: 2000});

	locate = new nyc.leaf.Locate(this.MOCK_MAP, this.MOCK_GEOCODER, nyc.leaf.EXTENT);
	assert.ok(locate.isGeolocateAllowed);
	this.MOCK_MAP.trigger('locationerror', {});
	assert.ok(locate.isGeolocateAllowed);

	locate = new nyc.leaf.Locate(this.MOCK_MAP, this.MOCK_GEOCODER, nyc.leaf.EXTENT);
	assert.ok(locate.isGeolocateAllowed);
	this.MOCK_MAP.trigger('locationerror', {code: 1});
	assert.notOk(locate.isGeolocateAllowed);
});
