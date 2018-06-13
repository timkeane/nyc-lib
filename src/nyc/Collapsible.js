/**
 * @module nyc/Collapsible
 */

import $ from 'jquery'

import nyc from 'nyc'
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
    const id = nyc.nextId('clsp-lbl')
    /**
     * @private
     * @member {jQuery}
     */
    this.btn = this.find('h3')
      .attr('id', id)
      .append(options.title)
      .click($.proxy(this.toggle, this))

    /**
     * @private
     * @member {jQuery}
     */
    this.content = this.find('.content').append($(options.content))
      .attr('aria-labelledby', id)
    if (options.collapsed) {
      this.content.hide()
      this.btn.removeClass('rad-top')
      this.find('h3 button').attr('aria-collapsed', true)
        .attr('aria-expanded', false)
        .addClass('expd')
    } else {
      this.find('h3 button').attr('aria-collapsed', false)
        .attr('aria-expanded', true)
    }
  }
  /**
   * @desc Toggle the expanded state of the container
   * @public
   * @method
   */
  toggle() {
    const collapsed = this.content.css('display') === 'none'
    const btn = this.find('h3 button')
    const me = this
    if (collapsed) {
      this.content.slideDown(() => {
        me.btn.addClass('rad-top')
        me.trigger('change', me)
      })
    } else {
      this.content.slideUp(() => {
        me.btn.removeClass('rad-top')
        me.trigger('change', me)
      })
    }
    btn.toggleClass('expd')
      .attr('aria-collapsed', !collapsed)
      .attr('aria-expanded', collapsed)
  }
}

/**
 * @desc Constructor options for {@link module:nyc/Collapsible~Collapsible}
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
    '<button class="btn-rnd"></button>' +
  '</h3>' +
  '<div class="content rad-bot"></div>' +
'</div>'

export default Collapsible
