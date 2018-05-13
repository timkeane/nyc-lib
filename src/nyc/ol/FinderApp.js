/**
 * @module nyc/ol/FinderApp
 */

import $ from 'jquery'

import nyc from 'nyc/nyc'
import Dialog from 'nyc/Dialog'
import Share from 'nyc/Share'
import Tabs from 'nyc/Tabs'
import ListPager from 'nyc/ListPager'
import MapLocator from 'nyc/MapLocator'

import Translate from 'nyc/lang/Translate'
import Goog from 'nyc/lang/Goog'

import Basemap from 'nyc/ol/Basemap'
import Filters from 'nyc/ol/Filters'
import LocationMgr from 'nyc/ol/LocationMgr'
import MultiFeaturePopup from 'nyc/ol/MultiFeaturePopup'
import FeatureTip from 'nyc/ol/FeatureTip'

import Decorate from 'nyc/ol/format/Decorate'

import FilterAndSort from 'nyc/ol/source/FilterAndSort'

import OlLayerVector from 'ol/layer/vector'

class FinderApp {
  constructor(options) {
    global.finderApp = this
    $('body').append(FinderApp.HTML).addClass('fnd')
    $('#banner').html(options.title)
    /**
     * @private
     * @member {nyc.ListPager}
     */
    this.pager = new ListPager({target: '#facilites'})
    /**
     * @public
     * @member {ol.Map}
     */
    this.map = new Basemap({target: 'map'})
    /**
     * @public
     * @member {ol.source.Vector}
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
     * @public
     * @member {ol.layer.Vector}
     */
    this.layer = new OlLayerVector({
      source: this.source,
      style: options.facilityStyle
    })
    this.map.addLayer(this.layer)
    /**
     * @public
     * @member {nyc.ol.MultiFeaturePopup}
     */
    this.popup = new MultiFeaturePopup({
      map: this.map,
      layers: [this.layer]
    })
    /**
     * @private
     * @member {nyc.ol.Locator.Result}
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
    /**
     * @public
     * @member {ol.View}
     */
    this.view = this.map.getView()
    /**
     * @public
     * @member {nyc.ol.LocationMgr}
     */
    this.locationMgr = new LocationMgr({
      map: this.map,
      url: options.geoclientUrl
    })
    this.locationMgr.on('geocode', this.located, this)
    this.locationMgr.on('geolocate', this.located, this)
    /**
     * @public
     * @member {nyc.Filters}
     */
    this.filters = this.createFilters(options.filterChoiceOptions)
    /**
     * @public
     * @member {nyc.Tabs}
     */
    this.tabs = this.createTabs(options)
    this.adjustTabs()
    this.view.fit(Basemap.EXTENT, {
      size: this.map.getSize(),
      duration: 500
    })
    this.showSplash(options.splashContent)
    new Share({target: '#map'})
    new Goog({
      target: '#map',
      languages: options.languages || Translate.DEFAULT_LANGUAGES,
      button: true
    })
  }
  /**
   * @desc Centers and zooms the map on the provided feature
   * @public
   * @method
   * @param {ol.Feature}
   */
  zoomTo(feature) {
    const popup = this.popup
    popup.hide()
    if ($('h3.btn-0').css('display') === 'table-cell') {
      this.tabs.open($('#map'))
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
   * @param {ol.Feature}
   */
  directionsTo(feature) {

  }
  createFilters(choiceOptions) {
    if (choiceOptions) {
      const filters = new Filters({
        target: '#filters',
        source: this.source,
        choiceOptions: choiceOptions
      })
      filters.on('change', this.resetList, this)
      return filters
    }
  }
  /**
   * @private
   * @method
   */
  showSplash(content) {
    if (content) {
      new Dialog('splash').ok({
        message: content,
        buttonText: ['Continue...']
      })
      $('.dia-msg').attr('tabindex', 0).focus()
    }
  }
  /**
   * @private
   * @method
   */
  createTabs(options) {
    const pages = [
      {tab: '#map', title: 'Map'},
      {tab: '#facilites', title: options.facilityTabTitle || 'Facilites'}
    ]
    if (this.filters) {
      pages.push({tab: '#filters', title: options.filterTabTitle || 'Filters'})
    }
    const tabs = new Tabs({target: '#tabs', tabs: pages})
    tabs.on('change', $.proxy(this.resizeMap, this))
    $(window).resize($.proxy(this.adjustTabs, this))
    return tabs
  }
  /**
   * @private
   * @method
   */
  adjustTabs() {
    if (Math.abs(this.tabs.getContainer().width() - $(window).width()) < 1) {
        this.tabs.open($('#map'))
    } else {
      this.tabs.open($('#facilites'))
    }
  }
  /**
   * @private
   * @method
   */
  resizeMap() {
    this.map.setSize([$('#map').width(), $('#map').height()])
  }
  /**
   * @private
   * @method
   * @param {Locator.Result}
   */
  located(location) {
    this.location = location
    this.resetList()
  }
  /**
   * @private
   * @method
   * @param {Object}
   */
  resetList(event) {
    if (event instanceof Filters) {
      $('#tabs .btns h3.btn-2').addClass('filtered')
    }
    const coordinate = this.location.coordinate
    this.popup.hide()
    this.pager.reset(
      coordinate ? this.source.sort(coordinate) : this.source.getFeatures()
    )
  }
  /**
   * @private
   * @method
   * @param {ol.format.Feature}
   * @return {ol.format.Feature}
   */
  parentFomat(format) {
    return format.parentFomat || format
  }
  /**
   * @private
   * @method
   * @param {FinderApp.Options} options
   * @param {ol.format.Feature} format
   * @return {Array<Object<string, fuction()>>}
   */
  decorations(options, format) {
    let decorations = [FinderApp.FEATURE_DECORATIONS]
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
   * @private
   * @method
   * @param {Array<ol.Feature>}
   */
  ready(features) {
    this.pager.reset(features)
    nyc.ready($('body'))
  }
}

/**
 * @desc Handles map and direction button click
 * @public
 * @static
 * @function
 * @param {JQuery.Event}
 */
FinderApp.handleButton = (event) => {
  const target = $(event.currentTarget)
  const feature = target.data('feature')
  if (target.hasClass('map')) {
    global.finderApp.zoomTo(feature)
  }
  global.finderApp.directionsTo(feature)
}

/**
 * @desc Default facility feature decorations
 * @public
 * @const
 * @mixin
 * @type {Object<string, fuction()>}
 */
FinderApp.FEATURE_DECORATIONS = {
  /**
   * @desc Returns HTML rendering of a facility feature
   * @public
   * @method
   * @param {JQuery}
   */
  html() {
    throw 'An html decoration must be provided'
  },
  /**
   * @desc Returns the name of a facility feature
   * @public
   * @method
   * @param {string}
   */
  getName() {
    throw 'An getName decoration must be provided'
  },
  nameHtml() {
    return $('<div class="name notranslate"></div>').html(this.getName())
  },
  /**
   * @desc Returns an HTML button that when clicked will zoom to the facility
   * @public
   * @method
   * @param {JQuery}
   */
  mapButton() {
    return $('<a class="btn rad-all map" role="button">Map</a>')
      .data('feature', this)
      .click(FinderApp.handleButton)
  },
  /**
   * @desc Returns an HTML button that when clicked will provide directions to the facility
   * @public
   * @method
   * @param {JQuery}
   */
  directionsButton() {
    return $('<a class="btn rad-all dir" role="button">Directions</a>')
      .data('feature', this)
      .click(FinderApp.handleButton)
  },
  /**
   * @desc Returns an HTML button that when clicked will call the provided phone number
   * @public
   * @method
   * @param {string} phoneNumber The phone number
   * @param {JQuery}
   */
  phoneButton(phoneNumber) {
    return $(`<a class="btn rad-all phone">${phoneNumber}</a>`)
      .attr('href', `tel:${phoneNumber}`)
  },
  /**
   * @desc Returns an HTML button that when clicked will open the facility web site
   * @public
   * @method
   * @param {string} name The text to display on the button
   * @param {string} url The web site URL
   */
  websiteButton(name, url) {
    return $(`<a class="btn rad-all web" target="blank" role="button">${name}</a>`)
      .attr('href', url)
  },
  /**
   * @desc Returns an HTML button that when clicked will open email editor for the provided email
   * @public
   * @method
   * @param {string} email The email
   * @param {JQuery}
   */
  emailButton(email) {
    return $(`<a class="btn rad-all email">${email}</a>`)
      .attr('href', `mailto:${email}`)
  },
  /**
   * @desc Returns HTML rendering of the distance from the user location to the facility
   * @public
   * @method
   * @param {JQuery}
   */
  distanceHtml() {
    if (this.getDistance) {
      const html = $('<div class="dist"></div>')
      const distance = this.getDistance()
      if (distance.units === 'ft') {
        return html.html(`&bull; ${(distance.distance / 5280).toFixed(2)} mi &bull;`)
      }
      return html.html(`&bull; ${(distance.distance / 1000).toFixed(2)} km &bull;`)
    }
  },
  /**
   * @desc Returns an HTML button that when clicked will display the provided details
   * @method
   * @param {string} email The email
   * @param {JQuery}
   */
  detailsCollapsible(details) {
    return new Collapsible({
      target: $('<div class="details"></div>'),
      title: 'Details',
      content: details,
      collapsed: true
    }).getContainer()
  }
}

/**
 * @desc Object to hold constructor options for FinderApp
 * @public
 * @typedef {Object}
 * @property {string} title
 * @property {JQuery|Element|String} splashContent
 * @property {string} facilityTabTitle
 * @property {string} facilityUrl
 * @property {ol.format.Feature} facilityFormat
 * @property {ol.style.Style} facilityStyle
 * @property {string} filterTabTitle
 * @property {Array<Choice.Options>} filterChoiceOptions
 * @property {string} geoclientUrl
 */
FinderApp.Options

/**
 * @private
 * @const
 * @type {string}
 */
FinderApp.HTML = '<h1 id="banner"></h1>' +
'<div id="map"></div>' +
'<div id="tabs"></div>' +
'<div id="facilites"></div>' +
'<div id="filters"></div>'

export default FinderApp
