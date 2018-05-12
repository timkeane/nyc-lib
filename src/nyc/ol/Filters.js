/**
 * @module nyc/Filters
 */

import $ from 'jquery'

import nyc from 'nyc/nyc'
import Container from 'nyc/Container'
import Choice from 'nyc/Choice'

class Filters extends Container {
  constructor(options) {
    super(options.target)
    this.filterControls = []
    this.source = options.source
    options.filterChoiceOptions.forEach((option, i) => {
      option.target = option.target || $(`<div class="${nyc.nextId('filter')}"></div>`)
      this.append($(option.target))
      const choice = new Choice(option)
      choice.on('change', $.proxy(this.filter, this))
      this.filterControls.push(choice)
    })
  }
  filter() {
    const namedFilters = {}
    const filters = []
    this.filterControls.forEach(filterControl => {
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
