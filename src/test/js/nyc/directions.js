QUnit.module('nyc.Directions', {
	beforeEach: function(assert){
		setup(assert, this);
		this.MOCK_GOOGLE = {
			maps: {
				TravelMode: {
					DRIVING: "DRIVING",
					WALKING: "WALKING",
					BICYCLING: "BICYCLING",
					TRANSIT: "TRANSIT"
				},
				DirectionsStatus: {OK: 'OK'}
			}
		};
			
		var dir_map_html = '<div id="dir-map"></div>';
		var mode_btn_html = '<a id="mode-transit" class="dir-mode-btn" data-role="button" data-mode="TRANSIT"></a>' +
			'<a id="mode-bike" class="dir-mode-btn" data-role="button" data-mode="BICYCLING"></a>' +
			'<a id="mode-walk" class="dir-mode-btn" data-role="button" data-mode="WALKING"></a>' +
			'<a id="mode-car" class="dir-mode-btn" data-role="button" data-mode="DRIVING"></a>';
		var from_to_html = '<div id="test-flds"><div id="fld-from"><input></div><div id="fld-to"></div><div id="fld-facility"></div></div>';
		var dir_panel_htmL = '<div id="dir-panel" style="height:800px">' +
			'<div id="directions">' +
			'<div id="dir-content" style="height:100px">' + 
			'</div></div></div>';
		var banner_html = '<div class="banner" style="height:44px"></div>';
		var copyright_html = '<div id="copyright" style="height:20px"></div>';
		var toggle_html = '<div id="dir-toggle" style="height:40px;display:block"></div>';
		
		$('body').append(dir_map_html)
			.append(mode_btn_html)
			.append(from_to_html)
			.append(dir_panel_htmL)
			.append(banner_html)
			.append(copyright_html)
			.append(toggle_html);
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.MOCK_GOOGLE;
		$('#dir-map, .dir-mode-btn, #test-flds, #dir-panel, .banner, #copyright, #dir-toggle').remove();
	}
});

QUnit.test('init', function(assert){
	assert.expect(4);
	
	var done = assert.async();

	var directions = new nyc.Directions('#dir-map', '#directions', this.GOOGLE_URL);
	directions.args = 'my args';

	directions.directions = function(args){
		assert.equal(args, 'my args');
		assert.ok(directions.map);
		assert.ok(directions.service);
		assert.ok(directions.renderer);
		done();
	};
	
	$.getScript(directions.url);
});

QUnit.test('direction (google not loaded)', function(assert){
	assert.expect(1);
	
	var done = assert.async();
	
	var googUrl = this.GOOGLE_URL;
	
	var getScript = $.getScript;
	$.getScript = function(url){
		assert.equal(url, googUrl + '&callback=nyc.directions.init');
		$.getScript = getScript;
		done();
	};
	
	var directions = new nyc.Directions('#dir-map', '#directions', this.GOOGLE_URL);
	directions.directions('my args');
});

QUnit.test('direction (google is loaded - status OK)', function(assert){
	assert.expect(11);
	
	var done = assert.async();

	var getScript = $.getScript;
	$.getScript = function(url){
		assert.ok(false, 'Script should not be reloaded');
	};

	var goog = window.google;
	window.google = this.MOCK_GOOGLE;
	
	var callingArgs = {
		from: 'my address',
		to: 'evac center address',
		mode: 'TRANSIT',
		facility: 'the evac center name'
		
	};
	var googleResponse = {
		routes: [{
			legs: [{
				start_address: 'my address, New York, USA',
				end_address: 'evac center address, New York, USA'
			}]
		}]
	};
	
	var directions = new nyc.Directions('#dir-map', '#directions', this.GOOGLE_URL);
	directions.map = 'my map';
	
	directions.service = {
		route: function(args, callback){
			assert.equal(args.origin, callingArgs.from);
			assert.equal(args.destination, callingArgs.to);
			assert.equal(args.travelMode, google.maps.TravelMode[callingArgs.mode]);
			callback(googleResponse, google.maps.DirectionsStatus.OK);
		}
	};
	directions.renderer = {
		setOptions: function(options){
			assert.equal(options.map, directions.map);
			assert.equal(options.panel, $('#directions')[0]);
			assert.equal($('#fld-facility').html(), callingArgs.facility);			
			assert.deepEqual(options.directions, googleResponse);
		}
	};
	directions.height = function(){
		assert.ok(true, 'height function called');
		assert.ok($('#mode-transit').hasClass('active-mode'));
		
		assert.equal($('#fld-from input').val(), 'my address, New York');
		assert.equal($('#fld-to').html(), 'evac center address, New York');

		$.getScript = getScript;
		
		window.google = goog;
		done();
	};
	
	directions.directions(callingArgs);
});

QUnit.test('direction (google is loaded - status not OK)', function(assert){
	assert.expect(6);

	var done = assert.async();

	var getScript = $.getScript;
	$.getScript = function(url){
		assert.ok(false, 'Script should not be reloaded');
	};

	var goog = window.google;
	window.google = this.MOCK_GOOGLE;
	
	var callingArgs = {
		from: 'my address',
		to: 'evac center address',
		mode: 'TRANSIT',
		facility: 'the evac center name'
		
	};
	var googleResponse = {
		routes: [{
			legs: [{
				start_address: 'my address, New York, USA',
				end_address: 'evac center address, New York, USA'
			}]
		}]
	};
	
	var directions = new nyc.Directions('#dir-map', '#directions', this.GOOGLE_URL);
	directions.map = 'my map';
	
	directions.service = {
		route: function(args, callback){
			assert.equal(args.origin, callingArgs.from);
			assert.equal(args.destination, callingArgs.to);
			assert.equal(args.travelMode, google.maps.TravelMode[callingArgs.mode]);
			callback(googleResponse, 'not ok...');
		}
	};
	directions.renderer = {
		setOptions: function(options){
			assert.ok(false, 'no renderer call should be made');

		}
	};
	directions.height = function(){
		assert.ok($('#mode-transit').hasClass('active-mode'));
		assert.equal($('#fld-from input').val(), 'my address');
		assert.equal($('#fld-to').html(), 'evac center address');

		$.getScript = getScript;
		window.google = goog;
		done();
	};
	
	directions.directions(callingArgs);
	
});

QUnit.test('direction (google is loaded - no from address)', function(assert){
	assert.expect(3);

	var getScript = $.getScript;
	$.getScript = function(url){
		assert.ok(false, 'Script should not be reloaded');
	};

	var goog = window.google;
	window.google = this.MOCK_GOOGLE;
	
	var callingArgs = {
		to: 'evac center address',
		mode: 'TRANSIT',
		facility: 'the evac center name'
		
	};
	var googleResponse = {
		routes: [{
			legs: [{
				start_address: 'my address, New York, USA',
				end_address: 'evac center address, New York, USA'
			}]
		}]
	};
	
	var directions = new nyc.Directions('#dir-map', '#directions', this.GOOGLE_URL);
	directions.map = 'my map';
	
	directions.service = {
		route: function(args, callback){
			assert.ok(false, 'no service call should be made');
		}
	};
	directions.renderer = {
		setOptions: function(options){
			assert.ok(false, 'no renderer call should be made');
		}
	};
	directions.height = function(){
		assert.ok(false, 'height function should not be called');
	};
	
	directions.directions(callingArgs);
	
	assert.notOk($('#mode-transit').hasClass('active-mode'));
	assert.equal($('#fld-from input').val(), '');
	assert.equal($('#fld-to').html(), 'evac center address');

	window.google = goog;
	$.getScript = getScript;
});

QUnit.test('mode', function(assert){
	assert.expect(4);

	var directions = new nyc.Directions('#dir-map', '#directions', this.GOOGLE_URL);
	
	directions.directions = function(args){
		assert.equal('TRANSIT', args.mode);
	};
	$('#mode-transit').trigger('click');
	
	directions.directions = function(args){
		assert.equal('DRIVING', args.mode);
	};
	$('#mode-car').trigger('click');
	
	directions.directions = function(args){
		assert.equal('BICYCLING', args.mode);
	};
	$('#mode-bike').trigger('click');
	
	
	directions.directions = function(args){
		assert.equal('WALKING', args.mode);
	};
	$('#mode-walk').trigger('click');
});

QUnit.test('height (large display)', function(assert){
	assert.expect(1);

	$('#dir-toggle').hide();
	
	var directions = new nyc.Directions('#dir-map', '#directions', this.GOOGLE_URL);
	directions.height();
	
	assert.equal($('#directions').height(), 800 - 0 - 44 - 100 - 20 - 10);
});

QUnit.test('height (mobile display)', function(assert){
	assert.expect(1);

	var directions = new nyc.Directions('#dir-map', '#directions', this.GOOGLE_URL);
	directions.height();
	
	assert.equal($('#directions').height(), 800 - 40 - 44 - 100 - 20 - 10);
});
