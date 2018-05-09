/**
 * @module nyc/ListPager
 */

import $ from 'jquery'

import Container from 'nyc/Container'

/**
 * @desc A class to generate legend HTML
 * @public
 * @class
 * @extends {nyc.ReplaceTokens}
 * @constructor
 * @param {ListPager.Options} options The constructor options
 */
class ListPager extends Container {
  constructor(options) {
    super(options.target)
    this.getContainer().addClass('lst-pg')
    this.getContainer().append($(ListPager.HTML))
    /**
     * @private
     * @member {Array<ListPager.Item>}
     */
    this.items = options.items || []
    /**
     * @private
     * @member {JQuery}
     */
    this.list = this.find('.list')
    /**
     * @private
     * @member {number}
     */
    this.index = 0
    /**
     * @private
     * @member {number}
     */
    this.pageSize = options.pageSize || 10
    /**
     * @private
     * @member {JQuery}
     */
    this.moreBtn = this.find('button').click($.proxy(this.more, this))
    this.reset(this.items)
  }
	/**
	 * @desc Resets the pager with a new items
	 * @public
	 * @method
	 * @param {Array<ListPager.Item>=} items The items to page through
	 */
	reset(items) {
    this.list.empty()
    this.items = items
    this.index = 0
    this.moreBtn.fadeIn()
    this.next()
	}
	/**
	 * @desc Returns next page from the items
	 * @public
	 * @method
	 * @param {number} [pageSize=10] The length of the items for the next page
	 * @return {Array<ListPager.Item>} List of items on the next page
	 */
	next(pageSize) {
    pageSize = pageSize || this.pageSize
    const result = this.items.slice(this.index, this.index + pageSize)
    this.index = this.index + pageSize
    if (this.index >= this.items.length - 1) {
      this.moreBtn.fadeOut()
    }
    this.render(result)
    return result
  }
	/**
	 * @desc Returns next page from the items
	 * @public
	 * @method
	 * @param {Array<ListPager.Item>} items List of items
	 */
	render(items) {
    items.forEach(item => {
      const div = $('<div class="lst-item"></div>').append(item.html())
      this.list.append(div)
    })
  }
  more() {
    this.next()
  }
}

/**
 * @desc Options for ListPager constructor
 * @public
 * @typedef {ListPager.Item}
 * @property {JQuery|Element|string} target The DOM node in which to create the ListPager
 * @param {Array<ListPager.Item>=} items The items to page through
 * @param {number} [pageSize=10] The number of items per page
 */
ListPager.Options

/**
 * @desc ListPager.Item type
 * @public
 * @typedef {ListPager.Item}
 * @property {function()} html The renderinf function for the item
 */
ListPager.Item

/**
 * @private
 * @const
 * @type {string}
 */
ListPager.HTML = '<div class="list" role="list"></div><button class="btn rad-all">More...</button>'

export default ListPager
