/**
 * @module nyc
 */

import $ from 'jquery'
import proj4 from 'proj4'

proj4.defs([
  ['EPSG:2263', '+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'],
  ['EPSG:6539', '+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs']
])

/**
  * @desc Top level namespace for NYC mapping
  * @public
  * @namespace
  */
const nyc = {
  /**
   * @desc A proj4 instnce with NYC coordinate systems defined
   * @public
   * @const {proj4}
   */
  proj4: proj4,
  /**
   * @desc Provide inheritance for function-based classes using prototype
   * @public
   * @static
   * @function
   * @param {function} childCtor The constructor of the subclass
   * @param {function} parentCtor The constructor of the superclass
   */
  inherits(childCtor, parentCtor) {
    nyc.copyFromParentProperties(childCtor.prototype, parentCtor.prototype)
  },
  /**
   * @desc Provide for function-based classes to inherit from ES5 and ES6 classes
   * @public
   * @static
   * @function
   * @param {Object} childObj An instance of the subclass
   * @param {Object} parentObj An instance of the superclass
   */
  subclass(childObj, parentObj) {
    const parentProto = Object.getPrototypeOf(parentObj)
    nyc.copyFromParentProperties(childObj, parentProto)
    nyc.copyFromParentKeys(childObj, parentObj)
  },
  /**
   * @desc Provide mixin functionality
   * @public
   * @static
   * @function
   * @param {Object} obj The target of the mixins
   * @param {Array<Object>} mixins An array of mixin objects - last in wins
   */
  mixin(obj, mixins) {
    mixins.forEach(mixin => {
      $.extend(obj, mixin)
    })
  },
  /**
   * @private
   * @static
   * @function
   * @param {Object} childObj Child object
   * @param {Object} parentObj Parent object
   */
  copyFromParentProperties(childObj, parentObj) {
    Object.getOwnPropertyNames(parentObj).forEach(member => {
      if (!(member in childObj)) {
        childObj[member] = parentObj[member]
      }
    })
  },
  /**
   * @private
   * @static
   * @function
   * @param {Object} childObj Child object
   * @param {Object} parentObj Parent object
   */
  copyFromParentKeys(childObj, parentObj) {
    Object.keys(parentObj).forEach(member => {
      if (!(member in childObj)) {
        childObj[member] = parentObj[member]
      }
    })
  },
  /**
   * @public
   * @static
   * @function
   * @param {string} s A string
   * @return {string} Input string with the first letter of each word capitalized
   */
  capitalize(s) {
    const words = s.split(' ')
    let result = ''
    words.forEach(w => {
      const word = w.toLowerCase()
      result += word.substr(0, 1).toUpperCase()
      result += word.substr(1).toLowerCase()
      result += ' '
    })
    return result.trim()
  },
  /**
   * @public
   * @static
   * @function
   * @param {string} prefix An id prefix
   * @return {string} A unique id
   */
  nextId(prefix) {
    const last = nyc.uniqueIds[prefix]
    nyc.uniqueIds[prefix] = (typeof last === 'number') ? (last + 1) : 0
    return `${prefix}-${nyc.uniqueIds[prefix]}`
  },
  /**
   * @public
   * @static
   * @function
   * @param {Object} object An object
   * @return {jQuery} HTML string
   */
  html(object) {
    if (typeof object.html === 'function') {
      return $(object.html())
    } else {
      const html = $('<div class="nyc-html"></div>')
      if (object.getProperties) {
        object = object.getProperties()
      } else if (object.properties) {
        object = object.properties
      }
      Object.keys(object).forEach(prop => {
        html.append(`<div><span class="fld">${prop}</span><span class="val">${object[prop]}</span></div>`)
      })
      return html
    }
  },
  /**
   * @desc Shows the loading splash screen on eleents with loading class
   * @public
   * @static
   * @function
   * @param {jQuery} target Target elements
   */
  loading(target) {
    if (target.hasClass('loading')) {
      target.append($('#loading').get(0) || nyc.LOADING_HTML)
    }
  },
  /**
   * @desc Clears the loading splash screen
   * @public
   * @static
   * @function
   * @param {jQuery} [target=body] Target elements
   */
  ready(target) {
    $(target || $('body')).removeClass('loading').attr('aria-hidden', false)
    $('#loading').fadeOut()
  },
  /**
   * @desc Returns a cache bust param for query strings
   * @public
   * @static
   * @function
   * @param {number} minutes Minutes
   * @return {number} Time in milliseconds
   */
  cacheBust(minutes) {
    const offset = 1000 * 60 * minutes;
    return Math.round(new Date().getTime() / offset) * offset;
  },
  /**
   * @desc Disables scrolling on keypress when user presses the space bar on a button or a link by adding a kepress event handler to the document.  The click event is triggered on buttons and links without and href attribute or with an href value of #.  If a link has an href the browser will navigate to that location.  If a link also has a target attribute the navigation will take place in a new tab.
   * @public
   * @static
   */
  noSpaceBarScroll() {
    $(document).keypress(nyc.noSpaceBarHandler)
  },
  /**
   * @private
   * @const
   * @type {function}
   * @param {object} event The event object
   */
  noSpaceBarHandler(event) {
    const tag = event.target.tagName
    if ($.inArray(tag, ['INPUT', 'TEXTAREA', 'SELECT']) === -1) {
      const key = event.key
      if ($.inArray(key, [' ', 'Enter']) > -1) {
        const elem = $(event.target)
        const href = elem.attr('href')
        event.preventDefault()
        if (!href || href === '#') {
          elem.trigger('click')
        } else {
          const target = elem.attr('target')
          if (target) {
            window.open(href)
          } else {
            nyc.location(href)
          }
        }
      }
    }
  },
  /**
   * @private
   * @method
   * @param {string} href Hyperlink
   */
  location(href) {
    window.location = href
  },
  /**
   * @desc Returns an object describing the element that currently has focus
   * @public
   * @static
   * @function
   * @return {Object} An object containing the element and a boolean indicating if it is a text input
   */
  activeElement() {
    const activeElement = document.activeElement
    return {
      activeElement: activeElement,
      isTextInput: activeElement.tagName === 'INPUT' && activeElement.type === 'text'
    }
  },
  /**
   * @desc Returns an array with duplicates removed
   * @public
   * @static
   * @function
   * @param {Array<string>|Array<number>} arr An array with possible duplicates
   * @return {Array<string>|Array<number>} An array without duplicates
   */
  removeDups(arr) {
    const noDups = {}
    const result = []
    arr.forEach(v => {
      noDups[v] = typeof v
    })
    Object.keys(noDups).forEach(v => {
      result.push(noDups[v] === 'number' ? v * 1 : v)
    })
    return result
  },
  /**
   * @private
   * @static
   * @member {Object<string, number>}
   */
  uniqueIds: {}
}

/**
 * @private
 * @const
 * @type {string}
 */
nyc.LOADING_HTML = '<div id="loading">' +
  '<div>' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="152" height="52">' +
      '<g transform="translate(1.5,0)">' +
        '<polygon points="15.5,1.2 3.1,1.2 0,4.3 0,47.7 3.1,50.8 15.5,50.8 18.6,47.7 18.6,35.3 34.1,50.8 46.6,50.8 49.7,47.7 49.7,4.3 46.6,1.2 34.1,1.2 31,4.3 31,16.7 "/>' +
        '<polygon points="83.8,47.7 83.8,38.4 99.3,22.9 99.3,10.5 99.3,4.3 96.2,1.2 83.8,1.2 80.7,4.3 80.7,10.5 74.5,16.7 68.3,10.5 68.3,4.3 65.2,1.2 52.8,1.2 49.7,4.3 49.7,22.9 65.2,38.4 65.2,47.7 68.3,50.8 80.7,50.8 "/>' +
        '<polygon points="145.9,29.1 130.4,29.1 130.4,32.2 118,32.2 118,19.8 130.4,19.8 130.4,22.9 145.9,22.9 149,19.8 149,10.5 139.7,1.2 108.6,1.2 99.3,10.5 99.3,41.5 108.6,50.8 139.7,50.8 149,41.5 149,32.2 "/>' +
      '</g>' +
    '</svg>' +
    '<h1>maps.nyc.gov</h1>' +
  '</div>' +
'</div>'

$(document).ready(() => {
  nyc.loading($('body'))
})

export default nyc
