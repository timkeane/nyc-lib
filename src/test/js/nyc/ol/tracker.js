QUnit.module('nyc.ol.Tracker', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('constructor (defaults)', function(assert){
	assert.expect(24);

	var trackOpts = {
		maximumAge: 10000,
		enableHighAccuracy: true,
		timeout: 600000
	};
	var showNorth = nyc.ol.Tracker.prototype.showNorth;
	var createTrackOpts = nyc.ol.Tracker.prototype.createTrackOpts;
	var setTracking = nyc.ol.Tracker.prototype.setTracking;

	nyc.ol.Tracker.prototype.createTrackOpts = function(){
		return trackOpts;
	};
	nyc.ol.Tracker.prototype.showNorth = function(show){
		assert.notOk(show);
	};
	// called from parent class ol.Geolocation
	nyc.ol.Tracker.prototype.setTracking = function(tracking){
		assert.notOk(tracking);
	};

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	assert.equal(tracker.accuracyLimit, 0);
	assert.ok(tracker.recenter);
	assert.ok(tracker.rotate);
	assert.equal(tracker.startingZoomLevel, 16);
	assert.notOk(tracker.currentZoomLevel);
	assert.ok(tracker.map === this.TEST_OL_MAP);
	assert.ok(tracker.view === this.TEST_OL_MAP.getView());
	assert.equal(tracker.deltaMean, 500);
	assert.equal(tracker.previousM, 0);
	assert.equal(tracker.img.length, 1);
	assert.notOk(tracker.img.is(':visible'));
	assert.deepEqual(tracker.geoJson, new ol.format.GeoJSON());
	assert.deepEqual(tracker.storage, new nyc.ol.storage.Local());
	assert.ok(tracker.northArrow.view === this.TEST_OL_MAP.getView());

	var appUrl = document.location.href.replace(document.location.search, '');
	assert.equal(tracker.trackStore, appUrl + 'nyc.ol.Tracker.track');
	assert.equal(tracker.positionsStore, appUrl + 'nyc.ol.Tracker.positions');

	assert.ok(tracker.getProjection() === this.TEST_OL_MAP.getView().getProjection());
	assert.ok(tracker.getTrackingOptions() === trackOpts);
	assert.ok(tracker.markerOverlay.getElement() == tracker.img.get(0));
	assert.ok(tracker.markerOverlay.getMap() == this.TEST_OL_MAP);
	assert.equal(tracker.markerOverlay.getProperties().positioning, 'center-center');
	assert.notOk(tracker.markerOverlay.getProperties().stopEvent);

	nyc.ol.Tracker.prototype.showNorth = showNorth;
	nyc.ol.Tracker.prototype.createTrackOpts = createTrackOpts;
	nyc.ol.Tracker.prototype.setTracking = setTracking;
});

QUnit.test('constructor (with options)', function(assert){
	assert.expect(24);

	var trackOpts = {
		maximumAge: 100,
		enableHighAccuracy: false,
		timeout: 1000
	};

	var options = {
		map: this.TEST_OL_MAP,
		trackingOptions: trackOpts,
		recenter: false,
		rotate: false,
		showNorth: false,
		maxPoints: 3,
		startingZoomLevel: 10,
		currentZoomLevel: true,
		accuracyLimit: 50
	};

	var showNorth = nyc.ol.Tracker.prototype.showNorth;
	var createTrackOpts = nyc.ol.Tracker.prototype.createTrackOpts;
	var setTracking = nyc.ol.Tracker.prototype.setTracking;

	nyc.ol.Tracker.prototype.createTrackOpts = function(){
		return trackOpts;
	};
	nyc.ol.Tracker.prototype.showNorth = function(show){
		assert.notOk(show);
	};
	// called from parent class ol.Geolocation
	nyc.ol.Tracker.prototype.setTracking = function(tracking){
		assert.notOk(tracking);
	};

	var tracker = new nyc.ol.Tracker(options);

	assert.equal(tracker.accuracyLimit, options.accuracyLimit);
	assert.notOk(tracker.recenter);
	assert.notOk(tracker.rotate);
	assert.equal(tracker.startingZoomLevel, options.startingZoomLevel);
	assert.ok(tracker.currentZoomLevel);
	assert.ok(tracker.map === this.TEST_OL_MAP);
	assert.ok(tracker.view === this.TEST_OL_MAP.getView());
	assert.equal(tracker.deltaMean, 500);
	assert.equal(tracker.previousM, 0);
	assert.equal(tracker.img.length, 1);
	assert.notOk(tracker.img.is(':visible'));
	assert.deepEqual(tracker.geoJson, new ol.format.GeoJSON());
	assert.deepEqual(tracker.storage, new nyc.ol.storage.Local());
	assert.ok(tracker.northArrow.view === this.TEST_OL_MAP.getView());

	var appUrl = document.location.href.replace(document.location.search, '');
	assert.equal(tracker.trackStore, appUrl + 'nyc.ol.Tracker.track');
	assert.equal(tracker.positionsStore, appUrl + 'nyc.ol.Tracker.positions');

	assert.ok(tracker.getProjection() === this.TEST_OL_MAP.getView().getProjection());
	assert.ok(tracker.getTrackingOptions() === trackOpts);
	assert.ok(tracker.markerOverlay.getElement() == tracker.img.get(0));
	assert.ok(tracker.markerOverlay.getMap() == this.TEST_OL_MAP);
	assert.equal(tracker.markerOverlay.getProperties().positioning, 'center-center');
	assert.notOk(tracker.markerOverlay.getProperties().stopEvent);

	nyc.ol.Tracker.prototype.showNorth = showNorth;
	nyc.ol.Tracker.prototype.createTrackOpts = createTrackOpts;
	nyc.ol.Tracker.prototype.setTracking = setTracking;
});

QUnit.test('setTracking (true, was not tracking, is first run)', function(assert){
	assert.expect(7);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.firstRun = true;

	var setTracking = ol.Geolocation.prototype.setTracking;
	ol.Geolocation.prototype.setTracking = function(tracking){
		assert.ok(this === tracker);
		assert.ok(tracking);
	};

	tracker.restore = function(){
		assert.ok(true);
	};
	tracker.reset = function(){
		assert.ok(false);
	};
	tracker.showNorth = function(show){
		assert.ok(show);
	};
	tracker.getTracking = function(){
		return false;
	};

	assert.equal(tracker.img.css('display'), 'none');

	tracker.setTracking(true);

	assert.notOk(tracker.firstRun);
	assert.equal(tracker.img.css('display'), 'inline');

	ol.Geolocation.prototype.setTracking = setTracking;
});

QUnit.test('setTracking (true, was not tracking, not first run)', function(assert){
	assert.expect(6);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.firstRun = false;

	var setTracking = ol.Geolocation.prototype.setTracking;
	ol.Geolocation.prototype.setTracking = function(tracking){
		assert.ok(this === tracker);
		assert.ok(tracking);
	};

	tracker.restore = function(){
		assert.ok(false);
	};
	tracker.reset = function(){
		assert.ok(true);
	};
	tracker.showNorth = function(show){
		assert.ok(show);
	};
	tracker.getTracking = function(){
		return false;
	};

	assert.equal(tracker.img.css('display'), 'none');

	tracker.setTracking(true);

	assert.equal(tracker.img.css('display'), 'inline');

	ol.Geolocation.prototype.setTracking = setTracking;
});

QUnit.test('setTracking (true, was tracking, not first run)', function(assert){
	assert.expect(5);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.firstRun = false;

	var setTracking = ol.Geolocation.prototype.setTracking;
	ol.Geolocation.prototype.setTracking = function(tracking){
		assert.ok(this === tracker);
		assert.ok(tracking);
	};

	tracker.restore = function(){
		assert.ok(false);
	};
	tracker.reset = function(){
		assert.ok(false);
	};
	tracker.showNorth = function(show){
		assert.ok(show);
	};
	tracker.getTracking = function(){
		return true;
	};

	assert.equal(tracker.img.css('display'), 'none');

	tracker.setTracking(true);

	assert.equal(tracker.img.css('display'), 'inline');

	ol.Geolocation.prototype.setTracking = setTracking;
});

QUnit.test('setTracking (false, is first run)', function(assert){
	assert.expect(4);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.firstRun = true;

	var setTracking = ol.Geolocation.prototype.setTracking;
	ol.Geolocation.prototype.setTracking = function(tracking){
		assert.ok(this === tracker);
		assert.notOk(tracking);
	};

	tracker.storage.removeItem = function(key){
		assert.ok(false);
	};
	tracker.restore = function(){
		assert.ok(false);
	};
	tracker.reset = function(){
		assert.ok(false);
	};
	tracker.showNorth = function(show){
		assert.notOk(show);
	};

	tracker.img.show();

	tracker.setTracking(false);

	assert.equal(tracker.img.css('display'), 'none');

	ol.Geolocation.prototype.setTracking = setTracking;
});

QUnit.test('setTracking (false, not first run)', function(assert){
	assert.expect(7);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.firstRun = false;

	var setTracking = ol.Geolocation.prototype.setTracking;
	ol.Geolocation.prototype.setTracking = function(tracking){
		assert.ok(this === tracker);
		assert.notOk(tracking);
	};

	var removed = [];
	tracker.storage.removeItem = function(key){
		removed.push(key);
	};
	tracker.restore = function(){
		assert.ok(false);
	};
	tracker.reset = function(){
		assert.ok(false);
	};
	tracker.showNorth = function(show){
		assert.notOk(show);
	};

	tracker.img.show();

	tracker.setTracking(false);

	assert.equal(tracker.img.css('display'), 'none');
	assert.equal(removed.length, 2);
	assert.equal(removed[0], tracker.trackStore);
	assert.equal(removed[1], tracker.positionsStore);

	ol.Geolocation.prototype.setTracking = setTracking;
});

QUnit.test('showNorth', function(assert){
	assert.expect(3);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var show = [], hide = [];
	tracker.northArrow.show = function(){
		show.push(1);
	};
	tracker.northArrow.hide = function(){
		hide.push(1);
	};

	tracker.showNorth(undefined);
	assert.equal(show.length, 1);

	tracker.showNorth(true);
	assert.equal(show.length, 2);

	tracker.showNorth(false);
	assert.equal(hide.length, 1);
});

QUnit.test('createTrackOpts', function(assert){
	assert.expect(11);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var result = tracker.createTrackOpts();
	assert.equal(result.maximumAge, 10000);
	assert.ok(result.enableHighAccuracy);
	assert.equal(result.timeout, 600000);

	var result = tracker.createTrackOpts({arbitrary: 'something'});
	assert.equal(result.maximumAge, 10000);
	assert.ok(result.enableHighAccuracy);
	assert.equal(result.timeout, 600000);
	assert.equal(result.arbitrary, 'something');

	var result = tracker.createTrackOpts({
		maximumAge: 10,
		enableHighAccuracy: false,
		timeout: 100,
		arbitrary: 'something'
	});
	assert.equal(result.maximumAge, 10);
	assert.notOk(result.enableHighAccuracy);
	assert.equal(result.timeout, 100);
	assert.equal(result.arbitrary, 'something');
});

QUnit.test('updatePosition (has position, has heading, has speed, track is long enough, can add position)', function(assert){
	assert.expect(7);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var now = Date.now;
	Date.now = function(){
			return 1900;
	};

	var positions = [[0, 1, 0, 0], [1, 2, 0, 600], [2, 3, 0, 1000], [3, 4, 0, 1500]];
	tracker.track = {
		getCoordinates: function(){
			return positions;
		}
	};
	var position = [4, 5];
	tracker.getPosition = function(){
		return position;
	};
	tracker.getAccuracy = function(){
		return 500;
	};
	tracker.getHeading = function(){
		return Math.PI;
	};
	tracker.getSpeed = function(){
		return 20;
	};
	tracker.addPosition = function(pos, accuracy, heading, m, speed){
		assert.ok(pos === position);
		assert.equal(accuracy, 500);
		assert.equal(heading, Math.PI);
		assert.equal(m, 1900);
		assert.equal(speed, 20);
		positions.push([position[0], position[1], 0, m]);
		return true;
	};
	tracker.animate = function(){
		assert.ok(true);
	};

	tracker.updatePosition();

	var len = positions.length;
	var deltaMean = (positions[len - 1][3] - positions[0][3]) / (len - 1);

	assert.equal(tracker.deltaMean, deltaMean);

	Date.now = now;
});

QUnit.test('updatePosition (has position, cannot add position)', function(assert){
	assert.expect(6);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var now = Date.now;
	Date.now = function(){
			return 1900;
	};

	var positions = [[0, 1, 0, 0], [1, 2, 0, 600], [2, 3, 0, 1000], [3, 4, 0, 1500]];
	tracker.track = {
		getCoordinates: function(){
			return positions;
		}
	};
	var position = [4, 5];
	tracker.getPosition = function(){
		return position;
	};
	tracker.getAccuracy = function(){
		return 500;
	};
	tracker.getHeading = function(){
		return Math.PI;
	};
	tracker.getSpeed = function(){
		return 20;
	};
	tracker.addPosition = function(pos, accuracy, heading, m, speed){
		assert.ok(pos === position);
		assert.equal(accuracy, 500);
		assert.equal(heading, Math.PI);
		assert.equal(m, 1900);
		assert.equal(speed, 20);
		return false;
	};
	tracker.animate = function(){
		assert.notO(true);
	};

	var deltaMean = tracker.deltaMean;

	tracker.updatePosition();

	assert.equal(tracker.deltaMean, deltaMean);

	Date.now = now;
});

QUnit.test('updatePosition (has position, has heading, has speed, track is not long enough, can add position)', function(assert){
	assert.expect(7);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var now = Date.now;
	Date.now = function(){
			return 1900;
	};

	var positions = [[0, 1, 0, 0]];
	tracker.track = {
		getCoordinates: function(){
			return positions;
		}
	};
	var position = [4, 5];
	tracker.getPosition = function(){
		return position;
	};
	tracker.getAccuracy = function(){
		return 500;
	};
	tracker.getHeading = function(){
		return Math.PI;
	};
	tracker.getSpeed = function(){
		return 20;
	};
	tracker.addPosition = function(pos, accuracy, heading, m, speed){
		assert.ok(pos === position);
		assert.equal(accuracy, 500);
		assert.equal(heading, Math.PI);
		assert.equal(m, 1900);
		assert.equal(speed, 20);
		positions.push([position[0], position[1], 0, m]);
		return true;
	};
	tracker.animate = function(){
		assert.ok(true);
	};

	tracker.updatePosition();

	var len = positions.length;
	var deltaMean = (positions[len - 1][3] - positions[0][3]) / (len - 1);

	assert.equal(tracker.deltaMean, deltaMean);

	Date.now = now;
});

QUnit.test('updatePosition (has position, no heading, no speed, track is long enough, can add position)', function(assert){
	assert.expect(7);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var now = Date.now;
	Date.now = function(){
			return 1900;
	};

	var positions = [[0, 1, 0, 0], [1, 2, 0, 600], [2, 3, 0, 1000], [3, 4, 0, 1500]];
	tracker.track = {
		getCoordinates: function(){
			return positions;
		}
	};
	var position = [4, 5];
	tracker.getPosition = function(){
		return position;
	};
	tracker.getAccuracy = function(){
		return 500;
	};
	tracker.getHeading = function(){};
	tracker.getSpeed = function(){};
	tracker.addPosition = function(pos, accuracy, heading, m, speed){
		assert.ok(pos === position);
		assert.equal(accuracy, 500);
		assert.equal(heading, 0);
		assert.equal(m, 1900);
		assert.equal(speed, 0);
		positions.push([position[0], position[1], 0, m]);
		return true;
	};
	tracker.animate = function(){
		assert.ok(true);
	};

	tracker.updatePosition();

	var len = positions.length;
	var deltaMean = (positions[len - 1][3] - positions[0][3]) / (len - 1);

	assert.equal(tracker.deltaMean, deltaMean);

	Date.now = now;
});

QUnit.test('updatePosition (no position)', function(assert){
	assert.expect(2);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var now = Date.now;
	Date.now = function(){
		assert.ok(false);
	};

	tracker.track = {
		getCoordinates: function(){
			assert.ok(false);
		}
	};
	tracker.getPosition = function(){
		assert.ok(true);
	};

	tracker.getAccuracy = function(){
		assert.ok(false);
	};
	tracker.getHeading = function(){
		assert.ok(false);
	};
	tracker.getSpeed = function(){
		assert.ok(false);
	};
	tracker.addPosition = function(pos, accuracy, heading, m, speed){
		assert.ok(false);
	};
	tracker.animate = function(){
		assert.ok(false);
	};

	var deltaMean = tracker.deltaMean;

	tracker.updatePosition();

	assert.equal(tracker.deltaMean, deltaMean);

	Date.now = now;
});

QUnit.test('addPosition (no accuracy limit)', function(assert){
	assert.expect(11);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var position = [0, 1];
	tracker.determineHeading = function(pos, heading){
		assert.ok(pos === position);
		assert.equal(heading, Math.PI);
		return 1;
	};
	tracker.updateGeometries = function(pos, accuracy, heading, m){
		assert.ok(pos === position);
		assert.equal(accuracy, 50);
		assert.equal(heading, 1);
		assert.equal(m, 1000);
		return 1;
	};
	tracker.marker = function(speed, heading){
		assert.equal(speed, 20);
		assert.equal(heading, 1);
	};
	tracker.dispatchEvent = function(event){
		assert.equal(event.type, nyc.ol.Tracker.EventType.UPDATED);
		assert.ok(event.target === tracker);
	};

	assert.ok(tracker.addPosition(position, 50, Math.PI, 1000, 20));
});

QUnit.test('addPosition (under accuracy limit)', function(assert){
	assert.expect(11);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.accuracyLimit = 100;

	var position = [0, 1];
	tracker.determineHeading = function(pos, heading){
		assert.ok(pos === position);
		assert.equal(heading, Math.PI);
		return 1;
	};
	tracker.updateGeometries = function(pos, accuracy, heading, m){
		assert.ok(pos === position);
		assert.equal(accuracy, 50);
		assert.equal(heading, 1);
		assert.equal(m, 1000);
		return 1;
	};
	tracker.marker = function(speed, heading){
		assert.equal(speed, 20);
		assert.equal(heading, 1);
	};
	tracker.dispatchEvent = function(event){
		assert.equal(event.type, nyc.ol.Tracker.EventType.UPDATED);
		assert.ok(event.target === tracker);
	};

	assert.ok(tracker.addPosition(position, 50, Math.PI, 1000, 20));
});

QUnit.test('addPosition (over accuracy limit)', function(assert){
	assert.expect(1);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.accuracyLimit = 10;

	var position = [0, 1];
	tracker.determineHeading = function(pos, heading){
		assert.ok(false);
	};
	tracker.updateGeometries = function(pos, accuracy, heading, m){
		assert.ok(false);
	};
	tracker.marker = function(speed, heading){
		assert.ok(false);
	};
	tracker.dispatchEvent = function(event){
		assert.ok(false);
	};

	assert.notOk(tracker.addPosition(position, 50, Math.PI, 1000, 20));
});

QUnit.test('updateGeometries (no maxPoints)', function(assert){
	assert.expect(13);

	var track = new ol.geom.LineString([[0, 1, 0, 100], [1, 2, 1, 200], [2, 3, 2, 300]], 'XYZM');
	var feature0 = new ol.Feature({
		id: 0,
		geometry: new ol.geom.Point([0, 1, 0, 100]),
		accuracy: 50,
		timestamp: 'mock-timestamp-0'
	});
	var feature1 = new ol.Feature({
		id: 1,
		geometry: new ol.geom.Point([1, 2, 1, 200]),
		accuracy: 100,
		timestamp: 'mock-timestamp-0'
	});
	var feature2 = new ol.Feature({
		id: 2,
		geometry: new ol.geom.Point([2, 3, 2, 300]),
		accuracy: 30,
		timestamp: 'mock-timestamp-0'
	});
	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.store = function(){
		assert.ok(true);
	};
	tracker.track = track;
	tracker.positions = [feature0, feature1, feature2];

	var now = Date.now();

	tracker.updateGeometries([3, 2], 40, 3, now);

	assert.equal(tracker.track.getCoordinates().length, 4);
	assert.deepEqual(tracker.track.getCoordinates()[0], [0, 1, 0, 100]);
	assert.deepEqual(tracker.track.getCoordinates()[1], [1, 2, 1, 200]);
	assert.deepEqual(tracker.track.getCoordinates()[2], [2, 3, 2, 300]);
	assert.deepEqual(tracker.track.getCoordinates()[3], [3, 2, 3, now]);

	assert.equal(tracker.positions.length, 4);
	assert.deepEqual(tracker.positions[0], feature0);
	assert.deepEqual(tracker.positions[1], feature1);
	assert.deepEqual(tracker.positions[2], feature2);
	assert.deepEqual(tracker.positions[3].getGeometry().getCoordinates(), [3, 2, 3, now]);
	assert.equal(tracker.positions[3].get('accuracy'), 40);
	assert.equal(tracker.positions[3].get('timestamp'), new Date(now).toISOString());
});

QUnit.test('updateGeometries (has maxPoints)', function(assert){
	assert.expect(11);

	var track = new ol.geom.LineString([[0, 1, 0, 100], [1, 2, 1, 200], [2, 3, 2, 300]], 'XYZM');
	var feature0 = new ol.Feature({
		id: 0,
		geometry: new ol.geom.Point([0, 1, 0, 100]),
		accuracy: 50,
		timestamp: 'mock-timestamp-0'
	});
	var feature1 = new ol.Feature({
		id: 1,
		geometry: new ol.geom.Point([1, 2, 1, 200]),
		accuracy: 100,
		timestamp: 'mock-timestamp-0'
	});
	var feature2 = new ol.Feature({
		id: 2,
		geometry: new ol.geom.Point([2, 3, 2, 300]),
		accuracy: 30,
		timestamp: 'mock-timestamp-0'
	});
	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.maxPoints = 3;

	tracker.store = function(){
		assert.ok(true);
	};
	tracker.track = track;
	tracker.positions = [feature0, feature1, feature2];

	var now = Date.now();

	tracker.updateGeometries([3, 2], 40, 3, now);

	assert.equal(tracker.track.getCoordinates().length, 3);
	assert.deepEqual(tracker.track.getCoordinates()[0], [1, 2, 1, 200]);
	assert.deepEqual(tracker.track.getCoordinates()[1], [2, 3, 2, 300]);
	assert.deepEqual(tracker.track.getCoordinates()[2], [3, 2, 3, now]);

	assert.equal(tracker.positions.length, 3);
	assert.deepEqual(tracker.positions[0], feature1);
	assert.deepEqual(tracker.positions[1], feature2);
	assert.deepEqual(tracker.positions[2].getGeometry().getCoordinates(), [3, 2, 3, now]);
	assert.equal(tracker.positions[2].get('accuracy'), 40);
	assert.equal(tracker.positions[2].get('timestamp'), new Date(now).toISOString());
});

QUnit.test('determineHeading (has previous heading)', function(assert){
	assert.expect(3);

	var track = new ol.geom.LineString([[0, 1, 0, 100], [1, 2, 1, 200], [2, 3, 2, 300]], 'XYZM');

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.track = track;

	assert.equal(tracker.determineHeading([3, 4], 2), 2);
	assert.equal(tracker.determineHeading([3, 4], 3), 3);
	assert.equal(tracker.determineHeading([3, 4], -3), (2 * Math.PI - 3));
});

QUnit.test('determineHeading (no previous heading)', function(assert){
	assert.expect(3);

	var track = new ol.geom.LineString([[0, 1, 0, 100], [1, 2, 1, 200], [2, 3, NaN, 300]], 'XYZM');

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.track = track;

	assert.equal(tracker.determineHeading([3, 4], 2), 2);
	assert.equal(tracker.determineHeading([3, 4], 3), 3);
	assert.equal(tracker.determineHeading([3, 4], -3), -3);
});

QUnit.test('store', function(assert){
	assert.expect(10);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.track = 'mock-track';
	tracker.positions = 'mock-positions';

	var written = [];
	var write = function(obj, options){
		written.push([obj, options]);
		return obj + '-json';
	};
	tracker.geoJson.writeGeometry = write;
	tracker.geoJson.writeFeatures = write;

	var stored = [];
	tracker.storage.setItem = function(key, item){
		stored.push([key, item]);
	};

	tracker.store();

	assert.equal(written.length, 2);
	assert.equal(written[0][0], 'mock-track');
	assert.equal(written[0][1].featureProjection.getCode(), tracker.view.getProjection().getCode());
	assert.equal(written[1][0], 'mock-positions');
	assert.equal(written[1][1].featureProjection.getCode(), tracker.view.getProjection().getCode());

	assert.equal(stored.length, 2);
	assert.equal(stored[0][0], tracker.trackStore);
	assert.equal(stored[0][1], 'mock-track-json');
	assert.equal(stored[1][0], tracker.positionsStore);
	assert.equal(stored[1][1], 'mock-positions-json');
});

QUnit.test('reset', function(assert){
	assert.expect(6);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.track = 'mock-track';
	tracker.positions = 'mock-positions';

	tracker.store = function(){
		assert.ok(true);
	};

	tracker.reset();

	assert.equal(tracker.track.getType(), 'LineString');
	assert.equal(tracker.track.getCoordinates().length, 0);
	assert.equal(tracker.track.getLayout(), 'XYZM');
	assert.ok($.isArray(tracker.positions));
	assert.equal(tracker.positions.length, 0);
});

QUnit.test('restore (has storage, yes)', function(assert){
	assert.expect(14);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var gotten = [];
	tracker.storage.getItem = function(key){
		gotten.push(key);
		if (key == tracker.trackStore){
			return 'track-json';
		}
		return 'positions-json';
	};

	var yesNo = nyc.Dialog.prototype.yesNo;
	nyc.Dialog.prototype.yesNo = function(args){
		assert.equal(args.message, 'Restore previous tracking data?');
		args.callback(true);
	};

	var restoredPositions = ['mock-feature0', 'mock-feature1'];
	tracker.geoJson.readFeatures = function(obj, options){
		assert.equal(obj, 'positions-json');
		assert.equal(options.dataProjection, 'EPSG:4326');
		assert.equal(options.featureProjection.getCode(), tracker.view.getProjection().getCode());
		return restoredPositions;
	};
	tracker.geoJson.readGeometry = function(obj, options){
		assert.equal(obj, 'track-json');
		assert.equal(options.dataProjection, 'EPSG:4326');
		assert.equal(options.featureProjection.getCode(), tracker.view.getProjection().getCode());
		return 'mock-track';
	};
	tracker.updatePosition = function(){
		// called once by restore and again when triggering change at end of test
		assert.ok(true);
	};
	tracker.updateView = function(position){
		assert.equal(position, 'mock-feature1');
	};
	tracker.reset = function(){
		assert.ok(false);
	};

	tracker.restore();

	assert.equal(tracker.track, 'mock-track');
	assert.ok(tracker.positions == restoredPositions);

	assert.equal(gotten.length, 2);
	assert.equal(gotten[0], tracker.trackStore);
	assert.equal(gotten[1], tracker.positionsStore);

	nyc.Dialog.prototype.yesNo = yesNo;
});

QUnit.test('restore (has storage, no)', function(assert){
	assert.expect(8);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var gotten = [];
	tracker.storage.getItem = function(key){
		gotten.push(key);
		if (key == tracker.trackStore){
			return 'track-json';
		}
		return 'positions-json';
	};

	var yesNo = nyc.Dialog.prototype.yesNo;
	nyc.Dialog.prototype.yesNo = function(args){
		assert.equal(args.message, 'Restore previous tracking data?');
		args.callback(false);
	};

	tracker.geoJson.readFeatures = function(obj, options){
		assert.ok(false);
	};
	tracker.geoJson.readGeometry = function(obj, options){
		assert.ok(false);
	};
	tracker.updatePosition = function(){
		assert.ok(true);
	};
	tracker.updateView = function(position){
		assert.ok(false);
	};
	tracker.reset = function(){
		assert.ok(true);
	};

	tracker.restore();

	assert.equal(tracker.track.getCoordinates().length, 0);
	assert.equal(tracker.positions.length, 0);

	assert.equal(gotten.length, 2);
	assert.equal(gotten[0], tracker.trackStore);
	assert.equal(gotten[1], tracker.positionsStore);

	nyc.Dialog.prototype.yesNo = yesNo;
});

QUnit.test('restore (no storage)', function(assert){
	assert.expect(7);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var gotten = [];
	tracker.storage.getItem = function(key){
		gotten.push(key);
	};

	var yesNo = nyc.Dialog.prototype.yesNo;
	nyc.Dialog.prototype.yesNo = function(args){
		assert.ok(false);
	};

	tracker.geoJson.readFeatures = function(obj, options){
		assert.ok(false);
	};
	tracker.geoJson.readGeometry = function(obj, options){
		assert.ok(false);
	};
	tracker.updatePosition = function(){
		assert.ok(true);
	};
	tracker.updateView = function(position){
		assert.ok(false);
	};
	tracker.reset = function(){
		assert.ok(true);
	};

	tracker.restore();

	assert.equal(tracker.track.getCoordinates().length, 0);
	assert.equal(tracker.positions.length, 0);

	assert.equal(gotten.length, 2);
	assert.equal(gotten[0], tracker.trackStore);
	assert.equal(gotten[1], tracker.positionsStore);

	nyc.Dialog.prototype.yesNo = yesNo;
});

QUnit.test('marker (has speed, no view rotation)', function(assert){
	assert.expect(3);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.rotate = false;

	tracker.marker(10, 1);

	var img = tracker.img.get(0);

	assert.equal(img.src, nyc.ol.Tracker.LOCATION_HEADING_IMG);
	assert.equal(img.style.transform, 'rotate(1rad)');
	assert.equal(img.style['-webkit-transform'], 'rotate(1rad)');
});

QUnit.test('marker (has speed, has view rotation)', function(assert){
	assert.expect(3);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.rotate = true;

	tracker.marker(10, 1);

	var img = tracker.img.get(0);

	assert.equal(img.src, nyc.ol.Tracker.LOCATION_HEADING_IMG);
	assert.equal(img.style.transform, 'rotate(0rad)');
	assert.equal(img.style['-webkit-transform'], 'rotate(0rad)');
});

QUnit.test('marker (no speed, no view rotation)', function(assert){
	assert.expect(3);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.rotate = false;

	tracker.marker(0, 1);

	var img = tracker.img.get(0);

	assert.equal(img.src, nyc.ol.Tracker.LOCATION_IMG);
	assert.notOk(img.style.transform);
	assert.notOk(img.style['-webkit-transform']);
});

QUnit.test('marker (no speed, has view rotation)', function(assert){
	assert.expect(3);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.rotate = true;

	tracker.marker(0, 1);

	var img = tracker.img.get(0);

	assert.equal(img.src, nyc.ol.Tracker.LOCATION_IMG);
	assert.notOk(img.style.transform);
	assert.notOk(img.style['-webkit-transform']);
});

QUnit.test('getCenterWithHeading (has zoom)', function(assert){
	assert.expect(2);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var result = tracker.getCenterWithHeading([100, 200], 2, 18);

	var resolution = nyc.ol.TILE_GRID.getResolution(18);
	var height = this.TEST_OL_MAP.getSize()[1];

	assert.equal(result[0], 100 - Math.sin(2) * height * resolution / 4);
	assert.equal(result[1], 200 + Math.cos(2) * height * resolution / 4);
});

QUnit.test('getCenterWithHeading (no zoom)', function(assert){
	assert.expect(2);

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	var result = tracker.getCenterWithHeading([100, 200], 2);

	var resolution = this.TEST_OL_MAP.getView().getResolution();
	var height = this.TEST_OL_MAP.getSize()[1];

	assert.equal(result[0], 100 - Math.sin(2) * height * resolution / 4);
	assert.equal(result[1], 200 + Math.cos(2) * height * resolution / 4);
});

QUnit.test('animate (no running annimation, has enough coordinates)', function(assert){
	assert.expect(49);

	var done = assert.async();

	var m = Date.now();

	var track = new ol.geom.LineString([[0, 1, 0, m - 1000], [1, 2, 1, m - 500], [2, 3, 2, m]], 'XYZM');

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.animating = false;
	tracker.animationStep = 10;
	tracker.track = track;
	tracker.markerOverlay.setPosition([0, 1, 0, 100]);

	var markerPositions = [];
	tracker.markerOverlay.setPosition = function(position){
		markerPositions.push(position);
	};
	tracker.updateView = function(position){
		assert.equal(position[0], track.getLastCoordinate()[0]);
		assert.equal(position[1], track.getLastCoordinate()[1]);
		assert.equal(position[2], track.getLastCoordinate()[2]);
		assert.equal(position[3], track.getLastCoordinate()[3]);
	};

	var test = function(animatedPositions){
		var positions = track.getCoordinates();
		var end = positions[positions.length - 1];
		var start = positions[positions.length - 2];
		var m = start[3];
		var mEnd = end[3];
		var step = (mEnd - m) / 10;
		$.each(animatedPositions, function(){
			var p = track.getCoordinateAtM(this[3], true);
			assert.equal(this[0], p[0]);
			assert.equal(this[1], p[1]);
			assert.equal(this[2], p[2]);
			assert.equal(this[3], p[3]);
		});
		assert.deepEqual(markerPositions, animatedPositions);
	};

	tracker.animate();

	var intv = setInterval(function(){
		if (tracker.animatedPositions.length == 11){
			test(tracker.animatedPositions);
			done();
			clearInterval(intv);
		}
	}, 100);
});

QUnit.test('animate (has running annimation, has enough coordinates)', function(assert){
	assert.expect(53);

	var done = assert.async();

	var m = Date.now();

	var track = new ol.geom.LineString([[0, 1, 0, m - 1000], [1, 2, 1, m - 500], [2, 3, 2, m]], 'XYZM');

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.animating = true;
	tracker.animationStep = 10;
	tracker.track = track;
	tracker.markerOverlay.setPosition([0, 1, 0, 100]);

	var markerPositions = [];
	tracker.markerOverlay.setPosition = function(position){
		markerPositions.push(position);
	};
	tracker.updateView = function(position){
		assert.equal(position[0], track.getLastCoordinate()[0]);
		assert.equal(position[1], track.getLastCoordinate()[1]);
		assert.equal(position[2], track.getLastCoordinate()[2]);
		assert.equal(position[3], track.getLastCoordinate()[3]);
	};

	var test = function(animatedPositions){
		var positions = track.getCoordinates();
		var end = positions[positions.length - 1];
		var start = positions[positions.length - 2];
		var m = start[3];
		var mEnd = end[3];
		var step = (mEnd - m) / 10;
		$.each(animatedPositions, function(){
			var p = track.getCoordinateAtM(this[3], true);
			assert.equal(this[0], p[0]);
			assert.equal(this[1], p[1]);
			assert.equal(this[2], p[2]);
			assert.equal(this[3], p[3]);
		});
		assert.deepEqual(markerPositions, animatedPositions);
	};

	tracker.animate();

	var intv = setInterval(function(){
		if (tracker.animatedPositions.length == 11){
			test(tracker.animatedPositions);
			done();
			clearInterval(intv);
		}
	}, 100);
});

QUnit.test('animate (no running annimation, not enough coordinates)', function(assert){
	assert.expect(9);

	var m = Date.now();

	var track = new ol.geom.LineString([[0, 1, 0, m]], 'XYZM');

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.animating = false;
	tracker.animationStep = 10;
	tracker.track = track;
	tracker.markerOverlay.setPosition([0, 1, 0, 100]);

	tracker.markerOverlay.setPosition = function(position){
		assert.equal(position[0], track.getLastCoordinate()[0]);
		assert.equal(position[1], track.getLastCoordinate()[1]);
		assert.equal(position[2], track.getLastCoordinate()[2]);
		assert.equal(position[3], track.getLastCoordinate()[3]);
	};

	tracker.updateView = function(position){
		assert.equal(position[0], track.getLastCoordinate()[0]);
		assert.equal(position[1], track.getLastCoordinate()[1]);
		assert.equal(position[2], track.getLastCoordinate()[2]);
		assert.equal(position[3], track.getLastCoordinate()[3]);
	};

	tracker.animate();

	assert.equal(tracker.animatedPositions.length, 0);
});

QUnit.test('animate (has running annimation, not enough coordinates)', function(assert){
	assert.expect(9);

	var m = Date.now();

	var track = new ol.geom.LineString([[0, 1, 0, m]], 'XYZM');

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});

	tracker.animating = true;
	tracker.animationStep = 10;
	tracker.track = track;
	tracker.markerOverlay.setPosition([0, 1, 0, 100]);

	tracker.markerOverlay.setPosition = function(position){
		assert.equal(position[0], track.getLastCoordinate()[0]);
		assert.equal(position[1], track.getLastCoordinate()[1]);
		assert.equal(position[2], track.getLastCoordinate()[2]);
		assert.equal(position[3], track.getLastCoordinate()[3]);
	};

	tracker.updateView = function(position){
		assert.equal(position[0], track.getLastCoordinate()[0]);
		assert.equal(position[1], track.getLastCoordinate()[1]);
		assert.equal(position[2], track.getLastCoordinate()[2]);
		assert.equal(position[3], track.getLastCoordinate()[3]);
	};

	tracker.animate();

	assert.equal(tracker.animatedPositions.length, 0);
});

QUnit.test('updateView (ol.Coordinate, positions[0], recenter, rotate, not currentZoomLevel)', function(assert){
	assert.expect(7);

	var position = [0, 1, 2, 1000];

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.positions = ['mock-feature0'];
	tracker.recenter = true;
	tracker.rotate = true;
	tracker.currentZoomLevel = false;
	tracker.startingZoomLevel = 16;

	tracker.getCenterWithHeading = function(pos, rotation, zoom){
		assert.ok(pos === position);
		assert.equal(rotation, -position[2]);
		assert.equal(zoom, 16);
		return 'mock-position';
	};
	tracker.view.cancelAnimations = function(){
		assert.ok(true);
	};
	tracker.view.animate = function(options){
		assert.equal(options.center, 'mock-position');
		assert.equal(options.zoom, 16);
		assert.equal(options.rotation, -2);
	};

	tracker.updateView(position);
});

QUnit.test('updateView (ol.Feature, positions[0], recenter, rotate, not currentZoomLevel)', function(assert){
	assert.expect(7);

	var position = new ol.Feature({geometry: new ol.geom.Point([0, 1, 2, 1000])});

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.positions = ['mock-feature0'];
	tracker.recenter = true;
	tracker.rotate = true;
	tracker.currentZoomLevel = false;
	tracker.startingZoomLevel = 16;

	tracker.getCenterWithHeading = function(pos, rotation, zoom){
		assert.deepEqual(pos, position.getGeometry().getCoordinates());
		assert.equal(rotation, -position.getGeometry().getCoordinates()[2]);
		assert.equal(zoom, 16);
		return 'mock-position';
	};
	tracker.view.cancelAnimations = function(){
		assert.ok(true);
	};
	tracker.view.animate = function(options){
		assert.equal(options.center, 'mock-position');
		assert.equal(options.zoom, 16);
		assert.equal(options.rotation, -2);
	};

	tracker.updateView(position);
});

QUnit.test('updateView (ol.Coordinate, positions[1], recenter, rotate, not currentZoomLevel)', function(assert){
	assert.expect(0);

	var position = [0, 1, 2, 1000];

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.positions = ['mock-feature0', 'mock-feature1'];
	tracker.recenter = true;
	tracker.rotate = true;
	tracker.currentZoomLevel = false;
	tracker.startingZoomLevel = 16;

	tracker.getCenterWithHeading = function(pos, rotation, zoom){
		assert.ok(false);
	};
	tracker.view.cancelAnimations = function(){
		assert.ok(false);
	};
	tracker.view.animate = function(options){
		assert.ok(false);
	};

	tracker.updateView(position);
});

QUnit.test('updateView (ol.Coordinate, positions[2], recenter, rotate, not currentZoomLevel)', function(assert){
	assert.expect(7);

	var position = [0, 1, 2, 1000];

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.positions = ['mock-feature0', 'mock-feature1', 'mock-feature2'];
	tracker.recenter = true;
	tracker.rotate = true;
	tracker.currentZoomLevel = false;
	tracker.startingZoomLevel = 16;

	tracker.getCenterWithHeading = function(pos, rotation, zoom){
		assert.ok(pos === position);
		assert.equal(rotation, -position[2]);
		assert.notOk(zoom);
		return 'mock-position';
	};
	tracker.view.cancelAnimations = function(){
		assert.ok(true);
	};
	tracker.view.animate = function(options){
		assert.equal(options.center, 'mock-position');
		assert.notOk(options.zoom);
		assert.equal(options.rotation, -2);
	};

	tracker.updateView(position);
});

QUnit.test('updateView (ol.Coordinate, positions[2], recenter, rotate, not currentZoomLevel)', function(assert){
	assert.expect(7);

	var position = [0, 1, 2, 1000];

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.positions = ['mock-feature0', 'mock-feature1', 'mock-feature2'];
	tracker.recenter = true;
	tracker.rotate = true;
	tracker.currentZoomLevel = false;
	tracker.startingZoomLevel = 16;

	tracker.getCenterWithHeading = function(pos, rotation, zoom){
		assert.ok(pos === position);
		assert.equal(rotation, -position[2]);
		assert.notOk(zoom);
		return 'mock-position';
	};
	tracker.view.cancelAnimations = function(){
		assert.ok(true);
	};
	tracker.view.animate = function(options){
		assert.equal(options.center, 'mock-position');
		assert.notOk(options.zoom);
		assert.equal(options.rotation, -2);
	};

	tracker.updateView(position);
});

QUnit.test('updateView (ol.Coordinate, positions[2], not recenter, not rotate, currentZoomLevel)', function(assert){
	assert.expect(0);

	var position = [0, 1, 2, 1000];

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.positions = ['mock-feature0', 'mock-feature1', 'mock-feature2'];
	tracker.recenter = false;
	tracker.rotate = false;
	tracker.currentZoomLevel = true;
	tracker.startingZoomLevel = -1;

	tracker.getCenterWithHeading = function(pos, rotation, zoom){
		assert.ok(false);
	};
	tracker.view.cancelAnimations = function(){
		assert.ok(false);
	};
	tracker.view.animate = function(options){
		assert.ok(false);
	};

	tracker.updateView(position);
});

QUnit.test('updateView (ol.Coordinate, positions[2], recenter, not rotate, currentZoomLevel)', function(assert){
	assert.expect(7);

	var position = [0, 1, 2, 1000];

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.positions = ['mock-feature0', 'mock-feature1', 'mock-feature2'];
	tracker.recenter = true;
	tracker.rotate = false;
	tracker.currentZoomLevel = true;
	tracker.startingZoomLevel = -1;

	tracker.getCenterWithHeading = function(pos, rotation, zoom){
		assert.ok(pos === position);
		assert.equal(rotation, -position[2]);
		assert.notOk(zoom);
		return 'mock-position';
	};
	tracker.view.cancelAnimations = function(){
		assert.ok(true);
	};
	tracker.view.animate = function(options){
		assert.equal(options.center, 'mock-position');
		assert.notOk(options.zoom);
		assert.notOk(options.rotation);
	};

	tracker.updateView(position);
});

QUnit.test('updateView (ol.Coordinate, positions[2], not recenter, rotate, not currentZoomLevel)', function(assert){
	assert.expect(4);

	var position = [0, 1, 2, 1000];

	var tracker = new nyc.ol.Tracker({
		map: this.TEST_OL_MAP
	});
	tracker.positions = ['mock-feature0', 'mock-feature1', 'mock-feature2'];
	tracker.recenter = false;
	tracker.rotate = true;
	tracker.currentZoomLevel = false;
	tracker.startingZoomLevel = -1;

	tracker.getCenterWithHeading = function(pos, rotation, zoom){
		assert.ok(false);
	};
	tracker.view.cancelAnimations = function(){
		assert.ok(true);
	};
	tracker.view.animate = function(options){
		assert.notOk();
		assert.notOk(options.zoom);
		assert.equal(options.rotation, -position[2]);
	};

	tracker.updateView(position);
});
