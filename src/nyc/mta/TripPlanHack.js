/**
 * @module nyc/mta/TripPlanHack
 */

import nyc from '../index'
import $ from 'jquery'

const proj4 = nyc.proj4

/**
 * @desc Class to hack calls to MTA TripPlanner
 * @public
 * @class
 * @constructor
 */
class TripPlanHack {
  /**
   * @desc Create an instance of TripPlanHack
   * @public
   * @constructor
   * @param {string} url URL to the MTA jump page
   */
  constructor(url) {
    /**
     * @private
     * @member {string}
     */
    this.url = url
  }
  /**
   * @desc Intiate jump to MTA TripPlanner
   * @public
   * @method
   * @param {module:nyc/mta/TripPlanHack~TripPlanHack.SaneRequest} request The trip request
   */
  directions(request) {
    const args = {
      jsonpacket: this.jsonpacket(request),
      rand: this.randomParamCopiedFromMtaCode()
    }
    this.window = window.open(`${this.getUrl()}?${$.param(args)}`)
  }
  /**
   * @private
   * @method
   * @return {string} Url
   */
  getUrl() {
    if (this.url) {
      return this.url
    }
    const host = document.location.hostname
    const path = document.location.pathname
    let port = document.location.port
    port = port ? `:${port}` : ''
    return `http://${host}${port}${path}/mta.html`
  }
  /**
   * @private
   * @method
   * @param {module:nyc/mta/TripPlanHack~TripPlanHack.SaneRequest} request Request
   * @return {string} JSON string
   */
  jsonpacket(request) {
    return JSON.stringify(this.insanifyRequest(request))
  }
  /**
   * @private
   * @method
   * @return {number} Random parameter
   */
  randomParamCopiedFromMtaCode() {
    return Math.floor(Math.random() * 11)
  }
  /**
   * @private
   * @method
   * @return {Object<string, Object>} Now date object
   */
  now() {
    const now = new Date()
    const hour = now.getHours()
    return {
      date: `${(now.getMonth() + 1)}/${now.getDate()}/${now.getFullYear()}`,
      hour: hour < 13 ? hour : hour - 12,
      minute: now.getMinutes(),
      ampm: hour < 12 ? 'am' : 'pm'
    }
  }
  /**
   * @private
   * @method
   * @param {Object} location The location object
   * @return {string} location string
   */
  insanifyLocation(location) {
    const coord = proj4(location.projection || 'EPSG:3857', 'EPSG:4326', location.coordinate)
    return `${coord[1]}$${coord[0]}$${location.name}$0`
  }
  /**
   * @private
   * @method
   * @param {module:nyc/mta/TripPlanHack~TripPlanHack.SaneRequest} request Request
   * @return {Object<string, Object>} Request object
   */
  insanifyRequest(request) {
    const origin = request.origin
    const destination = request.destination
    const date = this.now()
    return {
      RequestDevicename: 'DESKTOP',
      OriginInput: origin.name,
      DestinationInput: destination.name,
      Arrdep: 'D',
      Hour: date.hour,
      Minute: date.minute,
      Ampm: date.ampm,
      InputDate: date.date,
      Minimize: 'X',
      Walkdist: '0.50',
      Mode: 'FRBC12',
      LineStart: '',
      LineEnd: '',
      Accessible: request.accessible ? 'Y' : 'N',
      OriginCoordinates: this.insanifyLocation(origin),
      DestinationCoordinates: this.insanifyLocation(destination),
      LocationType: '',
      StartServiceType: 'train',
      StartTrainType: 'subway',
      StartBorough: '',
      EndBorough: '',
      Walkincrease: '',
      Maxinitialwait: '',
      Maxtriptime: '',
      Maxtransfers: ''
    }
  }
}

/**
 * @desc Object to define TripPlanHack locations
 * @public
 * @typedef {Object}
 * @property {string} name
 * @property {Array<number>} coordinate projection
 * @property {string} [projection=EPSG:3857]
 */
TripPlanHack.Location

/**
 * @desc Object to pass reasonable parameters to TripPlanHack
 * @public
 * @typedef {Object}
 * @property {TripPlanHack.Location} origin
 * @property {TripPlanHack.Location} destination
 * @property {boolean} accessible
 */
TripPlanHack.SaneRequest

/**
 * @desc Object type to pass to MTA TripPlanner
 * @private
 * @property {string} RequestDevicename
 * @property {string} OriginInput
 * @property {string} DestinationInput
 * @property {string} Arrdep
 * @property {string} Hour
 * @property {string} Minute
 * @property {string} Ampm
 * @property {string} InputDate
 * @property {string} Minimize
 * @property {string} Walkdist
 * @property {string} Mode
 * @property {string} LineStart
 * @property {string} LineEnd
 * @property {string} Accessible
 * @property {string} OriginCoordinates
 * @property {string} DestinationCoordinates
 * @property {string} LocationType
 * @property {string} StartServiceType
 * @property {string} StartTrainType
 * @property {string} StartBorough
 * @property {string} EndBorough
 * @property {string} Walkincrease
 * @property {string} Maxinitialwait
 * @property {string} Maxtriptime
 * @property {string} Maxtransfers
*/
TripPlanHack.InsaneRequest


export default TripPlanHack
