/**
 * @module nyc/ol/FinderApp
 */

import $ from 'jquery'

import nyc from 'nyc'
import Collapsible from 'nyc/Collapsible'
import Dialog from 'nyc/Dialog'
import Share from 'nyc/Share'
import Tabs from 'nyc/Tabs'
import ListPager from 'nyc/ListPager'
import MapLocator from 'nyc/MapLocator'
import Directions from 'nyc/Directions'

import Translate from 'nyc/lang/Translate'
import Goog from 'nyc/lang/Goog'

import Basemap from 'nyc/ol/Basemap'
import Filters from 'nyc/ol/Filters'
import LocationMgr from 'nyc/ol/LocationMgr'
import MultiFeaturePopup from 'nyc/ol/MultiFeaturePopup'
import FeatureTip from 'nyc/ol/FeatureTip'

import Decorate from 'nyc/ol/format/Decorate'

import FilterAndSort from 'nyc/ol/source/FilterAndSort'

import OlLayerVector from 'ol/layer/Vector'

import {register as olProjRegister} from 'ol/proj/proj4'

const proj4 = nyc.proj4
olProjRegister(proj4)

/**
 * @desc A class that provides a template for creating basic finder apps
 * @public
 * @class
 */
class FinderApp {
  /**
   * @desc Create an instance of FinderApp
   * @public
   * @constructor
   * @param {module:nyc/ol/FinderApp~FinderApp.Options} options Constructor options
   */
  constructor(options) {
    global.finderApp = this
    nyc.noSpaceBarScroll()
    $('body').append(FinderApp.HTML).addClass('fnd')
    $('#banner').html(options.title)
    $('#home').attr('title', options.title)
    /**
     * @private
     * @member {module:nyc/ListPager~ListPager}
     */
    this.pager = new ListPager({
      target: '#facilities div',
      itemType: options.facilityTabTitle
    })
    /**
     * @private
     * @member {module:nyc/ZoomSearch~ZoomSearch.FeatureSearchOptions}
     */
    this.facilitySearch = options.facilitySearch
    /**
     * @desc The map
     * @public
     * @member {ol.Map}
     */
    this.map = new Basemap({target: 'map'})
    /**
     * @desc The vector data source for facilities
     * @public
     * @member {module:nyc/ol/source/FilterAndSort~FilterAndSort}
     */
    this.source = new FilterAndSort({
      url: options.facilityUrl,
      format: new Decorate({
        parentFormat: this.parentFomat(options.facilityFormat),
        decorations: this.decorations(options, options.facilityFormat)
      })
    })
    this.source.autoLoad().then($.proxy(this.ready, this))
    /**
     * @desc The vector layer for facilities
     * @public
     * @member {ol.layer.Vector}
     */
    this.layer = new OlLayerVector({
      source: this.source,
      style: options.facilityStyle
    })
    this.map.addLayer(this.layer)
    /**
     * @desc The popup
     * @public
     * @member {module:nyc/ol/MultiFeaturePopup~MultiFeaturePopup}
     */
    this.popup = new MultiFeaturePopup({
      map: this.map,
      layers: [this.layer]
    })
    /**
     * @desc The view
     * @public
     * @member {ol.View}
     */
    this.view = this.map.getView()
    /**
     * @desc The location manager
     * @public
     * @member {module:nyc/ol/LocationMgr~LocationMgr}
     */
    this.locationMgr = new LocationMgr({
      map: this.map,
      url: options.geoclientUrl
    })
    this.locationMgr.on('geocoded', this.located, this)
    this.locationMgr.on('geolocated', this.located, this)
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
    this.view.fit(Basemap.EXTENT, {
      size: this.map.getSize(),
      duration: 500
    })
    /**
     * @private
     * @member {module:nyc/Locator~Locator.Result}
     */
    this.location = {}
    new FeatureTip({
      map: this.map,
      tips: [{
        layer: this.layer,
        label: (feature) => {
          return {html: feature.getName()}
        }
      }]
    })
    this.showSplash(options.splashOptions)
    new Share({target: '#map'})
    new Goog({
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
  }
  /**
   * @desc Reset the facilities list
   * @public
   * @method
   * @param {Object} event Event object
   */
  resetList(event) {
    if (event instanceof Filters) {
      $('#tabs .btns .btn-2').addClass('filtered')
    }
    const coordinate = this.location.coordinate
    this.popup.hide()
    this.pager.reset(
      coordinate ? this.source.sort(coordinate) : this.source.getFeatures()
    )
  }
  /**
   * @desc Centers and zooms to the provided feature
   * @public
   * @method
   * @param {ol.Feature} feature OpenLayers feature
   */
  zoomTo(feature) {
    const popup = this.popup
    popup.hide()
    if ($('#tabs .btns h2:first-of-type').css('display') !== 'none') {
      this.tabs.open('#map')
    }
    this.map.once('moveend', () => {
      popup.showFeature(feature)
    })
    this.view.animate({
      center: feature.getGeometry().getCoordinates(),
      zoom: MapLocator.ZOOM_LEVEL
    })
  }
  /**
   * @desc Provides directions to the provided facility feature
   * @public
   * @method
   * @param {ol.Feature} feature OpenLayers feature
   */
  directionsTo(feature) {
    this.directions = this.directions || new Directions({
      url: this.directionsUrl,
      toggle: '#tabs'
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
      }
    })
  }
  /**
   * @desc Handles geocoded and geolocated events
   * @access protected
   * @method
   * @param {module:nyc/Locator~Locator.Result} location Location
   */
  located(location) {
    this.location = location
    this.resetList()
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
      $('#filters').empty()
      const apply = $('<button class="screen-reader-only">Apply</button>')
      const filters = new Filters({
        target: '#filters',
        source: this.source,
        choiceOptions: choiceOptions
      })
      filters.on('change', this.resetList, this)
      $('#filters').append(apply)
      apply.click($.proxy(this.focusFacilities, this))
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
   * @desc Handles the event triggered when a rendered feature's collapsible details is expanded
   * @access protected
   * @method
   * @param {Object} event Event object
   */
  expandDetail(event) {
    this.popup.pan()
  }
  /**
   * @desc Convert current user location into usable form for Google directions API
   * @private
   * @method
   * @return {string|Array<number>} Location coordinates or name
   */
  getFromAddr() {
    const location = this.location
    if (location.type === 'geolocated') {
      const coordinates = proj4(
        this.view.getProjection().getCode(),
        'EPSG:4326',
        location.coordinate
      )
      return `${coordinates[1]},${coordinates[0]}`
    }
    return location.name || ''
  }
  /**
   * @private
   * @method
   */
  focusFacilities() {
    this.tabs.open('#facilities')
  }
  /**
   * @private
   * @method
   * @param {module:nyc/Dialog~Dialog.Options} options Dialog options
   */
  showSplash(options) {
    const input = this.locationMgr.zoomSearch.input
    if (options) {
      options.buttonText = options.buttonText || ['Continue']
      new Dialog('splash').ok(options).then(() => {
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
   * @return {boolean} True if the tabs fill the screen
   */
  tabsFillScreen() {
    return Math.abs(this.tabs.getContainer().width() - $(window).width()) < 1
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
      this.tabs.open(this.tabsFillScreen() ? '#map' : '#facilities')
    }
  }
  /**
   * @desc Handles the tab change event
   * @access protected
   * @method
   * @param {module:nyc/Tabs~Tabs} tabs Tabs
   */
  tabChange(tabs) {
    if (!this.tabsFillScreen()) {
      $('#map').attr('aria-hidden', false)
    }
    this.map.setSize([$('#map').width(), $('#map').height()])
  }
  /**
   * @private
   * @method
   * @param {ol.format.Feature} format Feature format
   * @return {ol.format.Feature} The parent format
   */
  parentFomat(format) {
    return format.parentFomat || format
  }
  /**
   * @private
   * @method
   * @param {FinderApp.Options} options Options
   * @param {ol.format.Feature} format The OpenLayers feature format
   * @return {Array<Object<string, fuction>>} Decorations
   */
  decorations(options, format) {
    let decorations = [FinderApp.FEATURE_DECORATIONS, {finderApp: this}]
    if (format.parentFomat && format.parentFomat.decorations) {
      decorations = decorations.concat(format.parentFomat.decorations)
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
   * @desc Handles features after they are loaded
   * @access protected
   * @method
   * @param {Array<ol.Feature>} features The facility features
   */
  ready(features) {
    features = features || []
    if (this.facilitySearch) {
      const options = typeof this.facilitySearch === 'object' ? this.facilitySearch : {}
      options.features = features
      this.locationMgr.zoomSearch.setFeatures(options)
    }
    this.pager.reset(features)
    nyc.ready($('body'))
  }
}

/**
 * @desc Handles map and direction button click
 * @public
 * @static
 * @function
 * @param {jQuery.Event} event Event object
 */
FinderApp.handleButton = (event) => {
  const target = $(event.currentTarget)
  const feature = target.data('feature')
  if (target.hasClass('map')) {
    global.finderApp.zoomTo(feature)
  } else {
    global.finderApp.directionsTo(feature)
  }
}

/**
 * @desc Default facility feature decorations
 * @public
 * @const
 * @mixin
 * @type {Object<string, fuction>}
 */
FinderApp.FEATURE_DECORATIONS = {
  /**
   * @desc Returns a facility feature rendered as a jQuery
   * @public
   * @method
   * @return {jQuery} The rendered feature
   */
  html() {
    return $('<div class="facility"></div>')
      .addClass(this.cssClass())
      .append(this.distanceHtml())
      .append(this.nameHtml())
      .append(this.distanceHtml(true))
      .append(this.addressHtml())
      .append(this.phoneButton())
      .append(this.emailButton())
      .append(this.websiteButton())
      .append(this.mapButton())
      .append(this.directionsButton())
      .append(this.detailsCollapsible())
  },
  /**
   * @desc Returns the name of a facility feature
   * @public
   * @method
   */
  getName() {
    throw 'A getName decoration must be provided'
  },
  /**
   * @desc Returns a CSS class for the rendered facility feature
   * @public
   * @method
   */
  cssClass() {},
  /**
   * @desc Returns the address line 1 of a facility feature
   * @public
   * @method
   */
  getAddress1() {
    throw 'A getAddress1 decoration must be provided to use default html method and directions'
  },
  /**
   * @desc Returns the address line 2 of a facility feature
   * @public
   * @method
   * @return {string} The address line 2
   */
  getAddress2() {
    return ''
  },
  /**
   * @desc Returns the city, state zip line of a facility feature
   * @public
   * @method
   */
  getCityStateZip() {
    throw 'A getCityStateZip decoration must be provided to use default html method and directions'
  },
  /**
   * @desc Returns full address for use with Google directions API
   * @public
   * @method
   * @return {string} The full address
   */
  getFullAddress() {
    return `${this.getAddress1()}\n${this.getAddress2()},\n${this.getCityStateZip()}`
  },
  /**
   * @desc Returns the phone number for a facility feature
   * @public
   * @method
   */
  getPhone() {},
  /**
   * @desc Returns the email for a facility feature
   * @public
   * @method
   */
  getEmail() {},
  /**
   * @desc Returns the website URL for a facility feature
   * @public
   * @method
   */
  getWebsite() {},
  /**
   * @desc Returns additional details for the facility feature
   * @public
   * @method
   */
  detailsHtml() {},
  /**
   * @desc Returns the name of a facility feature as jQuery
   * @public
   * @method
   * @return {jQuery} The name of a facility feature as jQuery
   */
  nameHtml() {
    return $('<h3 class="name notranslate"></h3>').html(this.getName())
  },
  /**
   * @desc Returns the full address of a facility feature as jQuery
   * @public
   * @method
   * @return {jQuery} The full address of a facility feature as jQuery
   */
  addressHtml() {
    const html = $('<div class="addr"></div>')
      .append(`<div class="ln1">${this.getAddress1()}</div>`)
    if (this.getAddress2()) {
      html.append(`<div class="ln2">${this.getAddress2()}</div>`)
    }
    return html.append(`<div class="ln3">${this.getCityStateZip()}</div>`)
  },
  /**
   * @desc Returns a button as jQuery that when clicked will zoom to the facility
   * @public
   * @method
   * @return {jQuery} The map button as jQuery
   */
  mapButton() {
    return $('<button class="btn rad-all map">Map</button>')
      .prepend('<span class="screen-reader-only">Locate this facility on the </span>')
      .data('feature', this)
      .click(FinderApp.handleButton)
  },
  /**
   * @desc Returns a button as jQuery that when clicked will provide directions to the facility
   * @public
   * @method
   * @return {jQuery} The directions button as jQuery
   */
  directionsButton() {
    return $('<button class="btn rad-all dir">Directions</button>')
      .data('feature', this)
      .click(FinderApp.handleButton)
  },
  /**
   * @desc Returns a button as jQuery that when clicked will call the provided phone number
   * @public
   * @method
   * @return {jQuery} The phone button as jQuery
   */
  phoneButton() {
    const phone = this.getPhone()
    if (phone) {
      return $(`<a class="btn rad-all phone" role="button">${phone}</a>`)
        .attr('href', `tel:${phone}`)
    }
  },
  /**
   * @desc Returns a button as jQuery that when clicked will open email editor for the provided email
   * @public
   * @method
   * @return {jQuery} The email button as jQuery
   */
  emailButton() {
    const email = this.getEmail()
    if (email) {
      return $('<a class="btn rad-all email" role="button">Email</a>')
        .attr('href', `mailto:${email}`)
    }
  },
  /**
   * @desc Returns a button as jQuery that when clicked will open the facility web site
   * @public
   * @method
   * @return {jQuery} The website button as jQuery
   */
  websiteButton() {
    const url = this.getWebsite()
    if (url) {
      return $('<a class="btn rad-all web" target="blank" role="button">Website</a>')
        .attr('href', url)
    }
  },
  /**
   * @desc Returns the distance from the user location to the facility as jQuery
   * @public
   * @method
   * @param {boolean} screenReaderOnly Return distance for screen readers
   * @return {jQuery} The distance from the user location to the facility as jQuery
   */
  distanceHtml(screenReaderOnly) {
    if (this.getDistance) {
      const html = $('<div class="dist"></div>')
      const distance = this.getDistance()
      if (screenReaderOnly) {
        html.addClass('screen-reader-only')
        if (distance.units === 'ft') {
          return html.html(`${(distance.distance / 5280).toFixed(2)} miles`)
        }
        return html.html(`${(distance.distance / 1000).toFixed(2)} kilometers`)
      }
      html.attr('aria-hidden', true)
      if (distance.units === 'ft') {
        return html.html(`&bull; ${(distance.distance / 5280).toFixed(2)} mi &bull;`)
      }
      return html.html(`&bull; ${(distance.distance / 1000).toFixed(2)} km &bull;`)
    }
  },
  /**
   * @desc Returns collapsible details for the facility features as jQuery
   * @public
   * @method
   * @return {jQuery} The collapsible details as jQuery
   */
  detailsCollapsible() {
    const details = this.detailsHtml()
    if (details) {
      const collapsible = new Collapsible({
        target: $('<div class="dtl"></div>'),
        title: this.detailButtonText || 'Details',
        content: details,
        collapsed: true
      })
      collapsible.on('change', this.finderApp.expandDetail, this.finderApp)
      return collapsible.getContainer()
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
 * @property {module:nyc/ZoomSearch~ZoomSearch.FeatureSearchOptions|boolean} [facilitySearch=false] Search options for feature searches or true to use default search options
 * @property {string} [filterTabTitle=Filters] Title for the filters tab
 * @property {Array<module:nyc/ol/Filters~Filters.ChoiceOptions>=} filterChoiceOptions Filter definitions
 * @property {string} geoclientUrl The URL for the Geoclient geocoder with approriate keys
 * @property {string} directionsUrl The URL for the Google directions API with approriate keys
 */
FinderApp.Options

/**
 * @private
 * @const
 * @type {string}
 */
FinderApp.HTML = '<h1 id="banner" role="banner"></h1>' +
'<a id="home" role="button" href="#" onclick="document.location.reload()">' +
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
