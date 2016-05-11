var nyc = nyc || {};

/**
 * @desc  Abstract class for zoom and search controls
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {boolean} [useSearchTypeMenu=false] Use search types menu
 */
nyc.ZoomSearch = function(useSearchTypeMenu){
	var me = this;
	me.useSearchTypeMenu = useSearchTypeMenu;
	me.render(useSearchTypeMenu);
	me.typBtn = $('#btn-srch-typ');
	me.input = $('#fld-srch-container input');
	me.list = $('#fld-srch');
	me.typBtn.click($.proxy(me.searchType, me));
	me.input.on('keyup change', $.proxy(me.key, me));
	$('#btn-z-in, #btn-z-out').click($.proxy(me.zoom, me));
	$('#fld-srch-container .ui-input-clear').click(function(){
		me.list.slideUp();
	});
	$('#btn-geo, #srch-type-geo').click(function(){
		me.val('');
		me.input.attr('placeholder', 'Search for an address...');
		me.trigger(nyc.ZoomSearch.EventType.GEOLOCATE);
	});
	$('#mnu-srch-typ li').click($.proxy(me.choices, me));
};

nyc.ZoomSearch.prototype = {
	/**
	 * @private
	 * @member {boolean}
	 */
	isAddrSrch: true,
	/**
	 * @private
	 * @member {JQuery}
	 */
	input: true,
	/**
	 * @desc A method to return the map container  HTML element wrapped in a JQuery
	 * @public
	 * @abstract
	 * @method
	 * @return {JQuery} The the map container HTML element wrapped in a JQuery
	 */
	container: function(){
		throw 'Must be implemented';
	},
	/**
	 * @desc Handle the zoom event triggered by user interaction
	 * @public
	 * @abstract
	 * @method
	 * @param event The DOM event triggered by the zoom buttons
	 */
	zoom: function(event){
		throw 'Must be implemented';
	},
	/**
	 * @public
	 * @abstract
	 * @method
	 * @param {Object} feature The feature object
	 * @param {nyc.ZoomSearch.FeatureSearchOptions} options The options passed to setFeature
	 * @return {nyc.Locate.Result}
	 */
	featureAsLocation: function(feature, options){
		throw 'Must be implemented';
	},
	/**
	 * @private
	 * @method
	 * @param {boolean} useSearchTypeMenu
	 */
	render: function(useSearchTypeMenu){
		var html = nyc.ZoomSearch[useSearchTypeMenu ? 'SEARCH_TYPES_HTML' : 'BASIC_HTML'];
		this.container().append(html).trigger('create');
	},
	/**
	 * @private
	 * @method
	 * @param {Object} e
	 */
	key: function(e){
		if (e.keyCode == 13 && this.isAddrSrch){
			this.triggerSearch();
			this.list.slideUp();
		}else{
			$('#mnu-srch-typ').hide();
			this.list.slideDown();
		}
	},
	/**
	 * @private
	 * @method
	 */
	triggerSearch: function(){
		var input = this.val().trim();
		if (input.length){
			this.input.blur();
			this.searching(true);
			this.trigger(nyc.ZoomSearch.EventType.SEARCH, input);
		}			
	},
	/**
	 * @desc Set or get the value of the search field 
	 * @public
	 * @method
	 * @param {string=} val The value for the search field
	 * @return {string} The value of the search field
	 */
	val: function(val){
		if (typeof val == 'string'){
			this.input.val(val);
			this.searching(false);
		}
		return 	this.input.val();
	},
	/**
	 * @desc Displays possible address matches 
	 * @public
	 * @method
	 * @param {nyc.Locate.Ambiguous} ambiguous Possible locations resulting from a geocoder search to display to the user
	 */
	disambiguate: function(ambiguous){
		var me = this, possible = ambiguous.possible;
		me.searching(false);
		if (possible.length){
			me.emptyList(true);
			$.each(possible, function(i, locateResult){
				me.list.append(me.listItem('addr', locateResult));
			});
			me.list.children().first().addClass('ui-first-child');
			me.list.children().last().addClass('ui-last-child');
			me.list.slideDown();
		}
	},
	/**
	 * @desc Set searching status to display to the user
	 * @public
	 * @method
	 * @param {boolean} show Show searching status
	 */
	searching: function(show){
		$('#fld-srch-container a.ui-input-clear')[show ? 'addClass' : 'removeClass']('searching');
	},
	/**
	 * @desc Add searchable features
	 * @public
	 * @method
	 * @param {nyc.ZoomSearch.FeatureSearchOptions} options The options for creating a feature search
	 */
	setFeatures: function(options){
		var me = this,
			li = $('<li></li>'), 
			span = $('<span class="ui-btn-icon-left"></span>');
		options.nameField = options.nameField || 'name';
		li.addClass('srch-type-feature');
		li.addClass('srch-type-' + options.featureTypeName);
		li.data('srch-type', options.featureTypeName);
		li.data('placeholder', options.placeholder);
		span.addClass('srch-icon-' + options.featureTypeName);		
		li.append(span);
		li.append(options.featureTypeTitle);
		$('#mnu-srch-typ').append(li).listview('refresh');
		li.click($.proxy(me.choices, me));
		$.each(options.features, function(_, feature){
			var location = me.featureAsLocation(feature, options);
			$('#fld-srch-retention').append(me.listItem(options.featureTypeName, location));
		});
		me.emptyList();
	},
	/**
	 * @desc Remove searchable features
	 * @public
	 * @method
	 * @param {string} featureTypeName The featureTypeName used when the features were set
	 */
	removeFeatures: function(featureTypeName){
		$('li.srch-type-' + featureTypeName).remove();
		$('#mnu-srch-typ').listview('refresh');
		this.emptyList();
	},
	/**
	 * @private
	 * @method
	 * @param {string} typeName
	 * @param {nyc.Locate.Result} data
	 * @return {JQuery}
	 */
	listItem: function(typeName, data){
		var li = $('<li class="ui-li-static ui-body-inherit"></li>');
		li.addClass('srch-type-' + typeName);
		if (typeName != 'addr'){
			li.addClass('srch-type-feature');
		}
		li.addClass('notranslate');
		li.attr('translate', 'no');
		li.html(data.data.__feature_label || data.name);
		li.data('location', data);
		li.click($.proxy(this.disambiguated, this));
		return li;
	},
	/**
	 * @private
	 * @method
	 */
	searchType: function(){
		this.list.hide();
		$('#mnu-srch-typ').slideToggle();
		this.flipIcon();
	},
	/**
	 * @private
	 * @method
	 */
	flipIcon: function(){
		if (this.typBtn.hasClass('ui-icon-carat-d')){
			this.typBtn.removeClass('ui-icon-carat-d').addClass('ui-icon-carat-u');
		}else{
			this.typBtn.removeClass('ui-icon-carat-u').addClass('ui-icon-carat-d');			
		}		
	},
	/**
	 * @private
	 * @method
	 * @param {Object} e
	 */
	choices: function(e){
		var featureTypeName = $(e.target).data('srch-type') || 'addr',
			placeholder = $(e.target).data('placeholder') || 'Search for an address...';
		this.isAddrSrch = featureTypeName == 'addr';
		$('#mnu-srch-typ').slideUp();
		this.val('');
		this.input.focus();
		this.flipIcon();
		this.emptyList();
		this.input.attr('placeholder', placeholder);
		this.list.append($('#fld-srch-retention li.srch-type-' + featureTypeName))
			.listview('refresh');
	},
	/**
	 * @private
	 * @param {boolean} disambiguating
	 * @method
	 */
	emptyList: function(disambiguating){
		$('#fld-srch-retention').append($('#fld-srch li'));
		this.list.empty();
		if (!this.useSearchTypeMenu && !disambiguating){
			this.list.append($('#fld-srch-retention li.srch-type-feature'))
				.listview('refresh');
		}
	},
	/**
	 * @private
	 * @method
	 * @param {Object} e
	 */
	disambiguated: function(e){
		var li = $(e.target);
		this.val(li.html());
		this.trigger(nyc.ZoomSearch.EventType.DISAMBIGUATED, li.data('location'));
		li.parent().slideUp();
		this.emptyList();
	}		
};

nyc.inherits(nyc.ZoomSearch, nyc.EventHandling);

/**
 * @desc Object type to hold data about possible locations resulting from a geocoder search
 * @public
 * @typedef {Object}
 * @property {Array<Object|ol.Feature>} features The features to be searched 
 * @property {string} featureTypeName The name of the layer or feature type the features are from
 * @property {string} [nameField="name"] The name attribute field of the feature
 * @property {string=} labelField The attribute field to use as the label value for the generated list item
 * @property {string=} featureTypeTitle A title for the search type menu
 * @property {string=} placeholder A placeholder for the search field
 */
nyc.ZoomSearch.FeatureSearchOptions;

/**
 * @desc Enumeration for control action event type
 * @public
 * @enum {string}
 */
nyc.ZoomSearch.EventType = {
	/**
	 * The search event type
	 */
	SEARCH: 'search',
	/**
	 * The geolocate event type
	 */
	GEOLOCATE: 'geolocate',
	/**
	 * The disambiguated event type
	 */
	DISAMBIGUATED: 'disambiguated'
};

/**
 * @desc The value enterd in the search field
 * @event nyc.ZoomSearch#search
 * @type {string}
 */

/**
 * @desc A geolcation determination is requested
 * @event nyc.ZoomSearch#geolocate
 */

/**
 * @desc The user has chosen a location from a list of possible locations
 * @event nyc.ZoomSearch#disambiguated
 * @type {nyc.Locate.ResultType}
 */

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ZoomSearch.BASIC_HTML = 
	'<div id="ctl-z-srch" class="ol-unselectable">' +
	'<div id="fld-srch-container" class="ctl">' +
		'<ul id="fld-srch" class="ui-corner-all" data-role="listview" data-filter="true" data-filter-reveal="true" data-filter-placeholder="Search for an address..."></ul>' +
	'</div>' +
	'<a id="btn-z-in" class="ctl ctl-btn" data-role="button" data-icon="plus" data-iconpos="notext" data-zoom-incr="1" title="Zoom in">' +
		'<span class="noshow">Zoom in</span>' +
	'</a>' +
	'<a id="btn-z-out" class="ctl ctl-btn" data-role="button" data-icon="minus" data-iconpos="notext" data-zoom-incr="-1" title="Zoom out">' +
		'Zoom out' +
	'</a>' +
	'<a id="btn-geo" class="ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext" title="Current location">' +
		'Zoom out' +
	'</a>' +
	'<ul id="fld-srch-retention"></ul>' +
	'</div>';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ZoomSearch.SEARCH_TYPES_HTML = 
	'<div id="ctl-z-srch" class="srch-types ol-unselectable">' +
	'<div id="fld-srch-container" class="ctl">' +
		'<ul id="fld-srch" class="ui-corner-all" data-role="listview" data-filter="true" data-filter-reveal="true" data-filter-placeholder="Search for an address..."></ul>' +
		'<ul id="mnu-srch-typ" class="ctl ui-corner-all" data-role="listview">' + 
			'<li id="srch-by">Search by...</li>' +
			'<li id="srch-type-geo"><span class="ui-btn-icon-left srch-icon-geo"></span>My current location</li>' +
			'<li id="srch-type-addr"><span class="ui-btn-icon-left ui-icon-home"></span>Address, intersection, ZIP Code, etc.</li>' +
		'</ul>' +
		'<a id="btn-srch-typ" class="ui-btn ui-icon-carat-d ui-btn-icon-notext" title="Search Type">Search Type</a>' +
	'</div>' +
	'<a id="btn-z-in" class="ctl ctl-btn" data-role="button" data-icon="plus" data-iconpos="notext" data-zoom-incr="1" title="Zoom in">' +
		'<span class="noshow">Zoom in</span>' +
	'</a>' +
	'<a id="btn-z-out" class="ctl ctl-btn" data-role="button" data-icon="minus" data-iconpos="notext" data-zoom-incr="-1" title="Zoom out">' +
		'Zoom out' +
	'</a>' +
	'<ul id="fld-srch-retention"></ul>' +
	'</div>';
