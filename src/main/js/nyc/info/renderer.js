var nyc = nyc || {};
nyc.info = nyc.info || {};

/**
 * @desc A class for Generating property information
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @mixes nyc.ReplaceTokens
 * @constructor
 * @param {string} projection The EPSG code
 * @fires nyc.info.Renderer#info
 */
nyc.info.Renderer = function(options){
	options = options || {};
	this.defaultTemplate = options.defaultTemplate || nyc.info.Renderer.DEFAULT_TEMPLATE;
	this.extraTemplates = options.extraTemplates || [];
	this.proximityInfo = new nyc.info.Finder();	
};

nyc.info.Renderer.prototype = {
	/**
	 * @private
	 * @member {nyc.info.Finder}
	 */
	proximityInfo: null,
	/** 
	 * @private 
	 * @member {string}
	 */
	defaultTemplate: null,
	/** 
	 * @private 
	 * @member {Array<string>}
	 */
	extraTemplates: null,
	/**
	 * @desc Request property info
	 * @public
	 * @method
	 * @param {nyc.info.Renderer.Request} options Options for the info request
	 */
	info: function(options){
		var me = this, data = options.data, callback = options.callback;
		if (data){
			me.handleResp(data, callback);
		}else{
			options.callback = function(response){
				me.handleResp(response, callback);
			};
			me.proximityInfo.info(options);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {Object<string, Object>} props
	 * @param {Object} building
	 * @param {Object} taxlot
	 */
	render: function(props, building, taxlot){
		var me = this, result = {
			creditHtml:  me.replace(nyc.info.Renderer.CREDIT_TEMPLATE, props),
			defaultHtml: me.replace(me.defaultTemplate, props),
			extraHtml: [],
			data: props,
			building: building,
			taxlot: taxlot
		};
		result.allHtml = result.defaultHtml + '<div class="info-content" data-role="collapsible-set">';
		$.each(this.extraTemplates, function(_, tmpl){
			var html = me.replace(tmpl, props);
			result.extraHtml.push(html);
			result.allHtml += html
		});
		result.allHtml += ('</div>' + result.creditHtml);
		return result;
	},
	/**
	 * @private
	 * @method
	 * @param {Object} response
	 * @param {function(Object)} callback
	 */
	handleResp: function(response, callback){
		var props, building, taxlot;
		$.each(response.features, function(){
			if (this.id.indexOf('TAXLOT') === 0){
				taxlot = this;
				props = this.properties;
			}else{
				building = this;
			}
		});
		callback(props ? this.render(props, building, taxlot) : null);
	}
};

nyc.inherits(nyc.info.Renderer, nyc.EventHandling);
nyc.inherits(nyc.info.Renderer, nyc.ReplaceTokens);

/**
 * @desc Object type to hold the results of an {@link nyc.info.Renderer#info}
 * @public
 * @typedef {Object}
 * @property {string} creditHtml HTML crediting the source of the data
 * @property {defaultHtml} defaultHtml HTML for the default feature info
 * @property {Array<string>} extraHtml HTML for additional feature info
 * @property {Object<string, Object>} data The data used to render the HTML
 * @property {Object} building The BUILDING feature
 * @property {Object} taxlot The TAXLOT feature
 */
nyc.info.Renderer.Event;

/**
 * @desc The result of a proximity request
 * @event nyc.info.Renderer#info
 * @type {nyc.info.Renderer.Event}
 */

/**
 * @desc Object type to hold constructor options for {@link nyc.info.Renderer}
 * @public
 * @typedef {Object}
 * @property {string} [projection=EPSG:900913] The projection of input coordinates and output features 
 * @property {string=} defaultTemplate HTML template string  
 * @property {Array<string>=} extraTemplates An array of HTML template strings  
 */
nyc.info.Renderer.Options;

/**
 * @desc Object type to hold options for {@link nyc.info.Renderer#info} which must contain either a coord or a bbl property
 * @public
 * @typedef {Object}
 * @property {function(Object)} callback Callback function that receives response 
 * @property {Array<number>=} coordinates Input coordinates
 * @property {string=} bbl A valid BBL
 * @property {Object=} data TAXLOT feature properties
 * @property {string} [projection=EPSG:900913] The projection of the input coordinates and output features 
 */
nyc.info.Renderer.Request;

nyc.info.Renderer.DEFAULT_TEMPLATE = '<span class="info-fld">${ADDRESS}<br>${BOROUGH_NAME}, NY ${ZIPCODE}</span>'; 

nyc.info.Renderer.CREDIT_TEMPLATE = '<div class="info-content">' +
	'<span class="info-credit">' + 
		'Source: <a href="http://www1.nyc.gov/site/planning/data-maps/open-data.page" target="_blank">Dept. of City Planning, PLUTO ${VERSION}</a>' + 
	'</span>' + 
'</div>';
