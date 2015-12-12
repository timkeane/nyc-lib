var nyc = nyc || {};

/** 
 * @public
 * @class
 */
nyc.Directions = (function(){
	/**
	 * nyc.Directions
	 * @constructor
	 * @param {(string|Element|JQuery)} mapTarget
	 * @param {(string|Element|JQuery)} routeTarget
	 * @param {string=} url
	 */
	var dirClass = function(mapTarget, routeTarget, url){ 
		var me = this;
		me.mapTarget = mapTarget;
		me.routeTarget = routeTarget;
		me.url = (url || nyc.Directions.GOOGLE_URL) + '&callback=nyc.directions.setup';
		nyc.directions = me;
		$('.dir-mode-btn').click($.proxy(this.mode, this));
		$(window).on('orientationchange resize', me.height);
		$('#fld-from input').keypress(function(e){
			if (e.keyCode == 13){
				me.args.from = $('#fld-from input').val();
				me.directions(me.args);
			}
		});
		$("#dir-toggle a").click(function(e){
			$("#dir-toggle a").removeClass("ui-btn-active");
			$(e.target).addClass("ui-btn-active");
			$("#dir-panel").slideToggle();
		});
	};

	dirClass.prototype = {
		/** @private */
		map: null,
		/** @private */
		service: null,
		/** @private */
		renderer: null,
		/** @private */
		args: null,
		/** @private */
		modeBtn: '#mode-transit',
		/**
		 * @public
		 * @param {nyc.Directions.Args} args
		 */
		directions: function(args) {
			var me = this, mode = args.mode || 'TRANSIT';
			me.args = args;
			if (!this.map){
				setTimeout(function(){
					$.getScript(me.url);
				}, 500);
				return;
			}
			$('#fld-from input').val(args.from || '');
			$('#fld-to').html(args.to);
			$('#fld-facility').html(args.facility);
			if (args.from) {
				this.service.route(
					{
						origin: args.from,
						destination: args.to,
						travelMode: google.maps.TravelMode[mode]
					},
					function (response, status){
						if (status == google.maps.DirectionsStatus.OK){
							var leg = response.routes[0].legs[0],
								addrA = leg.start_address.replace(/\, USA/, ''),
								addrB = leg.end_address.replace(/\, USA/, '');
							me.renderer.setOptions({
								map: me.map,
								panel: $(me.routeTarget).get(0),
								directions: response
							});
							$('#fld-from input').val(addrA);
							$('#fld-to').html(addrB);
						}
						$('.dir-mode-btn').removeClass('active-mode');
						$(me.modeBtn).addClass('active-mode');
						me.height();
						setTimeout(function(){
							me.trigger(nyc.Directions.EventType.CHANGED, {response: response, status: status});
						}, 200);
					}
				);
			}
		},
		/** @public */
		setup: function(){
			this.map = new google.maps.Map($(this.mapTarget).get(0), {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				backgroundColor: '#D3D3D3',
				panControl: false,
				streetViewControl: false,
				mapTypeControl: false,
				zoomControl: false,
				maxZoom: 18,
					styles: [
					{
						featureType: 'administrative.country',
						stylers:[{visibility: 'off'}]
					},
					{
						featureType: 'administrative.province',
						stylers: [{visibility: 'off'}]},
					{
						featureType: 'administrative.land_parcel',
						stylers: [{visibility: 'off'}]
					},
					{
						featureType: 'landscape.man_made',
						stylers: [{visibility: 'on'}]
					},
					{
						featureType: 'poi.attraction',
						stylers: [{visibility: 'off'}]
					},
					{
						featureType: 'poi.business',
						stylers: [{visibility: 'off' }]
					},
					{
						featureType: 'poi.place_of_worship',
						stylers: [{visibility: 'off'}]
					},
					{
						featureType: 	'water',
						elementType: 'geometry',
						stylers: [{hue: '#A1D5F1'}, {saturation: 55}, {lightness: 13}, {visibility: 'on'}]
					},
					{
						featureType: 'transit.line',
						stylers: [{visibility: 'off'}]
					},
					{
						featureType: 'road.arterial',
						elementType: 'all',
						stylers: [{hue: '#d4d4d4'}, {saturation: -100}, {lightness: 27}, {visibility: 'on'}]
					},
					{
						featureType: 'road.local',
						elementType: 'all',
						stylers: [{hue: '#e8e8e8'}, {saturation: -100}, {lightness: -9}, {visibility: 'on'}]
					},
					{
						featureType: 'road.highway',
						elementType: 'all',
						stylers: [{hue: '#bababa'}, {saturation: -100}, {lightness: 25}, {visibility: 'on'}]
					},
					{
						featureType: 'poi.park',
						elementType: 'all',
						stylers: [{hue: '#D6DDD5'}, {saturation: -76}, {lightness: 32}, {visibility: 'on'}]
					},
					{
						featureType: 'poi.school',
						elementType: 'all',
						stylers: [{hue: '#DAD4C3'}, {saturation: -51}, {lightness: -2}, { visibility: 'on'}]
					}
				]
			});
			this.service = new google.maps.DirectionsService();
			this.renderer = new google.maps.DirectionsRenderer();
			this.directions(this.args);
		},
		/** @private 
		 * @param {Object} e
		 */
		mode: function(e){
			this.args = this.args || {};
			this.modeBtn = e.target;
			this.args.mode = $(this.modeBtn).data('mode');
			this.directions(this.args);
		},
		/** @private */
		height: function(){
			var h =  $('#dir-toggle').css('display') == 'block' ? $('#dir-toggle').height() : 0;
			$('#directions').height(
				$('#dir-panel').height() - h - $('.banner').height() - $('#dir-content').height() - $('#copyright').height() - 10
			);
		}
	};
	return dirClass;
}());

nyc.inherits(nyc.Directions, nyc.EventHandling);

/**
 * Enumeration for directions event type
 * @public
 * @enum {string}
 */
nyc.Directions.EventType = {CHANGED: 'changed'};

/** 
 * @const
 * @type {string}
 */
nyc.Directions.GOOGLE_URL = 'https://maps.googleapis.com/maps/api/js?&sensor=false&libraries=visualization';

/**
 * Object type for getting directions
 * 
 * @typedef {Object}
 * @property {string=} from
 * @property {string} to
 * @property {google.maps.DirectionsTravelMode} mode
 * @property {string} facility
 */
nyc.Directions.Args;
