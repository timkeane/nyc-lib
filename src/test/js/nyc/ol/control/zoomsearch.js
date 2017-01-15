QUnit.module('nyc.ol.control.ZoomSearch', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('zoom', function(assert){
	assert.expect(2);

	var control = new nyc.ol.control.ZoomSearch(this.TEST_OL_MAP);
	var zoom = this.TEST_OL_MAP.getView().getZoom();
	 $(this.TEST_OL_MAP.getTarget()).find('.btn-z-in').trigger('click');
	assert.equal(this.TEST_OL_MAP.getView().getZoom(), zoom + 1);
	$(this.TEST_OL_MAP.getTarget()).find('.btn-z-out').trigger('click');
	assert.equal(this.TEST_OL_MAP.getView().getZoom(), zoom);
});

QUnit.test('container', function(assert){
	assert.expect(1);

	var control = new nyc.ol.control.ZoomSearch(this.TEST_OL_MAP);
	assert.deepEqual(control.getContainer(), $(this.TEST_OL_MAP.getTarget()));
});

QUnit.test('setFeatures (with menu, minimal options)', function(assert){
	assert.expect(6);

	var control = new nyc.ol.control.ZoomSearch(this.TEST_OL_MAP, true);
	var features = [
	 	new ol.Feature({geometry: new ol.geom.Point([0,1]), name: 'feature0'}),
	 	new ol.Feature({geometry: new ol.geom.Point([1,2]), name: 'feature1'}),
	 	new ol.Feature({geometry: new ol.geom.Point([2,3]), name: 'feature2'})
	];
	var geoJson = new ol.format.GeoJSON();
	
	control.setFeatures({
		features: features,
		featureTypeName: 'test',
		featureTypeTitle: 'Test Feature Type',
		placeholder: 'Search by Test Feature Type...'
	});
	$.each($(this.TEST_OL_MAP.getTarget()).find('.fld-srch-retention li.srch-type-test'), function(i, li){
		var data = features[i].getProperties();
		data.__feature_label = features[i].get('name');
		assert.equal($(li).html(), 'feature' + i);
		assert.deepEqual($(li).data('location'), {
			name: features[i].get('name'),
			coordinates: features[i].getGeometry().getCoordinates(),
			geoJsonGeometry: JSON.parse(new ol.format.GeoJSON().writeGeometry(features[i].getGeometry())), 
			data: data,
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			type: nyc.Locate.ResultType.GEOCODE
		});
	});
});

QUnit.test('setFeatures (without menu, all options)', function(assert){
	assert.expect(6);

	var control = new nyc.ol.control.ZoomSearch(this.TEST_OL_MAP);
	var features = [
	 	new ol.Feature({geometry: new ol.geom.Point([0,1]), name: 'feature0', label: 'label0'}),
	 	new ol.Feature({geometry: new ol.geom.Point([1,2]), name: 'feature1', label: 'label1'}),
	 	new ol.Feature({geometry: new ol.geom.Point([2,3]), name: 'feature2', label: 'label2'})
	];
	var geoJson = new ol.format.GeoJSON();
	
	control.setFeatures({
		features: features,
		featureTypeName: 'test',
		featureTypeTitle: 'Test Feature Type',
		nameField: 'name',
		labelField: 'label',
		placeholder: 'Search by Test Feature Type...'
	});
	$.each($(this.TEST_OL_MAP.getTarget()).find('.fld-srch li.srch-type-test'), function(i, li){
		var data = features[i].getProperties();
		data.__feature_label = features[i].get('label');
		assert.equal($(li).html(), 'label' + i);
		assert.deepEqual($(li).data('location'), {
			name: features[i].get('name'),
			coordinates: features[i].getGeometry().getCoordinates(),
			geoJsonGeometry: JSON.parse(new ol.format.GeoJSON().writeGeometry(features[i].getGeometry())), 
			data: data,
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			type: nyc.Locate.ResultType.GEOCODE
		});
	});
});

