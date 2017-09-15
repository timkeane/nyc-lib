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
