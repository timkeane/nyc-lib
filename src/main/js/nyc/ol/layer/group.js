var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};

/**
 * @private
 * @function
 * @param {ol.Feature|ol.render.Feature} feature
 * @param {Array<Object>} mixins
 */
nyc.ol.layer.mixin = function(feature, mixins){
	feature.mixins = feature.mixins || [];
	if ($.inArray(mixins, feature.mixins) == -1){
		feature.mixins.push(mixins);
		$.each(mixins, function(){
			for (var memb in this){
				feature[memb] = this[memb];
			}
		});
	}
};

/**
 * @private
 * @function
 * @param {Array<nyc.ol.layer.Adds>} layerAdds
 * @returns {nyc.ol.layer.Adds}
 */
nyc.ol.layer.group = function(layerAdds){
	var group = {groupLayers: [], proxyLayers: [], allLayers: [], tips: []};
	$.each(layerAdds, function(){
		group.groupLayers = group.groupLayers.concat(this.groupLayers);
		group.proxyLayers = group.proxyLayers.concat(this.proxyLayers);
		group.allLayers = group.allLayers.concat(this.allLayers);
		group.tips = group.tips.concat(this.tips);
	});
	return group;
};

/**
 * @desc Object type to hold the results of adding layers
 * @public
 * @typedef {Object}
 * @property {Array<ol.layer.Base>} groupLayers The layers added to the map
 * @property {Array<ol.layer.Vector>} proxyLayers The layers proxy layers added to the map by {nyc.ol.style.mvt.proxyPointLayer}
 * @property {Array<ol.layer.Base>} allLayers The groupLayers and the proxyLayers
 * @property {Array<ol.FeatureTip>} tips The feature tips added to the map
 */
nyc.ol.layer.Adds;

