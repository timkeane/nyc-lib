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
