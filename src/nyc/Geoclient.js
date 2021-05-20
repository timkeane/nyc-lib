/**
 * @module nyc/Geoclient
 */

import nyc from 'nyc'
import Locator from 'nyc/Locator'
import Geocoder from 'nyc/Geocoder'
import fetchTimeout from 'nyc/fetchTimeout'

const proj4 = nyc.proj4

/**
 * @desc A class for geocoding using the New York City Geoclient API
 * @public
 * @class
 * @extends module:nyc/Geocoder~Geocoder
 * @fires module:nyc/Locator~Locator#geocoded
 * @fires module:nyc/Locator~Locator#geolocated
 * @fires module:nyc/Locator~Locator#ambiguous
 * @fires module:nyc/Locator~Locator#error
 * @see https://developer.cityofnewyork.us/api/geoclient-api
 */
class Geoclient extends Geocoder {
/**
 * @desc Create an instance of Geoclient
 * @public
 * @constructor
 * @param {module:nyc/Geoclient~Geoclient.Options} options Constructor options
 */
  constructor(options) {
    super(options)
    /**
     * @private
     * @member {string}
     */
    this.url = `${options.url}&input=`
    /**
     * @desc The epsg code
     * @public
     * @member {string}
     */
    this.projection = options.projection || 'EPSG:3857'
  }
  /**
   * @desc Geocode an input string representing a location
   * @public
   * @override
   * @method
   * @param {string} input The value to geocode
   * @returns {Promise<module:nyc/Locator~Locator.Result|module:nyc/Locator~Locator.Ambiguous>} The result of the search request
   */
  search(input) {
    return new Promise((resolve, reject) => {
      input = input.trim()
      if (input.length === 5 && !isNaN(input)) {
        this.resolveZip(input, resolve)
      } else if (input.length) {
        input = input.replace(/"/g, '').replace(/'/g, '').replace(/&/g, ' and ')
        fetchTimeout(`${this.url}${input}`).then(response => {
          return response.json()
        }).then(json => {
          this.geoclient(json, resolve)
        }).catch(error => {
          this.error(error, reject)
        })
      }
    })
  }
  resolveZip(input, resolve) {
    const p = this.project(Geoclient.ZIP_CODE_POINTS[input])
    let result
    if (p) {
      result = {
        coordinate: p,
        accuracy: Locator.Accuracy.ZIP_CODE,
        type: 'geocoded',
        zip: true,
        name: input
      }
      resolve(result)
      this.trigger('geocoded', result)
    } else {
      result = {input: input, type: 'ambiguous', possible: []}
      resolve(result)
      this.trigger('ambiguous', result)
    }
  }
  /**
   * @private
   * @method
   * @param {Array<number>} coordinate Coordinate
   * @return {Array<number>} Reprojected coordinate
   */
  project(coordinate) {
    if (coordinate && this.projection !== 'EPSG:2263') {
      return proj4('EPSG:2263', this.projection, coordinate)
    }
    return coordinate
  }
  /**
   * @private
   * @method
   * @param {Object} location Response object
   * @return {boolean} If mappable
   */
  isMappable(location) {
    return location &&
      location.coordinate &&
      !isNaN(location.coordinate[0]) &&
      !isNaN(location.coordinate[1])
  }
  /**
   * @private
   * @method
   * @param {Object} response Response object
   * @param {function} resolve Resolve
   */
  geoclient(response, resolve) {
    const results = response.results
    const nothing = {
      type: 'ambiguous',
      input: response.input,
      possible: []
    }
    if (response.status === 'OK') {
      const location = this.parse(results[0])
      if (results.length === 1 && this.isMappable(location)) {
        location.type = 'geocoded'
        resolve(location)
        this.trigger('geocoded', location)
      } else {
        const possible = this.possible(results, resolve)
        if (possible.length > 1) {
          const ambiguous = {
            type: 'ambiguous',
            input: response.input,
            possible
          }
          resolve(ambiguous)
          this.trigger('ambiguous', ambiguous)
        } else if (possible.length === 1) {
          possible[0].type = 'geocoded'
          resolve(possible[0])
          this.trigger('geocoded', possible[0])
        } else {
          resolve(nothing)
          this.trigger('ambiguous', nothing)
        }
      }
    } else {
      resolve(nothing)
      this.trigger('ambiguous', nothing)
    }
  }
  /**
   * @private
   * @method
   * @param {Array<module:nyc.Locator~Locator.Ambiguous>} results Results
   * @param {function} resolve Resolve
   * @returns {Array} Possible results
   */
  possible(results, resolve) {
    let possible = []
    results.forEach(result => {
      const location = this.parse(result)
      if (location) {
        possible.push(location)
      } else {
        const possibleMap = {}
        const response = result.response
        let more = true
        let i = 1
        while (more) {
          const lowHouseNumber = response['giLowHouseNumber' + i]
          const highHouseNumber = response['giHighHouseNumber' + i]
          if (lowHouseNumber) {
            const lowName = nyc.capitalize(`${lowHouseNumber} ${response['giStreetName' + i]}, ${Geoclient.BOROS[response['giBoroughCode' + i]]}`) + ', NY'
            possibleMap[lowName] = {name: lowName}
          }
          if (highHouseNumber) {
            const highName = nyc.capitalize(`${highHouseNumber} ${response['giStreetName' + i]}, ${Geoclient.BOROS[response['giBoroughCode' + i]]}`) + ', NY'
            possibleMap[highName] = {name: highName}
          }
          i = i + 1
          more = lowHouseNumber || highHouseNumber
        }
        possible = Object.values(possibleMap)
      }
    })
    return possible
  }
  /**
   * @private
   * @method
   * @param {Object} result Result
   * @return {Locator.Result} Locator result
   */
  parse(result) {
    const typ = result.request.split(' ')[0], r = result.response
    let ln1, p, a
    if (typ === 'intersection') {
      ln1 = `${r.streetName1} and ${r.streetName2}`
      p = [r.xCoordinate * 1, r.yCoordinate * 1]
      a = Locator.Accuracy.MEDIUM
    } else if (typ === 'blockface') {
      ln1 = r.firstStreetNameNormalized + ' btwn ' + r.secondStreetNameNormalized + ' & ' + r.thirdStreetNameNormalized
      p = [((r.fromXCoordinate * 1) + (r.toXCoordinate * 1)) / 2, ((r.fromYCoordinate * 1) + (r.toYCoordinate * 1)) / 2]
      a = Locator.Accuracy.LOW
    } else { /* address, bbl, bin, place */
      const x = r.internalLabelXCoordinate
      const y = r.internalLabelYCoordinate
      ln1 = (r.houseNumber ? (r.houseNumber + ' ') : '') + (r.firstStreetNameNormalized || r.giStreetName1)
      p = [(x && y ? x : r.xCoordinate) * 1, (x && y ? y : r.yCoordinate) * 1]
      a = x && y ? Locator.Accuracy.HIGH : Locator.Accuracy.MEDIUM
    }
    if (!this.isMappable({coordinate: p})) {
      console.warn('No coordinate', result)
      return
    }
    try {
      return {
        type: 'geocoded',
        coordinate: this.project(p),
        data: r,
        accuracy: a, /* approximation */
        name: nyc.capitalize(`${ln1.replace(/  +/g, ' ')}, ${Geoclient.BOROS[r.firstBoroughName]}`) +
          `, NY ${(r.zipCode || r.leftSegmentZipCode || '')}`
      }
    } catch (badCoord) {
      console.warn('No coordinate', result)
    }
  }
  /**
   * @private
   * @method
   * @param {Object} error Resolve
   * @param {function} reject Resolve
   */
  error(error, reject) {
    console.error('Geoclient error', error)
    reject({type: 'error', error: error})
    this.trigger('error', error)
  }
}

/**
 * @desc Constructor options for {@link module:nyc/Geoclient~Geoclient}
 * @public
 * @typedef {Object}
 * @property {string} url The URL for accessing the Geoclient API (see {@link https://developer.cityofnewyork.us/api/geoclient-api})
 * @property {string} [projection=EPSG:3857] The EPSG code of the projection for output geometries (i.e. EPSG:2263)
 */
Geoclient.Options

/**
 * @private
 * @const
 * @type {Object<string, string>}
 */
Geoclient.BOROS = {
  '1': 'Manhattan',
  '2': 'Bronx',
  '3': 'Brooklyn',
  '4': 'Queens',
  '5': 'Staten Island',
  'MANHATTAN': 'Manhattan',
  'BRONX': 'Bronx',
  'BROOKLYN': 'Brooklyn',
  'QUEENS': 'Queens',
  'STATEN IS': 'Staten Island'
}

/**
 * @private
 * @const
 * @type {Object<string, Array<number>>}
 */
Geoclient.ZIP_CODE_POINTS = {
  '10474': [1018466, 233787],
  '10455': [1007889, 236616],
  '10037': [1001661, 235627],
  '10024': [991450, 225457],
  '10454': [1007449, 232863],
  '10026': [997179, 231835],
  '10025': [993331, 230012],
  '10035': [1006595, 228454],
  '11101': [1001319, 211034],
  '11364': [1051553, 211923],
  '10018': [984278, 215509],
  '10020': [990012, 215729],
  '11005': [1064789, 214295],
  '10017': [991869, 213252],
  '10001': [983613, 213360],
  '10011': [982781, 210664],
  '10016': [990291, 210665],
  '11104': [1006224, 210564],
  '11109': [996054, 210740],
  '10010': [988989, 208515],
  '11367': [1032392, 205392],
  '10014': [982449, 206620],
  '10003': [987465, 205563],
  '11222': [998773, 204620],
  '11379': [1017432, 200740],
  '11429': [1056859, 198057],
  '11435': [1036960, 195018],
  '11415': [1031798, 197376],
  '11418': [1031001, 193330],
  '11433': [1043368, 193721],
  '11451': [1039899, 194697],
  '11221': [1004438, 191873],
  '11421': [1023878, 191241],
  '11372': [1016528, 213126],
  '11004': [1065606, 210363],
  '11040': [1065956, 213534],
  '10002': [988242, 200171],
  '10314': [939259, 155728],
  '11228': [980891, 164066],
  '11209': [976172, 165379],
  '10304': [962458, 165679],
  '10456': [1007883, 242372],
  '10472': [1021444, 241624],
  '10031': [998088, 239814],
  '10039': [1001519, 240436],
  '10459': [1013835, 240084],
  '10451': [1005368, 238290],
  '10473': [1022475, 237217],
  '10030': [1000193, 237302],
  '10027': [999088, 234131],
  '10461': [1028296, 247902],
  '10457': [1012388, 247405],
  '10460': [1015132, 243510],
  '10032': [1000382, 244917],
  '10452': [1005446, 244483],
  '11414': [1027256, 178677],
  '11232': [983612, 177801],
  '10034': [1005713, 255122],
  '10033': [1001707, 248780],
  '10462': [1020685, 249420],
  '10040': [1003863, 251914],
  '10453': [1008152, 249805],
  '11102': [1004636, 220364],
  '10021': [997020, 219120],
  '11361': [1047797, 217779],
  '11358': [1040709, 216377],
  '11362': [1057749, 215220],
  '10044': [996385, 214347],
  '11369': [1019957, 217722],
  '11103': [1008295, 217197],
  '11106': [1001397, 217519],
  '11368': [1024870, 212082],
  '11377': [1010574, 210678],
  '10036': [985413, 216821],
  '11355': [1033762, 213010],
  '10302': [945946, 169124],
  '10465': [1031495, 239091],
  '11691': [1053783, 158810],
  '11096': [1054217, 162199],
  '11223': [991665, 156781],
  '11208': [1019700, 184749],
  '11207': [1013544, 183721],
  '11413': [1053380, 183328],
  '11217': [989547, 187967],
  '11238': [994291, 186584],
  '11231': [983057, 186217],
  '11422': [1057272, 180607],
  '11420': [1036899, 184708],
  '11417': [1027410, 185709],
  '11215': [989882, 181773],
  '11357': [1036533, 225804],
  '10029': [999950, 227538],
  '00083': [991590, 220538],
  '11356': [1028115, 225277],
  '11359': [1046026, 228012],
  '10303': [933820, 171004],
  '11234': [1004323, 163783],
  '11360': [1044984, 223892],
  '11105': [1011836, 221755],
  '10128': [997765, 224257],
  '11371': [1022003, 220457],
  '10023': [988765, 222068],
  '11363': [1055047, 220385],
  '10028': [995910, 222872],
  '11354': [1032198, 219054],
  '11216': [998312, 187241],
  '11416': [1025796, 188584],
  '11233': [1006523, 186300],
  '11436': [1040697, 185554],
  '11213': [1000284, 183308],
  '11212': [1008387, 180764],
  '11225': [997345, 180829],
  '11218': [990799, 173649],
  '11226': [995711, 174598],
  '11219': [985166, 169604],
  '11210': [999101, 167896],
  '11230': [993494, 166072],
  '11419': [1033365, 190202],
  '11434': [1046577, 185969],
  '11204': [987887, 164576],
  '10471': [1012587, 266570],
  '10470': [1024748, 268409],
  '10466': [1024313, 263999],
  '10467': [1019786, 258782],
  '11430': [1043607, 175068],
  '11203': [1002509, 175950],
  '10469': [1026678, 255623],
  '10468': [1013897, 258046],
  '10458': [1015534, 253712],
  '11378': [1009641, 202115],
  '10009': [990043, 203961],
  '10012': [984832, 203596],
  '10013': [982892, 201665],
  '10007': [982504, 199552],
  '11237': [1004600, 197083],
  '11385': [1011367, 195195],
  '10038': [983418, 197803],
  '11206': [1000221, 195003],
  '10006': [980563, 197293],
  '11412': [1050773, 193231],
  '10005': [981339, 197038],
  '11251': [993428, 194599],
  '11411': [1057763, 192413],
  '11201': [986968, 192156],
  '10004': [972576, 193652],
  '11205': [995897, 192159],
  '10305': [963310, 156060],
  '11229': [999717, 158278],
  '11214': [984000, 159330],
  '10306': [950937, 145144],
  '11694': [1025530, 149310],
  '11224': [984306, 149092],
  '10308': [942704, 140020],
  '10282': [979981, 200244],
  '11211': [999857, 199848],
  '11249': [993704, 198278],
  '11370': [1016758, 227518],
  '10065': [994666, 217698],
  '10075': [995301, 221633],
  '10069': [987047, 221849],
  '10281': [980036, 198787],
  '11373': [1017948, 208465],
  '10279': [981949, 198823],
  '10165': [990124, 213288],
  '10168': [990733, 212960],
  '10105': [990067, 217259],
  '10118': [988212, 211939],
  '10176': [990123, 214490],
  '10162': [997739, 219667],
  '10170': [990955, 213470],
  '10112': [989735, 215947],
  '10122': [986550, 213178],
  '10107': [989098, 218425],
  '10103': [990705, 216275],
  '10174': [991094, 213106],
  '10166': [990733, 213798],
  '10169': [990872, 214089],
  '10167': [991259, 214199],
  '10177': [990927, 214381],
  '10172': [991398, 214417],
  '10171': [991426, 214709],
  '10270': [982060, 196710],
  '10104': [990123, 216312],
  '10271': [981339, 197293],
  '10110': [989486, 213943],
  '10175': [989847, 214016],
  '10151': [991702, 217332],
  '10173': [990040, 213907],
  '10178': [990429, 212814],
  '10119': [986217, 213068],
  '10121': [986439, 212486],
  '10123': [986827, 213032],
  '10106': [989624, 218024],
  '10158': [991177, 212122],
  '10041': [981727, 195435],
  '10120': [987242, 212449],
  '10278': [983113, 199880],
  '10155': [993143, 216531],
  '10043': [982337, 195836],
  '10081': [981838, 197074],
  '10096': [989071, 214235],
  '10097': [988461, 216931],
  '10196': [989458, 214963],
  '10275': [980368, 196382],
  '10265': [982060, 196164],
  '10045': [981866, 197329],
  '10047': [988047, 208660],
  '10080': [980785, 198167],
  '10203': [981062, 196965],
  '10259': [981478, 197439],
  '10260': [981921, 196564],
  '10285': [980147, 199224],
  '10286': [981727, 196637],
  '10463': [1007644, 260043],
  '10475': [1030489, 258509],
  '10464': [1036131, 258338],
  '10309': [923594, 132955],
  '10307': [916899, 124411],
  '10280': [979509, 197257],
  '10048': [980812, 198532],
  '10055': [991564, 215802],
  '10019': [989652, 217477],
  '10111': [990483, 215838],
  '10153': [991896, 217478],
  '10154': [991896, 215328],
  '10152': [991979, 215584],
  '10115': [994299, 234675],
  '10022': [993087, 215620],
  '11235': [1000973, 149936],
  '11693': [1036606, 153266],
  '11692': [1041045, 155461],
  '11697': [1009230, 143240],
  '10312': [935583, 136827],
  '11239': [1021573, 175899],
  '11236': [1011642, 172461],
  '11220': [979421, 172519],
  '10301': [961077, 172967],
  '10310': [950582, 169591],
  '11426': [1060737, 207724],
  '11365': [1041364, 208618],
  '11001': [1065508, 206646],
  '11375': [1026883, 201848],
  '11427': [1053373, 205042],
  '11374': [1022389, 203771],
  '11366': [1039491, 203659],
  '11423': [1048812, 200621],
  '11428': [1055655, 202207],
  '11432': [1041634, 200093]
}

export default Geoclient
