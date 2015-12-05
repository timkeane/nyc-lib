/** 
 * @export 
 * @namespace
 */
window.nyc = window.nyc || {};

/**
 * @export
 * @class
 * @classdesc  Abstract class for zoom and search controls
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {(boolean|undefined)} useSearchTypeMenu
 */
nyc.ZoomSearch = function(useSearchTypeMenu){
	var me = this;
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
	 * @export
	 * @method
	 * @abstract
	 * @return {JQuery} 
	 */
	container: function(){},
	/**
	 * @export
	 * @method
	 * @abstract
	 */
	zoom: function(e){},
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
	 * Set or get the value of the search field 
	 * @export
	 * @method
	 * @param {string=} val
	 * @return {string}
	 */
	val: function(val){
		if (typeof val == 'string'){
			this.input.val(val);
			this.searching(false);
		}
		return 	this.input.val();
	},
	/**
	 * Displays possible address matches 
	 * @export
	 * @method
	 * @param {Array.<nyc.Locate.LocateResult>} possibleResults
	 */
	disambiguate: function(possibleResults){
		var me = this;
		me.searching(false);
		if (possibleResults.length){
			me.emptyList();
			$.each(possibleResults, function(i, locateResult){
				me.list.append(me.listItem('addr', locateResult));
			});
			me.list.children().first().addClass('ui-first-child');
			me.list.children().last().addClass('ui-last-child');
			me.list.slideDown();
		}
	},
	/**
	 * @private
	 * @method
	 * @param {string} typeName
	 * @param {string} featureName
	 * @param {nyc.Locate.LocateResult} data
	 * @return {JQuery}
	 */
	listItem: function(typeName, data){
		var li = $('<li class="ui-li-static ui-body-inherit"></li>');
		li.addClass('srch-type-' + typeName);
		li.addClass('notranslate');
		li.attr('translate', 'no');
		li.html(data.name);
		li.data('location', {
			 name: data.name,
			 coordinates: data.coordinates,
			 geoJsonGeometry: data.geoJsonGeometry,
			 accuracy: data.accuracy,
			 type: nyc.Locate.LocateResultType.GEOCODE,
			 data: data.data
		});
		li.click($.proxy(this.diambiguated, this));
		return li;
	},
	/**
	 * Set searching status
	 * @export
	 * @method
	 * @param {boolean} show
	 */
	searching: function(show){
		$('#fld-srch-container a.ui-input-clear')[show ? 'addClass' : 'removeClass']('searching');
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
	 * @method
	 */
	emptyList: function(){
		$('#fld-srch-retention').append($('#fld-srch li'));
		this.list.empty();
	},
	/**
	 * Add searchable features
	 * @export
	 * @method
	 * @param {string} featureTypeName
	 * @param {string} featureTypeTitle
	 * @param {string} placeholder
	 * @param {Array<Object>} features
	 */
	setFeatures: function(featureTypeName, featureTypeTitle, placeholder, features){
		var me = this,
			li = $('<li></li>'), 
			span = $('<span class="ui-btn-icon-left"></span>');
		li.addClass('srch-type-feature');
		li.addClass('srch-type-' + featureTypeName);
		li.data('srch-type', featureTypeName);
		li.data('placeholder', placeholder);
		span.addClass('srch-icon-' + featureTypeName);		
		li.append(span);
		li.append(featureTypeTitle);
		$('#mnu-srch-typ').append(li).listview('refresh');
		li.click($.proxy(me.choices, me));
		$.each(features, function(_, f){
			$('#fld-srch-retention').append(
				me.listItem(
					featureTypeName,
					{
						name: f.properties.name, 
						geoJsonGeometry: f.geometry, 
						data: f.properties,
						accuracy: nyc.Geocoder.Accuracy.HIGH
					}
				)
			);
		});
	},
	/**
	 * @private
	 * @method
	 * @param {Object} e
	 */
	diambiguated: function(e){
		var li = $(e.target);
		this.val(li.html());
		this.trigger(nyc.ZoomSearch.EventType.DISAMBIGUATED, li.data('location'));
		li.parent().slideUp();
	}		
};

nyc.inherits(nyc.ZoomSearch, nyc.EventHandling);

/**
 * Enum for control action event type
 * @export
 * @enum {string}
 */
nyc.ZoomSearch.EventType = {
	SEARCH: 'search',
	GEOLOCATE: 'geolocate',
	DISAMBIGUATED: 'disambiguated'
};

/**
 * @export
 * @const
 * @type {string}
 */
nyc.ZoomSearch.BASIC_HTML = 
	'<div id="ctl-z-srch">' +
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
 * @export
 * @const
 * @type {string}
 */
nyc.ZoomSearch.SEARCH_TYPES_HTML = 
	'<div id="ctl-z-srch" class="srch-types">' +
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
