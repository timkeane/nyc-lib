var config = window.parent.MAP_CONFIG, 
	pinStyle = new ol.style.Style({
		image: new ol.style.Icon({
			scale: 16 / 64,
			src: 'img/pin.svg'
		})
	}),
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
			scale: 32 / 512,
			src: 'img/me.svg'
		})
	}),
	facilityTypes = config.facilityTypes || {},  
	styleCache = {}, 
	iconCache = {}, 
	tbody, map, selectionSource, source;

function zoomToFacility(event){
	var row = $(event.currentTarget), fid = row.data('fid');
	tbody.find('tr').css('background-color', '');
	selectionSource.clear();
	row.css('background-color', config.selectColor || 'rgba(255,255,0,0.5)');
	if (fid != undefined){
		var view = map.getView(), 
			feature = source.getFeatureById(fid), 
			geom = feature.getGeometry();
		selectionSource.addFeature(feature);
		map.beforeRender(
			ol.animation.zoom({resolution: view.getResolution()}), 
			ol.animation.pan({source: view.getCenter()})
		);
		view.setZoom(7);
		view.setCenter(geom.getCoordinates());
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
	row.data('fid', feature.getId());
	row.click(zoomToFacility);
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
			$('#filter-choices').append(
				'<option value="' + value + '">' +
				fiterValueAlias(value) + 
				'</option>'
			);
		}
	}
};

function listFacilities(features){
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
		$('#filter').css('display', 'table-row');
	}else{
		$('#facility').css('top', '415px');
	}
	$('#first-load').fadeOut();
};

function sortFacilities(location){
	listFacilities(source.sort(location.coordinates));
};

function featureStyle(feature, resolution){
	var types = facilityTypes.types, type = feature.get(facilityTypes.column);
	styleCache[resolution] = styleCache[resolution] || {};
	if (!styleCache[resolution][type]){
		var icon = types[type].icon;
		styleCache[resolution][type] = [new ol.style.Style({
			image: new ol.style.Icon({
				scale: 16 / (icon.size || 64),
				src: icon.url
			})
		})];
	}
	return styleCache[resolution][type];
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

	source = new nyc.ol.source.FilteringAndSorting({
		loader: new nyc.ol.source.CsvPointFeatureLoader({url: config.url})
	}, [config]);
	source.on('change:featuresloaded', facilitiesLoaded);
	
	map.getView().fit(nyc.ol.EXTENT, map.getSize());
	map.addLayer(createLayer(source));
	
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
		locator: new nyc.ol.Locator({map: map, layer: locationLayer})
	});
	locMgr.on('geocode', sortFacilities);
	locMgr.on('geolocation', sortFacilities);
	
});