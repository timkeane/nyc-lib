/**
 * @module nyc/ItemPager
 */

import $ from 'jquery'

import nyc from 'nyc/nyc'
import Container from 'nyc/Container'

/**
 * @desc A class to generate legend HTML
 * @public
 * @class
 * @extends {Container}
 */
class ItemPager extends Container {
  /**
   * @desc A class to generate legend HTML
   * @public
   * @constructor
   * @param {ItemPager.Options} options The constructor options
   */
  constructor(options) {
    super($(ItemPager.HTML))
    options = options || {}
    $(options.target).append(this.getContainer())
    /**
     * @private
     * @member {JQuery}
     */
    this.current = this.find('.current')
    /**
     * @private
     * @member {JQuery}
     */
    this.total = this.find('.total')
    /**
     * @private
     * @member {JQuery}
     */
    this.currentItem = this.find('.it')
    /**
     * @private
     * @member {JQuery}
     */
    this.btns = this.find('.btns')
    /**
     * @private
     * @member {Array<Object>}
     */
    this.items = null
    this.find('.btn-nxt, .btn-prv').click($.proxy(this.navigate, this))
    if (options.items) this.show(options.items)
  }
  /**
   * @public
   * @method
   * @param {Array<Object>} items The items
   */
  show(items) {
    this.items = items
    this.btns[items.length > 1 ? 'show' : 'hide']()
    this.current.data('current', 0).html(1)
    this.total.html(items.length)
    this.currentItem.html(items.length ? nyc.html(items[0]) : '')
    this.trigger('change', this)
  }
  /**
   * @private
   * @method
   * @param {JQuery.Event} event
   */
  navigate(event) {
    const incr = $(event.target).data('incr') - 0;
    const idx = this.current.data('current') - 0 + incr;
    if (idx >= 0 && idx < this.items.length){
      this.current.data('current', idx).html(idx + 1);
      this.currentItem.html(nyc.html(this.items[idx]))
      this.feature = this.items[idx]
      this.trigger('change', this)
    }
  }
}

/**
 * @desc Options for ListPager constructor
 * @public
 * @typedef {Object}
 * @property {JQuery|Element|string=} target The DOM node in which to create the ListPager
 * @param {Array<Object>=} items The items to page through
 */
ItemPager.Options

ItemPager.HTML = '<div class="it-pg">' +
  '<div class="it"></div>' +
  '<div class="btns">' +
    '<button class="btn-rnd btn-prv" data-incr="-1"><span class="screen-reader-only">Previous</span></button>' +
    '<span class="current"></span> of <span class="total"></span>' +
    '<button class="btn-rnd btn-nxt" data-incr="1"><span class="screen-reader-only">Next</span></button>' +
  '</div>' +
'</div>'

export default ItemPager
