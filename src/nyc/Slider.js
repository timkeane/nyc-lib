/**
 * @module nyc/Slider
 */

import $ from 'jquery'

import nyc from 'nyc'
import Container from 'nyc/Container'

/**
 * @desc  A class to provide a numeric slider
 * @public
 * @class
 * @extends module:nyc/Container~Container
 * @fires module:nyc/Slider~Slider#change
 */
class Slider extends Container {
  /**
   * @desc  Create an instance of Slider
   * @constructor
   * @param {module:nyc/Slider~Slider.Options} options Constructor options
   */
  constructor(options) {
    super(options.target)
    let units = options.units
    const id = nyc.nextId('slider')
    const label = $('<label></label>')
      .html(options.label || '')
      .attr('for', id)
    this.text = $('<input type="text" class="rad-all">')
      .attr('value', options.value || options.min)
      .change($.proxy(this.change, this))
      .keydown($.proxy(this.key, this))
      .focus(event => $(event.target).select())
    this.range = $('<input type="range">').attr({
      id: id,
      min: options.min,
      max: options.max,
      step: options.step || 1,
      value: this.text.val()
    }).change($.proxy(this.change, this))
    units = units ? $(`<span>${units}</span>`) : undefined
    this.append(label)
      .append(this.text)
      .append(units)
      .append(this.range)
      .addClass('sld')
  }
  /**
   * @desc Get or set the input value
   * @param {number=} value The value of the slider input value
   * @return {string|JQuery} Returns the slider jQuery input element or its value
   */
  val(value) {
    if (typeof value === 'undefined') {
      return this.range.val() * 1
    }
    this.range.val(value)
    this.text.val(value)
    return this
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event The event object
   * @return {boolean} Is the key a bad key?
   */
  badKey(event) {
    const key = event.keyCode
    return (key < 96 || key > 105) && /* not a number from num keypad with num lock on */
      ($.inArray(key, [8, 9, 37, 38, 39, 40, 46]) === -1 && /* not backspace, tab, arrows or delete */
      isNaN(String.fromCharCode(event.which || key))) /* not a number */
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event The event object
   */
  key(event) {
    if (this.badKey(event)) {
      event.preventDefault()
    } else {
      if (event.keyCode === 38) {
        this.val((this.val() * 1) + (this.range.attr('step') * 1))
      } else if (event.keyCode === 40) {
        this.val(this.val() - this.range.attr('step'))
      } else if (event.keyCode === 13) {
        this.val(this.text.val())
        this.change()
      }
    }
  }
  /**
   * @private
   * @method
   */
  change() {
    this.text.val(this.range.val())
    this.trigger('change', this)
  }
}

/**
 * @desc The change event
 * @event module:nyc/Slider~Slider#change
 * @type {module:nyc/Slider~Slider}
 */

/**
 * @desc Constructor options for {@link module:nyc/Slider~Slider}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} target The target DOM node for creating the slider control
 * @property {number} min The minimum value
 * @property {number} max The maximum value
 * @property {number} [step=1] The step value
 * @property {number=} value The value
 * @property {string=} units The units
 * @property {string=} label The label
 */
Slider.Options;

export default Slider
