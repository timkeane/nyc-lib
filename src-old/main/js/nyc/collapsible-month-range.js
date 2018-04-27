var nyc = nyc || {};

/**
 * @desc A UI class to pick a month range
 * @public
 * @class
 * @extends {nyc.Collapsible}
 * @constructor
 * @param {nyc.MonthRangePicker.Options} options Constructor options
 */
nyc.MonthRangePicker = function(options){
	var labelMin = $('<label>The beginning of</label>'), 
		labelMax = $('<label>through the end of</label>');
	
	this.minDate = this.firstOfMonth(options.minMonth, options.minYear);
	this.maxDate = this.lastOfMonth(options.maxMonth, options.maxYear);

	this.minDates = [];
	this.maxDates = [];

	this.min = $('<select class="date-min"></select>').uniqueId();
	this.max = $('<select class="date-max"></select>').uniqueId();
	labelMin.attr('for', this.min.attr('id'));
	labelMax.attr('for', this.max.attr('id'));
	
	$(options.target).append(labelMin)
		.append(this.min)
		.append(labelMax)
		.append(this.max);

	nyc.Collapsible.apply(this, [options]);
	
	this.populate(options);
	
	this.min.get(0).selectedIndex = this.min.children().length - 1;
	this.max.get(0).selectedIndex = this.max.children().length - 1;
	this.min.selectmenu().selectmenu('refresh', true);
	this.max.selectmenu().selectmenu('refresh', true);

	$(this.min).change($.proxy(this.disableMax, this));
	$(this.max).change($.proxy(this.disableMin, this));
	this.changed();
	this.disableMax();
};

nyc.MonthRangePicker.prototype = {
	/** 
	 * @desc The minimum date
	 * @public 
	 * @member {Date}
	 */
	minDate: null,
	/** 
	 * @desc The maximum date
	 * @public 
	 * @member {Date}
	 */
	maxDate: null,
	/** 
	 * @private 
	 * @member {Array<Date>}
	 */
	minDates: null,
	/** 
	 * @private 
	 * @member {Array<Date>}
	 */
	maxDates: null,
	/** 
	 * @private 
	 * @member {JQuery}
	 */
	min: null,
	/** 
	 * @private 
	 * @member {JQuery}
	 */
	max: null,
	/** 
	 * @private 
	 * @member {Date}
	 */
	value: null,
	/** 
	 * @private 
	 * @member {Array<string>}
	 */
	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	/** 
	 * @private
	 * @method
	 * @param {nyc.MonthRangePicker.Options} options
	 */
	populate: function(options){
		for (var year = options.minYear; year <= options.maxYear; year++){
			for (var month = 0; month < 12; month++){		
				var min = this.firstOfMonth(month, year), max = this.lastOfMonth(month, year);
				if (min >= this.minDate && min <= this.maxDate){
					this.minDates.push(min);
					this.appendOpt(this.min, min);						
				}
				if (max >= this.minDate && max <= this.maxDate){
					this.maxDates.push(max);
					this.appendOpt(this.max, max);
				}
			}
		}
	},
	/** 
	 * @private
	 * @method
	 * @param {JQuery} parent
	 * @param {Date} date
	 */
	appendOpt: function(parent, date){
		var opt = $('<option></option>');
		opt.html(this.months[date.getMonth()] + ' ' + date.getFullYear());
		opt.attr('value', date.toISOString());
		parent.append(opt);
	},
	/** 
	 * @private
	 * @method
	 * @param {number} month
	 * @param {number} year
	 * @return {Date}
	 */
	firstOfMonth: function(month, year){
		return this.localeDate(year + '-' + this.pad(month + 1) + '-01');		
	},
	/** 
	 * @private
	 * @method
	 * @param {number} month
	 * @param {number} year
	 * @return {Date}
	 */
	lastOfMonth: function(month, year){
		var date = new Date(year, month + 1, 0).getDate();  
		return this.localeDate(year + '-' + this.pad(month + 1) + '-' + date);		
	},
	/** 
	 * @private
	 * @method
	 * @param {string} dateString
	 * @return {Date}
	 */
	localeDate: function(dateString){
		var utcDate = dateString ? new Date(dateString) : new Date();
		return new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000));
	},
	/** 
	 * @private
	 * @method
	 * @param {number} number
	 * @return {string}
	 */
	pad: function(number){
		return (number < 10 ? '0' : '') + number;
	},
	/** 
	 * @private
	 * @method	
	 */
	disableMax: function(){
		var me = this, minDate = new Date(this.min.val());
		$.each(me.maxDates, function(i, date){
			$(me.max.children().get(i))[date < minDate ? 'hide' : 'show']();
		});
		this.changed();
	},
	/** 
	 * @private
	 * @method	
	 */
	disableMin: function(){
		var me = this, maxDate = new Date(this.max.val());		
		$.each(me.minDates, function(i, date){
			$(me.min.children().get(i))[date > maxDate ? 'hide' : 'show']();
		});
		this.changed();
	},
	/** 
	 * @private
	 * @method	
 	 */
	changed: function(){
		var start = new Date(this.min.val()), end = new Date(this.max.val());
		this.currentVal.html(start.toLocaleDateString() + ' - ' + end.toLocaleDateString());
		this.value = {start: start, end: end};
		this.trigger('change', this.value);
	},
	/** 
	 * @desc Returns the date range value
	 * @public
	 * @method	
	 * @return {nyc.MonthRangePicker.DateRange} The date range
	 */
	val: function(){
		return this.value;
	}
};

nyc.inherits(nyc.MonthRangePicker, nyc.Collapsible);

/**
 * @desc Date range object
 * @public
 * @typedef {Object}
 * @property {Date} start The start of the range
 * @property {Date} end The end of the range
 */
nyc.MonthRangePicker.DateRange;

/**
 * @desc Constructor options for {@link nyc.MonthRangePicker}
 * @public
 * @typedef {Object}
 * @property {number} minMonth The zero-based index of the minimum month
 * @property {number} minYear The 4 digit minimum year
 * @property {number} maxMonth The zero-based index of the maximum month
 * @property {number} maxYear The 4 digit maximum year
 * @property {(String|Element|JQuery)} target The DOM target
 */
nyc.MonthRangePicker.Options;
