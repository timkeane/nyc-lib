/**
 * @module nyc/lang/Translate
 */

import $ from 'jquery'

import Container from '../Container'

/**
 * @desc Class for language translation using the Google Translate Gadget
 * @public
 * @class
 * @extends module:nyc/Container~Container
 * @fires module:nyc/lang/Translate~Translate#ready
 * @fires module:nyc/lang/Translate~Translate#change
 */
class Translate extends Container {
  /**
   * @desc Create an instance of Translate
   * @public
   * @constructor
   * @param {module:nyc/lang/Translate~Translate.Options} options Constructor options
   */
  constructor(options) {
    super(options.target)
    global.nycTranslateInstance = this
    /**
     * @private
     * @member {string}
     */
    this.defaultLanguage = options.defaultLanguage || 'en'
    /**
     * @private
     * @member {boolean}
     */
    this.button = options.button
    /**
     * @private
     * @member {Array<string>}
     */
    this.languages = options.languages || Translate.DEFAULT_LANGUAGES
    /**
     * @private
     * @member {Array<string>}
     */
    this.hints = []
    /**
     * @private
     * @member {Array<string>}
     */
    this.namedCodes = {}
    /**
     * @private
     * @member {string}
     */
    this.code = ''
    /**
     * @private
     * @member {Object<string,Object<string,string>>}
     */
    this.messages = {}

    Object.keys(this.languages).forEach(lang => {
      this.messages[lang] = {}
      Object.assign(this.messages[lang], Translate.DEFAULT_MESSAGES[lang])
      if (options.messages && options.messages[lang]) {
        Object.assign(this.messages[lang], options.messages[lang])
      }
    })

    /**
     * @private
     * @member {Object<string,Object<string,string>>}
     */
    this.defaultMessages = null
    if (this.messages) {
      if (!this.messages[this.defaultLanguage]) {
        this.defaultLanguage = this.defaultLang()
      }
      if (!this.messages[this.defaultLanguage]) {
        this.defaultLanguage = 'en'
      }
      this.defaultMessages = this.messages[this.defaultLanguage]
    }
    /**
     * @private
     * @member {string}
     */
    this.code = this.defaultLanguage
    this.render(options.target)
    /**
     * @private
     * @member {boolean}
     */
    this.monitoring = false
  }
  /**
   * @private
   * @method
   */
  monitor() {
    if (!this.monitoring) {
      const fn = () => {
        this.translate()
      }
      setInterval(fn, 1000)
      this.monitoring = true
    }
  }
  /**
   * @desc Sets the chosen language and performs message substitution
   * @public
   * @method
   * @param {jQuery.Event} event Event object
   */
  translate(event) {
    const lang = event ? $(event.target).val() : this.lang()
    this.monitor()
    this.code = lang
    $('html').attr('lang', lang)
    if (this.languages[lang].rtl) {
      $('html').removeClass('translated-ltr').addClass('translated-rtl')
    } else {
      $('html').removeClass('translated-rtl').addClass('translated-ltr')
    }
    const messages = this.messages[lang] || this.defaultMessages
    Object.keys(this.defaultMessages).forEach(key => {
      const msg = messages[key] || this.defaultMessages[key]
      $(`.${key}`).not('.notranslate').html(msg)
      $(`*[data-lng-key="${key}"]`).not('.notranslate').html(msg)
      $(`*[data-msg-key="${key}"]`).not('.notranslate').each((_, element) => {
        $(element).attr($(element).data('msg-attr'), msg)
      })
    })
    this.css()
    if (event) {
      this.trigger('change', this)
    }
  }
  /**
   * @desc Get the currently chosen language code
   * @public
   * @method
   * @return {string} The currently chosen language code
   */
  lang() {
    return this.code
  }
  /**
   * @desc Gets a cookie value
   * @access protected
   * @method
   * @return {string} cookie
   */
  langFromCookie() {
    return ''
  }
  /**
   * @private
   * @method
   * @param {jQuery|Element|string} target The target container
   */
  render(target) {
    const codes = []
    const div = $(Translate.HTML)
    $(target).append(div)
    const select = this.find('select')
    Object.keys(this.languages).forEach(lang => {
      const code = this.languages[lang].code
      const opt = $('<option class="notranslate" translate="no"></option>')
        .attr('value', lang).html(this.languages[lang].native)
        .addClass(this.languages[lang].rtl ? 'rtl' : '')
      select.append(opt)
      codes.push(code)
      this.hints.push(this.languages[lang].hint)
      this.namedCodes[code] = lang
    })
    this.codes = codes.toString()
    this.find('select').change($.proxy(this.translate, this))
    this.selectDefault()
    this.showHint()
    if (this.button) {
      this.showButton()
    } else {
      this.showMenu()
    }
    select.focus(() => {
      select.prev().addClass('focused')
    })
    select.blur(() => {
      select.prev().removeClass('focused')
    })
    this.trigger('ready', this)
  }
  /**
   * @desc Show as button
   * @public
   * @method
   * @param {JQuery|Element|string=} target Target node
   */
  showButton(target) {
    this.alterDisplay(true, target)
  }
  /**
   * @desc Show as menu
   * @public
   * @method
   * @param {JQuery|Element|string=} target Target node
   */
  showMenu(target) {
    this.alterDisplay(false, target)
  }
  /**
   * @private
   * @method
   * @param {boolean} button Show as button
   * @param {JQuery|Element|string=} target Target node
   */
  alterDisplay(button, target) {
    if (button) {
      $('#lng div.rad-all').removeClass('btn').addClass('btn-sq')
      $('#lng select').removeClass('menu')
    } else {
      $('#lng div.rad-all').addClass('btn').removeClass('btn-sq')
      $('#lng select').addClass('menu')
    }
    if (target) {
      $(target).append($('#lng'))
    }
  }
  /**
   * @private
   * @method
   */
  css() {
    $('body')[this.code === this.defaultLanguage ? 'removeClass' : 'addClass']('translated')
  }
  /**
   * @private
   * @method
   * @return {string} Default language
   */
  defaultLang() {
    return navigator.language.split('-')[0]
  }
  /**
   * @private
   * @method
   */
  selectDefault() {
    const defLang = this.defaultLang()
    const cookie = this.langFromCookie()
    const exact = []
    const possible = []
    Object.values(this.languages).forEach(language => {
      const code = language.code
      if (cookie.indexOf(code) === 0) {
        exact.push(code)
      } else if (cookie.indexOf(defLang) === 0) {
        possible.push(code)
      }
    })
    const lang = exact[0] || possible[0] || 'en'
    this.find('select').val(this.languages[lang].code).trigger('change')
  }
  /**
   * @private
   * @method
   */
  showHint() {
    if (!this.button) {
      const hints = this.hints
      const hint = this.find('.hint')
      let h = 0
      setInterval(() => {
        hint.html(hints[h] || 'Translate')
        h += 1
        if (h === hints.length) {
          h = 0
        }
      }, 1000)
    }
  }
}

/**
 * @desc Constructor options for {@link module:nyc/lang/Translate~Translate}
 * @public
 * @typedef {Object}
 * @property {(String|Element|JQuery)} target The DOM element that will provide language choices
 * @property {Translate.Choices} languages The languages to provide
 * @property {Object<string,Object<string,string>>} messages The language-specific message bundles
 * @property {string} [defaultLanguage='en'] The default language
 * @property {boolean} [button=false] Show as a button
 */
Translate.Options

/**
 * @desc A language choice for {@link module:nyc/lang/Translate~Translate.Choices}
 * @public
 * @typedef {Object}
 * @property {string} code The language code
 * @property {string} name The language name
 * @property {string} native The display value for the language
 * @property {string=} hint The translation of the word 'Translate' in the language
 */
Translate.Choice

/**
 * @desc A mapping of {@link  module:nyc/lang/Translate~Translate.Choice} objects to language codes
 * @public
 * @typedef {Object<string, module:nyc/lang/Translate~Translate.Choice>}
 */
Translate.Choices

/**
 * @desc Default languages for NYC
 * @public
 * @const
 * @type {module:nyc/lang/Translate~Translate.Choices}
 */
Translate.DEFAULT_LANGUAGES = {
  en: {code: 'en', name: 'English', native: 'English', hint: 'Translate'},
  ar: {code: 'ar', name: 'Arabic', native: 'العربية', rtl: true},
  bn: {code: 'bn', name: 'Bengali', native: 'বাংলা', hint: '&#x985;&#x9A8;&#x9C1;&#x9AC;&#x9BE;&#x9A6; &#x995;&#x9B0;&#x9BE;'},
  zh: {code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文', hint: '&#x7FFB;&#x8BD1;'},
  fr: {code: 'fr', name: 'French', native: 'Fran&#231;ais', hint: 'Traduire'},
  iw: {code: 'iw', name: 'Hebrew', native: '&#x05E2;&#x05D1;&#x05E8;&#x05D9;&#x05EA;', hint: '&#x05DC;&#x05EA;&#x05E8;&#x05D2;&#x05DD;', rtl: true},
  ht: {code: 'ht', name: 'Haitian Creole', native: 'Krey&#242;l Ayisyen', hint: 'Tradui'},
  ko: {code: 'ko', name: 'Korean', native: '&#xD55C;&#xAD6D;&#50612;', hint: '&#xBC88;&#xC5ED;'},
  pl: {code: 'pl', name: 'Polish', native: 'polski', hint: 'język polski'},
  ru: {code: 'ru', name: 'Russian', native: 'P&#x443;&#x441;&#x441;&#x43A;&#x438;&#x439;', hint: '&#x43F;&#x435;&#x440;&#x435;&#x432;&#x435;&#x441;&#x442;&#x438;'},
  it: {code: 'it', name: 'Italian', native: 'Italiano', hint: 'Tradurre'},
  es: {code: 'es', name: 'Spanish', native: 'Espa&#241;ol', hint: 'Traducir'},
  ur: {code: 'ur', name: 'Urdu', native: 'اردو', hint: '&#x6BA;&#x6CC;&#x631;&#x6A9;&#x6C1;&#x645;&#x62C;&#x631;&#x62A;', rtl: true},
  yi: {code: 'yi', name: 'Yiddish', native: 'ייִדיש', hint: 'איבערזעץ', rtl: true}
}

Translate.DEFAULT_MESSAGES = {
  en: {
    'msg-filters': 'Filters',
    'msg-map': 'Map',
    'msg-facilities': 'Facilities',
    'msg-dir': 'Directions',
    'msg-dir-map': 'Route map',
    'msg-dtl': 'Details',
    'msg-web': 'Website',
    'msg-email': 'Email',
    'msg-srch': 'Search for an address...',
    'msg-back-to-finder': 'Back to finder',
    'msg-dir-from': 'From my location: ',
    'msg-dir-input': 'Enter an address...',
    'msg-dir-to': 'To: ',
    'msg-z-in': 'Zoom in',
    'msg-z-out': 'Zoom out',
    'msg-geo': 'Current location',
    'msg-shr': 'Share',
    'msg-translate': 'Translate',
    'msg-transit': 'Get transit directions',
    'msg-bike': 'Get bicycling directions',
    'msg-car': 'Get driving directions',
    'msg-walk': 'Get walking directions',
    'msg-mta': 'Get accessible transit directions from the MTA',
    'msg-sr-map': 'Locate this facility on the map',
    'msg-prv': 'Previous',
    'msg-nxt': 'Next',
    'msg-clr': 'Clear',
    'msg-more': 'More...',
    'msg-yes': 'Yes',
    'msg-no': 'No',
    'msg-no-dir': 'Could not determine directions from your location',
    'msg-unk-addr': 'The location you entered was not understood',
    'msg-ok': 'OK',
    'msg-cancel': 'Cancel',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'View map',
    'msg-closest': 'is closest to your location',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  ar: {
    'msg-filters': 'المرشحات',
    'msg-map': 'الخارطة',
    'msg-facilities': 'مرافق',
    'msg-dir': 'الاتجاهات',
    'msg-dir-map': 'خريطة الطريق',
    'msg-dtl': 'التفاصيل',
    'msg-web': 'الموقع الإلكتروني',
    'msg-email': 'البريد الإلكتروني',
    'msg-srch': 'ابحث عن عنوان...',
    'msg-back-to-finder': 'العودة الى الباحث',
    'msg-dir-from': 'من موقعي: ',
    'msg-dir-input': 'أدخل عنوان...',
    'msg-dir-to': 'إلى: ',
    'msg-z-in': 'تكبير',
    'msg-z-out': 'تصغير',
    'msg-geo': 'الموقع الحالي',
    'msg-shr': 'شارك',
    'msg-translate': 'ترجم',
    'msg-transit': 'أحصل على اتجاهات وسائل النقل',
    'msg-bike': 'أحصل على اتجاهات ركوب الدراجات',
    'msg-car': 'احصل على اتجاهات القيادة',
    'msg-walk': 'احصل على اتجاهات المشي',
    'msg-mta': 'احصل على اتجاهات النقل العام االمتاحة للمعاقين حركياً من MTA',
    'msg-sr-map': 'حدد هذا المرفق على الخريطة',
    'msg-prv': 'السابق',
    'msg-nxt': 'التالى',
    'msg-clr': 'أمسج',
    'msg-more': 'المزيد...',
    'msg-yes': 'نعم',
    'msg-no': 'لا',
    'msg-no-dir': 'تعذر تحديد الاتجاهات من موقعك',
    'msg-unk-addr': 'الموقع المدخل غير مفهوم',
    'msg-ok': 'حسناً',
    'msg-cancel': 'إلغاء',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'شاهد الخريطة',
    'msg-closest': 'هذا الأقرب لموقعك',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  bn: {
    'msg-filters': 'ফিল্টার',
    'msg-map': 'মানচিত্র',
    'msg-facilities': 'কেন্দ্রসমূহ',
    'msg-dir': 'পথনির্দেশনা',
    'msg-dir-map': 'রুট ম্যাপ',
    'msg-dtl': 'বিস্তারিত',
    'msg-web': 'ওয়েবসাইট',
    'msg-email': 'ইমেইল',
    'msg-srch': 'একটি ঠিকানা অনুসন্ধান করুন...',
    'msg-back-to-finder': 'ফাইন্ডার-এ ফিরে যান',
    'msg-dir-from': 'আমার অবস্থান থেকে: ',
    'msg-dir-input': 'একটি ঠিকানা লিখুন...',
    'msg-dir-to': 'থেকে: ',
    'msg-z-in': 'জুম-ইন',
    'msg-z-out': 'জুম-আউট',
    'msg-geo': 'বর্তমান অবস্থান',
    'msg-shr': 'শেয়ার',
    'msg-translate': 'অনুবাদ',
    'msg-transit': 'ট্রেনে যাওয়ার দিকনির্দেশনা নিন',
    'msg-bike': 'বাইসাইকেলে যাওয়ার দিকনির্দেশনা নিন',
    'msg-car': 'গাড়িতে যাওয়ার দিকনির্দেশনা নিন',
    'msg-walk': 'হেঁটে যাওয়ার দিকনির্দেশনা নিন',
    'msg-mta': 'MTA থেকে ট্রানজিট সংক্রান্ত দিকনির্দেশনা নিন (হুইলচেয়ার ব্যবহারযোগ্য)',
    'msg-sr-map': 'মানচিত্রে এই কেন্দ্রটি চিহ্নিত করুন',
    'msg-prv': 'পূর্ববর্তী',
    'msg-nxt': 'পরবর্তী',
    'msg-clr': 'মুছুন',
    'msg-more': 'আরো...',
    'msg-yes': 'হ্যাঁ',
    'msg-no': 'না',
    'msg-no-dir': 'আপনার অবস্থান থেকে যাওয়ার পথ নির্ধারণ করা যায়নি৷',
    'msg-unk-addr': 'আপনার প্রবেশ করানো জায়গাটি বোঝা যায়নি',
    'msg-ok': 'ঠিক আছে',
    'msg-cancel': 'বাতিল করুন',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'মানচিত্র দেখুন',
    'msg-closest': 'আপনার অবস্থানের সবচেয়ে কাছে অবস্থিত',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  zh: {
    'msg-filters': '篩選',
    'msg-map': '地圖',
    'msg-facilities': '設備',
    'msg-dir': '交通資訊',
    'msg-dir-map': '路線地圖',
    'msg-dtl': '詳細說明',
    'msg-web': '網站',
    'msg-email': '電子郵件',
    'msg-srch': '搜索地址...',
    'msg-back-to-finder': '回到搜尋器',
    'msg-dir-from': '從我的位置: ',
    'msg-dir-input': '輸入地址...',
    'msg-dir-to': '前往: ',
    'msg-z-in': '放大',
    'msg-z-out': '縮小',
    'msg-geo': '目前位置',
    'msg-shr': '分享',
    'msg-translate': '翻譯',
    'msg-transit': '獲取公交路線',
    'msg-bike': '獲取騎車路線',
    'msg-car': '獲取行車路線',
    'msg-walk': '獲取步行路線',
    'msg-mta': '從MTA獲取可訪問的公交路線',
    'msg-sr-map': '在地圖上找到該設施',
    'msg-prv': '前一個',
    'msg-nxt': '下一個',
    'msg-clr': '清除',
    'msg-more': '閱讀更多...',
    'msg-yes': '有',
    'msg-no': '沒有',
    'msg-no-dir': '無法找出從您位置開始的交通資訊',
    'msg-unk-addr': '無法辨識您輸入的地址',
    'msg-ok': '了解',
    'msg-cancel': '取消',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': '查看地圖',
    'msg-closest': '離您的位置最近',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  fr: {
    'msg-filters': 'Filtres',
    'msg-map': 'Plan',
    'msg-facilities': 'Installations',
    'msg-dir': 'Itinéraires',
    'msg-dir-map': 'Plan de route',
    'msg-dtl': 'Détails',
    'msg-web': 'Site Internet',
    'msg-email': 'E-mail',
    'msg-srch': 'Rechercher une adresse ...',
    'msg-back-to-finder': 'Retour à la recherche',
    'msg-dir-from': 'Mon point de départ : ',
    'msg-dir-input': 'Entrer une adresse…',
    'msg-dir-to': 'À : ',
    'msg-z-in': 'Zoomer',
    'msg-z-out': 'Dézoomer',
    'msg-geo': 'Lieu actuel',
    'msg-shr': 'Partager',
    'msg-translate': 'Traduction',
    'msg-transit': 'Obtenir les itinéraires en transports en commun',
    'msg-bike': 'Obtenir les itinéraires à vélo',
    'msg-car': 'Obtenir les itinéraires routiers',
    'msg-walk': 'Obtenir les itinéraires à pied',
    'msg-mta': 'Obtenir les itinéraires en transports en commun accessibles depuis le MTA',
    'msg-sr-map': 'Localiser cette installation sur la carte',
    'msg-prv': 'Précédent',
    'msg-nxt': 'Prochain',
    'msg-clr': 'Effacer',
    'msg-more': 'Plus...',
    'msg-yes': 'Oui',
    'msg-no': 'Non',
    'msg-no-dir': 'Ne peut pas établir l\'itinéraire à partir de votre emplacement',
    'msg-unk-addr': 'L\'adresse que vous avez tapée, n\'est pas reconnue',
    'msg-ok': 'OK',
    'msg-cancel': 'Annuler',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'Voir le plan',
    'msg-closest': 'est le plus proche de votre adresse',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  iw: {
    'msg-filters': 'מסננים',
    'msg-map': 'מפה',
    'msg-facilities': 'מתקנים',
    'msg-dir': 'הוראות',
    'msg-dir-map': 'מפת מסלול',
    'msg-dtl': 'פרטים',
    'msg-web': 'אתר אינטרנט',
    'msg-email': 'אימייל',
    'msg-srch': 'חפש כתובת ...',
    'msg-back-to-finder': 'בחזרה לאתר',
    'msg-dir-from': 'מהמיקום שלי:',
    'msg-dir-input': 'הכנס כתובת...',
    'msg-dir-to': 'ל: ',
    'msg-z-in': 'התקרב',
    'msg-z-out': 'להקטין את התצוגה',
    'msg-geo': 'מיקום נוכחי',
    'msg-shr': 'שתף',
    'msg-translate': 'לתרגם',
    'msg-transit': 'קבל הוראות נסיעה',
    'msg-bike': 'קבל הנחיות אופניים',
    'msg-car': 'קבל הוראות נסיעה',
    'msg-walk': 'קבל הנחיות הליכה',
    'msg-mta': 'קבל הנחיות הגעה נגישות מה- MTA',
    'msg-sr-map': 'אתר את המתקן הזה על המפה',
    'msg-prv': 'קודם',
    'msg-nxt': 'הבא',
    'msg-clr': 'ברור',
    'msg-more': 'יותר...',
    'msg-yes': 'כן',
    'msg-no': 'לא',
    'msg-no-dir': 'Could not determine directions from',
    'msg-unk-addr': 'The location you entered was not understood',
    'msg-ok': 'OK',
    'msg-cancel': 'Cancel',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'View map',
    'msg-closest': 'is closest to your location',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  ht: {
    'msg-filters': 'Filtè yo',
    'msg-map': 'Kat',
    'msg-facilities': 'Enstalasyon yo',
    'msg-dir': 'Esplikasyon',
    'msg-dir-map': 'Kat wout la',
    'msg-dtl': 'Detay yo',
    'msg-web': 'Sit wèb',
    'msg-email': 'Imèl',
    'msg-srch': 'Chèche yon adrès ...',
    'msg-back-to-finder': 'Retounen Nan Lokalizatè',
    'msg-dir-from': 'Apati anplasman mwen: ',
    'msg-dir-input': 'Antre yon adrès...',
    'msg-dir-to': 'Pou: ',
    'msg-z-in': 'Agrandi',
    'msg-z-out': 'Diminye',
    'msg-geo': 'Anplasman aktyèl',
    'msg-shr': 'Pataje',
    'msg-translate': 'Tradui',
    'msg-transit': 'Jwenn direksyon transpò piblik yo',
    'msg-bike': 'Jwenn direksyon sou bisiklèt',
    'msg-car': 'Jwenn direksyon pou kondwi',
    'msg-walk': 'Jwenn direksyon pou mache',
    'msg-mta': 'Jwenn direksyon transpò ki aksesib soti nan MTA a',
    'msg-sr-map': 'Jwenn etablisman sa a sou kat la',
    'msg-prv': 'Anvan yo',
    'msg-nxt': 'Pwochen',
    'msg-clr': 'Klè',
    'msg-more': 'Plis...',
    'msg-yes': 'Wi',
    'msg-no': 'Non',
    'msg-no-dir': 'Li pa t posib pou jwenn chemen pou fè a apatide kote ou ye a',
    'msg-unk-addr': 'Kote ou make a pa klè',
    'msg-ok': 'OK',
    'msg-cancel': 'Anile',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'Gade kat la',
    'msg-closest': 'pi pre kote ou ye a',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  ko: {
    'msg-filters': '필터',
    'msg-map': '지도',
    'msg-facilities': '시설',
    'msg-dir': '길 찾기',
    'msg-dir-map': '노선 지도',
    'msg-dtl': '세부사항',
    'msg-web': '웹 사이트',
    'msg-email': '이메일',
    'msg-srch': '주소 검색...',
    'msg-back-to-finder': '파인더로 돌아가기',
    'msg-dir-from': '내 위치에서: ',
    'msg-dir-input': '주소 입력하기...',
    'msg-dir-to': '목적지: ',
    'msg-z-in': '확대하기',
    'msg-z-out': '축소하기',
    'msg-geo': '현 위치',
    'msg-shr': '공유하기',
    'msg-translate': '번역하기',
    'msg-transit': '대중 교통 길 찾기',
    'msg-bike': '자전거 길 찾기',
    'msg-car': '운전 경로 찾기',
    'msg-walk': '도보 길 찾기',
    'msg-mta': 'MTA에서 접근 가능한 대중 교통 길 찾기',
    'msg-sr-map': '지도에서 이 시설 찾기',
    'msg-prv': '이전',
    'msg-nxt': '다음',
    'msg-clr': '삭제하기',
    'msg-more': '더 보기...',
    'msg-yes': '예',
    'msg-no': '아니요',
    'msg-no-dir': '귀하의 위치에서 길을 찾을 수 없습니다',
    'msg-unk-addr': '입력하신 위치를 이해할 수 없습니다',
    'msg-ok': '확인',
    'msg-cancel': '취소하기',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': '지도 보기',
    'msg-closest': '가장 가까운 위치입니다',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  pl: {
    'msg-filters': 'Filtry',
    'msg-map': 'Mapa',
    'msg-facilities': 'Budynki',
    'msg-dir': 'Jak dojechać',
    'msg-dir-map': 'Mapa trasy',
    'msg-dtl': 'Szczegóły',
    'msg-web': 'Strona internetowa',
    'msg-email': 'E-mail',
    'msg-srch': 'Wyszukiwanie adresu...',
    'msg-back-to-finder': 'Wróć do wyszukiwania',
    'msg-dir-from': 'Z mojej lokalizacji: ',
    'msg-dir-input': 'Wpisz adres...',
    'msg-dir-to': 'Do: ',
    'msg-z-in': 'Powiększenie',
    'msg-z-out': 'Zmniejszenie',
    'msg-geo': 'Obecna lokalizacja',
    'msg-shr': 'Przekaż dalej',
    'msg-translate': 'Tłumaczenie',
    'msg-transit': 'Uzyskaj wskazówki dojazdu transportem publicznym',
    'msg-bike': 'Uzyskaj wskazówki dojazdu rowerem',
    'msg-car': 'Uzyskaj wskazówki dojazdu samochodem',
    'msg-walk': 'Uzyskaj wskazówki piesze',
    'msg-mta': 'Uzyskaj z MTA wskazówki dojazdu  środkami dostępnymi dla wózków ',
    'msg-sr-map': 'Znajdź ten obiekt na mapie',
    'msg-prv': 'Poprzedni',
    'msg-nxt': 'Kolejny',
    'msg-clr': 'Usuń wszystko',
    'msg-more': 'Więcej...',
    'msg-yes': 'Tak',
    'msg-no': 'Nie',
    'msg-no-dir': 'Nie można ustalić trasy z twojej lokalizacji',
    'msg-unk-addr': 'Wpisana lokalizacja nie została rozpoznana',
    'msg-ok': 'OK',
    'msg-cancel': 'Skasuj',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'Zobacz mapę',
    'msg-closest': 'jest najbliżej do twojej lokalizacji',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  ru: {
    'msg-filters': 'Фильтры',
    'msg-map': 'Карта',
    'msg-facilities': 'центры',
    'msg-dir': 'Инструкции',
    'msg-dir-map': 'Карта маршрута',
    'msg-dtl': 'Подробности',
    'msg-web': 'Веб-сайт',
    'msg-email': 'электронная почта',
    'msg-srch': 'Искать по адресу...',
    'msg-back-to-finder': 'Обратно в поисковик',
    'msg-dir-from': 'Из моего местоположения: ',
    'msg-dir-input': 'Ввести адрес...',
    'msg-dir-to': 'В: ',
    'msg-z-in': 'Приблизить',
    'msg-z-out': 'Удалить',
    'msg-geo': 'Текущее местоположение',
    'msg-shr': 'Поделиться',
    'msg-translate': 'Перевести',
    'msg-transit': 'Получить транзитные маршруты',
    'msg-bike': 'Получить велосипедные маршруты',
    'msg-car': 'Получить направление движения',
    'msg-walk': 'Получить пешеходные маршруты',
    'msg-mta': 'Получить доступные транзитные направления от MTA',
    'msg-sr-map': 'Найдите этот объект на карте',
    'msg-prv': 'предыдущий',
    'msg-nxt': 'следующий',
    'msg-clr': 'Очистить',
    'msg-more': 'Еще...',
    'msg-yes': 'Да',
    'msg-no': 'Нет',
    'msg-no-dir': 'Не смог определить путь с вашего местоположения',
    'msg-unk-addr': 'Вы набрали непонятное местоположение',
    'msg-ok': 'Согласен',
    'msg-cancel': 'Отменить',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'Смотреть карту',
    'msg-closest': 'является ближайший к вам',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  es: {
    'msg-filters': 'Filtros',
    'msg-map': 'Mapa',
    'msg-facilities': 'Instalaciones',
    'msg-dir': 'Cómo llegar',
    'msg-dir-map': 'Mapa de ruta',
    'msg-dtl': 'Detalles',
    'msg-web': 'Sitio web',
    'msg-email': 'correo electrónico',
    'msg-srch': 'Busque una dirección...',
    'msg-back-to-finder': 'Volver al buscador',
    'msg-dir-from': 'Desde mi ubicación: ',
    'msg-dir-input': 'Escriba una dirección...',
    'msg-dir-to': 'A: ',
    'msg-z-in': 'Acercar',
    'msg-z-out': 'Alejar',
    'msg-geo': 'Ubicación actual',
    'msg-shr': 'Compartir',
    'msg-translate': 'Traducir',
    'msg-transit': 'Obtener indicaciones de tránsito',
    'msg-bike': 'Obtener indicaciones en bicicleta',
    'msg-car': 'Obtener direcciones en automóvil',
    'msg-walk': 'Obtener indicaciones caminando',
    'msg-mta': 'Obtener indicaciones de tránsito accesibles de la MTA',
    'msg-sr-map': 'Ubique esta instalación en el mapa',
    'msg-prv': 'Previo',
    'msg-nxt': 'Siguiente',
    'msg-clr': 'Eliminar',
    'msg-more': 'Más...',
    'msg-yes': 'Sí',
    'msg-no': 'No',
    'msg-no-dir': 'No pudimos establecer la dirección desde su ubicación',
    'msg-unk-addr': 'No pudimos entender la dirección que escribió',
    'msg-ok': 'OK',
    'msg-cancel': 'Cancelar',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'Ver mapa',
    'msg-closest': 'Se encuentra cercano a su dirección',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  },
  ur: {
    'msg-filters': 'فلٹرز',
    'msg-map': 'نقشہ',
    'msg-facilities': 'سہولیات',
    'msg-dir': 'ڈائریکشن',
    'msg-dir-map': 'راستے کا نقشہ',
    'msg-dtl': 'تفصیلات',
    'msg-web': 'ویب سائٹ',
    'msg-email': 'ای میل',
    'msg-srch': 'ایڈریس کو تلاش کریں...',
    'msg-back-to-finder': 'فائنڈر پر واپسی',
    'msg-dir-from': 'اپنی لوکیشن سے: ',
    'msg-dir-input': 'ایڈریس لکھیں...',
    'msg-dir-to': 'اس جگہ کیلئے: ',
    'msg-z-in': 'زوم ان',
    'msg-z-out': 'زوم آوٹ',
    'msg-geo': 'موجودہ لوکیشن',
    'msg-shr': 'شیئر کریں',
    'msg-translate': 'ترجمہ کریں',
    'msg-transit': 'راہداری کی سمتیں حاصل کریں',
    'msg-bike': 'سائیکل چلانے کی سمت حاصل کریں',
    'msg-car': 'ڈرائیونگ کی سمت حاصل کریں',
    'msg-walk': 'چلنے کی سمت حاصل کریں',
    'msg-mta': 'ایم ٹی اے سے قابل رسائی آمدورفت کی سمت حاصل کریں',
    'msg-sr-map': 'نقشہ پر اس سہولت کا پتہ لگائیں',
    'msg-prv': 'پچھلا',
    'msg-nxt': 'اگلا',
    'msg-clr': 'صاف',
    'msg-more': 'مزید...',
    'msg-yes': 'ہاں',
    'msg-no': 'نہیں',
    'msg-no-dir': 'آپ کی لوکیشن سے سمت کا تعین نہیں ہو سکا',
    'msg-unk-addr': 'ناقابل فہم پتہ ڈالا گیا',
    'msg-ok': 'او۔کے',
    'msg-cancel': ' منسوخ کریں',
    'msg-vw-list': 'View facilities list',
    'msg-vw-map': 'وہ جگہ دیکھئیے',
    'msg-closest': 'جو آپ کے قریب ہے',
    'msg-sr-info': 'Screen reader instructions',
    'msg-continue': 'Continue'
  }
}

/**
 * @desc The class has completed initialization
 * @event module:nyc/lang/Translate~Translate#ready
 * @type {boolean}
 */

/**
 * @desc The language value has changed
 * @event module:nyc/lang/Translate~Translate#change
 * @type {string}
 */

/**
 * @private
 * @const
 * @type {string}
 */
Translate.HTML = '<div id="lng" role="region">' +
  '<span class="screen-reader-only">Translate this page into another language</span>' +
  '<div class="btn rad-all"><span class ="hint notranslate">Translate</span></div>' +
  '<select data-msg-key="msg-translate" data-msg-attr="title" title="Translate"></select>' +
  '<div id="lng-goog"></div>' +
'</div>'

export default Translate
