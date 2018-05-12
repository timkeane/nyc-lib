  /**
 * @module nyc/Filters
 */

import $ from 'jquery'

import nyc from 'nyc/nyc'
import Container from 'nyc/Container'
import Choice from 'nyc/Choice'

/**
 * @desc Class for managing controls for filtering a FilterAndSort source
 * @public
 * @class
 * @extends {Container}
 */
class Filters extends Container {
  /**
   * @desc Class for creating choice control
   * @public
   * @constructor
   * @param {Filters.Options}
   */
  constructor(options) {
    super(options.target)
      /**
       * @private
       * @member {Array<Choice>}
       */
      this.choiceControls = []
      /**
       * @private
       * @member {FilterAndSort}
       */
      this.source = options.source
      options.filterChoiceOptions.forEach(choiceOptions => {
      choiceOptions.target = choiceOptions.target || $(`<div class="${nyc.nextId('filter')}"></div>`)
      this.append($(choiceOptions.target))
      const choice = new Choice(choiceOptions)
      choice.on('change', $.proxy(this.filter, this))
      this.choiceControls.push(choice)
    })
  }
  /**
   * @private
   * @method
   */
  filter() {
    const namedFilters = {}
    const filters = []
    this.choiceControls.forEach(filterControl => {
      filterControl.val().forEach(choice => {
        const filter = namedFilters[choice.name] || []
        namedFilters[choice.name] = filter.concat(choice.values)
      })
    })
    Object.keys(namedFilters).forEach(name => {
      filters.push({property: name, values: namedFilters[name]})
    })
    this.source.filter(filters)
    this.trigger('change', this)
  }
}

/**
 * @desc Object type to hold constructor options for
 * @public
 * @typedef {Object}
 * @property {JQuery|Element|string} target
 * @property {Array<Choice.Options>} filterChoiceOptions
 * @property {nyc.ol.source.FilterAndSort} source The source to filter
 */
Filters.Options

export default Filters
