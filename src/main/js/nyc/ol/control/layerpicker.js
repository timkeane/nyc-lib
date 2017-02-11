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
	 * @desc Provides notification that layers form a group namespace have been added  
	 * @public
	 * @method
	 * @abstract
	 * @param {nyc.Choice} control
	 * @param {Object} group
	 * @param {Array<ol.layer.Base>} layers
	 */
	loadedGroup: function(group, layers){},
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
		var me = this, controls = me.controls;
		$.each(layerGroups, function(_, group){
			var control = me.getControl(group);
			controls.push(control);
			if (group.layers.groupLayerClass){
				control.container.find('h3')
					.data('control', control)
					.data('group', group)
					.one('click', $.proxy(me.getGroup, me));
			}else{
				me.setChoices(control, group.layers);
			}		
		});
	},
	getControl: function(group){		
		var options = {target: $('<div></div>'), title: group.name, expanded: group.expanded}, control;
		this.getContainer().append(options.target);
		if (group.singleSelect){
			control = new nyc.Radio(options);
		}else{
			control = new nyc.Check(options);
		}
		return control;
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Choice} control
	 * @param {Array<ol.layer.Base>} layers
	 */
	setChoices: function(control, layers){
		var hasVis = false, choices = [];
		$.each(layers, function(){
			var name = this.get('name'), vis = this.getVisible();
			choices.push({value: name, label: name, checked: vis});
			hasVis = hasVis || vis;
		});
		if (control.type == 'radio'){
			choices.unshift({value: 'none', label: 'None', checked: !hasVis});
		}
		control.setChoices(choices);
	},
	/**
	 * @private
	 * @method
	 * @param {JQueryEvent} event
	 */
	getGroup: function(event){
		var target = $(event.delegateTarget);
		this.populateGroup(target.data('control'), target.data('group'));
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Choice} control
	 * @param {nyc.ol.control.LayerPicker.LayerGroup} layerGroup
	 */
	populateGroup: function(control, layerGroup){
		var group = this.instantiateGroup(layerGroup.layers.groupLayerClass);
		if (group){
			var layers = group.addedLayers.groupLayers;
			this.setChoices(control, layers);
			this.loadedGroup(control, layerGroup, layers);
		}else{
			var me = this;
			$.getScript(layerGroup.layers.url, function(){
				me.populateGroup(control, layerGroup);
			});
		}
	},
	instantiateGroup: function(groupLayerClass){
		var group = groupLayerClass;
		if (typeof groupLayerClass == 'string'){
			group = window;
			$.each(groupLayerClass.split('.'), function(){
				group = group[this];
				if (!group) return false;
			});
		}
		if (group){
			return new group(this.map);
		}
	}
};

nyc.inherits(nyc.ol.control.LayerPicker, nyc.CtlContainer);
nyc.inherits(nyc.ol.control.LayerPicker, nyc.Menu);

/**
 * @desc Layer group for {@link nyc.ol.control.LayerPicker.Options}
 * @public
 * @typedef {Object}
 * @property {string} name The group name
 * @property {Array<ol.layer.Base>|nyc.ol.control.LayerPicker.LayerGroupNamespace=} layers The layers (layers should have a name property)
 * @property {boolean} [singleSelect=false] Only one layer per group can be visible at a time
 * @property {boolean} [expanded=false] The group starting display state
 */
nyc.ol.control.LayerPicker.LayerGroup;

/**
 * @desc Layer group namespace for {@link nyc.ol.control.LayerPicker.LayerGroup}
 * @public
 * @typedef {Object}
 * @property {string} name The group name
 * @property {Object|string} namespace A layer group namespace
 * @property {string=} url The URL to the layer group JavaScript
 */
nyc.ol.control.LayerPicker.LayerGroupNamespace;

/**
 * @desc Constructor options for {@link nyc.ol.control.LayerPicker}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map containing layers to manage
 * @property {Element|JQuery|string=} target The target DOM node for creating the layer manager
 * @property {Array<nyc.ol.control.LayerPicker.LayerGroup>=} layerGroups Grouped layers to manage (default is all map layers with a name property)
 */
nyc.ol.control.LayerPicker.Options;
