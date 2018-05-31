/**
 * @module nyc/MtaHack
 */

/**
 * @desc Class to hack calls to MTA TripPlanner
 * @public
 * @class
 * @constructor
 */
class MtaHack {
  directions(request) {
    if (request.origin.coordinates) {
      const args = {
        jsonpacket: this.jsonpacket(request),
        rand: this.randomParamCopiedFromMtaCode()
      }
      window.open(MtaHack.GO2MTA_URL + $.param(args))
    } else {
      window.open(MtaHack.FORM_URL)
    }
  }
  jsonpcket(request) {
    return JSON.stringify(this.insanifyRequest(request))
  }
  html(args) {
    const url = MtaHack.REQUEST_URL + args + this.randomParamCopiedFromMtaCode()
    return this.replace(MtaHack.HTML, {request: url})
  }
  randomParamCopiedFromMtaCode() {
    return Math.floor(Math.random() * 11)
  }
  now() {
    const now = new Date()
    const hour = now.getHours()
    return {
      date: (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear(),
      hour: hour < 13 ? hour : hour - 12,
      minute: now.getMinutes(),
      ampm: hour < 12 ? 'am' : 'pm'
    }
  }
  borough(data) {
    return {1: 'MN', 2: 'BX', 3: 'BK', 4: 'QN', 5: 'SI'}[data.boroughCode1In] || ''
  }
  insanifyLocation(location, projection) {
    const coord = proj4(projection || 'EPSG:3857', 'EPSG:4326', location.coordinates)
    return coord[1] + '$' + coord[0] + '$' + location.name + '$0'
  }
  insanifyRequest(request) {
    const origin = request.origin
    const destination = request.destination
    const projection = request.projection
    const date = this.now()
    return {
      RequestDevicename: 'DESKTOP',
      OriginInput: origin.name,
      DestinationInput: destination.name,
      Arrdep:	'D',
      Hour:	date.hour,
      Minute:	date.minute,
      Ampm:	date.ampm,
      InputDate: date.date,
      Minimize: 'X',
      Walkdist: '0.50',
      Mode:	'FRBC12',
      LineStart: '',
      LineEnd: '',
      Accessible: request.accessible ? 'Y' : 'N',
      OriginCoordinates: this.insanifyLocation(origin, projection),
      DestinationCoordinates: this.insanifyLocation(destination, projection),
      LocationType: '',
      StartServiceType: 'train',
      StartTrainType: 'subway',
      StartBorough: this.borough(origin.data),
      EndBorough: this.borough(destination.data),
      Walkincrease: '',
      Maxinitialwait: '',
      Maxtriptime: '',
      Maxtransfers: ''
    }
  }
}

/**
 * @desc The MTA TripPlanner form URL
 * @private
 * @const {string}
 */
MtaHack.GO2MTA_URL = 'http://csgis-stg-prx.csc.nycnet/go2mta/v0.0.1/?'


/**
 * @desc Object to pass reasonable parameters to MtaHack
 * @public
 * @typedef {Object}
 * @property {Locate.Result} origin
 * @property {Locate.Result} destination
 * @property {string} inputProjection
 * @property {boolean} accessible
 */
MtaHack.SaneRequest

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
MtaHack.InsaneRequest
