var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer swiping effect
 * @public
 * @class
 * @extends {nyc.Menu}
 * @constructor
 * @param {nyc.ol.control.LayerMgr.Options} options Constructor options
 */
nyc.ol.control.LayerMgr = function(options){
	var me = this;
	nyc.ol.control.LayerPicker.call(me, options);
	me.container.append(nyc.ol.control.LayerMgr.MENU_BUTTONS_HTML).trigger('create');
	me.container.find('.btn-ok').click($.proxy(me.toggleMenu, me));
	$.each(me.controls, function(i, control){
		control.on('change', function(choices){
			$.each(control.choices, function(_, choice){
				$.each(me.layerGroups[i].layers, function(_, layer){
					if (choice.label == layer.get('name')){
						layer.setVisible(choice.checked);
					}
				});
			});
		});
	});
};

nyc.ol.control.LayerMgr.prototype = {
	/**
	 * @public
	 * @override
	 * @method
	 * @return {string}
	 */
	getMenuId: function(){
		return 'mnu-layer-mgr';
	},
	/**
	 * @public
	 * @override
	 * @method
	 * @return {string}
	 */
	getButtonHtml: function(){
		return nyc.ol.control.LayerMgr.BUTTON_HTML;
	},
	/**
	 * @public
	 * @override
	 * @method
	 * @param {ol.Map} map
	 * @return {Array<nyc.ol.control.LayerPicker.LayerGroup>}
	 */
	getLayerGoupsFromMap: function(map){
		var layers = [], layerGroups = [], photos = {};
		if (map.getBaseLayers){
			var photos = map.getBaseLayers().photos;
			layerGroups.push({name: 'Aerial photos', layers: map.sortedPhotos(), singleSelect: true});
		}
		map.getLayers().forEach(function(layer){
			var name = layer.get('name'); 
			if (name && !photos[name]){
				layers.push(layer);
			}
		});
		if (layers.length){
			layerGroups.push({name: 'Data layers', layers: layers});
		}
		layerGroups[0].expanded = true;
		return layerGroups;
	},
	/**
	 * @desc Turn off all layers
	 * @public
	 * @method
	 */
	clear: function(){
		this.container.find('input')
			.prop('checked', false)
			.checkboxradio('refresh')
			.trigger('change');
	}
};

nyc.inherits(nyc.ol.control.LayerMgr, nyc.ol.control.LayerPicker);

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerMgr.BUTTON_HTML = '<a id="btn-layer-mgr" class="ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext" title="Layer manager">Layer manager</a>';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerMgr.MENU_BUTTONS_HTML = '<a class="btn-ok" data-role="button">OK</a></div>';
