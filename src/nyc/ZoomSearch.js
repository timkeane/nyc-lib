/**
 * @module nyc/ZoomSearch
 */

import $ from 'jquery'

import Container from 'nyc/Container'
import Locator from 'nyc/Locator'
import AutoComplete from 'nyc/AutoComplete'

/**
 * @desc Abstract class for zoom and search controls
 * @public
 * @abstract
 * @class
 * @extends module:nyc/Container~Container
 * @fires module:nyc/ZoomSearch~ZoomSearch#search
 * @fires module:nyc/ZoomSearch~ZoomSearch#geolocate
 * @fires module:nyc/ZoomSearch~ZoomSearch#disambiguated
 */
class ZoomSearch extends Container {
	/**
	 * @desc  Create an instance of ZoomSearch
	 * @access protected
	 * @constructor
	 * @param {jQuery|Element|string} target The target
	 */
	constructor(target) {
		super($(ZoomSearch.HTML))
		$(target).append(this.getContainer())
		/**
		 * @private
		 * @member {boolean}
		 */
		this.isAddrSrch = true
		/**
		 * @private
		 * @member {jQuery}
		 */
		this.input = null
		/**
		 * @private
		 * @member {jQuery}
		 */
		this.list = null
		/**
		 * @private
		 * @member {jQuery}
		 */
		this.retention = null
		/**
		 * @private
		 * @member {jQuery}
		 */
		this.clear = null
		/**
		 * @private
		 * @member {AutoComplete}
		 */
		this.autoComplete = null
		this.input = this.find('.srch input')
		this.list = this.find('.srch ul')
		this.retention = this.find('ul.retention')
		this.clear = this.find('.srch .btn-x')
		this.hookupEvents(this.input)
	}
	/**
	 * @desc Handle the zoom event triggered by user interaction
	 * @public
	 * @abstract
	 * @method
	 * @param {jQuery.Event} event The event triggered by the zoom buttons
	 */
	zoom(event) {
		throw 'Not implemented'
	}
	/**
	 * @public
	 * @abstract
	 * @method
	 * @param {Object} feature The feature object
	 * @param {module:nyc/ZoomSearch~ZoomSearch.FeatureSearchOptions} options Describes how to convert feature
	 * @return {module:nyc/Locator~Locator.Result} The location
	 */
	featureAsLocation(feature, options) {
		throw 'Not implemented'
	}
	/**
	 * @desc Set or get the value of the search field
	 * @public
	 * @method
	 * @param {string=} val The value for the search field
	 * @return {string} The value of the search field
	 */
	val(val) {
		if (typeof val === 'string') {
			this.input.val(val)
			this.clearBtn()
		}
		return this.input.val()
	}
	/**
	 * @desc Displays possible address matches
	 * @public
	 * @method
	 * @param {module:nyc/Locator~Locator.Ambiguous} ambiguous Possible locations resulting from a geocoder search to display to the user
	 */
	disambiguate(ambiguous) {
		const possible = ambiguous.possible
		if (possible.length) {
			const list = this.list
			this.emptyList()
			possible.forEach(locateResult => {
				list.append(this.listItem({layerName: 'addr'}, locateResult))
			})
			this.showList(true)
		}
	}
	/**
	 * @desc Add searchable features
	 * @public
	 * @method
	 * @param {module:nyc/ZoomSearch~ZoomSearch.FeatureSearchOptions} options The options for creating a feature search
	 */
	setFeatures(options) {
		this.autoComplete = this.autoComplete || new AutoComplete()
		options.nameField = options.nameField || 'name'
		options.displayField = options.displayField || options.nameField
		if (options.placeholder) {
			this.input.attr('placeholder', options.placeholder)
		}
		this.sortAlphapetically(options).forEach(feature => {
			const location = this.featureAsLocation(feature, options)
			const li = this.listItem(options, location)
			this.retention.append(li)
		})
		this.emptyList()
	}
	/**
	 * @desc Remove searchable features
	 * @public
	 * @method
	 * @param {string} featureTypeName The featureTypeName used when the features were set
	 */
	removeFeatures(featureTypeName) {
		this.find('li.' + featureTypeName).remove()
	}
	/**
	 * @private
	 * @method
	 * @param {module:nyc/ZoomSearch~ZoomSearch.FeatureSearchOptions} options
	 * @return {Array<Object>} features
	 */
	sortAlphapetically(options) {
		const features = []
		options.features.forEach(feature => {
			if (feature.get) {
				features.push($.extend({}, feature))
			} else {
				features.push($.extend({
					get(prop) {
						return this.properties[prop]
					}
				}, feature))
			}
		})
		features.sort((a, b) => {
			const nameField = options.nameField
			if (a.get(nameField) < b.get(nameField)) return -1
			if (a.get(nameField) > b.get(nameField)) return 1
			return 0
		})
		return features
	}
	/**
	 * @private
	 * @method
	 * @param {module:nyc/ZoomSearch~ZoomSearch.FeatureSearchOptions} options
	 * @param {module:nyc/Locator~Locator.Result} data
	 * @return {jQuery}
	 */
	listItem(options, data) {
		const li = $('<li></li>')
		const displayField = options.displayField
		const name = `${data.data[displayField] || data.name}`
		li.addClass(options.layerName)
		if (options.layerName !== 'addr') {
			li.addClass('feature')
		}
		return li.addClass('notranslate')
			.attr({translate: 'no', title: name})
			.html(`<a href="#">${name}</a>`)
			.data('nameField', options.nameField)
			.data('displayField', displayField)
			.data('location', data)
			.click($.proxy(this.disambiguated, this))
	}
	/**
	 * @private
	 * @method
	 */
	emptyList() {
		const retention = this.retention
		this.find('.srch li').each((i, item) => {
			if (retention.find(`li[title="${item.title}"]`).length === 0) {
				retention.append(item)
			}
		})
		this.list.empty()
	}
	/**
	 * @private
	 * @method
	 * @param {jQuery.Event} event
	 */
	disambiguated(event) {
		let li = $(event.target)
		if (li.get(0).tagName.toUpperCase() !== 'LI') {
			li = li.parent()
		}
		const data = li.data('location')
		this.val(data.name)
		data.isFeature = li.hasClass('feature')
		this.trigger('disambiguated', data)
		li.parent().slideUp()
		this.emptyList()
	}
	/**
	 * @private
	 * @method
	 * @param {jQuery.Event} event
	 */
	 listClick(event) {
		 event = event.originalEvent || event
		 if (this.list.css('display') === 'block') {
			 const target = $(event.target)
			 if ($.contains(this.list.get(0), target.get(0))) {
				 if (this.autoComplete) {
					 target.trigger('click')
				 }
			 } else {
				 this.list.slideUp()
			 }
		 }
	 }
	/**
	 * @private
   * @method
	 * @param {jQuery} input
	 */
	hookupEvents(input) {
		input.on('keyup change', $.proxy(this.key, this))
		input.focus(() => input.select())
		this.find('.btn-z-in, .btn-z-out').click($.proxy(this.zoom, this))
		this.find('.btn-geo').click($.proxy(this.geolocate, this))
		this.clear.click($.proxy(this.clearTxt, this))
		$(document).mouseup($.proxy(this.listClick, this))
	}
	/**
	 * @private
	 * @method
	 * @param {jQuery.Event} event
	 */
	key(event) {
		if (event.keyCode === 13 && this.isAddrSrch) {
			this.triggerSearch()
			this.list.slideUp()
		} else {
			this.filterList()
		}
		this.clearBtn()
	}
	/**
	 * @private
	 * @method
	 */
	clearTxt() {
		this.val('')
		this.clearBtn()
	}
	/**
	 * @private
	 * @method
	 */
	clearBtn() {
		this.clear[this.val() ? 'show' : 'hide']()
	}
	/**
	 * @private
	 * @method
	 */
	filterList() {
		const typed = this.val().trim()
		if (this.autoComplete && typed) {
			this.autoComplete.filter(this.retention, this.list, typed)
		} else {
			this.emptyList()
		}
		this.showList(false)
	}
	/**
	 * @private
	 * @method
	 * @param {boolean}
	 */
	showList(focus) {
		this.list.slideDown(() => {
			if (focus) {
				this.list.children().first().find('a').attr('tabindex', 0).focus()
			}
		})
	}
	/**
	 * @private
	 * @method
	 */
	geolocate() {
		this.val('')
		this.trigger('geolocate')
	}
	/**
	 * @private
	 * @method
	 */
	triggerSearch() {
		const input = this.val().trim()
		if (input.length) {
			this.input.blur()
			this.trigger('search', input)
		}
	}
}

/**
 * @desc Object type to hold data about how to search features
 * @public
 * @typedef {Object}
 * @property {Array<Object|ol.Feature>} features The features to be searched
 * @property {string} layerName The name of the layer or feature type the features are from
 * @property {string} [nameField="name"] The name attribute field of the feature
 * @property {string=} displayField The name attribute field of the feature
 * @property {string=} placeholder A placeholder for the search field
 */
ZoomSearch.FeatureSearchOptions

/**
 * @desc The user has requested a search based on their text input
 * @event module:nyc/ZoomSearch~ZoomSearch#search
 * @type {string}
 */

/**
 * @desc The user has requested their geolcation
 * @event module:nyc/ZoomSearch~ZoomSearch#geolocate
 */

/**
 * @desc The user has chosen a location from a list of possible locations
 * @event module:nyc/ZoomSearch~ZoomSearch#disambiguated
 * @type {module:nyc/Locate~Locate.Result}
 */

/**
 * @private
 * @const
 * @type {string}
 */
ZoomSearch.HTML = '<div class="z-srch" role="toolbar">' +
	'<div class="srch" role="search">' +
		'<input class="rad-all" placeholder="Search for an address...">' +
		'<button class="btn-rnd btn-x"><span class="screen-reader-only">Clear</span></button>' +
		'<ul class="rad-all" role="region" label="Possible matches for your search"></ul>' +
	'</div>' +
	'<button class="btn-z-in btn-sq rad-all" data-zoom-incr="1" title="Zoom in">' +
		'<span class="screen-reader-only">Zoom in</span>' +
	'</button>' +
	'<button class="btn-z-out btn-sq rad-all" data-zoom-incr="-1" title="Zoom out">' +
		'<span class="screen-reader-only">Zoom out</span>' +
	'</button>' +
	'<button class="btn-geo btn-sq rad-all" title="Current location">' +
		'<span class="screen-reader-only">Current location</span>' +
	'</button>' +
	'<ul class="retention"></ul>' +
'</div>'

export default ZoomSearch
