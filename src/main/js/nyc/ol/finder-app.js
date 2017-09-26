var nyc = nyc || {};
nyc.ol = nyc.ol || {};

nyc.ol.FinderApp = function(options){
  this.map = options.map;
  this.view = this.map.getView();
  this.facilitySource = options.facilitySource;
  this.locationMgr = options.locationMgr;
  this.directions = options.directions;
  this.popup = new nyc.ol.Popup(this.map);
  $(window).resize($.proxy(this.resize, this));
  this.map.on('click', this.mapClick, this);
  locationMgr.on(nyc.Locate.EventType.GEOCODE, $.proxy(this.located, this));
	locationMgr.on(nyc.Locate.EventType.GEOLOCATION, $.proxy(this.located, this));
  this.connectFilterControls(options.filterControls);
};

nyc.ol.FinderApp.prototype = {
  /**
  * @private
  * @member {ol.Map}
  */
  map: null,
  /**
  * @private
  * @member {ol.View}
  */
  view: null,
  /**
  * @private
  * @member {nyc.ol.source.FilteringAndSorting}
  */
  facilitySource: null,
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
  * @desc Method to handle {@link nyc.Locate} events
  * @public
  * @method
  * @param {nyc.Locate.Result} location
  */
  located: function(location){

  },
  /**
   * @desc Method to handle {@link nyc.Locate} events
   * @public
   * @method
   * @param {nyc.Locate.Result} location
   */
  located: function(location){

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
  },
  /**
   * @desc Method to get directions from user location to facility location on directions button click
   * @public
   * @method
   * @param {JQuery.Event} event
   */
  directionsTo: function(event){
    var me = this,
      feature = $(event.target).data('feature'),
      to = feature.address(),
      name = feature.get('name'),
      from = me.origin();
    $('body').pagecontainer('change', $('#dir-page'), {transition: 'slideup'});
    if (me.lastDir != from + '|' + to){
      var args = {from: unescape(from), to: unescape(to), facility: unescape(name)};
      me.lastDir = from + '|' + to;
      me.directions.directions(args);
    }
  },
  /**
   * @desc Method to handle map click and show popup if appropriate
   * @public
   * @method
   * @param {ol.MapBrowserEvent} event
   */
  mapClick: function(event){
    var feature = this.map.forEachFeatureAtPixel(event.pixel, function(feature){
      return feature;
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
    var features = this.facilitySource.sort(this.location);
    $('#location-list').empty();
    this.popup.hide();
		this.pager.reset(features);
		$('#location-list').empty();
		this.listNextPage();
  },
  /**
   * @desc Method to page through facilities
   * @public
   * @method
   * @param {ol.MapBrowserEvent} event
   */
  listNextPage: function(){
		var container = $('#location-list');
		$.each(this.pager.next(), function(i, feature){
			var div = feature.html('inf-list');
			if (i % 2 == 0) $(div).addClass('even-row');
			$('#location-list').append(div).trigger('create');
		});
		$('#btn-more')[$('div.inf-list').length == this.facilitySource.getFeatures().length ? 'fadeOut' : 'fadeIn']();
	},
  /**
   * @desc Method to adjust layout for mobile
   * @private
   * @method
   */
  resize: function(){
		if ($('#panel').width() != $(window).width() && $('#map-tab-btn').hasClass('ui-tabs-active')){
			$('#location-tab-btn a').trigger('click');
		}
		if($(window).height() < $(window).width() && $('body').pagecontainer('getActivePage').attr('id') == 'dir-page'){
			$('#dir-toggle a:last-of-type:not(.ui-btn-active)').trigger('click');
		}
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
   * @dec Method to connected filter controls change event
	 * @private
	 * @method
   * @param {Array<nyc.Choice>} filterControls
	 */
	connectFilterControls: function(filterControls){
    if (filterControls && filterControls.length){
      var me = this;
      $.each(filterControls, function(){
        this.on('change', me.filter, me);
      });
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
	}
};

/**
 * @desc Object type to hold constructor options for {@link nyc.ol.FinderApp}
 * @public
 * @typedef {Object}
 * @property {ol.Map} map
 * @property {nyc.ol.source.FilteringAndSorting} facilitySource
 * @property {nyc.LocationMgr} locationMgr
 * @property {Array<nyc.Choice>} filterControls
 * @property {nyc.Directions} directions
 */
nyc.ol.FinderApp.Options;


/*
<div id="map-page" data-role="page">
  <div id="main" data-role="main" class="ui-content">
    <div id="map"></div>
  </div>
  <div id="panel">
    <div id="panel-content">
      <div id="tabs" data-role="tabs">
        <div data-role="navbar">
          <ul>
            <li id="map-tab-btn">
              <a href="#map-tab">Map</a>
            </li>
            <li id="locations-tab-btn">
              <a class="ui-btn-active" href="#locations-tab">Locations</a>
            </li>
            <li>
              <a href="#filters-tab">Filters</a>
            </li>
          </ul>
        </div>
        <div id="map-tab"></div>
        <div id="locations-tab">
          <div id="location-list"></div>
          <div id="btn-more"><a data-role="button">More...</a></div>
        </div>
        <div id="filters-tab">
          <div id="filters">
            <div id="type"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div id="dir-page" data-role="page">
  <a id="back-to-map" data-role="button" data-icon="arrow-l" class="hdr-btn back-btn ui-btn-right" href="#map-page" data-transition="slidedown">
    Back to finder
  </a>
  <div data-role="content">
    <div id="dir-panel">
      <div id="dir-content">
        <div class="fld-lbl">From my location:</div>
        <div id="fld-from"><input placeholder="Enter an address..."></div>
        <div class="fld-lbl">To <span id="fld-facility"></span>:</div>
        <div id="fld-to"></div>
        <table id="dir-mode">
          <tbody><tr>
            <td><a id="mode-transit" class="dir-mode-btn active-mode" data-role="button" data-mode="TRANSIT" title="Get transit directions">
              <span class="noshow">Get transit directions</span>
            </a></td>
            <td><a id="mode-bike" class="dir-mode-btn" data-role="button" data-mode="BICYCLING" title="Get bicycling directions">
              <span class="noshow">Get bicycling directions</span>
            </a></td>
            <td><a id="mode-walk" class="dir-mode-btn" data-role="button" data-mode="WALKING" title="Get walking directions">
              <span class="noshow">Get walking directions</span>
            </a></td>
            <td><a id="mode-car" class="dir-mode-btn" data-role="button" data-mode="DRIVING" title="Get driving directions">
              <span class="noshow">Get driving directions</span>
            </a></td>
          </tr></tbody>
        </table>
      </div>
      <div id="directions"></div>
    </div>
    <div id="dir-main">
      <div id="dir-map"></div>
    </div>
    <div id="dir-toggle" data-role="controlgroup" data-type="horizontal">
      <a class="toggle-map capitalize" data-role="button">map</a>
      <a class="ui-btn-active capitalize" data-role="button">directions</a>
    </div>
  </div>
</div>
*/
