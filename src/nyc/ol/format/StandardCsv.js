/**
 * @module nyc/ol/format/StandardCsv
 */

/**
 * @desc A standard set of colums for CSV data to be used with {@link module:nyc/ol/FrameworkMap~FrameworkMap}.
 *  CSV data must include NAME and ADDR1.
 *  CSV data must include X and Y or LNG and LAT.
 *  If X and Y are included the projection of the data is assumed to be EPSG:2263.
 *  If LAT and LNG are included and X and Y are not the projection of the data is assumed to be EPSG:4326.
 *  CSV data must include CITY or BORO.
 * @public
 * @static
 * @class
 */
class StandardCsv {}
/**
 * @desc The Identifier column name - ID
 * @public
 * @const {string}
 */
StandardCsv.ID = 'ID'
/**
 * @desc The X ordinate column name - X
 * @public
 * @const {string}
 */
StandardCsv.X = 'X'
/**
 * @desc The Y ordinate column name - Y
 * @public
 * @const {string}
 */
StandardCsv.Y = 'Y'
/**
 * @desc The Longitude column name - LNG
 * @public
 * @const {string}
 */
StandardCsv.LNG = 'LNG'
/**
 * @desc The Latitude column name - LAT
 * @public
 * @const {string}
 */
StandardCsv.LAT = 'LAT'
/**
 * @desc The Name column name - NAME
 * @public
 * @const {string}
 */
StandardCsv.NAME = 'NAME'
/**
 * @desc The Address Line 1 column name - ADDR1
 * @public
 * @const {string}
 */
StandardCsv.ADDR1 = 'ADDR1'
/**
 * @desc The Address Line 2 column name - ADDR2
 * @public
 * @const {string}
 */
StandardCsv.ADDR2 = 'ADDR2'
/**
 * @desc The City column name - CITY
 * @public
 * @const {string}
 */
StandardCsv.CITY = 'CITY'
/**
 * @desc The Borough column name - BORO
 * @public
 * @const {string}
 */
StandardCsv.BORO = 'BORO'
/**
 * @desc The State column name - STATE
 * @public
 * @const {string}
 */
StandardCsv.STATE = 'STATE'
/**
 * @desc The ZIP Code column name - ZIP
 * @public
 * @const {string}
 */
StandardCsv.ZIP = 'ZIP'
/**
 * @desc The Phone Number column name - PHONE
 * @public
 * @const {string}
 */
StandardCsv.PHONE = 'PHONE'
/**
 * @desc The Email column name - EMAIL
 * @public
 * @const {string}
 */
StandardCsv.EMAIL = 'EMAIL'
/**
 * @desc The Web Site column name - WEBSITE
 * @public
 * @const {string}
 */
StandardCsv.WEBSITE = 'WEBSITE'
/**
 * @desc The Details column name - DETAIL
 * @public
 * @const {string}
 */
StandardCsv.DETAIL = 'DETAIL'

export default StandardCsv
