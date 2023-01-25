/**
 * @module nyc/Content
 */

import $ from 'jquery'
import Papa from 'papaparse'
import ReplaceTokens from './ReplaceTokens'
import fetchTimeout from './fetchTimeout'

/**
 * @desc A class to provide messages with substitution values
 * @public
 * @class
 * @extends module:nyc/ReplaceTokens~ReplaceTokens
 */
class Content extends ReplaceTokens {
  /**
   * @desc Create an instance of Content
   * @public
   * @constructor
   * @param {Array<Object<string, string>>} messages The messages with optional tokens mapped by message id
   */
  constructor(messages) {
    super()
    /**
     * @private
     * @member {Object<string, string>}
     */
    this.messages = {}
    messages.forEach(msgs => {
      Object.keys(msgs).forEach(key => {
        if (this.messages[key]) {
          console.warn(`Overwriting message with key '${key}'`)
        }
        this.messages[key] = msgs[key]
      })
    })
  }
  /**
   * @desc Sets the inner HTML of DOM nodes queryable by message keys
   * @public
   * @method
   * @param {Object<string, string>=} values The substitution values
   */
  applyToDom(values) {
    Object.keys(this.messages).forEach(key => {
      const msg = this.message(key, values)
      const node = $(key)
      if (node.length === 1) {
        node.html(msg)
      }
    })
  }
  /**
   * @desc Returns a content message with substituted values
   * @public
   * @method
   * @param {string} msgId The id for the message
   * @param {Object<string, string>=} values The substitution values
   * @return {string} The message with substituted values if provided
   */
  message(msgId, values) {
    if (!this.messages[msgId]) {
      return ''
    }
    return this.replace(this.messages[msgId], values || {})
  }
}

/**
 * @desc Loads messages from a CSV file
 * @public
 * @static
 * @method
 * @param {module:nyc/Content~Content.LoadOptions} options The load options
 * @return {Promise} The promise that will resolve to an instance of {@link module:nyc/Content~Content}
 */
Content.loadCsv = (options) => {
  const messages = options.messages || [{}]
  const key = options.key || 'key'
  const value = options.value || 'value'
  return new Promise((resolve, reject) => {
    fetchTimeout(options.url).then(respose => {
      respose.text().then(resposeText => {
        const csvRows = Papa.parse(resposeText, {header: true}).data
        csvRows.forEach((row, i) => {
          if (messages[0][row[key]]) {
            console.warn(`Overwriting message with key '${[row[key]]}'`)
          }
          messages[0][row[key]] = row[value]
        })
        resolve(new Content(messages))
      })
    }).catch(err => {
      console.error(`Failed to load CSV from ${options.url}`, err)
    })
  })
}

/**
 * @desc Options for loading CSV content using {@link module:nyc/Content~Content.loadCsv}
 * @public
 * @typedef {Object}
 * @property {string} url The URL to a CSV source
 * @property {string} [key='key'] The key column for CSV messages
 * @property {string} [value='value'] The key column for CSV messages
 * @property {Array<Object<string, string>>=} messages Other messages
 */
Content.LoadOptions

export default Content
