var nyc = nyc || {};

/** 
 * @public 
 * @namespace
 */
nyc.jcard = nyc.jcard || {};

/**
 * @desc Supported JCard properties
 * @public
 * @enum {string}
 */
nyc.jcard.Property = {
	/**
	 * @desc The JCard name property
	 */
	NAME: 'n',
	/**
	 * @desc The JCard formatted name property
	 */
	FORMATTED_NAME: 'fn',
	/**
	 * @desc The JCard organization name property
	 */
	ORGANIZATION: 'org',
	/**
	 * @desc The JCard address name property
	 */
	ADDRESS: 'adr',
	/**
	 * @desc The JCard phone name property
	 */
	PHONE: 'tel',
	/**
	 * @desc The JCard email name property
	 */
	EMAIL: 'email',
	/**
	 * @desc The JCard URL name property
	 */
	URL: 'url',
	/**
	 * @desc The JCard timezone name property
	 */
	TIMEZONE: 'tz',
	/**
	 * @desc The JCard geography name property
	 */
	GEOGRAPHY: 'geo',
	/**
	 * @desc The JCard revision name property
	 */
	REVISION: 'rev',
	/**
	 * @desc The JCard note name property
	 */
	NOTE: 'note'
};

/**
 * @desc Supported JCard types
 * @public
 * @enum {string}
 */
nyc.jcard.Type = {
	/**
	 * @desc The JCard work type
	 */
	WORK: 'work',
	/**
	 * @desc The JCard home type
	 */
	HOME: 'home',
	/**
	 * @desc The JCard voice type
	 */
	VOICE: 'voice',
	/**
	 * @desc The JCard text type
	 */
	TEXT: 'text',
	/**
	 * @desc The JCard cell type
	 */
	CELL: 'cell',
	/**
	 * @desc The JCard video type
	 */
	VIDEO: 'video'
};

/**
 * @desc Supported JCard data types 
 * @public
 * @enum {string}
 */
nyc.jcard.Data = {
	/**
	 * @desc The JCard string data type
	 */
	STRING: 'string',
	/**
	 * @desc The JCard URI data type
	 */
	URI: 'uri',
	/**
	 * @desc The JCard utc-offset data type
	 */
	UTC_OFFSET: 'utc-offset',
	/**
	 * @desc The JCard text data type
	 */
	TEXT: 'text',
	/**
	 * @desc The JCard date data type
	 */
	DATE: 'date-and-or-time'
};

/**
 * @desc Object type description for JCard name property
 * @public
 * @typedef {Object}
 * @property {string=} first First name
 * @property {string=} last Last name
 * @property {string=} initial Middle initial
 * @property {string=} prefix Name refix
 * @property {string=} suffix Name suffix
 */
nyc.jcard.Name;

/**
 * @desc Object type description for JCard address property
 * @public
 * @typedef {Object}
 * @property {string=} line1 Address line 1
 * @property {string=} line2 Address line 2
 * @property {string=} city City name
 * @property {string=} state State name or abbreviation
 * @property {string=} zip ZIP Code
 * @property {string=} country Country name or abbreviation
 * @property {nyc.jcard.Type|Array<nyc.jcard.Type>} [type] The type of address
 */
nyc.jcard.Address;

/**
 * @desc Object type description for JCard address email
 * @public
 * @typedef {Object}
 * @property {string} email The email address
 *  @property {nyc.jcard.Type|Array<nyc.jcard.Type>} [type] The type of email address
 */
nyc.jcard.Email;

/**
 * @desc Object type description for JCard phone property
 * @public
 * @typedef {Object}
 * @property {string} area Phone number area code
 * @property {string} number Phone number
 * @property {string=} extension Phone extension
 *  @property {nyc.jcard.Type|Array<nyc.jcard.Type>} [type] The type of phone number
 */
nyc.jcard.Phone;

/**
 * @desc Object type description for JCard organization property
 * @public
 * @typedef {Object}
 * @property {string} name Organization name
 *  @property {nyc.jcard.Type|Array<nyc.jcard.Type>} [type] The type of organization
 */
nyc.jcard.Oraganization;

/**
 * @desc Object type description for JCard geography property
 * @public
 * @typedef {Object}
 * @property {number} lat Latitude
 * @property {number} lng Longitude
 *  @property {nyc.jcard.Type|Array<nyc.jcard.Type>} [type] The geography type
 */
nyc.jcard.Geo;

/** 
 * @desc Class for creating JCards for submission to the server
 * @public 
 * @class
 * @constructor
 */
nyc.jcard.Builder = function(){
	this.data = ['vcard', [['version', {}, 'text', '4.0']]];
};

nyc.jcard.Builder.prototype = {
	/** 
	 * @private
	 * @member {Array<string>}
	 */
	nameValue: null,
	/** 
	 * @private
	 * @member {string}
	 */
	orgValue: null,
	/** 
	 * @private
	 * @member {Array}
	 */
	data: null,
	/** 
	 * @desc Create a JCard name property
	 * @public
	 * @method
	 * @param {nyc.jcard.Name} name The name to create
	 * @return {Array} The JCard name property
	 */ 
	name: function(name){
		var values = [], prefix = [], suffix = [];
		values.push(name.last || '');
		values.push(name.first || '');
		values.push(name.initial || '');
		values.push(name.prefix || '');
		values.push(name.suffix || '');
		return this.prop(nyc.jcard.Property.NAME, {}, nyc.jcard.Data.TEXT, [values]);
	},
	/** 
	 * @desc Create a JCard address property
	 * @public
	 * @method
	 * @param {nyc.jcard.Address} address The address to create
	 * @return {Array} The JCard address property
	 */ 
	address: function(address){
		var line1 = address.line1 || '',
			line2 = address.line2 || '',
			city = address.city || '',
			state = address.state || '',
			zip = address.zip || '',
			country = address.country || '',
			values = [],
			label = line1,
			params = this.params(address.type);
		values.push(line1);
		values.push(city);
		values.push(line2);
		values.push(state);
		values.push(zip);
		values.push(country);
		if (line2) label += ('\n' + line2);
		label += ('\n' + city + '\, ' + state + ' ' + zip);
		if (country) label += ('\n' + country);
		params.label = label;
		return this.prop(nyc.jcard.Property.ADDRESS, params, nyc.jcard.Data.TEXT, [values]);
	},
	/** 
	 * @desc Create a JCard email property
	 * @public
	 * @method
	 * @param {nyc.jcard.Email} email The email to create
	 * @return {Array} The JCard email property
	 */ 
	email: function(email){
		return this.prop(nyc.jcard.Property.EMAIL, this.params(email.type), nyc.jcard.Data.TEXT, [email.email]);
	},
	/** 
	 * @desc Create a JCard phone property
	 * @public
	 * @method
	 * @param {nyc.jcard.Phone} phone The phone to create
	 * @return {Array} The JCard phone property
	 */ 
	phone: function(phone){
		var number = '+1-' + phone.area + '-' + phone.number;
		number += phone.extension ? (',' + phone.extension) : '';
		return this.prop(nyc.jcard.Property.PHONE, this.params(phone.type), nyc.jcard.Data.URI, [number]);
	},
	/** 
	 * @desc Create a JCard phone property from a U.S.A phone number string
	 * @public
	 * @method
	 * @param {string} phone The phone to create
	 * @return {Array} The JCard phone property
	 */ 
	parsePhone: function(phone){
		var number = phone, area = '', extension = '';
		phone = phone.replace(/[^\w]/g, '');
		if (phone.substr(0, 1) == '1') {
			phone = phone.substr(1);
		}
		if (phone.length >= 10) {
			area = phone.substr(0, 3);
			number = phone.substr(3, 3) + '-' + phone.substr(6, 4);
			if (phone.length > 10) {
				extension = phone.substr(10);
			}
		}
		return this.phone({area: area, phone: number, extension: extension});
	},
	/** 
	 * @desc Create a JCard URL property
	 * @public
	 * @method
	 * @param {string} url The URL to create
	 * @return {Array} The JCard URL property
	 */ 
	url: function(url){
		return this.prop(nyc.jcard.Property.URL, this.params(url.type), nyc.jcard.Data.URI, [url.url]);
	},
	/** 
	 * @desc Create a JCard organization property
	 * @public
	 * @method
	 * @param {nyc.jcard.Organization} organization The organization to create
	 * @return {Array} The JCard organization property
	 */ 
	organization: function(organization){
		return this.prop(nyc.jcard.Property.ORGANIZATION, this.params(organization.type), nyc.jcard.Data.TEXT, [organization.name]);
	},
	/** 
	 * @desc Create a JCard timezone property
	 * @public
	 * @method
	 * @param {string} timezone The timezone to create
	 * @return {Array} The JCard timezone property
	 */ 
	timezone: function(timezone){
		return this.prop(nyc.jcard.Property.TIMEZONE, {}, nyc.jcard.Data.UTC_OFFSET, [timezone]);
	},
	/** 
	 * @desc Create a JCard geography property
	 * @public
	 * @method
	 * @param {nyc.jcard.Geo} geo The geography to create
	 * @return {Array} The JCard geography property
	 */ 
	geography: function(geo){
		return this.prop(nyc.jcard.Property.GEOGRAPHY, this.params(geo.type), nyc.jcard.Data.URI, ['geo:' + geo.lat + ',' + geo.lng]);
	},
	/** 
	 * @desc Create a JCard note property
	 * @public
	 * @method
	 * @param {string} note The note to create
	 * @return {Array} The JCard note property
	 */ 
	note: function(note){
		return this.prop(nyc.jcard.Property.NOTE, {}, nyc.jcard.Data.TEXT, [note]);
	},
	/** 
	 * @desc Create a JCard date property
	 * @public
	 * @method
	 * @param {Date} date The date to create
	 * @return {Array} The JCard date property
	 */ 
	revision: function(date){
		var rev = date.toISOString(), z = rev.substr(rev.length - 1);
		rev = rev.replace(/-|:/g, '');
		rev = rev.substr(0, rev.indexOf('.')) + z;
		return this.prop(nyc.jcard.Property.REVISION, {}, nyc.jcard.Data.DATE, [rev]);
	},
	/** 
	 * @desc Add a JCard property
	 * @public
	 * @method
	 * @param {Array} prop The JCard property to add
	 */ 
	add: function(prop){
		if (!this.nameValue && prop[0] == nyc.jcard.Property.NAME){
			var values = [];
			for (var i = 2; i < prop.length; i++){
				values.push(prop[i]);
			}
			this.nameValue = values;
		}
		if (!this.orgValue && prop[0] == nyc.jcard.Property.ORGANIZATION){
			this.orgValue = prop[3];
		}
		this.data[1].push(prop);
	},
	/** 
	 * @desc Create the JCard
	 * @public
	 * @method
	 * @return {Array} The JCard
	 */ 
	jcard: function(){
		this.checkForFormattedName();
		return this.data;
	},
	/** 
	 * @desc Gat a JSON representation of the JCard
	 * @public
	 * @method
	 * @return {string} The JSON representation of the JCard
	 */ 
	json: function(){
		return JSON.stringify(this.jcard());
	},
	/**
	 * @private
	 * @method
	 */
	checkForFormattedName: function(){
		var data = this.data[1], formattedName;
		for (var i = 0; i < data.length; i++){
			var prop = data[i];
			if (prop[0] == nyc.jcard.Property.FORMATTED_NAME){
				formattedName = prop;
			}
		}
		if (!formattedName) {
			this.formattedName();
		}
	},
	/**
	 * @private
	 * @method
	 */
	formattedName: function(){
		var name = this.nameValue ? this.nameValue[1] : null, formattedName = '';
		if (name){
			var first = name[1], 
				last = name[0], 
				initial = name[2], 
				prefix = name[3], 
				suffix = name[4];
			formattedName += (prefix || ''); 
			formattedName += (' '  + (first || ''));
			formattedName += (' '  + (initial || ''));
			formattedName += (' '  + (last || ''));
			formattedName += (suffix ? (', ' + suffix) : '');
		}else {
			formattedName = this.orgValue || '';
		}
		formattedName = formattedName.trim().replace(/  /, ' ');
		if (formattedName){
			var prop = this.prop(nyc.jcard.Property.FORMATTED_NAME, {}, nyc.jcard.Data.TEXT, [formattedName]);
			this.add(prop);
		}
	},
	/**
	 * @private
	 * @method
	 * @param {stringArray<string>} prop
	 * @return {Object<string, string>|Object<string, Array<string>>}
	 */
	params: function(type){
		if (type){
			return {type: type};			
		}
		return {};
	},
	/**
	 * @private
	 * @method
	 * @param {string} prop
	 * @param {Object<string, string>|Object<string, Array<string>>} params
	 * @param {string} dataType
	 * @param {Array<string>} values
	 * @return {Array}
	 */ 
	prop: function(prop, params, dataType, values){
		var prop = [prop, params, dataType];
		for (var i = 0; i < values.length; i++){
			prop.push(values[i]);			
		}
		return prop;
	}	
};