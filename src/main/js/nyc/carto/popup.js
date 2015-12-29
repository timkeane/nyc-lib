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
	layer.on('featureOver', $.proxy(this.captureHover, this)),
	this.infowin = cdb.vis.Vis.addInfowindow(map, layer, interactivity, {infowindowTemplate: tmpl});
	this.infowin.model.set('sanitizeTemplate', false);
	this.popupDisplay = 'none';
	this.tipDisplay = 'none';
	this.onShowPopup = options.onShowPopup || this.onShowPopup; 
	this.onHidePopup = options.onHidePopup || this.onHidePopup; 
	this.onTipChange = options.onTipChange || this.onTipChange; 
	$(this.infowin.el).css('z-index', 100);
	this.observePopup(this);
};

nyc.carto.Popup.prototype = {
	/**
	 * @desc The CartoDB infowindow
	 * @public
	 * @member {Object} 
	 */
	infowin: null,
	/**
	 * @desc The CartoDB tooltip
	 * @public
	 * @member {Object} 
	 */
	tip: null,
	/**
	 * @desc The CartoDB featureClick event arguments
	 * @public
	 * @member {Array<Object>} 
	 */
	popupEventData: null,
	/**
	 * @desc The CartoDB featureOver event arguments
	 * @public
	 * @member {Array<Object>} 
	 */
	tipEventData: null,
	/**
	 * @private
	 * @member {string}
	 */
	popupDisplay: null,
	/**
	 * @private
	 * @member {string}
	 */
	tipDisplay: null,
	/**
	 * @private
	 * @method
	 */
	captureClick: function() {
		this.popupEventData = arguments;
	},
	/**
	 * @private
	 * @method
	 */
	captureHover: function() {
		this.tipEventData = arguments;
	},
	/**
	 * @private
	 * @method
	 */
	tip: function(map, layer, tmpl){
		var tipTmpl = $(tmpl).find('.tip-tmpl').html();
		this.tip = map.viz.addOverlay({
			type: 'tooltip',
			layer: layer,
			template: tipTmpl, 
			position: 'bottom|right',
			fields: [{}]
        });
        $(map.getContainer()).append(this.tip.render().el);
        this.observeTip(this);
	},
	/**
	 * @private
	 * @method
	 */
	observeTip: function(me){
		var observer = new MutationObserver(function(mutations) {
			var display;
			$.each(mutations, function(_, mutation) {
				if (mutation.attributeName == 'style'){
					display = mutation.target.style.top;
					return false;
				}
			});
			if (display && display != me.tipDisplay){
				me.tipDisplayChanged(display);
			}
		});
		observer.observe(me.tip.render().el, {attributes: true});	
	},
	/**
	 * @private
	 * @method
	 * @param {string} display
	 */
	tipDisplayChanged: function(display){
		this.tipDisplay = display;
		this.onTipChange(this);
		this.trigger('tipchange', this);
	},
	/**
	 * @private
	 * @method
	 */
	observePopup: function(me){
		var observer = new MutationObserver(function(mutations) {
			var display;
			$.each(mutations, function(_, mutation) {
				if (mutation.attributeName == 'style'){
					display = mutation.target.style.display;
					return false;
				}
			});
			if (display && display != me.popupDisplay){
				me.popupDisplayChanged(display);
			}
		});
		observer.observe(me.infowin.el, {attributes: true});	
	},
	/**
	 * @private
	 * @method
	 * @param {string} display
	 */
	popupDisplayChanged: function(display){
		this.popupDisplay = display;
		if (display == 'block'){
			this.onShowPopup(this);
			this.trigger('showpopup', this);
		}else{
			this.onHidePopup(this);
			this.trigger('hidepopup', this);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.carto.Popup} popup
	 */
	onShowPopup: function(popup){},
	/**
	 * @private
	 * @method
	 * @param {nyc.carto.Popup} popup
	 */
	onHidePopup: function(popup){},
	/**
	 * @private
	 * @method
	 * @param {nyc.carto.Popup} popup
	 */
	onTipChange: function(popup){}
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
	SHOW_POPUP: 'showpopup',
	/**
	 * @desc The popup hide event type
	 */
	HIDE_POPUP: 'hidepopup', 
	/**
	 * @desc The tooltip change event type
	 */
	TIP_CHANGE: 'tipchange'
};

/**
 * @desc The result of a popup or tooltip show event 
 * @event nyc.carto.Popup#show
 * @type {nyc.carto.Popup}
 */

/**
 * @desc The result of a popup or tooltip hide event 
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
 * @property {string} template Template with replacement tokens for popup content (may optionally include an element of class 'tip-tmpl' for rendering tooltips)
 * @property {function(nyc.carto.Popup)=} onShowPopup A function to handle the popup show event 
 * @property {function(nyc.carto.Popup)=} onHidePopup A function to handle the popup hide event 
 * @property {function(nyc.carto.Popup)=} onTipChange A function to handle the tooltip change event 
 */
nyc.carto.Popup.Options;
