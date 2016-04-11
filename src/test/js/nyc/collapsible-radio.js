QUnit.module('nyc.Radio', {
	beforeEach: function(assert){
		this.CONTAINER = $('<div id="test-div"><div>stuff</div></div>');
		$('body').append(this.CONTAINER);
		
		this.CHOICES = [
			{value: '*', label: 'All', checked: true},
			{value: 'BURGLARY', label: 'Burglary'},
			{value: 'FELONY ASSAULT', label: 'Felony Assault'},
			{value: 'GRAND LARCENY', label: 'Grand Larceny'},
			{value: 'GRAND LARCENY OF MOTOR VEHICLE', label: 'Grand Larceny of Motor Vehicle'},
			{value: 'MURDER', label: 'Murder'},
			{value: 'RAPE', label: 'Rape'},		
			{value: 'ROBBERY', label: 'Robbery'}		
		];
		
		this.TEST_RADIO = new nyc.Radio({
			target: this.CONTAINER,
			title: 'Crime Type',
			choices: this.CHOICES
		});			
	},
	afterEach: function(assert){
		delete this.CHOICES;
		delete this.TEST_RADIO;
		this.CONTAINER.remove();
	}
});

QUnit.test('constructor/disabled', function(assert){
	assert.expect(41);
	
	var choices = this.CHOICES;	
	var radio = this.TEST_RADIO;	

	assert.deepEqual([choices[0]], radio.val());

	$.each(radio.inputs, function(i, input){
		assert.equal(input.val(), i);
		assert.equal($('label[for="' + input.attr('id') +'"]').html(), choices[i].label);
		assert.notOk(input.prop('disabled'));
		radio.disabled(choices[i].value, true);
		assert.ok(input.prop('disabled'));
		radio.disabled(choices[i].value, false);
		assert.notOk(input.prop('disabled'));
	});
});

QUnit.test('changed', function(assert){
	assert.expect(9);
	
	var choices = this.CHOICES;	
	var radio = this.TEST_RADIO;	
	
	radio.one('change', function(){
		assert.deepEqual[(choices[0]], radio.val());
	});

	for (var i = 1; i < choices.length; i++){
		var choice = choices[i];
		var input = $('#test-div input[value="' + i + '"]')
		radio.one('change', function(){
			assert.deepEqual([choice], radio.val());
		});
		$(input).trigger('click');
	}
	
});




