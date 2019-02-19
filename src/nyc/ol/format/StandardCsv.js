/**
 * @module nyc/ol/format/StandardCsv
 */

/**
 * @desc A static class with static members that define a standard set of colums for CSV data to be used with {@link module:nyc/ol/FrameworkMap~FrameworkMap}
 *
 * &bull; CSV data must include <b><i>NAME</i></b> and <b><i>ADDR1</i></b>
 *
 * &bull; CSV data must include <b><i>X</i></b> and <b><i>Y</i></b> or <b><i>LNG</i></b> and <b><i>LAT</i></b>
 * &nbsp;&nbsp;&nbsp;&nbsp;&bull; If <b><i>X</i></b> and <b><i>Y</i></b> are included the projection of the data is assumed to be 'EPSG:2263'
 * &nbsp;&nbsp;&nbsp;&nbsp;&bull; If <b><i>LAT</i></b> and <b><i>LNG</i></b> are includednd <b><i>X</i></b> and <b><i>Y</i></b> are not the projection of the data is assumed to be 'EPSG:4326'
 *
 * &bull; CSV data must include <b><i>CITY</i></b> or <b><i>BORO</i></b>
 *
 * &bull; 'NY' is assumed when <b><i>STATE</i></b> is not included
 * @public
 * @static
 * @class
 */
class StandardCsv {}
/**
 * @desc The Identifier column name - <b></i>ID</i></b>
 * @public
 * @const {string}
 */
StandardCsv.ID = 'ID'
/**
 * @desc The X ordinate column name - <b><i>X</i></b>
 * @public
 * @const {string}
 */
StandardCsv.X = 'X'
/**
 * @desc The Y ordinate column name - <b><i>Y</i></b>
 * @public
 * @const {string}
 */
StandardCsv.Y = 'Y'
/**
 * @desc The Longitude column name - <b><i>LNG</i></b>
 * @public
 * @const {string}
 */
StandardCsv.LNG = 'LNG'
/**
 * @desc The Latitude column name - <b><i>LAT</i></b>
 * @public
 * @const {string}
 */
StandardCsv.LAT = 'LAT'
/**
 * @desc The Name column name - <b><i>NAME</i></b>
 * @public
 * @const {string}
 */
StandardCsv.NAME = 'NAME'
/**
 * @desc The Address Line 1 column name - <b><i>ADDR1</i></b>
 * @public
 * @const {string}
 */
StandardCsv.ADDR1 = 'ADDR1'
/**
 * @desc The Address Line 2 column name - <b><i>ADDR2</i></b>
 * @public
 * @const {string}
 */
StandardCsv.ADDR2 = 'ADDR2'
/**
 * @desc The City column name - <b><i>CITY</i></b>
 * @public
 * @const {string}
 */
StandardCsv.CITY = 'CITY'
/**
 * @desc The Borough column name - <b><i>BORO</i></b>
 * @public
 * @const {string}
 */
StandardCsv.BORO = 'BORO'
/**
 * @desc The State column name - <b><i>STATE</i></b>
 * @public
 * @const {string}
 */
StandardCsv.STATE = 'STATE'
/**
 * @desc The ZIP Code column name - <b><i>ZIP</i></b>
 * @public
 * @const {string}
 */
StandardCsv.ZIP = 'ZIP'
/**
 * @desc The Phone Number column name - <b><i>PHONE</i></b>
 * @public
 * @const {string}
 */
StandardCsv.PHONE = 'PHONE'
/**
 * @desc The Email column name - <b><i>EMAIL</i></b>
 * @public
 * @const {string}
 */
StandardCsv.EMAIL = 'EMAIL'
/**
 * @desc The Web Site column name - <b><i>WEBSITE</i></b>
 * @public
 * @const {string}
 */
StandardCsv.WEBSITE = 'WEBSITE'
/**
 * @desc The Details column name - <b><i>DETAIL</i></b>
 * @public
 * @const {string}
 */
StandardCsv.DETAIL = 'DETAIL'

export default StandardCsv
