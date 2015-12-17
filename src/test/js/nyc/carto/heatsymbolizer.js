QUnit.module('nyc.carto.HeatSymbolizer', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('symbolize (public layer)', function(assert){
	assert.expect(38);
	
	var MockMap = function(){
		this.zoom = -1;
		this.getZoom = function(){
			return this.zoom;
		}
	};
	nyc.inherits(MockMap, nyc.EventHandling);
	var map = new MockMap();
	var layer = this.MOCK_CARTODB_LAYER;
	
	var options = {
		map: map,
		layer: layer,
		css: '#carto_css{marker-width:${size};}' +
			'#carto_css_2{marker-width:${sizePlus2};}' +
			'#carto_css_4{marker-width:${sizePlus4};}'
	};
	var symbolizer = new nyc.carto.HeatSymbolizer(options);

	for (var zoom = 0; zoom < 19; zoom++){
		var idx = zoom - 10;
		var size = symbolizer.sizes[idx] || 1;
		map.zoom = zoom;
		symbolizer.one(nyc.carto.Symbolizer.EventType.SYMBOLIZED, function(css){
			assert.equal(css, '#carto_css{marker-width:' + size + ';}' +
					'#carto_css_2{marker-width:' + (size + 2) + ';}' +
					'#carto_css_4{marker-width:' + (size + 4) + ';}')
			assert.equal(layer.css, css);
		});
		map.trigger('zoomend');
	}

});

QUnit.test('symbolize (named map layer)', function(assert){
	assert.expect(38);
	
	var MockMap = function(){
		this.zoom = -1;
		this.getZoom = function(){
			return this.zoom;
		}
	};
	nyc.inherits(MockMap, nyc.EventHandling);
	var map = new MockMap();
	
	var layer = this.MOCK_CARTODB_LAYER;
	layer.getCartoCSS = function(){
		throw 'Can\'t access CartoCSS on named map layer';
	};
	
	var options = {map: map, layer: layer};
	
	var symbolizer = new nyc.carto.HeatSymbolizer(options);

	for (var zoom = 0; zoom < 19; zoom++){
		var idx = zoom - 10;
		var size = symbolizer.sizes[idx] || 1;
		map.zoom = zoom;
		symbolizer.one(nyc.carto.Symbolizer.EventType.SYMBOLIZED, function(css){
			assert.equal(css, '');
			assert.deepEqual(layer.params, {
				size: size,
				sizePlus2: size + 2,
				sizePlus4: size + 4
			});
		});
		map.trigger('zoomend');
	}

});