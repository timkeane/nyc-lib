/**
 * @module nyc/Content
 */

import Papa from 'papaparse'

import ReplaceTokens from 'nyc/ReplaceTokens'

/** 
 * @desc A class to provide messages with substitution values
 * @public 
 * @class
 * @extends {nyc.ReplaceTokens}
 */
class Content extends ReplaceTokens {
	/** 
	 * @desc A class to provide messages with substitution values
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
		this.messages = []
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
	 * @desc Returns a content message with substituted valeus
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
		try {
			return this.replace(this.messages[msgId], values || {})						
		} catch(error) {
			return ''
		}
	}
}

/**
 * @desc Returns a content message with substituted valeus
 * @public
 * @static
 * @method
 * @param {Content.LoadOptions} options The load options
 * @return {Promise} The promise that will return the content
 */
Content.loadCsv = (options) => {
	const messages = options.messages || [{}]
	const key = options.key || 'key'
	const value = options.value || 'value'
	return new Promise((resolve, reject) => {
		fetch(option.url).then((respose) => {
			return respose.text()
		}).then((resposeText) => {
      const csvRows = Papa.parse(source, {header: true}).data
			csvRows.forEach((row, i) => {
				try {
					if (messages[0][key]) {
						console.warn(`Overwriting message with key '${key}'`)
					}						
					messages[0][key] = row[value]
				} catch (error) {
					console.error(`Bad data at row ${i + 1} of ${csvRows.length}`, row)
				}
			})
			resolve(new Content(messages))
		})
	})
}

/**
 * @desc Options for loading CSV content 
 * @public
 * @typedef {Object}
 * @property {string} url The URL to a CSV source
 * @property {string} [key='key'] The key column for CSV messages
 * @property {string} [value='value'] The key column for CSV messages
 * @property {Array<Object<string, string>>=} messages Other messages
 */
Content.LoadOptions

export default Content