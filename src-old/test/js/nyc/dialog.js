QUnit.module('nyc.Dialog');

QUnit.test('ok (no callback)', function(assert){
	assert.expect(11);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.ok({message: 'Hi there!'});
	
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Hi there!');
	assert.equal(dialog.container.find('.btn-ok').html(), 'OK');
	assert.equal(dialog.container.find('.btn-ok').attr('href'), '#');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.one(nyc.Dialog.EventType.OK, function(result){
		assert.ok(result);
		done();
	});
	$('.btn-ok').trigger('click');
});

QUnit.test('ok (callback)', function(assert){
	assert.expect(12);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.ok({
		message: 'Hi there!', 
		callback: function(result){
			assert.ok(result);
		}
	});
	
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Hi there!');
	assert.equal(dialog.container.find('.btn-ok').html(), 'OK');
	assert.equal(dialog.container.find('.btn-ok').attr('href'), '#');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.one(nyc.Dialog.EventType.OK, function(result){
		assert.ok(result);
		done();
	});
	$('.btn-ok').trigger('click');
});

QUnit.test('ok (button changes)', function(assert){
	assert.expect(11);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.ok({message: 'Hi there!', buttonText: ['Right back at ya!'], buttonHref: ['http://maps.nyc.gov']});
	
	assert.equal(dialog.container.find('.btn-ok').html(), 'Right back at ya!');
	assert.equal(dialog.container.find('.btn-ok').attr('href'), 'http://maps.nyc.gov');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Hi there!');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.one(nyc.Dialog.EventType.OK, function(result){
		assert.ok(result);
		done();
	});
	$('.btn-ok').trigger('click');
});

QUnit.test('yesNo (click yes - no callback)', function(assert){
	assert.expect(13);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.yesNo({message: 'Are you there?'});
	
	assert.equal(dialog.container.find('.btn-yes').html(), 'Yes');
	assert.equal(dialog.container.find('.btn-no').html(), 'No');
	assert.equal(dialog.container.find('.btn-yes').attr('href'), '#');
	assert.equal(dialog.container.find('.btn-no').attr('href'), '#');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Are you there?');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.one(nyc.Dialog.EventType.YES_NO, function(result){
		assert.ok(result);
		done();
	});
	$('.btn-yes').trigger('click');
});

QUnit.test('yesNo (click no - no callback)', function(assert){
	assert.expect(13);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.yesNo({message: 'Are you there?'});
	
	assert.equal(dialog.container.find('.btn-yes').html(), 'Yes');
	assert.equal(dialog.container.find('.btn-no').html(), 'No');
	assert.equal(dialog.container.find('.btn-yes').attr('href'), '#');
	assert.equal(dialog.container.find('.btn-no').attr('href'), '#');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Are you there?');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.one(nyc.Dialog.EventType.YES_NO, function(result){
		assert.notOk(result);
		done();
	});
	$('.btn-no').trigger('click');
});

QUnit.test('yesNo (click yes - callback and button changes)', function(assert){
	assert.expect(14);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.yesNo({
		message: '2 + 2 = 4',
		buttonText: ['Right', 'Wrong'],
		buttonHref: ['#right', '#wrong'],
		callback: function(result){
			assert.ok(result);
		}
	});
	
	assert.equal(dialog.container.find('.btn-yes').html(), 'Right');
	assert.equal(dialog.container.find('.btn-no').html(), 'Wrong');
	assert.equal(dialog.container.find('.btn-yes').attr('href'), '#right');
	assert.equal(dialog.container.find('.btn-no').attr('href'), '#wrong');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), '2 + 2 = 4');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.one(nyc.Dialog.EventType.YES_NO, function(result){
		assert.ok(result);
		done();
	});
	$('.btn-yes').trigger('click');
});

QUnit.test('yesNo (click no - callback)', function(assert){
	assert.expect(13);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.yesNo({
		message: 'Are you there?', 
		function(result){
			assert.notOk(result);
		}
	});
	
	assert.equal(dialog.container.find('.btn-yes').html(), 'Yes');
	assert.equal(dialog.container.find('.btn-no').html(), 'No');
	assert.equal(dialog.container.find('.btn-yes').attr('href'), '#');
	assert.equal(dialog.container.find('.btn-no').attr('href'), '#');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Are you there?');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.one(nyc.Dialog.EventType.YES_NO, function(result){
		assert.notOk(result);
		done();
	});
	$('.btn-no').trigger('click');
});

QUnit.test('input (click submit - no placeholder, no callback)', function(assert){
	assert.expect(15);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.input({message: 'Where are you?'});
	
	assert.equal(dialog.container.find('.btn-submit').html(), 'Submit');
	assert.equal(dialog.container.find('.btn-cancel').html(), 'Cancel');
	assert.equal(dialog.container.find('.btn-submit').attr('href'), '#');
	assert.equal(dialog.container.find('.btn-cancel').attr('href'), '#');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Where are you?');
	assert.equal(dialog.inputElem.attr('placeholder'), '');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.one(nyc.Dialog.EventType.INPUT, function(result){
		assert.equal(result, 'Over here');
		setTimeout(function(){
			assert.equal(dialog.inputElem.val(), '');
			done();
		}, 500);
	});
	$('.dia input').val('Over here');
	$('.btn-submit').trigger('click');
});

QUnit.test('input (click cancel - placeholder, no callback)', function(assert){
	assert.expect(13);
	
	var dialog = new nyc.Dialog();
	dialog.input({message: 'Where are you?', placeholder: 'Tell me...'});
	
	assert.equal(dialog.container.find('.btn-submit').html(), 'Submit');
	assert.equal(dialog.container.find('.btn-cancel').html(), 'Cancel');
	assert.equal(dialog.container.find('.btn-submit').attr('href'), '#');
	assert.equal(dialog.container.find('.btn-cancel').attr('href'), '#');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Where are you?');
	assert.equal(dialog.inputElem.attr('placeholder'), 'Tell me...');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	$('.dia input').val('Over here');
	$('.btn-cancel').trigger('click');
});

QUnit.test('input (click submit - no placeholder, callback)', function(assert){
	assert.expect(16);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.input({
		message: 'Where are you?', 
		callback: function(result){
			assert.equal(result, 'Over here');
		}
	});
	
	assert.equal(dialog.container.find('.btn-submit').html(), 'Submit');
	assert.equal(dialog.container.find('.btn-cancel').html(), 'Cancel');
	assert.equal(dialog.container.find('.btn-submit').attr('href'), '#');
	assert.equal(dialog.container.find('.btn-cancel').attr('href'), '#');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Where are you?');
	assert.equal(dialog.inputElem.attr('placeholder'), '');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.one(nyc.Dialog.EventType.INPUT, function(result){
		assert.equal(result, 'Over here');
		setTimeout(function(){
			assert.equal(dialog.inputElem.val(), '');
			done();
		}, 500);
	});
	$('.dia input').val('Over here');
	$('.btn-submit').trigger('click');
});

QUnit.test('input (enter key - no placeholder, callback)', function(assert){
	assert.expect(16);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.input({
		message: 'Where are you?', 
		callback: function(result){
			assert.equal(result, 'Over here');
		}
	});
	
	assert.equal(dialog.container.find('.btn-submit').html(), 'Submit');
	assert.equal(dialog.container.find('.btn-cancel').html(), 'Cancel');
	assert.equal(dialog.container.find('.btn-submit').attr('href'), '#');
	assert.equal(dialog.container.find('.btn-cancel').attr('href'), '#');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Where are you?');
	assert.equal(dialog.inputElem.attr('placeholder'), '');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.one(nyc.Dialog.EventType.INPUT, function(result){
		assert.equal(result, 'Over here');
		setTimeout(function(){
			assert.equal(dialog.inputElem.val(), '');
			done();
		}, 500);
	});
	
	var event = jQuery.Event("keyup");
	event.keyCode = 13;
	$('.dia input').val('Over here').trigger(event);
});

QUnit.test('input (click cancel - placeholder, callback, button changes)', function(assert){
	assert.expect(13);
	
	var dialog = new nyc.Dialog();
	dialog.input({
		message: 'Where are you?', 
		placeholder: 'Tell me...',
		buttonText: ['Please', 'No Thanks'],
		buttonHref: ['#please', '#nothanks'],
		callback: function(result){
			assert.notOk(result);
		}
	});
	
	assert.equal(dialog.container.find('.btn-submit').html(), 'Please');
	assert.equal(dialog.container.find('.btn-cancel').html(), 'No Thanks');
	assert.equal(dialog.container.find('.btn-submit').attr('href'), '#please');
	assert.equal(dialog.container.find('.btn-cancel').attr('href'), '#nothanks');
	assert.equal(dialog.container.css('display'), 'block');
	assert.equal(dialog.msgElem.html(), 'Where are you?');
	assert.equal(dialog.inputElem.attr('placeholder'), 'Tell me...');
	dialog.yesNoElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	dialog.inputElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'inline-block');
	});
	dialog.okElems.each(function(_, elem){
		assert.equal($(elem).css('display'), 'none');
	});
	$('.dia input').val('Over here');
	$('.btn-cancel').trigger('click');
});