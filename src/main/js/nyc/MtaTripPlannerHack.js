var nyc = nyc || {};
/**
 * @desc Class to hack calls to MTA TripPlanner
 * @public
 * @class
 * @extends {nyc.ReplaceTokens}
 * @constructor
 */
nyc.MtaTripPlannerHack = function(){};

nyc.MtaTripPlannerHack.prototype = {
  directions: function(request) {
    if (request.origin.coordinates){
      var html = this.html(this.args(request));
      window.open('').document.write(html);
    }else{
      window.open(nyc.MtaTripPlannerHack.FORM_URL);
    }
  },
  args: function(request){
    var args = this.insanifyRequest(request);
    args = JSON.stringify(args);
    return encodeURIComponent(args);
  },
  html: function(args){
    var url = nyc.MtaTripPlannerHack.REQUEST_URL + args + this.randomParamCopiedFromMtaCode();
    return this.replace(nyc.MtaTripPlannerHack.HTML, {request: url});
  },
  randomParamCopiedFromMtaCode: function(){
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
    return {1: 'MN', 2: 'BX', 3: 'BK', 4: 'QN', 5: 'SI'}[data.boroughCode1In] || '';
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

nyc.inherits(nyc.MtaTripPlannerHack, nyc.ReplaceTokens);

/**
 * @desc The MTA TripPlanner form URL
 * @private
 * @const {string}
 */
nyc.MtaTripPlannerHack.FORM_URL = 'http://tripplanner.mta.info/MyTrip/ui_web/customplanner/TripPlanner.aspx'

/**
 * @desc The MTA TripPlanner request URL
 * @private
 * @const {string}
 */
nyc.MtaTripPlannerHack.REQUEST_URL = 'http://tripplanner.mta.info/MyTrip/handler/customplannerHandler.ashx?jsonpacket=';

/**
 * @desc The MTA TripPlanner response URL
 * @private
 * @const {string}
 */
nyc.MtaTripPlannerHack.RESPONSE_URL = 'http://tripplanner.mta.info/MyTrip/ui_web/customplanner/results.aspx';

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

/**
 * @private
 * @const {string}
 */
 nyc.MtaTripPlannerHack.HTML = '<!DOCTYPE html><html><head><title>MYA TripPlanner</title><head><body>' +
'<h1 id="msg" style="width:100%;text-align:center;font-family:Arial;color:#0039A6;padding:70px 10px;background-repeat:no-repeat;background-size:50px;background-position:center 10px;' + 'background-image:url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22512%22%20height%3D%22512%22%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E.st0%7Bfill%3A%230039A6%3B%7D.st1%7Bfill%3A%23fff%3B%7D.st2%7Bfill%3Anone%3Bstroke%3A%23fff%3Bstroke-width%3A5%3Bstroke-linecap%3Around%3B%7D%3C%2Fstyle%3E%3Cg%20transform%3D%22translate(28.11026%2C6)%22%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M%200.4%2C106.9%20C%2045.6%2C42.3%20120.6%2C0%20205.4%2C0%20c%20138.1%2C0%20250%2C111.9%20250%2C250%200%2C138.1%20-111.9%2C250%20-250%2C250%20C%20124%2C500%2051.6%2C461%206%2C400.8%22%2F%3E%3Cpath%20class%3D%22st1%22%20d%3D%22m%2034%2C395.8%20c%200%2C0%200%2C-87.4%20-0.8%2C-97.3%200%2C-9.5%20-4.7%2C-64.2%20-3.7%2C-73.4%20l%202.6%2C0.1%2032.8%2C165.3%2045.9%2C-8.1%2026.7%2C-153.1%20c%200.8%2C0%202.2%2C0%203%2C0%201.4%2C9.4%20-2.4%2C53.8%20-2.4%2C63.3%20-0.8%2C9.9%20-0.8%2C85%20-0.8%2C85%20l%2046.5%2C-8.1%200%2C-230.5%20-72.6%2C-12.6%20-20.4%2C141.2%20C%2090.1%2C267.6%2070.2%2C119.2%2070.2%2C119.2%20L%200%2C107%205.7%2C400.8%22%2F%3E%3Cpolygon%20class%3D%22st1%22%20points%3D%22329.4%2C321.1%20351.8%2C318.2%20354.7%2C339.6%20380.9%2C335.1%20355.8%2C169.2%20324.6%2C163.8%20293%2C350.5%20326.3%2C344.6%22%2F%3E%3Cpolygon%20class%3D%22st1%22%20points%3D%22195.9%2C200.5%20231.1%2C203.6%20231.2%2C361.2%20274.2%2C353.7%20274.2%2C207.4%20302%2C209.7%20302%2C159.5%20195.9%2C141.1%22%2F%3E%3Cpolygon%20class%3D%22st0%22%20points%3D%22339.4%2C225.6%20334.4%2C281.2%20347.3%2C280.4%20342.5%2C225.6%22%2F%3E%3Cpath%20class%3D%22st2%22%20d%3D%22M%200.4%2C106.9%20C%2045.6%2C42.3%20120.6%2C0%20205.4%2C0%20c%20138.1%2C0%20250%2C111.9%20250%2C250%200%2C138.1%20-111.9%2C250%20-250%2C250%20C%20124%2C500%2051.6%2C461%206%2C400.8%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\')">Loading MTA TripPlanner<br></h1>' +
'<iframe style="visibility:hidden" src="${request}" onload="document.location=\'' + nyc.MtaTripPlannerHack.RESPONSE_URL + '\';"></iframe>' +
'<script>setInterval(function(){' +
'var msg = document.getElementById("msg");' +
'msg.innerHTML = msg.innerHTML + ".";' +
'}, 300);</script></body></html>';
