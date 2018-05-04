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
  */
export default class Container extends EventHandling {
  /**
   * @desc  Create an instance of Container
   * @access protected
   * @constructor
   * @param {JQuery|Element|string} container The container node
   */
  constructor(container) {
    super()
    this.container = $(container)
  }
  /**
	 * @desc A method to return a control container HTML element wrapped in a JQuery
	 * @public
	 * @method
	 * @return {JQuery} The the control container HTML element wrapped in a JQuery
	 */
	getContainer() {
    return this.container
	}
	/**
	 * @desc A method to return an element in the container
	 * @public
	 * @abstract
	 * @method
	 * @return {JQuery} The element
	 */
	getElem(selector) {
		return this.getContainer().find(selector)
	}
}
