QUnit.module('nyc.lang.Translate', {
	beforeEach: function(assert){
		setup(assert, this);		
		this.LANGUAGES = {
		    en: {val: 'en', desc: 'English', hint: 'Translate'},
		    ar: {val: 'ar', desc: 'Arabic' , hint: 'Translate-ar'},
		    bn: {val: 'bn', desc: 'Bengali', hint: 'Translate-bn'},
		    cn: {val: 'cn', desc: 'Chinese', hint: 'Translate-cn'},
		    fr: {val: 'fr', desc: 'French', hint: 'Translate-fr'},
		    ht: {val: 'ht', desc: 'Hatian', hint: 'Translate-ht'},
		    ko: {val: 'ko', desc: 'Korean' , hint: 'Translate-ko'},
		    ru: {val: 'ru', desc: 'Russian', hint: 'Translate-ru'},
		    es: {val: 'es', desc: 'Spanish', hint: 'Translate-es'},
		    ur: {val: 'ur', desc: 'Urdu', hint: 'Translate-ur'}
		};
		this.MESSAGES = {
			en: {
				
			},
			ar: {
				
			}
		};
		//TODO do this in Goog too
		this.EXPECTED_NAMED_CODES = {en: 'en', ar: 'ar', bn: 'bn', cn: 'cn', fr: 'fr', ht: 'ht', ko: 'ko', ru: 'ru', es: 'es', ur: 'ur'};
		this.EXPECTED_HINTS = ['Translate', 'Translate-ar', 'Translate-bn', 'Translate-cn', 'Translate-fr', 'Translate-ht', 'Translate-ko', 'Translate-ru', 'Translate-es', 'Translate-ur'];

	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.LANGUAGES;
		delete this.MESSAGES;
		delete nyc.lang.translate;
		$('#lang-btn').remove();
	}
});

QUnit.test('constructor (not button, no defaultLang)', function(assert){
	assert.expect(7);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;
	var render = nyc.lang.Translate.prototype.render;

	nyc.lang.Translate.prototype.render = function(target){
		assert.equal(target, 'body');
	};
	
	var testLang = new nyc.lang.Translate({
		target: 'body', 
		languages: languages, 
		messages: messages
	});
	
	assert.ok(testLang.defaultMessages === messages.en);
	assert.ok(testLang.messages === messages);
	assert.ok(testLang.languages === languages);
	assert.notOk(testLang.isButton);
	assert.deepEqual(testLang.hints, []);
	assert.deepEqual(testLang.namedCodes, {});
	
	nyc.lang.Translate.prototype.render = render;
});

QUnit.test('constructor (is button, defaultLang in messages)', function(assert){
	assert.expect(7);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;
	var render = nyc.lang.Translate.prototype.render;

	nyc.lang.Translate.prototype.render = function(target){
		assert.equal(target, 'body');
	};
	
	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: true, 
		languages: languages, 
		defaultLang: 'ar', 
		messages: messages
	});
	
	assert.ok(testLang.defaultMessages === messages.ar);
	assert.ok(testLang.messages === messages);
	assert.ok(testLang.languages === languages);
	assert.ok(testLang.isButton);
	assert.deepEqual(testLang.hints, []);
	assert.deepEqual(testLang.namedCodes, {});
	
	nyc.lang.Translate.prototype.render = render;
});

QUnit.test('constructor (is button, defaultLang not in messages)', function(assert){
	assert.expect(7);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;
	var render = nyc.lang.Translate.prototype.render;

	nyc.lang.Translate.prototype.render = function(target){
		assert.equal(target, 'body', 'render');
	};
	
	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: true, 
		languages: languages, 
		defaultLang: 'yi', 
		messages: messages
	});
	
	assert.ok(testLang.defaultMessages === messages.en);
	assert.ok(testLang.messages === messages);
	assert.ok(testLang.languages === languages);
	assert.ok(testLang.isButton);
	assert.deepEqual(testLang.hints, []);
	assert.deepEqual(testLang.namedCodes, {});
	
	nyc.lang.Translate.prototype.render = render;
});

QUnit.test('render (not button)', function(assert){
	assert.expect(42);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;
	var setLangDropdown = nyc.lang.Translate.prototype.setLangDropdown;
	var trigger = nyc.lang.Translate.prototype.trigger;
	var translate = nyc.lang.Translate.prototype.translate;
	var showArrow = nyc.lang.Translate.prototype.showArrow;
	
	nyc.lang.Translate.prototype.setLangDropdown = function(){
		assert.ok(true, 'setLangDropdown');
	};
	nyc.lang.Translate.prototype.trigger = function(eventName, data){
		assert.equal(eventName, 'ready');
		assert.ok(data);
	};
	nyc.lang.Translate.prototype.translate = function(event){
		assert.equal(event.type, 'change');
		assert.deepEqual(event.target, $('#lang-choice').get(0));
	};
	nyc.lang.Translate.prototype.showArrow = function(){
		assert.notOk(true);
	};
	
	var testLang = new nyc.lang.Translate({
		target: 'body', 
		languages: languages, 
		messages: messages
	});

	var codes = testLang.codes;
	var hints = testLang.hints;
	
	var options = $('#lang-choice option');
	assert.equal(options.length, 10);
	
	$.each(codes.split(','), function(i, code){
		assert.equal($(options[i]).html(), $('<div>' + languages[code].desc + '</div>').html());
		assert.equal($(options[i]).attr('value'), languages[code].val);
		assert.equal(hints[i], languages[code].hint);
	});

	assert.deepEqual(testLang.namedCodes, this.EXPECTED_NAMED_CODES);
	assert.deepEqual(testLang.hints, this.EXPECTED_HINTS);

	assert.ok($('#lang-choice-button').hasClass('mnu'));
	assert.ok($('body').hasClass('lang-en'));
	assert.ok($('#lang-choice-button span').is(':visible'));
	assert.equal($('#lang-choice-button span').html(), 'Translate');
	
	$('#lang-choice').trigger('change');
	
	nyc.lang.Translate.prototype.setLangDropdown = setLangDropdown;
	nyc.lang.Translate.prototype.trigger = trigger;
	nyc.lang.Translate.prototype.translate = translate;
	
});

QUnit.test('render (is button)', function(assert){
	assert.expect(42);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;
	var setLangDropdown = nyc.lang.Translate.prototype.setLangDropdown;
	var trigger = nyc.lang.Translate.prototype.trigger;
	var translate = nyc.lang.Translate.prototype.translate;
	var showArrow = nyc.lang.Translate.prototype.showArrow;

	nyc.lang.Translate.prototype.setLangDropdown = function(){
		assert.ok(true, 'setLangDropdown');
	};
	nyc.lang.Translate.prototype.trigger = function(eventName, data){
		assert.equal(eventName, 'ready');
		assert.ok(data);
	};
	nyc.lang.Translate.prototype.translate = function(event){
		assert.equal(event.type, 'change');
		assert.deepEqual(event.target, $('#lang-choice').get(0));
	};
	nyc.lang.Translate.prototype.showArrow = function(){
		assert.ok(true);
	};
	
	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: true,
		languages: languages, 
		messages: messages
	});

	var codes = testLang.codes;
	var hints = testLang.hints;
	
	var options = $('#lang-choice option');
	assert.equal(options.length, 10);
	
	$.each(codes.split(','), function(i, code){
		assert.equal($(options[i]).html(), $('<div>' + languages[code].desc + '</div>').html());
		assert.equal($(options[i]).attr('value'), languages[code].val);
		assert.equal(hints[i], languages[code].hint);
	});

	assert.deepEqual(testLang.namedCodes, this.EXPECTED_NAMED_CODES, 'EXPECTED_NAMED_CODES');
	assert.deepEqual(testLang.hints, this.EXPECTED_HINTS);

	assert.notOk($('#lang-choice-button').hasClass('mnu'));
	assert.ok($('body').hasClass('lang-en'));
	assert.notOk($('#lang-choice-button span').is(':visible'));
	
	$('#lang-choice').trigger('change');
	
	nyc.lang.Translate.prototype.setLangDropdown = setLangDropdown;
	nyc.lang.Translate.prototype.trigger = trigger;
	nyc.lang.Translate.prototype.translate = translate;
	nyc.lang.Translate.prototype.showArrow = showArrow;
	
});

