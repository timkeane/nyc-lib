QUnit.module('nyc.Lang', {
	beforeEach: function(assert){
		setup(assert, this);		
		this.GET_SCRIPT = $.getScript;
		$.getScript = function(url){
			assert.equal(url, '//translate.google.com/translate_a/element.js?cb=nyc.lang.init');
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
		
		this.GOOG = window.google;
		window.google = {
			translate: {
				TranslateElement: function(options, target){
					assert.deepEqual(options, {
						pageLanguage: 'en',
						includedLanguages: nyc.lang.codes,
						layout: 2,
						autoDisplay: false
					});
					assert.equal(target, 'lang-trans');
				}
			}
		};
		window.google.translate.TranslateElement.InlineLayout = {SIMPLE: 2};
		
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
		
		this.TEST_LANG = 	new nyc.Lang('body', this.LANGUAGES);
	},
	afterEach: function(assert){
		teardown(assert, this);
		
		$.getScript = this.GET_SCRIPT;
		delete this.GET_SCRIPT;
		
		window.google = this.GOOG;
		delete this.GOOG;
		
		delete this.LANGUAGES;
		delete this.TEST_LANG;
		
		this.TEST_INPUT_HTML.remove();
		this.TEST_BUTTON_HTML.remove();
		$('#lang-btn, iframe.goog-te-menu-frame, iframe.goog-te-banner-frame, #goog-gt-tt').remove();
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(32);
		
	var codes = this.TEST_LANG.codes;
	var hints = this.TEST_LANG.hints;
	var options = $('#lang-choice option');
	var languages = this.LANGUAGES;
	assert.equal(options.length, 10);
	$.each(codes.split(','), function(i, code){
		assert.equal($(options[i]).html(), $('<div>' + languages[code].desc + '</div>').html());
		assert.equal($(options[i]).attr('value'), languages[code].val);
		assert.equal(hints[i], languages[code].hint);
	});	
});

QUnit.test('init', function(assert){
	assert.expect(9);
	
	this.TEST_LANG.initDropdown = function(){
		assert.ok(true, 'initDropdown');
	};
	this.TEST_LANG.setLangDropdown = function(){
		assert.ok(true, 'setLangDropdown');
	};
	this.TEST_LANG.hack = function(){
		assert.ok(true, 'hack');
	};
	
	this.TEST_LANG.init();
	
	assert.equal($('#lang-choice').css('display'), 'inline-block');			
	assert.equal($('#lang-choice-button span').html(), 'Translate');			
	assert.equal($('#lang-choice-button span').css('display'), 'inline');			

});

QUnit.test('showHint', function(assert){
	assert.expect(1 + this.TEST_LANG.hints.length);
	var done = assert.async();

	var hints = this.TEST_LANG.hints;
	var h = 0;
	this.TEST_LANG.showHint();
	var interval = setInterval(function(){
		assert.equal($('#lang-choice-button span').html(), $('<div>' + hints[h] + '</div>').html());
		h++;
		if (h == hints.length){
			clearInterval(interval);
			done();
		}
	}, 1010);
});

QUnit.test('chooseLang', function(assert){
	assert.expect(11);
	
	this.TEST_LANG.showOriginalText = function(){
		assert.ok(true, 'showOriginalText');
	};
	
	var items = $('iframe.goog-te-menu-frame:first').contents().find('.goog-te-menu2-item span.text');

	for (var code in this.LANGUAGES){
		var choice = this.LANGUAGES[code].val;
		$(items).each(function(){
			if (choice != 'English' && $(this).text() == choice){
				$(this).one('click', function(){
					assert.ok(true);
				});
			}
		});
		this.TEST_LANG.chooseLang(choice);
	}
});

QUnit.test('initDropdown', function(assert){
	assert.expect(11);
	this.TEST_LANG.chooseLang = function(val){
		assert.equal(val, $('#lang-choice').val());
	};
	this.TEST_LANG.initDropdown();
	for (var code in this.LANGUAGES){
		$('#lang-choice').val(this.LANGUAGES[code].val).trigger('change');
	}
});

QUnit.test('showOriginalText', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;
	
	var origTxt = $('iframe.goog-te-banner-frame:first').contents().find('.goog-te-button button');
	origTxt.one('click', function(){
		assert.ok(true);
	});

	$('#lang-choice').val(languages.bn.val);
	
	this.TEST_LANG.showOriginalText();
	
	assert.equal($('#lang-choice').val(), 'English');
});

QUnit.test('setLangDropdown (no cookie, default en-US)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'en-US';
	};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (no cookie, default en)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'en';
	};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (no cookie, default undefined)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (no cookie, default bn)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'bn';
	};
	
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (no cookie, default zh-CN)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	this.TEST_LANG.getCookieValue = function(){};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'zh-CN';
	};
	
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie en, default en-US)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'en';
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'en-US';
	};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie en, default en)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'en';		
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'en';		
	};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie en, default undefined)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'en';		
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie en, default bn)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'en';
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'bn';
	};
	
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie en, default zh-CN)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.en.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'en';		
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'zh-CN';
	};
	
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie bn, default en-US)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'bn';
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'en-US';
	};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie bn, default en)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'bn';		
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'en';		
	};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie bn, default undefined)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'bn';		
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie en, default bn)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'bn';
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'bn';
	};
	
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie bn, default zh-CN)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages.bn.val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'bn';		
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'zh-CN';
	};
	
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie zh-CN, default en-US)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'zh-CN';
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'en-US';
	};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie zh-CN, default en)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'zh-CN';		
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'en';		
	};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie zh-CN, default undefined)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'zh-CN';		
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){};
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie en, default bn)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'zh-CN';
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'bn';
	};
	
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('setLangDropdown (cookie zh-CN, default zh-CN)', function(assert){
	assert.expect(3);
	var languages = this.LANGUAGES;

	$('#lang-choice').one('change', function(evt){
		assert.equal($(evt.target).val(), languages['zh-CN'].val);
	});
	
	this.TEST_LANG.getCookieValue = function(){
		return 'zh-CN';		
	};
	this.TEST_LANG.showHint = function(){
		assert.ok(true);
	};
	this.TEST_LANG.defaultLang = function(){
		return 'zh-CN';
	};
	
	this.TEST_LANG.setLangDropdown();
});

QUnit.test('lang', function(assert){
	assert.expect(3);

	this.TEST_LANG.code = 'my lang';
	assert.equal(this.TEST_LANG.lang(), 'my lang');
	this.TEST_LANG.code = 'en';
	assert.equal(this.TEST_LANG.lang(), 'en');
});

QUnit.test('hack', function(assert){
	assert.expect(16);
	var done = assert.async();
	
	$('body').append('<div id="goog-gt-tt"></div>');
	
	this.TEST_LANG.hack();
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
	this.TEST_LANG.hack = function(){
		assert.ok(true);
		assert.notOk($('#goog-gt-tt').length);
		done();
	};
});

QUnit.test('getCookie', function(assert){
	assert.expect(3);
	document.cookie = ' googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
	assert.notOk(this.TEST_LANG.getCookie());
	document.cookie = 'googtrans=/en/fr';
	assert.equal(this.TEST_LANG.getCookie(), '/en/fr');
	document.cookie = ' googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
});

QUnit.test('getCookieValue', function(assert){
	assert.expect(3);
	this.TEST_LANG.getCookie = function(){
		return '/en/fr';
	};
	assert.equal(this.TEST_LANG.getCookieValue(), 'fr');
	this.TEST_LANG.getCookie = function(){};
	assert.notOk(this.TEST_LANG.getCookieValue());
});

