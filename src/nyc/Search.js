/**
 * @module nyc/Search
 */

import $ from 'jquery'

import Container from 'nyc/Container'
import AutoComplete from 'nyc/AutoComplete'

/**
 * @desc Abstract class for zoom and search controls
 * @public
 * @abstract
 * @class
 * @extends module:nyc/Container~Container
 * @fires module:nyc/Search~Search#search
 * @fires module:nyc/Search~Search#disambiguated
 */
class Search extends Container {
  /**
   * @desc  Create an instance of Search
   * @access protected
   * @constructor
   * @param {jQuery|Element|string} target The target
   */
  constructor(target) {
    super($(Search.HTML))
    let input
    target = $(target).get(0)
    if (target.tagName === 'INPUT') {
      input = target
      target = $('<div class="map-srch"></div>')
      target.insertAfter(input)
    }
    $(target).append(this.getContainer())
    /**
     * @private
     * @member {jQuery}
     */
    this.input = this.find('input')
    /**
     * @private
     * @member {jQuery}
     */
    this.clear = this.find('.btn-x')
    if (input) {
      this.input.attr('id', $(input).attr('id'))
        .attr('placeholder', $(input).attr('placeholder'))
        .addClass($(input).attr('class'))
      $(input).remove()
      this.clear.remove()
    }
    /**
     * @private
     * @member {boolean}
     */
    this.isAddrSrch = true
    /**
     * @private
     * @member {jQuery}
     */
    this.list = this.find('ul.rad-all')
    /**
     * @private
     * @member {jQuery}
     */
    this.retention = this.find('ul.retention')
    /**
     * @private
     * @member {AutoComplete}
     */
    this.autoComplete = null
    this.hookupEvents(this.input)
  }
  /**
   * @public
   * @abstract
   * @method
   * @param {Object} feature The feature object
   * @param {module:nyc/Search~Search.FeatureSearchOptions} options Describes how to convert feature
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
   * @param {module:nyc/Search~Search.FeatureSearchOptions} options The options for creating a feature search
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
   * @param {module:nyc/Search~Search.FeatureSearchOptions} options Options
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
      if (a.get(nameField) < b.get(nameField)) {
        return -1
      }
      if (a.get(nameField) > b.get(nameField)) {
        return 1
      }
      return 0
    })
    return features
  }
  /**
   * @private
   * @method
   * @param {module:nyc/Search~Search.FeatureSearchOptions} options Options
   * @param {module:nyc/Locator~Locator.Result} data Location data
   * @return {jQuery} list item
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
      .attr({translate: 'no', 'data-id': encodeURIComponent(name)})
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
      if (retention.find(`li[data-id="${$(item).attr('data-id')}"]`).length === 0) {
        retention.append(item)
      }
    })
    this.list.empty()
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event Event object
   */
  disambiguated(event) {
    const li = $(event.currentTarget)
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
   * @param {jQuery.Event} event Event object
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
   * @param {jQuery} input Input element
   */
  hookupEvents(input) {
    input.on('keyup change', $.proxy(this.key, this))
    input.focus(() => input.select())
    this.clear.click($.proxy(this.clearTxt, this))
    $(document).mouseup($.proxy(this.listClick, this))
    this.find('.btn-srch').click($.proxy(this.triggerSearch, this))
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event Event object
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
   * @param {boolean} focus Should we focus?
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
Search.FeatureSearchOptions

/**
 * @desc The user has requested a search based on their text input
 * @event module:nyc/Search~Search#search
 * @type {string}
 */

/**
 * @desc The user has chosen a location from a list of possible locations
 * @event module:nyc/Search~Search#disambiguated
 * @type {module:nyc/Locate~Locate.Result}
 */

/**
 * @private
 * @const
 * @type {string}
 */
Search.HTML = '<div class="srch-ctl">' +
  '<div class="srch input-group" role="search">' +
    '<input class="rad-all" placeholder="Search for an address...">' +
    '<button class="btn btn-rnd btn-x">' +
      '<span class="screen-reader-only">Clear</span>' +
      '<span class="fas fa-times" role="img"></span>' +
    '</button>' +
    '<button class="btn btn-srch btn-primary btn-lg">Search</button>' +
    '</div>' +
  '<ul class="rad-all" role="region" label="Possible matches for your search"></ul>' +
  '<ul class="retention"></ul>' +
'</div>'

export default Search
