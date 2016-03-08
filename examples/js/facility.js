function pinIconUrl(config){
	var pinIcon = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Cg%20transform%3D%22matrix(0.19946351%2C0%2C0%2C0.19323129%2C-15.871243%2C-14.375413)%22%20stroke-width%3D%2210%22%20stroke%3D%22STROKECOLOR%22%20fill%3D%22FILLCOLOR%22%3E%3Cpath%20d%3D%22m%20240%2C79.57%20c%20-59.094%2C0%20-106.992%2C47.898%20-106.992%2C106.992%200%2C25.367%208.836%2C48.68%2023.594%2C67.016%2017.914%2C22.273%2056.461%2C42.32%2064.117%2C130.734%200%2C5.188%203.219%2C16.117%2019.281%2C16.117%2016.055%2C0%2019.57%2C-10.938%2019.57%2C-16.117%207.656%2C-88.414%2045.914%2C-108.469%2063.828%2C-130.734%2014.766%2C-18.328%2023.594%2C-41.647%2023.594%2C-67.016%20C%20346.992%2C127.469%20299.078%2C79.57%20240%2C79.57%20z%20m%20-1.672%2C141.742%20c%20-19.109%2C0%20-34.594%2C-15.492%20-34.594%2C-34.602%200%2C-19.102%2015.484%2C-34.594%2034.594%2C-34.594%2019.109%2C0%2034.602%2C15.493%2034.602%2C34.595%200%2C19.118%20-15.492%2C34.601%20-34.602%2C34.601%20z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',
		configIcon = config.icon || {};
	if (configIcon.url){
		return configIcon.url;
	}else{
		pinIcon = pinIcon.replace(/STROKECOLOR/, configIcon.stroke || 'rgba(0,0,0,1)');
		return pinIcon.replace(/FILLCOLOR/, configIcon.fill || 'rgba(0,0,0,0.5)');
	}
};

function pinIconSize(config){
	var configIcon = config.icon || {};
	return configIcon.size || 64;
};

var config = window.parent.MAP_CONFIG,
	pinStyle = {
		big: new ol.style.Style({
			image: new ol.style.Icon({
				scale: 32 / pinIconSize(config),
				src: pinIconUrl(config)
			})
		}),
		small: new ol.style.Style({
			image: new ol.style.Icon({
				scale: 16 / pinIconSize(config),
				src: pinIconUrl(config)
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
	row.css('background-color', config.selectionColor || 'rgba(255,255,0,0.5)').addClass('selected');
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
		img = $('<img alt="Map" title="Map">');
		types = facilityTypes.types;
	if (types){
		var type = types[feature.get(facilityTypes.column)];
		if (type && type.icon){
			img.attr('src', type.icon.url);
		}			
	}else{
		img.attr('src', pinIconUrl(config));
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
	if (facilityTypes.column){
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
	if (facilityTypes.column){
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
	
	var base = new nyc.ol.layer.BaseLayer();
	base.on('postcompose', nyc.ol.layer.grayscale);

	map = new ol.Map({
		target: $('#map').get(0),
		layers: [base],
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