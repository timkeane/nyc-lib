var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc Convenience function to create CartoDB infowindows 
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.carto.Popup.Options} options Constructor options
 * @fires nyc.carto.Popup#show
 * @fires nyc.carto.Popup#hide
 */
nyc.carto.Popup = function(options){
	var map = options.map, 
		layer = options.layer, 
		interactivity = options.interactivity, 
		tmpl = options.template;
	layer.setInteraction(true);
	layer.setInteractivity(interactivity);
	this.tip(map, layer, tmpl);
	layer.on('featureClick', $.proxy(this.captureClick, this)),
	this.infowin = cdb.vis.Vis.addInfowindow(map, layer, interactivity, {infowindowTemplate: tmpl});
	this.infowin.model.set('sanitizeTemplate', false);
	this.display = 'none';
	this.onShow = options.onShow || this.onShow; 
	this.onHide = options.onHide || this.onHide; 
	$(this.infowin.el).css('z-index', 100);
	this.observe();
};

nyc.carto.Popup.prototype = {
	/**
	 * @desc The CartoDB infowindow
	 * @public
	 * @member {Object} 
	 */
	infowin: null,
	/**
	 * @desc The CartoDB featureClick event arguments
	 * @public
	 * @member {Array<Object>} 
	 */
	eventData: null,
	/**
	 * @private
	 * @member {string}
	 */
	display: null,
	/**
	 * @private
	 * @method
	 */
	captureClick: function() {
		this.eventData = arguments;
	},
	/**
	 * @private
	 * @method
	 */
	observe: function(){
		var me = this;
		me.observer = new MutationObserver(function(mutations) {
			var display;
			$.each(mutations, function(_, mutation) {
				if (mutation.attributeName == 'style'){
					display = mutation.target.style.display;
					return false;
				}
			});
			if (display && display != me.display){
				me.displayChanged(display);
			}
		});
		me.observer.observe(this.infowin.el, {attributes: true});	
	},
	/**
	 * @private
	 * @method
	 * @param {string} display
	 */
	displayChanged: function(display){
		this.display = display;
		if (display == 'block'){
			this.trigger('show', this);
			this.onShow(this);
		}else{
			this.trigger('hide', this);
			this.onHide(this);
		}
	},
	/**
	 * @private
	 * @method
	 */
	tip: function(map, layer, tmpl){
		var tipTmpl = $(tmpl).find('.cartodb-popup-tip-container').html(),
			tooltip = map.viz.addOverlay({
				type: 'tooltip',
				layer: layer,
				template: tipTmpl, 
				position: 'bottom|right',
				fields: [{}]
	        });
        $(map.getContainer()).append(tooltip.render().el);
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.carto.Popup} popup
	 */
	onShow: function(popup){},
	/**
	 * @private
	 * @method
	 * @param {nyc.carto.Popup} popup
	 */
	onHide: function(popup){}
};

nyc.inherits(nyc.carto.Popup, nyc.EventHandling);

/** 
 * @desc Enumerator for popup event types
 * @enum {string}
 */
nyc.carto.Popup.EventType = {
	/**
	 * @desc The popup show event type
	 */
	SHOW: 'show',
	/**
	 * @desc The popup hide event types fired when a popup is opened or closed
	 */
	HIDE: 'hide' 
};

/**
 * @desc The result of symbolization 
 * @event nyc.carto.Popup#show
 * @type {nyc.carto.Popup}
 */

/**
 * @desc The result of symbolization 
 * @event nyc.carto.Popup#hide
 * @type {nyc.carto.Popup}
 */

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.Popup}
 * @public
 * @typedef {Object}
 * @property {L.Map} map The Leaflet map on which the popup will be displayed 
 * @property {cartodb.Layer} layer The layer whose feature info will be displayed in the popup
 * @property {Array<string>} interactivity The data fields required by the template 
 * @property {string} template Template with replacement tokens for popup content
 * @property {function(nyc.carto.Popup)} onShow A function to handle the show event 
 * @property {function(nyc.carto.Popup)} onHide A function to handle the hide event 
 */
nyc.carto.Popup.Options;
