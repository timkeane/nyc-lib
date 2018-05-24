/**
 * @module nyc/Collapsible
 */

import $ from 'jquery'
import Container from 'nyc/Container'

/**
 * @desc Class for creating collapsible containers
 * @public
 * @class
 * @extends module:nyc/Container~Container
 */
class Collapsible extends Container {
  /**
   * @desc Create an instance of Collapsible
   * @public
   * @constructor
   * @param {module:nyc/Collapsible~Collapsible.Options}
   */
  constructor(options) {
    super(options.target)
    this.getContainer().append(Collapsible.HTML)
    /**
     * @private
     * @member {jQuery}
     */
    this.btn = this.find('h3')
      .append(options.title)
      .click($.proxy(this.toggle, this))

    /**
     * @private
     * @member {jQuery}
     */
    this.content = this.find('.content').append($(options.content))
    if (options.collapsed) {
      this.content.hide()
      this.btn.removeClass('rad-top')
      this.find('h3 button').addClass('expd')
    }
  }
  /**
   * @desc Toggle the expanded state of the container
   * @public
   * @method
   */
  toggle() {
    const collapsed = this.content.css('display') === 'none'
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
    this.find('h3 button').toggleClass('expd')
  }
}

/**
 * @desc Object constructor options for {@link module:nyc/Collapsible~Collapsible}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} target The target element for the collapsible container
 * @property {jQuery|Element|string} title The title for the collapsible container
 * @property {jQuery|Element|string=} content The content for the body of the collapsible container
 * @property {boolean} [collapsed=false] The starting state of the collapsible container
 */
Collapsible.Options

/**
 * @private
 * @const
 * @type {string}
 */
Collapsible.HTML = '<div class="clps rad-all">' +
  '<h3 class="btn rad-all rad-top" role="button">' +
    '<button class="btn-rnd">' +
      '<span class="screen-reader-only">show/hide</span>' +
    '</button>' +
  '</h3>' +
  '<div class="content rad-bot"></div>' +
'</div>'

export default Collapsible
