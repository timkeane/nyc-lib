import OlFormatGeoJson from 'ol/format/GeoJSON'

import OlSourceVector from 'ol/source/Vector'

import SocrataJson from 'nyc/ol/source/SocrataJson'
import SocrataJsonFormat from 'nyc/ol/format/SocrataJson'

const json = `[{"base_bbl":"1000200004","bin":"1000803","cnstrct_yr":"1928","doitt_id":"275485","feat_code":"2100","geomsource":"Photogramm","groundelev":"24","heightroof":"458.49550018","lstmoddate":"2017-08-22T00:00:00.000Z","lststatype":"Constructed","mpluto_bbl":"1000200004","shape_area":"16246.180409852","shape_len":"546.74902668765","geom":{"type":"MultiPolygon","coordinates":[[[[-74.01304457862572,40.70632052045842],[-74.01321517225465,40.70611851629881],[-74.01323587395717,40.706127537044296],[-74.01341333391959,40.70620486412582],[-74.01358827831403,40.706281093506675],[-74.01376133552826,40.70635650158023],[-74.01379018533858,40.70636907196765],[-74.013633599994,40.70657718078147],[-74.0135821144968,40.706554747026104],[-74.0134137824291,40.706481398504444],[-74.01324719629538,40.706408809566625],[-74.01308135135197,40.70633654358643],[-74.01304457862572,40.70632052045842]]]]}}
  ,{"base_bbl":"1000970005","bin":"1001326","cnstrct_yr":"1900","doitt_id":"852309","feat_code":"2100","geomsource":"Photogramm","groundelev":"5","heightroof":"60.45","lstmoddate":"2017-08-22T00:00:00.000Z","lststatype":"Constructed","mpluto_bbl":"1000970005","shape_area":"1252.57498399954","shape_len":"188.5244882672","geom":{"type":"MultiPolygon","coordinates":[[[[-74.00182603173869,40.70710012345115],[-74.00187241093413,40.707073663884195],[-74.00202286425545,40.7072562589055],[-74.0020197035897,40.70725792040424],[-74.00197529687047,40.707281276834294],[-74.00182603173869,40.70710012345115]]]]}}
  ,{"base_bbl":"1000760008","bin":"1001179","cnstrct_yr":"1946","doitt_id":"43091","feat_code":"2100","geomsource":"Photogramm","groundelev":"17","heightroof":"57.82","lstmoddate":"2017-08-22T00:00:00.000Z","lststatype":"Constructed","mpluto_bbl":"1000760008","shape_area":"4889.62671501174","shape_len":"380.57937820162","geom":{"type":"MultiPolygon","coordinates":[[[[-74.00523311503459,40.70830940910971],[-74.00539093614763,40.70824305576938],[-74.0054368945422,40.708288068357874],[-74.00551417920087,40.70836376254663],[-74.0054419867544,40.708406445706224],[-74.00552527408277,40.70848801993983],[-74.00552868127441,40.70849135616985],[-74.00562108387545,40.708581856661525],[-74.00555307669444,40.70862278639004],[-74.00545209638875,40.70852388448237],[-74.00526886960459,40.708344428356],[-74.00523311503459,40.70830940910971]]]]}}]`

const urlString = 'https://opendata.gov/resource/data-id.json'

test('constructor url is string', () => {
  expect.assertions(5)

  const socrataJson = new SocrataJson({
    url: urlString,
    id: 'doitt_id',
    geometry: 'geom'
  })

  expect(socrataJson instanceof OlSourceVector).toBe(true)
  expect(socrataJson.getFormat() instanceof SocrataJsonFormat).toBe(true)
  expect(socrataJson.getFormat().id).toBe('doitt_id')
  expect(socrataJson.getFormat().geometry).toBe('geom')
  expect(typeof socrataJson.getUrl()).toBe('function')
})

test('constructor url is function', () => {
  expect.assertions(6)

  const url = jest.fn()

  const socrataJson = new SocrataJson({
    url: url,
    id: 'doitt_id',
    geometry: 'geom'
  })

  expect(socrataJson instanceof OlSourceVector).toBe(true)
  expect(socrataJson.getFormat() instanceof SocrataJsonFormat).toBe(true)
  expect(socrataJson.getFormat().id).toBe('doitt_id')
  expect(socrataJson.getFormat().geometry).toBe('geom')
  expect(typeof socrataJson.getUrl()).toBe('function')
  expect(socrataJson.getUrl()).toBe(url)
})
