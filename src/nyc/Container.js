/**
 * @module nyc/Container
 */

import $ from 'jquery'

import EventHandling from 'nyc/EventHandling'

/**
  * @desc  An abstract class for accessing a control container and elements within it
  * @public
  * @abstract
  * @class
	* @extends module:nyc/EventHandling~EventHandling
  */
class Container extends EventHandling {
  /**
   * @desc Create an instance of Container
   * @access protected
   * @constructor
   * @param {jQuery|Element|string} container The container node
   */
  constructor(container) {
    super()
    this.container = $(container)
  }
  /**
	 * @desc A method to return a control container HTML element wrapped in a JQuery
	 * @public
	 * @method
	 * @return {jQuery} The the control container HTML element wrapped in a JQuery
	 */
  getContainer() {
    return this.container
  }
  /**
	 * @desc A method to return elements in the container
	 * @public
	 * @method
	 * @param {string} selector jQuery selector
	 * @return {jQuery} The element
	 */
  find(selector) {
    return this.getContainer().find(selector)
  }
  /**
	 * @desc A method to prepend elements to the container
	 * @public
	 * @method
	 * @param {jQuery|Element|Array<Element>|string} elements The element to append
	 * @return {jQuery} The container
	 */
  prepend(elements) {
    return this.getContainer().prepend($(elements))
  }
  /**
	 * @desc A method to append elements to the container
	 * @public
	 * @method
	 * @param {jQuery|Element|Array<Element>|string} elements The element to append
	 * @return {jQuery} The container
	 */
  append(elements) {
    return this.getContainer().append($(elements))
  }
}

export default Container
