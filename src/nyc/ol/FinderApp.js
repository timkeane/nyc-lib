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
    const title = $('<div></div>').html(options.title)
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
    this.goo = new Goog({
      target: '#map',
      languages: options.languages || Translate.DEFAULT_LANGUAGES,
      button: true
    })
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
    $('.shw-lst .btn-yes span').html(`View nearby ${$('#tab-btn-1').html()} in an accessible list`)
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
    super.zoomTo(feature)
    if ($('#tabs .btns h2:first-of-type').css('display') !== 'none') {
      this.tabs.open('#map')
    }
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
    this.directions = this.directions || new Directions({
      url: this.directionsUrl,
      toggle: '#tabs',
      mode: this.defaultDirectionsMode
    })
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
      {tab: '#map', title: 'Map'},
      {tab: '#facilities', title: options.facilityTabTitle || 'Facilities'}
    ]
    if (options.splashOptions) {
      $('#tabs').attr('aria-hidden', true)
    }
    if (this.filters) {
      pages.push({tab: '#filters', title: options.filterTabTitle || 'Filters'})
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
    const distance = feature.distanceHtml(true).html()
    const options = {
      buttonText: [
        `View ${$('#tab-btn-1').html()} list<span class="screen-reader-only"></span>`,
        'View the map'
      ]
    }
    if (feature.getName() !== locationName) {
      options.message = `<strong>${feature.getName()}</strong><br>
        is located ${distance} from your location<br>
        <strong>${locationName}</strong>`
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
      options.buttonText = options.buttonText || ['Continue']
      new Dialog({css: 'splash'}).ok(options).then(() => {
        $('#tabs').attr('aria-hidden', false)
        input.focus()
      })
    } else {
      input.focus()
    }
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
      } else {
        $('#map').attr('aria-hidden', false)
        this.tabs.open('#facilities')
      }
      this.moveSearch(this.tabs)
    }
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
      $('#map').attr('aria-hidden', false)
    }
    this.map.setSize([$('#map').width(), $('#map').height()])
  }

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
 */
FinderApp.Options

/**
 * @private
 * @const
 * @type {string}
 */
FinderApp.HTML = '<h1 id="banner" role="banner"></h1>' +
'<a id="home" role="button" href="#">' +
  '<span class="screen-reader-only">Reload page</span>' +
  '<svg xmlns="http://www.w3.org/2000/svg" width="152" height="52">' +
    '<g transform="translate(1.5,0)">' +
      '<polygon points="15.5,1.2 3.1,1.2 0,4.3 0,47.7 3.1,50.8 15.5,50.8 18.6,47.7 18.6,35.3 34.1,50.8 46.6,50.8 49.7,47.7 49.7,4.3 46.6,1.2 34.1,1.2 31,4.3 31,16.7 "/>' +
      '<polygon points="83.8,47.7 83.8,38.4 99.3,22.9 99.3,10.5 99.3,4.3 96.2,1.2 83.8,1.2 80.7,4.3 80.7,10.5 74.5,16.7 68.3,10.5 68.3,4.3 65.2,1.2 52.8,1.2 49.7,4.3 49.7,22.9 65.2,38.4 65.2,47.7 68.3,50.8 80.7,50.8 "/>' +
      '<polygon points="145.9,29.1 130.4,29.1 130.4,32.2 118,32.2 118,19.8 130.4,19.8 130.4,22.9 145.9,22.9 149,19.8 149,10.5 139.7,1.2 108.6,1.2 99.3,10.5 99.3,41.5 108.6,50.8 139.7,50.8 149,41.5 149,32.2 "/>' +
    '</g>' +
  '</svg>' +
'</a>' +
'<div id="map"></div>' +
'<div id="tabs"></div>' +
'<div id="facilities"><div role="region"></div></div>' +
'<div id="filters"></div>'

export default FinderApp
