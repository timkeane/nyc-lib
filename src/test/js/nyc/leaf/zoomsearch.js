QUnit.module('nyc.leaf.ZoomSearch', {
	beforeEach: function(assert){
		setup(assert, this);
		$('body').append('<div><div id="test-map"></div></div>');
		this.MOCK_MAP = {
			zoom: 0,
			getZoom: function(){
				return this.zoom;
			},
			setZoom: function(z){
				return this.zoom = z;
			},
			getContainer: function(){
				return $('#test-map');
			},
			getMaxZoom: function(){
				return nyc.leaf.ZoomSearch.MAX_ZOOM;
			}
		};
	},
	afterEach: function(assert){
		teardown(assert, this);
		$('#test-map').parent().remove();
	}
});

QUnit.test('zoom', function(assert){
	assert.expect(4);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	
	var zoom = this.MOCK_MAP.getZoom();
	$('#btn-z-in').trigger('click');
	assert.equal(this.MOCK_MAP.getZoom(), zoom + 1);
	
	$('#btn-z-out').trigger('click');
	assert.equal(this.MOCK_MAP.getZoom(), zoom);
	
	this.MOCK_MAP.zoom = 0;
	$('#btn-z-out').trigger('click');
	assert.equal(this.MOCK_MAP.getZoom(), 0);
	
	this.MOCK_MAP.zoom = nyc.leaf.ZoomSearch.MAX_ZOOM;
	$('#btn-z-in').trigger('click');
	assert.equal(this.MOCK_MAP.getZoom(), nyc.leaf.ZoomSearch.MAX_ZOOM);
	
});

QUnit.test('container', function(assert){
	assert.expect(1);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	assert.deepEqual(control.container(), $('#test-map'));
});

QUnit.test('setFeatures (with menu, minimal options)', function(assert){
	assert.expect(6);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP, true);
	var features = [
	 	{geometry:'geom0', properties: {name: 'feature0'}},
	 	{geometry:'geom1', properties: {name: 'feature1'}},
	 	{geometry:'geom2', properties: {name: 'feature2'}}
	];
	
	control.setFeatures({
		features: features,
		featureTypeName: 'test',
		featureTypeTitle: 'Test Feature Type',
		placeholder: 'Search by Test Feature Type...'
	});
	$.each($('#fld-srch-retention li.srch-type-test'), function(i, li){
		assert.equal($(li).html(), 'feature' + i);
		assert.deepEqual($(li).data('location'), {
			name: features[i].properties.name,
			coordinates: undefined,
			geoJsonGeometry: features[i].geometry, 
			data: features[i].properties,
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			type: nyc.Locate.ResultType.GEOCODE
		});
	});
});

QUnit.test('setFeatures (without menu, all options)', function(assert){
	assert.expect(6);

	var control = new nyc.leaf.ZoomSearch(this.MOCK_MAP);
	var features = [
	 	{geometry:'geom0', properties: {name: 'feature0', label: 'label0'}},
	 	{geometry:'geom1', properties: {name: 'feature1', label: 'label1'}},
	 	{geometry:'geom2', properties: {name: 'feature2', label: 'label2'}}
	];
	
	control.setFeatures({
		features: features,
		featureTypeName: 'test',
		featureTypeTitle: 'Test Feature Type',
		nameField: 'name',
		labelField: 'label',
		placeholder: 'Search by Test Feature Type...'
	});
	$.each($('#fld-srch li.srch-type-test'), function(i, li){
		assert.equal($(li).html(), 'label' + i);
		assert.deepEqual($(li).data('location'), {
			name: features[i].properties.name,
			coordinates: undefined,
			geoJsonGeometry: features[i].geometry, 
			data: features[i].properties,
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			type: nyc.Locate.ResultType.GEOCODE
		});
	});
});

