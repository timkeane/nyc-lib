var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer swiping effect
 * @public
 * @class
 * @constructor
 * @param {nyc.ol.control.LayerMgr} options Constructor options
 */
nyc.ol.control.LayerMgr = function(options){
	var layerGroups = options.layerGroups || this.getLayersFromMap(map);
	this.render(options.map, layerGroups, options.target);
};

nyc.ol.control.LayerMgr.prototype = {
	/**
	 * @private
	 * @member {JQuery}
	 */
	container: null,
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 * @param {Element|JQuery|string} target=
	 * @return {JQuery} 
	 */
	getContainer: function(map, target){
		var container = target ? $(target) : $('<div id="layer-mgr"></div>');
		this.container = container;
		if (target) return container;
		$(map.getTarget()).append(nyc.ol.control.LayerMgr.HTML).trigger('create');
		$(map.getTarget()).append(container);
		$('#btn-layer-mgr').click(function(){
			container.slideToggle();
		});
		return container;
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 * @param {Array<nyc.ol.control.LayerMgr>} layerGroups
	 * @param {JQuery} target
	 */
	render: function(map, layerGroups, target){
		var me = this, container = this.getContainer(map, target);
		$.each(layerGroups, function(_, group){
			var options = {target: $('<div></div>'), title: group.name, expanded: group.expanded, choices: []}, control;
			container.append(options.target);
			$.each(group.layers, function(_, layer){
				var name = layer.get('name');
				options.choices.push({value: layer, label: name, checked: layer.getVisible()});
			});
			if (group.singleSelect){
				control = new nyc.Radio(options);	
			}else{
				control = new nyc.Check(options);	
			}
			control.on('change', function(choices){
				$.each(control.choices, function(_, choice){
					$.each(group.layers, function(_, layer){
						if (choice.label == layer.get('name')){
							layer.setVisible(choice.checked);
						}
					});
				});
			});
		});
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 */
	getLayersFromMap: function(map){
		var layers = [], layerGroups = [], photos = {};
		if (map.getBaseLayers){
			photos = map.getBaseLayers().photos, photoLayers = [];
			for (var photo in photos){
				photoLayers.push(photos[photo]);
			}
			layerGroups.push({name: 'Aerial photos', layers: photoLayers, singleSelect: true}); //sort?
		}
		map.getLayers().forEach(function(layer){
			var name = layer.get('name'); 
			if (name && !photos[name]){
				layers.push(layer);
			}
		});
		if (layers.length){
			layerGroups.push({name: 'Data layers', layers: layers}); //sort?
		}
		return layerGroups;
	}
};

/**
 * @desc Layer group
 * @public
 * @typedef {Object}
 * @property {string} name The group name
 * @property {Array<ol.layer.Base>} layers The layers (layers should have a name property)
 * @property {boolean} [singleSelect=false] Only one layer per group can be visible at a time
 * @property {boolean} [expanded=false] The group starting display state
 */
nyc.ol.control.LayerMgr.LayerGroup;

/**
 * @desc Constructor options for {@link nyc.Choice}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map containing layers to manage
 * @property {Element|JQuery|string} target= The target DOM node for creating the layer manager
 * @property {Array<nyc.ol.control.LayerMgr.LayerGroup>} =layerGroups Grouped layers to manage (default is all map layers with a name property)
 */
nyc.ol.control.LayerMgr.Options;


/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerMgr.HTML = '<a id="btn-layer-mgr" class="ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext" title="Layer manager">' +
		'Layer manager' +
	'</a>';

