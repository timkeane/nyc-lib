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
   * @param {module:nyc/Collapsible~Collapsible.Options} options Collapsible options
   */
  constructor(options) {
    super(options.target)
    const collapsible = $(Collapsible.HTML)
    const btnId = nyc.nextId('clsp-btn')
    const pnlId = nyc.nextId('clsp-pnl')
    collapsible.find('.content').hide()
    this.getContainer().append(collapsible)
    /**
     * @private
     * @member {jQuery}
     */
    this.btn = this.find('button')
      .attr({id: btnId, 'aria-controls': pnlId})
      .append(options.title)
      .click($.proxy(this.toggle, this))
    /**
     * @private
     * @member {jQuery}
     */
    this.content = this.find('.content').append($(options.content))
      .attr({id: pnlId, 'aria-labelledby': btnId})
    if (!options.collapsed) {
      this.toggle()
    }
  }
  /**
   * @desc Toggle the expanded state of the container
   * @public
   * @method
   */
  toggle() {
    const collapsed = this.content.css('display') === 'none'
    const me = this
    const callback = () => {
      me.trigger('change', me)
    }
    this.btn.toggleClass('rad-all')
      .toggleClass('rad-top')
      .attr('aria-pressed', collapsed)
    this.content.attr({
      'aria-hidden': !collapsed,
      'aria-collapsed': !collapsed,
      'aria-expanded': collapsed
    })[collapsed ? 'slideDown' : 'slideUp'](callback)
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
  '<button class="btn rad-all" aria-pressed="false"></button>' +
  '<div class="content rad-bot" aria-expanded="false" aria-collapsed="true" aria-hidden="true"></div>' +
'</div>'

export default Collapsible
