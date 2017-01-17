var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer swiping effect
 * @public
 * @class
 * @extends {nyc.CtlContainer}
 * @mixes nyc.Menu
 * @constructor
 * @param {nyc.ol.control.LayerFade.Options} options Constructor options
 */
nyc.ol.control.LayerFade = function(options){
	this.map = options.map;
	this.layers = options.layers || this.getLayersFromMap(this.map);
	this.autoFadeInterval = options.autoFadeInterval || this.autoFadeInterval;
	this.getContainer().append(nyc.ol.control.LayerFade.HTML).trigger('create');
	this.getElem('.btn-fade').click($.proxy(this.showChoices, this));
	this.getElem('.mnu-fade a').click($.proxy(this.buttonClick, this));
	this.menu = this.getElem('.mnu-fade').get(0);
	nyc.jq.ui.load(options.callback);
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
	autoFadeInterval: 10000,
	/**
	 * @private
	 * @member {Array<ol.layer.Base>}
	 */
	layers: null,
	/**
	 * @public
	 * @method
	 * @return {JQuery}
	 */
	getContainer: function(){
		return $(this.map.getTarget());
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
			layer.set('autoFadeInterval', this.autoFadeInterval/100);
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
	 * @desc Clear the display
	 * @public
	 * @method
	 */
	cancel: function(){
		this.getElem('.fade-status, .fade-progress, .fade-slider').stop().fadeOut();
		$.each(this.layers, function(){
			this.setVisible(false);
			this.setOpacity(1);
		});
	},
	/**
	 * @private
	 * @method
	 */
	showChoices: function(){
		var me = this, items = me.getElem('.mnu-fade ul li');
		me.cancel();
		if (!items.length){
			var choices = me.getElem('.mnu-fade ul');
			$.each(me.layers, function(i, layer){
				var name = layer.get('name'),
					li = $('<li class="fade-lyr"></li>'),
					span = $('<span></sapn>');
				span.data('fade-idx', i + 1);
				span.click($.proxy(me.swap, me));
				li.html(name)
					.data('fade-layer', name)
					.append(span);
				choices.append(li);
			});
		}
        me.getElem('.fade-choices').sortable({
        	connectWith: me.getElem('.mnu-fade ul, .mnu-fade ol'),
        	change: function(){
        		$('li.fade-msg').remove();
        	}
        }).disableSelection();
        me.toggleMenu();
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	swap: function(event){
		var span = $(event.currentTarget), idx = span.data('fade-idx');		
		if (!isNaN(idx)){
			var li = span.parent();
			if (li.parent().is('ol')){
				var before = [];
				$('ul.fade-choices span').each(function(){
					if ($(this).data('fade-idx') > idx){
						before = $(this).parent();
						return false;
					}
				});
				if (before.length){
					li.insertBefore(before);
				}else{
					$('ul.fade-choices').append(li);
				}
			}else{
        		$('li.fade-msg').remove();
				$('ol.fade-choices').append(li);
			}
		}
	},
	/**
	 * @private
	 * @method
	 * @param {boolean} auto
	 */
	makeChoices: function(auto){
		var layersByName = this.getLayersByName(), choices = $('ol.fade-choices li'), layers = [];
		if (choices.length > 1){
			choices.each(function(){
				layers.push(layersByName[$(this).data('fade-layer')]);
			});
			this.setupFade(layers);
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
		var status = this.getElem('.fade-status').empty();
		$.each(layers, function(){
			var name = this.get('name'), div = $('<div>' + name + '</div>');
			div.addClass('fade-lyr-' + name).css('width', 100 / layers.length + '%');
			status.append(div);
		});
		this.getElem('.fade-status, .fade-progress').fadeIn();
	},
	/**
	 * @private
	 * @method
	 * @param {Array<ol.layer.Base>} layers
	 */
	progress: function(layers){
		this.getElem('.fade-progress').width(1);
		this.getElem('.fade-progress').animate(
			{width: $(this.map.getTarget()).width() + 'px'}, 
			(layers.length - 1) * this.autoFadeInterval
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
		var layerIdx = -1;
		this.getElem('.fade-progress').width(value);
		for (var i = 0; i < layers.length; i++){
			var end = ((i + 1) * interval) + interval/2, start = end - interval;
			if (value >= start && value < end){
				layerIdx = i;
				break;
			}
		}
		if (layerIdx >= 0){
			for (var i = 0; i < layers.length; i++){
				var layer = layers[i];
				layer.setVisible(true);
				if (i < layerIdx || i > layerIdx + 1){
					layer.setOpacity(0);
				}else if (i == layerIdx && !layer.get('lastFadeLayer')){
					var end = (i + 1) * interval, start = end - interval;
					layer.setOpacity(1 - (value - start - interval/2)/interval);
					if (layer.get('nextFadeLayer')){
						layer.get('nextFadeLayer').setOpacity((value - start - interval/2)/interval);
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
		me.getElem('.fade-slider').show().slider({
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
        this.toggleMenu();
		this.getElem('.fade-progress').width(0);
		if (btn.hasClass('btn-cancel')){
			return;
		}
		this.makeChoices(btn.hasClass('btn-auto'));
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 * @return {Array<ol.layer.Base>}
	 */
	getLayersFromMap: function(map){
		var layers = [], photos = {};
		if (map.getBaseLayers){
			layers = map.sortedPhotos();
			photos = map.getBaseLayers().photos;
		}
		map.getLayers().forEach(function(layer){
			var name = layer.get('name'); 
			if (name && !photos[name]){
				layers.push(layer);
			}
		});
		return layers;
	},
	/**
	 * @private
	 * @method
	 * @return {Object<string, ol.layer.Base>}
	 */
	getLayersByName: function(){
		var layersByName = {};
		$.each(this.layers, function(){
			layersByName[this.get('name')] = this;
		});
		return layersByName;
	}
};

nyc.inherits(nyc.ol.control.LayerFade, nyc.CtlContainer);
nyc.inherits(nyc.ol.control.LayerFade, nyc.Menu);

/**
 * @private
 * @type {function()}
 */
nyc.ol.control.LayerFade.fadeIn = function(){
	var step = this.get('fadeStep') + 1;
	this.setVisible(true);
	this.set('fadeStep', step);
	this.setOpacity(step/100);
	if (step == 100){
		if (!this.get('lastFadeLayer')){
			this.fadeOut();
		}
	}else{
		setTimeout($.proxy(this.fadeIn, this), this.get('autoFadeInterval'))
	}
};

/**
 * @private
 * @type {function()}
 */
nyc.ol.control.LayerFade.fadeOut = function(){
	var step = this.get('fadeStep') - 1;
	this.setVisible(true);
	this.set('fadeStep', step);
	if (step == 99 && this.get('nextFadeLayer')){
		this.get('nextFadeLayer').fadeIn();
	}
	this.setOpacity(step/100);
	if (step > 0){
		setTimeout($.proxy(this.fadeOut, this), this.get('autoFadeInterval'));
	}
};

/**
 * @desc Constructor options for {@link nyc.ol.control.LayerFade}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map on which to perform layer fades
 * @property {Array<ol.layer.Base>} =layers Layers to choose from (default is all layers with a name property)
 * @property {number} [autoFadeInterval=10000] The animation interval for auto fade in milliseconds
 * @property {function()=} callback A function to be called when JQueryUI has loaded 
 */
nyc.ol.control.LayerFade.Options;

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerFade.HTML = '<a class="btn-fade ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext" title="Layer fade">' +
		'Layer fade' +
	'</a>' +
	'<div class="mnu-fade ctl-mnu-tgl">' +
		'<table>' +
			'<thead>' +
				'<tr>' +
					'<td>Layers</td>' +
					'<td>Fade order</td>' +
				'</tr>' +
			'</thead>' +
			'<tbody>' +
				'<tr>' +
					'<td><ul class="fade-choices"></ul></td>' +
					'<td><ol class="fade-choices"><li class="fade-msg">Move layers here from the list on the left to specify fade order.</li></ol></td>' +
				'</tr>' +
			'</tbody>' +
		'</table>' +
		'<a class="btn-cancel" data-role="button">Cancel</a>' +
		'<a class="btn-auto" data-role="button">Auto</a>' +
		'<a class="btn-manual" data-role="button">Manual</a>' +
	'</div>' +
	'<div class="fade-progress"></div>' +
	'<div class="fade-status"></div>' +
	'<div class="fade-slider"></div>';

