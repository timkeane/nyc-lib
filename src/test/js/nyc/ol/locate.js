QUnit.module('nyc.ol.Locate', {
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

		this.MOCK_GEOLOCATION = function(){
			this.track = false;
			this.getPosition = function(){
				return [-74.0094471, 40.721786099999996];
			};
			this.getAccuracy = function(){
				return 100;
			};
			this.getHeading = function(){
				return 0;
			};
			this.getTracking = function(track){
				return this.track;
			};
			this.setTracking = function(track){
				this.track = track;
				if (track){
					$(this).trigger('change');
				}
			};
			this.on = function(evt, func){
				$(this).on(evt, func);
			};
		};
		this.OL_GEOLOCATION = ol.Geolocation;
		ol.Geolocation = this.MOCK_GEOLOCATION;
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.MOCK_GEOCODER;
		delete this.MOCK_GEOLOCATION;
		ol.Geolocation = this.OL_GEOLOCATION;		
	}
});

QUnit.test('metersPerUnit', function(assert){
	assert.expect(2);
	
	var locate = new nyc.ol.Locate(this.MOCK_GEOCODER);
	assert.equal(locate.metersPerUnit(), 1);
	locate = new nyc.ol.Locate(this.MOCK_GEOCODER, 'EPSG:2263');
	assert.equal(locate.metersPerUnit().toFixed(4), 0.3048);
});

QUnit.test('project', function(assert){
	assert.expect(3);
	
	var locate = new nyc.ol.Locate(this.MOCK_GEOCODER);
	assert.deepEqual(locate.project([-74.0094471, 40.721786099999996]), [-74.0094471, 40.721786099999996]);
	locate = new nyc.ol.Locate(this.MOCK_GEOCODER, 'EPSG:2263');
	var projected = locate.project([-74.0094471, 40.721786099999996]);
	assert.equal(projected[0].toFixed(4), 981631.3563);
	assert.equal(projected[1].toFixed(4), 202242.8156);
});

QUnit.test('withinLimit', function(assert){
	assert.expect(6);
	
	var locate = new nyc.ol.Locate(this.MOCK_GEOCODER);
	assert.ok(locate.withinLimit([-74.0094471, 40.721786099999996]));
	assert.ok(locate.withinLimit([0, 0]));
	assert.ok(locate.withinLimit([-180, -180]));
	assert.ok(locate.withinLimit([981631.3563140564, 202242.81556201354]));
	locate = new nyc.ol.Locate(this.MOCK_GEOCODER, null, nyc.ol.EXTENT);
	assert.ok(locate.withinLimit([981631.3563140564, 202242.81556201354]));
	assert.notOk(locate.withinLimit([0, 0]));
});

QUnit.test('track', function(assert){
	assert.expect(3);
	
	var locate = new nyc.ol.Locate(this.MOCK_GEOCODER);
	assert.notOk(locate.geolocation.getTracking());
	locate.track(true);
	assert.ok(locate.geolocation.getTracking());
	locate.track(false);
	assert.notOk(locate.geolocation.getTracking());
});

QUnit.test('search', function(assert){
	assert.expect(2);
	
	var locate = new nyc.ol.Locate(this.MOCK_GEOCODER);
	assert.equal(locate.geocoder.searchedFor, null);
	locate.search('my address');
	assert.equal(locate.geocoder.searchedFor, 'my address');
});

QUnit.test('proxyEvent', function(assert){
	assert.expect(3);
	
	var locate = new nyc.ol.Locate(this.MOCK_GEOCODER);
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
	locate.one(nyc.Locate.EventType.GEOCODE, function(data){
		assert.deepEqual(data, geocodeData1);
	});
	this.MOCK_GEOCODER.trigger(
		nyc.Locate.EventType.GEOCODE,
		geocodeData1
	);
	locate.one(nyc.Locate.EventType.AMBIGUOUS, function(data){
		assert.deepEqual(data, ambiguousData);
	});
	this.MOCK_GEOCODER.trigger(
		nyc.Locate.EventType.AMBIGUOUS,
		ambiguousData
	);
	locate.one(nyc.Locate.EventType.ERROR, function(data){
		assert.ok(true);
	});
	this.MOCK_GEOCODER.trigger(nyc.Locate.EventType.ERROR);
});

QUnit.test('locate', function(assert){
	assert.expect(2);
	var done = assert.async();
	var secondPass = false;
	var locate;
	
	var test = function(data){
		var geo = locate.geolocation;
		var projection = locate.projection;
		var coordinates = projection ? proj4('EPSG:4326', ol.proj.get(projection).getCode(), geo.getPosition()) : geo.getPosition();

		assert.deepEqual(data, {
			coordinates: coordinates,
			heading: geo.getHeading(),
			accuracy: geo.getAccuracy() / locate.metersPerUnit(), 
			type: nyc.Locate.ResultType.GEOLOCATION,
			name: ol.coordinate.toStringHDMS(geo.getPosition())
		});
		if (secondPass) done();
	};

	locate = new nyc.ol.Locate(this.MOCK_GEOCODER);
	locate.one(nyc.Locate.EventType.GEOLOCATION, test);
	locate.track(true);

	secondPass = true;
	locate = new nyc.ol.Locate(this.MOCK_GEOCODER, 'EPSG:2263');
	locate.on(nyc.Locate.EventType.GEOLOCATION, test);
	locate.track(true);

});
