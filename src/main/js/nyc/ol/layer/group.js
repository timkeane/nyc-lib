var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.layer = nyc.ol.layer || {};

/**
 * @desc Abstract class for creating layer groups
 * @public
 * @abstract
 * @class
 * @constructor
 * @param {ol.Map} map The map to which the layers will be added
 */
nyc.ol.layer.Group = function(map){
	this.map = map;
	this.addedLayers = {groupLayers: [], proxyLayers: [], allLayers: [], tips: []};
};

nyc.ol.layer.Group.prototype = {
	/**
	 * @private
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @desc The layers added to the map by this group
	 * @public
	 * @member {Array<nyc.ol.layer.Adds>}
	 */
	addedLayers: null,
	/**
	 * @desc Appends layers from a subgroup
	 * @public
	 * @method
	 * @param {Array<nyc.ol.layer.Adds>} layerAdds Layers to append to the group
	 */
	append: function(layerAdds){
		var added = this.addedLayers;
		$.each(layerAdds, function(){
			added.groupLayers = added.groupLayers.concat(this.groupLayers);
			added.proxyLayers = added.proxyLayers.concat(this.proxyLayers);
			added.allLayers = added.allLayers.concat(this.allLayers);
			added.tips = added.tips.concat(this.tips);
		});
	},
	/**
	 * @public
	 * @method
	 * @param {ol.Feature|ol.render.Feature} feature
	 * @param {Array<Object>} mixins
	 */
	mixin: function(feature, mixins){
		feature.mixins = feature.mixins || [];
		if ($.inArray(mixins, feature.mixins) == -1){
			feature.mixins.push(mixins);
			$.each(mixins, function(){
				for (var memb in this){
					feature[memb] = this[memb];
				}
			});
		}
	}
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

