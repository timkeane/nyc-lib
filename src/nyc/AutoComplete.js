/**
 * @module nyc/AutoComplete
 */

import $ from 'jquery'

/**
 * @desc A class to provide fitering functionality for autocomplete
 * @public
 * @class
 */
export default class AutoComplete {
  /**
   * @desc Find matching li elements from inUl and move them to outUl
   * @public
   * @method
   * @param {JQuery|Element} inUl The ul element to search
   * @param {JQuery|Element} outUl The ul element to receive results
   * @param {string} type The text for searching
   */
  filterUl(inUl, outUl, typed) {
    const long = typed.length > 3
    const veryLong = typed.length > 6
    const filtered = {exact: [], possible: []}
    const matchers = this.regexp(typed)
    const all = []
    const test = this.test
    $.merge($(outUl).find('li'), $(inUl).find('li')).each((_, li) => {
      all.push($(li))
      test(matchers, $(li), filtered, long, this.log)
    })
    $(inUl).append(all)
    if (filtered.exact.length) {
      $(outUl).prepend(filtered.exact)
    } else if (!veryLong) {
      $(outUl).prepend(filtered.possible)
    }
  }
  /**
   * @desc Find matching text in an array
   * @public
   * @method
   * @param {Array<string|number>} list The array to search
   * @param {string} type The text for searching
   * @return {Array<string|number>} The search result
   */
  filter(list, typed) {
    const long = typed.length > 3
    const filtered = {exact: [], possible: []}
    const matchers = this.regexp(typed)
    list.forEach(item => {
      this.test(matchers, item, filtered, long)
    })
    return filtered.exact.length ? filtered.exact : filtered.possible
  }
  /**
   * @private
   * @method
   * @param {Object<string,RegExp>} matchers
   * @param {JQuery|string|number} item
   * @param {Object<string,Array<JQuery|string|number>>} filtered
   * @param {boolean} long
   */
  test(matchers, item, filtered, long, log) {
    const text = item instanceof $ ? item.html() : `${item}`
    if (long) {
      if (matchers.exact.test(text)) {
        filtered.exact.push(item)
      }
    }
    if (matchers.possible.test(text)) {
      filtered.possible.push(item)
    }
  }
  /**
   * @private
   * @method
   * @param {string} typed
   * @returns {Object<string,RegExp>}
   */
  regexp(typed) {
    const possibleMatch = new String(typed.replace(/[^a-zA-Z0-9]/g, ''))
    const exactMatch = new String(typed.replace(/[^a-zA-Z0-9 ]/g, ''))
    let possible = '^'
    for (let i =0; i < possibleMatch.length; i++) {
      possible += `(?=.*${possibleMatch.charAt(i)})|`
    }
    possible = possible.substr(0, possible.length - 1)
    possible += '.*$'
    return {
      exact: new RegExp(`(${exactMatch})`, 'i'),
      possible: new RegExp(possible, 'i')
    }
  }
}
