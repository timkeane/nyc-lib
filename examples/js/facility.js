var config = window.parent.MAP_CONFIG, 
	pinStyle = {
		big: new ol.style.Style({
			image: new ol.style.Icon({
				scale: 32 / 64,
				src: 'img/pin.svg'
			})
		}),
		small: new ol.style.Style({
			image: new ol.style.Icon({
				scale: 16 / 64,
				src: 'img/pin.svg'
			})
		})
	},
	selectionStyle = new ol.style.Style({
		image: new ol.style.Circle({
			radius: 24,
			fill: new ol.style.Fill({
				color: config.selectionColor || 'rgba(255,255,0,0.5)'
			})
		})
	}),
	locationStyle = new ol.style.Style({
		image: new ol.style.Icon({
			scale: 48 / 512,
			src: 'img/me.svg'
		})
	}),
	facilityTypes = config.facilityTypes || {},  
	styleCache = {}, 
	iconCache = {}, 
	tbody, map, selectionSource, source;

function selectFacility(feature, row){
	tbody.find('tr').css('background-color', '').removeClass('selected');
	row.css('background-color', config.selectColor || 'rgba(255,255,0,0.5)').addClass('selected');
	selectionSource.clear();
	selectionSource.addFeature(feature);
};

function zoomToFacility(feature, row){
	var view = map.getView(), geom = feature.getGeometry();
	selectFacility(feature, row);
	map.beforeRender(
		ol.animation.zoom({resolution: view.getResolution()}), 
		ol.animation.pan({source: view.getCenter()})
	);
	view.setZoom(7);
	view.setCenter(geom.getCoordinates());
};

function rowClick(event){
	var row = $(event.currentTarget), fid = row.data('fid');
	if (fid != undefined){
		var feature = source.getFeatureById(fid), click = config.click, next = !click;
		if (click){
			next = click(feature.getProperties());
		}
		if (next){
			zoomToFacility(feature, row);
		}
	}
};

function facilityDistance(feature, row){
	var distance = feature.get('distance');
	if (!isNaN(distance)){
		var td = $('<td class="facility-distance"></td>');
		td.html((distance / 5280).toFixed(2) + ' mi');
		row.prepend(td);
	}			
};

function facilityIcon(feature, row){
	var td = $('<td class="facility-icon"></td>'),
		img = $('<img src="img/pin.svg" alt="Map" title="Map">');
		types = facilityTypes.types;
	if (types){
		var type = types[feature.get(facilityTypes.column)];
		if (type && type.icon){
			img.attr('src', type.icon.url);
		}			
	}
	td.append(img);
	row.prepend(td);			
};
	
function facilityRow(feature, cssClass){
	var row = $(feature.htmlRow());
	row.attr('id', 'fid-' + feature.getId());
	row.data('fid', feature.getId());
	row.click(rowClick);
	row.addClass('facility-info');
	if (cssClass) row.addClass(cssClass);
	facilityDistance(feature, row);
	facilityIcon(feature, row);
	tbody.append(row);
};

function fiterValueAlias(value){
	var types = facilityTypes.types || {}
	if (types[value] && types[value].name){
		return types[value].name;
	}
	return value;
};

function filterValue(feature){
	if (facilityTypes.types){
		var value = feature.get(facilityTypes.column);
		if ($('#filter-choices option[value="' + value + '"]').length == 0){
			var opt = $('#filter-choices option').first(), all = opt.attr('value');
			all = all ? all.split(',') : [];
			all.push(value);
			opt.attr('value', all.toString());
			$('#filter-choices').append(
				'<option value="' + value + '">' +
				fiterValueAlias(value) + 
				'</option>'
			);
		}
	}
};

function listFacilities(features){
	selectionSource.clear();
	tbody.empty();
	$.each(features, function(i, feature){
		facilityRow(feature, i % 2 ? 'even-row' : '');
		filterValue(feature);
	});
};

function facilitiesLoaded(){
	listFacilities(source.getFeatures());
	if (facilityTypes.types){
		$('#filter-choices').selectmenu('refresh');
		$('#filter').show();
	}else{
		$('#facility').css('height', 'calc(50% - 10px)');
	}
	$('#first-load').fadeOut();
};

function sortFacilities(location){
	listFacilities(source.sort(location.coordinates));
};

function featureStyle(feature, resolution){
	var types = facilityTypes.types;
	if (types){
		var type = feature.get(facilityTypes.column);
		styleCache[resolution] = styleCache[resolution] || {};
		if (!styleCache[resolution][type]){
			var icon = types[type].icon;
			styleCache[resolution][type] = [new ol.style.Style({
				image: new ol.style.Icon({
					scale: (resolution > 50 ? 16 : 32) / (icon.size || 64),
					src: icon.url
				})
			})];
		}
		return styleCache[resolution][type];
	}else{
		return resolution > 50 ? [pinStyle.small] : [pinStyle.big]
	}
};

function createLayer(source){
	var layerOpts = {source: source}, types = facilityTypes.types;
	if (types){
		for (var type in types){
			if (types[type].icon){
				layerOpts.style = featureStyle;
			}
			break;
		}
	}
	layerOpts.style = layerOpts.style || [pinStyle];
	return new ol.layer.Vector(layerOpts);
};

function filterFacilities(select){
	source.filter([{
		property: facilityTypes.column, 
		values: select.value.split(',')
	}]);
	listFacilities(source.getFeatures());
};

function mapClick(event){
	map.forEachFeatureAtPixel(event.pixel, function(feature, layer){
		var click = config.click, next = !click;
		if (click){
			next = click(feature.getProperties());
		}
		if (next){
			var row = tbody.find('tr#fid-' + feature.getId());
			selectFacility(feature, row);
			$('#facility').scrollTop(row.get(0).offsetTop);
		}
	});
};

$(document).ready(function(){

	if (config.css){
		var link = $('<link>');
		link.attr('rel', 'stylesheet');
		link.attr('href', config.css);
		$('head').append(link);
	}
	
	tbody = $('#facility tbody');
	
	map = new ol.Map({
		target: $('#map').get(0),
		layers: [new nyc.ol.layer.BaseLayer()],
		view: new ol.View({
			projection: 'EPSG:2263',
			resolutions: nyc.ol.layer.BaseLayer.RESOLUTIONS
		})
	});

	selectionSource = new ol.source.Vector();
	map.addLayer(new ol.layer.Vector({
		source: selectionSource,
		style: [selectionStyle]
	}));
	map.on('click', mapClick);

	source = new nyc.ol.source.FilteringAndSorting({
		loader: new nyc.ol.source.CsvPointFeatureLoader({url: config.url})
	}, [config]);
	source.once('change:featuresloaded', facilitiesLoaded);
	
	map.addLayer(new ol.layer.Vector({source: source, style: featureStyle}));
	map.getView().fit(nyc.ol.EXTENT, map.getSize());
	
	var geocoder = new nyc.Geoclient(
		'https://maps.nyc.gov/geoclient/v1/search.json?app_key=' + config.geoclientAppKey + '&app_id=' + config.geoclientAppId,
		'EPSG:2263'
	);

	var locationLayer = new ol.layer.Vector({
		source: new ol.source.Vector(),
		style: [locationStyle]
	});
	map.addLayer(locationLayer);

	var locMgr = new nyc.LocationMgr({
		controls: new nyc.ol.control.ZoomSearch(map),
		locate: new nyc.ol.Locate(geocoder, 'EPSG:2263'),
		locator: new nyc.ol.Locator({map: map, layer: locationLayer}),
		autoLocate: config.autoLocate
	});
	locMgr.on('geocode', sortFacilities);
	locMgr.on('geolocation', sortFacilities);
	
});