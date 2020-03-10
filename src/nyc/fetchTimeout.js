const TIMEOUT = 15000

/**
 * @desc Function to fetch a URL and fail if the response time exceeds the timeout value
 * @function
 * @param {string} url The url to fetch
 * @param {number=15000} timeout The timeout in milliseconds
 * @returns {Promise} A promise that resolves to the HTTP response object or a timeout error
 * 
 */
export default (url, timeout) => {
  let didTimeOut = false
  return new Promise((resolve, reject) => {
    const timeOut = setTimeout(() => {
      didTimeOut = true
      reject(new Error(`Request timeout for ${url}`))
    }, timeout || TIMEOUT)
    fetch(url).then(response => {
      clearTimeout(timeout)
      if(!didTimeOut) {
        resolve(response)
      }
    }).catch(err => {
      if(didTimeOut) return
      reject(err)
    })
  })
}
