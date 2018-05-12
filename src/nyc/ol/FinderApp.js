/**
 * @module nyc/ol/FinderApp
 */

import Share from 'nyc/Share'
import Tabs from 'nyc/Tabs'
import Collapsible from 'nyc/Collapsible'
import ListPager from 'nyc/ListPager'

import Goog from 'nyc/lang/Goog'

import Basemap from 'nyc/ol/Basemap'
import Filters from 'nyc/ol/Filter'
import LocationMgr from 'nyc/ol/LocationMgr'
import LocationMgr from 'nyc/ol/MultiFeaturePopup'

import CsvPoint from 'nyc/ol/format/CsvPoint'
import Decorate from 'nyc/ol/format/Decorate'

import FilterAndSort from 'nyc/ol/source/FilterAndSort'

class FinderApp {
  constructor(options) {
    $('body').append(FinderApp.HTML)

    this.map = new Basemap({target: 'map'})

    this.filters = new Filters(options.filterOptions)
    this.locationMgr = new LocationMgr({
      map: this.map,
      url: options.geoclientUrl
    })
    this.locationMgr.on('geocode', this.resetList, this)
    this.locationMgr.on('geolocate', this.resetList, this)
    this.filters.on('change', this.resetList, this)

    this.tabs = new Tabs(
      target: '#tabs',
      tabs: [
        {tab: '#map', title: 'Map'},
        {tab: '#list', title: options.facilityTitle || 'Facilites' active: true},
        {tab: '#filters', title: options.filterTitle || 'Filters'}
      ]
    )
    this.pager = new ListPager({target: '#list'})

    this.source = new FilterAndSort({
      url: options.facilityUrl,
      format: new Decorate({
        parentFomat: options.format,
        decorations: [options.decorations, FinderApp.Decorations]
      })
    })
    this.source.autoLoad($.proxy(this.ready, this))

    this.layer = new OlLayerVector({source: this.source})

  }
  ready(features) {

  }
  resetList(location) {
    if (location) {
      this.source.sort(location.coordinate)
    }
    this.pager.reset(this.source.getFeatures())
  }
  decorations(decorations) {
    const html = decorations.html
    $.extend(decorations, {
      html() {
        return $('<div></div>')
          .append(html.call(this))
          .append(this.mapBtn())
          .append(this.directionsBtn())
      },
      mapBtn() {

      },
      directionsBtn() {

      }
    })
  }
}

FinderApp.HTML = '<h1 id="banner"></h1>' +
'<div id="splash"></div>' +
'<div id="map"></div>' +
'<div id="tabs"></div>' +
'<div id="list"></div>' +
'<div id="filters"></div>' +
'<div id="translate"></div>' +
'<div id="share"></div>'
