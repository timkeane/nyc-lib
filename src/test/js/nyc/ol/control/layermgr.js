QUnit.module('nyc.ol.control.LayerMgr', {
	beforeEach: function(assert){
		setup(assert, this);
		this.LAYER_1 = new ol.layer.Base({name: 'layer1'});
		this.LAYER_2 = new ol.layer.Base({name: 'layer2', visible: false});
		this.LAYER_A = new ol.layer.Base({name: 'layerA', visible: false});
		this.LAYER_B = new ol.layer.Base({name: 'layerB', visible: false});
		this.LAYER_GROUPS = [{
			name: 'Group1',
			expanded: true,
			layers: [this.LAYER_1, this.LAYER_2]
		},
		{
			name: 'GroupA',
			singleSelect: true,
			layers: [this.LAYER_A, this.LAYER_B]
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
			$(this).parent().remove();
		});
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(5);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
		
	var mgr = new nyc.ol.control.LayerMgr(options);
	
	assert.equal(mgr.controls.length, 2);
	
	mgr.controls[0].choices[0].checked = false;
	mgr.controls[0].choices[1].checked = true;
	mgr.controls[0].trigger('change', mgr.controls[0].choices);
	
	assert.notOk(this.LAYER_1.getVisible());
	assert.ok(this.LAYER_2.getVisible());

	mgr.controls[1].choices[0].checked = false;
	mgr.controls[1].choices[1].checked = false;
	mgr.controls[1].choices[2].checked = true;
	mgr.controls[1].trigger('change', mgr.controls[1].choices);
	
	assert.notOk(this.LAYER_A.getVisible());
	assert.ok(this.LAYER_B.getVisible());
});

QUnit.test('getMenuId', function(assert){
	assert.expect(1);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
		
	var mgr = new nyc.ol.control.LayerMgr(options);
	
	assert.equal(mgr.getMenuId(), 'mnu-layer-mgr');
});

QUnit.test('getButtonHtml', function(assert){
	assert.expect(1);
	
	var options = {
		map: this.TEST_OL_MAP,
		layerGroups: this.LAYER_GROUPS
	};
		
	var mgr = new nyc.ol.control.LayerMgr(options);
	
	assert.equal(mgr.getButtonHtml(), nyc.ol.control.LayerMgr.BUTTON_HTML);
});

QUnit.test('getLayerGoupsFromMap', function(assert){
	assert.expect(1);
	
	var target = $('<div></div>');
	$('body').append(target);
	
	this.LAYER_A.set('name', null);
	
	var options = {
		map: new nyc.ol.Basemap({
			target: target.get(0), 
			layers: [this.LAYER_1, this.LAYER_2, this.LAYER_A, this.LAYER_B]
		})
	};
		
	var mgr = new nyc.ol.control.LayerMgr(options);
	
	assert.deepEqual(mgr.layerGroups, [{
		name: 'Aerial photos',
		expanded: true,
		singleSelect: true,
		layers: options.map.sortedPhotos()
	},
	{
		name: 'Data layers',
		layers: [this.LAYER_1, this.LAYER_2, this.LAYER_B]
	}]);
	
	target.remove();
});
