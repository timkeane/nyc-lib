/**
 * @module nyc/ol/format/StandardCsv
 */

/**
 * @desc A standard set of colums for CSV data to be used with {@link module:nyc/ol/FrameworkMap~FrameworkMap}.
 *  CSV data must include NAME and ADDR1.
 *  CSV data must include X and Y or LNG and LAT.
 *  If X and Y are included the projection of the data is assumed to be EPSG:2263.
 *  If LAT and LNG are included and, X and Y are not, the projection of the data is assumed to be EPSG:4326.
 *  CSV data must include CITY or BORO.
 */
const csv = {
  ID: 'ID',
  X: 'X',
  Y: 'Y',
  LNG: 'LNG',
  LAT: 'LAT',
  NAME: 'NAME',
  ADDR1: 'ADDR1',
  ADDR2: 'ADDR2',
  CITY: 'CITY',
  CITY: 'BORO',
  STATE: 'STATE',
  ZIP: 'ZIP',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL',
  WEBSITE: 'WEBSITE',
  DETAIL: 'DETAIL'
}

export default csv
