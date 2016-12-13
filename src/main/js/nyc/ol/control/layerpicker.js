var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer a picker
 * @public
 * @class
 * @extends {nyc.Menu}
 * @constructor
 * @param {nyc.ol.control.LayerPicker.Options} options Constructor options
 */
nyc.ol.control.LayerPicker = function(options){
	this.map = options.map;
	this.layerGroups = this.getLayerGoupsFromMap(options.map);
	this.controls = [];
	this.render(this.map, this.layerGroups, options.target);
};

nyc.ol.control.LayerPicker.prototype = {
	/**
	 * @private
	 * @member {JQuery}
	 */
	container: null,
	/**
	 * @public
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @public
	 * @member {Array<nyc.Choice>}
	 */
	controls: null,
	/**
	 * @public
	 * @member {Array<nyc.ol.control.LayerPicker.LayerGroup>}
	 */
	layerGroups: null,
	/**
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
	 * @public
	 * @method
	 * @abstract
	 * @return {string}
	 */
	getMenuId: function(){
		throw 'Must be implemented';
	},
	/**
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
	 * @param {Element|JQuery|string} target=
	 * @return {JQuery} 
	 */
	getContainer: function(map, target){
		var container = target ? $(target) : $('<div id="' + this.getMenuId() + '" class="ctl-mnu-tgl"></div>');
		this.container = container;
		if (target) return container;
		$(map.getTarget()).append(container);
		this.menu = container.get(0);
		this.addButton(map);
		return container;
	},
	/**
	 * @private
	 * @method
	 * @param {ol.Map} map
	 * @param {Array<nyc.ol.control.LayerPicker.LayerGroup>} layerGroups
	 * @param {JQuery} target
	 */
	render: function(map, layerGroups, target){
		var container = this.getContainer(map, target), controls = this.controls;
		$.each(layerGroups, function(_, group){
			var options = {target: $('<div></div>'), title: group.name, expanded: group.expanded, choices: []};
			container.append(options.target);
			$.each(group.layers, function(_, layer){
				var name = layer.get('name');
				options.choices.push({value: name, label: name, checked: layer.getVisible()});
			});
			if (group.singleSelect){
				controls.push(new nyc.Radio(options));
			}else{
				controls.push(new nyc.Check(options));	
			}
		});
		setTimeout(function(){
			$(container).find('input').each(function(){
				$(this).checkboxradio();
			});
		}, 100);
	}
};

nyc.inherits(nyc.ol.control.LayerPicker, nyc.Menu);

/**
 * @desc Layer group
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
 * @property {Element|JQuery|string} target= The target DOM node for creating the layer manager
 * @property {Array<nyc.ol.control.LayerPicker.LayerGroup>} =layerGroups Grouped layers to manage (default is all map layers with a name property)
 */
nyc.ol.control.LayerPicker.Options;
