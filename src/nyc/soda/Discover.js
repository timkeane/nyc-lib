/**
 * @module nyc/soda/Discover
 */

/**
 * @desc A class for discovering NYC OpenData resources using the SocrataJson SODA API
 * @public
 * @class
 * @see https://opendata.cityofnewyork.us/
 * @see https://dev.socrata.com/consumers/getting-started.html
 */
class Discover {
  /**
   * @desc Create an instance of Discover
   * @public
   * @constructor
   * @param {string} domain The host name for querying Socrate (i.e. https://opendata.cityofnewyork.us)
   * @see https://opendata.cityofnewyork.us/
   * @see https://dev.socrata.com/consumers/getting-started.html
   */
  constructor(domain) {
    this.domain = domain
    this.host = `https://${domain}`
    this.url = `${this.host}/api/catalog/v1?domains=${domain}&names=`
  }
  /**
   * @desc Find a resource endpoint by name
   * @public
   * @method
   * @param {string} name The resource name
   * @return {Promise} Promise that resolves to the resource endpoint without format extension
   */
  discover(name) {
    return new Promise((resolve, reject) => {
      fetch(`${this.url}${name}`).then(response => {
        return response.json()
      })
        .then(json => {
          const resources = json.results
          if (resources.length === 1) {
            resolve(`${this.host}/resource/${resources[0].id}`)
          }
          throw `no resource "${name}" for domain "${this.domain}"`
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default Discover
