/**
 * @module nyc/ol/Draw
 */

import $ from 'jquery'
import nyc from 'nyc'
import OlLayerVector from 'ol/layer/Vector'
import OlSourceVector from 'ol/source/Vector'
import OlGeoJSON from 'ol/format/GeoJSON'
import Dialog from 'nyc/Dialog'
import LocalStorage from 'nyc/LocalStorage'
import Drawer from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import Collection from 'ol/Collection'

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
 * @fires nyc.ol.Draw#activechanged
 */

class Draw {
  /**
   * @desc Create an instance of Draw
   * @public
   * @constructor
   */
  constructor(options) {
    /**
     * @private
     * @member {ol.Map}
     */
    this.map = options.map    
     /**
     * @private
     * @member {ol.View}
     */
    this.view = this.map.getView() 
    /**
     * @private
     * @member {ol.source.Vector}
     */
    this.source = options.source || new OlSourceVector()
    /**
     * @private
     * @member {JQuery}
     */
    this.viewport = $(this.map.getViewport())
    /**
     * @private
     * @member {Array<ol.Feature>}
     */
    this.removed = []
    /**
     * @private
     * @member {ol.format.GeoJSON}
     */
    this.geoJson = new OlGeoJSON()
    /**
     * @private
     * @member {nyc.ol.storage.Local}
     */
    this.storage = new LocalStorage()
    /**
     * @private
     * @member {string}
     */
    this.storeKey = document.location.href.replace(document.location.search, '') + 'nyc.ol.Draw.features';
    /**
     * @private
     * @member {nyc.Dialog}
     */
    this.dia = new Dialog()
    
    // if (options.restore === undefined || options.restore){
    //   this.restore();
    // }   
    /**
     * @private
     * @member {ol.layer.Vector}
     */
    this.layer = new OlLayerVector({
      source: this.source,
      style: options.style || this.defaultStyle,
      zIndex: 100
    });
    this.map.addLayer(this.layer);
    if (options.showAccuracy === undefined || options.showAccuracy === true){
      this.accuaracyLayer = new ol.layer.Vector({
        source: this.source,
        style: options.accuracyStyle || this.accuracyStyle
      });
      this.map.addLayer(this.accuaracyLayer);
    }
    /**
     * @private
     * @member {boolean}
     */
    // this.showEveryTrackPositon === undefined ? true : options.showEveryTrackPositon


    /**
     * @desc The tracker used to draw based on device geolocation
     * @public
     * @member {nyc.ol.Tracker}
     */
    /*this.tracker = new nyc.ol.Tracker({map: this.map}) */
    /**
     * @private
     * @member {ol.interaction.Draw}
     */
    this.drawer = null
    /**
     * @private
     * @member {ol.interaction.Modify}
     */
    this.modify = null
    /**
     * @private
     * @member {ol.Collection}
     */
    this.features = null,
    /**
     * @private
     * @member {nyc.ol.Drag}
     */
    //this.mover = new nyc.ol.Drag(this.layer)
    /**
     * @private
     * @member {ol.Feature}
     */
    this.gpsTrack = null

    /**
     * @private
     * @member {nyc.ol.Draw.Type}
     */
    this.type = null
    /**
     * @private
     * @member {JQuery}
     */
    this.mnuBtn = null
    /**
     * @private
     * @member {JQuery}
     */
    this.saveBtn = null
    /**
     * @private
     * @member {JQuery}
     */
    this.btnMnu = null
    /**
     * @private
     * @member {JQuery}
     */
    this.ctxMnu = null


    /**
     * @private
     * @member {number}
     */
    this.gpsDeltaMean = 500,
    /**
     * @private
     * @member {number}
     */
    this.accuracyLimit = 0,

    /**
     * @private
     * @member {boolean}
     */
    this.firstRun = true,

    /**
     * @desc Set the accuracy limit for geolocation capture
     * @public
     * @method
     * @param {number} limit The accuracy limit in meters
     */
/**
 * @private
 * @const
 * @type {string}
 */
this.BUTTON_MENU_HTML = '<a class="draw-btn ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext">Draw</a></div>' +
'<div class="ol-unselectable ctl draw-btn-mnu" data-role="controlgroup">' +
	'<button class="draw-mnu-btn save" data-draw-type="None" data-role="button" title="Save the current drawing">Save...</button>' +
	'<button class="draw-mnu-btn point" data-draw-type="Point" data-role="button" title="Click to draw a point">Point</button>' +
	'<button class="draw-mnu-btn linestring" data-draw-type="LineString" data-role="button" title="Click to draw each point of a line">Line</button>' +
	'<button class="draw-mnu-btn polygon" data-draw-type="Polygon" data-role="button" title="Click to draw each point of a polygon">Polygon</button>' +
	'<button class="draw-mnu-btn circle" data-draw-type="Circle" data-role="button" title="Click then drag to draw a circle">Circle</button>' +
	'<button class="draw-mnu-btn square" data-draw-type="Square" data-role="button" title="Click then drag to draw a square">Square</button>' +
	'<button class="draw-mnu-btn box" data-draw-type="Box" data-role="button" title="Click then drag to draw a box">Box</button>' +
	'<button class="draw-mnu-btn free" data-draw-type="Free" data-role="button" title="Click and drag to draw a freehand line">Freehand</button>' +
	'<button class="draw-mnu-btn gps" data-draw-type="GPS" data-role="button" title="Capture coordiantes from device geoloaction">GPS Capture</button>' +
	'<button class="draw-mnu-btn delete" data-draw-type="None" data-role="button" title="Delete all drawn features">Clear All</button>' +
	'<button class="draw-mnu-btn cancel" data-draw-type="None" data-role="button" title="Deactivate drawing">Deactivate</button>' +
'</div>'

     console.warn(this.storeKey)
     console.warn(this.geoJson)
     console.warn(this.map)
     console.warn(this.view)
     console.warn(this.storage)
     this.buttonMenu()
    
  }
  buttonMenu(){
    this.viewport.find('.ol-overlaycontainer-stopevent').append(this.BUTTON_MENU_HTML).trigger('create')
    if(this.viewport.find('.draw-btn-mnu'))
      console.warn("found button menu")
    $('.draw-btn-mnu').show()
    // this.btnMnu = this.viewport.find('.draw-btn-mnu')
    // $(this.btnMenu).controlgroup({})
    // this.mnuBtn = this.viewport.find('.draw-btn')
    // this.mnuBtn.click(() => {
		// 	this.btnMnu.slideToggle().controlgroup('refresh')
		// });
  }
}
export default Draw

/**
 * @desc Constructor options for {@link nyc.ol.Draw}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The OpenLayers map with which the user will interact
 * @property {ol.source.Vector} source The source on which to draw
 * @property {ol.style.Style=} style The style to use for features added to the map
 * @property {ol.style.Style=} accuracyStyle The style to use for displaying geolocation accuracy values
 * @property {boolean} [restore=true] Prompt for restore
 * @property {boolean} [showAccuracy=true] Visibility of the accuracy layer
 * @property {boolean} [showEveryTrackPositon=true] Include all positons along GPS teack
 */
Draw.Options

/**
 * @desc Enumeration for draw types
 * @public
 * @enum {string}
 */
Draw.Type  = {
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
}

/**
 * @desc The active changed event
 * @event nyc.ol.Draw#activechanged
 * @type {ol.events.Event}
 */

/**
 * @desc Enumeration for tracker event types
 * @public
 * @enum {string}
 */
Draw.EventType = {
	/**
	 * @desc The active changed event type
	 */
	ACTIVE_CHANGED: 'activechanged'
};
/**
 * @private
 * @const
 * @type {string}
 */
Draw.CONTEXT_MENU_HTML =	'<div class="ol-unselectable ctl draw-ctx-mnu" data-role="controlgroup">' +
	'<button class="draw-mnu-btn delete" data-role="button">Delete feature</button>' +
	'<button class="draw-mnu-btn move" data-role="button">Move feature</button>' +
	'</div>'

/**
 * @private
 * @const
 * @type {string}
 */
Draw.BUTTON_MENU_HTML = '<a class="draw-btn ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext">Draw</a></div>' +
'<div class="ol-unselectable ctl draw-btn-mnu" data-role="controlgroup">' +
	'<button class="draw-mnu-btn save" data-draw-type="None" data-role="button" title="Save the current drawing">Save...</button>' +
	'<button class="draw-mnu-btn point" data-draw-type="Point" data-role="button" title="Click to draw a point">Point</button>' +
	'<button class="draw-mnu-btn linestring" data-draw-type="LineString" data-role="button" title="Click to draw each point of a line">Line</button>' +
	'<button class="draw-mnu-btn polygon" data-draw-type="Polygon" data-role="button" title="Click to draw each point of a polygon">Polygon</button>' +
	'<button class="draw-mnu-btn circle" data-draw-type="Circle" data-role="button" title="Click then drag to draw a circle">Circle</button>' +
	'<button class="draw-mnu-btn square" data-draw-type="Square" data-role="button" title="Click then drag to draw a square">Square</button>' +
	'<button class="draw-mnu-btn box" data-draw-type="Box" data-role="button" title="Click then drag to draw a box">Box</button>' +
	'<button class="draw-mnu-btn free" data-draw-type="Free" data-role="button" title="Click and drag to draw a freehand line">Freehand</button>' +
	'<button class="draw-mnu-btn gps" data-draw-type="GPS" data-role="button" title="Capture coordiantes from device geoloaction">GPS Capture</button>' +
	'<button class="draw-mnu-btn delete" data-draw-type="None" data-role="button" title="Delete all drawn features">Clear All</button>' +
	'<button class="draw-mnu-btn cancel" data-draw-type="None" data-role="button" title="Deactivate drawing">Deactivate</button>' +
'</div>'

