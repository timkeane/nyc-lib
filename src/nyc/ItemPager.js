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
 * @extends {nyc.ReplaceTokens}
 * @constructor
 * @param {ItemPager.Options} options The constructor options
 */
class ItemPager extends Container {
  constructor(options) {
    super($(ItemPager.HTML))
    options = options || {}
    $(options.target).append(this.getContainer())
    this.current = this.find('.current')
    this.total = this.find('.total')
    this.currentItem = this.find('.it')
    this.btns = this.find('.btns')
    this.find('.btn-nxt, .btn-prv').click($.proxy(this.navigate, this))
  }
  show(items) {
    this.items = items
    this.btns[items.length > 1 ? 'show' : 'hide']()
    this.current.data('current', 0).html(1)
    this.total.html(items.length)
    this.currentItem.html(nyc.html(items[0]))
    this.trigger('change', this)
  }
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

ItemPager.HTML = '<div class="it-pg">' +
  '<div class="it"></div>' +
  '<div class="btns">' +
    '<button class="btn-rnd btn-prv" data-incr="-1"><span class="screen-reader-only">Previous</span></button>' +
    '<span class="current"></span> of <span class="total"></span>' +
    '<button class="btn-rnd btn-nxt" data-incr="1"><span class="screen-reader-only">Next</span></button>' +
  '</div>' +
'</div>'

export default ItemPager
