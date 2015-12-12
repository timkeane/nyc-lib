var nyc = nyc || {};

/** 
 * @external google.translate.TranslateElement 
 */

/** 
 * @desc Class for language translation using the Google Translate Gadget
 * @public 
 * @class
 * @constructor
 * @property {(String|Element|JQuery)} target The HTML DOM element that will provide language choices
 * @param {nyc.Lang.Choices} languages The languages to provide
 */
nyc.Lang = function(target, languages){
	var codes = [], div = $(nyc.Lang.HTML);
	nyc.lang = this;
	this.hints = [];
	this.namedCodes = {};
	$(target).append(div);
	for (var code in languages){
		var name = languages[code].val,
			opt = $('<option></option>').attr('value', name).html(languages[code].desc);
		$('#lang-choice').append(opt);
		codes.push(code);
		this.hints.push(languages[code].hint);
		this.namedCodes[name] = code;
	}
	this.codes = codes.toString();
	this.languages = languages;
	div.trigger('create');
	$.getScript('//translate.google.com/translate_a/element.js?cb=nyc.lang.init');
};

nyc.Lang.prototype = {
	/** 
	 * @private 
	 * @member {Array<string>}
	 */
	namedCodes: null,
	/** 
	 * @private 
	 * @member {string}
	 */
	code: '',
	/** 
	 * @private 
	 * @member {string}
	 */
	codes: '',
	/** 
	 * @private 
	 * @member {google.translate.TranslateElement}
	 */
	translate: null,
	/** 
	 * @private 
	 * @member {Array<string>}
	 */
	hints: null,
	/** 
	 * @private 
	 * @member {Array<string>}
	 */
	languages: null,
	/** 
	 * @desc Initializes the class on callback from the Google Translate Gadget loader 
	 * @public 
	 * @method
	 */
	init: function(){
		nyc.lang.translate = new google.translate.TranslateElement({
			pageLanguage: 'en',
			includedLanguages: nyc.lang.codes,
			layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
			autoDisplay: false
		}, 'lang-trans');
		$('#lang-choice').show();
		nyc.lang.initDropdown();
		nyc.lang.setLangDropdown();
		$('#lang-choice-button span').html('Translate').show();			
		nyc.lang.hack();
		nyc.lang.trigger(nyc.Lang.EventType.READY, true);
	},
	/** 
	 * @private
	 * @method 
	 */
	showHint: function(){
		var hints = this.hints, h = 0;
		setInterval(function(){
			$('#lang-choice-button span').html(hints[h] || 'Translate');
			h++;
			if (h == hints.length) h = 0;
		}, 1000);
    },
	/** 
	 * @private
	 * @method 
	 */
   chooseLang: function(lang){
		var choices = $('iframe.goog-te-menu-frame:first').contents().find('.goog-te-menu2-item span.text');
		if (choices.length){
			if (lang == 'English'){
				nyc.lang.showOriginalText();
			}else{
				$(choices).each(function(){
					if ($(this).text() == lang){
						$(this).click();
						return false;
					}
				});					
			}
			$('#lang-choice-button span').show();
			this.code = nyc.lang.namedCodes[lang] || 'en';
			this.trigger(nyc.Lang.EventType.CHANGE, this.code);
		}else{
			var me = this;
			setTimeout(function(){me.chooseLang(lang);}, 100);
		}
	},
	/** 
	 * @private
	 * @method 
	 */
    initDropdown: function(){
    	var me = this;
		$('#lang-choice').change(function(){
			me.chooseLang($(this).val());
		});
	},
	/** 
	 * @private
	 * @method 
	 */
	showOriginalText: function(){
		var googBar = $('iframe.goog-te-banner-frame:first');
		$(googBar.contents().find('.goog-te-button button')).each(function(){
			if ($(this).text() == 'Show original'){
				$(this).trigger('click');
				if ($('#lang-choice').val() != 'English'){
					$('#lang-choice').val('English');
				}
				return false;
			}
		});
	},
	/** 
	 * @private
	 * @method 
	 */
	defaultLang: function(){
		return navigator.language ? navigator.language.split('-')[0] : 'en';
	},
	/** 
	 * @private
	 * @method 
	 */
	setLangDropdown: function(){
		var defLang = this.defaultLang(), 
			langCode = this.getCookieValue();
		this.showHint();
		if (!langCode){
			for (var code in this.languages){
				if (code.indexOf(defLang) == 0){
					langCode = code;
					break;
				}
			}
			langCode = langCode || 'en';
		}
		$('#lang-choice').val(this.languages[langCode].val).trigger('change');
	},
	/** 
	 * @desc Get the currently chosen language code
	 * @public
	 * @method 
	 * @return {string} The currently chosen language code
	 */
	lang: function(){
		return this.code;
	},
	/** 
	 * @private
	 * @method 
	 */
	hack: function(){
		/*
		 * google translate doesn't translate placeholder attributes
		 * so we'll add a hidden span after input elements that have placeholders
		 * then use the placeholder text for the span
		 * then apply the translation of the span back to the placeholder
		 */
		$('input[placeholder]').each(function(){
			var next = $(this).next();
			if (!next.hasClass('lang-placeholder')){
				$(this).after('<span class="lang-placeholder">' + $(this).attr('placeholder') + '</span>');
			}else{
				$(this).attr('placeholder', next.html().replace(/<font>/g, '').replace(/<\/font>/g, ''));
			}
		});
		/*
		 * fix jquerymobile buttons crippled by font tags added by google translate
		 */
		$('font').each(function(){
			if ($(this).data('lang-hack') != 'hacked'){
				var parent = $(this).parent();
				$(this).data('lang-hack', 'hacked');
				if (parent.length && parent[0].tagName.toUpperCase() != 'FONT' && parent.data('role') == 'button'){
					$(this).click(function(event){
						event.stopImmediatePropagation();
						parent.trigger('click');
					});
				}
			}
		});
		$('body').css('top', 'auto');
		$('#goog-gt-tt').remove();
		setTimeout($.proxy(this.hack, this), 200);
	},
	/** 
	 * @private 
	 * @method 
	 * @return {string}
	 */
	getCookie: function(){
	    var cookies = document.cookie.split(';');
	    for (var i = 0; i < cookies.length; i++){
	        var cookie = cookies[i];
	        while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
	        if ( cookie.indexOf('googtrans=') == 0 ){
	            return cookie.substring(10, cookie.length);
	        }
	    }
	},
	/** 
	 * @private 
	 * @method 
	 * @return {string}
	 */
	getCookieValue: function(){
		var cookie = this.getCookie();
		if (cookie){
			cookie = cookie.split('/');
			cookie = cookie[2];
			return cookie;
		}
	}
};

nyc.inherits(nyc.Lang, nyc.EventHandling);

/**
 * @desc Enumeration for nyc.Lang event types
 * @public
 * @enum {string}
 */
nyc.Lang.EventType = {
	/**
	 * @desc The ready event type
	 */
	READY: 'ready',
	/**
	 * @desc The change event type
	 */
	CHANGE: 'change'
};

/**
 * @desc A language choice for {@link nyc.Lang.Choices}
 * @public
 * @typedef {Object}
 * @property {string} val The language value used by Google
 * @property {string} desc The display value for the language
 * @property {string=} hint The translation of the word 'Translate' in the language
 */
nyc.Lang.Choice;

/**
 * @desc A mapping of {@link nyc.Lang.Choice} objects to language codes  
 * @public
 * @typedef {Object<string, nyc.Lang.Choice>}
 * @example 
{
	en: {val: 'English', desc: 'English', hint: 'Translate'},
	es: {val: 'Spanish', desc: 'Espa&#241;ol', hint: 'Traducir'}
}
 */
nyc.Lang.Choices;

/**
 * @desc The class has completed initialization
 * @event nyc.Lang#ready
 * @type {boolean}
 */

/**
 * @desc The language value has changed
 * @event nyc.Lang#change
 * @type {string}
 */

/**
 * @private
 * @const
 * @type {string}
 */
nyc.Lang.HTML = 
	"<div id='lang-btn' title='Translate...'>" +
		"<div id='lang-trans'></div>" +
		"<select id='lang-choice' class='notranslate' translate='no'></select>" +
	"</div>";