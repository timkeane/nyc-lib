/**
 * @module nyc/AutoComplete
 */

import $ from 'jquery'

/**
 * @desc A class to provide fitering functionality for autocomplete
 * @public
 * @class
 */
class AutoComplete {
  /**
   * @desc Find matching li elements from inUl and move them to outUl
   * @public
   * @method
   * @param {jQuery|Element|string} inUl The ul element to search
   * @param {jQuery|Element|string} outUl The ul element to receive results
   * @param {string} typed The text for searching
   */
  filter(inUl, outUl, typed) {
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
   * @private
   * @method
   * @param {Object<string,RegExp>} matchers Matchers
   * @param {jQuery|string|number} item Item
   * @param {Object<string,Array<JQuery|string|number>>} filtered Filtered
   * @param {boolean} long If true use exact test
   */
  test(matchers, item, filtered, long) {
    const text = item.html()
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
   * @param {string} typed Typed string
   * @return {Object<string,RegExp>} Exact and possible regexes
   */
  regexp(typed) {
    const possibleMatch = new String(typed.replace(/[^a-zA-Z0-9]/g, ''))
    const exactMatch = new String(typed.replace(/[^a-zA-Z0-9 ]/g, ''))
    let possible = '^'
    for (let i = 0; i < possibleMatch.length; i++) {
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

export default AutoComplete
