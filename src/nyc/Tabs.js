/**
 * @module nyc/Tabs
 */

import $ from 'jquery'

import Container from 'nyc/Container'

 /**
  * @desc  A class for creating and managing tabs
  * @public
  * @class
  */
class Tabs extends Container {
  /**
	 * @desc  Creates an instance of Tabs
	 * @constructor
	 * @param {Tabs.Options} options Constructor options
	 */
  constructor(options) {
    super(options.target)
    const tabs = options.tabs
    this.getContainer().append($(Tabs.HTML)).addClass('tabs')
    this.btns = this.find('.btns')
    this.tabs = this.find('.container')
    /**
     * @public
     * @member {JQuery}
     */
    this.active = null
    const width = Math.floor(100 / tabs.length)
    let consumedWidth = 0
    tabs.forEach((tab, i) => {
      const tb = $(tab.tab).addClass('tab')
      const btn = $(`<h3 class="btn" aria-role="button">${tab.title}</h3>`)
        .css('width', `${width}%`)
        .data('tab', tb)
        .click($.proxy(this.btnClick, this))
      tb.data('btn', btn)
      if (i === 0 || tab.active) {
        this.open(tb)
      }
      if (i === tabs.length - 1) {
        btn.css('width', `calc(${100 - consumedWidth}% - ${tabs.length - 1}px)`)
      }
      this.btns.append(btn)
      this.tabs.append(tb)
      consumedWidth = consumedWidth + width
    })
    /**
     * @private
     * @member {JQuery}
     */
    this.ready = true
  }
  /**
   * @public
   * @method
   * @param {JQuery|Element|string} tab
   */
  open(tab) {
    tab = $(tab)
    this.find('.btns h3, .tab').removeClass('active')
    tab.addClass('active')
    tab.data('btn').addClass('active')
    this.active = tab
    if (this.ready) this.trigger('change', this)
  }
  /**
   * @private
   * @method
   * @param {JQuery.Event} event
   */
  btnClick(event) {
    this.open($(event.target).data('tab'))
  }
}

/**
 * @desc Object type to hold contructor options for Tabs
 * @public
 * @typedef {Object}
 * @property {JQuery|Element|string} target The target DOM node for Tabs
 * @property {Array<Tabs.Tab>} tabs The tabs
 */
Tabs.Options

/**
 * @desc Object type to hold a tab definition
 * @public
 * @typedef {Object}
 * @property {string} title The tab title
 * @property {JQuery|Element|string} tab The target DOM node for tab
 * @property {boolean} [active=false] Active state of the tab
 */
Tabs.Tab

/**
 * @private
 * @const
 * @type {string}
 */
Tabs.HTML = '<div class="btns"></div><div class="container"></div>'

export default Tabs
