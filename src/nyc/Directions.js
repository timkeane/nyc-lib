/**
 * @module nyc/Directions
 */

import $ from 'jquery'
import Contanier from 'nyc/Container'
import Tabs from 'nyc/Tabs'

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
   * @param {string} [url={@link module:nyc/Directions~Directions.DEFAULT_GOOGLE_URL}] The Google Maps URL to use
   * @param {Array<Object<strng, Object>>=} styles The Google Maps styles use {@see https://developers.google.com/maps/documentation/javascript/style-reference}
   */
  constructor(url, styles) {
		super($('body'))
		this.append(Directions.HTML)
    /**
     * @private
     * @member {module:nyc/Tabs~Tabs}
     */
		this.tabs = new Tabs({
      target: '#dir-tabs',
      tabs: [
        {tab: '#map-tab', title: 'Map'},
        {tab: '#route-tab', title: 'Directions'}
      ]
    })
    $(window).resize($.proxy(this.adjustTabs, this))
    /**
     * @private
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
     * @member {module:nyc/Directions~Directions.Request}
     */
    this.args = null
    /**
     * @private
     * @member {string}
     */
	  this.modeBtn = '#transit'
    /**
     * @private
     * @member {string}
     */
    this.url = (url || Directions.GOOGLE_URL) + '&callback=directions.init'
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
    global.directions = this
    $('#mode button').click($.proxy(this.mode, this))
		$('#fld-from input').keypress($.proxy(this.key, this))
		/**
     * @private
     * @member {Array<Object<string, Object>>}
     */
		this.styles = styles || Directions.DEFAULT_STYLES
  }
	/**
	 * @desc Get directions
	 * @public
	 * @method
	 * @param {module:nyc/Directions~Directions.Request} args The arguments describing the requested directions
	 */
	directions(args) {
		const mode = args.mode || 'TRANSIT'
		const url = this.url
		this.args = args
		if (!this.map) {
			setTimeout(function() {
				$.getScript(url)
			}, 200)
			return
		}
		args.from = args.from || $('#fld-from input').val()
		$('#fld-from input').val(args.from)
		$('#fld-to').html(args.to)
		$('#fld-facility').html(args.facility)
		$('#directions').slideDown()
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
	}
	handleResp(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			const leg = response.routes[0].legs[0]
			const addrA = leg.start_address.replace(/\, USA/, '')
			const addrB = leg.end_address.replace(/\, USA/, '')
			this.renderer.setOptions({
				map: this.map,
				panel: $(this.routeTarget).get(0),
				directions: response
			})
			$('#fld-from input').val(addrA)
			$('#fld-to').html(addrB)
		} else {
			$(this.routeTarget).empty()
		}
		this.trigger('change', {response: response, status: status})
	}
	/**
	 * @desc Initializes the class on callback from the Google Maps
	 * @public
	 * @method
	 */
	init() {
		this.map = new google.maps.Map($('#map-tab div.map').get(0), {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			backgroundColor: '#D3D3D3',
			panControl: false,
			streetViewControl: false,
			mapTypeControl: false,
			zoomControl: false,
			maxZoom: 18,
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
   */
  adjustTabs() {  
    if (Math.abs(this.tabs.getContainer().width() - $(window).width()) < 1) {
      this.tabs.open('#map-tab')
    } else {
      this.tabs.open('#route-tab')
    }
  }
	/**
	 * @private
	 * @method
	 * @param {jQuery.Event} event
	 */
	zoom(event) {
		const z = this.map.getZoom() || 0
		this.map.setZoom(z + ($(event.target).data('zoom-incr') * 1))
	}
	/**
	 * @private
	 * @method
	 * @param {jQuery.Event} event
	 */
	mode(event) {
		this.args = this.args || {}
		this.modeBtn = event.target
		$('#mode button').removeClass('active')
		$(this.modeBtn).addClass('active')
		this.args.mode = $(this.modeBtn).data('mode')
		this.directions(this.args)
	}
	/**
	 * @private
	 * @method
	 * @param {jQuery.Event} event
	 */
	key(event) {
		if (event.keyCode === 13) {
			this.args.from = $('#fld-from input').val()
			this.directions(this.args)
		}
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
  * @private
  * @const
  * @type {string}
  */
 Directions.HTML = '<div id="directions">' +
	'<button id="back-to-map" class="btn rad-all" onclick="$(\'#directions\').slideUp()">' +
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
					'<td><button id="transit" class="btn-sq rad-all active" data-mode="TRANSIT" title="Get transit directions">' +
						'<span class="screen-reader-only">get transit directions</span>' +
					'</button></td>' +
					'<td><button id="bike" class="btn-sq rad-all" data-mode="BICYCLING" title="Get bicycling directions">' +
						'<span class="screen-reader-only">get bicycling directions</span>' +
					'</button></td>' +
					'<td><button id="walk" class="btn-sq rad-all" data-mode="WALKING" title="Get walking directions">' +
						'<span class="screen-reader-only">get walking directions</span>' +
					'</button></td>' +
					'<td><button id="car" class="btn-sq rad-all" data-mode="DRIVING" title="Get driving directions">' +
						'<span class="screen-reader-only">get driving directions</span>' +
					'</button></td>' +
					'<td>' +
						'<button id="mta" class="btn-sq rad-all">TripPlanner' +
						'<img class="icon" alt="Get accessible transit directions from the MTA TripPlanner" src="data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22656%22%20height%3D%22656%22%3E%3Cg%20transform%3D%22translate(-263.86732%2C-69.7075)%22%20style%3D%22fill%3A%23fff%22%3E%3Cpath%20%20d%3D%22M%20833.556%2C367.574%20C%20825.803%2C359.619%20814.97%2C355.419%20803.9%2C356.025%20l%20-133.981%2C7.458%2073.733%2C-83.975%20c%2010.504%2C-11.962%2013.505%2C-27.908%209.444%2C-42.157%20-2.143%2C-9.764%20-8.056%2C-18.648%20-17.14%2C-24.324%20-0.279%2C-0.199%20-176.247%2C-102.423%20-176.247%2C-102.423%20-14.369%2C-8.347%20-32.475%2C-6.508%20-44.875%2C4.552%20l%20-85.958%2C76.676%20c%20-15.837%2C14.126%20-17.224%2C38.416%20-3.097%2C54.254%2014.128%2C15.836%2038.419%2C17.227%2054.255%2C3.096%20l%2065.168%2C-58.131%2053.874%2C31.285%20-95.096%2C108.305%20c%20-39.433%2C6.431%20-74.913%2C24.602%20-102.765%2C50.801%20l%2049.66%2C49.66%20c%2022.449%2C-20.412%2052.256%2C-32.871%2084.918%2C-32.871%2069.667%2C0%20126.346%2C56.68%20126.346%2C126.348%200%2C32.662%20-12.459%2C62.467%20-32.869%2C84.916%20l%2049.657%2C49.66%20c%2033.08%2C-35.166%2053.382%2C-82.484%2053.382%2C-134.576%200%2C-31.035%20-7.205%2C-60.384%20-20.016%2C-86.482%20l%2051.861%2C-2.889%20-12.616%2C154.75%20c%20-1.725%2C21.152%2014.027%2C39.695%2035.18%2C41.422%201.059%2C0.086%202.116%2C0.127%203.163%2C0.127%2019.806%2C0%2036.621%2C-15.219%2038.257%2C-35.306%20l%2016.193%2C-198.685%20c%200.904%2C-11.071%20-3.026%2C-21.989%20-10.775%2C-29.942%20z%22%2F%3E%3Cpath%20%20d%3D%22m%20762.384%2C202.965%20c%2035.523%2C0%2064.317%2C-28.797%2064.317%2C-64.322%200%2C-35.523%20-28.794%2C-64.323%20-64.317%2C-64.323%20-35.527%2C0%20-64.323%2C28.8%20-64.323%2C64.323%200%2C35.525%2028.795%2C64.322%2064.323%2C64.322%20z%22%2F%3E%3Cpath%20d%3D%22m%20535.794%2C650.926%20c%20-69.668%2C0%20-126.348%2C-56.68%20-126.348%2C-126.348%200%2C-26.256%208.056%2C-50.66%2021.817%2C-70.887%20l%20-50.196%2C-50.195%20c%20-26.155%2C33.377%20-41.791%2C75.393%20-41.791%2C121.082%200%2C108.535%2087.983%2C196.517%20196.518%2C196.517%2045.691%2C0%2087.703%2C-15.636%20121.079%2C-41.792%20L%20606.678%2C629.11%20c%20-20.226%2C13.757%20-44.63%2C21.816%20-70.884%2C21.816%20z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"></button>' +
					'</td>' +
			 	'</tr></tbody>' +
			'</table>' +
			'<div class="route"></div>' +
		'</div>' +
		'<div id="map-tab">' +
			'<div class="map"></div>' +
			'<button class="btn-z-in btn-sq rad-all" data-zoom-incr="1" title="Zoom in">' +
				'<span class="screen-reader-only">Zoom in</span>' +
	 		'</button>' +
	 		'<button class="btn-z-out btn-sq rad-all" data-zoom-incr="-1" title="Zoom out">' +
		 		'<span class="screen-reader-only">Zoom out</span>' +
	 		'</button>' +
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
	{featureType: 'administrative', stylers:[{visibility: 'off'}]},
	{featureType: 'poi', stylers: [{visibility: 'off'}]},
	{featureType: 'poi.government', stylers: [{visibility: 'on'}]},
	{featureType: 'poi.park', stylers: [{visibility: 'on'}]}
]

export default Directions