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
		assert.ok(true, 'showChoices should be called 3 times');
	};
	nyc.ol.control.LayerFade.prototype.buttonClick = function(){
		assert.ok(true, 'buttonClick should be called 1 time');
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	assert.deepEqual(fade.layers, this.LAYERS);
	assert.equal(fade.autoFadeInterval, 2000);
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('.btn-fade').length, 1);
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('.mnu-fade').length, 1);
	assert.deepEqual(fade.menu, $(this.TEST_OL_MAP.getTarget()).find('.mnu-fade').get(0));

	$(this.TEST_OL_MAP.getTarget()).find('.btn-fade').trigger('click');
	$(fade.menu).find('a').each(function(){
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

QUnit.test('cancel', function(assert){
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
	
	$('.fade-status, .fade-progress, .fade-slider').show();
	
	fade.cancel();
	
	$.each(this.LAYERS, function(_, layer){
		assert.notOk(layer.getVisible());
		assert.equal(layer.getOpacity(), 1);
	});
	
	setTimeout(function(){
		$('.fade-status, .fade-progress, .fade-slider').each(function(){
			assert.equal($(this).css('display'), 'none');
		});
		done();
	}, 1000);
});

QUnit.test('showChoices', function(assert){
	assert.expect(14);
		
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
	
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('.mnu-fade ul li').length, 0);
	
	fade.showChoices();
	
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('.mnu-fade ul li').length, 4);
	
	$.each($(this.TEST_OL_MAP.getTarget()).find('.mnu-fade ul li'), function(i, li){
		assert.equal($(li).html(), layers[i].get('name') + '<span></span>');
	});
	
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('.fade-choices').sortable('option', 'connectWith').length, 2);
	assert.deepEqual($(this.TEST_OL_MAP.getTarget()).find('.fade-choices').sortable('option', 'connectWith').get(0), $(this.TEST_OL_MAP.getTarget()).find('.mnu-fade ul').get(0));
	assert.deepEqual($(this.TEST_OL_MAP.getTarget()).find('.fade-choices').sortable('option', 'connectWith').get(1), $(this.TEST_OL_MAP.getTarget()).find('.mnu-fade ol').get(0));

	/* 2nd call only results in function calls - adds no more list items */
	fade.showChoices();
	
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('.mnu-fade ul li').length, 4);
});

QUnit.test('swap', function(assert){
	assert.expect(20);
	
	//var done = assert.async();
	
	var layers = this.LAYERS;
	
	var options = {
		map: this.TEST_OL_MAP,
		layers: layers
	};
	
	var fade = new nyc.ol.control.LayerFade(options);

	assert.equal(fade.getElem('.mnu-fade ul li').length, 0);
	assert.equal(fade.getElem('.mnu-fade ol li').length, 1);
	assert.equal(fade.getElem('.mnu-fade ol li').not('.fade-msg').length, 0);
	
	fade.showChoices();

	assert.equal(fade.getElem('.mnu-fade ul li').length, 4);
	assert.equal(fade.getElem('.mnu-fade ol li').length, 1);
	assert.equal(fade.getElem('.mnu-fade ol li').not('.fade-msg').length, 0);
	
	var span0 = $(fade.getElem('.mnu-fade ul li').get(0)).find('span');
	var span1 = $(fade.getElem('.mnu-fade ul li').get(1)).find('span');
	var span2 = $(fade.getElem('.mnu-fade ul li').get(2)).find('span');
	var span3 = $(fade.getElem('.mnu-fade ul li').get(3)).find('span');

	span1.trigger('click');

	assert.equal($('.fade-msg').length, 0);
	assert.equal(fade.getElem('.mnu-fade ul li').length, 3);
	assert.equal(fade.getElem('.mnu-fade ol li').length, 1);
	assert.equal(fade.getElem('.mnu-fade ol li').data('fade-layer'), 'layer2');

	span0.trigger('click');

	assert.equal(fade.getElem('.mnu-fade ul li').length, 2);
	assert.equal(fade.getElem('.mnu-fade ol li').length, 2);
	assert.equal($(fade.getElem('.mnu-fade ol li').get(0)).data('fade-layer'), 'layer2');
	assert.equal($(fade.getElem('.mnu-fade ol li').get(1)).data('fade-layer'), 'layer1');

	span1.trigger('click');
	
	assert.equal(fade.getElem('.mnu-fade ul li').length, 3);
	assert.equal($(fade.getElem('.mnu-fade ul li').get(0)).data('fade-layer'), 'layer2');
	assert.equal($(fade.getElem('.mnu-fade ul li').get(1)).data('fade-layer'), 'layerA');
	assert.equal($(fade.getElem('.mnu-fade ul li').get(2)).data('fade-layer'), 'layerB');
	assert.equal(fade.getElem('.mnu-fade ol li').length, 1);
	assert.equal(fade.getElem('.mnu-fade ol li').data('fade-layer'), 'layer1');
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
	
	$('li.fade-msg').remove();
	$.each([layers[3], layers[0], layers[2]], function(){
		var li = $('<li></li>');
		li.data('fade-layer', this.get('name'));
		$('ol.fade-choices').append(li);
	});
	
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
	
	$('li.fade-msg').remove();
	$.each([layers[3], layers[0], layers[2]], function(){
		var li = $('<li></li>');
		li.data('fade-layer', this.get('name'));
		$('ol.fade-choices').append(li);
	});
	
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

QUnit.test('manualFade (first layer)', function(assert){
	assert.expect(7);

	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
		
	var fade = new nyc.ol.control.LayerFade(options);

	var layers = [this.LAYERS[0], this.LAYERS[1], this.LAYERS[2]];
	layers[0].set('nextFadeLayer', layers[1]);
	layers[1].set('nextFadeLayer', layers[2]);
	layers[2].set('lastFadeLayer', true);
	layers[0].setVisible(false);
	layers[1].setVisible(false);
	layers[2].setVisible(false);
	layers[0].setOpacity(0);
	layers[1].setOpacity(0);
	layers[2].setOpacity(0);
	
	var progress = $('#fade-progress').width(1000000000000);
	var interval = 300;
	var value = 100;

	fade.manualFade(layers, interval, value);
	
	assert.equal(progress.width(), value);
	
	$.each(layers, function(){
		assert.notOk(this.getVisible());		
	});
	
	assert.equal(layers[0].getOpacity(), 0);
	assert.equal(layers[1].getOpacity(), 0);
	assert.equal(layers[2].getOpacity(), 0);
});

QUnit.test('manualFade (second layer)', function(assert){
	assert.expect(7);

	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
		
	var fade = new nyc.ol.control.LayerFade(options);

	var layers = [this.LAYERS[0], this.LAYERS[1], this.LAYERS[2]];
	layers[0].set('nextFadeLayer', layers[1]);
	layers[1].set('nextFadeLayer', layers[2]);
	layers[2].set('lastFadeLayer', true);
	layers[0].setVisible(false);
	layers[1].setVisible(false);
	layers[2].setVisible(false);
	layers[0].setOpacity(0);
	layers[1].setOpacity(0);
	layers[2].setOpacity(0);
	
	var progress = $('#fade-progress').width(1000000000000);
	var interval = 300;
	var value = 400;
	var end = interval;
	var start = end - interval;

	fade.manualFade(layers, interval, value);
	
	assert.equal(progress.width(), value);
	
	$.each(layers, function(){
		assert.ok(this.getVisible());		
	});
	
	assert.equal(layers[0].getOpacity(), 1 - (value - start - interval/2)/interval);
	assert.equal(layers[1].getOpacity(), (value - start - interval/2)/interval);
	assert.equal(layers[2].getOpacity(), 0);
});

QUnit.test('manualFade (last layer)', function(assert){
	assert.expect(7);

	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
		
	var fade = new nyc.ol.control.LayerFade(options);

	var layers = [this.LAYERS[0], this.LAYERS[1], this.LAYERS[2]];
	layers[0].set('nextFadeLayer', layers[1]);
	layers[1].set('nextFadeLayer', layers[2]);
	layers[2].set('lastFadeLayer', true);
	layers[0].setVisible(false);
	layers[1].setVisible(false);
	layers[2].setVisible(false);
	layers[0].setOpacity(0);
	layers[1].setOpacity(0);
	layers[2].setOpacity(0);
	
	var progress = $('#fade-progress').width(1000000000000);
	var interval = 300;
	var value = 700;
	var end = 2 * interval;
	var start = end - interval;

	fade.manualFade(layers, interval, value);
	
	assert.equal(progress.width(), value);
	
	$.each(layers, function(){
		assert.ok(this.getVisible());		
	});
	
	assert.equal(layers[0].getOpacity(), 0);
	assert.equal(layers[1].getOpacity(), 1 - (value - start - interval/2)/interval);
	assert.equal(layers[2].getOpacity(), (value - start - interval/2)/interval);
});

QUnit.test('slider', function(assert){
	assert.expect(7);

	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	var layers = [this.LAYERS[0], this.LAYERS[1], this.LAYERS[2]];
	var max = $(this.TEST_OL_MAP.getTarget()).width();
	var interval = max/layers.length;
	
	fade.manualFade = function(lyrs, ivl, value){
		assert.deepEqual(lyrs, layers);
		assert.equal(ivl, interval);
		assert.equal(value, 100);
	};
	
	$('#fade-slider').hide();
	
	fade.slider(layers);
	
	assert.equal($('#fade-slider').css('display'), 'block');
	assert.equal($('#fade-slider').slider('option', 'min'), 0);
	assert.equal($('#fade-slider').slider('option', 'max'), max);
	assert.equal($('#fade-slider').slider('option', 'value'), 0);

	$('#fade-slider').slider('option', 'slide')({}, {value: 100});
});

QUnit.test('buttonClick (Cancel)', function(assert){
	assert.expect(2);

	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	fade.toggleMenu = function(){
		assert.ok(true);
	};

	fade.makeChoices = function(){
		assert.ok(false);
	};
	$('#fade-progress').width(1000);

	fade.buttonClick({currentTarget: $(fade.menu).find('a.btn-cancel')});
	
	assert.equal($('#fade-progress').width(), 0);
});

QUnit.test('buttonClick (Manual)', function(assert){
	assert.expect(3);

	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	fade.toggleMenu = function(){
		assert.ok(true);
	};

	fade.makeChoices = function(auto){
		assert.notOk(auto);
	};
	$('#fade-progress').width(1000);

	fade.buttonClick({currentTarget: $(fade.menu).find('a.btn-manual')});
	
	assert.equal($('#fade-progress').width(), 0);
});

QUnit.test('buttonClick (Auto)', function(assert){
	assert.expect(3);

	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
	
	var fade = new nyc.ol.control.LayerFade(options);
	
	fade.toggleMenu = function(){
		assert.ok(true);
	};

	fade.makeChoices = function(auto){
		assert.ok(auto);
	};
	$('#fade-progress').width(1000);

	fade.buttonClick({currentTarget: $(fade.menu).find('a.btn-auto')});
	
	assert.equal($('#fade-progress').width(), 0);
});

QUnit.test('getLayersFromMap', function(assert){
	assert.expect(2);

	this.LAYERS[0].set('name', null);
	
	var map = this.TEST_OL_MAP;
	var layers = map.sortedPhotos();
	
	$.each(this.LAYERS, function(){
		map.addLayer(this);
		if (this.get('name')){
			layers.push(this);
		}
	});
		
	var fade = new nyc.ol.control.LayerFade({map: map});
	
	assert.deepEqual(fade.getLayersFromMap(map), layers);
	assert.deepEqual(fade.layers, layers);
});

QUnit.test('getLayersByName', function(assert){
	assert.expect(1);

	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
		
	var fade = new nyc.ol.control.LayerFade(options);
	
	assert.deepEqual(fade.getLayersByName(), {
		layer1: this.LAYERS[0],
		layer2: this.LAYERS[1],
		layerA: this.LAYERS[2],
		layerB: this.LAYERS[3]
	});
});

QUnit.test('fadeIn (not lastFadeLayer)', function(assert){
	assert.expect(12);

	var done = assert.async();
	
	var layer = this.LAYERS[0];
	var autoFadeInterval = 10000;
	layer.setOpacity(0);
	layer.setVisible(false);
	layer.set('autoFadeInterval', autoFadeInterval/100);
	layer.set('fadeStep', 0);
	layer.fadeOut = function(){
		assert.ok(true);
	};
	layer.fadeIn = nyc.ol.control.LayerFade.fadeIn;
	
	var lastOpacity = 0;
	var interval = setInterval(function(){
		if (layer.getOpacity() >= 1){
			clearInterval(interval);
			done();
		}else{
			assert.ok(layer.getOpacity() > lastOpacity && layer.getOpacity() < 1);
			lastOpacity = layer.getOpacity();
		}
	}, 2 + autoFadeInterval/10);
	
	layer.fadeIn();
	
	assert.ok(layer.getVisible());
});

QUnit.test('fadeIn (lastFadeLayer)', function(assert){
	assert.expect(11);

	var done = assert.async();
	
	var layer = this.LAYERS[0];
	var autoFadeInterval = 10000;
	layer.setOpacity(0);
	layer.setVisible(false);
	layer.set('autoFadeInterval', autoFadeInterval/100);
	layer.set('fadeStep', 0);
	layer.set('lastFadeLayer', true);
	layer.fadeOut = function(){
		assert.notOk(true);
	};
	layer.fadeIn = nyc.ol.control.LayerFade.fadeIn;
	
	var lastOpacity = 0;
	var interval = setInterval(function(){
		if (layer.getOpacity() >= 1){
			clearInterval(interval);
			done();
		}else{
			assert.ok(layer.getOpacity() > lastOpacity && layer.getOpacity() < 1);
			lastOpacity = layer.getOpacity();
		}
	}, 2 + autoFadeInterval/10);
	
	layer.fadeIn();
	assert.ok(layer.getVisible());
});

QUnit.test('fadeOut (not lastFadeLayer)', function(assert){
	assert.expect(12);

	var done = assert.async();
	
	var layer = this.LAYERS[0];
	var autoFadeInterval = 10000;
	layer.setOpacity(1);
	layer.setVisible(false);
	layer.set('autoFadeInterval', autoFadeInterval/100);
	layer.set('fadeStep', 100);
	layer.set('nextFadeLayer', this.LAYERS[1]);
	this.LAYERS[1].fadeIn = function(){
		assert.ok(true);
	};
	layer.fadeOut = nyc.ol.control.LayerFade.fadeOut;
	
	var lastOpacity = 1;
	var interval = setInterval(function(){
		if (layer.getOpacity() <= 0){
			clearInterval(interval);
			done();
		}else{
			assert.ok(layer.getOpacity() > 0 && layer.getOpacity() < lastOpacity);
			lastOpacity = layer.getOpacity();
		}
	}, 2 + autoFadeInterval/10);
	
	layer.fadeOut();
	assert.ok(layer.getVisible());
});

QUnit.test('fadeOut (lastFadeLayer)', function(assert){
	assert.expect(11);

	var done = assert.async();
	
	var layer = this.LAYERS[0];
	var autoFadeInterval = 10000;
	layer.setOpacity(1);
	layer.setVisible(false);
	layer.set('autoFadeInterval', autoFadeInterval/100);
	layer.set('fadeStep', 100);
	layer.set('lastFadeLayer', true);
	layer.fadeOut = nyc.ol.control.LayerFade.fadeOut;
	
	var lastOpacity = 1;
	var interval = setInterval(function(){
		if (layer.getOpacity() <= 0){
			clearInterval(interval);
			done();
		}else{
			assert.ok(layer.getOpacity() > 0 && layer.getOpacity() < lastOpacity);
			lastOpacity = layer.getOpacity();
		}
	}, 2 + autoFadeInterval/10);
	
	layer.fadeOut();
	assert.ok(layer.getVisible());
});