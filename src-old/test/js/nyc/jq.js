QUnit.module('nyc.jq.ui');

QUnit.test('load', function(assert){
	assert.expect(7);
	
	var done = assert.async();

	var html = '<div class="nyc-choice">' +
			'<label for="test-radio-1" class="ui-radio-on"></label>' +
			'<input id="test-radio-1" type="radio">' +
			'<label for="test-radio-2" class="ui-radio-on"></label>' +
			'<input id="test-radio-2" type="radio">' +
		'</div>'
	var radios = $(html);
	$('body').append(radios);

	assert.equal($('.nyc-choice label.ui-radio-on').length, 2);
	assert.equal($('.nyc-choice label.ui-radio-off').length, 0);
	assert.ok(!$.ui || !$.ui.sortable);
	
	
	
	nyc.jq.ui.load(function(){
		assert.notOk(!$.ui || !$.ui.sortable);
		assert.equal($('.nyc-choice label.ui-radio-on').length, 0);
		assert.equal($('.nyc-choice label.ui-radio-off').length, 2);
		assert.equal($('label.ui-checkboxradio-label').length, 2);
		done();
		radios.remove();
	})
});
