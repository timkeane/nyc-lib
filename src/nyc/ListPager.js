/**
 * @module nyc/ListPager
 */

import $ from 'jquery'

import Container from 'nyc/Container'

/**
 * @desc A class to page through sub-lists of a list of objects rendered as HTML
 * @public
 * @class
 * @extends module:nyc/Container~Container
 */
class ListPager extends Container {
  /**
   * @desc Create an instance of ListPager
   * @public
   * @constructor
   * @param {module:nyc/ListPager~ListPager.Options} options Constructor options
   */
  constructor(options) {
    super(options.target)
    this.getContainer().addClass('lst-pg').append($(ListPager.HTML))
    /**
     * @private
     * @member {Array<ListPager.Item>}
     */
    this.items = options.items || []
    /**
     * @private
     * @member {jQuery}
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
     * @member {jQuery}
     */
    this.moreBtn = this.find('button').click($.proxy(this.more, this))
    this.reset(this.items)
  }
	/**
	 * @desc Resets the pager with new items and show the first page
	 * @public
	 * @method
	 * @param {Array<module:nyc/ListPager~ListPager.Item>=} items The items to page through
	 */
	reset(items) {
    this.list.empty()
    this.items = items
    this.index = 0
    this.moreBtn.fadeIn()
    this.next()
	}
	/**
	 * @desc Renders and returns next page of items
	 * @public
	 * @method
	 * @param {number} [pageSize=10] The length of the items for the next page
	 * @return {Array<module:nyc/ListPager~ListPager.Item>} List of items on the next page
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
	 * @private
	 * @method
	 * @param {Array<module:nyc/ListPager~ListPager.Item>} items List of items
	 */
	render(items) {
    items.forEach(item => {
      this.list.append(
        $('<div class="lst-it" role="listitem"></div>').append(item.html())
      )
    })
  }
  /**
	 * @private
	 * @method
   */
  more() {
    this.next()
  }
}

/**
 * @desc Constructor options for {@link module:nyc/ListPager~ListPager}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} target The DOM node in which to create the ListPager
 * @param {Array<ListPager.Item>=} items The items to page through
 * @param {number} [pageSize=10] The number of items per page
 */
ListPager.Options

/**
 * @desc ListPager.Item type
 * @public
 * @typedef {module:nyc/ListPager~ListPager.Item}
 * @property {function()} html The rendering function for the item
 */
ListPager.Item

/**
 * @private
 * @const
 * @type {string}
 */
ListPager.HTML = '<div class="list" role="list"></div><button class="btn rad-all btn-more">More...</button>'

export default ListPager
