/**
 * @module nyc/ol/Filters
 */

import $ from 'jquery'

import nyc from '../index'
import Container from '../Container'
import Collapsible from '../Collapsible'
import Choice from '../Choice'
import ToggleSwitch from '../ToggleSwitch'

/**
 * @desc Class for managing controls for filtering a {@link module:nyc/ol/source/FilterAndSort~FilterAndSort} vector data source
 * @public
 * @class
 * @extends module:nyc/Container~Container
 */
class Filters extends Container {
  /**
   * @desc Create an instance of Filters
   * @public
   * @constructor
   * @param {module:nyc/ol/Filters~Filters.Options} options Options
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
     * @member {module:nyc/ol/source/FilterAndSort~FilterAndSort}
     */
    this.source = options.source
    options.choiceOptions.forEach(choiceOptions => {
      const target = $(`<div class="${nyc.nextId('filter')}"></div>`)
      choiceOptions.target = choiceOptions.target || $(`<div class="${nyc.nextId('filter-chc')}"></div>`)
      this.append($(target))
      let choice
      if (choiceOptions.toggle === true) {
        choice = new ToggleSwitch(choiceOptions)
      } else {
        choice = new Choice(choiceOptions)
      }
      // TODO check if this is needed
      new Collapsible({
        target: target,
        title: choiceOptions.title,
        content: choice.getContainer()
      })
      choice.on('change', $.proxy(this.filter, this))
      this.choiceControls.push(choice)
    })
  }
  /**
   * @desc Filter the source according to current state of choices
   * @public
   * @method
   */
  filter() {
    this.source.filter(this.getFilters())
    this.trigger('change', this)
  }
  /**
   * @desc Get the filters
   * @public
   * @method
   * @return {Array<module:nyc/ol/source/FilterAndSort~FilterAndSort.Filter>} The filters
   */
  getFilters() {
    const allFilters = []
    this.choiceControls.forEach((filterControl, i) => {
      const namedFilters = {}
      const filters = []
      filterControl.val().forEach(choice => {
        const filter = namedFilters[choice.name] || []
        namedFilters[choice.name] = filter.concat(choice.values)
      })
      Object.keys(namedFilters).forEach(name => {
        filters.push({property: name, values: nyc.removeDups(namedFilters[name])})
      })
      if (filters.length) {
        allFilters.push(filters)
      }
    })
    return allFilters
  }
}

/**
 * @desc Constructor options for {@link module:nyc/ol/Filters~Filters}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} target The DOM node in which to create the Filters
 * @property {Array<module:nyc/ol/Filters~Filters.ChoiceOptions>} choiceOptions The filter choices
 * @property {module:nyc/ol/source/FilterAndSort~FilterAndSort} source The source to filter
 */
Filters.Options

/**
 * @desc Object type to hold choice options
 * @public
 * @typedef {Object}
 * @property {string} title
 * @property {Array<module:nyc/Choice~Choice.Options>} choiceOptions
 */
Filters.ChoiceOptions

export default Filters
