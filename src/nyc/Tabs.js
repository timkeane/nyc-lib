/**
 * @module nyc/Tabs
 */

import $ from 'jquery'

import nyc from 'nyc'
import Container from 'nyc/Container'

 /**
  * @desc  A class for creating and managing tabs
  * @public
  * @class
  * @extends module:nyc/Container~Container
  */
class Tabs extends Container {
  /**
	 * @desc Create an instance of Tabs
	 * @constructor
	 * @param {module:nyc/Tabs~Tabs.Options} options Constructor options
	 */
  constructor(options) {
    super(options.target)
    this.getContainer().append($(Tabs.HTML)).addClass('tabs')
    this.btns = this.find('.btns')
    this.tabs = this.find('.container')
    /**
     * @desc The active tab
     * @public
     * @member {jQuery}
     */
    this.active = null
    /**
     * @private
     * @member {jQuery}
     */
    this.ready = false
    this.render(options.tabs)
  }
  /**
   * @desc Open a tab
   * @public
   * @method
   * @param {jQuery|Element|string} tab
   */
  open(tab) {
    tab = this.find(tab)
    this.find('.tab')
      .attr('aria-hidden', true)
      .removeClass('active')
      .attr('aria-selected', false)
    this.btns.find('.btn')
      .removeClass('active')
      .attr('aria-pressed', false)
    tab.addClass('active')
    .attr('aria-selected', true)
    .attr('aria-hidden', false)
      .attr('tabindex', 1000)
      .focus()
    tab.data('btn').addClass('active')
    .attr('aria-pressed', true)
    this.active = tab
    this.trigger('change', this)
  }
  /**
   * @private
   * @method
   * @param {Array<module:nyc/Tabs~Tabs.Tab>} tabs The tabs
   */
render(tabs){
    let opened = false
    tabs.forEach((tab, i) => {
      const btnId = nyc.nextId('tab-btn')
      const tb = $(tab.tab)
        .addClass(`tab tab-${i}`)
        .attr('aria-labelledby', btnId)
        .attr('role', 'tabpanel')
        .attr('aria-selected', false)
        .attr('aria-hidden', true)
        
      const pnlId = tb.attr('id') || nyc.nextId('tab-pnl')
      tb.attr('id', pnlId)
    
      const btn = $(Tabs.BTN_HTML)
        .attr('id', btnId)
        .attr('aria-controls', pnlId)
        .attr('aria-pressed', false)
        .click($.proxy(this.btnClick, this))
        .addClass(`btn-tab btn-${i}`)
        .data('tab', tb)
        .append(`<a href="#">${tab.title}</a>`)
        
      tb.data('btn', btn)
      this.btns.append(btn)
      this.tabs.append(tb)
      if (tab.active) {
        this.open(tb)
        opened = true
      }
    })
    if (!opened) this.open(tabs[0].tab)
    this.ready = true
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event
   */
  btnClick(event) {
    this.open($(event.currentTarget).data('tab'))
  }
}

/**
 * @desc Contructor options for {@link module:nyc/Tabs~Tabs}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} target The target DOM node for Tabs
 * @property {Array<module:nyc/Tabs~Tabs.Tab>} tabs The tabs
 */
Tabs.Options

/**
 * @desc Object type to hold a tab definition
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} tab The target DOM node for tab
 * @property {string} title The tab title
 * @property {boolean} [active=false] Active state of the tab
 */
Tabs.Tab

/**
 * @private
 * @const
 * @type {string}
 */
Tabs.HTML = '<div class="btns" role="tablist"></div>' +
  '<div class="container"></div>'

/**
 * @private
 * @const
 * @type {string}
 */
Tabs.BTN_HTML = '<h2 class="btn" role="tab"></h2>'

export default Tabs
