/**
 * @module nyc/CtlContainer
 */

 /**
  * @desc  An abstract class for accessing a control container and elements within it
  * @public
  * @abstract
  * @class
  */
export default class CtlContainer extends EventHandling {
  /**
   * @desc  Create an instance of CtlContainer
   * @public
   * @constructor
   */
  constructor() {
    super()
  }
  /**
	 * @desc A method to return a control container HTML element wrapped in a JQuery
	 * @public
	 * @abstract
	 * @method
	 * @return {JQuery} The the control container HTML element wrapped in a JQuery
	 */
	getContainer() {
		throw 'Not implemented'
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
