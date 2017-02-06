var nyc = nyc || {};

/**
 * @desc A class for Generating property information
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @mixes nyc.ReplaceTokens
 * @constructor
 * @param {string} projection The EPSG code
 * @fires nyc.PropertyInfoRenderer#info
 * @fires nyc.PropertyInfoRenderer#fail
 */
nyc.PropertyInfoRenderer = function(options){
	options = options || {};
	this.defaultTemplate = options.defaultTemplate || nyc.PropertyInfoRenderer.DEFAULT_TEMPLATE;
	this.extraTemplates = options.extraTemplates || [];
	this.proximityInfo = new nyc.ProximityInfo();	
};

nyc.PropertyInfoRenderer.prototype = {
	/**
	 * @private
	 * @member {nyc.ProximityInfo}
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
	 * @param {nyc.PropertyInfoRenderer.Options} options Options for the info request
	 */
	info: function(options){
		var me = this, callback = options.callback;
		options.callback = function(response){
			me.handleResp(response, callback);
		};
		this.proximityInfo.info(options);
	},
	/**
	 * @private
	 * @method
	 */
	render: function(props){
		var me = this, result = {
			creditHtml:  me.replace(nyc.PropertyInfoRenderer.CREDIT_TEMPLATE, props),
			defaultHtml: me.replace(me.defaultTemplate, props),
			extraHtml: []
		};
		result.allHtml = result.defaultHtml;
		$.each(this.extraTemplates, function(_, tmpl){
			var html = me.replace(tmpl, props);
			result.extraHtml.push(html);
			result.allHtml += html
		});
		result.allHtml += result.creditHtml;
		return result;
	},
	/**
	 * @private
	 * @method
	 * @param {Object} response
	 * @param {function(Object)} callback
	 */
	handleResp: function(response, callback){
		var me = this, props, yr = new Date().getFullYear();
		$.each(response.features, function(){
			if (this.id.indexOf('TAXLOT') === 0){
				props = this.properties;
				props.year = yr;
			}
		});
		if (props){
			me.render(props);
			if (callback){
				callback(me.render(props));
			}
		}
	}
};

nyc.inherits(nyc.PropertyInfoRenderer, nyc.EventHandling);
nyc.inherits(nyc.PropertyInfoRenderer, nyc.ReplaceTokens);

/**
 * @desc Object type to hold constructor options for {@link nyc.PropertyInfoRenderer}
 * @public
 * @typedef {Object}
 * @property {string} [projection="EPSG:900913"] The projection of input coordinates and output features 
 * @property {string=} defaultTemplate HTML template string  
 * @property {Array<string>=} extraTemplates An array of HTML template strings  
 */
nyc.PropertyInfoRenderer.ConstructorOptions;

/**
 * @desc Object type to hold options for {@link nyc.PropertyInfoRenderer#info} which must contain either a coord or a bbl property
 * @public
 * @typedef {Object}
 * @property {Array<number>} coord coordinate 
 * @property {string} [projection="EPSG:900913"] The projection of input coordinates and output features 
 * @property {string=} bbl A valid BBL
 * @property {function(Object)=} callback Callback function that receives GeoJSON FeatureCollection 
 */
nyc.PropertyInfoRenderer.RequestOptions;

nyc.PropertyInfoRenderer.DEFAULT_TEMPLATE = '<div class="prp-rnd"><div class="prp-fld">${ADDRESS}, ${BOROUGH_NAME} ${ZIPCODE}</div></div>'; 

nyc.PropertyInfoRenderer.CREDIT_TEMPLATE = '<div class="prp-rnd">' +
	'<span class="prp-credit">' + 
		'<a href="http://www1.nyc.gov/site/planning/data-maps/open-data.page" target="_blank">Dept. of City Planning, PLUTO ${VERSION} © ${year}&nbsp;</a>' + 
	'</span>' + 
'</div>';

nyc.PropertyInfoRenderer.EXTRA_TEMPLATES = [
    '<div class="prp-rnd">' +
		'<div data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">' + 
			'<h3>Tax Info</h3>' +
			'<p>' +
				'<span class="prp-fld">Borough:</span>' + 
				'<span class="prp-val">${BOROUGH_NAME}&nbsp;</span>' + 
				'<span class="prp-fld">Block:</span>' + 
				'<span class="prp-val">${BLOCK}&nbsp;</span>' + 
				'<span class="prp-fld">Lot:</span>' + 
				'<span class="prp-val">${LOT}&nbsp;</span>' +
				'<span class="prp-fld"><br>Owner:</span>' + 
				'<span class="prp-val">${OWNERNAME}&nbsp;</span>' + 
			'</p>' +
		'</div>' +
	'</div>',
    '<div class="prp-rnd">' +
	    '<div data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">' + 
			'<h3>Property Info</h3>' +
			'<p>' +
				'<span class="prp-fld">Lot Area:</span>' + 
				'<span class="prp-val">${LOTAREA}&nbsp;sf</span>' + 
				'<span class="prp-fld"><br>Lot Frontage:</span>' + 
				'<span class="prp-val">${LOTFRONT}\'&nbsp;</span>' + 
				'<span class="prp-fld">Lot Depth:</span>' + 
				'<span class="prp-val">${LOTDEPTH}\'</span>' + 
				'<span class="prp-fld"><br>Year Built:</span>' + 
				'<span class="prp-val">${YEARBUILT}&nbsp;</span>' + 
				'<span class="prp-fld"><br>Number of Buildings:</span>' + 
				'<span class="prp-val">${NUMBLDGS}&nbsp;</span>' + 
				'<span class="prp-fld"><br>Number of Floors:</span>' + 
				'<span class="prp-val">${NUMFLOORS}&nbsp;</span>' + 
				'<span class="prp-fld"><br>Gross Floor Area:</span>' + 
				'<span class="prp-val">${COMAREA}&nbsp;sf (estimated)</span>' + 
				'<span class="prp-fld"><br>Residential Units:</span>' + 
				'<span class="prp-val">${UNITSRES}&nbsp;</span>' + 
				'<span class="prp-fld">Total # of Units:</span>' + 
				'<span class="prp-val">${UNITSTOTAL}&nbsp;</span>' + 
			'</p>' +
		'</div>' +
	'</div>',
    '<div class="prp-rnd">' +
		'<div data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">' + 
			'<h3>Zoning Info</h3>' +
			'<p>' +
				'<span class="prp-fld">Land Use:</span>' + 
				'<span class="prp-val">${LANDUSEDESC}&nbsp;</span>' + 
				'<span class="prp-fld">Zoning:</span>' + 
				'<span class="prp-val">${ZONEDIST1}&nbsp;</span>' + 
				'<span class="prp-val">${ZONEDIST2}&nbsp;</span>' + 
				'<span class="prp-fld">Commercial Overlay:</span>' + 
				'<span class="prp-val">${OVERLAY1}&nbsp;</span>' + 
				'<span class="prp-val">${OVERLAY2}&nbsp;</span>' + 
				'<span class="prp-fld"><br>Zoning Map #:</span>' + 
				'<span class="prp-val">' + 
					'<a href="http://www1.nyc.gov/assets/planning/download/pdf/zoning/zoning-maps/map${ZONEMAP}.pdf" title="DCP Zoning Map ${ZONEMAP}" target="_blank">${ZONEMAP}&nbsp;</a>' + 
				'</span>' + 
			'</p>' +
		'</div>' +
	'</div>',
    '<div class="prp-rnd">' +
		'<div data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">' + 
			'<h3>Community Info</h3>' +
			'<p>' +
				'<span class="prp-fld">Community District:</span>' + 
				'<span class="prp-val">${CD}&nbsp;</span>' + 
				'<span class="prp-fld"><br>Police Precinct:</span>' + 
				'<span class="prp-val">${POLICEPRCT}&nbsp;</span>' +
			'</p>' +
		'</div>' +
	'</div>'
];			