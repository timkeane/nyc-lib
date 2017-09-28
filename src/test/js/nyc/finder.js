QUnit.config.requireExpects = true;

QUnit.module('nyc.FinderApp', {
	beforeEach: function(assert){
    $('body').append('<div id="map"></div>');

    this.TEST_MAP = new nyc.ol.Basemap({target: $('#map').get(0)});
    this.TEST_GEO = new nyc.Geoclient(
      'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example'
    );
    this.TEST_CTL = new nyc.ol.control.ZoomSearch(this.TEST_MAP);
    this.TEST_LOC = new nyc.ol.Locate(this.TEST_GEO);
    this.TEST_LCR = new nyc.ol.Locator({map: this.TEST_MAP});
    this.TEST_LOC_MGR = new nyc.LocationMgr({
      controls: this.TEST_CTL,
      locate: this.TEST_LOC,
      locator: this.TEST_LCR
    });

    this.TEST_SRC = new nyc.ol.source.FilteringAndSorting({}, [{
      html: function(){return $('<div>' + this.get('html') + '</div>');},
      getName: function(){return this.get('name');},
      getAddress: function(){return this.get('addr');},
    }]);
    this.TEST_SRC.addFeatures([
      new ol.Feature({geometry: new ol.geom.Point([0, 0]), name: 'feature-0', addr: 'addr-0', html: 'html-0', type1: '0', type2: 'a'}),
      new ol.Feature({geometry: new ol.geom.Point([1, 1]), name: 'feature-1', addr: 'addr-1', html: 'html-1', type1: '1', type2: 'a'}),
      new ol.Feature({geometry: new ol.geom.Point([2, 2]), name: 'feature-2', addr: 'addr-2', html: 'html-2', type1: '1', type2: 'b'}),
      new ol.Feature({geometry: new ol.geom.Point([3, 3]), name: 'feature-3', addr: 'addr-3', html: 'html-3', type1: '0', type2: 'b'})
    ]);

    var typ1 = $('<div class="filter"></div>');
    var typ2 = $('<div class="filter"></div>');
    $('body').append(typ1).append(typ2);
    this.TEST_FILTER_CTLS = [
      new nyc.Check({
        target: typ1,
        expanded: true,
        choices: [
          {name: 'type1', value: 0},
          {name: 'type1', value: 1}
        ]
      }),
      new nyc.Check({
        target: typ2,
        expanded: true,
        choices: [
          {name: 'type2', value: 0},
          {name: 'type2', value: 1}
        ]
      })
    ];
  },
	afterEach: function(assert){
    delete this.TEST_MAP;
    delete this.TEST_CTL;
    delete this.TEST_LOC;
    delete this.TEST_LCR;
    delete this.TEST_LOC_MGR;
    delete this.TEST_SRC;
    $.each(this.TEST_FILTER_CTLS, function(){
      delete this;
    });
    delete this.TEST_FILTER_CTLS;
    $('#map, #map-page, #dir-page, .dia-container, .filter').remove();
	}
});

QUnit.test('constructor', function(assert){
  assert.expect(25);

  this.TEST_SRC.set('featuresloaded', true);

  var filterControls = this.TEST_FILTER_CTLS;
  var map = this.TEST_MAP;

  var connectFilterControls = nyc.FinderApp.prototype.connectFilterControls;
  var initDirections = nyc.FinderApp.prototype.initDirections;
  var mapClick = nyc.FinderApp.prototype.mapClick;
  var ready = nyc.FinderApp.prototype.ready;
  var tabs = nyc.FinderApp.prototype.tabs;
  var located = nyc.FinderApp.prototype.located;
  var resize = nyc.FinderApp.prototype.resize;
  var share = nyc.Share;
  nyc.FinderApp.prototype.connectFilterControls = function(ctls){
    assert.ok(ctls === filterControls);
  };
  nyc.FinderApp.prototype.initDirections = function(url){
    assert.equal(url, 'directions-url');
  };
  var mockMapEvent = {type: 'click'};
  nyc.FinderApp.prototype.mapClick = function(event){
    assert.ok(event === mockMapEvent);
  };
  nyc.FinderApp.prototype.ready = function(){
    assert.ok(true);
  };
  var tabsCalls = [];
  nyc.FinderApp.prototype.tabs = function(event){
    tabsCalls.push(event.target);
  };
  var locatedCalls = [];
  nyc.FinderApp.prototype.located = function(location){
    locatedCalls.push(location);
  };
  nyc.FinderApp.prototype.resize = function(){
    assert.ok(true);
  };
  nyc.Share = function(target){
    assert.ok(target === map.getTarget());
  }

  var finder = new nyc.FinderApp({
    map: map,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

  assert.ok(nyc.finder === finder);
  assert.ok(finder.map === this.TEST_MAP);
  assert.ok(finder.view === this.TEST_MAP.getView());
  assert.ok(finder.finderSource === this.TEST_SRC);
  assert.ok(finder.locationMgr === this.TEST_LOC_MGR);
  assert.ok(finder.popup instanceof nyc.ol.Popup);
  assert.ok(finder.pager instanceof nyc.ListPager);
  assert.deepEqual(finder.location, {});

  assert.equal($('#map-page').length, 1);
  assert.equal($('#main #map').get(0), map.getTarget());
  assert.equal($('#panel').length, 1);
  assert.equal($('#dir-page').length, 1);

  this.TEST_LOC_MGR.trigger(nyc.Locate.EventType.GEOCODE, 'mock-geocode');
  this.TEST_LOC_MGR.trigger(nyc.Locate.EventType.GEOLOCATION, 'mock-geolocation');

  assert.equal(locatedCalls.length, 2);
  assert.equal(locatedCalls[0], 'mock-geocode');
  assert.equal(locatedCalls[1], 'mock-geolocation');

  map.dispatchEvent(mockMapEvent);

  $('#tabs li a').trigger('click');

  assert.equal(tabsCalls.length, 3);
  assert.ok(tabsCalls[0] === $('#map-tab-btn a').get(0));
  assert.ok(tabsCalls[1] === $('#facility-tab-btn a').get(0));
  assert.ok(tabsCalls[2] === $('#filter-tab-btn a').get(0));

  $(window).trigger('resize');

  nyc.FinderApp.prototype.connectFilterControls = connectFilterControls;
  nyc.FinderApp.prototype.initDirections = initDirections;
  nyc.FinderApp.prototype.mapClick = mapClick;
  nyc.FinderApp.prototype.ready = ready;
  nyc.FinderApp.prototype.tabs = tabs;
  nyc.FinderApp.prototype.located = located;
  nyc.FinderApp.prototype.resize = resize;
  nyc.Share = share;
});

QUnit.test('located', function(assert){
  assert.expect(4);

  this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

  finder.listFacilities = function(){
    assert.ok(true);
  };

  this.TEST_LOC_MGR.trigger(nyc.Locate.EventType.GEOCODE, 'mock-geocode');
  assert.equal(finder.location, 'mock-geocode');
  this.TEST_LOC_MGR.trigger(nyc.Locate.EventType.GEOLOCATION, 'mock-geolocation');
  assert.equal(finder.location, 'mock-geolocation');
});

QUnit.test('zoomTo', function(assert){
  assert.expect(3);

  var done = assert.async();

  var map = this.TEST_MAP;
  var view = map.getView();
  var feature = this.TEST_SRC.getFeatures()[1];
  var btn = $('<a></a>').data('feature', feature);

  this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: map,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

  view.animate = function(options){
    assert.equal(options.zoom, 15);
    assert.deepEqual(options.center, [1, 1]);
    map.dispatchEvent({type: 'moveend'});
  };
  finder.showPopup = function(feat){
    assert.ok(feat === feature);
    done();
  };

  finder.zoomTo({target: btn});
});

QUnit.test('directionsTo', function(assert){
  assert.expect(6);

  this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

  var btn = $('<a></a>');

  var origin;
  finder.origin = function(){
    return origin;
  };
  var to, facility;
  finder.directions.directions = function(options){
    assert.equal(options.from, origin);
    assert.equal(options.to, to);
    assert.equal(options.facility, facility);
  };

  var feature = this.TEST_SRC.getFeatures()[0];
  btn.data('feature', feature);
  origin = 'o0';
  to = feature.getAddress();
  facility = feature.getName();
  finder.directionsTo({target: btn});

  var feature = this.TEST_SRC.getFeatures()[1];
  btn.data('feature', feature);
  origin = 'o0';
  to = feature.getAddress();
  facility = feature.getName();
  finder.directionsTo({target: btn});

  var feature = this.TEST_SRC.getFeatures()[1];
  btn.data('feature', feature);
  origin = 'o0';
  to = feature.getAddress();
  facility = feature.getName();
  finder.directionsTo({target: btn});
});

QUnit.test('mapClick', function(assert){
  assert.expect(3);

  this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

  var mockPixel, mockFeature;
  this.TEST_MAP.forEachFeatureAtPixel = function(pix, fn){
    assert.equal(pix, mockPixel);
    fn(mockFeature);
  };

  mockPixel = 'mock-pixel-0';
  mockFeature = 'mock-feature';
  finder.showPopup = function(feature){
    assert.equal(feature, 'mock-feature');
  };
  this.TEST_MAP.dispatchEvent({type: 'click', pixel: mockPixel});

  mockPixel = 'mock-pixel-1';
  mockFeature = undefined;
  finder.showPopup = function(feature){
    assert.ok(false);
  };
  this.TEST_MAP.dispatchEvent({type: 'click', pixel: mockPixel});
});

QUnit.test('showPopup', function(assert){
  assert.expect(4);

  this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

  var feature;
  finder.popup.show = function(options){
    assert.equal(options.html.html(), feature.html().html());
    assert.ok(options.coordinates, feature.getGeometry().getCoordinates());
  };

  feature = this.TEST_SRC.getFeatures()[0];
  finder.showPopup(feature);

  feature = this.TEST_SRC.getFeatures()[3];
  finder.showPopup(feature);
});

QUnit.test('listFacilities', function(assert){
  assert.expect(6);

  this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

  $('#facility-list').html('not empty');

  finder.location = {coordinates: 'mock-coord'};
  this.TEST_SRC.sort = function(location){
    assert.equal(location, 'mock-coord');
    return 'mock-features';
  };
  finder.popup.hide = function(){
    assert.ok(true);
  };
  finder.pager.reset = function(features){
    assert.equal(features, 'mock-features');
  };
  finder.listNextPage = function(){
    assert.ok(true);
  };

  finder.listFacilities();

  assert.equal($('#facility-list').length, 1);
  assert.equal($('#facility-list').html(), '');
});

QUnit.test('listNextPage', function(assert){
  assert.expect(8);

	var done = assert.async();

  var finderSource = this.TEST_SRC;
  finderSource.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: finderSource,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

  var features = finderSource.getFeatures();
  finder.pager.next = function(){
    return [features[0], features[1]];
  };

  $('#facility-list').empty();

  finder.listNextPage();

  assert.equal($('#facility-list').children().length, 2);
  assert.ok($('#btn-more').is(':visible'));

	finder.pager.next = function(){
    return [features[2], features[3]];
  };

	finder.listNextPage();

	assert.equal($('#facility-list').children().length, 4);

	assert.equal($('#facility-list').children()[0].innerHTML, 'html-0');
	assert.equal($('#facility-list').children()[1].innerHTML, 'html-1');
	assert.equal($('#facility-list').children()[2].innerHTML, 'html-2');
	assert.equal($('#facility-list').children()[3].innerHTML, 'html-3');

	setTimeout(function(){
		assert.notOk($('#btn-more').is(':visible'));
		done();
	}, 1200);
});

QUnit.test('resize', function(assert){
  assert.expect(7);

	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

	$('#panel').width(320);
	$('#tabs li').removeClass('ui-tabs-active');
	$('#tabs li a').removeClass('ui-btn-active');
	$('#map-tab-btn').addClass('ui-tabs-active');
	$('#map-tab-btn a').addClass('ui-btn-active');

	var size;
	finder.windowSize = function(){
		return size;
	};
	finder.adjDirPage = function(sz){
		assert.deepEqual(sz, size);
	};

	size = {width: 600, height: 400};
	finder.resize();

	assert.ok($('#facility-tab-btn a').hasClass('ui-btn-active'));

	$('#panel').width(320);
	$('#tabs li').removeClass('ui-tabs-active');
	$('#tabs li a').removeClass('ui-btn-active');
	$('#filter-tab-btn').addClass('ui-tabs-active');
	$('#filter-tab-btn a').addClass('ui-btn-active');

	finder.resize();

	assert.notOk($('#facility-tab-btn a').hasClass('ui-btn-active'));
	assert.ok($('#filter-tab-btn a').hasClass('ui-btn-active'));

	$('#panel').width(320);
	$('#tabs li').removeClass('ui-tabs-active');
	$('#tabs li a').removeClass('ui-btn-active');
	$('#map-tab-btn').addClass('ui-tabs-active');
	$('#map-tab-btn a').addClass('ui-btn-active');

	size = {width: $('#panel').width(), height: 400};
	finder.resize();

	assert.notOk($('#facility-tab-btn a').hasClass('ui-btn-active'));
});

QUnit.test('adjDirPage', function(assert){
  assert.expect(8);

	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
  });

	var activePage;
	finder.activePage = function(){
		return activePage;
	};

	$('#dir-toggle a').removeClass('ui-btn-active');
	var size = {width: 400, height: 600};
	activePage = 'map-page';

	finder.adjDirPage(size);

	assert.notOk($('#dir-toggle a:first-of-type').hasClass('ui-btn-active'));
	assert.notOk($('#dir-toggle a:last-of-type').hasClass('ui-btn-active'));

	$('#dir-toggle a').removeClass('ui-btn-active');
	size = {width: 400, height: 600};
	activePage = 'dir-page';

	finder.adjDirPage(size);

	assert.notOk($('#dir-toggle a:first-of-type').hasClass('ui-btn-active'));
	assert.notOk($('#dir-toggle a:last-of-type').hasClass('ui-btn-active'));

	$('#dir-toggle a').removeClass('ui-btn-active');
	activePage = 'dir-page';
	size = {width: 400, height: 600};

	finder.adjDirPage(size);

	assert.notOk($('#dir-toggle a:first-of-type').hasClass('ui-btn-active'));
	assert.notOk($('#dir-toggle a:last-of-type').hasClass('ui-btn-active'));

	$('#dir-toggle a').removeClass('ui-btn-active');
	$('#dir-toggle a:first-of-type').addClass('ui-btn-active');
	activePage = 'dir-page';
	size = {width: 600, height: 400};

	finder.adjDirPage(size);

	assert.notOk($('#dir-toggle a:first-of-type').hasClass('ui-btn-active'));
	assert.ok($('#dir-toggle a:last-of-type').hasClass('ui-btn-active'));
});

QUnit.test('activePage', function(assert){
  assert.expect(1);

	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
	});

	assert.equal(finder.activePage(), $('body').pagecontainer('getActivePage').attr('id'));
});

QUnit.test('windowSize', function(assert){
  assert.expect(2);

	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
	});

	assert.equal(finder.windowSize().width, $(window).width());
	assert.equal(finder.windowSize().height, $(window).height());
});

QUnit.test('tabs', function(assert){
  assert.expect(3);

	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
	});

	$('#panel').css({'z-index': 2, position: 'fixed'});
	$('#facility-tab-btn a').trigger('click');

	assert.equal($('#panel').css('z-index'), 1000);

	$('#panel').css('z-index', 2);
	$('#filter-tab-btn a').trigger('click');

	assert.equal($('#panel').css('z-index'), 1000);

	$('#panel').css('z-index', 2);
	$('#map-tab-btn a').trigger('click');

	assert.equal($('#panel').css('z-index'), 999);
});

QUnit.test('initDirections (called from constructor)', function(assert){
  assert.expect(3);

	var directions = nyc.Directions;
	nyc.Directions = function(mapTarget, routeTarget, url){
			assert.equal(mapTarget, '#dir-map');
			assert.equal(routeTarget, '#directions');
			assert.equal(url, 'directions-url');
	};

	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
	});

	nyc.Directions = directions;
});

QUnit.test('connectFilterControls (no filters, called from constructor)', function(assert){
  assert.expect(4);

	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    directionsUrl: 'directions-url'
	});

	assert.notOk(finder.filterControls);
	assert.ok($('body').hasClass('finder-no-filter'));

	finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
		filterControls: [],
    directionsUrl: 'directions-url'
	});

	assert.equal(finder.filterControls.length, 0);
	assert.ok($('body').hasClass('finder-no-filter'));
});

QUnit.test('connectFilterControls (called from constructor)', function(assert){
  assert.expect(7);

	var filterControls = this.TEST_FILTER_CTLS;

	var filter = nyc.FinderApp.prototype.filter;
	nyc.FinderApp.prototype.filter = function(){
			assert.ok(true);
	};


	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
	});

	assert.equal(finder.filterControls.length, 2);
	$.each(finder.filterControls, function(i, ctl){
		assert.ok(ctl === filterControls[i]);
		assert.equal($('#filter-tab').find(ctl.container).length, 1);
		ctl.trigger('change');
	});

	nyc.FinderApp.prototype.filter = filter;
});

QUnit.test('origin', function(assert){
  assert.expect(5);

	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
	});

	delete finder.location;
	assert.equal(finder.origin(), '');

	finder.location = {};
	assert.equal(finder.origin(), '');

	finder.location = {name: 'location-name'};
	assert.equal(finder.origin(), 'location-name');

	finder.location = {type: 'geolocation', coordinates: nyc.ol.Basemap.CENTER};
	assert.equal(finder.origin()[0].toFixed(6), '40.706000');
	assert.equal(finder.origin()[1].toFixed(6), '-73.978527');
});

QUnit.test('filter', function(assert){
  assert.expect(10);

	var filterControls = this.TEST_FILTER_CTLS;

	this.TEST_SRC.set('featuresloaded', true);

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: filterControls,
    directionsUrl: 'directions-url'
	});

	var setTimeout = window.setTimeout;
	window.setTimeout = function(fn, ms){
		assert.equal(ms, 100);
		fn();
	};

	var expectedFilters;
	this.TEST_SRC.filter = function(filters){
		assert.deepEqual(filters, expectedFilters);
	};

	expectedFilters = [];
	finder.filter();

	filterControls[0].value = [{name: 'type1', value: 0}];
	expectedFilters = [{property: 'type1', values: ['0']}];
	finder.filter();

	filterControls[0].value = [{name: 'type1', value: 0}, {name: 'type1', value: 1}];
	expectedFilters = [{property: 'type1', values: ['0', '1']}];
	finder.filter();

	filterControls[1].value = [{name: 'type2', value: 0}];
	expectedFilters = [{property: 'type1', values: ['0', '1']}, {property: 'type2', values: ['0']}];
	finder.filter();

	filterControls[1].value = [{name: 'type2', value: 0}, {name: 'type2', value: 1}];
	expectedFilters = [{property: 'type1', values: ['0', '1']}, {property: 'type2', values: ['0', '1']}];
	finder.filter();

	window.setTimeout = setTimeout;
});

QUnit.test('ready (called from constructor)', function(assert){
  assert.expect(1);

	var done = assert.async();

	var listFacilities = nyc.FinderApp.prototype.listFacilities;
	nyc.FinderApp.prototype.listFacilities = function(){
		assert.ok(true);
	};

  var finder = new nyc.FinderApp({
    map: this.TEST_MAP,
    finderSource: this.TEST_SRC,
    locationMgr: this.TEST_LOC_MGR,
    filterControls: this.TEST_FILTER_CTLS,
    directionsUrl: 'directions-url'
	});

	this.TEST_SRC.set('featuresloaded', true);

	setTimeout(function(){
		nyc.FinderApp.prototype.listFacilities = listFacilities;
		done();
	}, 500);
});
