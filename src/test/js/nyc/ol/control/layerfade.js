QUnit.module('nyc.ol.control.LayerFade', {
	beforeEach: function(assert){
		setup(assert, this);
		this.LAYERS = [
			new ol.layer.Base({name: 'layer1'}),
			new ol.layer.Base({name: 'layer2', visible: false}),
			new ol.layer.Base({name: 'layerA', visible: false}),
			new ol.layer.Base({name: 'layerB', visible: false})
		];
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.LAYERS;
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(10);
	
	var done = assert.async();
	
	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS,
		autoFadeInterval: 2000,
		callback: function(){
			assert.ok(true);
			done();
		}
	};
		
	var showChoices = nyc.ol.control.LayerFade.prototype.showChoices;
	var buttonClick = nyc.ol.control.LayerFade.prototype.buttonClick;
	nyc.ol.control.LayerFade.prototype.showChoices = function(){
		assert.ok(true);
	};
	nyc.ol.control.LayerFade.prototype.buttonClick = function(){
		assert.ok(true);
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	assert.deepEqual(fade.layers, this.LAYERS);
	assert.equal(fade.autoFadeInterval, 2000);
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('#btn-fade').length, 1);
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('#mnu-fade').length, 1);
	assert.deepEqual(fade.menu, $('#mnu-fade').get(0));

	$('#btn-fade').trigger('click');
	$('.fade-btns a').each(function(){
		$(this).trigger('click');
	});
	
	nyc.ol.control.LayerFade.prototype.showChoices = showChoices;
	nyc.ol.control.LayerFade.prototype.buttonClick = buttonClick;
});

QUnit.test('setupFade', function(assert){
	assert.expect(24);
		
	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
	
	var layers = [this.LAYERS[0], this.LAYERS[2], this.LAYERS[3]];
	$.each(layers, function(_, layer){
		layer.setOpacity(1);
		layer.setVisible(false);
	});
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	fade.setupFade(layers);
	
	$.each(layers, function(_, layer){
		assert.ok(layer.getVisible());
		assert.equal(layer.get('autoFadeInterval'), fade.autoFadeInterval/100);
		assert.deepEqual(layer.fadeOut, nyc.ol.control.LayerFade.fadeOut);
		assert.deepEqual(layer.fadeIn, nyc.ol.control.LayerFade.fadeIn);
	});
	
	assert.equal(layers[0].getOpacity(), 1);
	assert.equal(layers[1].getOpacity(), 0);
	assert.equal(layers[2].getOpacity(), 0);

	assert.equal(layers[0].get('fadeStep'), 100);
	assert.equal(layers[1].get('fadeStep'), 0);
	assert.equal(layers[2].get('fadeStep'), 0);

	assert.notOk(layers[0].get('lastFadeLayer'));
	assert.notOk(layers[1].get('lastFadeLayer'));
	assert.ok(layers[2].get('lastFadeLayer'));

	assert.equal(layers[0].get('nextFadeLayer'), layers[1]);
	assert.equal(layers[1].get('nextFadeLayer'), layers[2]);
	assert.notOk(layers[2].get('nextFadeLayer'));	
});

QUnit.test('setupFade', function(assert){
	assert.expect(11);
	
	var done = assert.async();
	
	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
	
	$.each(this.LAYERS, function(_, layer){
		layer.setOpacity(0);
		layer.setVisible(true);
	});
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	$('#fade-status, #fade-progress, #fade-slider').show();
	
	fade.cancel();
	
	$.each(this.LAYERS, function(_, layer){
		assert.notOk(layer.getVisible());
		assert.equal(layer.getOpacity(), 1);
	});
	
	setTimeout(function(){
		$('#fade-status, #fade-progress, #fade-slider').each(function(){
			assert.equal($(this).css('display'), 'none');
		});
		done();
	}, 1000);
});

QUnit.test('showChoices', function(assert){
	assert.expect(12);
		
	var layers = this.LAYERS;
	
	var options = {
		map: this.TEST_OL_MAP,
		layers: layers
	};
	
	var fade = new nyc.ol.control.LayerFade(options);

	fade.cancel = function(){
		assert.ok(true);
	};
	fade.toggleMenu = function(){
		assert.ok(true);
	};
	
	assert.equal($('#mnu-fade ul li').length, 0);
	
	fade.showChoices();
	
	assert.equal($('#mnu-fade ul li').length, 4);
	
	$.each($('#mnu-fade ul li'), function(i, li){
		assert.equal($(li).html(), layers[i].get('name'));
	});
	
	assert.equal($('.fade-choices').sortable('option', 'connectWith'), '#mnu-fade ul, #mnu-fade ol');

	/* 2nd call only results in function calls - adds no more list items */
	fade.showChoices();
	
	assert.equal($('#mnu-fade ul li').length, 4);
});

QUnit.test('makeChoices (no choices)', function(assert){
	assert.expect(0);
			
	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
	
	var fadeOut = nyc.ol.control.LayerFade.fadeOut;
	
	nyc.ol.control.LayerFade.fadeOut = function(){
		assert.ok(false);
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	fade.setupFade = function(){
		assert.ok(false);
	};
	fade.status = function(){
		assert.ok(false);
	};
	fade.progress = function(){
		assert.ok(false);
	};
	fade.slider = function(){
		assert.ok(false);
	};
	
	fade.makeChoices();
	
	nyc.ol.control.LayerFade.fadeOut = fadeOut;
});

QUnit.test('makeChoices (auto)', function(assert){
	assert.expect(4);
	
	var layers = this.LAYERS;
	
	var options = {
		map: this.TEST_OL_MAP,
		layers: layers
	};
	
	layers[3].fadeOut = function(){
		assert.ok(true);
	};
	layers[0].fadeOut = function(){
		assert.ok(false);
	};
	layers[2].fadeOut = function(){
		assert.ok(false);
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	$('ol.fade-choices').append('<li>' + layers[3].get('name') + '</li>');
	$('ol.fade-choices').append('<li>' + layers[0].get('name') + '</li>');
	$('ol.fade-choices').append('<li>' + layers[2].get('name') + '</li>');
	
	fade.setupFade = function(lyrs){
		assert.deepEqual(lyrs, [layers[3], layers[0], layers[2]]);
	};
	fade.status = function(){
		assert.ok(true);
	};
	fade.progress = function(){
		assert.ok(true);
	};
	fade.slider = function(){
		assert.ok(false);
	};
	
	fade.makeChoices(true);
});

QUnit.test('makeChoices (manual)', function(assert){
	assert.expect(3);
	
	var layers = this.LAYERS;
	
	var options = {
		map: this.TEST_OL_MAP,
		layers: layers
	};
	
	layers[3].fadeOut = function(){
		assert.ok(false);
	};
	layers[0].fadeOut = function(){
		assert.ok(false);
	};
	layers[2].fadeOut = function(){
		assert.ok(false);
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	$('ol.fade-choices').append('<li>' + layers[3].get('name') + '</li>');
	$('ol.fade-choices').append('<li>' + layers[0].get('name') + '</li>');
	$('ol.fade-choices').append('<li>' + layers[2].get('name') + '</li>');
	
	fade.setupFade = function(lyrs){
		assert.deepEqual(lyrs, [layers[3], layers[0], layers[2]]);
	};
	fade.status = function(){
		assert.ok(true);
	};
	fade.progress = function(){
		assert.ok(false);
	};
	fade.slider = function(){
		assert.ok(true);
	};
	
	fade.makeChoices();
});

QUnit.test('status', function(assert){
	assert.expect(11);
	
	var done = assert.async();
	
	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	$('#fade-status').html('whatev').hide();
	
	var layers = [this.LAYERS[0], this.LAYERS[2], this.LAYERS[3]];

	fade.status(layers);
	
	setTimeout(function(){
		assert.equal($('#fade-status').css('display'), 'block');
		assert.equal($('#fade-status div').length, layers.length)
		$('#fade-status').children().each(function(i, div){
			var name = layers[i].get('name');
			assert.ok($(div).hasClass('fade-lyr-' + name));
			assert.equal($(div).html(), name);
			assert.equal(Math.round($(div).width()), Math.round($(options.map.getTarget()).width()/layers.length));
		});
		done();
	}, 1000);
});

QUnit.test('progress', function(assert){
	assert.expect(2);

	var done = assert.async();

	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS,
		autoFadeInterval: 1000
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
		
	var layers = [this.LAYERS[0], this.LAYERS[2], this.LAYERS[3]];

	var progress = $('#fade-progress').width(1000000000000);

	fade.progress(layers);

	setTimeout(function(){
		var w = $(options.map.getTarget()).width()/2;
		assert.ok(Math.abs(progress.width() - w) >= 0 && Math.abs(progress.width() - w) < 10); /* ballpark is good enough */
	}, fade.autoFadeInterval);
	setTimeout(function(){
		assert.equal(progress.width(), $(options.map.getTarget()).width());
		done();
	}, 2 * fade.autoFadeInterval);
});