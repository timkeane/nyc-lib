/**
 * @module nyc/ol/FinderApp
 */

import $ from 'jquery'
import nyc from 'nyc'
import MapMgr from 'nyc/ol/MapMgr'
import Dialog from 'nyc/Dialog'
import Share from 'nyc/Share'
import Tabs from 'nyc/Tabs'
import Directions from 'nyc/Directions'
import Translate from 'nyc/lang/Translate'
import Goog from 'nyc/lang/Goog'
import Filters from 'nyc/ol/Filters'
import FilterAndSort from 'nyc/ol/source/FilterAndSort'

/**
 * @desc A class that provides a template for creating basic finder apps
 * @public
 * @class
 */
class FinderApp extends MapMgr {
  /**
   * @desc Create an instance of FinderApp
   * @public
   * @constructor
   * @param {module:nyc/ol/FinderApp~FinderApp.Options} options Constructor options
   */
  constructor(options) {
    $('body').append(FinderApp.HTML).addClass('fnd')
    options.listTarget = '#facilities div'
    options.mapTarget = '#map'
    options.dialogTarget = 'body'
    options.mouseWheelZoom = options.mouseWheelZoom === undefined ? true : options.mouseWheelZoom
    super(options)
    global.finderApp = this
    this.pager.find('h2.info').addClass('screen-reader-only')
    const title = $('<span></span>').html(options.title)
    nyc.noSpaceBarScroll()
    $('#banner').html(title)
    $('#home').attr('title', title.text())
    $('.fnd #home').on('click', () => document.location.reload())
    /**
     * @desc The filters for filtering the facilities
     * @public
     * @member {module:nyc/ol/Filters~Filters}
     */
    this.filters = this.createFilters(options.filterChoiceOptions)
    /**
     * @desc The tabs containing the map, facilities and filters
     * @public
     * @member {module:nyc/Tabs~Tabs}
     */
    this.tabs = this.createTabs(options)
    $('#map').attr('tabindex', -1)
    this.adjustTabs()
    this.showSplash(options.splashOptions)
    new Share({target: '#map'})
    /**
     * @private
     * @member {module:nyc/lang/Goog~Goog}
     */
    this.translate = this.translateBtn(options)
    /**
     * @private
     * @member {module:nyc/Directions~Directions}
     */
    this.directions = null
    /**
     * @private
     * @member {string}
     */
    this.directionsUrl = options.directionsUrl
    /**
     * @private
     * @member {google.maps.TravelMode}
     */
    this.defaultDirectionsMode = options.defaultDirectionsMode
    /**
     * @private
     * @member {module:nyc/Dialog~Dialog}
     */
    this.mobileDia = new Dialog({css: 'shw-lst'})
    /**
     * @private
     * @member {module:nyc/Dialog~Dialog}
     */
    this.screenReaderDialog = new Dialog({css: 'screen-reader-info'})
    $('#screen-reader-info').on('click', $.proxy(this.screenReaderInfo, this))
    $('.shw-lst .btn-yes span').html(`View nearby ${$('#tab-btn-1').html()} in an accessible list`)
    this.setRefresh(options.refresh)
    $(window).on('load resize', $.proxy(this.adjustBanner, this))
    this.translate.on('change', this.adjustBanner, this)
  }
  /**
   * @desc Scale font size responsively
   * @public
   * @method
   */
  adjustBanner() {
    setTimeout(() => {
      const bannerText = $('h1#banner>span, h1#banner>span *')
      const banner = $('h1#banner')
      const screenReaderBtn = $('a#screen-reader-info')
      const backToMapBtn = $('button#back-to-map')
      const logoWidth = parseInt(banner.css('padding-left') || 0)
      let offsetButton = backToMapBtn

      if (!document.contains($('#directions')[0]) || $('#directions').css('display') === 'none') {
        offsetButton = screenReaderBtn
      }

      bannerText.css('font-size', '24px')
      banner.css('padding-right', '0')
      // calculate container width that text lies in (exclude NYC logo + screenReader/backToMap button)

      if (bannerText.width() >= (banner.innerWidth() - logoWidth - offsetButton.innerWidth())) {
        bannerText.css('font-size', '16px')
        banner.css('padding-right', `${offsetButton.innerWidth()}px`)
      }

    }, 1200)
  }
  /**
   * @private
   * @method
   * @param {module:nyc/ol/FinderApp~FinderApp.RefreshOptions} refresh Refresh options
   */
  setRefresh(refresh) {
    if (refresh) {
      const me = this
      setInterval(() => {
        const url = me.source.getUrl().split('?')[0]
        const source = new FilterAndSort({
          url: `${url}?${nyc.cacheBust(.33)}`,
          format: me.source.getFormat()
        })
        source.autoLoad().then(() => {
          me.source = source
          me.filters.source = source
          me.filters.filter()
          me.layer.setSource(source)
          me.resetList()
          if (refresh.callback) {
            refresh.callback()
          }
        })
      }, refresh.minutes * 60 * 1000)
    }
  }
  /**
   * @desc Create the translate button
   * @public
   * @method
   * @param {module:nyc/ol/FinderApp~FinderApp.Options} options Constructor options
   * @return {nyc.lang.Goog~Goog} Goog instance
   */
  translateBtn(options) {
    const languages = options.languages || Translate.DEFAULT_LANGUAGES
    if (options.splashOptions) {
      const translate = new Goog({
        target: '.fnd .splash .dia-btns',
        languages
      })
      $('.splash .dia-btns').append($('.splash .btn-no'))
      return translate
    }
    return new Goog({
      target: 'body',
      languages,
      button: true
    })
  }
  /**
   * @desc Reset the facilities list
   * @public
   * @method
   * @param {Object} event Event object
   */
  resetList(event) {
    super.resetList(event)
    if (event instanceof Filters) {
      $('#tabs .btns .btn-2').addClass('filtered')
    }
  }
  /**
   * @public
   * @override
   * @method
   * @param {module:nyc/ol/FinderApp~FinderApp.Options} options Constructor options
   * @return {ol.format.Feature} The parent format
   */
  createParentFormat(options) {
    return options.facilityFormat.parentFormat || options.facilityFormat
  }
  /**
   * @public
   * @override
   * @method
   * @param {module:nyc/ol/FinderApp~FinderApp.Options} options Constructor options
   * @param {ol.format.Feature} format The OpenLayers feature format
   * @return {Array<Object<string, fuction>>} Decorations
   */
  createDecorations(options) {
    const format = options.facilityFormat
    let decorations = [MapMgr.FEATURE_DECORATIONS, {app: this}]
    if (format.parentFormat && format.parentFormat.decorations) {
      decorations = decorations.concat(format.parentFormat.decorations)
    }
    if (format.decorations) {
      decorations = decorations.concat(format.decorations)
    }
    if (options.decorations) {
      decorations = decorations.concat(options.decorations)
    }
    return decorations
  }
  /**
   * @desc Centers and zooms to the provided feature
   * @public
   * @method
   * @param {ol.Feature} feature OpenLayers feature
   */
  zoomTo(feature) {
    if ($('#tabs .btns h2:first-of-type').css('display') !== 'none') {
      this.tabs.open('#map')
    }
    super.zoomTo(feature)
  }
  /**
   * @desc Handles geocoded and geolocated events
   * @access protected
   * @method
   * @param {module:nyc/Locator~Locator.Result} location Location
   */
  located(location) {
    super.located(location)
    this.focusFacilities()
  }
  /**
   * @desc Provides directions to the provided facility feature
   * @public
   * @override
   * @method
   * @param {ol.Feature} feature OpenLayers feature
   * @param {JQuery} returnFocus The DOM element that should receive focus when leaving the directions view
   */
  directionsTo(feature, returnFocus) {
    if (!this.directions) {
      this.directions = new Directions({
        url: this.directionsUrl,
        toggle: '#tabs',
        mode: this.defaultDirectionsMode
      })
      $('button#back-to-map').on('click', $.proxy(this.adjustBanner, this))
    }
    const to = feature.getFullAddress()
    const name = feature.getName()
    const from = this.getFromAddr()
    this.directions.directions({
      from: from,
      to: to,
      facility: name,
      origin: this.location,
      destination: {
        name: feature.getName(),
        coordinate: feature.getGeometry().getCoordinates()
      },
      returnFocus: returnFocus
    })
    this.adjustBanner()
  }
  /**
   * @desc Creates the filters for the facility features
   * @access protected
   * @method
   * @param {Array<module:nyc/ol/Filters~Filters.ChoiceOptions>=} choiceOptions Choice options
   * @return {module:nyc/ol/Filters~Filters} Filters
   */
  createFilters(choiceOptions) {
    if (choiceOptions) {
      const me = this
      $('#filters').empty()
      const apply = $('<button class="apply">Apply</button>')
      const filters = new Filters({
        target: '#filters',
        source: me.source,
        choiceOptions: choiceOptions
      })
      filters.on('change', me.resetList, me)
      $('#filters').append(apply)
      apply.on('click tap keypress', () => {
        me.focusFacilities(true)
      })
      return filters
    }
  }
  /**
   * @desc Creates the tabs for the map, facilities and filters
   * @access protected
   * @method
   * @param {module:nyc/ol/FinderApp~FinderApp.Options} options Options
   * @return {module:nyc/Tabs~Tabs} Tabs
   */
  createTabs(options) {
    const pages = [
      {tab: '#map', title: '<span class="msg-map">Map</span>'},
      {tab: '#facilities', title: options.facilityTabTitle || '<span class="msg-facilities">Facilities</span>'}
    ]
    if (options.splashOptions) {
      $('#tabs').attr('aria-hidden', true)
    } else {
      $('#screen-reader-info').attr('role', 'alert')
    }
    if (this.filters) {
      pages.push({tab: '#filters', title: options.filterTabTitle || '<span class="msg-filters">Filters</span>'})
    }
    const tabs = new Tabs({target: '#tabs', tabs: pages})
    tabs.on('change', this.tabChange, this)
    $(window).resize($.proxy(this.adjustTabs, this))
    return tabs
  }
  /**
   * @private
   * @method
   * @returns {boolean} The display state
   */
  isMobile() {
    return $('#tabs .btns>h2:first-of-type').css('display') !== 'none'
  }
  /**
   * @private
   * @method
   * @param {string} id The tab id
   * @returns {boolean} The display state
   */
  isTab(id) {
    return this.tabs.active.get(0).id === id
  }
  /**
   * @private
   * @method
   * @returns {module:nyc/Dialog~Dialog.ShowOptions} Dialog options
   */
  mobileDiaOpts() {
    const location = this.location
    const locationName = location.name
    const feature = this.source.sort(location.coordinate)[0]
    const options = {
      buttonText: [
        `<span class="msg-vw-list">View ${$('#tab-btn-1').text()} list</span>`,
        '<span class="msg-vw-map">View the map</span>'
      ]
    }
    if (feature.getName() !== locationName) {
      options.message = `<strong>${feature.getName()}</strong><br>` +
        '<span class="msg-closest">is closest to your location</span><br>'
      if (location.type != 'geolocated') {
        options.message += `<strong>${locationName}</strong>`
      }
    } else {
      options.message = `<strong>${locationName}</strong>`
    }
    return options
  }
  /**
   * @private
   * @method
   * @param {boolean} applyBtn The filter apply button was pressed by a screen reader user
   */
  focusFacilities(applyBtn) {
    const tabs = this.tabs
    const dia = this.mobileDia
    if (!applyBtn && this.isMobile() && this.isTab('map')) {
      if ($('.shw-lst').css('display') === 'none') {
        const options = this.mobileDiaOpts()
        setTimeout(() => {
          dia.yesNo(options).then(showFacilities => {
            if (showFacilities) {
              tabs.open('#facilities')
            }
          })
        }, 250)
      }
    } else {
      tabs.open('#facilities')
    }
  }
  /**
   * @private
   * @method
   * @param {module:nyc/Dialog~Dialog.Options} options Dialog options
   */
  showSplash(options) {
    const input = this.locationMgr.search.input
    if (options) {
      options.buttonText = options.buttonText ||
        [
          '<span class="msg-sr-info">Screen reader instructions</span>',
          '<span class="msg-continue">Continue</span>'
        ]
      new Dialog({css: 'splash'}).yesNo(options).then(info => {
        if (info) {
          this.screenReaderInfo()
        } else {
          $('#tabs').attr('aria-hidden', false)
          this.translate.showButton('#map')
          input.focus()
        }
      })
    } else {
      input.focus()
    }
  }
  screenReaderInfo() {
    const input = this.locationMgr.search.input
    this.screenReaderDialog.find('.btn-ok').one('focus', () => {
      $('.screen-reader-info h1').focus()
    })
    this.screenReaderDialog.ok({
      message: FinderApp.SCREEN_READER_INFO,
      buttonText: ['Return to the map']
    }).then(() => {
      $('#tabs').attr('aria-hidden', false)
      this.translate.showButton('#map')
      input.focus()
    })
    $('.screen-reader-info .dia').get(0).scrollTop = 0
  }
  /**
   * @private
   * @method
   */
  adjustTabs() {
    /*
     * when input gets focus screen resizes on android
     * causing input to lose focus when tabs are adjusted
     * so we don't adjust tabs when input has focus
     */
    if ($('#directions').css('display') !== 'block' && !nyc.activeElement().isTextInput) {
      if (this.isMobile()) {
        if ($('#facilities').css('display') === 'block') {
          this.tabs.open('#facilities')
        } else {
          this.tabs.open('#map')
        }
      }
      this.moveSearch(this.tabs)
    }
    if (!this.isMobile() && !nyc.activeElement().isTextInput) {
      this.tabs.open('#facilities')
    }
    this.map.setSize([$('#map').width(), $('#map').height()])
  }
  /**
   * @desc Handles the tab change event
   * @access protected
   * @method
   * @param {module:nyc/Tabs~Tabs} tabs Tabs
   */
  tabChange(tabs) {
    if (this.isMobile()) {
      this.moveSearch(this.tabs)
    } else {
      $('#map').attr('aria-hidden', false)
    }
    this.map.setSize([$('#map').width(), $('#map').height()])
  }
  /**
   * @private
   * @method
   * @param {module:nyc/Tabs~Tabs} tabs Tabs
   */
  moveSearch(tabs) {
    const map = this.map
    const container = tabs.getContainer()
    const search = $('.srch-ctl')
    if (this.isTab('facilities') && this.isMobile()) {
      container.prepend(search.addClass('lst-srch'))
      container.prepend(tabs.find('.btns').get(0))
    } else {
      $(map.getTargetElement()).find('.ol-overlaycontainer-stopevent').append($('.srch-ctl').removeClass('lst-srch'))
    }
  }

}

/**
 * @desc Constructor options for {@link module:nyc/ol/FinderApp~FinderApp}
 * @public
 * @typedef {Object}
 * @property {string} title The app title
 * @property {module:nyc/Dialog~Dialog.Options} splashOptions Content to display as a splash page
 * @property {string} [facilityTabTitle=Facilities] Title for the facilites list
 * @property {string} facilityUrl The URL for the facility features data
 * @property {ol.format.Feature=} facilityFormat The format of the facilities data
 * @property {ol.style.Style} facilityStyle The styling for the facilities layer
 * @property {module:nyc/Search~Search.FeatureSearchOptions|boolean} [facilitySearch=false] Search options for feature searches or true to use default search options
 * @property {string} [filterTabTitle=Filters] Title for the filters tab
 * @property {Array<module:nyc/ol/Filters~Filters.ChoiceOptions>=} filterChoiceOptions Filter definitions
 * @property {string} geoclientUrl The URL for the Geoclient geocoder with approriate keys
 * @property {string} directionsUrl The URL for the Google directions API with approriate keys
 * @property {google.maps.TravelMode} defaultDirectionsMode The mode for Google directions
 * @property {boolean} [mouseWheelZoom=true] Allow mouse wheel map zooming
 * @property {module:nyc/ol/FinderApp~FinderApp.RefreshOptions=} refresh Options for periodically refreshing facility data
 */
FinderApp.Options

/**
 * @desc Constructor options for {@link module:nyc/ol/FinderApp~FinderApp}
 * @public
 * @typedef {Object}
 * @property {number} minutes Number of minutes for refresh interval
 * @property {function} callback Callback function for refresh
 */
FinderApp.RefreshOptions

/**
 * @private
 * @const
 * @type {string}
 */
FinderApp.HTML = `<h1 id="banner" role="banner"></h1>
<a id="screen-reader-info" class="btn-sq" href="#">
  <span class="screen-reader-only">screen reader instructions</span>
</a>
<a id="home" role="button" href="#">
  <span class="screen-reader-only">Reload page</span>
  <svg xmlns="http://www.w3.org/2000/svg" width="152" height="52">
    <g transform="translate(1.5,0)">
      <polygon points="15.5,1.2 3.1,1.2 0,4.3 0,47.7 3.1,50.8 15.5,50.8 18.6,47.7 18.6,35.3 34.1,50.8 46.6,50.8 49.7,47.7 49.7,4.3 46.6,1.2 34.1,1.2 31,4.3 31,16.7 "/>
      <polygon points="83.8,47.7 83.8,38.4 99.3,22.9 99.3,10.5 99.3,4.3 96.2,1.2 83.8,1.2 80.7,4.3 80.7,10.5 74.5,16.7 68.3,10.5 68.3,4.3 65.2,1.2 52.8,1.2 49.7,4.3 49.7,22.9 65.2,38.4 65.2,47.7 68.3,50.8 80.7,50.8 "/>
      <polygon points="145.9,29.1 130.4,29.1 130.4,32.2 118,32.2 118,19.8 130.4,19.8 130.4,22.9 145.9,22.9 149,19.8 149,10.5 139.7,1.2 108.6,1.2 99.3,10.5 99.3,41.5 108.6,50.8 139.7,50.8 149,41.5 149,32.2 "/>
    </g>
  </svg>
</a>
<div id="map"></div>
<div id="tabs"></div>
<div id="facilities"><div role="region"></div></div>
<div id="filters"></div>`

FinderApp.SCREEN_READER_INFO = `<h1 tabindex="0" aria-live="polite">Screen reader Instructions for NYC Finder Apps</h1>
<h2>Getting started</h2>
<p>
  This finder app uses the NYC DoITT nyc-lib javascript library which templates mapping 
  applications and provides accessibility functionality. Below are general screen reader 
  instructions on how to use all of the finder apps that use this template. 
  When the application first loads, there is a dialogue box with an introduction to each 
  specific finder app. Users can navigate to the continue or view map link and press 
  enter to proceed to the finder app. There is a "Reload" button that is always near 
  the top of the page that takes users back to this initial dialogue.    
</p>
<h2>Search for an address</h2>
<p>
  Users can enter an address to get a list of nearby locations. When the finder app loads, 
  screen reader and keyboard focus is dropped into a search field. Input an address then 
  press enter to submit. 
</p>
<p>
  If the address was entered correctly, the list of locations will 
  update, screen readers will announce the number of results and shift focus to the 
  beginning of the search results.
</p>
<p>
  If there are address suggestions, focus will shift to the first suggestion. Press tab 
  to cycle through suggestions and enter to select an address. Screen readers will announce
  the number of results and focus will shift to the beginning of the results area.
</p>
<h2>Navigating results</h2>
<p>
  Screen reader users can navigate by headings to browse through each result. For JAWS and 
  NVDA, press the "H" key. For Voiceover users, press Command, Option, Control and "H" or 
  just "H" with Quicknav and single letter navigation turned on. 
</p>
<p>
  Screen reader users can also use regions to navigate to different areas such as the banner,
  search form, and list of results. Jaws users can press the "R" key. NVDA users can press 
  the "D" key. Voiceover users can pull up a list of regions if it is included in their web
  rotor settings.    
</p>
<h2>Filtering results</h2>
<p>
  Users can filter results to get more specific results. Screen reader users can navigate by 
  headings to get to the "Filters" tab. It is towards the top of the page. JAWS and NVDA 
  users can press enter on the "Filters" tab in order to navigate to the filters page. 
  Voiceover users can press control, option and space bar.    
</p>
<p>
  On the filters page are checkboxes with different filtering options. JAWS and NVDA users 
  can press "X" to navigate through the various filter options and space bar to select 
  each one. Voiceover users can use control, option and the arrow keys to navigate then 
  control, option and space bar to select a filter.    
</p>
<p>
  Once a user has selected the filters they would like to apply, they can navigate to the 
  apply button. JAWS and NVDA users can press enter or spacebar to activate the "Apply" 
  button. Voiceover users can press control, option and space bar. The finder app will then 
  return to an updated list of results where screen reader users can navigate by heading 
  from one entry to another.    
</p>
<h2>Translate and share</h2>
<p>
  Below the search field are options to translate or share this page. JAWS and NVDA users 
  can use the tab key to navigate to them. Screen reader users can also navigate to them 
  using regions. JAWS users can press the “R” key to navigate to the translate or share 
  regions. NVDA users can use the “D” key to navigate to those regions. Voiceover users can 
  pull up a list of regions if it is included in their web rotor settings.    
</p>
<p>
  To translate, navigate to the translate combobox. JAWS and NVDA users can press enter to 
  open the combobox and the arrow keys to navigate through the options. Voiceover users 
  can open the combobox by pressing control, option and space bar then the arrow keys to 
  navigate through the options. All users can then press enter or return to make a selection.    
</p>
<p>
  To share this page, navigate to the share button or region. JAWS and NVDA users can press 
  enter on the “Share” toggle button to expand the share options. Voiceover users can press 
  control, option and space bar. All users can then use tab or the arrow keys to navigate 
  through the different share options and press enter or return to make a selection.     
</p>
<h2>Travel directions</h2>
<p>
  When browsing through each result, users can press enter on the "Directions" button in 
  order to get travel directions.     
</p>
<p>
  The screen that follows has Google maps directions for transit, walking, driving and ride 
  services. There is also an option for MTA Trip Planner which can give wheelchair accessible 
  directions. Please note that if a user chooses MTA Trip Planner, they will be taken to an 
  external website.    
</p>
<h2>Contact support</h2>
<p>To submit feedback about your experience or request assistance please <a href="https://www1.nyc.gov/nyc-resources/contact-the-citys-digital-accessibility-coordinator.page">contact the 
  Digital Accessibility Coordinator</a> at the Mayor's Office for People with Disabilities.
</p>`

export default FinderApp
