QUnit.module('nyc.ol.control.LayerPicker', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('constructor with layerGroups', function(assert){
	assert.expect(6);
	
	var options = {
		map: 'myMap',
		layerGroups: 'myLayerGroups',
		target: 'myTarget'
	};
	
	var render = nyc.ol.control.LayerPicker.prototype.render;
	nyc.ol.control.LayerPicker.prototype.render = function(map, layerGroups, target){
		assert.equal(map, 'myMap');
		assert.equal(layerGroups, 'myLayerGroups');
		assert.equal(target, 'myTarget');
	};
	
	var picker = new nyc.ol.control.LayerPicker(options);
	
	assert.equal(picker.map, 'myMap');
	assert.equal(picker.layerGroups, 'myLayerGroups');
	assert.deepEqual(picker.controls, []);
	
	nyc.ol.control.LayerPicker.prototype.render = render;
});

QUnit.test('constructor without layerGroups', function(assert){
	assert.expect(7);
	
	var options = {
		map: 'myMap',
		target: 'myTarget'
	};
	
	var getLayerGoupsFromMap = nyc.ol.control.LayerPicker.prototype.getLayerGoupsFromMap;
	var render = nyc.ol.control.LayerPicker.prototype.render;
	nyc.ol.control.LayerPicker.prototype.getLayerGoupsFromMap = function(map){
		assert.equal(map, 'myMap');
		return 'someLayerGroups';
	};
	nyc.ol.control.LayerPicker.prototype.render = function(map, layerGroups, target){
		assert.equal(map, 'myMap');
		assert.equal(layerGroups, 'someLayerGroups');
		assert.equal(target, 'myTarget');
	};
	
	var picker = new nyc.ol.control.LayerPicker(options);
	
	assert.equal(picker.map, 'myMap');
	assert.equal(picker.layerGroups, 'someLayerGroups');
	assert.deepEqual(picker.controls, []);
	
	nyc.ol.control.LayerPicker.prototype.getLayerGoupsFromMap = getLayerGoupsFromMap;
	nyc.ol.control.LayerPicker.prototype.render = render;
});

QUnit.test('getLayerGoupsFromMap', function(assert){
	assert.expect(1);
	
	var options = {
		map: 'myMap',
		target: 'myTarget'
	};
	
	try{
		new nyc.ol.control.LayerPicker(options);
		assert.ok(false);
	}catch (e){
		assert.equal(e, 'Must be implemented');
	}
});

QUnit.test('getLayers', function(assert){
	assert.expect(4);
	
	var layer1 = new ol.layer.Base({name: 'layer1'});
	var layer2 = new ol.layer.Base({name: 'layer2'});
	var layerA = new ol.layer.Base({name: 'layerA'});
	var layerB = new ol.layer.Base({name: 'layerB'});
	
	var options = {
		map: 'myMap',
		target: 'myTarget',
		layerGroups: [{
			name: 'Group1',
			expanded: true,
			layers: [layer1, layer2]
		},
		{
			name: 'GroupA',
			singleSelect: true,
			layers: [layerA, layerB]
		}]
	};
	
	var render = nyc.ol.control.LayerPicker.prototype.render;	
	nyc.ol.control.LayerPicker.prototype.render = function(map, layerGroups, target){
		assert.equal(map, 'myMap');
		assert.deepEqual(layerGroups, options.layerGroups);
		assert.equal(target, 'myTarget');
	};
	
	var picker = new nyc.ol.control.LayerPicker(options);
	
	assert.deepEqual(picker.getLayers(), {layer1: layer1, layer2: layer2, layerA: layerA, layerB: layerB});
	
	nyc.ol.control.LayerPicker.prototype.render = render;
});

QUnit.test('getMenuId', function(assert){
	assert.expect(1);
	
	var options = {
		map: 'myMap',
		layerGroups: 'myLayerGroups',
		target: 'myTarget'
	};
	
	var render = nyc.ol.control.LayerPicker.prototype.render;	
	nyc.ol.control.LayerPicker.prototype.render = function(){};	
	
	try{
		var picker = new nyc.ol.control.LayerPicker(options);
		picker.getMenuId();
		assert.ok(false);
	}catch (e){
		assert.equal(e, 'Must be implemented');
	}
	
	nyc.ol.control.LayerPicker.prototype.render = render;
});

QUnit.test('getButtonHtml', function(assert){
	assert.expect(1);
	
	var options = {
		map: 'myMap',
		layerGroups: 'myLayerGroups',
		target: 'myTarget'
	};
	
	var render = nyc.ol.control.LayerPicker.prototype.render;	
	nyc.ol.control.LayerPicker.prototype.render = function(){};	
	
	try{
		var picker = new nyc.ol.control.LayerPicker(options);
		picker.getButtonHtml();
		assert.ok(false);
	}catch (e){
		assert.equal(e, 'Must be implemented');
	}
	
	nyc.ol.control.LayerPicker.prototype.render = render;
});

QUnit.test('addButton', function(assert){
	assert.expect(2);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: 'myLayerGroups',
		target: 'myTarget'
	};
	
	var render = nyc.ol.control.LayerPicker.prototype.render;	
	var getButtonHtml = nyc.ol.control.LayerPicker.prototype.getButtonHtml;	
	var toggleMenu = nyc.ol.control.LayerPicker.prototype.toggleMenu;	
	nyc.ol.control.LayerPicker.prototype.render = function(){};
	nyc.ol.control.LayerPicker.prototype.getButtonHtml = function(){
		return '<a id="test-btn"></a>';
	};
	nyc.ol.control.LayerPicker.prototype.toggleMenu = function(){
		assert.ok(true);
	};
	
	var picker = new nyc.ol.control.LayerPicker(options);
	picker.addButton(picker.map);
	
	assert.equal($(this.TEST_OL_MAP.getTarget()).find('#test-btn').length, 1);
	$('#test-btn').trigger('click');
	
	nyc.ol.control.LayerPicker.prototype.render = render;
	nyc.ol.control.LayerPicker.prototype.getButtonHtml = getButtonHtml;
	nyc.ol.control.LayerPicker.prototype.toggleMenu = toggleMenu;
});

QUnit.test('getContainer target provided', function(assert){
	assert.expect(3);
	
	var target = $('<div></div>');
	$('body').append(target);
	var options = {
		map: 'mymap',
		layerGroups: 'myLayerGroups',
		target: target
	};
	
	var render = nyc.ol.control.LayerPicker.prototype.render;	
	nyc.ol.control.LayerPicker.prototype.render = function(){};
	
	var picker = new nyc.ol.control.LayerPicker(options);
	
	assert.strictEqual(picker.getContainer(picker.map, target).get(0), target.get(0));
	assert.strictEqual(picker.container.get(0), target.get(0));
	assert.equal(picker.container.length, 1);
	
	nyc.ol.control.LayerPicker.prototype.render = render;
	target.remove();
});

QUnit.test('getContainer target not provided', function(assert){
	assert.expect(5);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: 'myLayerGroups'
	};
	
	var render = nyc.ol.control.LayerPicker.prototype.render;	
	var getMenuId = nyc.ol.control.LayerPicker.prototype.getMenuId;	
	var addButton = nyc.ol.control.LayerPicker.prototype.addButton;	
	nyc.ol.control.LayerPicker.prototype.render = function(){};
	nyc.ol.control.LayerPicker.prototype.getMenuId = function(){return 'test-mnu';};
	nyc.ol.control.LayerPicker.prototype.addButton = function(map){
		assert.deepEqual(map, options.map);
	};	
	
	var picker = new nyc.ol.control.LayerPicker(options);
	
	assert.strictEqual(picker.getContainer(picker.map).get(0), $(this.TEST_OL_MAP.getTarget()).find('#test-mnu').get(0));
	assert.strictEqual(picker.container.get(0), $(this.TEST_OL_MAP.getTarget()).find('#test-mnu').get(0));
	assert.strictEqual(picker.menu, $(this.TEST_OL_MAP.getTarget()).find('#test-mnu').get(0));
	assert.equal(picker.container.length, 1);
	
	nyc.ol.control.LayerPicker.prototype.render = render;
	nyc.ol.control.LayerPicker.prototype.getMenuId = getMenuId;
	nyc.ol.control.LayerPicker.prototype.addButton = addButton;
});

QUnit.test('render', function(assert){
	assert.expect(7);
	var container = $('<div></div>');
	$('body').append(container);
	
	var layer1 = new ol.layer.Base({name: 'layer1'});
	var layer2 = new ol.layer.Base({name: 'layer2', visible: false});
	var layerA = new ol.layer.Base({name: 'layerA', visible: false});
	var layerB = new ol.layer.Base({name: 'layerB', visible: false});
	
	var options = {
		map: 'myMap',
		target: 'myTarget',
		layerGroups: [{
			name: 'Group1',
			expanded: true,
			layers: [layer1, layer2]
		},
		{
			name: 'GroupA',
			singleSelect: true,
			layers: [layerA, layerB]
		}]
	};

	var getContainer = nyc.ol.control.LayerPicker.prototype.getContainer;
	nyc.ol.control.LayerPicker.prototype.getContainer= function(map, target){
		assert.equal(map, options.map);
		assert.equal(target, options.target);
		return container;
	};
	
	var picker = new nyc.ol.control.LayerPicker(options);

	assert.equal(picker.controls.length, 2);
	assert.equal(picker.controls[0].type, 'checkbox');
	assert.equal(picker.controls[1].type, 'radio');
	assert.deepEqual(picker.controls[0].choices, [
      {checked: true, label: 'layer1', value: 'layer1'},
      {checked: false, label: 'layer2', value: 'layer2'}
	]);
	assert.deepEqual(picker.controls[1].choices, [
      {checked: true, label: 'None', value: 'none'},
      {checked: false, label: 'layerA', value: 'layerA'},
      {checked: false, label: 'layerB', value: 'layerB'}
	]);
	
	nyc.ol.control.LayerPicker.prototype.getContainer = getContainer;
});

