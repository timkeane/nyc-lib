/**
 * @module nyc/ItemPager
 */

import $ from 'jquery'

import nyc from 'nyc'
import Container from 'nyc/Container'

/**
 * @desc A class to page through a list of objects rendered as HTML
 * @public
 * @class
 * @extends module:nyc/Container~Container
 * @fires module:nyc/ItemPager~ItemPager#change
 */
class ItemPager extends Container {
  /**
   * @desc Create an instance of ItemPager
   * @public
   * @constructor
   * @param {module:nyc/ItemPager~ItemPager.Options} options Constructor options
   */
  constructor(options) {
    super($(ItemPager.HTML))
    options = options || {}
    $(options.target).append(this.getContainer())
    /**
     * @desc The current item
     * @public
     * @member {Object}
     */
    this.item = null
    /**
     * @private
     * @member {jQuery}
     */
    this.current = this.find('.current')
    /**
     * @private
     * @member {jQuery}
     */
    this.total = this.find('.total')
    /**
     * @private
     * @member {jQuery}
     */
    this.currentItem = this.find('.it')
    /**
     * @private
     * @member {jQuery}
     */
    this.btns = this.find('.btns')
    /**
     * @private
     * @member {Array<Object>}
     */
    this.items = null
    this.find('.btn-nxt, .btn-prv').click($.proxy(this.navigate, this))
    if (options.items) {
      this.show(options.items)
    }
  }
  /**
   * @desc Set the items and show the first item
   * @public
   * @method
   * @param {Array<Object>} items The items
   */
  show(items) {
    this.items = items
    this.item = items[0]
    this.btns[items.length > 1 ? 'show' : 'hide']()
    this.current.data('current', 0).html(1)
    this.total.html(items.length)
    this.currentItem.html(items.length ? nyc.html(items[0]) : '')
    this.trigger('change', this)
  }
  /**
   * @private
   * @method
   * @param {jQuery.Event} event Event object
   */
  navigate(event) {
    const incr = $(event.currentTarget).data('incr') - 0;
    const idx = this.current.data('current') - 0 + incr;
    if (idx >= 0 && idx < this.items.length) {
      this.current.data('current', idx).html(idx + 1);
      this.currentItem.html(nyc.html(this.items[idx]))
      this.item = this.items[idx]
      this.trigger('change', this)
    }
  }
}

/**
 * @desc The change event
 * @event module:nyc/ItemPager~ItemPager#change
 * @type {module:nyc/ItemPager~ItemPager}
 */

/**
 * @desc Construtor options for {@link module:nyc/ItemPager~ItemPager}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string=} target The DOM node in which to create the ItemPager
 * @param {Array<Object>=} items The items to page through
 */
ItemPager.Options

ItemPager.HTML = '<div class="it-pg">' +
  '<div class="it"></div>' +
  '<div class="btns">' +
    '<button class="btn btn-rnd btn-prv" data-incr="-1">' +
      '<span class="screen-reader-only">Previous</span>' +
      '<span class="fas fa-arrow-left" role="img"></span>' +
      '</button>' +
    '<span class="current"></span> of <span class="total"></span>' +
    '<button class="btn btn-rnd btn-nxt" data-incr="1">' +
      '<span class="screen-reader-only">Next</span>' +
      '<span class="fas fa-arrow-right" role="img"></span>' +
      '</button>' +
  '</div>' +
'</div>'

export default ItemPager
