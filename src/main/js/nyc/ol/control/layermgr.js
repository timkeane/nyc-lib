var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer swiping effect
 * @public
 * @class
 * @constructor
 * @param {nyc.ol.control.LayerMgr} option Constructor options
 */
nyc.ol.control.LayerMgr = function(option){
	this.layers = option.layers || this.getLayersFromMap(map);
	if (options.draggable){
		nyc.ol.control.ui.load();
		this.target.draggable();
	}
	this.render($(option.target), this.layers);
};

nyc.ol.control.LayerFade.prototype = {
	/**
	 * @private
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member{Array<Object<string, Array<ol.layer.Base>>}
	 */
	layers: null,
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 */
	getLayersFromMap: function(map){
		var layers = [], groupedLayers = [];
		if (map.getBaseLayers){
			var photos = [];
			map.getLayers().forEach(function(layer){
				var name = layer.get('name');
				if (name){
					photos.push(layer);
				}
			});
			groupedLayers.push({'Aerial photos': photos}); //sort?
		}
		map.getLayers().forEach(function(layer){
			var name = layer.get('name');
			if (name){
				layers.push(layer);
			}
		});
		if (layers.length){
			groupedLayers.push({'Data layers': layers}); //sort?
		}
		return groupedLayers;
	}
};

/**
 * @desc Constructor options for {@link nyc.Choice}
 * @public
 * @typedef {Object}
 * @property {Element|JQuery|string} target The target DOM node for creating the layer manager
 * @property {ol.Map} map The map containing layers to manage
 * @property {Array<Object<string, Array<ol.layer.Base>>} =layers Grouped layers to manage (default is all layers with a name property)
 * @property {boolean} [draggable=false] Make the layer manager draggable
 */
nyc.ol.control.LayerMgr.Options;

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerMgr.HTML = '';