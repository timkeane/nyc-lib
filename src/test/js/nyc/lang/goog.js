QUnit.module('nyc.lang.Goog', {
	beforeEach: function(assert){
		setup(assert, this);		
		this.GET_SCRIPT = $.getScript;

		this.GOOG = window.google;
		window.google = {
			translate: {
				TranslateElement: function(options, target){
					assert.deepEqual(options, {
						pageLanguage: 'en',
						includedLanguages: nyc.lang.translate.codes,
						layout: 2,
						autoDisplay: false
					});
					assert.equal(target, 'lang-trans');
				}
			}
		};
		window.google.translate.TranslateElement.InlineLayout = {SIMPLE: 2};

		$.getScript = function(url){
			setTimeout(function(){
				assert.equal(url, 'https://translate.google.com/translate_a/element.js?cb=nyc.lang.translate.init');
				nyc.lang.translate.init();				
			}, 100);
		};
		
		this.LANGUAGES = {
		    en: {val: 'English', desc: 'English', hint: 'Translate'},
		    ar: {val: 'Arabic', desc: '&#x627;&#x644;&#x639;&#x631;&#x628;&#x64A;&#x629;' /* العربية */, hint: '&#x62A;&#x631;&#x62C;&#x645;' /* ترجم */},
		    bn: {val: 'Bengali', desc: '&#x9AC;&#x9BE;&#x999;&#x9BE;&#x9B2;&#x9BF;' /* বাঙালি */, hint: '&#x985;&#x9A8;&#x9C1;&#x9AC;&#x9BE;&#x9A6; &#x995;&#x9B0;&#x9BE;' /* অন�?বাদ করা */},
		    'zh-CN': {val: 'Chinese (Simplified)', desc: '&#x4E2D;&#x56FD;' /* 中国 */, hint: '&#x7FFB;&#x8BD1;' /* 翻译 */},
		    fr: {val: 'French', desc: 'Fran&#231;ais' /* Français */, hint: 'Traduire'},
		    ht: {val: 'Haitian Creole', desc: 'Krey&#242;l Ayisyen' /* Kreyòl Ayisyen */, hint: 'Tradui'},
		    ko: {val: 'Korean', desc: '&#xD55C;&#xAD6D;&#xC758;' /* 한국�?� */, hint: '&#xBC88;&#xC5ED;' /* 번역 */},
		    ru: {val: 'Russian', desc: 'P&#x443;&#x441;&#x441;&#x43A;&#x438;&#x439;' /* Pу�?�?кий */, hint: '&#x43F;&#x435;&#x440;&#x435;&#x432;&#x435;&#x441;&#x442;&#x438;' /* переве�?ти */},
		    es: {val: 'Spanish', desc: 'Espa&#241;ol' /* Español */, hint: 'Traducir'},
		    ur: {val: 'Urdu', desc: '&#x627;&#x631;&#x62F;&#x648;' /* اردو */, hint: '&#x62A;&#x631;&#x62C;&#x645;&#x6C1; &#x6A9;&#x631;&#x6CC;&#x6BA;' /* ترجم�? کریں */}
		};
		
		
		var menuFrame = $('<iframe class="goog-te-menu-frame"></iframe>');
		$('body').append(menuFrame);
		var menuWin = (menuFrame[0].contentWindow) ? menuFrame[0].contentWindow : (menuFrame[0].contentDocument.document) ? menuFrame[0].contentDocument.document : menuFrame[0].contentDocument;
		menuWin.document.open();
		for (var code in this.LANGUAGES){
			var val = this.LANGUAGES[code].val;
			if (val != 'English'){
				menuWin.document.write('<div class="goog-te-menu2-item"><span class="text">' + val + '</span></div>');			
			}
		}
		menuWin.document.close();
		
		var btnFrame = $('<iframe class="goog-te-banner-frame"></iframe>');
		$('body').append(btnFrame);
		var btnWin = (btnFrame[0].contentWindow) ? btnFrame[0].contentWindow : (btnFrame[0].contentDocument.document) ? btnFrame[0].contentDocument.document : btnFrame[0].contentDocument;
		btnWin.document.open();
		btnWin.document.write('<div class="goog-te-button"><button>Show original</button></div>');			
		btnWin.document.close();
		
		this.TEST_INPUT_HTML = $('<div class="test"><input placeholder="placeholder one"><input placeholder="placeholder two"></div>');
		this.TEST_BUTTON_HTML = $('<div class="test"><button data-role="button"><font>button one</font></button><button data-role="button"><font>button two</font></button></div>');
		
		$('body').append(this.TEST_INPUT_HTML).append(this.TEST_BUTTON_HTML);
		
	},
	afterEach: function(assert){
		teardown(assert, this);
		
		$.getScript = this.GET_SCRIPT;
		delete this.GET_SCRIPT;
		
		window.google = this.GOOG;
		delete this.GOOG;
		
		delete this.LANGUAGES;
		delete nyc.lang.translate;
		
		this.TEST_INPUT_HTML.remove();
		this.TEST_BUTTON_HTML.remove();
		$('#lang-btn, iframe.goog-te-menu-frame, iframe.goog-te-banner-frame, #goog-gt-tt').remove();
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(34);
	
	var done = assert.async();
	
	var languages = this.LANGUAGES;
	var testLang;
	
	function test(){
		var codes = testLang.codes;
		var hints = testLang.hints;
		var options = $('#lang-choice option');
		assert.equal(options.length, 10);
		$.each(codes.split(','), function(i, code){
			assert.equal($(options[i]).html(), $('<div>' + languages[code].desc + '</div>').html());
			assert.equal($(options[i]).attr('value'), languages[code].val);
			assert.equal(hints[i], languages[code].hint);
		});	
		done();
	}

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);

});

QUnit.test('init', function(assert){
	assert.expect(5);
	
	var done = assert.async();
	
	var testLang;
	var render = nyc.lang.Goog.prototype.render;
	var hack = nyc.lang.Goog.prototype.hack;
	
	nyc.lang.Goog.prototype.render = function(target){
		assert.equal(target, 'body', 'render');
	};
	nyc.lang.Goog.prototype.hack = function(){
		assert.ok(true, 'hack', 'hack');
	};
	
	function test(){
		nyc.lang.Goog.prototype.render = render;
		nyc.lang.Goog.prototype.hack = hack;
		done();		
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);

});

QUnit.test('showHint', function(assert){
	assert.expect(13);
	
	var done = assert.async();

	var testLang;

	function test(){
		var hints = testLang.hints;
		var h = 0;
		testLang.showHint();
		var interval = setInterval(function(){
			assert.equal($('#lang-choice-button span').html(), $('<div>' + hints[h] + '</div>').html());
			h++;
			if (h == hints.length){
				clearInterval(interval);
				done();
			}
		}, 1010);		
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);

});

QUnit.test('translate', function(assert){
	assert.expect(14);
	
	var done = assert.async();

	var testLang;
	var showOriginalText = nyc.lang.Goog.prototype.showOriginalText;
	var languages = this.LANGUAGES;
	
	nyc.lang.Goog.prototype.showOriginalText = function(){
		assert.ok(true, 'showOriginalText');
	};
	
	function test(){
		var items = $('iframe.goog-te-menu-frame:first').contents().find('.goog-te-menu2-item span.text');

		for (var code in languages){
			var choice = languages[code].val;
			$(items).each(function(){
				if (choice != 'English' && $(this).text() == choice){
					$(this).one('click', function(){
						assert.ok(true, $(this).text());
					});
				}
			});
			$('#lang-choice').val(choice).trigger('change');
		}

		nyc.lang.Goog.prototype.showOriginalText = showOriginalText;
		done();
	};
	
	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('initDropdown', function(assert){
	assert.expect(14);
	
	var done = assert.async();

	var testLang;
	var translate = nyc.lang.Goog.prototype.translate;
	var languages = this.LANGUAGES;

	nyc.lang.Goog.prototype.translate = function(event){
		assert.equal($(event.target).val(), $('#lang-choice').val());
	};
	
	function test(){
		for (var code in languages){
			$('#lang-choice').val(languages[code].val).trigger('change');
		}
		
		nyc.lang.Goog.prototype.translate = translate;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('showOriginalText', function(assert){
	assert.expect(5);
	
	var done = assert.async();

	var testLang;
	var translate = nyc.lang.Goog.prototype.translate;
	var languages = this.LANGUAGES;
	
	function test(){
		var origTxt = $('iframe.goog-te-banner-frame:first').contents().find('.goog-te-button button');
		origTxt.one('click', function(){
			assert.ok(true);
		});

		$('#lang-choice').val(languages.bn.val);
		
		testLang.showOriginalText();
		
		assert.equal($('#lang-choice').val(), 'English');

		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (no cookie, default en-US)', function(assert){
	assert.expect(7);

	var done = assert.async();

	var testLang;
	var translate = nyc.lang.Goog.prototype.translate;
	var languages = this.LANGUAGES;

	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);		
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'en-US';
	};

	function test(){
		testLang.setLangDropdown();
		$('#lang-choice').one('change', function(evt){
			assert.equal($(evt.target).val(), languages.en.val);
		});
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};
	
	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (no cookie, default en)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var translate = nyc.lang.Goog.prototype.translate;
	var languages = this.LANGUAGES;

	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);		
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'en';
	};

	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (no cookie, default undefined)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);		
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (no cookie, default bn)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);		
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'bn';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (no cookie, default zh-CN)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);		
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'zh-CN';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie en, default en-US)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'en';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'en-US';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie en, default en)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'en';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'en';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie en, default undefined)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'en';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie en, default bn)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'en';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'bn';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie en, default zh-CN)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'en';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'zh-CN';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie bn, default en-US)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'bn';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'en-US';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie bn, default en)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'bn';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'en';		
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie bn, default undefined)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'bn';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie en, default bn)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'bn';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'bn';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie bn, default zh-CN)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'bn';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'zh-CN';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie zh-CN, default en-US)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'zh-CN';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'en-US';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie zh-CN, default en)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'zh-CN';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'en';
	};
	
	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie zh-CN, default undefined)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'zh-CN';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie en, default bn)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'en';
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'bn';
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('setLangDropdown (cookie zh-CN, default zh-CN)', function(assert){
	assert.expect(7);
	var done = assert.async();

	var testLang;
	var getCookieValue = nyc.lang.Goog.prototype.getCookieValue;
	var showHint = nyc.lang.Goog.prototype.showHint;
	var defaultLang = nyc.lang.Goog.prototype.defaultLang;

	nyc.lang.Goog.prototype.getCookieValue = function(){
		assert.ok(true);	
		return 'zh-CN';		
	};
	nyc.lang.Goog.prototype.showHint = function(){
		assert.ok(true);
	};
	nyc.lang.Goog.prototype.defaultLang = function(){
		return 'zh-CN';		
	};

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	function test(){
		testLang.setLangDropdown();
		nyc.lang.Goog.prototype.getCookieValue = getCookieValue;
		nyc.lang.Goog.prototype.showHint = showHint;
		nyc.lang.Goog.prototype.defaultLang = defaultLang;
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('lang', function(assert){
	assert.expect(5);
	var done = assert.async();

	var testLang;
	
	function test(){
		testLang.code = 'my lang';
		assert.equal(testLang.lang(), 'my lang');
		testLang.code = 'en';
		assert.equal(testLang.lang(), 'en');
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('hack', function(assert){
	assert.expect(18);
	var done = assert.async();

	var testLang;
	
	function test(){
		$('body').append('<div id="goog-gt-tt"></div>');
		
		$('.test input[placeholder]').each(function(){
			var next = $(this).next();
			assert.equal(next[0].tagName, 'SPAN');
			assert.ok(next.hasClass('lang-placeholder'));
			assert.equal(next.html(), $(this).attr('placeholder'));
		});
		
		$('.test button font').each(function(){
			var parent = $(this).parent();
			var evt = $.Event('click', {
				stopImmediatePropagation: function(){
					assert.ok(true);
				}
			});
			parent.one('click', function(){
				assert.ok(true);
			});
			assert.equal($(this).data('lang-hack'), 'hacked');
			$(this).trigger(evt);
		});
		
		assert.equal($('body').css('top'), 'auto');
		testLang.hack = function(){
			assert.ok(true);
			assert.notOk($('#goog-gt-tt').length);
			done();
		};
	};
	
	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('getCookie', function(assert){
	assert.expect(5);
	
	var done = assert.async();

	var testLang;
	
	function test(){
		document.cookie = ' googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
		assert.notOk(testLang.getCookie());
		document.cookie = 'googtrans=/en/fr';
		assert.equal(testLang.getCookie(), '/en/fr');
		document.cookie = ' googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
		done();
	};
	
	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});

QUnit.test('getCookieValue', function(assert){
	assert.expect(5);
	var done = assert.async();

	var testLang;
	
	function test(){
		testLang.getCookie = function(){
			return '/en/fr';
		};
		assert.equal(testLang.getCookieValue(), 'fr');
		testLang.getCookie = function(){};
		assert.notOk(testLang.getCookieValue());
		done();
	};

	testLang = new nyc.lang.Goog({target: 'body', languages: this.LANGUAGES});
	testLang.on(nyc.lang.Translate.EventType.READY, test);
});
