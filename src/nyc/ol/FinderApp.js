/**
 * @module nyc/ol/FinderApp
 */

import Share from 'nyc/Share'
import Tabs from 'nyc/Tabs'
import ListPager from 'nyc/ListPager'
import {ZOOM_LEVEL} from 'nyc/MapLocator'

import Goog from 'nyc/lang/Goog'

import Basemap from 'nyc/ol/Basemap'
import Filters from 'nyc/ol/Filters'
import LocationMgr from 'nyc/ol/LocationMgr'
import MultiFeaturePopup from 'nyc/ol/MultiFeaturePopup'

import CsvPoint from 'nyc/ol/format/CsvPoint'
import Decorate from 'nyc/ol/format/Decorate'

import FilterAndSort from 'nyc/ol/source/FilterAndSort'

class FinderApp {
  constructor(options) {
    global.finderApp = this
    $('body').append(FinderApp.HTML)
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
        parentFomat: this.parentFomat(options.facilityFormat),
        decorations: this.decorations(options, facilityFormat)
      })
    })
    this.source.autoLoad($.proxy(this.ready, this))
    /**
     * @public
     * @member {ol.layer.Vector}
     */
    this.layer = new OlLayerVector({source: this.source})
    this.map.addLayer(this.layer)
    /**
     * @public
     * @member {nyc.ol.MultiFeaturePopup}
     */
    this.popup = new MultiFeaturePopup({
      map: this.map,
      layers: [this.layer]
    })
    new FeatureTip([{
      layer: this.layer,
      label: (feature) => {
        return {html: feature.getName()}
      }
    }])
    /**
     * @private
     * @member {ol.View}
     */
    this.view = this.map.getView()
    /**
     * @private
     * @member {nyc.Filters}
     */
    this.filters = new Filters(options.filterOptions)
    this.filters.on('change', this.resetList, this)
    /**
     * @private
     * @member {nyc.Tabs}
     */
    this.locationMgr = new nyc.ol.LocationMgr({
      map: this.map,
      url: options.geoclientUrl
    })
    this.locationMgr.on('geocode', this.resetList, this)
    this.locationMgr.on('geolocate', this.resetList, this)
    /**
     * @private
     * @member {nyc.Tabs}
     */
    this.tabs = new Tabs({
      target: '#tabs',
      tabs: [
        {tab: '#map', title: 'Map'},
        {tab: '#facilites', title: options.facilityTabTitle || 'Facilites', active: true},
        {tab: '#filters', title: options.filterTabTitle || 'Filters'}
      ]
    })
    /**
     * @private
     * @member {nyc.ListPager}
     */
    this.pager = new ListPager({target: '#facilites'})
  }
  /**
   * @desc Centers and zooms the map on the provided feature
   * @public
   * @method
   * @param {ol.Feature}
   */
  zoomTo(feature) {
    this.view.animate({
      center: feature.getGeometry().getCoordinates(),
      zoom: ZOOM_LEVEL
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
  /**
   * @private
   * @method
   * @param {Locator.Result}
   */
  resetList(location) {
    this.pager.reset(this.source.sort(location.coordinate))
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
    const decorations = [FinderApp.FEATURE_DECORATIONS]
    if (format.parentFomat && format.parentFomat.decorations) {
      decorations.push(format.parentFomat.decorations)
    }
    if (format.decorations) {
      decorations.push(format.decorations)
    }
    if (options.decorations) {
      decorations.push(options.decorations)
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
  const target = $(event.target)
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
 * @type {Object<string, fuction()>}
 */
FinderApp.FEATURE_DECORATIONS = {
  html() {
    throw 'An html decoration must be provided'
  },
  getName() {
    throw 'An getName decoration must be provided'
  },
  mapButton() {
    return $('<button class="btn map">Map</button>')
      .data('feature', this)
      .click(FinderApp.handleButton)
  },
  directionsButton() {
    return $('<button class="btn directions">Directions</button>')
      .data('feature', this)
      .click(FinderApp.handleButton)
  },
  phoneButton(phoneNumber) {
    return $(`<a class="btn phone">${phoneNumber}</a>`)
      .attr('href', `tel:${phoneNumber}`)
  },
  websiteButton(name, url) {
    return $(`<a class="btn web">${name}</a>`)
      .attr('href', `${url}`)
  },
  emailButton(email) {
    return $(`<a class="btn email">${email}</a>`)
      .attr('href', `mailto:${email}`)
  },
  distanceHtml() {
    const distance = this.getDistance()
    if (distance.units === 'ft') {
      return html.html(`&bull; ${(distance.units / 5280).toFixed(2)} mi &bull;`)
    }
    return html.html(`&bull; ${(distance.units / 1000).toFixed(2)} km &bull;`)
  },
  detailsCollapsible(details) {
    return new Collapsible({
      target: $('<div class="details"></div>'),
      title: 'Details',
      content: details
    }).getContainer()
  }
}

/**
 * @desc Object to hold constructor options for FinderApp
 * @public
 * @typedef {Object}
 * @property {string} facilityTabTitle
 * @property {string} facilityUrl
 * @property {ol.format.Feature} facilityFormat
 * @property {string} filterTabTitle
 * @property {Filters.Options} filterOptions
 * @property {string} geoclientUrl
 */
FinderApp.Options

/**
 * @private
 * @const
 * @type {string}
 */
FinderApp.HTML = '<h1 id="banner"></h1>' +
'<div id="splash"></div>' +
'<div id="map"></div>' +
'<div id="tabs"></div>' +
'<div id="facilites"></div>' +
'<div id="filters"></div>' +
'<div id="translate"></div>' +
'<div id="share"></div>'
