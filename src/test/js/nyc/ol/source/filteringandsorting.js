QUnit.module('nyc.ol.source.FilteringAndSorting', {
	beforeEach: function(assert){
		setup(assert, this);
		this.TEST_CENTER_SOURCE = new nyc.ol.source.FilteringAndSorting(
			{url: 'center.json', format: new ol.format.TopoJSON()},
			[this.TEST_CONTENT, this.FEATURE_DECORATIONS.center.fieldAccessors, this.FEATURE_DECORATIONS.center.htmlRenderer]
		);
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.TEST_CENTER_SOURCE;
	}
});


QUnit.test('sort', function(assert){
	assert.expect(19);
	var source = this.TEST_CENTER_SOURCE;
	var done = assert.async();
	
	var test = function(){
		assert.equal(source.getFeatures().length, 9);
		
		var previousDistance = 0;		
		$.each(source.sort(nyc.ol.CENTER), function(_, feature){
			var line = new ol.geom.LineString([feature.getCoordinates(), nyc.ol.CENTER]);
			assert.equal(feature.getDistance(), line.getLength());
			assert.ok(feature.getDistance() >= previousDistance);
			previousDistance = feature.getDistance();
		});
		done();
	};

	$(source).on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, test);
	new ol.layer.Vector({source: source, map: this.TEST_OL_MAP});
});

QUnit.test('filter', function(assert){	
	assert.expect(26);
	var source = this.TEST_CENTER_SOURCE;
	var done = assert.async();
		
	var test = function(){
		assert.equal(source.getFeatures().length, 9);
		source.filter([{
			property: 'ACCESSIBLE',
			values: ['Y', 'N']
		}]);
		assert.equal(source.getFeatures().length, 9);
		$.each(source.getFeatures(), function(_, feature){
			assert.ok($.inArray(feature.get('ACCESSIBLE'), ['Y', 'N']) > -1);
		});
		
		source.filter([{
			property: 'ACCESSIBLE',
			values: ['Y']
		}]);
		assert.equal(source.getFeatures().length, 4);
		$.each(source.getFeatures(), function(_, feature){
			assert.ok(feature.isAccessible());
			assert.ok($.inArray(feature.get('ACCESSIBLE'), ['Y']) > -1);
		});
		
		source.filter([{
			property: 'ACCESSIBLE',
			values: ['N']
		}]);
		assert.equal(source.getFeatures().length, 5);
		$.each(source.getFeatures(), function(_, feature){
			assert.ok($.inArray(feature.get('ACCESSIBLE'), ['N']) > -1);
		});
		done();
	};

	$(source).on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, test);
	new ol.layer.Vector({source: source, map: this.TEST_OL_MAP});
});	

