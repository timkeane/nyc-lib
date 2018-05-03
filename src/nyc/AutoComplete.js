/**
 * @module nyc/AutoComplete
 */

class AutoComplete {
  filter(list, typed) {
    const long = typed.length > 3
    const exact = []
    const possible = []
    const matchers = this.regexp(typed)
    list.forEach(item => {
      if (long) {
        if (matchers.exact.test(item)) {
          exact.push(item)
        }
      }else if (matchers.possible.test(item)) {
        possible.push(item)
      }
    })
    return exact.length ? exact : possible
  }
  regexp(typed) {
    const possibleMatch = new String(typed.replace(/[^a-zA-Z0-9]/g, ''))
    const exactMatch = new String(typed.replace(/[^a-zA-Z0-9 ]/g, ''))
    let possible = '/^'
    for (let i =0; i < possibleMatch.length; i++) {
      possible += `(?=.*${possibleMatch.charAt(i)})|`

    }
    possible = possible.substr(0, possible.length - 1)
    possible += '.*$/i'
    console.info(possible)
    console.info(`/${exactMatch}/i`)
    return {
      exact: new RegExp(`/${exactMatch}/i`),
      possible: new RegExp(possible)
    }
  }
}
