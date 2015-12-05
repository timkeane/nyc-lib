/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.ol = nyc.ol || {};
/** @export */
nyc.ol.control = nyc.ol.control || {};

/**
 * Class for providing a set of buttons to zoom and search.
 * @export
 * @constructor
 * @param {ol.Map} map
 */
nyc.ol.control.ZoomSearch = function(map){
	var me = this;
	$(map.getTarget()).append(nyc.ol.control.ZoomSearch.HTML).trigger('create');
	map.addControl(new ol.control.Control({element: $('#ctl-z-srch')[0]}));
	me.map = map;
	me.view = map.getView();
	me.input = $('#fld-srch-container input');
	me.list = $('#fld-srch');
	me.input.on('keyup change', $.proxy(me.key, me));
	$('#btn-z-in, #btn-z-out').click($.proxy(me.zoom, me));
	$('#fld-srch-container .ui-input-clear').click(function(){
		me.list.slideUp();
	});
	$('#srch-type-addr').click(function(){
		me.val('');
		me.input.focus();
	});
	$('#btn-geo').click(function(){
		me.val('');
		me.trigger(nyc.ol.control.ZoomSearch.EventType.GEOLOCATE);
	});
};

nyc.ol.control.ZoomSearch.prototype = {
	/** @private */
	map: null,
	/** @private */
	zoom: function(e){
		var view = this.view;
		this.map.beforeRender(ol.animation.zoom({resolution: view.getResolution()}));
		view.setZoom(view.getZoom() + $(e.target).data('zoom-incr'));
	},
	/** @private */
	key: function(e){
		if (e.keyCode == 13){
			this.triggerSearch();
			this.list.slideUp();
		}else{
			this.list.slideDown();
		}
	},
	/** @private */
	triggerSearch: function(){
		var input = this.val().trim();
		if (input.length){
			this.input.blur();
			this.searching(true);
			this.trigger(nyc.ol.control.ZoomSearch.EventType.SEARCH, input);
		}			
	},
	/**
	 * Set or get the value of the search field 
	 * @export
	 * @param {string|undefined} val
	 */
	val: function(val){
		if (val){
			this.input.val(val);
			this.searching(false);
		}
		return 	this.input.val();
	},
	/**
	 * Displays possible address matches 
	 * @export
	 * @param {Array.<nyc.Locate.LocateResult>} possibleResults
	 */
	disambiguate: function(possibleResults){
		var me = this;
		me.searching(false);
		if (possibleResults.length){
			me.list.empty();
			$.each(possibleResults, function(i, locateResult){
				var name = locateResult.name,
					li = $('<li class="ui-li-static ui-body-inherit srch-type-addr notranslate" translate="no">' + name + '</li>');
				me.list.append(li);
				li.click(function(){
					me.val(name);
					me.trigger(nyc.ol.control.ZoomSearch.EventType.DISAMBIGUATED, locateResult);
					li.parent().slideUp();
				});
			});
			me.list.slideDown();
		}
	},
	/**
	 * Set searching status
	 * @export
	 * @param {boolean} show
	 */
	searching: function(show){
		$('#fld-srch-container a.ui-input-clear')[show ? 'addClass' : 'removeClass']('searching');
	}
};

nyc.inherits(nyc.ol.control.ZoomSearch, nyc.EventHandling);

/**
 * Enum for control action event type
 * @export
 * @enum {string}
 */
nyc.ol.control.ZoomSearch.EventType = {
	SEARCH: 'search',
	GEOLOCATE: 'geolocate',
	DISAMBIGUATED: 'disambiguated'
};

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.ZoomSearch.HTML = 
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
