QUnit.module('nyc.ol.source.Decorating', {
	beforeEach: function(assert){
		setup(assert, this);
		this.TEST_CENTER_SOURCE = new nyc.ol.source.FilteringAndSorting(
			{url: 'center.json', format: new ol.format.TopoJSON()},
			[this.TEST_CONTENT, this.FEATURE_DECORATIONS.center.fieldAccessors, this.FEATURE_DECORATIONS.center.htmlRenderer]
		);
		this.TEST_ZONE_SOURCE = new nyc.ol.source.Decorating(
			{url: 'zone.json', format: new ol.format.TopoJSON()},
			[this.TEST_CONTENT, {orders: {1: true, 2: true}}, this.FEATURE_DECORATIONS.zone.fieldAccessors, this.FEATURE_DECORATIONS.zone.htmlRenderer]
		);
		this.TEST_HTML = $('<div class="test-html"></div>');
		$('body').append(this.TEST_HTML);
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.TEST_CENTER_SOURCE;
		delete this.TEST_ZONE_SOURCE;
		this.TEST_HTML.remove();
	}
});

QUnit.test('center.json fieldAccessors', function(assert){ 
	var done = assert.async();
	var source = this.TEST_CENTER_SOURCE;
	
	var test = function(){
		assert.expect(1 + (9 * source.getFeatures().length));
		assert.equal(source.getFeatures().length, 9);
		$.each(source.getFeatures(), function(_, feature){
			assert.deepEqual(feature.getCoordinates(), feature.getGeometry().getCoordinates());
			assert.equal(feature.getName(), feature.get('NAME'));
			assert.equal(feature.getAddress1(), feature.get('ADDRESS'));
			assert.equal(feature.getAddress2(), feature.get('CITY') + ', NY ' + feature.get('ZIP'));
			assert.equal(feature.getAddress(), feature.get('ADDRESS') + ', ' + feature.get('CITY') + ', NY ' + feature.get('ZIP'));
			assert.equal(feature.getCross1(), feature.get('CROSS1'));
			assert.equal(feature.getCross2(), feature.get('CROSS2'));
			assert[feature.get('ACCESSIBLE') != 'N' ? 'ok' : 'notOk'](feature.isAccessible());
			feature.setDistance(5);
			assert.equal(feature.getDistance(), 5);
			feature.setDistance(undefined);
		});
		done();
	}
	source.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, test);
	new ol.layer.Vector({source: source, map: this.TEST_OL_MAP});
});	

QUnit.test('center.json htmlRenderer', function(assert){
	var source = this.TEST_CENTER_SOURCE;
	var testHtml = this.TEST_HTML;
	
	var done = assert.async();
	
	var test = function(){
		var accessibleFeatures = 0;
		var nonAccessibleFeatures = 0;
		
		$.each(source.getFeatures(), function(_, feature){
			if (feature.isAccessible()){
				accessibleFeatures++;
			}else{
				nonAccessibleFeatures++;
			}
		});
		
		assert.expect(1 + (13 * (accessibleFeatures + nonAccessibleFeatures)) + (5 * accessibleFeatures) + (2 * nonAccessibleFeatures));

		assert.equal(source.getFeatures().length, 9);
		$.each(source.getFeatures(), function(_, feature){
			var html = feature.html('test-html');
			testHtml.last().html(html);
			
			assert.equal($('div.test-html.inf-center div.inf-name.notranslate').length, 1);
			assert.equal($('div.test-html.inf-center div.inf-name.notranslate').html(), feature.getName());
			
			assert.equal($('div.test-html.inf-center div.inf-addr.notranslate').length, 2);
			assert.equal($('div.test-html.inf-center div.inf-addr.notranslate')[0].innerHTML, feature.getAddress1());
			assert.equal($('div.test-html.inf-center div.inf-addr.notranslate')[1].innerHTML, feature.getAddress2());

			assert.equal($('div.test-html.inf-center div.inf-addr.inf-cross').length, 1);
			assert.equal($('div.test-html.inf-center div.inf-addr.inf-cross').html(),
				'Between <span class="notranslate" translate="no">' +
				feature.getCross1() + '</span> and <span class="notranslate" translate="no">' +
				feature.getCross2() + '</span>'
			);
			
			assert.equal($('div.test-html.inf-center div.capitalize.inf-btn.inf-map').length, 1);
			assert.equal($('div.test-html.inf-center div.capitalize.inf-btn.inf-map').children().first().html(), 'map');
			assert.equal($('div.test-html.inf-center div.capitalize.inf-btn.inf-map').children().first().attr('onclick'),
				'nyc.app.zoomFacility("' + feature.getId() + '");'
			);

			assert.equal($('div.test-html.inf-center div.capitalize.inf-btn.inf-dir').length, 1);
			assert.equal($('div.test-html.inf-center div.capitalize.inf-btn.inf-dir').children().first().html(), 'directions');
			assert.equal($('div.test-html.inf-center div.capitalize.inf-btn.inf-dir').children().first().attr('onclick'),
					'nyc.app.direct("' + feature.getId() + '");'
				);

			if (feature.isAccessible()){
				assert.equal($('div.test-html.inf-center div.capitalize.inf-detail-btn').length, 1);
				assert.equal($('div.test-html.inf-center div.capitalize.inf-detail-btn').length, 1);
				assert.equal($('div.test-html.inf-center div.capitalize.inf-detail-btn').children().first().html(), 'details...');
				assert.equal($('div.test-html.inf-center div.capitalize.inf-detail-btn').children().first().attr('onclick'), 'nyc.app.access(this);');
				assert.equal($('div.test-html.inf-center div.inf-detail').html(), feature.getAccessibleFeatures());

			}else{
				assert.equal($('div.test-html.inf-center div.capitalize.inf-detail-btn').length, 0);
				assert.equal($('div.test-html.inf-center div.inf-detail-btn').length, 0);
			}
		});
		done();
	};
	
	source.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, test);
	new ol.layer.Vector({source: source, map: this.TEST_OL_MAP});
});		

QUnit.test('zone.json fieldAccessors', function(assert){
	assert.expect(15);
	var source = this.TEST_ZONE_SOURCE;
	var surfaceWater = this.SURFACE_WATER_ZONE;
	var done = assert.async();
	
	var test = function(){
		assert.equal(source.getFeatures().length, 7);
		$.each(source.getFeatures(), function(_, feature){
			assert.equal(feature.getZone(), feature.get('zone'));
			assert[feature.getZone() == surfaceWater ? 'ok' : 'notOk'](feature.isSurfaceWater());
		});
		done();
	};
	
	source.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, test);
	new ol.layer.Vector({source: source, map: this.TEST_OL_MAP});	
});

QUnit.test('zone.json htmlRenderer', function(assert){
	assert.expect(8);
	var source = this.TEST_ZONE_SOURCE;
	var content = this.TEST_CONTENT;
	var done = assert.async();

	var test = function(){
		assert.equal(source.getFeatures().length, 7);
		$.each(source.getFeatures(), function(_, feature){
			var zone = feature.getZone();
			var order = content.message((zone == 1 || zone == 2) ? 'yes_order' : 'no_order');
			if (feature.isSurfaceWater()){
				assert.notOk(feature.html());
			}else{
				assert.equal(feature.html(), content.message('zone_info', {zone: zone, order: order}));
			}
		});
		done();
	};
	
	source.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, test);
	new ol.layer.Vector({source: source, map: this.TEST_OL_MAP});
});		

QUnit.test('featuresloaded', function(assert){
	assert.expect(2);
	var source = this.TEST_ZONE_SOURCE;
	var content = this.TEST_CONTENT;
	var done = assert.async();

	var test = function(){
		assert.equal(source.getFeatures().length, 7);
		assert.ok(source.featuresloaded);
		done();
	};
	
	source.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, test);
	new ol.layer.Vector({source: source, map: this.TEST_OL_MAP});

});
