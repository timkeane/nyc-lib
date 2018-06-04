/**
 * @module nyc/Choice
 */

import $ from 'jquery'

import nyc from 'nyc/nyc'
import Container from 'nyc/Container'

/**
 * @desc Class for creating collapsible containers
 * @public
 * @class
 * @extends {module:nyc/Container~Container}
 * @fires module:nyc/Choice~Choice#change
 */
class Choice extends Container {
  /**
   * @desc Create an instance of Choice
   * @public
   * @constructor
   * @param {module:nyc/Choice~Choice.Options}
   */
  constructor(options) {
    super(options.target)
    this.getContainer().addClass('chc rad-all')
    /**
     * @private
     * @member {boolean}
     */
    this.radio = options.radio
    /**
     * @private
     * @member {Array<JQuery>}
     */
    this.inputs = null
    /**
     * @private
     * @member {Array<module:nyc/Choice~Choice.Choice>}
     */
    this.choices = options.choices
    this.setChoices(this.choices)
  }
  /**
   * @desc Set the available choices
   * @public
   * @method
   * @param {Array<module:nyc/Choice~Choice.Choice>} choices The choices
   */
  setChoices(choices) {
    this.getContainer().empty()
    if (this.radio) this.getContainer().attr('role', 'radiogroup')
    choices.forEach((choice, i) => {
      const div = $(Choice.HTML)
      const id = nyc.nextId('chc-chc')
      const input = div.find('input')
      div.addClass(this.radio ? `${choice.name}-${i}` : choice.name)
      input.attr('id', id)
        .attr('name', choice.name)
        .attr('type', this.radio ? 'radio' : 'checkbox')
        .prop('checked', choice.checked)
        .data('choice', choice)
        .change($.proxy(this.change, this))
      div.find('label').html(choice.label)
        .attr('for', id)
      this.append(div)
      this.extend(choice)
    })
    this.inputs = this.find('input')
  }
  /**
   * @desc Get or set the seleced choices
   * @public
   * @method
   * @param {Array<module:nyc/Choice~Choice.Choice>} choices The choices
   */
  val(choices) {
    if (choices) {
      $.each(this.inputs, (_, input) => {
        $(input).prop('checked', false)
        choices.some(chosen => {
          const choice = $(input).data('choice')
          if (chosen.eq(choice)) {
            $(input).prop('checked', true)
            return true
          }
        })
      })
      return this.val()
    } else {
      const chosen = []
      $.each(this.inputs, (_, input) => {
        if ($(input).prop('checked')) {
          chosen.push($(input).data('choice'))
        }
      })
      return chosen
    }
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event
   */
  change(event) {
    this.trigger('change', this)
  }
  /**
   * @private
   * @method
   * @param {module:nyc/Choice~Choice.Choice}
   */
  extend(choice) {
    $.extend(choice, {
      eq(another) {
        return this.name === another.name &&
          this.label === another.label &&
          JSON.stringify(this.value) === JSON.stringify(another.value)
      }
    })
  }
}

/**
 * @desc A choice for {@link module:nyc/Choice~Choice}
 * @public
 * @typedef {Object}
 * @property {string} name The name for the choice
 * @property {string} label The label for the choice
 * @property {Array<module:nyc/Choice~Choice.Choice>} value The value of the choice
 * @property {boolean} [checked=false] The value of the checked state of the choice
 */
Choice.Choice;

/**
 * @desc Constructor options for {@link module:nyc/Choice~Choice}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} target The target DOM node for creating the choice control
 * @property {Array<module:nyc/Choice~Choice.Choice>} choices The choices
 * @property {boolean} [radio=false] Checkbox or radio button
 */
Choice.Options;

/**
 * @desc The change event
 * @event module:nyc/Choice~Choice#change
 * @type {module:nyc/Choice~Choice}
 */

 /**
  * @private
  * @const
  * @type {string}
  */
Choice.HTML = '<div class="chc-chc"><input><label></label></div>'

export default Choice
