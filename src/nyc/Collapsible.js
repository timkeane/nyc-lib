/**
 * @module nyc/Collapsible
 */

import $ from 'jquery'

import Container from 'nyc/Container'

/**
 * @desc Class for creating collapsible containers
 * @public
 * @class
 * @extends {Container}
 */
class Collapsible extends Container {
  /**
   * @desc Class for creating collapsible containers
   * @public
   * @constructor
   * @param {Collapsible.Options}
   */
  constructor(options) {
    super(options.target)
    this.getContainer().append(Collapsible.HTML)
    /**
     * @private
     * @member {jQuery}
     */
    this.btn = this.getElem('h3')
      .append(options.title)
      .click($.proxy(this.toggle, this))

    /**
     * @private
     * @member {jQuery}
     */
    this.content = this.getElem('.content').append($(options.content))
    if (options.expanded === false) {
      this.toggle()
    }
  }
  /**
   * @desc Toggle the expanded state of the container
   * @public
   * @method
   */
  toggle() {
    const collapsed = !this.content.is(':visible')
    const btn = this.btn
    if (collapsed) {
      this.content.slideDown(() => {
        btn.addClass('rad-top')
      })
    } else {
      this.content.slideUp(() => {
        btn.removeClass('rad-top')
      })
    }
    this.getElem('h3 button').toggleClass('expd')
  }
}

/**
 * @desc Object constructor options for {@see Collapsible}
 * @public
 * @typedef {Object}
 * @property {JQuery|Element|string} target The target element for the collapsible container
 * @property {JQuery|Element|string} title The title for the collapsible container
 * @property {JQuery|Element|string=} content The content for the body of the collapsible container
 * @property {boolean} [expanded=true] The starting state of the collapsible container
 */
Collapsible.Options
/**
 * @private
 * @const
 * @type {string}
 */
Collapsible.HTML = '<div class="clps rad-all">' +
  '<h3 class="btn rad-all">' +
    '<button class="btn-rnd">' +
      '<span class="screen-reader-only">show/hide</span>' +
    '</button>' +
  '</h3>' +
  '<div class="content rad-bot"></div>' +
'</div>'

export default Collapsible
