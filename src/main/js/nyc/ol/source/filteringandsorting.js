/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.ol = nyc.ol || {};
/** @export */
nyc.ol.source = nyc.ol.source || {};

/**
 * Object to use for filtering the features of an instance of nyc.ol.source.FilteringAndSorting
 * @typedef {Object}
 * @property {string} property
 * @property {Array.<string>} values
 */
nyc.ol.source.Filter;

/**
 * Class that extends nyc.ol.source.Decorating for providing functionality to sort by distance and filter by property 
 * @export
 * @constructor
 * @extends {nyc.ol.source.Decorating}
 * @param {olx.source.GeoJSONOptions} options Options.
 * @param {Array.<Object>}  decorationMixins An array of objects whose members will be added to all features created by this source
 */
nyc.ol.source.FilteringAndSorting = function(options, decorationMixins){
	var me = this;
	me.allFeatures = [];
	me.filtering = false;
	decorationMixins = decorationMixins || [];
	decorationMixins.push({
		getDistance: function(){
			return this.get('distance');
		},
		setDistance: function(distance){
			return this.set('distance', distance);
		}
	});
	nyc.ol.source.Decorating.call(this, options, decorationMixins);
	me.on('addfeature', function(e){
		if (!me.filtering)
			me.allFeatures.push(e.feature);
	});	
	me.on('removefeature', function(e){
		var i = $.inArray(e.feature, me.allFeatures);
		if (i > -1) me.allFeatures.splice(i, 1);
	});	
};

ol.inherits(nyc.ol.source.FilteringAndSorting, nyc.ol.source.Decorating);

/**
 * @export
 * @param {Array.<nyc.ol.source.Filter>} filters Used to filter features by attributes
 * @return {Array.<ol.Feature>} An array of features contained in this source that are the result is the intersection of the applied filters.
 */
nyc.ol.source.FilteringAndSorting.prototype.filter = function(filters){
	var me = this, filteredFeatures = [], filteredFeaturesMap = {};	
	$.each(me.allFeatures, function(_, f){
		var incl = true;
		$.each(filters, function(_, filter){
			incl = $.inArray(f.get(filter.property) + '', filter.values) > -1;
			if (!incl) return false;
		});
		if (incl) {
			if (!filteredFeaturesMap[f.getId()]){
				filteredFeaturesMap[f.getId()] = f;
				filteredFeatures.push(f);
			}
		}
	});
	me.clear(true);
	me.filtering = true;
	me.addFeatures(filteredFeatures);
	me.filtering = false;
};

/**
 * Sorts features by distance from coordinate
 * @export
 * @param {ol.Coordinate} coordinate Sort features by distance to this location.
 * @return {Array.<ol.Feature>} An array of the features contained in this source that are the result is the intersection of the currently applied filters sorted by their distance to the coordinate provided.
 */
nyc.ol.source.FilteringAndSorting.prototype.sort = function(coordinate){
	var result = this.getFeatures();
	if (coordinate){
		$.each(result, function(_, facility){
			var center = ol.extent.getCenter(facility.getGeometry().getExtent()),
				line = new ol.geom.LineString([center, coordinate]);
			facility.setDistance(line.getLength());
		});
		result.sort(function(a, b){
			if (a.getDistance() < b.getDistance()) return -1;
			if (a.getDistance() > b.getDistance()) return 1;
			return 0;
		});
	}
	return result;
};
