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
				msg1: 'msg1-en',
				msg2: 'msg2-en',
				msg3: 'msg3-en'
			},
			ar: {
				msg1: 'msg1-ar',
				msg2: 'msg2-ar',
				msg3: 'msg3-ar'				
			},
			es: {
				msg1: 'msg1-es',
				msg2: 'msg2-es',
				msg3: 'msg3-es'
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
		$('#lang-btn, #lang-hint-arrow').remove();
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
	nyc.lang.Translate.prototype.showArrow = showArrow;
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

QUnit.test('showArrow (is arrow, timeout)', function(assert){
	assert.expect(5);
	
	var done = assert.async();

	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;

	var showHint = nyc.lang.Translate.prototype.showHint;
	var timeout = nyc.lang.Translate.prototype.arrowTimeout;
	
	nyc.lang.Translate.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Translate.prototype.arrowTimeout = 500;
	
	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: true,
		isArrow: true,
		languages: languages
	});

	assert.ok($('#lang-hint-arrow').length);
	assert.ok($('#lang-hint-arrow').is(':visible'));

	setTimeout(function(){
		assert.notOk($('#lang-hint-arrow').is(':visible'));
		nyc.lang.Translate.prototype.showHint = showHint;
		nyc.lang.Translate.prototype.arrowTimeout = timeout;
		done();
	}, 1000);
});

QUnit.test('showArrow (is arrow, click)', function(assert){
	assert.expect(5);
		
	var done = assert.async();

	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;

	var showHint = nyc.lang.Translate.prototype.showHint;
	var timeout = nyc.lang.Translate.prototype.arrowTimeout;
	
	nyc.lang.Translate.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Translate.prototype.arrowTimeout = 1000000;

	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: true,
		isArrow: true,
		languages: languages
	});

	assert.ok($('#lang-hint-arrow').length);
	assert.ok($('#lang-hint-arrow').is(':visible'));

	$('#lang-hint-arrow a').trigger('click');

	setTimeout(function(){
		assert.notOk($('#lang-hint-arrow').is(':visible'));
		nyc.lang.Translate.prototype.showHint = showHint;
		nyc.lang.Translate.prototype.arrowTimeout = timeout;
		done();
	}, 500);
});

QUnit.test('showArrow (no arrow)', function(assert){
	assert.expect(2);
		
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;

	var showHint = nyc.lang.Translate.prototype.showHint;
	
	nyc.lang.Translate.prototype.showHint = function(){
		assert.ok(true);
	};

	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: true,
		isArrow: false,
		languages: languages
	});

	assert.notOk($('#lang-hint-arrow').length);

	nyc.lang.Translate.prototype.showHint = showHint;
});

QUnit.test('showHint (not button)', function(assert){
	assert.expect(11);
	
	var done = assert.async();

	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;

	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: false,
		languages: languages
	});

	var hints = testLang.hints;
	var h = 0;
	
	assert.equal(testLang.showHint(), '#lang-choice-button span');
	
	var interval = setInterval(function(){
		assert.equal($('#lang-choice-button span').html(), hints[h]);
		h++;
		if (h == hints.length){
			clearInterval(interval);
			done();
		}
	}, 1010);		
});

QUnit.test('showHint (is button, is arrow)', function(assert){
	assert.expect(11);
	
	var done = assert.async();

	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;

	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: true,
		isArrow: true,
		languages: languages
	});

	var hints = testLang.hints;
	var h = 0;
	
	assert.equal(testLang.showHint(), '#lang-hint-arrow span');

	var interval = setInterval(function(){
		assert.equal($('#lang-hint-arrow span').html(), hints[h]);
		h++;
		if (h == hints.length){
			clearInterval(interval);
			done();
		}
	}, 1010);		
});

QUnit.test('showHint (is button, no arrow)', function(assert){
	assert.expect(1);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;

	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: true,
		isArrow: false,
		languages: languages
	});

	assert.notOk(testLang.showHint());
});

QUnit.test('translate', function(assert){
	assert.expect(15);

	$('body').append('<div id="tst-div"><h3 class="msg1">msg1-en</h3><a class="msg2" data-msg-key="msg3" data-msg-attr="href" href="msg3-en">msg2-en</a><div class="msg1">msg1-en</div></div>');
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;

	var testLang = new nyc.lang.Translate({
		target: 'body', 
		isButton: true,
		isArrow: false,
		languages: languages, 
		messages: messages
	});
	
	testLang.one(nyc.lang.Translate.EventType.CHANGE, function(lang){
		assert.equal(lang, 'es');
	});
	$('#lang-choice').val('es').trigger('change');
	
	assert.equal($('h3.msg1').html(), 'msg1-es');
	assert.equal($('div.msg1').html(), 'msg1-es');
	assert.equal($('a.msg2').html(), 'msg2-es');
	assert.equal($('a.msg2').attr('href'), 'msg3-es');

	testLang.one(nyc.lang.Translate.EventType.CHANGE, function(lang){
		assert.equal(lang, 'ar');
	});
	$('#lang-choice').val('ar').trigger('change');

	assert.equal($('h3.msg1').html(), 'msg1-ar');
	assert.equal($('div.msg1').html(), 'msg1-ar');
	assert.equal($('a.msg2').html(), 'msg2-ar');
	assert.equal($('a.msg2').attr('href'), 'msg3-ar');

	testLang.one(nyc.lang.Translate.EventType.CHANGE, function(lang){
		assert.equal(lang, 'en');
	});
	$('#lang-choice').val('en').trigger('change');

	assert.equal($('h3.msg1').html(), 'msg1-en');
	assert.equal($('div.msg1').html(), 'msg1-en');
	assert.equal($('a.msg2').html(), 'msg2-en');
	assert.equal($('a.msg2').attr('href'), 'msg3-en');

	$('#tst-div').remove();
});

QUnit.test('css', function(assert){
	assert.expect(31);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;

	var testLang = new nyc.lang.Translate({
		target: 'body', 
		languages: languages
	});
	
	var test = function(){
		for (var lang in languages){
			assert[lang == testLang.code ? 'ok' : 'notOk']($('body').hasClass('lang-' + lang));
		}		
	};
	
	assert.equal(testLang.code, 'en');
	test();
	
	testLang.code = 'es';
	testLang.css();
	test();
	
	testLang.code = 'ar';
	testLang.css();
	test();
});

QUnit.test('setLangDropdown (no cookie, default lang is good)', function(assert){
	assert.expect(4);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;	

	var testLang = new nyc.lang.Translate({
		target: 'body', 
		languages: languages
	});
	
	testLang.defaultLang = function(){
		assert.ok(true);
		return 'es';
	};
	testLang.getCookieValue = function(){
		assert.ok(true);
		return null;
	};
	testLang.showHint = function(){
		assert.ok(true);
	};
	
	testLang.on(nyc.lang.Translate.EventType.CHANGE, function(lang){
		assert.equal(lang, 'es');
	});
	
	testLang.setLangDropdown();
});

QUnit.test('setLangDropdown (no cookie, default lang is bad)', function(assert){
	assert.expect(4);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;
	
	var testLang = new nyc.lang.Translate({
		target: 'body', 
		languages: languages
	});
	
	testLang.defaultLang = function(){
		assert.ok(true);
		return 'xx';
	};
	testLang.getCookieValue = function(){
		assert.ok(true);
		return null;
	};
	testLang.showHint = function(){
		assert.ok(true);
	};
	
	testLang.on(nyc.lang.Translate.EventType.CHANGE, function(lang){
		assert.equal(lang, 'en');
	});
	
	testLang.setLangDropdown();
});

QUnit.test('setLangDropdown (has cookie with good value)', function(assert){
	assert.expect(4);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;
	
	var testLang = new nyc.lang.Translate({
		target: 'body', 
		languages: languages
	});
	
	testLang.defaultLang = function(){
		assert.ok(true);
		return 'es';
	};
	testLang.getCookieValue = function(){
		assert.ok(true);
		return 'ar';
	};
	testLang.showHint = function(){
		assert.ok(true);
	};
	
	testLang.on(nyc.lang.Translate.EventType.CHANGE, function(lang){
		assert.equal(lang, 'ar');
	});
	
	testLang.setLangDropdown();
});

QUnit.test('setLangDropdown (has cookie with bad value)', function(assert){
	assert.expect(4);
	
	var languages = this.LANGUAGES;
	var messages = this.MESSAGES;
	
	var testLang = new nyc.lang.Translate({
		target: 'body', 
		languages: languages
	});
	
	testLang.defaultLang = function(){
		assert.ok(true);
		return 'es';
	};
	testLang.getCookieValue = function(){
		assert.ok(true);
		return 'xx';
	};
	testLang.showHint = function(){
		assert.ok(true);
	};
	
	testLang.on(nyc.lang.Translate.EventType.CHANGE, function(lang){
		assert.equal(lang, 'es');
	});
	
	testLang.setLangDropdown();
});
