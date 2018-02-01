var nyc = nyc || {};

/**
 * @desc A class for creating basic facility finder apps
 * @public
 * @class
 * @constructor
 * @param {nyc.FinderApp.Options} options Constructor options
 */
nyc.FinderApp = function(options){
  nyc.finder = this;
  $('body').append(nyc.FinderApp.TEMPLATE_HTML).trigger('create');
  this.map = options.map;
  this.zoomLevel = options.zoomLevel || nyc.ol.Locate.ZOOM_LEVEL;
  $('#main').append(this.map.getTarget());
  this.view = this.map.getView();
  this.finderSource = options.finderSource;
  this.locationMgr = options.locationMgr;
  this.mapClickOptions = options.mapClickOptions;
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
  this.fullscreen = $(nyc.FinderApp.FULL_SCREEN_INFO_HTML);
  $('#map-page').append(this.fullscreen);
  $('#btn-more').click($.proxy(this.listNextPage, this));
  $('h1.banner').click($.proxy(this.reload, this));

  this.mtaHack = new nyc.MtaTripPlannerHack('#dir-content');
  $('#mta-btn').click($.proxy(this.hackMta, this));
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
  * @member {number}
  */
  zoomLevel: null,
  /**
  * @private
  * @member {string}
  */
  lastDir: null,
  /**
  * @private
  * @member {nyc.MtaTripPlannerHack}
  */
  mtaHack: null,
  /**
  * @desc Method to handle {@link nyc.Locate} events
  * @public
  * @method
  * @param {nyc.Locate.Result} location The location
  */
  located: function(location){
    this.location = location;
    this.listFacilities();
  },
  /**
  * @desc Method to handle expanded facility detail
  * @public
  * @method
  * @param {JQuery.Event} event The expand event
  */
  detailExpanded: function(event){
    var pop = this.popup.getElement();
    if ($.contains(pop, event.target)){
      if ($(pop).height() > $(this.map.getTarget()).height()){
        this.showFullScreenDetail();
      }else{
        this.popup.pan();
      }
    }
  },
  /**
   * @desc Method to zoom to facility location on map button click
   * @public
   * @method
   * @param {JQuery.Event} event The button click event
   */
  zoomTo: function(event){
    var me = this, feature = $(event.target).data('feature');
    me.hideFullScreenDetail();
    me.view.animate({
      zoom: me.zoomLevel,
      center: feature.getGeometry().getCoordinates()
    });
    me.map.once('moveend', function(){
      me.showPopup([feature]);
    });
    if (Math.abs($('#panel').width() - $(window).width()) < 2){
      $('#map-tab-btn a').trigger('click');
    }
  },
  /**
   * @desc Method to get directions from user location to facility location on directions button click
   * @public
   * @method
   * @param {JQuery.Event} event The button click event
   */
  directionsTo: function(event){
    var feature = $(event.target).data('feature'),
      to = feature.getAddress(),
      name = feature.getName(),
      from = this.origin();
    this.destination = {
      name: feature.getName() + ' - ' + feature.getAddress(),
      coordinates: feature.getGeometry().getCoordinates(),
      data: {}
    };
    this.hideFullScreenDetail();
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
   * @param {ol.MapBrowserEvent} event The map click event
   */
  mapClick: function(event){
    var features = [];
    this.map.forEachFeatureAtPixel(event.pixel, function(feature){
      if (typeof feature.html == 'function' && feature.html()){
        features.push(feature);
      }
    }, this.mapClickOptions);
    if (features.length){
      this.showPopup(features);
    }
  },
  /**
   * @desc Method to show popup on a facility feature
   * @public
   * @method
   * @param {Array<ol.Feature>} features The features to show in the popup
   */
  showPopup: function(features){
      var popup = this.popup,
        pager = $(nyc.FinderApp.INFO_PAGER_HTML),
        current = pager.find('.current'),
        page = pager.find('.info-page'),
        html = features[0].html();
      html.find('a.map').remove();
      popup.features = features;
      page.html(html);
      current.data('current', 0).html(1);
      pager.find('.total').html(features.length);
      pager.find('.pager-btns')[features.length > 1 ? 'show' : 'hide']();
      pager.find('.next, .prev').click(function(event){
        var incr = $(event.target).data('incr') - 0;
        var idx = (current.data('current') - 0) + incr;
        if (idx >= 0 && idx < features.length){
          var html = features[idx].html();
          html.find('a.map').remove();
          current.data('current', idx).html(idx + 1);
          page.html(html).trigger('create');
          popup.pan();
        }
      });
    popup.show({
      html: pager,
      coordinates: features[0].getGeometry().getCoordinates()
    });
  },
  /**
   * @desc Method to list facilities
   * @public
   * @method
   */
  listFacilities: function(){
    var features = this.finderSource.sort(this.location.coordinates);
    this.popup.hide();
    this.pager.reset(features);
    $('#facility-list').empty();
    this.listNextPage();
    $('#facility-tab').scrollTop(0);
  },
  /**
   * @desc Method to page through facilities
   * @public
   * @method
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
   * @desc Method to connected filter controls change event
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
				filter = filter.concat(('' + choice.value).split('|'));
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
   },
   /**
    * @desc Hide full screen detail if open
    * @private
    * @method
    */
   hideFullScreenDetail: function(){
     if ($('.inf-full-screen').is(':visible')){
       $('.inf-full-screen').fadeOut();
     }
   },
   /**
    * @desc Show full screen detail if popup is bigger than map
 	  * @private
 	  * @method
 	  */
 	showFullScreenDetail: function(){
    var me = this,
      popup = me.popup,
      pop = $(popup.getElement()),
      fullscreen = me.fullscreen,
      content = fullscreen.find('.content');
    content.empty();
    content.append(pop.find('.info-pager'));
    $('#map-page').append(content.find('.pager-btns'));
    popup.hide();
    fullscreen.fadeIn();
    fullscreen.find('.popup-closer').one('click tap', function(){
      $('#map-page').find('.pager-btns').remove();
      me.showPopup(popup.features);
      fullscreen.fadeOut();
    });
  },
  /**
   * @desc Reload the page
   * @private
   * @method
   * @param {JQuery.Event} event
   */
  reload: function(event){
    if (event.pageX < $(window).width() / 4){
      document.location = './';
    }
  },
  /**
   * @desc Show MTA TripPlanner
   * @private
   * @method
   * @param {JQuery.Event} event
   */
  hackMta: function(event){
    this.mtaHack.directions({
      accessible: true,
      origin: this.location,
      destination: this.destination
    });
  }
};

/**
 * @desc Object type to hold constructor options for {@link nyc.FinderApp}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map The map for the finder app
 * @property {nyc.ol.source.FilteringAndSorting} finderSource The source of the finder facilities
 * @property {nyc.LocationMgr} locationMgr The location manager
 * @property {Array<nyc.Choice>=} filterControls Filter controls for filtering the facilities features
 * @property {string=} directionsUrl The Google directions API URL with appropriate API key
 * @property {number} [zoomLevel={@link nyc.ol.Locate.ZOOM_LEVEL}] The zoom level to zoom to when finding a facility
 * @property {Object=} mapClickOptions Options to modify map click behavior {@see http://openlayers.org/en/latest/apidoc/ol.Map.html#forEachFeatureAtPixel}
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
              '<a href="#map-tab">map</a>' +
            '</li>' +
            '<li id="facility-tab-btn">' +
              '<a class="ui-btn-active" href="#facility-tab">locations</a>' +
            '</li>' +
            '<li id="filter-tab-btn">' +
              '<a href="#filter-tab">filter</a>' +
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
              '<span class="noshow">get transit directions</span>' +
            '</a></td>' +
            '<td><a id="mode-bike" class="dir-mode-btn" data-role="button" data-mode="BICYCLING" title="Get bicycling directions">' +
              '<span class="noshow">get bicycling directions</span>' +
            '</a></td>' +
            '<td><a id="mode-walk" class="dir-mode-btn" data-role="button" data-mode="WALKING" title="Get walking directions">' +
              '<span class="noshow">get walking directions</span>' +
            '</a></td>' +
            '<td><a id="mode-car" class="dir-mode-btn" data-role="button" data-mode="DRIVING" title="Get driving directions">' +
              '<span class="noshow">get driving directions</span>' +
            '</a></td>' +
            '<td>' +
              '<a id="mta-btn" data-role="button">MTA TripPlanner</a>' +
            '</td>' +
          '</tr></tbody>' +
        '</table>' +
      '</div>' +
      '<div id="directions"></div>' +
    '</div>' +
    '<div id="dir-main">' +
      '<div id="dir-map"></div>' +
    '</div>' +
    '<div id="dir-toggle" data-role="controlgroup" data-type="horizontal">' +
      '<a class="toggle-map capitalize" data-role="button">map</a>' +
      '<a class="ui-btn-active capitalize" data-role="button">directions</a>' +
    '</div>' +
  '</div>' +
'</div>';

/**
 * @desc
 * @public
 * @const
 * @type {string}
 */
nyc.FinderApp.INFO_PAGER_HTML = '<div class="info-pager">' +
  '<div class="info-page"></div>' +
  '<div class="pager-btns">' +
    '<button class="prev" data-role="button" data-icon="carat-l" data-iconpos="notext" data-incr="-1">previous</button>' +
    '<span class="current"></span> of <span class="total"></span>' +
    '<button class="next" data-role="button" data-icon="carat-r" data-iconpos="notext" data-incr="1">next</button>' +
  '</div>' +
'</div>';

/**
 * @desc
 * @public
 * @const
 * @type {string}
 */
nyc.FinderApp.FULL_SCREEN_INFO_HTML = '<div class="inf-full-screen">' +
  '<a class="popup-closer"><span class="noshow">close</span></a>' +
  '<div class="content"></div>' +
'</div>';
