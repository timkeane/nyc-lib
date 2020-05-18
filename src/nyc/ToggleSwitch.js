/**
 * @module nyc/ToggleSwitch
 */

import Choice from 'nyc/Choice'

/**
 * @desc Class for creating checkbox and radio input widgets
 * @public
 * @class
 * @extends {module:nyc/Container~Container}
 * @fires module:nyc/Choice~Choice#change
 */
class ToggleSwitch extends Choice {
  /**
   * @desc Create an instance of Choice
   * @public
   * @constructor
   * @param {module:nyc/Choice~Choice.Options} options Choice options
   */
  constructor(options) {
    if (options.choices.length !== 2) {
      throw 'ToggleSwitch can only have 2 choices'
    }
    options.radio = true
    super(options)
    this.getContainer().addClass('tog')
  }
}

export default ToggleSwitch
