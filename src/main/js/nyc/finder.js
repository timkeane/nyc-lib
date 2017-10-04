var nyc = nyc || {};

/**
 * @desc An class for creating basic facility finder apps
 * @public
 * @class
 * @constructor
 * @param {nyc.FinderApp.Options} options Constructor options
 */
nyc.FinderApp = function(options){
  nyc.finder = this;
  $('body').append(nyc.FinderApp.TEMPLATE_HTML).trigger('create');
  this.map = options.map;
  $('#main').append(this.map.getTarget());
  this.view = this.map.getView();
  this.finderSource = options.finderSource;
  this.locationMgr = options.locationMgr;
  this.popup = new nyc.ol.Popup(this.map);
  this.pager = new nyc.ListPager();
  this.location = {};
  this.connectFilterControls(options.filterControls);
  this.initDirections(options.directionsUrl);
  this.map.on('click', this.mapClick, this);
  this.locationMgr.on(nyc.Locate.EventType.GEOCODE, this.located, this);
  this.locationMgr.on(nyc.Locate.EventType.GEOLOCATION, this.located, this);
  new nyc.Share(this.map.getTarget());
  $('#tabs li a').click($.proxy(this.tabs, this));
  $('body').pagecontainer({change: $.proxy(this.hideBannerText, this)});
  $(window).resize($.proxy(this.resize, this));
  this.ready();
};

nyc.FinderApp.prototype = {
  /**
  * @public
  * @member {ol.Map}
  */
  map: null,
  /**
  * @public
  * @member {ol.View}
  */
  view: null,
  /**
  * @public
  * @member {nyc.ol.source.FilteringAndSorting}
  */
  finderSource: null,
  /**
  * @private
  * @member {Array<nyc.Choice>}
  */
  filterControls: null,
  /**
  * @private
  * @member {nyc.Directions}
  */
  directions: null,
  /**
  * @private
  * @member {nyc.ol.Popup}
  */
  popup: null,
  /**
  * @private
  * @member {nyc.Locate.Result}
  */
  location: null,
  /**
  * @private
  * @member {string}
  */
  lastDir: null,
  /**
  * @desc Method to handle {@link nyc.Locate} events
  * @public
  * @method
  * @param {nyc.Locate.Result} location
  */
  located: function(location){
    this.location = location;
    this.listFacilities();
  },
  /**
   * @desc Method to zoom to facility location on map button click
   * @public
   * @method
   * @param {JQuery.Event} event
   */
  zoomTo: function(event){
    var me = this, feature = $(event.target).data('feature');
    me.view.animate({
      zoom: 15,
      center: feature.getGeometry().getCoordinates()
    });
    me.map.once('moveend', function(){
      me.showPopup(feature);
    });
    if ($('#panel').width() == $(window).width()){
      $('#map-tab-btn a').trigger('click');
    }
  },
  /**
   * @desc Method to get directions from user location to facility location on directions button click
   * @public
   * @method
   * @param {JQuery.Event} event
   */
  directionsTo: function(event){
    var feature = $(event.target).data('feature'),
      to = feature.getAddress(),
      name = feature.getName(),
      from = this.origin();
    if (this.lastDir != from + '|' + to){
      this.lastDir = from + '|' + to;
      this.directions.directions({
        from: decodeURIComponent(from),
        to: decodeURIComponent(to),
        facility: decodeURIComponent(name)
      });
    }
    $('body').pagecontainer('change', '#dir-page', {transition: 'slideup'});
  },
  /**
   * @desc Method to handle map click and show popup if appropriate
   * @public
   * @method
   * @param {ol.MapBrowserEvent} event
   */
  mapClick: function(event){
    var feature;
    this.map.forEachFeatureAtPixel(event.pixel, function(f){
      feature = f;
    });
    if (feature){
      this.showPopup(feature);

    }
  },
  /**
   * @desc Method to show popup on a facility feature
   * @public
   * @method
   * @param {ol.MapBrowserEvent} event
   */
  showPopup: function(feature){
      this.popup.show({
        html: feature.html(),
        coordinates: feature.getGeometry().getCoordinates()
      });
  },
  /**
   * @desc Method to list facilities
   * @public
   * @method
   * @param {ol.MapBrowserEvent} event
   */
  listFacilities: function(){
    var features = this.finderSource.sort(this.location.coordinates);
    this.popup.hide();
    this.pager.reset(features);
    $('#facility-list').empty();
    this.listNextPage();
  },
  /**
   * @desc Method to page through facilities
   * @public
   * @method
   * @param {ol.MapBrowserEvent} event
   */
  listNextPage: function(){
		var container = $('#facility-list');
		$.each(this.pager.next(), function(i, feature){
			var div = feature.html();
			if (i % 2 == 0) $(div).addClass('even-row');
			$('#facility-list').append(div).trigger('create');
		});
		$('#btn-more')[$('#facility-list').children().length == this.finderSource.getFeatures().length ? 'fadeOut' : 'fadeIn']();
	},
  /**
   * @desc Method to adjust layout for mobile
   * @private
   * @method
   */
  resize: function(){
    var size = this.windowSize();
    if ($('#panel').width() != size.width && $('#map-tab-btn').hasClass('ui-tabs-active')){
    	$('#facility-tab-btn a').trigger('click');
    }
    this.adjDirPage(size);
  },
  /**
   * @desc Method to adjust layout of directions page for mobile
   * @private
   * @method
   * @param {Object<string, number>} size
   */
  adjDirPage: function(size){
    if (size.height < size.width && this.activePage() == 'dir-page'){
			$('#dir-toggle a:last-of-type:not(.ui-btn-active)').trigger('click');
    }
  },
  /**
   * @desc Get the id of the active page of pagecontainer
   * @private
   * @method
   * @return {string}
   */
  activePage: function(){
    return $('body').pagecontainer().pagecontainer('getActivePage').attr('id');
  },
  /**
   * @desc Get the id of the active page of pagecontainer
   * @private
   * @method
   * @return {string}
   */
  hideBannerText: function(){
    var hide = $('#dir-panel').width() == $(window).width() && $('body').pagecontainer('getActivePage').attr('id') == 'dir-page';
    $('body').append($('h1.banner'));
    $('h1.banner span')[hide ? 'hide' : 'fadeIn']();
  },
  /**
   * @desc Method to get window size
   * @private
   * @method
   * @return {Object<string, number>}
   */
  windowSize: function(){
    var win = $(window);
    return {width: win.width(), height: win.height()};
  },
  /**
   * @desc Method to adjust layout for mobile
	 * @private
	 * @method
	 * @param {JQuery.Event} event
	 */
	tabs: function(event){
    var target = $(event.currentTarget);
		$('#panel').css(
			'z-index',
			target.attr('href') == '#map-tab' ? 999 : 1000
		);
  },
  /**
   * @desc Intialize directions using provided URL
	 * @private
	 * @method
   * @param {string} url
	 */
  initDirections: function(url){
    if (url){
      this.directions = new nyc.Directions('#dir-map', '#directions', url);
    }
  },
  /**
   * @dec Method to connected filter controls change event
	 * @private
	 * @method
   * @param {Array<nyc.Choice>} filterControls
	 */
	connectFilterControls: function(filterControls){
    this.filterControls = filterControls;
    if (filterControls && filterControls.length){
      var me = this, tab = $('#filter-tab');
      $.each(filterControls, function(){
        tab.append(this.container);
        this.on('change', me.filter, me);
      });
    }else{
      $('body').addClass('finder-no-filter');
    }
	},
  /**
   * @desc Convert current user location into usalbe form for Google directions API
   * @private
   * @method
   * @return {string|Array<number>}
   */
  origin: function(){
		var location = this.location || {};
		if (location.type == 'geolocation'){
			var coordinates = proj4('EPSG:3857', 'EPSG:4326', location.coordinates);
			return [coordinates[1], coordinates[0]];
		}
		return location.name || '';
	},
  /**
   * @desc Filter features
   * @private
   * @method
   */
  filter: function(){
		var me = this, namedFilters = {}, filters = [];
		$.each(me.filterControls, function(_, control){
			$.each(control.val(), function(__, choice){
				var filter = namedFilters[choice.name] || [];
				filter = filter.concat(('' + choice.value).split(','));
				namedFilters[choice.name] = filter;
			});
		});
		for (var name in namedFilters){
			filters.push({property: name, values: namedFilters[name]});
		}
		/* provide time for checkbox display to update */
		setTimeout(function(){
      me.finderSource.filter(filters);
			me.listFacilities();
		}, 100);
	},
  /**
   * @desc Wait for features to load then list them
   * @private
   * @method
   */
   ready: function(){
     if (this.finderSource.get('featuresloaded')){
       this.listFacilities();
       $('#facility-tab-btn a').trigger('click');
       $('body').pagecontainer().pagecontainer('change', '#map-page', {transition: 'slideup'});
     }else{
       setTimeout($.proxy(this.ready, this), 200);
     }
   }
};

/**
 * @desc Object type to hold constructor options for {@link nyc.FinderApp}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map
 * @property {nyc.ol.source.FilteringAndSorting} finderSource
 * @property {nyc.LocationMgr} locationMgr
 * @property {Array<nyc.Choice>} filterControls
 * @property {string} directionsUrl
 */
nyc.FinderApp.Options;

/**
 * @desc Basic HTML to support facility finder
 * @public
 * @const
 * @type {string}
 */
nyc.FinderApp.TEMPLATE_HTML = '<div id="map-page" data-role="page">' +
  '<div id="main" data-role="main" class="ui-content"></div>' +
  '<div id="panel">' +
    '<div id="panel-content">' +
      '<div id="tabs" data-role="tabs">' +
        '<div data-role="navbar">' +
          '<ul>' +
            '<li id="map-tab-btn">' +
              '<a href="#map-tab">Map</a>' +
            '</li>' +
            '<li id="facility-tab-btn">' +
              '<a class="ui-btn-active" href="#facility-tab">Locations</a>' +
            '</li>' +
            '<li id="filter-tab-btn">' +
              '<a href="#filter-tab">Filter</a>' +
            '</li>' +
          '</ul>' +
        '</div>' +
        '<div id="map-tab"></div>' +
        '<div id="facility-tab">' +
          '<div id="facility-list"></div>' +
          '<div id="btn-more"><a data-role="button">More...</a></div>' +
        '</div>' +
        '<div id="filter-tab"></div>' +
      '</div>' +
    '</div>' +
  '</div>' +
'</div>' +
'<div id="dir-page" data-role="page">' +
  '<a id="back-to-map" data-role="button" data-icon="arrow-l" class="hdr-btn back-btn ui-btn-right" href="#map-page" data-transition="slidedown">' +
    'Back to finder' +
  '</a>' +
  '<div data-role="content">' +
    '<div id="dir-panel">' +
      '<div id="dir-content">' +
        '<div class="fld-lbl">From my location:</div>' +
        '<div id="fld-from"><input placeholder="Enter an address..."></div>' +
        '<div class="fld-lbl">To <span id="fld-facility"></span>:</div>' +
        '<div id="fld-to"></div>' +
        '<table id="dir-mode">' +
          '<tbody><tr>' +
            '<td><a id="mode-transit" class="dir-mode-btn active-mode" data-role="button" data-mode="TRANSIT" title="Get transit directions">' +
              '<span class="noshow">Get transit directions</span>' +
            '</a></td>' +
            '<td><a id="mode-bike" class="dir-mode-btn" data-role="button" data-mode="BICYCLING" title="Get bicycling directions">' +
              '<span class="noshow">Get bicycling directions</span>' +
            '</a></td>' +
            '<td><a id="mode-walk" class="dir-mode-btn" data-role="button" data-mode="WALKING" title="Get walking directions">' +
              '<span class="noshow">Get walking directions</span>' +
            '</a></td>' +
            '<td><a id="mode-car" class="dir-mode-btn" data-role="button" data-mode="DRIVING" title="Get driving directions">' +
              '<span class="noshow">Get driving directions</span>' +
            '</a></td>' +
          '</tr></tbody>' +
        '</table>' +
      '</div>' +
      '<div id="directions"></div>' +
    '</div>' +
    '<div id="dir-main">' +
      '<div id="dir-map"></div>' +
    '</div>' +
    '<div id="dir-toggle" data-role="controlgroup" data-type="horizontal">' +
      '<a class="toggle-map capitalize" data-role="button">Map</a>' +
      '<a class="ui-btn-active capitalize" data-role="button">Directions</a>' +
    '</div>' +
  '</div>' +
'</div>';
