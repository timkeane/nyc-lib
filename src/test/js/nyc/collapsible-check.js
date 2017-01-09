QUnit.module('nyc.Check', {
	beforeEach: function(assert){
		this.CONTAINER = $('<div id="test-div"><div>stuff</div></div>');
		$('body').append(this.CONTAINER);
		
		this.CHOICES = [
			{value: 'BURGLARY', label: 'Burglary', checked: true},
			{value: 'FELONY ASSAULT', label: 'Felony Assault', checked: true},
			{value: 'GRAND LARCENY', label: 'Grand Larceny', checked: true},
			{value: 'GRAND LARCENY OF MOTOR VEHICLE', label: 'Grand Larceny of Motor Vehicle', checked: true},
			{value: 'MURDER', label: 'Murder', checked: true},
			{value: 'RAPE', label: 'Rape', checked: true},		
			{value: 'ROBBERY', label: 'Robbery', checked: true}		
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
		var labelClone = $('label[for="' + input.attr('id') +'"]').clone();
		$(labelClone.children().get(0)).remove();
		assert.equal(labelClone.html(), choices[i].label);		
		assert.equal(input.val(), i);
		assert.notOk(input.prop('disabled'));
		check.disabled(choices[i].value, true);
		assert.ok(input.prop('disabled'));
		check.disabled(choices[i].value, false);
		assert.notOk(input.prop('disabled'));
	});
});

QUnit.test('changed', function(assert){
	assert.expect(8);
	
	var me = this;
	
	var done = assert.async();
	
	var choices = [];
	$.each(this.CHOICES, function(_, choice){
		choices.push(choice);
	});
	var check = this.TEST_CHECK;	
	
	assert.deepEqual(check.val(), choices);
	
	setTimeout(function(){
		for (var i = 0; i < me.CHOICES.length; i++){
			var input = $('#test-div input[value="' + i + '"]');
			check.one('change', function(){
				assert.deepEqual(check.val(), choices);
			});
			choices.shift();
			$(input).trigger('click');
		}
		done();
	}, 500);

});




