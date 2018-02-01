var nyc = nyc || {};

nyc.MtaTripPlannerHack = function(){};

nyc.MtaTripPlannerHack.prototype = {
  uri: null,
  requestUrl: null,
  directions: function(request) {
    var tripArgs = this.insanifyRequest(request);
    var url = nyc.MtaTripPlannerHack.REQUEST_URL + JSON.stringify(tripArgs) + this.randomParamCopedFromMtaCode();
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(response){
        window.open(nyc.MtaTripPlannerHack.RESPONSE_URL + response.responseText);
      },
      error: function(){
        console.error(arguments);
      }
    });
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
      startAddr: origin.name,
      endAddr: destination.name,
      Arrdep:	'D',
      hour:	date.hour,
      minute:	date.minute,
      ampm:	date.ampm,
      selectedDate: date.date,
      minimize: 'X',
      walkdistance: '0.50',
      mode:	'FRBC12',
      lineStart: '',
      lineEnd: '',
      AccessibleTrip: request.accessible ? 'Y' : 'N',
      originCoors: this.insanifyLocation(origin, projection),
      destinationCoors: this.insanifyLocation(destination, projection),
      startServiceType: 'train',
      startTrainType: 'subway',
      startBorough: this.borough(origin.data),
      endServiceType: 'train',
      endTrainType: 'subway',
      endBorough: this.borough(destination.data),
      walkincrease: '',
      maxinitialwait: '',
      maxtriptime: '',
      maxtransfers: ''
    }
  }
};

/**
 * @desc The URI for MTA TripPlanner
 * @private
 * @const {string}
 */
nyc.MtaTripPlannerHack.RESPONSE_URL = 'http://tripplanner.mta.info/MyTrip/ui_web/customplanner/';

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
 * @property {string} startAddr
 * @property {string} endAddr
 * @property {string} Arrdep
 * @property {string} hour
 * @property {string} minute
 * @property {string} ampm
 * @property {string} selectedDate
 * @property {string} minimize
 * @property {string} walkdistance
 * @property {string} mode
 * @property {string} lineStart
 * @property {string} lineEnd
 * @property {string} AccessibleTrip
 * @property {string} originCoors
 * @property {string} destinationCoors
 * @property {string} startServiceType
 * @property {string} startTrainType
 * @property {string} startBorough
 * @property {string} endServiceType
 * @property {string} endTrainType
 * @property {string} endBorough
 * @property {string} walkincrease
 * @property {string} maxinitialwait
 * @property {string} maxtriptime
 * @property {string} maxtransfers
*/
nyc.MtaTripPlannerHack.InsaneRequest;
