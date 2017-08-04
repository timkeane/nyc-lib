var nyc = nyc || {};

/**
 * @public
 * @namespace
 */
nyc.lang = nyc.lang || {};

/** 
 * @desc Class for language translation using the Google Translate Gadget
 * @public 
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.lang.Translate.Options} options Constructor options
 * @fires nyc.lang.Translate.EventType#ready
 * @fires nyc.lang.Translate.EventType#change
 */
nyc.lang.Translate = function(options){
	nyc.lang.translate = this;
    var defaultLang = options.defaultLang || 'en';
	this.isButton = options.isButton;
	this.languages = options.languages;
	this.isButton = options.isButton;
	this.hints = [];
	this.namedCodes = {};
    if (options.messages){
        this.messages = options.messages;
        this.defaultMessages = options.messages[defaultLang];
    }
	this.render(options.target);
};

nyc.lang.Translate.prototype = {
	/** 
	 * @private 
	 * @member {boolean}
	 */
	isButton: false,
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
	 * @member {Array<string>}
	 */
	hints: null,
	/** 
	 * @private 
	 * @member {Array<string>}
	 */
	languages: null,
	/** 
	 * @public
	 * @method 
	 */
	ready: function(){
	},
	/** 
	 * @public
	 * @method 
	 */
	render: function(target){
		var codes = [], div = $(nyc.lang.Translate.HTML);
		$(target).append(div);
		for (var code in this.languages){
			var name = this.languages[code].val || code,
				opt = $('<option></option>').attr('value', name).html(this.languages[code].desc);
			$('#lang-choice').append(opt);
			codes.push(code);
			this.hints.push(this.languages[code].hint);
			this.namedCodes[name] = code;
		}
		this.codes = codes.toString();
		div.trigger('create');
		if (this.isButton){
			$('#lang-choice-button').addClass('ctl ctl-btn');
			$('#lang-choice-button span').remove();
		}else{
			$('#lang-choice-button').addClass('mnu');
		}
		$('body').addClass('lang-en');
		$('#lang-choice').show().change($.proxy(this.translate, this));
		this.setLangDropdown();
		if (this.isButton){
			$('#lang-choice-button span').hide();
			this.showArrow();
		}else{
			$('#lang-choice-button span').html('Translate').show();			
		}
		if (this.messages){
			this.trigger(nyc.lang.Translate.EventType.READY, true);				
		}
	},
	/** 
	 * @private
	 * @method 
	 */
	showArrow: function(){
		if (this.showArrow){
			$('#lang-btn').append(nyc.lang.Translate.ARROW_HTML).trigger('create');
			$('#lang-hint-arrow a').click(function(){
				$('#lang-hint-arrow').fadeOut();
			});
			this.showHint();
			setTimeout(function(){
				$('#lang-hint-arrow').fadeOut();
			}, 10000);
		}
    },
    /** 
     * @private
     * @method 
     */
    showHint: function(){
    	var hints = this.hints, h = 0;
    	if (!this.isButton){
    		hint = '#lang-choice-button span';
    	}else if (this.showArrow){
    		hint = '#lang-hint-arrow span';
    	}
    	setInterval(function(){
    		$(hint).html(hints[h] || 'Translate');
    		h++;
    		if (h == hints.length) h = 0;
    	}, 1000);
    },
	/** 
	 * @desc Sets the chosen language and performs message substitution
	 * @public
	 * @method 
	 */
   translate: function(event){
	   if (event){
		   var lang = $(event.target).val();
		   if (lang){
			   this.code = lang;
			   for (var key in this.defaultMessages){
				   var msg = this.messages[lang][key] || this.defaultMessages[key];
				   $('.' + key).html(msg);
				   $('*[data-msg-key="' + key + '"]').each(function(){
					   var attr = $(this).data('msg-attr');
					   $(this).attr(attr, msg);
				   });
			   }
			   this.trigger(nyc.lang.Translate.EventType.CHANGE, this.code);
		   }
	   }
   },
	/** 
	 * @private
	 * @method 
	 */
	css: function(){
		$.each(this.codes.split(','), function(_, code){
			$('body').removeClass('lang-' + code);
		});
		$('body')[this.code == 'en' ? 'removeClass' : 'addClass']('translated');
		$('body').addClass('lang-' + this.code);		
	},
	/** 
	 * @private
	 * @method 
	 */
	defaultLang: function(){
		return navigator.language ? navigator.language.split('-')[0] : (this.defaultLang || 'en');
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
	 * @public
	 * @method 
	 * @return {string}
	 */
	getCookieValue: function(){}
};

nyc.inherits(nyc.lang.Translate, nyc.EventHandling);

/**
 * @desc Constructor for {@link nyc.lang.Translate}
 * @public
 * @typedef {Object}
 * @property {(String|Element|JQuery)} target The HTML DOM element that will provide language choices
 * @property {nyc.lang.Translate.Choices} languages The languages to provide
 * @property {boolean} [isButton=false] Show as a button
 * @property {boolean} [showArrow=false] Show the hint arrow if displaying as a button
 */
nyc.lang.Translate.Options;

/**
 * @desc Enumeration for nyc.lang.Translate event types
 * @public
 * @enum {string}
 */
nyc.lang.Translate.EventType = {
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
 * @desc A language choice for {@link nyc.lang.Translate.Choices}
 * @public
 * @typedef {Object}
 * @property {string} val The language value used by Google
 * @property {string} desc The display value for the language
 * @property {string=} hint The translation of the word 'Translate' in the language
 */
nyc.lang.Translate.Choice;

/**
 * @desc A mapping of {@link nyc.lang.Translate.Choice} objects to language codes  
 * @public
 * @typedef {Object<string, nyc.lang.Translate.Choice>}
 */
nyc.lang.Translate.Choices;

/**
 * @desc The class has completed initialization
 * @event nyc.lang.Translate#ready
 * @type {boolean}
 */

/**
 * @desc The language value has changed
 * @event nyc.lang.Translate#change
 * @type {string}
 */

/**
 * @private
 * @const
 * @type {string}
 */
nyc.lang.Translate.HTML = '<div id="lang-btn" title="Translate...">' +
		'<div id="lang-trans"></div>' +
		'<select id="lang-choice" class="notranslate" translate="no"></select>' +
	'</div>';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.lang.Translate.ARROW_HTML = '<div id="lang-hint-arrow" class="notranslate" translate="no">' +
		'<span>Translate</span>' +
		'<!-- my sincerest apologies to all sensible people -->' +
		'<a data-role="button" data-icon="delete" data-iconpos="notext">Close</a>' +
	'</div>';