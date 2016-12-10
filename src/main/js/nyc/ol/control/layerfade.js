var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer swiping effect
 * @public
 * @class
 * @constructor
 * @param {ol.Map} map The map on which to perform layer fades
 * @param {Object<string, ol.layer.Base>} =layers Layers to choose from (default is all layers with a name property)
 */
nyc.ol.control.LayerFade = function(map, layers){
	this.map = map;
	this.layers = layers || this.getLayersFromMap(map);
	$(map.getTarget()).append(nyc.ol.control.LayerFade.HTML).trigger('create');
	$('#btn-fade').click($.proxy(this.showChoices, this));
	$('div.fade-btns a').click($.proxy(this.buttonClick, this));
	nyc.ol.control.ui.load();
};

nyc.ol.control.LayerFade.prototype = {
	/**
	 * @private
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {number}
	 */
	fadeStepTimeout: 10000,
	/**
	 * @private
	 * @member {Object<string, ol.layer.Base>}
	 */
	layers: null,
	/**
	 * @desc Set the layers of the fade
	 * @public
	 * @method
	 * @param {Object<string, ol.layer.Base>} layers Layers to choose from
	 */
	setLayers: function(layers){
		this.layers = layers;
		$('#fade-menu ul, #fade-menu ol').empty();
	},
	/**
	 * @private
	 * @method
	 * @param {Array<ol.layer.Base>} layers
	 */
	setupFade: function(layers){
		for (var i = 0; i < layers.length; i++){
			var layer = layers[i], last = i == layers.length - 1;
			layer.setOpacity(0);
			layer.setVisible(true);
			layer.set('fadeStepTimeout', this.fadeStepTimeout/100);
			layer.set('lastFadeLayer', last);
			layer.set('fadeStep', 0);
			layer.fadeOut = nyc.ol.control.LayerFade.fadeOut;
			layer.fadeIn = nyc.ol.control.LayerFade.fadeIn;
			layer.set('nextFadeLayer', layers[i + 1]);
		}
		layers[0].set('fadeStep', 100);
		layers[0].setOpacity(1);
	},
	/**
	 * @private
	 * @method
	 */
	showChoices: function(){
		var items = $('#fade-menu li');
		$('#fade-status, #fade-progress, #fade-slider').fadeOut();
		if (!items.length){
			var choices = $('#fade-menu ul');
			for (var name in this.layers){
				var li = $('<li class="fade-lyr">' + name + '</li>');
				choices.append(li);
			}
		}
        $('.fade-choices').sortable({connectWith: '#fade-menu ul, #fade-menu ol'}).disableSelection();
		$('#fade-menu').slideDown();
	},
	/**
	 * @private
	 * @method
	 * @param {boolean} auto
	 */
	makeChoices: function(auto){
		var me = this, choices = $('ol.fade-choices li'), layers = [];
		if (choices.length > 1){
			choices.each(function(){
				layers.push(me.layers[$(this).html()]);
			});
			me.setupFade(layers);
			this.status(layers);
			if (auto){
				layers[0].fadeOut();
				this.progress(layers);
			}else{
				this.slider(layers);
			}
		}
	},
	/**
	 * @private
	 * @method
	 * @param {Array<ol.layer.Base>} layers
	 */
	status: function(layers){
		var width = $(this.map.getTarget()).width()/layers.length;
		$('#fade-status').empty();
		$.each(layers, function(){
			var name = this.get('name'), div = $('<div>' + name + '</div>');
			div.addClass('fade-lyr-' + name).css('width', width + 'px');
			$('#fade-status').append(div);
		});
		$('#fade-status, #fade-progress').fadeIn();
	},
	/**
	 * @private
	 * @method
	 * @param {Array<ol.layer.Base>} layers
	 */
	progress: function(layers){
		$('#fade-progress').width(1);
		$('#fade-progress').animate(
			{width: $(this.map.getTarget()).width() + 'px'}, 
			(layers.length - 1) * this.fadeStepTimeout
		);		
	},
	/**
	 * @private
	 * @method
	 * @param {Array<ol.layer.Base>} layers
	 * @param {number} interval
	 * @param {number} value
	 */
	manualFade: function(layers, interval, value){
		var layerIdx;
		$('#fade-progress').width(value);
		for (var i = 0; i < layers.length; i++){
			var end = (i + 1) * interval, start = end - interval;
			if (value >= start && value < end){
				layerIdx = i;
				break;
			}
		}
		for (var i = 0; i < layers.length; i++){
			var layer = layers[i];
			if (i < layerIdx || i > layerIdx + 1){
				layer.setOpacity(0);
			}else if (i == layerIdx && !layer.get('lastFadeLayer')){
				if (layer.get('lastFadeLayer')){
					layer.setOpacity(1);
				}else{
					var end = (i + 1) * interval, start = end - interval;
					layer.setOpacity(1 - (value - start)/interval);
					if (layer.get('nextFadeLayer')){
						layer.get('nextFadeLayer').setOpacity((value - start)/interval);
					}								
				}
			}
		}		
	},
	/**
	 * @private
	 * @method
	 * @param {Array<ol.layer.Base>} layers
	 */
	slider: function(layers){
		var me = this, max = $(this.map.getTarget()).width(), interval = max/layers.length;
		$('#fade-slider').show().slider({
			min: 0,
			max: max,
			value: 0,
			slide: function(event, ui){
				me.manualFade(layers, interval, ui.value);
			}
		});
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	buttonClick: function(event){
		var btn = $(event.currentTarget);
		$('#fade-progress').width(0);
		$('#fade-menu').slideUp();
		if (btn.hasClass('btn-cancel')){
			return;
		}
		this.makeChoices(btn.hasClass('btn-auto'));
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
 * @type {function}
 */
nyc.ol.control.LayerFade.fadeIn = function(){
	var step = this.get('fadeStep') + 1;
	this.set('fadeStep', step);
	this.setOpacity(step/100);
	if (step == 100){
		if (!this.get('lastFadeLayer')){
			this.fadeOut();
		}
	}else{
		setTimeout($.proxy(this.fadeIn, this), this.get('fadeStepTimeout'))
	}
};

/**
 * @private
 * @type {function}
 */
nyc.ol.control.LayerFade.fadeOut = function(){
	var step = this.get('fadeStep') - 1;
	this.set('fadeStep', step);
	if (step == 99 && this.get('nextFadeLayer')){
		this.get('nextFadeLayer').fadeIn();
	}
	this.setOpacity(step/100);
	if (step > 0){
		setTimeout($.proxy(this.fadeOut, this), this.get('fadeStepTimeout'));
	}
};

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerFade.HTML = '<a id="btn-fade" class="ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext" data-zoom-incr="1" title="Layer fade">' +
		'Layer fade' +
	'</a>' +
	'<div id="fade-menu" style="float:left;width:700px;">' +
		'<div class="fade-list">Choose...' +
			'<ul class="fade-choices"></ul>' +
		'</div>' +
    	'<div class="fade-list">Order...' +
    		'<ol class="fade-choices"></ol>' +
    	'</div>' +
		'<div class="fade-btns">' +
			'<a class="btn-cancel" data-role="button">Cancel</a>' + 
			'<a class="btn-auto" data-role="button">Auto</a>' +
			'<a class="btn-manual" data-role="button">Manual</a>' +
		'</div>' +
    '</div>' +
	'<div id="fade-progress"></div>' +
	'<div id="fade-status"></div>' +
	'<div id="fade-slider"></div>';

