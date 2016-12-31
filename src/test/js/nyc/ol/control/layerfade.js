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
