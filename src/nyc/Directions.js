/* global google */
/**
 * @module nyc/Directions
 */

import $ from 'jquery'

import Contanier from 'nyc/Container'
import Dialog from 'nyc/Dialog'
import Tabs from 'nyc/Tabs'
import TripPlanHack from 'nyc/mta/TripPlanHack'
import nyc from 'nyc'

const proj4 = nyc.proj4

/**
 * @desc Provides directions using google maps
 * @public
 * @class
 * @extends {module:nyc/Contanier~Contanier}
 * @constructor
 */
class Directions extends Contanier {
  /**
   * @desc Provides directions using google maps
   * @public
   * @constructor
   * @param {module:nyc/Directions~Directions.Options=} options Constructor options
   */
  constructor(options) {
    super('body')
    options = options || {}
    global.directions = this
    this.append(Directions.HTML)
    /**
     * @private
     * @member {module:nyc/Tabs~Tabs}
     */
    this.tabs = new Tabs({
      target: '#dir-tabs',
      tabs: [
        {tab: '#map-tab', title: 'Route Map'},
        {tab: '#route-tab', title: 'Directions'}
      ]
    })
    this.tabs.find('.btn-0').parent().attr('aria-hidden', true)
    this.tabs.on('change', this.tabChange, this)
    /**
     * @public
     * @member {google.maps.Map}
     */
    this.map = null
    /**
     * @private
     * @member {google.maps.DirectionsService}
     */
    this.service = null
    /**
     * @private
     * @member {google.maps.DirectionsRenderer}
     */
    this.renderer = null
    /**
     * @private
     * @member {google.maps.Marker}
     */
    this.marker = null
    /**
     * @private
     * @member {google.maps.InfoWindow}
     */
    this.infoWin = null
    /**
     * @private
     * @member {module:nyc/Directions~Directions.Request}
     */
    this.args = null
    /**
     * @private
     * @member {Element}
     */
    this.modeBtn = $('#transit').get(0)
    /**
     * @private
     * @member {string}
     */
    this.url = `${(options.url || Directions.GOOGLE_URL)}&callback=directions.init`
    /**
     * @private
     * @member {jQuery.Event}
     */
    this.routeTarget = this.find('#route-tab div.route')
    /**
     * @private
     * @member {string}
     */
    this.lastDir = ''
    /**
     * @private
     * @member {jQuery}
     */
    this.toggle = $(options.toggle)
    /**
     * @private
     * @member {Array<Object<string, Object>>}
     */
    this.styles = options.styles || Directions.DEFAULT_STYLES
    /**
     * @private
     * @member {boolean}
     */
    this.monitoring = false
    /**
     * @private
     * @member {google.maps.TravelMode}
     */
    this.defaultMode = options.mode || 'TRANSIT'
    $('#mta').click($.proxy(this.tripPlanHack, this))
    $('#mode button').not('#mta').click($.proxy(this.mode, this))

    const input = $('#fld-from input')
    input.keypress($.proxy(this.key, this)).focus(() => input.select())

    const tog = this.toggle
    $('#back-to-map').click(() => {
      $('#directions').slideUp()
      tog.show().attr('aria-hidden', false)
    })
  }
  /**
   * @desc Get directions
   * @public
   * @method
   * @param {module:nyc/Directions~Directions.Request} args The arguments describing the requested directions
   * @return {jqXHR|undefined} JQuery XHR object
   */
  directions(args) {
    const mode = args.mode || this.defaultMode
    const url = this.url
    const tog = this.toggle
    this.modeBtn = $(`[data-mode="${mode}"]`)
    this.modeAria()
    this.args = args
    this.monitor()
    this.tabs.open('#route-tab')
    if (!this.map) {
      return $.getScript(url)
    }
    args.from = args.from || $('#fld-from input').val()
    $('#fld-from input').val(args.from)
    $('#fld-to').html(args.to)
    $('#fld-facility').html(args.facility)
    $('#directions').slideDown(() => {
      tog.hide()
    })
    tog.attr('aria-hidden', true)
    this.createMarker(this.getLatLng())
    if (args.from && this.lastDir !== `${args.from}|${args.to}|${mode}`) {
      this.lastDir = `${args.from}|${args.to}|${mode}`
      this.service.route(
        {
          origin: args.from,
          destination: args.to,
          travelMode: google.maps.TravelMode[mode]
        },
        $.proxy(this.handleResp, this)
      )
    }
    $('#back-to-map').one('click', () => {
      $(args.returnFocus).focus()
    })
  }
  /**
   * @private
   * @method
   */
  monitor() {
    if (!this.monitoring) {
      const fn = $.proxy(this.routeAlt, this)
      this.monitoring = true
      if ('MutationObserver' in window) {
        new MutationObserver(fn)
          .observe(this.getContainer().get(0), {childList: true})
      } else {
        setInterval(fn, 500)
      }
    }
  }
  /**
   * @private
   * @method
   * @param {Object} response Response object
   * @param {string} status Response status
   */
  handleResp(response, status) {
    const target = $(this.routeTarget)
    if (status === google.maps.DirectionsStatus.OK) {
      this.marker.setMap(null)
      const leg = response.routes[0].legs[0]
      const addrA = leg.start_address.replace(/\, USA/, '')
      const addrB = leg.end_address.replace(/\, USA/, '')
      if (!this.args.origin.coordinate) {
        const start = leg.start_location
        this.args.origin = {
          name: addrA,
          coordinate: [start.lng(), start.lat()],
          projection: 'EPSG:4326'
        }
      }
      this.renderer.setOptions({
        map: this.map,
        panel: target.get(0),
        directions: response
      })
      $('#fld-from input').val(addrA)
      $('#fld-to').html(addrB)
    } else {
      target.empty()
      new Dialog().ok({
        message: `Could not determine directions from '${this.args.from}' to '${this.args.to}'`
      })
    }
    setTimeout(() => {
      target.children().first().attr('aria-live', true).focus()
    }, 200)
    this.trigger('change', {response: response, status: status})
  }
  /**
   * @private
   * @method
   */
  routeAlt() {
    let first = true
    let hasTransit = false
    $('#map-tab, #directions div.map *').attr({
      'aria-hidden': true,
      tabindex: -1
    })
    global.directions.find('.route img').each((_, img) => {
      const src = img.src
      let imgName = src.match(/([^\/]+)(?=\.\w+$)/)
      imgName = imgName ? imgName[0] : ''
      imgName = imgName.replace(/X/, ' Express')
      if (src.indexOf('us-ny-mta') > -1) {
        hasTransit = true
        img.alt = `Take the ${imgName} train `
      } else if (imgName.indexOf('rail') > -1) {
        hasTransit = true
        img.alt = 'Take the train '
      } else if (imgName.indexOf('bus') > -1) {
        hasTransit = true
        img.alt = 'Take the bus '
      } else if (imgName === 'walk') {
        img.alt = 'Walk '
      } else if ($(img).hasClass('adp-marker2')) {
        img.alt = first ? 'Start location ' : 'End location '
        first = false
      }
    })
    this.find('.no-trans')[!hasTransit && this.modeBtn.id === 'transit' ? 'show' : 'hide']()
  }
  /**
   * @private
   * @method
   */
  tabChange() {
    if (this.renderer) {
      this.renderer.setOptions({map: this.map})
    }
  }
  /**
   * @desc Initializes the class on callback from the Google Maps
   * @public
   * @method
   */
  init() {
    const destination = this.getLatLng()
    this.map = new google.maps.Map($('#map-tab div.map').get(0), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      backgroundColor: '#D3D3D3',
      panControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      maxZoom: 18,
      zoom: 17,
      center: destination,
      styles: this.styles
    })
    this.service = new google.maps.DirectionsService()
    this.renderer = new google.maps.DirectionsRenderer()
    this.find('.btn-z-in, .btn-z-out').click($.proxy(this.zoom, this))
    this.directions(this.args)
  }
  /**
   * @private
   * @method
   * @param {google.maps.LatLngLiteral} destination The destination location
   */
  createMarker(destination) {
    const text = this.args.to.replace(/\n/g, ' ')
    if (this.marker) {
      this.marker.setMap(null)
    }
    this.infoWin = this.infoWin || new google.maps.InfoWindow()
    this.infoWin.setContent(`<div class="gm-iw">${text}</div>`)
    this.marker = new google.maps.Marker({
      position: destination,
      map: this.map,
      label: {
        text: 'B',
        color: 'white',
        fontSize: '16px'
      },
      title: text
    })
    this.marker.addListener('click', $.proxy(this.openInfoWin, this));
    this.map.setCenter(destination)
  }
  /**
   * @private
   * @method
   */
  openInfoWin() {
    this.infoWin.open(this.map, this.marker)
  }
  /**
   * @private
   * @method
   * @return {google.maps.LatLngLiteral|undefined} The destination location
   */
  getLatLng() {
    try {
      const coord = proj4('EPSG:3857', 'EPSG:4326', this.args.destination.coordinate)
      return {lat: coord[1], lng: coord[0]}
    } catch (ignore) {/* no destination specified */}
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event Event object
   */
  zoom(event) {
    const z = this.map.getZoom()
    this.map.setZoom(z + ($(event.target).data('zoom-incr') * 1))
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event Event object
   */
  mode(event) {
    this.args = this.args || {}
    this.modeBtn = event.target
    this.args.mode = $(this.modeBtn).data('mode')
    this.modeAria()
    this.directions(this.args)
  }
  /**
   * @private
   * @method
   */
  modeAria() {
    $('#mode button').removeClass('active').attr({
      'aria-selected': false,
      'aria-pressed': false
    })
    $(this.modeBtn).addClass('active').attr({
      'aria-selected': true,
      'aria-pressed': true
    })
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event Event object
   */
  key(event) {
    if (event.keyCode === 13) {
      this.args.from = $('#fld-from input').val()
      this.directions(this.args)
    }
  }
  tripPlanHack() {
    this.args.accessible = true
    new TripPlanHack().directions(this.args)
  }
}

/**
 * @desc The default URL for loading Google APIs
 * @public
 * @const
 * @type {string}
 */
Directions.DEFAULT_GOOGLE_URL = 'https://maps.googleapis.com/maps/api/js?&sensor=false&libraries=visualization'

/**
 * @desc Object type for getting directions
 * @public
 * @typedef {Object}
 * @property {string=} from The origin location
 * @property {string} to The destination location
 * @property {google.maps.DirectionsTravelMode} mode The directions mode
 * @property {string} facility The name of the destination
 * @property {JQuery|Element|string=} returnFocus The DOM element that should receive focus when leaving the directions view
 */
Directions.Request

/**
 * @desc Object type for getting directions
 * @public
 * @typedef {Object}
 * @property {Object} response The Google response
 * @property {google.maps.DirectionsStatus} status The status of the response
 */
Directions.Response

/**
 * @desc The class has completed initialization
 * @event nyc.Directions#changed
 * @type {module:nyc/Directions~Directions.Response}
 */

/**
 * @desc Constructor options for {@link module:nyc/Directions~Directions}
 * @public
 * @typedef {Object}
 * @property {string} [url={@link module:nyc/Directions~Directions.DEFAULT_GOOGLE_URL}] The Google Maps URL to use
 * @property {Array<Object<strng, Object>>=} styles The Google Maps styles to use (see {@link https://developers.google.com/maps/documentation/javascript/style-reference})
 * @property {jQuery|string=} toggle Elements to hide from screen readers when directions are shown
 */
Directions.Options
/**
  * @private
  * @const
  * @type {string}
  */
Directions.HTML = '<div id="directions">' +
  '<button id="back-to-map" class="btn rad-all">' +
    'Back to finder' +
  '</button>' +
  '<div id="dir-tabs">' +
    '<div id="route-tab">' +
      '<div class="fld-lbl">From my location:</div>' +
      '<div id="fld-from"><input class="rad-all" placeholder="Enter an address..."></div>' +
      '<div class="fld-lbl">To <span id="fld-facility"></span>:</div>' +
      '<div id="fld-to"></div>' +
      '<table id="mode">' +
        '<tbody><tr>' +
          '<td>' +
            '<button id="transit" class="btn-sq rad-all active" data-mode="TRANSIT" aria-pressed="true" aria-selected="true" title="Get transit directions">' +
              '<span class="screen-reader-only">get transit directions</span>' +
            '</button>' +
          '</td>' +
          '<td>' +
            '<button id="bike" class="btn-sq rad-all" data-mode="BICYCLING" aria-pressed="false" aria-selected="false" title="Get bicycling directions">' +
              '<span class="screen-reader-only">get bicycling directions</span>' +
            '</button>' +
          '</td>' +
          '<td>' +
            '<button id="walk" class="btn-sq rad-all" data-mode="WALKING" aria-pressed="false" aria-selected="false" title="Get walking directions">' +
              '<span class="screen-reader-only">get walking directions</span>' +
            '</button>' +
          '</td>' +
          '<td>' +
            '<button id="car" class="btn-sq rad-all" data-mode="DRIVING" aria-pressed="false" aria-selected="false" title="Get driving directions">' +
              '<span class="screen-reader-only">get driving directions</span>' +
            '</button>' +
          '</td>' +
          '<td>' +
            '<span class="screen-reader-only">Get accessible transit directions from the MTA </span>' +
            '<button id="mta" class="btn-sq rad-all notranslate">TripPlanner' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="656" height="656" viewBox="0 0 656 656"><g transform="translate(-263.86732,-69.7075)"><path d="M 833.556,367.574 C 825.803,359.619 814.97,355.419 803.9,356.025 l -133.981,7.458 73.733,-83.975 c 10.504,-11.962 13.505,-27.908 9.444,-42.157 -2.143,-9.764 -8.056,-18.648 -17.14,-24.324 -0.279,-0.199 -176.247,-102.423 -176.247,-102.423 -14.369,-8.347 -32.475,-6.508 -44.875,4.552 l -85.958,76.676 c -15.837,14.126 -17.224,38.416 -3.097,54.254 14.128,15.836 38.419,17.227 54.255,3.096 l 65.168,-58.131 53.874,31.285 -95.096,108.305 c -39.433,6.431 -74.913,24.602 -102.765,50.801 l 49.66,49.66 c 22.449,-20.412 52.256,-32.871 84.918,-32.871 69.667,0 126.346,56.68 126.346,126.348 0,32.662 -12.459,62.467 -32.869,84.916 l 49.657,49.66 c 33.08,-35.166 53.382,-82.484 53.382,-134.576 0,-31.035 -7.205,-60.384 -20.016,-86.482 l 51.861,-2.889 -12.616,154.75 c -1.725,21.152 14.027,39.695 35.18,41.422 1.059,0.086 2.116,0.127 3.163,0.127 19.806,0 36.621,-15.219 38.257,-35.306 l 16.193,-198.685 c 0.904,-11.071 -3.026,-21.989 -10.775,-29.942 z"/><path  d="m 762.384,202.965 c 35.523,0 64.317,-28.797 64.317,-64.322 0,-35.523 -28.794,-64.323 -64.317,-64.323 -35.527,0 -64.323,28.8 -64.323,64.323 0,35.525 28.795,64.322 64.323,64.322 z"/><path d="m 535.794,650.926 c -69.668,0 -126.348,-56.68 -126.348,-126.348 0,-26.256 8.056,-50.66 21.817,-70.887 l -50.196,-50.195 c -26.155,33.377 -41.791,75.393 -41.791,121.082 0,108.535 87.983,196.517 196.518,196.517 45.691,0 87.703,-15.636 121.079,-41.792 L 606.678,629.11 c -20.226,13.757 -44.63,21.816 -70.884,21.816 z"/></g></svg>' +
          '</td>' +
          '</tr></tbody>' +
        '</table>' +
        '<div class="no-trans">The origin and destination locations are so close that walking appears to be the best option.</div>' +
      '<div class="route"></div>' +
    '</div>' +
    '<div id="map-tab" aria-hidden="true" tabindex="-1">' +
      '<div class="map"></div>' +
      '<button class="btn-z-in btn-sq rad-all" tabindex="-1" data-zoom-incr="1" title="Zoom in"></button>' +
      '<button class="btn-z-out btn-sq rad-all" tabindex="-1" data-zoom-incr="-1" title="Zoom out"></button>' +
    '</div>' +
  '</div>' +
'</div>'

/**
 * @desc Default styles used for Google Maps API
 * @public
 * @static
 * @type {Array<Object<string, Object>>}
 */
Directions.DEFAULT_STYLES = [
  {elementType: 'geometry.fill', stylers: [{color: '#ececec'}]},
  {elementType: 'geometry.stroke', stylers: [{color: '#dcdcdc'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#585858'}]},
  {featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{color: '#e8e8e8'}]},
  {featureType: 'water', elementType: 'geometry', stylers: [{color: '#d8d8d8'}]},
  {featureType: 'road', elementType: 'geometry.fill', stylers: [{color: '#ffffff'}]},
  {featureType: 'landscape.man_made', stylers: [{visibility: 'off'}]},
  {featureType: 'transit.line', stylers: [{visibility: 'off'}]},
  {featureType: 'administrative', stylers: [{visibility: 'off'}]},
  {featureType: 'poi', stylers: [{visibility: 'off'}]},
  {featureType: 'poi.government', stylers: [{visibility: 'on'}]},
  {featureType: 'poi.park', stylers: [{visibility: 'on'}]}
]

export default Directions
