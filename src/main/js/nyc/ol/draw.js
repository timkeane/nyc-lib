/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.ol = nyc.ol || {};

/**
 * @export
 * @typedef {Object}
 * @property {ol.Map} map
 * @property {ol.style.Style=} style
 */
nyc.ol.DrawOptions;

/**
 * @export
 * @constructor
 * @param {nyc.ol.DrawOptions} options
 */
nyc.ol.Draw = function(options){
	var me = this, features = new ol.Collection();
	me.map = options.map;
	me.viewport = $(me.map.getViewport());
	me.wkt = new ol.format.WKT({});
	me.xml = new XMLSerializer();
	me.source = new ol.source.Vector({features: features});
	me.layer = new ol.layer.Vector({
		source: me.source,
		style: options.style || me.defaultStyle
	});
	me.map.addLayer(me.layer);
	me.map.addInteraction(
		new ol.interaction.Modify({
			features: features,
			deleteCondition: function(event){
				me.escape();
				return ol.events.condition.shiftKeyOnly(event) &&
					ol.events.condition.singleClick(event);
			}
		})
	);
	me.buttonMenu();
	me.mover = new nyc.ol.Drag(me.layer);
	me.mover.setActive(false);
	me.map.addInteraction(me.mover);
	me.viewport.on('contextmenu', $.proxy(me.contextMenu, me));
};

/**
 * @export
 * @enum {string}
 */
nyc.ol.Draw.Type  = {
	POINT: 'Point',
	LINE: 'LineString',
	POLYGON: 'Polygon',
	CIRCLE: 'Circle',
	SQUARE: 'Square',
	BOX: 'Box',
	NONE: 'None'
};

nyc.ol.Draw.prototype = {
	/**
	 * @private
	 * @member {ol.interaction.Interaction} interaction
	 */ 
	drawer: null,
	/**
	 * @private
	 * @member {nyc.ol.Drag} mover
	 */
	mover: null,
	/**
	 * @private
	 * @member {ol.Map} map
	 */ 
	map: null,
	/**
	 * @private
	 * @member {ol.format.WKT} wkt
	 */ 
	wkt: null,
	/**
	 * @private
	 * @member {nyc.ol.Draw.Type} type
	 */ 
	type: null,
	/**
	 * @private
	 * @member {ol.source.Vector} layer
	 */ 
	layer: null,
	/**
	 * @private
	 * @member {ol.layer.Vector} source
	 */ 
	source: null,
	/**
	 * @private
	 * @member {JQuery} viewport
	 */ 
	viewport: null,
	/**
	 * @private
	 * @member {JQuery} mnuBtn
	 */ 
	mnuBtn: null,
	/**
	 * @private
	 * @member {JQuery} btnMnu
	 */ 
	btnMnu: null,
	/**
	 * @private
	 * @member {JQuery} ctxMnu
	 */ 
	ctxMnu: null,
	/**
	 * @private
	 * @member {ol.style.Style} defaultStyle
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
	 * @export
	 * @param {nyc.ol.Draw.Type} type
	 */
	active: function(){
		if (this.drawer) return this.drawer.getActive();
		return false;
	},
	/**
	 * @export
	 * @param {nyc.ol.Draw.Type} type
	 */
	activate: function(type){
		var me = this;
		me.deactivate();
		me.type = type;
		if (type != nyc.ol.Draw.Type.NONE){
			var geometryFunction, maxPoints;
			me.source.on('addfeature', me.triggerFeatureEvent, me);
			me.source.on('changefeature', me.triggerFeatureEvent, me);
			if (type == nyc.ol.Draw.Type.SQUARE){
				type = nyc.ol.Draw.Type.CIRCLE;
				geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
			}else if (type == nyc.ol.Draw.Type.BOX){
				type = nyc.ol.Draw.Type.LINE;
				maxPoints = 2;
				geometryFunction = function(coordinates, geometry){
					if (!geometry){
						geometry = new ol.geom.Polygon(null);
					}
					var start = coordinates[0];
					var end = coordinates[1];
					geometry.setCoordinates([
                         [start, [start[0], end[1]], end, [end[0], start[1]], start]
                    ]);
					return geometry;
				};
			}
			me.drawer = new ol.interaction.Draw({
				source: me.source,
				type: type,
				geometryFunction: geometryFunction,
				maxPoints: maxPoints,
				condition: function(mapEvt){
				    var evt = mapEvt.originalEvent;
					return evt.button != 2 && 
						!evt.shiftKey &&
						!$(evt.target).hasClass('draw-mnu-btn') && 
						!me.mover.getActive();
				}
			});
			map.addInteraction(me.drawer);
			$(document).keyup(function(evt){
				if (evt.keyCode == 27){
					me.escape();
				}
			});
		}
	},
	/** @export 
	 * @return {Array<Object>}
	 */
	getFeatures: function(){
		var me = this, features = [];
		$.each(me.source.getFeatures(), function(_, f){
			features.push({feature: feature, wkt: me.wkt.writeFeature(me.serializable(f))});
		});
		return features;
	},
	/** @private */ 
	escape: function(){
		var drawer = this.drawer;
		if (drawer && drawer.getActive()){
			drawer.setActive(false);
			drawer.setActive(true);
		}
	},
	/** @private */ 
	closeMenus: function(){
		$('.draw-ctx-mnu, .draw-btn-mnu').slideUp(function(){
			$('.draw-ctx-mnu').remove();
		});
	},
	/** @private */ 
	buttonMenu: function(){
		var me = this, viewport = me.viewport;
		viewport.find('.ol-overlaycontainer-stopevent').append(nyc.ol.Draw.BUTTON_MENU_HTML);
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
	 * @param {Object} evt
	 */ 
	choose: function(evt){
		var me = this, btn = evt.target;
		if (btn.tagName.toLowerCase() == 'button'){
			btn = $(btn).parent().get(0);
		}
		var type = $(btn).data('draw-type'), css = btn.className.split(' ')[1] || '';
		if (css == 'clear'){
			this.clear();
		}else if(css == 'cancel'){
			me.deactivate();
		}else{
			me.mnuBtn.get(0).className = 'ol-unselectable ol-control draw-btn ' + css;
			me.activate(type);
		}
		me.closeMenus();			
	},
	/** 
	 * @private 
	 * @param {Object} event
	 */ 
	contextMenu: function(event){
		var me = this, map = me.map;
		if (me.active()){
			var feature = map.forEachFeatureAtPixel(
				map.getEventPixel(event), function(feature, layer){
		    		if (layer == me.layer){
		    			return feature;
		    		}		    		
		        });
		    if (feature){
				me.showContextMenu(feature);
		    }
		}			
	    return false;
	},
	/**
	 * @private
	 * @param {ol.Feature} feature
	 */
	showContextMenu: function(feature){
		var me = this, ctxMnu = $(nyc.ol.Draw.CONTEXT_MENU_HTML);
		me.viewport.one('click', function(e){
    		me.escape();
	    	me.closeMenus();
		});
		me.viewport.find('.ol-overlaycontainer-stopevent').append(ctxMnu);
    	ctxMnu.css({left: event.offsetX + 'px', top: event.offsetY + 'px'});
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
	 * @private
	 * @param {ol.Feature} feature
	 */
	removeFeature: function(feature){
		this.source.removeFeature(feature);
		this.trigger(nyc.ol.FeatureEventType.REMOVE, {
			type: nyc.ol.FeatureEventType.REMOVE,
			feature: {
				feature: feature, 
				wkt: this.wkt.writeFeature(this.serializable(feature))
			}
		});		
	},
	/** @export */
	clear: function(){
		this.source.clear();
	},
	/** @export */
	deactivate: function(){
		this.type = null;
		if (this.drawer){
			this.map.removeInteraction(this.drawer);
			this.source.un('addfeature', this.triggerFeatureEvent, this);
			this.source.un('changefeature', this.triggerFeatureEvent, this);
			this.drawer = null;
		}
		if (this.drag){
			theis.drag.setActive(false);
		}
	},
	/**
	 * @private
	 * @param {ol.source.VectorEvent} event
	 */ 
	triggerFeatureEvent: function(event){
		var feature = event.feature;
		if (this.triggerEvent(feature.getGeometry().getType())){
			this.trigger(event.type, {
				feature: {
					feature: feature, 
					wkt: this.wkt.writeFeature(this.serializable(feature))
				}
			});
		}
	},
	/**
	 * @private
	 * @param {ol.Feature} feature
	 * @return {ol.Feature}
	 */ 
	serializable: function(feature){
		var geom = feature.getGeometry();
		if (geom.getType() == nyc.ol.Draw.Type.CIRCLE){
			feature = new ol.Feature(feature.getProperties());
			feature.setGeometry(ol.geom.Polygon.fromCircle(geom));
		}
		return feature;
	},
	/**
	 * @private
	 * @param {nyc.ol.Draw.Type} drawType
	 * @return {boolean}
	 */ 
	triggerEvent: function(drawType){
		var types = nyc.ol.Draw.Type;
		if (drawType == types.POINT && this.type == types.POINT){
			return true;
		}
		if (drawType == types.LINE && this.type == types.LINE){
			return true;
		}
		if (drawType == types.POLYGON && this.type == types.POLYGON){
			return true;
		}
		if (drawType == types.CIRCLE && this.type == types.CIRCLE){
			return true;
		}
		if (drawType == types.POLYGON && this.type == types.SQUARE){
			return true;
		}
		if (drawType == types.POLYGON && this.type == types.BOX){
			return true;
		}
		return false;
	}
};

nyc.inherits(nyc.ol.Draw, nyc.EventHandling);

nyc.ol.Draw.CONTEXT_MENU_HTML = '<div class="ol-unselectable ol-control draw-ctx-mnu">' +
		'<div class="draw-mnu-btn delete"><button>Delete feature</button></div>' +
		'<div class="draw-mnu-btn move"><button>Move feature</button></div>' +
	'</div>';

nyc.ol.Draw.BUTTON_MENU_HTML = '<div class="ol-unselectable ol-control draw-btn"><button><span>Draw</span></button></div>' +
	'<div class="ol-unselectable ol-control draw-btn-mnu">' +
		'<div class="draw-mnu-btn point" data-draw-type="Point"><button>Point</button></div>' +
		'<div class="draw-mnu-btn line" data-draw-type="LineString"><button>Line</button></div>' +
		'<div class="draw-mnu-btn polygon" data-draw-type="Polygon"><button>Polygon</button></div>' +
		'<div class="draw-mnu-btn circle" data-draw-type="Circle"><button>Circle</button></div>' +
		'<div class="draw-mnu-btn square" data-draw-type="Square"><button>Square</button></div>' +
		'<div class="draw-mnu-btn box" data-draw-type="Box"><button>Box</button></div>' +
		'<div class="draw-mnu-btn delete" data-draw-type="None"><button>Clear All</button></div>' +
		'<div class="draw-mnu-btn cancel" data-draw-type="None"><button>Deactivate</button></div>' +
	'</div>';

/**
* @constructor
* @extends {ol.interaction.Pointer}
* @param {ol.layer.Vector} layer
*/
nyc.ol.Drag = function(layer){
	/**
	 * @private
	 * @member {ol.layer.Vector} layer
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
	 * @member {ol.Pixel} coords
	 */
	this.coords = null;
	/**
	 * @private
	 * @member {ol.Feature} feature
	 */
	this.feature = null;
	/**
	 * @private
	 * @member {string} prevCursor
	 */
	this.prevCursor = null;
};

ol.inherits(nyc.ol.Drag, ol.interaction.Pointer);

/**
 * @private
 * @param {ol.MapBrowserEvent} evt Map browser event.
 * @return {boolean} `true` to start the drag sequence.
 */
nyc.ol.Drag.prototype.handleDownEvent = function(evt){
	var me = this, map = evt.map;
	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
		if (layer == me.layer){
			return feature;
		}
	});
	if (feature) {
		this.coords = evt.coordinate;
		this.feature = feature;
	}
	return !!feature;
};

/**
 * @private
 * @param {ol.MapBrowserEvent} evt Map browser event.
 */
nyc.ol.Drag.prototype.handleDragEvent = function(evt){
	var me = this, map = evt.map;
	
	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
		if (layer == me.layer){
			return feature;
		}
	});
	
	var deltaX = evt.coordinate[0] - this.coords[0];
	var deltaY = evt.coordinate[1] - this.coords[1];
	
	var geometry = /** @type {ol.geom.SimpleGeometry} */ (this.feature.getGeometry());
	geometry.translate(deltaX, deltaY);
	
	this.coords[0] = evt.coordinate[0];
	this.coords[1] = evt.coordinate[1];
};

/**
 * @private
 * @param {ol.MapBrowserEvent} evt Event.
 */
nyc.ol.Drag.prototype.handleMoveEvent = function(evt){
	var me = this, map = evt.map;
	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
		if (layer == me.layer){
			return feature;
		}
	});
	if (feature){
		$(map.getViewport()).css('cursor', 'move');
	}
};

/**
 * @private
 * @param {ol.MapBrowserEvent} evt Map browser event.
 * @return {boolean} `false` to stop the drag sequence.
 */
nyc.ol.Drag.prototype.handleUpEvent = function(evt) {
	this.coords = null;
	this.feature = null;
	$(evt.map.getViewport()).css('cursor', 'inherit');
	this.setActive(false);
	return false;
};

