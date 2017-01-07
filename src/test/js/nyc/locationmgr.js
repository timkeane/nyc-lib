QUnit.module('nyc.LocationMgr', {
	beforeEach: function(assert){
		setup(assert, this);
				
		var source = new ol.source.Vector();
		var layer = new ol.layer.Vector({source: source});
		var geocoder = new nyc.Geoclient(
				'https://maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID',
				'EPSG:4326'
			);

		this.TEST_OL_MAP.addLayer(layer);
		
		this.TEST_LOCATION_MGR = new nyc.LocationMgr({
			controls: new nyc.ol.control.ZoomSearch(this.TEST_OL_MAP),
			locate: new nyc.ol.Locate(geocoder, 'EPSG:2263'),
			locator: new nyc.ol.Locator({map: this.TEST_OL_MAP, layer: layer})
		});

	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('located (nyc.Locate.EventType.GEOLOCATION)', function(assert){
	assert.expect(3);
	
	
	var locationMgr = this.TEST_LOCATION_MGR;
	
	var data = {
		type: nyc.Locate.EventType.GEOLOCATION
	};
	
	locationMgr.locator.zoomLocation = function(d, cb){
		assert.deepEqual(d, data);
		cb();
	};
	
	locationMgr.on(nyc.Locate.EventType.GEOLOCATION, function(d){
		assert.deepEqual(d, data);
		assert.equal(locationMgr.controls.val(), '');
	});
	
	locationMgr.locate.trigger(nyc.Locate.EventType.GEOLOCATION, data);
	
});

QUnit.test('located (nyc.Locate.EventType.GEOCODE)', function(assert){
	assert.expect(6);
	
	var locationMgr = this.TEST_LOCATION_MGR;

	var data = {
		name: '102-25 67 Drive, Queens, NY 11375',
		type: nyc.Locate.EventType.GEOCODE
	};
	
	locationMgr.locator.zoomLocation = function(d, cb){
		assert.deepEqual(d, data);
		cb();
	};
	
	locationMgr.on(nyc.Locate.EventType.GEOCODE, function(d){
		assert.deepEqual(d, data);
		assert.equal(locationMgr.controls.val(), '102-25 67 Drive, Queens, NY 11375');
	});
	
	locationMgr.locate.trigger(nyc.Locate.EventType.GEOCODE, data);

	locationMgr.controls.trigger(nyc.ZoomSearch.EventType.DISAMBIGUATED, data);
});

QUnit.test('ambiguous (no possible matches)', function(assert){
	assert.expect(2);
	
	var data = {
		type: nyc.Locate.EventType.AMBIGUOUS,
		possible: []
	};
		
	this.TEST_LOCATION_MGR.dialog = {
		ok: function(msg){
			assert.deepEqual(msg, {message:'The location you entered was not understood'});
		}
	};
	
	this.TEST_LOCATION_MGR.controls.disambiguate = function(d){
		assert.ok(false);
	};
	
	this.TEST_LOCATION_MGR.controls.searching = function(searching){
		assert.notOk(searching);
	};
	
	this.TEST_LOCATION_MGR.locate.trigger(nyc.Locate.EventType.AMBIGUOUS, data);
});

QUnit.test('ambiguous (has possible matches)', function(assert){
	assert.expect(1);
	
	var data = {
		type: nyc.Locate.EventType.AMBIGUOUS,
		possible: [{name: 'possible1'}, {name: 'possible2'}]
	};
		
	this.TEST_LOCATION_MGR.dialog = {
		ok: function(msg){
			assert.ok(false);
		}
	};
	
	this.TEST_LOCATION_MGR.controls.disambiguate = function(d){
		assert.deepEqual(d, data);
	};
	
	this.TEST_LOCATION_MGR.locate.trigger(nyc.Locate.EventType.AMBIGUOUS, data);
});

QUnit.test('ZoomSearch events', function(assert){
	assert.expect(2);
		
	var inputAddr = '2 Metrotech Ctr, Brooklyn';

	var MockLocate = function(){};
	MockLocate.prototype = {
		search: function(input){
			assert.deepEqual(input, inputAddr);
		},
		locate: function(){
			assert.ok(true);
		}
	};
	nyc.inherits(MockLocate, nyc.EventHandling);
		
	var locationMgr = new nyc.LocationMgr({
		controls: new nyc.ol.control.ZoomSearch(this.TEST_OL_MAP),
		locate: new MockLocate(),
		locator: {}
	});
		
	locationMgr.dialog = {
		ok: function(msg){
			assert.ok(false);
		}
	};
	
	locationMgr.controls.trigger(nyc.ZoomSearch.EventType.SEARCH, inputAddr);
	locationMgr.controls.trigger(nyc.ZoomSearch.EventType.GEOLOCATE);
});
