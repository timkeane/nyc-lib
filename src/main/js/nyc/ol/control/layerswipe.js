var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer swiping effect
 * @public
 * @class
 * @constructor
 * @param {ol.Map} map The map on which to perform layer swipes
 * @param {Object<string, ol.layer.Base>} =layers Layers to choose from (default is all layers with a name property)
 */
nyc.ol.control.LayerSwipe = function(map, layers){
	this.map = map;
	this.layers = layers || this.getLayersFromMap(map);
	map.on('pointermove', $.proxy(this.swipe, this));
	$(map.getTarget()).append(nyc.ol.control.LayerSwipe.HTML).trigger('create');
	$('#btn-swipe').click($.proxy(this.showChoices, this));
	$('#swipe-choices').mouseleave($.proxy(this.makeChoices, this));
};

nyc.ol.control.LayerSwipe.prototype = {
	/**
	 * @private
	 * @member {boolean}
	 */
	active: false,
	/**
	 * @private
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {Object<string, ol.layer.Base>}
	 */
	layers: null,
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
	 * @desc Set the left layer of the swipe
	 * @public
	 * @method
	 * @param {Object<string, ol.layer.Base>} layers Layers to choose from
	 */
	setLayers: function(layers){
		this.layers = layers;
		$('#swipe-choices div.ui-controlgroup-controls').empty();
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
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.MapBrowserEvent} event
	 */
	swipe: function(event){
		if (this.active){
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
	 */
	showChoices: function(){
		var choices = $('#swipe-choices div.ui-controlgroup-controls');
		this.setActive(false);
		if (!choices.html()){
			for (var name in this.layers){
				var label = $('<label>' + name + '</label>'), check = $('<input type="checkbox" name="' + name + '">');
				label.prepend(check);
				choices.append(label).trigger('create');
				check.click($.proxy(this.validate, this));
			}
		}
		$('#swipe-choices').slideDown();
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	validate: function(event){
		var check = event.target;
		if ($('#swipe-choices input:checked').length > 2 && check.checked){
			check.checked = false;
			$(check).checkboxradio('refresh');
		}
	},
	
	/**
	 * @private
	 * @method
	 * @param {Array<Element>} choices
	 */
	resetBasemap: function(choices){
		if (this.map.getBaseLayers){
			var photos = this.map.getBaseLayers().photos;
			for (var photo in photos){
				for (var i = 0; i < choices.length; i++){
					if (this.layers[choices[i]] === photos[photo]){
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
		$('#swipe-choices').slideUp();
		var choices = $('#swipe-choices input:checked');
		this.setLeft();
		this.setRight();
		if (choices.length){
			this.resetBasemap(choices);
			this.setLeft(this.layers[choices[0].name]);
			if (choices[1]) this.setRight(this.layers[choices[1].name]);
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
			var label = $('div.swipe-label');
			if (!label.length){
				label = $('<div class="swipe-label"></div>');
				$(this.map.getTarget()).append(label);
				label.html('<div>' + this.leftLayer.get('name') + '</div><div>' + this.rightLayer.get('name') + '</div>').fadeIn();
				setTimeout(function(){
					label.fadeOut();
				}, 5000);
			}
			if (label.css('display') == 'block'){
				label.css({left: pixel[0] - label.width()/2 + 'px', top: pixel[1] + 'px'});
			}
		}
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 */
	getLayersFromMap: function(map){
		var layers = {};
		map.getLayers().forEach(function(layer){
			var name = layer.get('name');
			if (name){
				layers[name] = layer;
			}
		});
		return layers;
	}
};

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerSwipe.HTML = '<a id="btn-swipe" class="ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext" title="Layer swipe">' +
		'Layer swipe' +
	'</a>' +
	'<div id="swipe-choices"><div>Choose one or two layers to swipe:</div><div data-role="controlgroup"></div></div>';

