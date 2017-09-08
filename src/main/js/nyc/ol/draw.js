var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc A class to provide the user with drawing tools
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.ol.Draw.Options} options Constructor options
 * @fires nyc.ol.Draw#addfeature
 * @fires nyc.ol.Draw#changefeature
 * @fires nyc.ol.Draw#removefeature
 */
nyc.ol.Draw = function(options){
	this.features = new ol.Collection();
	this.map = options.map;
	this.view = this.map.getView();
	this.source = new ol.source.Vector({features: this.features});
	this.viewport = $(this.map.getViewport());
	this.removed = [];
	
	this.layer = new ol.layer.Vector({
		source: this.source,
		style: options.style || this.defaultStyle
	});
	this.map.addLayer(this.layer);
	
	this.modify = new ol.interaction.Modify({
		features: this.features,
		deleteCondition: $.proxy(this.deleteCondition, this)
	});

	this.buttonMenu();
	this.mover = new nyc.ol.Drag(this.layer);
	this.mover.setActive(false);
	this.map.addInteraction(this.mover);
	this.viewport.on('contextmenu', $.proxy(this.contextMenu, this));
};

nyc.ol.Draw.prototype = {
	/**
	 * @private
	 * @member {ol.interaction.Interaction}
	 */
	drawer: null,
	/**
	 * @private
	 * @member {nyc.ol.Drag}
	 */
	mover: null,
	/**
	 * @private
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {Array<ol.Feature>}
	 */
	removed: null,
	/**
	 * @private
	 * @member {nyc.ol.Draw.Type}
	 */
	type: null,
	/**
	 * @private
	 * @member {ol.source.Vector}
	 */
	layer: null,
	/**
	 * @private
	 * @member {ol.layer.Vector}
	 */
	source: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	viewport: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	mnuBtn: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	btnMnu: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	ctxMnu: null,
	/**
	 * @private
	 * @member {ol.style.Style}
	 */
	defaultStyle: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255,255,255,0.2)'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(255,0,0,0.7)',
			width: 2
		}),
		image: new ol.style.Circle({
			radius: 7,
			fill: new ol.style.Fill({
				color: 'red'
			})
		})
	}),
	/**
	 * @desc Return the active state
	 * @public
	 * @method
	 * @return {boolean} The active state
	 */
	active: function(){
		if (this.drawer) return this.drawer.getActive();
		if (this.geolocation) return true;
		return false;
	},
	/**
	 * @desc Activate to begin adding drawings of the specified type
	 * @public
	 * @method
	 * @param {nyc.ol.Draw.Type} type The drawing type to activate
	 */
	activate: function(type){
		var me = this;
		me.deactivate();
		me.type = type;
		if (type != nyc.ol.Draw.Type.NONE){
			var geometryFunction, maxPoints;
			$('draw-ctx-mnu').addClass(type);
			me.source.on('addfeature', me.triggerFeatureEvent, me);
			me.source.on('changefeature', me.triggerFeatureEvent, me);
			if (type == nyc.ol.Draw.Type.GPS || type == nyc.ol.Draw.Type.FREE){
				type = nyc.ol.Draw.Type.LINE;
			}else if (type == nyc.ol.Draw.Type.SQUARE){
				type = nyc.ol.Draw.Type.CIRCLE;
				geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
			}else if (type == nyc.ol.Draw.Type.BOX){
				type = nyc.ol.Draw.Type.LINE;
				maxPoints = 2;
				geometryFunction = me.boxGeometry;
			}
			
			if (me.type == nyc.ol.Draw.Type.GPS){
				me.beginGpsCapture();
			}else{
				me.drawer = new ol.interaction.Draw({
					source: me.source,
					type: type,
					geometryFunction: geometryFunction,
					maxPoints: maxPoints,
					freehandCondition: $.proxy(me.freehandCondition, me),
					condition: $.proxy(me.drawCondition, me)
				});
				me.map.addInteraction(me.drawer);
				me.map.addInteraction(me.modify);
				$(document).keyup(function(evt){
					if (evt.keyCode == 27){
						me.escape();
					}
				});
			}
		}
	},
	getGpsFeature: function(){
		if (!this.gpsFeature || $.inArray(this.gpsFeature, this.features.getArray()) == -1){
			this.gpsFeature = new ol.Feature({geometry: new ol.geom.LineString([])});
			this.features.push(this.gpsFeature);
		}
		return this.gpsFeature;
	},
	beginGpsCapture: function(){
		this.getGpsFeature();
		this.geolocation = new ol.Geolocation({
			trackingOptions: {
				maximumAge: 10000,
				enableHighAccuracy: true,
				timeout: 600000
			}
		});
		this.geolocation.on('change', this.addGpsCoordinate, this);
		this.geolocation.on('error',this.geolocationError, this);
		this.geolocation.setTracking(true);
	},
	geolocationError: function(error) {
		console.error(error.message, error);
	},
	addGpsCoordinate: function(){
		var gpsFeature = this.getGpsFeature(),
			geom = gpsFeature.getGeometry(),
			coords = geom.getCoordinates();
		coords.push(proj4('EPSG:4326', this.view.getProjection().getCode(), this.geolocation.getPosition()));
		gpsFeature.setGeometry(new ol.geom.LineString(coords));
	},
	/**
	 * @desc Creates the drawn geometry for a box
	 * @public
	 * @method
	 * @param {Array<ol.Coordinate>} coordinates The coordinates from which to create the box geometry
	 * @param {ol.geom.Polygon=} geometry The current box geometry to modify
	 * @return {ol.geom.Polygon} The box geometry
	 */
	boxGeometry: function(coordinates, geometry){
		if (!geometry){
			geometry = new ol.geom.Polygon(null);
		}
		var start = coordinates[0];
		var end = coordinates[1];
		if (end){
			geometry.setCoordinates([
                 [start, [start[0], end[1]], end, [end[0], start[1]], start]
            ]);
		}
		return geometry;
	},
	/**
	 * @desc Determines if a feature should be deleted 
	 * @public
	 * @method
	 * @param {ol.MapBrowserEvent} mapEvent The map event
	 * @return {boolean}
	 */
	deleteCondition: function(event){
		if (ol.events.condition.singleClick(event) && ol.events.condition.noModifierKeys(event)){
			this.escape();
			return true;
		}
	},
	/**
	 * @desc Determines if drawing should take place 
	 * @public
	 * @method
	 * @param {ol.MapBrowserEvent} mapEvent The map event
	 * @return {boolean}
	 */
	drawCondition: function(mapEvt){
	    var evt = mapEvt.originalEvent;
		return evt.button != 2 &&
			!evt.shiftKey &&
			!$(evt.target).hasClass('draw-mnu-btn') &&
			!this.mover.getActive();
	},
	/**
	 * @desc Determines if freehand drawing should take place 
	 * @public
	 * @method
	 * @param {ol.MapBrowserEvent} mapEvent The map event
	 * @return {boolean}
	 */
	freehandCondition: function(mapEvt){
		return this.type == nyc.ol.Draw.Type.FREE && this.drawCondition(mapEvt);
	},
	/**
	 * @desc Get the features that have been drawn
	 * @public
	 * @method
	 * @return {Object<string, Array<ol.Feature>>} The features
	 */
	getFeatures: function(){
		var features = {added: [], changed: [], unchanged: [], removed: this.removed};
		this.features.forEach(function(feature){
			if (feature._added){
				features.added.push(feature);
			}else if (feature._changed){
				features.changed.push(feature);
			}else{
				features.unchanged.push(feature);
			}
		});
		return features;
	},
	/**
	 * @desc Set features on the drawing
	 * @public
	 * @method
	 * @param {Array<nyc.ol.Feature>} The features
	 */
	setFeatures: function(features){
		var feats = this.features;
		feats.clear();
		this.removed = [];
		$.each(features, function(){
			feats.push(this);
		});
	},
	/**
	 * @private
	 * @method
	 */
	escape: function(){
		var drawer = this.drawer;
		if (drawer && drawer.getActive()){
			drawer.setActive(false);
			drawer.setActive(true);
		}
	},
	/**
	 * @private
	 * @method
	 */
	closeMenus: function(){
		$('.draw-ctx-mnu, .draw-btn-mnu').slideUp(function(){
			$('.draw-ctx-mnu').remove();
		});
	},
	/**
	 * @private
	 * @method
	 */
	buttonMenu: function(){
		var me = this, viewport = me.viewport;
		viewport.find('.ol-overlaycontainer-stopevent').append(nyc.ol.Draw.BUTTON_MENU_HTML).trigger('create');
		me.btnMnu = viewport.find('.draw-btn-mnu');
		me.mnuBtn = viewport.find('.draw-btn');
		me.mnuBtn.click(function(){
			me.btnMnu.slideToggle();
		});
		viewport.find('.draw-mnu-btn').each(function(_, btn){
			$(btn).click($.proxy(me.choose, me));
		});
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	choose: function(event){
		var me = this, btn = event.target;
		if (btn.tagName.toLowerCase() == 'button'){
			btn = $(btn).parent().get(0);
		}
		var type = $(btn).data('draw-type'), css = btn.className.split(' ')[1] || '';
		if (css == 'delete'){
			this.clear();
		}else if(css == 'cancel'){
			me.deactivate();
		}else{
			me.activate(type);
			me.mnuBtn.removeClass('point line polygon circle square box free gps');
			me.mnuBtn.addClass(css);
		}
		me.closeMenus();
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	contextMenu: function(event){
		var me = this, map = me.map;
		if (me.active()){
			var feature = map.forEachFeatureAtPixel(
				map.getEventPixel(event), function(feature){
		    		if ($.inArray(feature, me.features.getArray()) > -1){
		    			return feature;
		    		}
		        });
		    if (feature){
				me.showContextMenu(event, feature);
		    }
		}
	    return false;
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Feature} feature
	 */
	showContextMenu: function(event, feature){
		var me = this, left = event.offsetX, ctxMnu = $('.draw-ctx-mnu');
		if (!ctxMnu.length){
			ctxMnu = $(nyc.ol.Draw.CONTEXT_MENU_HTML);
		}
		ctxMnu.addClass(me.type.toLowerCase());
		me.viewport.one('click', function(e){
    		me.escape();
	    	me.closeMenus();
		});
		me.viewport.find('.ol-overlaycontainer-stopevent').append(ctxMnu);
		if (left + 125 > me.viewport.width()) {
			left = left - 125;
		}
		ctxMnu.css({left: left + 'px', top: event.offsetY + 'px'});
    	ctxMnu.slideDown();
    	ctxMnu.find('.delete').one('click', function(){
    		me.removeFeature(feature);
	    	me.closeMenus();
    	});
    	ctxMnu.find('.move').one('click', function(){
    		me.mover.setActive(true);
	    	me.closeMenus();
    	});
    },
	/**
	 * @public
	 * @method
	 * @param {ol.Feature} feature
	 */
	removeFeature: function(feature){
		this.source.removeFeature(feature);
		this.removed.push(feature);
		this.trigger(nyc.ol.FeatureEventType.REMOVE, feature);
	},
	/**
	 * @desc Remove all drawn features
	 * @public
	 * @method
	 */
	clear: function(){
		this.source.clear();
		this.removed = [];
	},
	/**
	 * @desc Deactivate to stop drawing
	 * @public
	 * @method
	 */
	deactivate: function(){
		this.type = null;
		this.mnuBtn.removeClass('point line polygon circle square box free gps');
		this.map.removeInteraction(this.modify);
		if (this.drawer){
			this.map.removeInteraction(this.drawer);
			this.source.un('addfeature', this.triggerFeatureEvent, this);
			this.source.un('changefeature', this.triggerFeatureEvent, this);
			delete this.drawer;
		}
		if (this.geolocation){
			this.closePolygon(nyc.ol.FeatureEventType.CHANGE, this.getGpsFeature());
			this.geolocation.un('change', this.addGpsCoordinate, this);
			this.geolocation.un('error',this.geolocationError, this);
			delete this.geolocation;
		}
		if (this.drag){
			theis.drag.setActive(false);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.source.VectorEvent} event
	 */
	triggerFeatureEvent: function(event){
		var feature = event.feature;
		this.source.un('addfeature', this.triggerFeatureEvent, this);
		this.source.un('changefeature', this.triggerFeatureEvent, this);
		if (event.type == nyc.ol.FeatureEventType.ADD){
			feature._added = true;
		}else if (event.type == nyc.ol.FeatureEventType.CHANGE){
			feature._changed = true;				
		}
		if (this.type == nyc.ol.Draw.Type.FREE){
			this.closePolygon(event.type, feature);
		}else{
			this.triggerEvent(event.type, feature);
		}
		this.source.on('addfeature', this.triggerFeatureEvent, this);
		this.source.on('changefeature', this.triggerFeatureEvent, this);
	},
	/**
	 * @private
	 * @method
	 */
	closePolygon: function(eventType, feature){
		var me = this;
		me.dia = me.dia || new nyc.Dialog();
		me.dia.yesNo({message: 'Create ploygon?', callback: function(yesNo){
			me.triggerEvent(eventType, feature, yesNo);
		}});
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Feature} feature
	 * @param {boolean} polygon
	 * @return {ol.Feature}
	 */
	geomToPolygon: function(feature, polygon){
		var geom = feature.getGeometry();
		if (geom.getType() == 'Circle'){
			feature.setGeometry(ol.geom.Polygon.fromCircle(geom));
		}else if (polygon){
			feature.setGeometry(new ol.geom.Polygon([geom.getCoordinates()]));
		}
		return feature;
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.ol.Draw.Type} drawType
	 */
	triggerEvent: function(type, feature, polygon){
		this.trigger(type, this.geomToPolygon(feature, polygon));
	}
};

nyc.inherits(nyc.ol.Draw, nyc.EventHandling);

/**
 * @desc Constructor options for {@link nyc.ol.Draw}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The OpenLayers map with which the user will interact
 * @property {ol.style.Style=} style The style to use for features added to the map
 */
nyc.ol.Draw.Options;

/**
 * @desc Enumeration for feature event types
 * @public
 * @enum {string}
 */
nyc.ol.Draw.Type  = {
	/**
	 * @desc The point drawing type
	 */
	POINT: 'Point',
	/**
	 * @desc The line drawing type
	 */
	LINE: 'LineString',
	/**
	 * @desc The polugon drawing type
	 */
	POLYGON: 'Polygon',
	/**
	 * @desc The circle drawing type
	 */
	CIRCLE: 'Circle',
	/**
	 * @desc The square drawing type
	 */
	SQUARE: 'Square',
	/**
	 * @desc The box drawing type
	 */
	BOX: 'Box',
	/**
	 * @desc The freehand drawing type
	 */
	FREE: 'Free',
	/**
	 * @desc The GPS capture drawing type
	 */
	GPS: 'GPS',
	/**
	 * @desc No drawing type
	 */
	NONE: 'None'
};

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.Draw.CONTEXT_MENU_HTML = '<div class="ctl ol-unselectable draw-ctx-mnu">' +
		'<div class="draw-mnu-btn delete"><button class="ctl-btn ui-btn ui-corner-top">Delete feature</button></div>' +
		'<div class="draw-mnu-btn move"><button class="ctl-btn ui-btn ui-corner-bottom">Move feature</button></div>' +
	'</div>';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.Draw.BUTTON_MENU_HTML = '<a class="draw-btn ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext">Draw</a></div>' +
	'<div class="ol-unselectable ctl draw-btn-mnu">' +
		'<div class="draw-mnu-btn point" data-draw-type="Point"><button class="ctl-btn ui-btn ui-corner-top" title="Click to draw a point">Point</button></div>' +
		'<div class="draw-mnu-btn line" data-draw-type="LineString"><button class="ctl-btn ui-btn" title="Click to draw each point of a line">Line</button></div>' +
		'<div class="draw-mnu-btn polygon" data-draw-type="Polygon"><button class="ctl-btn ui-btn" title="Click to draw each point of a polygon">Polygon</button></div>' +
		'<div class="draw-mnu-btn circle" data-draw-type="Circle"><button class="ctl-btn ui-btn" title="Click then drag to draw a circle">Circle</button></div>' +
		'<div class="draw-mnu-btn square" data-draw-type="Square"><button class="ctl-btn ui-btn" title="Click then drag to draw a square">Square</button></div>' +
		'<div class="draw-mnu-btn box" data-draw-type="Box"><button class="ctl-btn ui-btn" title="Click then drag to draw a box">Box</button></div>' +
		'<div class="draw-mnu-btn free" data-draw-type="Free"><button class="ctl-btn ui-btn" title="Click and drag to draw a freehand line">Freehand</button></div>' +
		'<div class="draw-mnu-btn gps" data-draw-type="GPS"><button class="ctl-btn ui-btn" title="Capture coordiantes from device geoloaction">GPS Capture</button></div>' +
		'<div class="draw-mnu-btn delete" data-draw-type="None"><button class="ctl-btn ui-btn" title="Delete all drawn features">Clear All</button></div>' +
		'<div class="draw-mnu-btn cancel" data-draw-type="None"><button class="ctl-btn ui-btn ui-corner-bottom" title="Deactivate drawing">Deactivate</button></div>' +
	'</div>';

/**
 * @desc A class to move features
 * @class
 * @extends {ol.interaction.Pointer}
 * @constructor
 * @param {ol.layer.Vector} layer The layer whose features can be moved
 * @see http://www.openlayers.org/
 */
nyc.ol.Drag = function(layer){
	/**
	 * @private
	 * @member {ol.layer.Vector}
	 */
	this.layer = layer;
	ol.interaction.Pointer.call(this, {
		handleDownEvent: nyc.ol.Drag.prototype.handleDownEvent,
		handleDragEvent: nyc.ol.Drag.prototype.handleDragEvent,
		handleMoveEvent: nyc.ol.Drag.prototype.handleMoveEvent,
		handleUpEvent: nyc.ol.Drag.prototype.handleUpEvent
	});
	/**
	 * @private
	 * @member {ol.Pixel}
	 */
	this.coords = null;
	/**
	 * @private
	 * @member {ol.Feature}
	 */
	this.feature = null;
	/**
	 * @private
	 * @member {string}
	 */
	this.prevCursor = null;
};

ol.inherits(nyc.ol.Drag, ol.interaction.Pointer);

/**
 * @private
 * @method
 * @param {ol.MapBrowserEvent} event
 * @return {boolean}
 */
nyc.ol.Drag.prototype.handleDownEvent = function(event){
	var me = this, map = event.map;
	var feature = map.forEachFeatureAtPixel(event.pixel, function(feature, layer){
		if (layer === me.layer){
			return feature;
		}
	});
	if (feature) {
		this.coords = event.coordinate;
		this.feature = feature;
	}
	return !!feature;
};

/**
 * @private
 * @method
 * @param {ol.MapBrowserEvent} event
 */
nyc.ol.Drag.prototype.handleDragEvent = function(event){
	var me = this, map = event.map;

	var feature = map.forEachFeatureAtPixel(event.pixel, function(feature, layer){
		if (layer === me.layer){
			return feature;
		}
	});

	var deltaX = event.coordinate[0] - this.coords[0];
	var deltaY = event.coordinate[1] - this.coords[1];

	var geometry = this.feature.getGeometry();
	geometry.translate(deltaX, deltaY);

	this.coords[0] = event.coordinate[0];
	this.coords[1] = event.coordinate[1];
};

/**
 * @private
 * @method
 * @param {ol.MapBrowserEvent} event
 */
nyc.ol.Drag.prototype.handleMoveEvent = function(event){
	var me = this, map = event.map;
	var feature = map.forEachFeatureAtPixel(event.pixel, function(feature, layer){
		if (layer === me.layer){
			return feature;
		}
	});
	if (feature){
		$(map.getViewport()).css('cursor', 'move');
	}
};

/**
 * @private
 * @method
 * @param {ol.MapBrowserEvent} event
 * @return {boolean}
 */
nyc.ol.Drag.prototype.handleUpEvent = function(event) {
	this.coords = null;
	this.feature = null;
	$(event.map.getViewport()).css('cursor', 'inherit');
	this.setActive(false);
	return false;
};

