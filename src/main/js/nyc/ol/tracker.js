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
	this.track = null;
	/**
	 * @public
	 * @member {Array<ol.Feature>}
	 */
	this.positions = null;
	/**
	 * @public
	 * @member {number}
	 */
	this.maxPoints = options.maxPoints;
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
	this.img = $('<img>').hide();
	/**
	 * @private
	 * @member {number}
	 */
	this.animationInterval = undefined;
	/**
	 * @private
	 * @member {ol.format.GeoJSON}
	 */
	this.geoJson = new ol.format.GeoJSON();
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
	this.markerOverlay = new ol.Overlay({
		positioning: 'center-center',
		element: this.img.get(0),
		stopEvent: false
	});
	map.addOverlay(this.markerOverlay);

	this.on('error', function(error){
		console.error(error.message, arguments);
	});
};

ol.inherits(nyc.ol.Tracker, ol.Geolocation);

/**
 * @desc Enable or disable tracking
 * @public
 * @override
 * @see http://openlayers.org/en/latest/apidoc/ol.Geolocation.html#setTracking
 * @method
 * @param {boolean} tracking Whether or not to track position
 */
nyc.ol.Tracker.prototype.setTracking = function(tracking){
	var wasTracking = this.getTracking();
	if (tracking){
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
			nyc.storage.removeItem(this.trackStore);
			nyc.storage.removeItem(this.positionsStore);
		}
	}
	ol.Geolocation.prototype.setTracking.call(this, tracking);
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
		var x = position[0];
		var y = position[1];
		var fCoords = this.track.getCoordinates();
		var previous = fCoords[fCoords.length - 1];
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

		var position = [x, y, heading, m];
		this.positions.push(new ol.Feature({
			id: this.positions.length,
			geometry: new ol.geom.Point(position),
			accuracy: accuracy,
			timestamp: new Date(m).toISOString()
		}));
		this.track.appendCoordinate(position);
		if (this.maxPoints){
			this.track.setCoordinates(this.track.getCoordinates().slice(-(this.maxPoints)));
		}
		this.marker(speed, heading);
		this.store();
		this.dispatchEvent({type: nyc.ol.Tracker.EventType.UPDATED, target: this});
		return true;
	}
};

/**
 * @private
 * @method
 */
nyc.ol.Tracker.prototype.store = function(){
	nyc.storage.setItem(
		this.trackStore,
		this.geoJson.writeGeometry(
			this.track,
			{featureProjection: this.view.getProjection()}
		)
	);
	nyc.storage.setItem(
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
 */
nyc.ol.Tracker.prototype.restore = function(){
	var me = this;
	var track = nyc.storage.getItem(me.trackStore);
	var positions = nyc.storage.getItem(me.positionsStore);
	if (track){
		var dia = new nyc.Dialog();
		dia.yesNo({
			message: 'Retore previous tracking data?',
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
				me.on('change', me.updatePosition, me);
				me.updatePosition();
			}
		});
	}else{
		this.reset();
		me.on('change', me.updatePosition, me);
		me.updatePosition();
	}
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

	if (me.animationInterval){
		clearInterval(me.animationInterval);
		me.updateView(end);
	}

	var start = positions[positions.length - 2];
	var marker = me.markerOverlay;

	if (!start){
		marker.setPosition(end);
		me.updateView(end);
	}else{
		var m = start[3];
		var mEnd = end[3];
		var step = (mEnd - m)/10;
		me.animationInterval = setInterval(function(){
			var p = me.track.getCoordinateAtM(m, true);
			if (m >= mEnd){
				clearInterval(me.animationInterval);
				delete me.animationInterval;
				p = end;
				me.updateView(p);
			}
			marker.setPosition(p);
			m += step;
		}, 100);
	}
};

/**
 * @private
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
		this.view.cancelAnimations();
		this.view.animate(options);
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

nyc.ol.Tracker.LOCATION_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABYgAAAWIBXyfQUwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK6SURBVDiNtdXPa9NwGMfxd9KsWxhJHWx1C1h/DIa7OCaiiDt68CB4KELn8KB3ETz5D0TUQ4+exB12WEF6GHgZjIEBKaiXiTBBh1hph50wm2izLW0eD34zdhE7oQ98IAk8r3zzDTxfTUTQNE0DkqRU+gBDJQXo/KkY6ABtlUjddwABRETkIKgrIK0yAPSrGLOzsyMAi4uLWwrcVdkB9lQ66sWCAg0FZYBR4JTjONOVSqVYq9W8VqvVEFWtVqtRq9W8SqVSdBxnGjilejLKMJKvS6lVZYAxYMJ13RvNZvOTHKhW1JFW1Dn4SJrN5ifXdW8AE6o3o6wU6rMt9dYJz/MexXEciYjU/D25s/xFzj59L8aDN2I8eCNnn76XO8tfpObviYhIHMeR53mPFD6qrHSy2gHAcl33/Nzc3GNN04z5te9ce/4Rrxqw+TMiFogFNn9GvK7/4tnaFkcH+5geHdRzudyFdDr9enV19Zva/1gDbMByHCe7vr7+3Lbt8fm179x+8Zlu6tnVk9yaGsb3/Y3Jycnr9Xq9AQTJj+svl8s3bdserwcR91aqXaEA91aq1IMI27bHy+XyTbUDxj6cy+XOATysbPJjp9M1/GOnw8PKJgDK2IdTgDE0NHQa4NXXoGs0qaRHGQaQ0gGtUChkTdMcCdsx7xrhoeF3jZCwHWOa5kihUMgCmv7Prv8sHZBSqdQIw3DLNHTOZM1DI2eyJqahE4bhVqlUagCiowbK9vb2B4BLx6xDw0mPMtpAR1cXu9Vq9S3A/YtjHBlIdY0eGUhx/+IYAMrYBdr7cD6fX/B9f8Ox+iheznUNFy/ncKw+fN/fyOfzCwmczF4tCAIsy/o4MzNzbXp0UD+e6edlNWCnLX9d6ZMrJ7g1NYyItIvF4t2lpaUN4Bd/RmhvhhD0cGz2ZND37GjSenWY/ga+vttOWmiJZgAAAABJRU5ErkJggg==';

nyc.ol.Tracker.LOCATION_HEADING_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAlCAYAAABGWhk4AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABYgAAAWIBXyfQUwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAYGSURBVEiJlZdvaFvXFcB/7+mPI8lvjmxHil0vKkuq1bCuYbVsQrDxFup9aSAezA5pExpGRh26hdF0FOIv+9CyrLCh7dvABARmyIWB6Qad69Ik1PH8h67E0C6anbqTI8myZUeWZE1/nu4+6D7n2VZpcuCgq/vu/d37zjvn3HMVIQS1RFEUxWiaFECYFPE1AGtN6iNRAYv8VWVfRaouf2tKTbDcrQG1AXbZRgKLprGVWrtW93ZIqCJBdsAB1Mfj8d/H4/F3gXrZZyymmMz2SIQQu1RCrYATaAKeDoVC54WUUCh0HnhaPnPKscpejmJ+C5MJrMABQAMOpjY2xgpW13cB6sq5e02NjQPAQyAD/A8oA7tMstcUe8Gu8fHxM41ud/u1Ww/Ua7ceqI1ud/v4+PgZwCXHWOWc3ebYYwKLHOwGfG1tbV2ZbG51IZnT1bdnhfr2rFhI5vRMNrfa1tbWBfjk2AOGvQ2eecfm3dYBznA4fKHe5fS8MbmiVgRUBLwxuaLWu5yecDh8Qdq4rtauVZNtjY9mBxx9fX0tL3QEXv3wyy0xcT+9s/rE/TQffrklXugIvNrX19fCIw+xYvIQ1QRVzeBgMPia3W5zvPlRdJ8rvflRVLHbbY5gMPjaHrBqwC01TOC6evVq++DZs78JLaTUqWiWn//Aw7s/ahOXjh/icL1d+WI9j9OmKj9sb3t2e3t74s6dOymgxKNo3Oe3h4BjiURiUgghbi5vGe4r1lOp5fVUatn4bzxLJBKTwDE5d8evDTvbqEaUd2xsbNCYXNb10szMzGh/f//LwIvAi/39/S/PzMyMlnW9ZIwbGxsbBLySYTO+3S7ww4dbt4QQIrm29unQ0NArQC/QA3RL7QF6h4aGXkmurX0qhBDp9NYne8H7XGx+fv58Op22njp16pb8KCpAIBCoB5ibm8vKb1gBihMTEz1ut7sQCAT+AuSoJqiyERRGYLiohrHW0NDQEA6Hf+L3+497PJ5jLpfLC5DL5VaTyeRiJBL5bHBw8K/pdDpNNbS3gG2qIa4jd+sAGoEjwPeHh4cvbm5uLgqTFPWKKOoVc5fY3NxcHB4evgg8J+c2SpZVka9bJ+1z8ObNmxd7enp+pSiK9at0kd9Nx5mN5VhIbgPwnMdJZ6uLX59owddgRwhRvn379h96e3tvUE1MWaBgkVAHoF2/fr3r3Llzv1UUxfrnf63R/94iUytZYtkSugBdQCxbYi6eY+SzdZqcVjpaXKrP5+tyOp1zk5OTCaqZTleAbwGa3+9vnZ+ff0/TNN+f5lb55cR/9wZcTflj3xF+EfCSyWS+6ujo+GkkEokBmZ0UOTo6ekHTNN/iZoG3Pl55LCjAWx+vsLhZQNM03+jo6AXpBNad/NDa2noc4J2pGNulrz0j98l2qcI7UzEAJMNugC2A1e12Pwvwzwe5x4YaYsyRDCtgUQF1YGCg2eFwNGeKOvdS+ScG30vlyRR1HA5H88DAQDOgqoCIRqMFIYSos6jY1P0H7jeJTVWos6gIIUQ0Gi0AQgUq09PTW7lcbsVuUXje63xi8PNeJ3aLQi6XW5ment4CKirV8CttbGz8G6DniPbEYGOOZJQAXaXq0MVIJDIFcO1kC09p9seGPqXZuXayBQDJ2ElCGtVwbkwkEiNer7frH/fTvBT+D+VK7YLREKuq8LfBZ/jxdxpYXV2dOXz48M+ADSBrLvjUeDx+9/Tp02f8zc66l545yJ2VLMntck3o9w45+PtZP93f1iiVSpnLly8PLSwsJKhmuAJUE7OL6tFydGRk5FI+n08KIUShrIvQ3XXx+gfL4sSNz8WJG5+L1z9YFqG766JQ1oUQQuTz+eTIyMgl4KhkuCRzp/jTAA9wtLu7++TS0tL74htkaWnp/e7u7pMS6pEMO2CpdfQfoJrtXMFgsKOzs7OztbW1vampyQ+QSqUisVjsi9nZ2dkrV67MUz018lQTfBFZxylCiFr1sI1qOq1jd80A1SOpLCEFqSVMx78QQuxUmya4sYBFAo22+aqgSy2b2hVMFWetMtasxkK17iDGlWHnTmIuY/8P3C0FYo4OztIAAAAASUVORK5CYII=';
