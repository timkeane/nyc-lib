/**
 * @module nyc/Content
 */

import Papa from 'papaparse'

import ReplaceTokens from 'nyc/ReplaceTokens'

require('isomorphic-fetch')

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
		fetch(options.url).then(respose => {
			return respose.text()
		}).then(resposeText => {
      const csvRows = Papa.parse(resposeText, {header: true}).data
			csvRows.forEach((row, i) => {
				if (messages[0][row[key]]) {
					console.warn(`Overwriting message with key '${[row[key]]}'`)
				}
				messages[0][row[key]] = row[value]
			})
			resolve(new Content(messages))
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
