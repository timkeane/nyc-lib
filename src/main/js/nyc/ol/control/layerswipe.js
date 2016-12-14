var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer swiping effect
 * @public
 * @class
 * @extends {nyc.ol.control.LayerPicker}
 * @constructor
 * @param {nyc.ol.control.LayerPicker.Options} options Constructor options
 */
nyc.ol.control.LayerSwipe = function(options){
	nyc.ol.control.LayerPicker.call(this, options);
	$(this.menu).append(nyc.ol.control.LayerSwipe.MENU_BUTTONS_HTML).trigger('create');
	$('#btn-swipe').click($.proxy(this.reset, this));
	$(this.menu).find('input').change($.proxy(this.validate, this));
	$(this.menu).find('.btn-ok').click($.proxy(this.makeChoices, this));
	$(this.menu).find('.btn-cancel').click($.proxy(this.cancel, this));
	this.map.on('pointermove', $.proxy(this.swipe, this));
};

nyc.ol.control.LayerSwipe.prototype = {
	/**
	 * @private
	 * @member {boolean}
	 */
	active: false,
	/**
	 * @private
	 * @member {ol.layer.Base}
	 */
	leftLayer: null,
	/**
	 * @private
	 * @member {ol.layer.Base}
	 */
	rightLayer: null,
	/**
	 * @public
	 * @override
	 * @method
	 * @return {string}
	 */
	getMenuId: function(){
		return 'mnu-swipe';
	},
	/**
	 * @public
	 * @override
	 * @method
	 * @return {string}
	 */
	getButtonHtml: function(){
		return nyc.ol.control.LayerSwipe.BUTTON_HTML;
	},
	/**
	 * @public
	 * @override
	 * @method
	 * @param {ol.Map} map
	 * @return {Array<nyc.ol.control.LayerPicker.LayerGroup>}
	 */
	getLayerGoupsFromMap: function(map){
		var layers = [];
		map.getLayers().forEach(function(layer){
			if (layer.get('name')){
				layers.push(layer);
			}
		});
		return [{name: 'Swipe layers', layers: layers, expanded: true}];
	},
	/**
	 * @desc Set the left layer of the swipe
	 * @public
	 * @method
	 * @param {ol.layer.Base} layer The layer for the left side of a swipe
	 */
	setLeft: function(layer){
		this.setOriginalExtent(layer);
		this.setVisible(layer);
		this.leftLayer = layer;
	},
	/**
	 * @desc Set the right layer of the swipe
	 * @public
	 * @method
	 * @param {ol.layer.Base} layer The layer for the right side of a swipe
	 */
	setRight: function(layer){
		this.setOriginalExtent(layer);
		this.setVisible(layer);
		this.rightLayer = layer;
	},
	/**
	 * @desc Clear the display
	 * @public
	 * @method
	 */
	cancel: function(){
		$(this.menu).slideUp();
		this.setActive(false);
		this.reset();
	},
	/**
	 * @desc Set active state of swipe
	 * @public
	 * @method
	 * @param {boolean} active The active state
	 */
	setActive: function(active){
		this.active = active;
		this.map.getInteractions().forEach(function(interaction){
			if (interaction instanceof ol.interaction.DragPan){
				interaction.setActive(!active);
			}
		});
		if (!active){
			this.reset();
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.layer.Base} layer
	 */
	setVisible: function(layer){
		if (layer){
			layer.setVisible(true);
			layer.setZIndex(999);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.layer.Base} layer
	 */
	setOriginalExtent: function(layer){
		if (layer){
			layer.set('originalExtent', ol.geom.Polygon.fromExtent(layer.get('originalExtent') || layer.getExtent() || nyc.ol.Basemap.UNIVERSE_EXTENT).getExtent());
		}
	},
	/**
	 * @private
	 * @method
	 */
	redraw: function(){
		this.triggerChange(this.leftLayer);
		this.triggerChange(this.rightLayer);
		this.map.render();
	},
	/**
	 * @private
	 * @method
	 * @param {ol.layer.Base} layer
	 */
	triggerChange: function(layer){
		if (layer){
			layer.getSource().dispatchEvent('change'); 
		}
	},
	/**
	 * @private
	 * @method
	 */
	reset: function(){
		this.resetExtent(this.leftLayer);
		this.resetExtent(this.rightLayer);
		$('.swipe-label').remove();
		this.redraw();
	},
	/**
	 * @private
	 * @method
	 * @param {ol.layer.Base} layer
	 */
	resetExtent: function(layer){
		if (layer){
			layer.setExtent(layer.get('originalExtent'));
			layer.setVisible(false);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.MapBrowserEvent} event
	 */
	swipe: function(event){
		if (this.active){
			this.setVisible(this.leftLayer);
			this.setVisible(this.rightLayer);
			var x = event.coordinate[0];
			this.swipeLeft(x);
			this.swipeRight(x);
			this.label(event.pixel);
			this.redraw();
		}
	},
	/**
	 * @private
	 * @method
	 * @param {number} x
	 */
	swipeLeft: function(x){
		if (this.leftLayer){
			var leftExtent = ol.geom.Polygon.fromExtent(this.leftLayer.getExtent()).getExtent();
			leftExtent[2] = x;
			this.leftLayer.setExtent(leftExtent);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {number} x
	 */
	swipeRight: function(x){
		if (this.rightLayer){
			var rightExt = ol.geom.Polygon.fromExtent(this.rightLayer.getExtent()).getExtent();
			rightExt[0] = x;
			this.rightLayer.setExtent(rightExt);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	validate: function(event){
		var check = event.target;
		if ($(this.menu).find('input:checked').length > 2 && check.checked){
			$(check).trigger('click');
		}
	},
	/**
	 * @private
	 * @method
	 * @param {Array<ol.layer.Base>} layers
	 * @param {Array<Element>} choices
	 */
	resetBasemap: function(layers, choices){
		if (this.map.getBaseLayers){
			var photos = this.map.getBaseLayers().photos;
			for (var photo in photos){
				for (var i = 0; i < choices.length; i++){
					if (layers[choices[i]] === photos[photo]){
						this.map.hidePhoto();
						return;
					}
				}
			}
		}
	},
	/**
	 * @private
	 * @method
	 */
	makeChoices: function(){
		this.toggleMenu();
		var choices = this.controls[0].val(), layers = this.getLayers();
		this.setLeft();
		this.setRight();
		if (choices.length){
			this.resetBasemap(layers, choices);
			this.setLeft(layers[choices[0].value]);
			if (choices[1]) this.setRight(layers[choices[1].value]);
			this.setActive(true);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Coordinate} pixel
	 */
	label: function(pixel){
		if (this.rightLayer){
			var label = $('.swipe-label');
			if (!label.length){
				label = $('<table class="swipe-label"><tbody><tr></tr></tbody></table>');
				$(this.map.getTarget()).append(label);
				label.find('tr').html('<td>' + this.leftLayer.get('name') + '</td><td>' + this.rightLayer.get('name') + '</td>').fadeIn();
				setTimeout(function(){
					label.fadeOut();
				}, 4000);
			}
			if (label.css('display') != 'none'){
				label.css({left: pixel[0] - label.width()/2 + 'px', top: pixel[1] + 'px'});
			}
		}
	}
};

nyc.inherits(nyc.ol.control.LayerSwipe, nyc.ol.control.LayerPicker);

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerSwipe.BUTTON_HTML = '<a id="btn-swipe" class="ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext" title="Layer swipe">Layer swipe</a>';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerSwipe.MENU_BUTTONS_HTML = '<div class="swipe-btns"><a class="btn-cancel" data-role="button">Cancel</a><a class="btn-ok" data-role="button">OK</a></div>';
