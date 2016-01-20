QUnit.module('nyc.Check', {
	beforeEach: function(assert){
		this.CONTAINER = $('<div id="test-div"><div>stuff</div></div>');
		$('body').append(this.CONTAINER);
		
		this.CHOICES = [
			{value: 'BURGLARY', label: 'Burglary'},
			{value: 'FELONY ASSAULT', label: 'Felony Assault'},
			{value: 'GRAND LARCENY', label: 'Grand Larceny'},
			{value: 'GRAND LARCENY OF MOTOR VEHICLE', label: 'Grand Larceny of Motor Vehicle'},
			{value: 'MURDER', label: 'Murder'},
			{value: 'RAPE', label: 'Rape'},		
			{value: 'ROBBERY', label: 'Robbery'}		
		];
		
		this.TEST_CHECK = new nyc.Check({
			target: this.CONTAINER,
			title: 'Crime Type',
			choices: this.CHOICES
		});			
	},
	afterEach: function(assert){
		delete this.CHOICES;
		delete this.TEST_CHECK;
		this.CONTAINER.remove();
	}
});

QUnit.test('constructor/disabled', function(assert){
	assert.expect(35);
	
	var choices = this.CHOICES;	
	var check = this.TEST_CHECK;	

	$.each(check.inputs, function(i, input){
		assert.equal(input.val(), i);
		assert.equal($('label[for="' + input.attr('id') +'"]').html(), choices[i].label);
		assert.notOk(input.prop('disabled'));
		check.disabled(choices[i].value, true);
		assert.ok(input.prop('disabled'));
		check.disabled(choices[i].value, false);
		assert.notOk(input.prop('disabled'));
	});
});

QUnit.test('changed', function(assert){
	assert.expect(8);
	
	var done = assert.async();
	
	var choices = [];
	$.each(this.CHOICES, function(_, choice){
		choices.push(choice.value);
	});
	var check = this.TEST_CHECK;	
	
	check.one('change', function(){
		assert.deepEqual(choices, check.val());
	});

	setTimeout(function(){
		$('#test-div input').each(function(i, input){
			check.one('change', function(){
				assert.deepEqual(choices, check.val());
			});
			choices.shift();
			$(input).trigger('click');
		});
		done();
	}, 500);
});




