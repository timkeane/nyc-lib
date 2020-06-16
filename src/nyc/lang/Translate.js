/**
 * @module nyc/lang/Translate
 */

import $ from 'jquery'

import Container from 'nyc/Container'

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
      const opt = $('<option class="notranslate" translate="no"></option>').attr('value', lang).html(this.languages[lang].native)
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
      $('#lng').addClass('button')
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
  ar: {code: 'ar', name: 'Arabic', native: '&#x629;&#x64A;&#x628;&#x631;&#x639;&#x644;&#x627;', hint: '&#x645;&#x62C;&#x631;&#x62A;', rtl: true},
  bn: {code: 'bn', name: 'Bengali', native: '&#x9AC;&#x9BE;&#x999;&#x9BE;&#x9B2;&#x9BF;', hint: '&#x985;&#x9A8;&#x9C1;&#x9AC;&#x9BE;&#x9A6; &#x995;&#x9B0;&#x9BE;'},
  zh: {code: 'zh-CN', name: 'Chinese (Simplified)', native: '&#x4E2D;&#x56FD;', hint: '&#x7FFB;&#x8BD1;'},
  fr: {code: 'fr', name: 'French', native: 'Fran&#231;ais', hint: 'Traduire'},
  iw: {code: 'iw', name: 'Hebrew', native: '&#x05E2;&#x05D1;&#x05E8;&#x05D9;&#x05EA;', hint: '&#x05DC;&#x05EA;&#x05E8;&#x05D2;&#x05DD;', rtl: true},
  ht: {code: 'ht', name: 'Haitian Creole', native: 'Krey&#242;l Ayisyen', hint: 'Tradui'},
  ko: {code: 'ko', name: 'Korean', native: '&#xD55C;&#xAD6D;&#50612;', hint: '&#xBC88;&#xC5ED;'},
  po: {code: 'po', name: 'Polish', native: 'język polski', hint: 'język polski'},
  ru: {code: 'ru', name: 'Russian', native: 'P&#x443;&#x441;&#x441;&#x43A;&#x438;&#x439;', hint: '&#x43F;&#x435;&#x440;&#x435;&#x432;&#x435;&#x441;&#x442;&#x438;'},
  es: {code: 'es', name: 'Spanish', native: 'Espa&#241;ol', hint: 'Traducir'},
  ur: {code: 'ur', name: 'Urdu', native: '&#x648;&#x62F;&#x631;&#x627;', hint: '&#x6BA;&#x6CC;&#x631;&#x6A9;&#x6C1;&#x645;&#x62C;&#x631;&#x62A;', rtl: true}
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
    'msg-clr': 'Clear'
  },
  ar: {
    'msg-filters': 'المرشحات',
    'msg-map': 'الخارطة',
    'msg-facilities': 'مرافق',
    'msg-dir': 'الاتجاهات',
    'msg-dir-map': 'خريطة الطريق',
    'msg-dtl': 'التفاصيل',
    'msg-web': 'موقع الكتروني',
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
    'msg-transit': 'الحصول على اتجاهات النقل العام',
    'msg-bike': 'الحصول على اتجاهات ركوب الدراجات',
    'msg-car': 'احصل على اتجاهات القيادة',
    'msg-walk': 'احصل على اتجاهات المشي',
    'msg-mta': 'احصل على اتجاهات النقل العام التي يمكن الوصول إليها من MTA',
    'msg-sr-map': 'حدد هذا المرفق على الخريطة',
    'msg-prv': 'السابق',
    'msg-nxt': 'التالى',
    'msg-clr': 'واضح'
  },
  bn: {
    'msg-filters': 'ফিল্টার',
    'msg-map': 'মানচিত্র',
    'msg-facilities': 'সুবিধা-সুযোগ',
    'msg-dir': 'পথনির্দেশনা',
    'msg-dir-map': 'রাস্তার মানচিত্র',
    'msg-dtl': 'বিস্তারিত',
    'msg-web': 'ওয়েবসাইট',
    'msg-email': 'ইমেইল',
    'msg-srch': 'একটি ঠিকানা অনুসন্ধান করুন ...',
    'msg-back-to-finder': 'ফাইন্ডার-এ ফিরে যান',
    'msg-dir-from': 'আমার অবস্থান থেকে: ',
    'msg-dir-input': 'একটি ঠিকানা লিখুন...',
    'msg-dir-to': 'থেকে: ',
    'msg-z-in': 'জুম-ইন',
    'msg-z-out': 'জুম-আউট',
    'msg-geo': 'বর্তমান অবস্থান',
    'msg-shr': 'শেয়ার',
    'msg-translate': 'অনুবাদ',
    'msg-transit': 'ট্রানজিট দিকনির্দেশ পান',
    'msg-bike': 'সাইক্লিংয়ের দিকনির্দেশ পান',
    'msg-car': 'গাড়ি চালনার দিকনির্দেশ পান',
    'msg-walk': 'চলার দিকনির্দেশ পান',
    'msg-mta': 'এমটিএ থেকে অ্যাক্সেসযোগ্য ট্রানজিট দিকনির্দেশ পান',
    'msg-sr-map': 'মানচিত্রে এই সুবিধাটি সনাক্ত করুন',
    'msg-prv': 'আগে',
    'msg-nxt': 'পরবর্তী',
    'msg-clr': 'পরিষ্কার'
  },
  zh: {
    'msg-filters': '篩選',
    'msg-map': '地圖',
    'msg-facilities': '设备',
    'msg-dir': '交通資訊',
    'msg-dir-map': '路线地图',
    'msg-dtl': '詳細說明',
    'msg-web': '网站',
    'msg-email': '电子邮件',
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
    'msg-transit': '获取公交路线',
    'msg-bike': '获取骑车路线',
    'msg-car': '获取行车路线',
    'msg-walk': '获取步行路线',
    'msg-mta': '从MTA获取可访问的公交路线',
    'msg-sr-map': '在地图上找到该设施',
    'msg-prv': '以前',
    'msg-nxt': '下一个',
    'msg-clr': '明确'
  },
  fr: {
    'msg-filters': 'Filtres',
    'msg-map': 'Plan',
    'msg-facilities': 'Installations',
    'msg-dir': 'Itinéraires',
    'msg-dir-map': 'Le plan de route',
    'msg-dtl': 'Détails',
    'msg-web': 'Site Internet',
    'msg-email': 'Email',
    'msg-srch': 'Rechercher une adresse ...',
    'msg-back-to-finder': 'Retour à la recherche',
    'msg-dir-from': 'Mon point de départ: ',
    'msg-dir-input': 'Entrer une adresse..',
    'msg-dir-to': 'De: ',
    'msg-z-in': 'Zoomer',
    'msg-z-out': 'Dézoomer',
    'msg-geo': 'Lieu actuel',
    'msg-shr': 'Partager',
    'msg-translate': 'Traduction',
    'msg-transit': 'Obtenir les itinéraires de transport en commun',
    'msg-bike': 'Obtenez des itinéraires à vélo',
    'msg-car': 'Obtenir des itinéraires routiers',
    'msg-walk': 'Obtenir des itinéraires à pied',
    'msg-mta': 'Obtenez des itinéraires de transport en commun accessibles depuis le MTA',
    'msg-sr-map': 'Localiser cette installation sur la carte',
    'msg-prv': 'Précédent',
    'msg-nxt': 'Prochain',
    'msg-clr': 'Clair'
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
    'msg-clr': 'ברור'
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
    'msg-clr': 'Klè'
  },
  ko: {
    'msg-filters': '필터',
    'msg-map': '지도',
    'msg-facilities': '시설',
    'msg-dir': '길 찾기',
    'msg-dir-map': '노선지도',
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
    'msg-sr-map': '지도에서이 시설을 찾으십시오',
    'msg-prv': '이전',
    'msg-nxt': '다음',
    'msg-clr': '명확한'
  },
  po: {
    'msg-filters': 'Filtry',
    'msg-map': 'Mapa',
    'msg-facilities': 'Budynków',
    'msg-dir': 'Jak dojechać',
    'msg-dir-map': 'Mapa trasy',
    'msg-dtl': 'Szczegóły',
    'msg-web': 'Stronie internetowej',
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
    'msg-car': 'Uzyskaj wskazówki dojazdu',
    'msg-walk': 'Uzyskaj wskazówki piesze',
    'msg-mta': 'Uzyskaj dostępne wskazówki dojazdu tranzytem z MTA',
    'msg-sr-map': 'Znajdź ten obiekt na mapie',
    'msg-prv': 'Poprzedni',
    'msg-nxt': 'w następnym tygodniu',
    'msg-clr': 'oczyścić'
  },
  ru: {
    'msg-filters': 'Фильтры',
    'msg-map': 'Карта',
    'msg-facilities': 'оборудование',
    'msg-dir': 'Инструкции',
    'msg-dir-map': 'Карта маршрута',
    'msg-dtl': 'Подробности',
    'msg-web': 'Веб-сайт',
    'msg-email': 'Электронное письмо',
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
    'msg-clr': 'Очистить'
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
    'msg-bike': 'Obtén indicaciones en bicicleta',
    'msg-car': 'Obtener direcciones de conducción',
    'msg-walk': 'Obtenga indicaciones para caminar',
    'msg-mta': 'Obtenga indicaciones de tránsito accesibles de la MTA',
    'msg-sr-map': 'Ubique esta instalación en el mapa',
    'msg-prv': 'Previo',
    'msg-nxt': 'Siguiente',
    'msg-clr': 'Claro'
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
    'msg-back-to-finder': 'میری لوکیشن سے',
    'msg-dir-from': 'فائنڈر پر واپسی: ',
    'msg-dir-input': 'ٹرپ پلاننر...',
    'msg-dir-to': 'کیلئے: ',
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
    'msg-nxt': 'اگلے',
    'msg-clr': 'صاف'
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
  '<div class="btn-sq rad-all"><span class ="hint notranslate">Translate</span></div>' +
  '<select data-msg-key="msg-translate" data-msg-attr="title" title="Translate"></select>' +
  '<div id="lng-goog"></div>' +
'</div>'

export default Translate
