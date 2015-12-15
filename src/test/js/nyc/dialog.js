QUnit.module('nyc.Dialog');

QUnit.test('ok (no callback)', function(assert){
	assert.expect(9);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.ok('Hi there!');
	
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

QUnit.test('ok (callback)', function(assert){
	assert.expect(10);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.ok('Hi there!', function(result){
		assert.ok(result);
	});
	
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
	assert.expect(9);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.yesNo('Are you there?');
	
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
	assert.expect(9);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.yesNo('Are you there?');
	
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

QUnit.test('yesNo (click yes - callback)', function(assert){
	assert.expect(10);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.yesNo('Are you there?', function(result){
		assert.ok(result);
	});
	
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

QUnit.test('yesNo (click no - callback)', function(assert){
	assert.expect(10);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.yesNo('Are you there?', function(result){
		assert.notOk(result);
	});
	
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
	assert.expect(11);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.input('Where are you?');
	
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
	assert.expect(11);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.input('Where are you?', 'Tell me...');
	
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
	dialog.one(nyc.Dialog.EventType.INPUT, function(result){
		assert.notOk(result);
		setTimeout(function(){
			assert.equal(dialog.inputElem.val(), '');
			done();
		}, 500);
	});
	$('.dia input').val('Over here');
	$('.btn-cancel').trigger('click');
});

QUnit.test('input (click submit - no placeholder, callback)', function(assert){
	assert.expect(12);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.input('Where are you?', function(result){
		assert.equal(result, 'Over here');
	});
	
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

QUnit.test('input (click cancel - placeholder, callback)', function(assert){
	assert.expect(12);

	var done = assert.async();
	
	var dialog = new nyc.Dialog();
	dialog.input('Where are you?', 'Tell me...', function(result){
		assert.notOk(result);
	});
	
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
	dialog.one(nyc.Dialog.EventType.INPUT, function(result){
		assert.notOk(result);
		setTimeout(function(){
			assert.equal(dialog.inputElem.val(), '');
			done();
		}, 500);
	});
	$('.dia input').val('Over here');
	$('.btn-cancel').trigger('click');
});