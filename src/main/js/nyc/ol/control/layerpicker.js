var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer a picker
 * @public
 * @abstract
 * @class
 * @extends {nyc.CtlContainer}
 * @mixes nyc.Menu
 * @constructor
 * @param {nyc.ol.control.LayerPicker.Options} options Constructor options
 */
nyc.ol.control.LayerPicker = function(options){
	this.map = options.map;
	this.target = options.target;
	this.layerGroups = options.layerGroups || this.getLayerGoupsFromMap(options.map);
	this.controls = [];
	this.render(this.map, this.layerGroups, this.target);
};

nyc.ol.control.LayerPicker.prototype = {
	/**
	 * @desc The map from which layers can be picked
	 * @public
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {Element|JQuery|string}
	 */
	target: null,
	/**
	 * @private
	 * @member {JQuery}
	 */
	container: null,
	/**
	 * @desc The layer picker controls
	 * @public
	 * @member {Array<nyc.Choice>}
	 */
	controls: null,
	/**
	 * @desc The layer groups displayed on the picker
	 * @public
	 * @member {Array<nyc.ol.control.LayerPicker.LayerGroup>}
	 */
	layerGroups: null,
	/**
	 * @desc Provides layer groups from the map when they are not provided to the constructor
	 * @public
	 * @method
	 * @abstract
	 * @param {ol.Map} map
	 * @return {Array<nyc.ol.control.LayerPicker.LayerGroup>}
	 */
	getLayerGoupsFromMap: function(map){
		throw 'Must be implemented';
	},
	/**
	 * @desc Return a map of layers by name
	 * @public
	 * @method
	 * @abstract
	 * @return {Object<string, ol.layer.Base>}
	 */
	getLayers: function(){
		var layers = {};
		$.each(this.layerGroups, function(_, group){
			$.each(group.layers, function(_, layer){
				layers[layer.get('name')] = layer;
			});
		});
		return layers;
	},
	/**
	 * @desc Provides an HTML DOM element class for menu creation when a DOM target is not provided to the constructor
	 * @public
	 * @method
	 * @abstract
	 * @return {string}
	 */
	getMenuClass: function(){
		throw 'Must be implemented';
	},
	/**
	 * @desc Provides an HTML string for creating a menu actuator when a DOM target is not provided to the constructor
	 * @public
	 * @method
	 * @abstract
	 * @return {string}
	 */
	getButtonHtml: function(){
		throw 'Must be implemented';
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 */
	addButton: function(map){
		var btn = $(this.getButtonHtml());
		$(map.getTarget()).append(btn).trigger('create');
		btn.click($.proxy(this.toggleMenu, this));
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 * @return {JQuery}
	 */
	getContainer: function(){
		if (this.container) return this.container;
		var container = this.target ? $(this.target) : $('<div class="' + this.getMenuClass() + ' ctl-mnu-tgl"></div>');
		this.container = container;
		if (this.target) return container;
		$(this.map.getTarget()).append(container);
		this.menu = container.get(0);
		this.addButton(this.map);
		return container;
	},
	/**
	 * @private
	 * @method
	 * @param {string} selector
	 * @return {JQuery}
	 */
	getElem: function(selector){
		return this.container.find(selector);
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 * @param {Array<nyc.ol.control.LayerPicker.LayerGroup>} layerGroups
	 * @param {JQuery} target
	 */
	render: function(map, layerGroups, target){
		var container = this.getContainer(), controls = this.controls;
		$.each(layerGroups, function(_, group){
			var hasVis = false, options = {target: $('<div></div>'), title: group.name, expanded: group.expanded, choices: []};
			container.append(options.target);
			$.each(group.layers, function(_, layer){
				var name = layer.get('name'), vis = layer.getVisible();
				options.choices.push({value: name, label: name, checked: vis});
				hasVis = hasVis || vis;
			});
			if (group.singleSelect){
				options.choices.unshift({value: 'none', label: 'None', checked: !hasVis});
				controls.push(new nyc.Radio(options));
			}else{
				controls.push(new nyc.Check(options));
			}
		});
	}
};

nyc.inherits(nyc.ol.control.LayerPicker, nyc.CtlContainer);
nyc.inherits(nyc.ol.control.LayerPicker, nyc.Menu);

/**
 * @desc Layer group for {@link nyc.ol.control.LayerPicker.Options}
 * @public
 * @typedef {Object}
 * @property {string} name The group name
 * @property {Array<ol.layer.Base>} layers The layers (layers should have a name property)
 * @property {boolean} [singleSelect=false] Only one layer per group can be visible at a time
 * @property {boolean} [expanded=false] The group starting display state
 */
nyc.ol.control.LayerPicker.LayerGroup;

/**
 * @desc Constructor options for {@link nyc.ol.control.LayerPicker}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map containing layers to manage
 * @property {Element|JQuery|string=} target The target DOM node for creating the layer manager
 * @property {Array<nyc.ol.control.LayerPicker.LayerGroup>=} layerGroups Grouped layers to manage (default is all map layers with a name property)
 */
nyc.ol.control.LayerPicker.Options;
