var nyc = nyc || {};

nyc.MtaTripPlannerHack = function(target){
  this.iframe = $('<iframe id="mta-trip"></iframe');
  $(target).append(this.iframe);
};

nyc.MtaTripPlannerHack.prototype = {
  uri: null,
  requestUrl: null,
  directions: function(request) {
    var tripArgs = this.insanifyRequest(request);
    tripArgs = JSON.stringify(tripArgs);
    tripArgs = encodeURIComponent(tripArgs);
    var url = nyc.MtaTripPlannerHack.REQUEST_URL + tripArgs + this.randomParamCopedFromMtaCode();
    var iframe = this.iframe.get(0);
    iframe.onload = function(){
      iframe.onload = undefined;
      iframe.src = nyc.MtaTripPlannerHack.RESPONSE_URL;
      $(iframe).fadeIn();
    };
    iframe.src = url;
  },
  randomParamCopedFromMtaCode: function(){
    return '&rand=' + Math.floor(Math.random() * 11);
  },
  now: function(){
    var now = new Date();
    var hour = now.getHours();
    return {
      date: (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear(),
      hour: hour < 13 ? hour : hour - 12,
      minute: now.getMinutes(),
      ampm: hour < 12 ? 'am' : 'pm'
    };
  },
  borough: function(data){
    return {1: 'MN', 2: 'BX', 3: 'BK', 4: 'QN', 5: 'SI'}[data.boroughCode1In] || 'MN';
  },
  insanifyLocation: function(location, projection){
    var coord = proj4(projection || 'EPSG:3857', 'EPSG:4326', location.coordinates);
    return coord[1] + '$' + coord[0] + '$' + location.name + '$0';
  },
  insanifyRequest: function(request){
    var origin = request.origin;
    var destination = request.destination;
    var projection = request.projection;
    var date = this.now();
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
};

/**
 * @desc The URI for MTA TripPlanner
 * @private
 * @const {string}
 */
nyc.MtaTripPlannerHack.RESPONSE_URL = 'http://tripplanner.mta.info/MyTrip/ui_web/customplanner/results.aspx';

/**
 * @desc The MTA TripPlanner request URL
 * @private
 * @const {string}
 */
nyc.MtaTripPlannerHack.REQUEST_URL = 'http://tripplanner.mta.info/MyTrip/handler/customplannerHandler.ashx?jsonpacket=';

/**
 * @desc Object to pass reasonable parameters to MtaTripPlannerHack
 * @public
 * @typedef {Object}
 * @property {nyc.Locate.Result} origin
 * @property {nyc.Locate.Result} destination
 * @property {string} inputProjection
 * @property {boolean} accessible
 */
nyc.MtaTripPlannerHack.SaneRequest;

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
nyc.MtaTripPlannerHack.InsaneRequest;
