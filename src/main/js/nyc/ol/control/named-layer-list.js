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
nyc.ol.control.NamedLayerList = function(map, layers){
	this.map = map;
	this.layers = layers || this.setLayersFromMap(map);
	$(map.getTarget()).append(this.getHtml()).trigger('create');
	$('#btn-fade').click($.proxy(this.choose, this));
	$('#fade-choices').mouseleave($.proxy(this.setChoices, this));
};

nyc.ol.control.NamedLayerList.prototype = {
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
	 * @desc Set the layers of the fade
	 * @public
	 * @method
	 * @param {Object<string, ol.layer.Base>} layers Layers to choose from
	 */
	setLayers: function(layers){
		this.layers = layers;
		$('#fade-choices div.ui-controlgroup-controls').empty();
	},
	/**
	 * @desc Set active state of fade
	 * @public
	 * @method
	 * @param {boolean} active The active state
	 */
	setActive: function(active){


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
	choose: function(){
		var choices = $('#fade-choices div.ui-controlgroup-controls');
		this.setActive(false);
		if (!choices.html()){
			for (var name in this.layers){
				var label = $('<label>' + name + '</label>'), check = $('<input type="checkbox" name="' + name + '">');
				label.prepend(check);
				choices.append(label).trigger('create');
				check.click($.proxy(this.validate, this));
			}
		}
		for (var name in this.layers){
			var check = $('#fade-choices input[name="' + name + '"]');
			if (this.layers[name].getVisible()){
				check.parent().show();
			}else{
				check.checked = false;
				check.parent().hide();
			}
			check.checkboxradio('refresh');
		}
		$('#fade-choices').slideDown();
	},
	/**
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	setChoices: function(event){
		$('#fade-choices').slideUp();
		var choices = $('#fade-choices input:checked');
		this.setLeft();
		this.setRight();
		if (choices.length){
			this.setLeft(this.layers[choices[0].name]);
			if (choices[1]) this.setRight(this.layers[choices[1].name]);
			this.setActive(true);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {Array<number>} pixel
	 */
	label: function(pixel){

	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 */
	setLayersFromMap: function(map){
		var layers = {};
		map.getLayers().forEach(function(layer){
			var name = layer.get('name');
			if (name){
				layers[name] = layer;
			}
		});
		return layers;
	},
	/**
	 * @public
	 * @abstract
	 * @method
	 * @return {string}
	 */
	getHtml: function(){
		
	}
};

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.NamedLayerList.HTML = '<a id="btn-fade" class="ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext" data-zoom-incr="1" title="Layer fade">' +
		'Layer fade' +
	'</a>' +
	'<div id="fade-choices"><div>Choose one or two layers to fade:</div><div data-role="controlgroup"></div></div>';

