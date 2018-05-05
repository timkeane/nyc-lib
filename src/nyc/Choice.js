/**
 * @module nyc/Choice
 */

import $ from 'jquery'

import {nextId} from 'nyc/nyc'
import Container from 'nyc/Container'

/**
 * @desc Class for creating collapsible containers
 * @public
 * @class
 * @extends {Container}
 */
class Choice extends Container {
  /**
   * @desc Class for creating choice control
   * @public
   * @constructor
   * @param {Choice.Options}
   */
  constructor(options) {
    super(options.target)
    this.getContainer().addClass('chc-container rad-all')
    /**
     * @private
     * @member {boolean}
     */
    this.radio = options.radio
    /**
     * @private
     * @member {Array<Choice.Choice>}
     */
    this.choices = this.setChoices(options.choices)
  }
  setChoices(choices) {
    this.choices = choices
    this.getContainer().empty()
    choices.forEach(choice => {
      const div = $(Choice.HTML)
      const id = nyc.nextId('chc')
      const input = div.find('input')
      input.attr('id', id)
        .attr('name', choice.name)
        .attr('type', this.radio ? 'radio' : 'checkbox')
        .prop('checked', choice.checked)
      div.find('label').html(choice.label).attr('for', id)
      this.append(div.data('choice', choice))
    })
  }
}

/**
 * @desc A choice for {@link Choice.Options}
 * @public
 * @typedef {Object}
 * @property {string} name The name for the choice
 * @property {string} label The label for the choice
 * @property {Array<Object>} value The value of the choice
 * @property {boolean} [checked=false] The value of the checked state of the choice
 */
Choice.Choice;

/**
 * @desc Constructor options for {@link Choice}
 * @public
 * @typedef {Object}
 * @property {JQuery|Element|string} target The target DOM node for creating the collapsible choice control
 * @property {Array<Choice.Choice>} choices The choices for the user
 * @property {boolean} [radio=false] Checkbox or radio button
 */
Choice.Options;

/**
 * @desc The change event
 * @event Choice#change
 * @type {Array<Choice.Choice>}
 */

 /**
  * @private
  * @const
  * @type {string}
  */
Choice.HTML = '<div class="chc">' +
  '<div><input></div>' +
  '<div><label></label></div>' +
'</div>'

export default Choice
