/**
 * @module nyc/fetchTimeout
 */

require('isomorphic-fetch')

const TIMEOUT = 15000

/**
 * @desc Function to fetch a URL and fail if the response time exceeds the timeout value
 * @function
 * @param {string} url The url to fetch
 * @param {number} [timeout=15000] The timeout in milliseconds
 * @returns {Promise} A promise that resolves to the HTTP response object or a timeout error
 */
export default (url, timeout) => {
  let timedOut = false
  return new Promise((resolve, reject) => {
    const timeOut = setTimeout(() => {
      timedOut = true
      reject(new Error(`Request timeout for ${url}`))
    }, timeout || TIMEOUT)
    fetch(url).then(response => {
      clearTimeout(timeOut)
      if (!timedOut) {
        resolve(response)
      }
    }).catch(err => {
      if (!timedOut) {
        reject(err)
      }
    })
  })
}
