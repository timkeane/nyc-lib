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
	assert.expect(0);
	
	var options = {
		map: this.TEST_OL_MAP,
		layers: this.LAYERS
	};
		
	var fade = new nyc.ol.control.LayerFade(options);
	
});
