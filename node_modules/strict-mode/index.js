/**
 * Wraps module `exports`
 *
 * See [Usage](http://g14n.info/strict-mode#usage)
 *
 * @param {Function} callback containing caller package's exports statements
 */

function strictMode (callback) {
  'use strict'

  // The module api is in *Locked* state, so it will not change
  // see http://nodejs.org/api/modules.html
  // that is why I just copyed and pasted the orig module wrapper.
  //
  // By the way, in test.js there is a test that checks if the content of
  // *origWrapper* needs an update.

  const origWrapper = '(function (exports, require, module, __filename, __dirname) { '
  const strictWrapper = origWrapper + '"use strict";'

  if (typeof callback !== 'function') {
    throw new TypeError('Argument *callback* must be a function')
  }

  const module = require('module')

  if (typeof module.wrapper === 'undefined') {
    // If you enter here, you are in a context other than server side Node.js.
    // Since module.wrapper is not defined, do not switch strict mode on.
    callback()
  } else {
    if (module.wrapper[0] === origWrapper) {
      module.wrapper[0] = strictWrapper

      // Every require in this callback will load modules in strict mode.
      try {
        callback()
      } catch (err) {
        console.error(err.stack)
      }

      // Restore orig module wrapper, play well with others.
      module.wrapper[0] = origWrapper
    } else {
      // If module.wrapper[0] changed, do not switch strict mode on.
      callback()
    }
  }
}

module.exports = strictMode
