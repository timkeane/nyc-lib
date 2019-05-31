import Waze from 'nyc/ol/format/Waze'
import OlFormatFeature from 'ol/format/Feature'
import OlFormatFormatType from 'ol/format/FormatType'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'

jest.mock('ol/format/Feature')

beforeEach(() => {
  OlFormatFeature.mockClear()
})

describe('constructor', () => {
  test('constructor no options', () => {
    expect.assertions(4)
    
    const waze = new Waze()

    expect(OlFormatFeature).toHaveBeenCalledTimes(1)
    expect(OlFormatFeature.mock.calls[0][0]).toBeUndefined()
    expect(waze.dataProjection).toBe('EPSG:4326')
    expect(waze.featureProjection).toBe('EPSG:3857')
  })

  test('constructor option for featureProjection', () => {
    expect.assertions(4)
    
    const waze = new Waze({featureProjection: 'EPSG:2263'})

    expect(OlFormatFeature).toHaveBeenCalledTimes(1)
    expect(OlFormatFeature.mock.calls[0][0]).toBeUndefined()
    expect(waze.dataProjection).toBe('EPSG:4326')
    expect(waze.featureProjection).toBe('EPSG:2263')
  })
})

test('readProjection', () => {
  expect.assertions(1)
    
  const waze = new Waze()

  expect(waze.readProjection()).toBe('EPSG:4326')
})

test('getLastExtent', () => {
  expect.assertions(1)
    
  const waze = new Waze()

  expect(waze.getLastExtent()).toBeNull()
})

test('getType', () => {
  expect.assertions(1)
    
  const waze = new Waze()

  expect(waze.getType()).toBe(OlFormatFormatType.TEXT)
})

describe('readFeatures', () => {
  const json = '{"alerts":[{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":3,"confidence":0,"reliability":6,"type":"WEATHERHAZARD","uuid":"03769afc-d16d-376a-b5ed-628ade6beedf","roadType":4,"magvar":17,"subtype":"HAZARD_ON_SHOULDER_CAR_STOPPED","location":{"x":-74.183931,"y":40.605333},"pubMillis":1553289137190},{"country":"US","nThumbsUp":0,"magvar":0,"subtype":"HAZARD_ON_ROAD_CONSTRUCTION","reportRating":0,"confidence":5,"reliability":10,"reportDescription":"XCM:Long term road construction New Jersey Turnpike SB","location":{"x":-74.266732,"y":40.556061},"type":"WEATHERHAZARD","uuid":"bb53aa5b-ef97-33f5-8b3a-84a4a7dfadf4","pubMillis":1536410580000}],"endTimeMillis":1553290740000,"irregularities":[{"country":"US","nThumbsUp":3,"updateDate":"Fri Mar 22 21:39:35 +0000 2019","trend":-1,"city":"Brooklyn, NY","line":[{"x":-73.908038,"y":40.596345},{"x":-73.908303,"y":40.595727},{"x":-73.908408,"y":40.595425}],"detectionDateMillis":1553285959922,"type":"Medium","endNode":"Exit 7B: Ocean Pkwy","speed":21.02,"seconds":922,"street":"Belt Pkwy W","jamLevel":3,"id":76745544,"nComments":0,"highway":true,"delaySeconds":697,"severity":2,"driversCount":446,"alertsCount":8,"length":5389,"updateDateMillis":1553290775986,"nImages":0,"alerts":[{"country":"US","nThumbsUp":0,"city":"Brooklyn, NY","reportRating":4,"confidence":1,"reliability":7,"type":"JAM","uuid":"7334deee-9be5-3129-8828-2ebc9e4e8f4b","roadType":3,"magvar":187,"subtype":"JAM_STAND_STILL_TRAFFIC","street":"Belt Pkwy W","location":{"x":-73.908521,"y":40.594693},"pubMillis":1553289290536},{"country":"US","nThumbsUp":1,"city":"Brooklyn, NY","reportRating":2,"confidence":0,"reliability":6,"type":"JAM","uuid":"153d056c-3620-3489-934b-09896531ba3e","roadType":3,"magvar":185,"subtype":"JAM_HEAVY_TRAFFIC","street":"Belt Pkwy W","location":{"x":-73.908311,"y":40.590853},"pubMillis":1553289217969},{"country":"US","nThumbsUp":2,"city":"Brooklyn, NY","reportRating":2,"confidence":0,"reliability":8,"type":"ACCIDENT","uuid":"2e4d3b60-b3a5-37cf-aa5b-6090d122a08b","roadType":3,"magvar":235,"subtype":"","street":"Belt Pkwy W","location":{"x":-73.912986,"y":40.585875},"pubMillis":1553290171002},{"country":"US","nThumbsUp":0,"city":"Brooklyn, NY","reportRating":2,"confidence":1,"reliability":8,"type":"JAM","uuid":"bdd6046a-6514-39b1-bd19-56753c2fe605","roadType":3,"magvar":263,"subtype":"JAM_HEAVY_TRAFFIC","street":"Belt Pkwy W","location":{"x":-73.919993,"y":40.584048},"pubMillis":1553288310802},{"country":"US","nThumbsUp":0,"city":"Brooklyn, NY","reportRating":3,"confidence":0,"reliability":6,"type":"JAM","uuid":"5cb11940-cef9-320b-ae2a-cca84a62c6c2","roadType":3,"magvar":290,"subtype":"JAM_STAND_STILL_TRAFFIC","street":"Belt Pkwy W","location":{"x":-73.929693,"y":40.585295},"pubMillis":1553290164419}],"detectionDate":"Fri Mar 22 20:19:19 +0000 2019","regularSpeed":40.43},{"country":"US","nThumbsUp":1,"updateDate":"Fri Mar 22 21:39:29 +0000 2019","trend":-1,"city":"Staten Island, NY","line":[{"x":-74.174675,"y":40.622297},{"x":-74.174348,"y":40.622135},{"x":-74.17411,"y":40.622026}],"detectionDateMillis":1553290335837,"type":"Medium","endNode":"I-278 E / Verrazzano Br / Upper Level","speed":31.220000000000002,"seconds":1034,"street":"I-278 E / Staten Island Expwy","jamLevel":3,"id":76986232,"nComments":0,"highway":true,"delaySeconds":689,"severity":3,"driversCount":785,"alertsCount":8,"length":8972,"updateDateMillis":1553290769348,"nImages":0,"alerts":[{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":1,"confidence":0,"reliability":5,"type":"JAM","uuid":"7e7c942b-9ae5-3d95-935c-b3d7e1826838","roadType":3,"magvar":110,"subtype":"JAM_STAND_STILL_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.168727,"y":40.620977},"pubMillis":1553290749008},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":2,"confidence":0,"reliability":6,"type":"JAM","uuid":"d36bc903-cd09-3007-b6bc-2ebe41d00b60","roadType":3,"magvar":85,"subtype":"JAM_HEAVY_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.133596,"y":40.607965},"pubMillis":1553290626616},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":2,"confidence":0,"reliability":5,"type":"JAM","uuid":"31543ab6-a39d-385a-9db5-5355010a2ead","roadType":3,"magvar":80,"subtype":"JAM_HEAVY_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.127587,"y":40.608404},"pubMillis":1553290689702},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":2,"confidence":0,"reliability":5,"type":"JAM","uuid":"3c735e76-8b20-3c87-9716-be3e82642473","roadType":3,"magvar":73,"subtype":"JAM_HEAVY_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.117185,"y":40.610873},"pubMillis":1553290812707},{"country":"US","nThumbsUp":1,"city":"Staten Island, NY","reportRating":1,"confidence":2,"reliability":9,"type":"JAM","uuid":"9e4564ea-62cd-346c-8fed-3d445849b0b6","roadType":3,"magvar":105,"subtype":"JAM_HEAVY_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.113293,"y":40.610946},"pubMillis":1553288957449},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":4,"confidence":0,"reliability":5,"type":"JAM","uuid":"473eb786-4f7a-3f31-9b9d-1551ec50c3bb","roadType":3,"magvar":105,"subtype":"","street":"I-278 E / Staten Island Expwy","location":{"x":-74.110515,"y":40.610336},"pubMillis":1553289395518},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":4,"confidence":0,"reliability":5,"type":"ACCIDENT","uuid":"c7086162-937d-338f-b9a9-e5f7b6260743","roadType":3,"magvar":87,"subtype":"ACCIDENT_MAJOR","street":"I-278 E / Staten Island Expwy","location":{"x":-74.101463,"y":40.610376},"pubMillis":1553290648035},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":4,"confidence":0,"reliability":6,"type":"JAM","uuid":"ed735042-04ce-3ff8-a71d-d8b3ed9a23d3","roadType":3,"magvar":115,"subtype":"JAM_STAND_STILL_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.086463,"y":40.60727},"pubMillis":1553289516206}],"causeType":"WEATHERHAZARD","detectionDate":"Fri Mar 22 21:32:15 +0000 2019","regularSpeed":57.27}],"startTimeMillis":1553290680000,"startTime":"2019-03-22 21:38:00:000","endTime":"2019-03-22 21:39:00:000","jams":[{"country":"US","city":"Perth Amboy, NJ","level":3,"line":[{"x":-74.277641,"y":40.513274},{"x":-74.276634,"y":40.513002},{"x":-74.276048,"y":40.512839}],"speedKMH":12.65,"length":755,"turnType":"NONE","type":"NONE","uuid":411005085,"endNode":"New Brunswick Ave","speed":3.513888888888889,"segments":[{},{},{}],"roadType":2,"delay":128,"street":"Fayette St","id":411005085,"pubMillis":1553290846053},{"country":"US","city":"Perth Amboy, NJ","level":2,"line":[{"x":-74.281729,"y":40.510681},{"x":-74.28088,"y":40.510443},{"x":-74.279966,"y":40.510189}],"speedKMH":18.43,"length":974,"turnType":"NONE","type":"NONE","uuid":431427598,"endNode":"High St","speed":5.1194444444444445,"segments":[{},{},{}],"roadType":2,"delay":89,"street":"Market St","id":431427598,"pubMillis":1553290849213}]}'

  test('readFeatures', () => {
    expect.assertions(68)
    
    const data = JSON.parse(json)
    
    const waze = new Waze()

    const features = waze.readFeatures(json)

    expect(features.length).toBe(4)

    data.alerts.forEach((alert, i) => {
      const f = featureFromUuid(alert.uuid, features)
      expect(f.getStyle()).toBe(Waze.Style)
      expect(f.getGeometry().getCoordinates()).toEqual(pointFromWaze(alert.location))
      Object.keys(alert).forEach(key => {
        expect(f.get(key)).toEqual(alert[key])
      })
    })

    data.jams.forEach((jam, i) => {
      const f = featureFromUuid(jam.uuid, features)
      expect(f.getStyle()).toBe(Waze.Style)
      expect(f.getGeometry().getCoordinates()).toEqual(lineFromWaze(jam.line))
      Object.keys(jam).forEach(key => {
        expect(f.get(key)).toEqual(jam[key])
      })
    })

  })
})

const featureFromUuid = (uuid, features) => {
  let f
  for (let i = 0; i < features.length; i++) {
    if (features[i].getId() === uuid) {
      f = features[i]
      // console.warn(uuid,f);
    }
  }
  return f
}
const lineFromWaze = (line)  => {
  const coords = []
  line.forEach(coord => {
    coords.push([coord.x, coord.y])
  })
  return (new LineString(coords)).transform('EPSG:4326', 'EPSG:3857').getCoordinates()
}

const pointFromWaze = (point)  => {
  return (new Point([point.x, point.y])).transform('EPSG:4326', 'EPSG:3857').getCoordinates()
}