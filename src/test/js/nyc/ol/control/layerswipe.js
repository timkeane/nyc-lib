QUnit.module('nyc.ol.control.LayerSwipe', {
	beforeEach: function(assert){
		setup(assert, this);
		this.LAYER_1 = new ol.layer.Base({name: 'layer1'});
		this.LAYER_2 = new ol.layer.Base({name: 'layer2', visible: false});
		this.LAYER_A = new ol.layer.Base({name: 'layerA', visible: false});
		this.LAYER_B = new ol.layer.Base({name: 'layerB', visible: false});
		this.LAYER_GROUPS = [{
			name: 'Group1',
			layers: [this.LAYER_1, this.LAYER_2, this.LAYER_A, this.LAYER_B]
		}];
		
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.LAYER_1;
		delete this.LAYER_2;
		delete this.LAYER_A;
		delete this.LAYER_B;
		delete this.LAYER_GROUPS;
		$('.nyc-choice').each(function(){
			$(this).parent().parent().remove();
		});
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(13);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};

	var validate = nyc.ol.control.LayerSwipe.prototype.validate;
	var makeChoices = nyc.ol.control.LayerSwipe.prototype.makeChoices;
	var cancel = nyc.ol.control.LayerSwipe.prototype.cancel;
	var toggleMenu = nyc.ol.control.LayerSwipe.prototype.toggleMenu;
	var reset = nyc.ol.control.LayerSwipe.prototype.reset;
	var swp = nyc.ol.control.LayerSwipe.prototype.swipe;
	
	nyc.ol.control.LayerSwipe.prototype.validate = function(){
		assert.ok(true);
	};
	nyc.ol.control.LayerSwipe.prototype.makeChoices = function(){
		assert.ok(true);
	};
	nyc.ol.control.LayerSwipe.prototype.cancel = function(){
		assert.ok(true);
	};
	nyc.ol.control.LayerSwipe.prototype.toggleMenu = function(){
		assert.ok(true);
	};
	nyc.ol.control.LayerSwipe.prototype.reset = function(){
		assert.ok(true);
	};
	nyc.ol.control.LayerSwipe.prototype.swipe = function(event){
		assert.ok(true);
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('#btn-swipe').length, 1);
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('#mnu-swipe').length, 1);

	assert.equal(swipe.controls.length, 1);
	
	swipe.container.find('input').each(function(){
		$(this).trigger('change');
	});
	swipe.container.find('.btn-ok').trigger('click');
	swipe.container.find('.btn-cancel').trigger('click');
	$(this.TEST_OL_MAP.getTarget()).find('#btn-swipe').trigger('click');
	this.TEST_OL_MAP.dispatchEvent('pointermove',{});

	nyc.ol.control.LayerSwipe.prototype.validate = validate;
	nyc.ol.control.LayerSwipe.prototype.makeChoices = makeChoices;
	nyc.ol.control.LayerSwipe.prototype.cancel = cancel;
	nyc.ol.control.LayerSwipe.prototype.toggleMenu = toggleMenu;
	nyc.ol.control.LayerSwipe.prototype.reset = reset;
	nyc.ol.control.LayerSwipe.prototype.swipe = swp;
});

QUnit.test('getMenuId', function(assert){
	assert.expect(1);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
		
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	assert.equal(swipe.getMenuId(), 'mnu-swipe');
});

QUnit.test('getButtonHtml', function(assert){
	assert.expect(1);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
		
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	assert.equal(swipe.getButtonHtml(), nyc.ol.control.LayerSwipe.BUTTON_HTML);
});

QUnit.test('getLayerGoupsFromMap', function(assert){
	assert.expect(1);
		
	this.LAYER_A.set('name', null);
	
	this.TEST_OL_MAP.addLayer(this.LAYER_1);
	this.TEST_OL_MAP.addLayer(this.LAYER_2);
	this.TEST_OL_MAP.addLayer(this.LAYER_A);
	this.TEST_OL_MAP.addLayer(this.LAYER_B);
	
	var options = {
		map: this.TEST_OL_MAP
	};
	
	var layers = options.map.sortedPhotos();
	layers.push(this.LAYER_1);
	layers.push(this.LAYER_2);
	layers.push(this.LAYER_B);
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	assert.deepEqual(swipe.layerGroups, [{
		name: 'Swipe layers',
		expanded: true,
		layers: layers
	}]);
	
});

QUnit.test('setLeft', function(assert){
	assert.expect(4);
	
	this.LAYER_1.set('extent', [1, 2, 3, 4]);
	this.LAYER_1.setVisible(false);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	assert.notOk(swipe.leftLayer);
	
	swipe.setLeft(this.LAYER_1);
	
	assert.deepEqual(swipe.leftLayer, this.LAYER_1);
	assert.ok(swipe.leftLayer.getVisible());
	assert.deepEqual(swipe.leftLayer.get('originalExtent'), [1, 2, 3, 4]);
});

QUnit.test('setRight', function(assert){
	assert.expect(4);
	
	this.LAYER_2.setVisible(false);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	assert.notOk(swipe.rightLayer);
	
	swipe.setRight(this.LAYER_2);
	
	assert.deepEqual(swipe.rightLayer, this.LAYER_2);
	assert.ok(swipe.rightLayer.getVisible());
	assert.deepEqual(swipe.rightLayer.get('originalExtent'), nyc.ol.Basemap.UNIVERSE_EXTENT);
});

QUnit.test('cancel', function(assert){
	assert.expect(2);
		
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	swipe.setActive = function(active){
		assert.notOk(active);
	};
	swipe.reset = function(){
		assert.ok(true);
	};
		
	swipe.cancel();
});

QUnit.test('setActive', function(assert){
	assert.expect(4);
		
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	swipe.reset = function(){
		assert.ok(true);
	};
		
	swipe.map.getInteractions().forEach(function(interaction){
		if (interaction instanceof ol.interaction.DragPan){
			assert.ok(interaction.getActive());
		}
	});

	swipe.setActive(true);
	
	swipe.map.getInteractions().forEach(function(interaction){
		if (interaction instanceof ol.interaction.DragPan){
			assert.notOk(interaction.getActive());
		}
	});

	swipe.setActive(false);

	swipe.map.getInteractions().forEach(function(interaction){
		if (interaction instanceof ol.interaction.DragPan){
			assert.ok(interaction.getActive());
		}
	});
});

QUnit.test('setVisible', function(assert){
	assert.expect(4);
	
	this.LAYER_1.setVisible(false);
	this.LAYER_1.setZIndex(1);
		
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.setVisible();
	assert.notOk(this.LAYER_1.getVisible());
	assert.equal(this.LAYER_1.getZIndex(), 1);
	
	swipe.setVisible(this.LAYER_1);
	assert.ok(this.LAYER_1.getVisible());
	assert.equal(this.LAYER_1.getZIndex(), 999);
});

QUnit.test('setOriginalExtent', function(assert){
	assert.expect(2);
	
	this.LAYER_1.setExtent([1, 2, 3, 4]);
		
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.setOriginalExtent();
	assert.notOk(this.LAYER_1.get('originalExtent'));
	
	swipe.setOriginalExtent(this.LAYER_1);
	assert.deepEqual(this.LAYER_1.get('originalExtent'), [1, 2, 3, 4]);
});

QUnit.test('redraw', function(assert){
	assert.expect(2);
	
	this.TEST_OL_MAP.render = function(){
		assert.ok(true);
	};
	
	var changes = [];
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.triggerChange = function(layer){
		changes.push(layer);
	};
	
	swipe.setLeft(this.LAYER_1);
	swipe.setRight(this.LAYER_2);
	
	swipe.redraw();
	
	assert.deepEqual(changes, [this.LAYER_1, this.LAYER_2]);
});

QUnit.test('triggerChange', function(assert){
	assert.expect(1);
	
	this.LAYER_1.getSource = function(){
		return {
			dispatchEvent: function(event){
				assert.equal(event, 'change');
			}
		};
	};
		
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.triggerChange();
	swipe.triggerChange(this.LAYER_1);
});

QUnit.test('reset', function(assert){
	assert.expect(3);
	
	$('body').append('<div class="swipe-label"></div>');
	
	var changes = [];
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	swipe.redraw = function(){
		assert.ok(true);
	};
	swipe.resetExtent = function(layer){
		changes.push(layer);
	};
	
	swipe.setLeft(this.LAYER_1);
	swipe.setRight(this.LAYER_2);
	
	swipe.reset();
	
	assert.deepEqual(changes, [this.LAYER_1, this.LAYER_2]);
	assert.notOk($('.swipe-label').length);
});

QUnit.test('swipe', function(assert){
	assert.expect(8);
			
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.swipeLeft = function(x){
		assert.equal(x, 200);
	};
	swipe.swipeRight = function(x){
		assert.equal(x, 200);
	};
	swipe.label = function(pix){
		assert.equal(pix, 'pix');
	};
	swipe.redraw = function(){
		assert.ok(true);
	};
	
	swipe.setLeft(this.LAYER_A);
	swipe.setRight(this.LAYER_B);
	swipe.active = false;
	this.LAYER_A.setVisible(false);
	this.LAYER_B.setVisible(false);
	
	swipe.swipe({coordinate: [100, 300], pixel: 'xip'});

	assert.notOk(this.LAYER_A.getVisible());
	assert.notOk(this.LAYER_B.getVisible());

	swipe.active = true;
	
	swipe.swipe({coordinate: [200, 500], pixel: 'pix'});

	assert.ok(this.LAYER_A.getVisible());
	assert.ok(this.LAYER_B.getVisible());
});

QUnit.test('swipeLeft', function(assert){
	assert.expect(2);
	
	this.LAYER_1.setExtent([100, 200, 400, 500]);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.swipeLeft(300);
	
	assert.deepEqual(this.LAYER_1.getExtent(), [100, 200, 400, 500]);
	
	swipe.setLeft(this.LAYER_1);
	swipe.swipeLeft(300);
	
	assert.deepEqual(this.LAYER_1.getExtent(), [100, 200, 300, 500]);
});

QUnit.test('swipeRight', function(assert){
	assert.expect(2);
	
	this.LAYER_1.setExtent([100, 200, 400, 500]);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.swipeRight(300);
	
	assert.deepEqual(this.LAYER_1.getExtent(), [100, 200, 400, 500]);
	
	swipe.setRight(this.LAYER_1);
	swipe.swipeRight(300);
	
	assert.deepEqual(this.LAYER_1.getExtent(), [300, 200, 400, 500]);
});

QUnit.test('validate', function(assert){
	assert.expect(5);
		
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	var checboxes = swipe.container.find('input');
	
	assert.equal(swipe.container.find('input:checked').length, 1);
	
	$(checboxes.get(1)).prop('checked', true).trigger('change');

	assert.equal(swipe.container.find('input:checked').length, 2);

	$(checboxes.get(2)).prop('checked', true).trigger('change');

	assert.equal(swipe.container.find('input:checked').length, 2);

	$(checboxes.get(1)).prop('checked', false).trigger('change');

	assert.equal(swipe.container.find('input:checked').length, 1);

	$(checboxes.get(2)).prop('checked', true).trigger('change');

	assert.equal(swipe.container.find('input:checked').length, 2);
});

QUnit.test('makeChoices', function(assert){
	assert.expect(5);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.toggleMenu = function(){
		assert.ok(true);
	};
	
	assert.notOk(swipe.active);
	
	var checboxes = swipe.container.find('input');
	$(checboxes.get(0)).prop('checked', false).trigger('change');
	$(checboxes.get(1)).prop('checked', true).trigger('change');
	$(checboxes.get(2)).prop('checked', true).trigger('change');

	swipe.container.find('.btn-ok').trigger('click');
	
	assert.ok(swipe.active);
	assert.deepEqual(swipe.leftLayer, this.LAYER_2);
	assert.deepEqual(swipe.rightLayer, this.LAYER_A);
});

QUnit.test('label (no rightLayer)', function(assert){
	assert.expect(1);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.setLeft(this.LAYER_1);
	
	swipe.label([100, 200]);
	
	assert.equal($('.swipe-label').length, 0);
});

QUnit.test('label', function(assert){
	assert.expect(5);
	
	var done = assert.async();
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
	
	var swipe = new nyc.ol.control.LayerSwipe(options);
	
	swipe.setLeft(this.LAYER_1);
	swipe.setRight(this.LAYER_2);
	
	swipe.label([100, 200]);
	
	var label = $('.swipe-label');
	assert.equal(label.get(0).rows[0].cells[0].innerHTML, this.LAYER_1.get('name'));
	assert.equal(label.get(0).rows[0].cells[1].innerHTML, this.LAYER_2.get('name'));
	assert.equal(label.css('left'), 100 - label.width()/2 + 'px');
	assert.equal(label.css('top'), '200px');
	setTimeout(function(){
		assert.equal(label.css('display'), 'none');
		done();
		label.remove();
	}, 5000);
});

