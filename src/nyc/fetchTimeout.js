/**
 * @module nyc/fetchTimeout
 */

require('isomorphic-fetch')

/**
 * @desc Function to fetch a URL and fail if the response time exceeds the timeout value
 * @function
 * @param {string} url The url to fetch
 * @param {number} [timeout=15000] The timeout in milliseconds
 * @returns {Promise} A promise that resolves to the HTTP response object or a timeout error
 */
const fetchTimeout = (url, timeout) => {
  let timedOut = false
  const start = fetchTimeout.LOG ? new Date().getTime() : 0
  return new Promise((resolve, reject) => {
    const timeOut = setTimeout(() => {
      timedOut = true
      if (fetchTimeout.LOG) {
        console.error(`Fetch ${url} timed out: ${fetchTimeout.TIMEOUT} ms`)
      }
      reject(new Error(`Request timeout for ${url}`))
    }, timeout || fetchTimeout.TIMEOUT)
    fetch(url).then(response => {
      clearTimeout(timeOut)
      if (!timedOut) {
        if (fetchTimeout.LOG) {
          console.info(`Fetch ${url} success: ${new Date().getTime() - start} ms`)
        }
        resolve(response)
      }
    }).catch(err => {
      if (!timedOut) {
        if (fetchTimeout.LOG) {
          console.error(`Fetch ${url} failed: ${new Date().getTime() - start} ms`)
        }
        reject(err)
      }
    })
  })
}

fetchTimeout.TIMEOUT = 15000
fetchTimeout.LOG = false

export default fetchTimeout
