var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc A class for tracking position from device Geolocation
 * @public
 * @class
 * @extends {ol.Geolocation}
 * @see http://openlayers.org/en/latest/apidoc/ol.Geolocation.html
 * @constructor
 * @param {nyc.ol.Tracker.Options} options Constructor options
 * @fires nyc.ol.Tracker#updated
 */
nyc.ol.Tracker = function(options){
	/**
	 * @public
	 * @member {ol.geom.LineString}
	 */
	 this.track = new ol.geom.LineString([], 'XYZM');
	/**
	 * @public
	 * @member {Array<ol.Feature>}
	 */
	 this.positions = [];
	/**
	 * @public
	 * @member {number}
	 */
	this.maxPoints = options.maxPoints;
	/**
	 * @public
	 * @member {number}
	 */
	this.accuracyLimit = options.accuracyLimit === undefined ? 0 : options.accuracyLimit;
	/**
	 * @public
	 * @member {boolean}
	 */
	this.recenter = options.recenter === undefined ? true : options.recenter;
	/**
	 * @public
	 * @member {boolean}
	 */
	this.rotate = options.rotate === undefined ? true : options.rotate;
	/**
	 * @public
	 * @member {number}
	 */
	this.startingZoomLevel = options.startingZoomLevel === undefined ? 16 : options.startingZoomLevel;
	/**
	 * @public
	 * @member {boolean}
	 */
	this.currentZoomLevel = options.currentZoomLevel === undefined ? false : options.currentZoomLevel;
	/**
	 * @private
	 * @member {ol.Map}
	 */
	this.map = options.map;
	/**
	 * @private
	 * @member {ol.View}
	 */
	this.view = this.map.getView();
	/**
	 * @private
	 * @member {number}
	 */
	this.deltaMean = 500;
	/**
	 * @private
	 * @member {number}
	 */
	this.previousM = 0;
	/**
	 * @private
	 * @member {boolean}
	 */
	this.firstRun = true;
	/**
	 * @private
	 * @member {JQuery}
	 */
	this.img = $('<img class="current-position">').hide();
	/**
	 * @private
	 * @member {number}
	 */
	this.animationInterval;
	/**
	 * @dec For testing only
	 * @private
	 * @member {number}
	 */
	this.animationStep;
	/**
	 * @dec For testing only
	 * @private
	 * @member {Array<ol.Coordinate>}
	 */
	this.animatedPositions = [];
	/**
	 * @private
	 * @member {boolean}
	 */
	this.animating = false;
	/**
	 * @private
	 * @member {ol.format.GeoJSON}
	 */
	this.geoJson = new ol.format.GeoJSON();
	/**
	 * @private
	 * @member {nyc.ol.storage.Local}
	 */
	this.storage = new nyc.ol.storage.Local();
	/**
	 * @private
	 * @member {nyc.ol.NorthArrow}
	 */
	this.northArrow = new nyc.ol.NorthArrow(this.map);
	this.showNorth(options.northArrow);

	var appUrl = document.location.href.replace(document.location.search, '');
	/**
	 * @private
	 * @member {string}
	 */
	this.trackStore = appUrl + 'nyc.ol.Tracker.track';
	/**
	 * @private
	 * @member {string}
	 */
	this.positionsStore = appUrl + 'nyc.ol.Tracker.positions';

	ol.Geolocation.call(this, {
		projection: this.view.getProjection(),
		trackingOptions: this.createTrackOpts(options.trackingOptions)
	});

	$('body').append(this.img);

	var overlayOpts = {
		positioning: 'center-center',
		element: this.img.get(0),
		stopEvent: false
	};
	this.markerOverlay = new ol.Overlay(overlayOpts);
	this.markerOverlay.setProperties(overlayOpts); // for testing to ensure proper args were used
	this.map.addOverlay(this.markerOverlay);

	this.on('change', this.updatePosition, this);
	this.on('error', function(error){
		console.error(error.message, arguments);
	});
};

ol.inherits(nyc.ol.Tracker, ol.Geolocation);

/**
 * @desc Restore previous tracking data if available
 * @public
 * @method
 */
nyc.ol.Tracker.prototype.restore = function(){
	var me = this;
	var track = me.storage.getItem(me.trackStore);
	var positions = me.storage.getItem(me.positionsStore);
	if (track){
		var dia = new nyc.Dialog();
		dia.yesNo({
			message: 'Restore previous tracking data?',
			callback: function(yesNo){
				if (yesNo){
					var opts = {
						dataProjection: 'EPSG:4326',
						featureProjection: me.view.getProjection()
					};
					me.track = me.geoJson.readGeometry(track, opts);
					me.positions = me.geoJson.readFeatures(positions, opts);
					me.updateView(me.positions[me.positions.length - 1]);
				}else{
					me.reset();
				}
			}
		});
	}else{
		this.reset();
	}
	me.updatePosition();
};

/**
 * @desc Enable or disable tracking
 * @public
 * @override
 * @see http://openlayers.org/en/latest/apidoc/ol.Geolocation.html#setTracking
 * @method
 * @param {boolean} tracking Whether or not to track position
 */
nyc.ol.Tracker.prototype.setTracking = function(tracking){
	if (tracking){
		var wasTracking = this.getTracking();
		if (this.firstRun){
			this.firstRun = false;
			this.restore();
		}else if (!wasTracking){
			this.reset();
		}
		this.showNorth(true);
		this.img.show();
	}else{
		this.showNorth(false);
		this.img.hide();
		if (!this.firstRun){
			this.storage.removeItem(this.trackStore);
			this.storage.removeItem(this.positionsStore);
		}
	}
	ol.Geolocation.prototype.setTracking.call(this, tracking);
};

/**
 * @desc Orient the view to the current position
 * @public
 * @method
 * @param {ol.Coordinate|ol.Feature} position
 */
nyc.ol.Tracker.prototype.updateView = function(position){
	var pIdx = this.positions.length - 1;
	if (pIdx % 2 == 0){
		var options;
		if ('getGeometry' in position){
			position = position.getGeometry().getCoordinates();
			options = {zoom: this.startingZoomLevel};
		}else if (!this.currentZoomLevel && pIdx == 0){
			options = {zoom: this.startingZoomLevel};
		}
		if (this.recenter){
			options = options || {};
			options.center = this.getCenterWithHeading(position, -position[2], options.zoom);
		}
		if (this.rotate){
			options = options || {};
			options.rotation = -position[2];
		}
		if (options){
			this.view.cancelAnimations();
			this.view.animate(options);
		}
	}
};

/**
 * @private
 * @method
 * @param {boolean} showNorth
 */
nyc.ol.Tracker.prototype.showNorth = function(show){
	if (show === undefined || show){
		this.northArrow.show();
	}else{
		this.northArrow.hide();
	}
};

/**
 * @private
 * @method
 * @param {GeolocationPositionOptions=} options
 * @return {GeolocationPositionOptions}
 */
nyc.ol.Tracker.prototype.createTrackOpts = function(options){
	var trackOpts = options || {};
	trackOpts.maximumAge = trackOpts.maximumAge === undefined ? 10000 : trackOpts.maximumAge;
	trackOpts.enableHighAccuracy = trackOpts.enableHighAccuracy === undefined ? true : trackOpts.enableHighAccuracy;
	trackOpts.timeout = trackOpts.timeout === undefined ? 600000 : trackOpts.timeout;
	return trackOpts;
};

/**
 * @private
 * @method
 */
nyc.ol.Tracker.prototype.updatePosition = function(){
	var position = this.getPosition();
	if (position){
		var accuracy =  this.getAccuracy();
		var heading =  this.getHeading() || 0;
		var speed =  this.getSpeed() || 0;
		if (this.addPosition(position, accuracy, heading, Date.now(), speed)){
			var positions = this.track.getCoordinates();
			var len = positions.length;
			if (len >= 2){
				this.deltaMean = (positions[len - 1][3] - positions[0][3]) / (len - 1);
			}
			this.animate();
		}
	}
};

/**
 * @private
 * @method
 * @param {ol.Coordinate} position
 * @param {number} accuracy
 * @param {number} heading
 * @param {number} m
 * @param {number} speed
 * @return {boolean}
 */
nyc.ol.Tracker.prototype.addPosition = function(position, accuracy, heading, m, speed){
	if (!this.accuracyLimit || accuracy <= this.accuracyLimit){
		heading = this.determineHeading(position, heading);
		this.updateGeometries(position, accuracy, heading, m);
		this.marker(speed, heading);
		this.dispatchEvent({type: nyc.ol.Tracker.EventType.UPDATED, target: this});
		return true;
	}
};

/**
 * @private
 * @method
 * @param {ol.Coordinate} position
 * @param {number} accuracy
 * @param {number} m
 */
nyc.ol.Tracker.prototype.updateGeometries = function(position, accuracy, heading, m){
	position = [position[0], position[1], heading, m];
	this.positions.push(new ol.Feature({
		id: this.positions.length,
		geometry: new ol.geom.Point(position),
		accuracy: accuracy,
		timestamp: new Date(m).toISOString()
	}));
	this.track.appendCoordinate(position);
	if (this.maxPoints){
		this.track.setCoordinates(this.track.getCoordinates().slice(-this.maxPoints));
		this.positions = this.positions.slice(-this.maxPoints);
	}
	this.store();
};

/**
 * @private
 * @method
 * @param {ol.Coordinate} position
 * @param {number} heading
 * @return {number}
 */
nyc.ol.Tracker.prototype.determineHeading = function(position, heading){
	var coords = this.track.getCoordinates();
	var previous = coords[coords.length - 1];
	var prevHeading = previous && previous[2];
	if (prevHeading){
		var headingDiff = heading - this.mod(prevHeading);
		// force the rotation change to be less than 180°
		if (Math.abs(headingDiff) > Math.PI){
			var sign = (headingDiff >= 0) ? 1 : -1;
			headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff));
		}
		heading = prevHeading + headingDiff;
	}
	return heading;
};

/**
 * @private
 * @method
 */
nyc.ol.Tracker.prototype.store = function(){
	this.storage.setItem(
		this.trackStore,
		this.geoJson.writeGeometry(
			this.track,
			{featureProjection: this.view.getProjection()}
		)
	);
	this.storage.setItem(
		this.positionsStore,
		this.geoJson.writeFeatures(
			this.positions,
			{featureProjection: this.view.getProjection()}
		)
	);
};

/**
 * @private
 * @method
 */
nyc.ol.Tracker.prototype.reset = function(){
	this.track = new ol.geom.LineString([], 'XYZM');
	this.positions = [];
	this.store();
};

/**
 * @private
 * @method
 * @param {number} heading
 * @param {number} speed
 */
nyc.ol.Tracker.prototype.marker = function(speed, heading){
	if (speed){
		this.img.attr('src', nyc.ol.Tracker.LOCATION_HEADING_IMG);
		if (!this.rotate){
			// not rotating view so let's rotate marker
			var transform = 'rotate(' + heading + 'rad)';
			this.img.css({
				transform: transform,
				'-webkit-transform': transform,
				'-ms-transform': transform
			});
		}
	}else{
		this.img.attr('src', nyc.ol.Tracker.LOCATION_IMG);
	}
};

/**
 * @private
 * @method
 * @param {ol.Coordinate} position
 * @param {number} rotation
 * @param {number} zoom
 */
nyc.ol.Tracker.prototype.getCenterWithHeading = function(position, rotation, zoom){
	var size = this.map.getSize();
	var resolution = zoom ? nyc.ol.TILE_GRID.getResolution(zoom) : this.view.getResolution();
	var height = size[1];
	return [
		position[0] - Math.sin(rotation) * height * resolution / 4,
		position[1] + Math.cos(rotation) * height * resolution / 4
	];
};

/**
 * @private
 * @method
 */
nyc.ol.Tracker.prototype.animate = function(){
	var me = this;
	var positions = me.track.getCoordinates();
	var end = positions[positions.length - 1];
	var start = positions[positions.length - 2];
	var marker = me.markerOverlay;

	me.animatedPositions = [];

	if (start){
		if (me.animating){
			me.animating = false;
			clearInterval(me.animationInterval);
			me.updateView(end);
		}
		var m = start[3];
		var mEnd = end[3];
		var step = (mEnd - m)/10;
		me.animating = true;
		me.animationInterval = setInterval(function(){
			var p = me.track.getCoordinateAtM(m, true);
			if (m >= mEnd){
				me.animating = false;
				clearInterval(me.animationInterval);
				p = end;
				me.updateView(p);
			}
			me.animatedPositions.push(p);
			marker.setPosition(p);
			m += step;
		}, me.animationStep || 100);
	}else{
		marker.setPosition(end);
		me.updateView(end);
	}
};

/**
 * @private
 * @method
 * @param {number} n
 */
nyc.ol.Tracker.prototype.mod = function(n){
	return ((n % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
};

/**
 * @desc Object type to hold constructor options for {@link nyc.ol.Tracker}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map on which to track locations
 * @property {GeolocationPositionOptions=} trackingOptions Tracking options @see http://www.w3.org/TR/geolocation-API/#position_options_interface
 * @property {boolean} [recenter=true] Recenter the view on location change
 * @property {boolean} [rotate=true] Rotate the view on location change
 * @property {boolean} [showNorth=true] Show a north arrow on the map
 * @property {number} [maxPoints=0] The maximum number of points to retain in the track (0 = unlimited)
 * @property {number} [startingZoomLevel=16] The zoom for the view when tracking begins
 * @property {boolean} [currentZoomLevel=false] Use the current zoom level of the view when tracking begins and ignore startingZoomLevel
 * @property {number} [accuracyLimit=0] The maximum accuracy distance for an acceptable position (0 = unlimited)
 */
nyc.ol.Tracker.Options;

/**
 * @desc The updated event
 * @event nyc.ol.Tracker#updated
 * @type {ol.events.Event}
 */

/**
 * @desc Enumeration for tracker event types
 * @public
 * @enum {string}
 */
nyc.ol.Tracker.EventType = {
	/**
	 * @desc The updated event type
	 */
	UPDATED: 'updated'
};

nyc.ol.Tracker.LOCATION_IMG = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22256%22%20height%3D%22256%22%3E%3Ccircle%20cx%3D%22128%22%20cy%3D%22128%22%20r%3D%2264%22%20style%3D%22fill%3A%2338c%3Bstroke%3A%23fff%3Bstroke-width%3A15%22%2F%3E%3C%2Fsvg%3E';

nyc.ol.Tracker.LOCATION_HEADING_IMG = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22256%22%20height%3D%22256%22%3E%3Cpath%20stroke-linejoin%3D%22round%22%20stroke-linecap%3D%22round%22%20style%3D%22fill%3A%2338c%3Bstroke-width%3A15%3Bstroke%3A%23fff%22%20d%3D%22M128%208%20L%2055%2080%20L%20128%2060%20L%20201%2080%20L%20128%208%22%2F%3E%3Ccircle%20cx%3D%22128%22%20cy%3D%22128%22%20r%3D%2264%22%20style%3D%22fill%3A%2338c%3Bstroke%3A%23fff%3Bstroke-width%3A15%22%2F%3E%3C%2Fsvg%3E';
