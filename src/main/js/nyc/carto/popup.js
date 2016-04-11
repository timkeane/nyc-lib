var nyc = nyc || {};
nyc.carto = nyc.carto || {};

/**
 * @desc A class to create and manage CartoDB infowindows and tooltips
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.carto.Popup.Options} options Constructor options
 * @fires nyc.carto.Popup#showpopup
 * @fires nyc.carto.Popup#hidepopup
 * @fires nyc.carto.Popup#tipchange
 */
nyc.carto.Popup = function(options){
	var layer = options.layer, 
		interactivity = options.interactivity, 
		tmpl = options.template;
	this.map = options.map;
	layer.setInteraction(true);
	layer.setInteractivity(interactivity);
	layer.on('featureClick', $.proxy(this.captureClick, this)),
	layer.on('featureOver', $.proxy(this.captureHover, this)),
	this.infowin = cdb.vis.Vis.addInfowindow(this.map, layer, interactivity, {infowindowTemplate: tmpl});
	this.infowin.model.set('sanitizeTemplate', false);
	this.popupVisiblity = 'hidden';
	this.tipPosition = '';
	this.onShowPopup = options.onShowPopup || this.onShowPopup; 
	this.onHidePopup = options.onHidePopup || this.onHidePopup; 
	this.onTipChange = options.onTipChange || this.onTipChange; 
	this.tip(this.map, layer, tmpl);
	$(this.infowin.el).css('z-index', 100);
	this.observePopup(this);
	$('*').mousemove($.proxy(this.hideTip, this));
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
	 * @member {L.Map} 
	 */
	map: null,
	/**
	 * @private
	 * @member {string}
	 */
	popupVisiblity: null,
	/**
	 * @private
	 * @member {string}
	 */
	tipPosition: null,
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
		if (tipTmpl){
			this.tip = map.viz.addOverlay({
				type: 'tooltip',
				layer: layer,
				template: tipTmpl, 
				position: 'bottom|right',
				fields: [{}]
	        });
	        $(map.getContainer()).append(this.tip.render().el);
	        this.observeTip(this);
		}
	},
	/**
	 * @private
	 * @method
	 */
	observeTip: function(me){
		var observer = new MutationObserver(function(mutations) {
			var position;
			$.each(mutations, function(_, mutation) {
				if (mutation.attributeName == 'style'){
					var style = mutation.target.style;
					position = style.top + style.left;
					return false;
				}
			});
			if (position && position != me.tipPosition){
				me.tipDisplayChanged(position);
			}
		});
		observer.observe(me.tip.render().el, {attributes: true});	
	},
	/**
	 * @private
	 * @method
	 * @param {string} position
	 */
	tipDisplayChanged: function(position){
		this.tipPosition = position;
		this.onTipChange(this);
		this.trigger('tipchange', this);
	},
	/**
	 * @private
	 * @method
	 */
	observePopup: function(me){
		var observer = new MutationObserver(function(mutations) {
			var visiblity;
			$.each(mutations, function(_, mutation) {
				if (mutation.attributeName == 'style'){
					visiblity = mutation.target.style.visibility;
					return false;
				}
			});
			if (visiblity && visiblity != me.popupVisiblity){
				me.popupDisplayChanged(visiblity);
			}
		});
		observer.observe(me.infowin.el, {attributes: true});	
	},
	/**
	 * @private
	 * @method
	 * @param {string} visiblity
	 */
	popupDisplayChanged: function(visiblity){
		this.popupVisiblity = visiblity;
		if (visiblity == 'visible'){
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
	 * @param {Object} event
	 */
	hideTip: function(event){
		var map = this.map.getContainer(), pop = this.infowin.el;
		if ((map && !$.contains(map, event.target)) || (pop && $.contains(pop, event.target))){
			$('.cartodb-tooltip').hide();
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
	 * @desc The popup showpopup event type
	 */
	SHOW_POPUP: 'showpopup',
	/**
	 * @desc The popup hidepopup event type
	 */
	HIDE_POPUP: 'hidepopup', 
	/**
	 * @desc The tooltip tipchange event type
	 */
	TIP_CHANGE: 'tipchange'
};

/**
 * @desc The result of a popup showpopup event 
 * @event nyc.carto.Popup#showpopup
 * @type {nyc.carto.Popup}
 */

/**
 * @desc The result of a popup hidepopup event 
 * @event nyc.carto.Popup#hidepopup
 * @type {nyc.carto.Popup}
 */

/**
 * @desc The result of a popup tipchange event 
 * @event nyc.carto.Popup#tipchange
 * @type {nyc.carto.Popup}
 */

/**
 * @desc Object type to hold constructor options for {@link nyc.carto.Popup}
 * @public
 * @typedef {Object}
 * @property {L.Map} map The Leaflet map on which the popup will be displayed 
 * @property {cartodb.CartoDBLayer.SubLayer} layer The layer whose feature info will be displayed in the popup
 * @property {Array<string>} interactivity The data fields required by the template 
 * @property {string} template Template with replacement tokens for popup content (may optionally include an element of class 'tip-tmpl' for rendering tooltips)
 * @property {function(nyc.carto.Popup)=} onShowPopup A function to handle the popup show event 
 * @property {function(nyc.carto.Popup)=} onHidePopup A function to handle the popup hide event 
 * @property {function(nyc.carto.Popup)=} onTipChange A function to handle the tooltip change event 
 */
nyc.carto.Popup.Options;
