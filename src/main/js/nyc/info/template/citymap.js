var nyc = nyc || {};
nyc.info = nyc.info || {};

/** 
 * @public 
 * @namespace
 */
nyc.info.template = nyc.info.template || {};

/** 
 * @public 
 * @namespace
 */
nyc.info.template.citymap = {
	/**
	 * @desc Info templates for rendering property information using {@link nyc.info.Renderer} 
	 * @public
	 * @member {Array<string>}
	 */
	propertyInfo: [
 		'<div class="ctl-collapse" data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">' + 
 			'<h3>Tax Information</h3>' +
 			'<p>' +
 				'<span class="prp-fld">Borough:</span>' + 
 				'<span class="prp-val">${BOROUGH_NAME}</span><br>' + 
 				'<span class="prp-fld">Block:</span>' + 
 				'<span class="prp-val">${BLOCK}&nbsp;</span>' + 
 				'<span class="prp-fld">Lot:</span>' + 
 				'<span class="prp-val">${LOT}&nbsp;</span><br>' +
 				'<span class="prp-fld">Owner:</span>' + 
 				'<span class="prp-val">${OWNERNAME}</span>' + 
 			'</p>' +
     	'</div>',
 	    '<div class="ctl-collapse" data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">' + 
 			'<h3>Property Information</h3>' +
 			'<p>' +
 				'<span class="prp-fld">Lot Area:</span>' + 
 				'<span class="prp-val">${LOTAREA}&nbsp;sf</span><br>' + 
 				'<span class="prp-fld">Lot Frontage:</span>' + 
 				'<span class="prp-val">${LOTFRONT}\'</span><br>' + 
 				'<span class="prp-fld">Lot Depth:</span>' + 
 				'<span class="prp-val">${LOTDEPTH}\'</span><br>' + 
 				'<span class="prp-fld">Year Built:</span>' + 
 				'<span class="prp-val">${YEARBUILT}</span><br>' + 
 				'<span class="prp-fld">Number of Buildings:</span>' + 
 				'<span class="prp-val">${NUMBLDGS}</span><br>' + 
 				'<span class="prp-fld">Number of Floors:</span>' + 
 				'<span class="prp-val">${NUMFLOORS}</span><br>' + 
 				'<span class="prp-fld">Gross Floor Area:</span>' + 
 				'<span class="prp-val">${COMAREA}&nbsp;sf</span><br>' + 
 				'<span class="prp-fld">Residential Units:</span>' + 
 				'<span class="prp-val">${UNITSRES}</span><br>' + 
 				'<span class="prp-fld">Total Number of Units:</span>' + 
 				'<span class="prp-val">${UNITSTOTAL}</span>' + 
 			'</p>' +
 		'</div>',
 		'<div class="ctl-collapse" data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">' + 
 			'<h3>Zoning Information</h3>' +
 			'<p>' +
 				'<span class="prp-fld">Land Use:</span>' + 
 				'<span class="prp-val">${LANDUSEDESC}</span><br>' + 
 				'<span class="prp-fld">Zoning:</span>' + 
 				'<span class="prp-val">${ZONEDIST1}&nbsp;</span>' + 
 				'<span class="prp-val">${ZONEDIST2}</span><br>' + 
 				'<span class="prp-fld">Commercial Overlay:</span>' + 
 				'<span class="prp-val">${OVERLAY1}&nbsp;</span>' + 
 				'<span class="prp-val">${OVERLAY2}</span><br>' + 
 				'<span class="prp-fld">Zoning Map #:</span>' + 
 				'<span class="prp-val">' + 
 					'<a href="http://www1.nyc.gov/assets/planning/download/pdf/zoning/zoning-maps/map${ZONEMAP}.pdf" title="DCP Zoning Map ${ZONEMAP}" target="_blank">${ZONEMAP}&nbsp;</a>' + 
 				'</span>' + 
 			'</p>' +
     	'</div>',
 		'<div class="ctl-collapse" data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">' + 
 			'<h3>Community Information</h3>' +
 			'<p>' +
 				'<span class="prp-fld">Community District:</span>' + 
 				'<span class="prp-val">${CD}</span><br>' + 
 				'<span class="prp-fld">Police Precinct:</span>' + 
 				'<span class="prp-val">${POLICEPRCT}</span><br>' +
 			'</p>' +
     	'</div>'
     ]	
};			