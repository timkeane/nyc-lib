import Waze from 'nyc/ol/format/Waze'
import OlFormatFeature from 'ol/format/Feature'
import OlFormatFormatType from 'ol/format/FormatType'
import LineString from 'ol/geom/LineString'

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
  const json = '{"alerts":[{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":3,"confidence":0,"reliability":6,"type":"WEATHERHAZARD","uuid":"03769afc-d16d-376a-b5ed-628ade6beedf","roadType":4,"magvar":17,"subtype":"HAZARD_ON_SHOULDER_CAR_STOPPED","location":{"x":-74.183931,"y":40.605333},"pubMillis":1553289137190},{"country":"US","nThumbsUp":0,"magvar":0,"subtype":"HAZARD_ON_ROAD_CONSTRUCTION","reportRating":0,"confidence":5,"reliability":10,"reportDescription":"XCM:Long term road construction New Jersey Turnpike SB","location":{"x":-74.266732,"y":40.556061},"type":"WEATHERHAZARD","uuid":"bb53aa5b-ef97-33f5-8b3a-84a4a7dfadf4","pubMillis":1536410580000}],"endTimeMillis":1553290740000,"irregularities":[{"country":"US","nThumbsUp":3,"updateDate":"Fri Mar 22 21:39:35 +0000 2019","trend":-1,"city":"Brooklyn, NY","line":[{"x":-73.908038,"y":40.596345},{"x":-73.908303,"y":40.595727},{"x":-73.908408,"y":40.595425},{"x":-73.908543,"y":40.594828},{"x":-73.908587,"y":40.594531},{"x":-73.908598,"y":40.594189},{"x":-73.908615,"y":40.593916},{"x":-73.908595,"y":40.593537},{"x":-73.90852,"y":40.592963},{"x":-73.90829,"y":40.591847},{"x":-73.908288,"y":40.591061},{"x":-73.90834,"y":40.590567},{"x":-73.908585,"y":40.589779},{"x":-73.909244,"y":40.588595},{"x":-73.909898,"y":40.58786},{"x":-73.910737,"y":40.587112},{"x":-73.91389,"y":40.585377},{"x":-73.914723,"y":40.585068},{"x":-73.915991,"y":40.584652},{"x":-73.917963,"y":40.584263},{"x":-73.919437,"y":40.58408},{"x":-73.920992,"y":40.583989},{"x":-73.922388,"y":40.583986},{"x":-73.923064,"y":40.584014},{"x":-73.924143,"y":40.584136},{"x":-73.925931,"y":40.584339},{"x":-73.926515,"y":40.584451},{"x":-73.928765,"y":40.585002},{"x":-73.932276,"y":40.586063},{"x":-73.932719,"y":40.586159},{"x":-73.933177,"y":40.586241},{"x":-73.933671,"y":40.586304},{"x":-73.934038,"y":40.586328},{"x":-73.934508,"y":40.586344},{"x":-73.934875,"y":40.58634},{"x":-73.935245,"y":40.586316},{"x":-73.935854,"y":40.586261},{"x":-73.936616,"y":40.586161},{"x":-73.938151,"y":40.585912},{"x":-73.940055,"y":40.585562},{"x":-73.941939,"y":40.585275},{"x":-73.943906,"y":40.585028},{"x":-73.945793,"y":40.584843},{"x":-73.948541,"y":40.584654},{"x":-73.94978,"y":40.584607},{"x":-73.950936,"y":40.584659},{"x":-73.951468,"y":40.584716},{"x":-73.952135,"y":40.584854},{"x":-73.952135,"y":40.584853},{"x":-73.954193,"y":40.585113},{"x":-73.955489,"y":40.585163},{"x":-73.957391,"y":40.58511},{"x":-73.958058,"y":40.585067},{"x":-73.959701,"y":40.584808}],"detectionDateMillis":1553285959922,"type":"Medium","endNode":"Exit 7B: Ocean Pkwy","speed":21.02,"seconds":922,"street":"Belt Pkwy W","jamLevel":3,"id":76745544,"nComments":0,"highway":true,"delaySeconds":697,"severity":2,"driversCount":446,"alertsCount":8,"length":5389,"updateDateMillis":1553290775986,"nImages":0,"alerts":[{"country":"US","nThumbsUp":0,"city":"Brooklyn, NY","reportRating":4,"confidence":1,"reliability":7,"type":"JAM","uuid":"7334deee-9be5-3129-8828-2ebc9e4e8f4b","roadType":3,"magvar":187,"subtype":"JAM_STAND_STILL_TRAFFIC","street":"Belt Pkwy W","location":{"x":-73.908521,"y":40.594693},"pubMillis":1553289290536},{"country":"US","nThumbsUp":1,"city":"Brooklyn, NY","reportRating":2,"confidence":0,"reliability":6,"type":"JAM","uuid":"153d056c-3620-3489-934b-09896531ba3e","roadType":3,"magvar":185,"subtype":"JAM_HEAVY_TRAFFIC","street":"Belt Pkwy W","location":{"x":-73.908311,"y":40.590853},"pubMillis":1553289217969},{"country":"US","nThumbsUp":2,"city":"Brooklyn, NY","reportRating":2,"confidence":0,"reliability":8,"type":"ACCIDENT","uuid":"2e4d3b60-b3a5-37cf-aa5b-6090d122a08b","roadType":3,"magvar":235,"subtype":"","street":"Belt Pkwy W","location":{"x":-73.912986,"y":40.585875},"pubMillis":1553290171002},{"country":"US","nThumbsUp":0,"city":"Brooklyn, NY","reportRating":2,"confidence":1,"reliability":8,"type":"JAM","uuid":"bdd6046a-6514-39b1-bd19-56753c2fe605","roadType":3,"magvar":263,"subtype":"JAM_HEAVY_TRAFFIC","street":"Belt Pkwy W","location":{"x":-73.919993,"y":40.584048},"pubMillis":1553288310802},{"country":"US","nThumbsUp":0,"city":"Brooklyn, NY","reportRating":3,"confidence":0,"reliability":6,"type":"JAM","uuid":"5cb11940-cef9-320b-ae2a-cca84a62c6c2","roadType":3,"magvar":290,"subtype":"JAM_STAND_STILL_TRAFFIC","street":"Belt Pkwy W","location":{"x":-73.929693,"y":40.585295},"pubMillis":1553290164419}],"detectionDate":"Fri Mar 22 20:19:19 +0000 2019","regularSpeed":40.43},{"country":"US","nThumbsUp":1,"updateDate":"Fri Mar 22 21:39:29 +0000 2019","trend":-1,"city":"Staten Island, NY","line":[{"x":-74.174675,"y":40.622297},{"x":-74.174348,"y":40.622135},{"x":-74.17411,"y":40.622026},{"x":-74.173805,"y":40.621905},{"x":-74.17326,"y":40.621723},{"x":-74.172554,"y":40.621554},{"x":-74.172071,"y":40.62148},{"x":-74.171713,"y":40.621429},{"x":-74.171492,"y":40.621407},{"x":-74.170412,"y":40.621286},{"x":-74.169814,"y":40.621199},{"x":-74.169514,"y":40.621156},{"x":-74.169368,"y":40.621128},{"x":-74.169043,"y":40.621067},{"x":-74.168582,"y":40.620947},{"x":-74.167755,"y":40.620701},{"x":-74.166076,"y":40.619959},{"x":-74.165396,"y":40.619681},{"x":-74.164926,"y":40.61946},{"x":-74.163667,"y":40.618912},{"x":-74.161923,"y":40.617973},{"x":-74.161238,"y":40.617576},{"x":-74.160605,"y":40.617184},{"x":-74.158458,"y":40.615707},{"x":-74.15818,"y":40.615476},{"x":-74.1562,"y":40.613953},{"x":-74.152677,"y":40.611244},{"x":-74.150877,"y":40.609861},{"x":-74.150439,"y":40.609523},{"x":-74.149748,"y":40.609091},{"x":-74.149414,"y":40.608922},{"x":-74.148842,"y":40.608618},{"x":-74.148184,"y":40.608344},{"x":-74.147599,"y":40.608134},{"x":-74.147019,"y":40.60797},{"x":-74.146323,"y":40.607794},{"x":-74.1456,"y":40.607646},{"x":-74.144969,"y":40.607549},{"x":-74.144188,"y":40.607489},{"x":-74.143483,"y":40.607456},{"x":-74.143159,"y":40.607454},{"x":-74.142611,"y":40.607486},{"x":-74.141337,"y":40.607558},{"x":-74.139743,"y":40.607627},{"x":-74.136279,"y":40.607807},{"x":-74.133936,"y":40.607944},{"x":-74.132628,"y":40.608015},{"x":-74.131275,"y":40.608092},{"x":-74.129945,"y":40.608177},{"x":-74.129074,"y":40.608236},{"x":-74.128215,"y":40.608325},{"x":-74.127381,"y":40.608429},{"x":-74.126233,"y":40.608592},{"x":-74.125244,"y":40.608759},{"x":-74.124242,"y":40.608956},{"x":-74.123228,"y":40.609175},{"x":-74.122297,"y":40.609392},{"x":-74.121382,"y":40.609637},{"x":-74.119653,"y":40.610143},{"x":-74.118264,"y":40.610576},{"x":-74.117102,"y":40.610899},{"x":-74.116381,"y":40.611019},{"x":-74.116012,"y":40.611062},{"x":-74.115642,"y":40.611092},{"x":-74.114889,"y":40.611117},{"x":-74.11434,"y":40.611093},{"x":-74.113791,"y":40.611056},{"x":-74.112984,"y":40.610924},{"x":-74.11084,"y":40.6104},{"x":-74.110196,"y":40.610249},{"x":-74.109592,"y":40.610166},{"x":-74.108996,"y":40.610123},{"x":-74.108534,"y":40.610116},{"x":-74.108072,"y":40.610128},{"x":-74.107156,"y":40.610157},{"x":-74.105333,"y":40.610225},{"x":-74.103402,"y":40.6103},{"x":-74.100721,"y":40.610405},{"x":-74.097588,"y":40.610518},{"x":-74.096733,"y":40.610551},{"x":-74.096118,"y":40.610542},{"x":-74.095736,"y":40.610522},{"x":-74.094993,"y":40.610446},{"x":-74.094566,"y":40.610374},{"x":-74.093885,"y":40.610234},{"x":-74.09329,"y":40.610067},{"x":-74.092708,"y":40.609878},{"x":-74.091581,"y":40.609412},{"x":-74.08688,"y":40.607419},{"x":-74.086101,"y":40.607128},{"x":-74.085309,"y":40.606858},{"x":-74.084882,"y":40.606739},{"x":-74.084459,"y":40.606626},{"x":-74.083827,"y":40.606481},{"x":-74.083188,"y":40.606359},{"x":-74.082562,"y":40.606271},{"x":-74.081937,"y":40.606203},{"x":-74.081125,"y":40.606148},{"x":-74.080323,"y":40.606119},{"x":-74.078359,"y":40.606063},{"x":-74.077284,"y":40.606042}],"detectionDateMillis":1553290335837,"type":"Medium","endNode":"I-278 E / Verrazzano Br / Upper Level","speed":31.220000000000002,"seconds":1034,"street":"I-278 E / Staten Island Expwy","jamLevel":3,"id":76986232,"nComments":0,"highway":true,"delaySeconds":689,"severity":3,"driversCount":785,"alertsCount":8,"length":8972,"updateDateMillis":1553290769348,"nImages":0,"alerts":[{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":1,"confidence":0,"reliability":5,"type":"JAM","uuid":"7e7c942b-9ae5-3d95-935c-b3d7e1826838","roadType":3,"magvar":110,"subtype":"JAM_STAND_STILL_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.168727,"y":40.620977},"pubMillis":1553290749008},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":2,"confidence":0,"reliability":6,"type":"JAM","uuid":"d36bc903-cd09-3007-b6bc-2ebe41d00b60","roadType":3,"magvar":85,"subtype":"JAM_HEAVY_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.133596,"y":40.607965},"pubMillis":1553290626616},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":2,"confidence":0,"reliability":5,"type":"JAM","uuid":"31543ab6-a39d-385a-9db5-5355010a2ead","roadType":3,"magvar":80,"subtype":"JAM_HEAVY_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.127587,"y":40.608404},"pubMillis":1553290689702},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":2,"confidence":0,"reliability":5,"type":"JAM","uuid":"3c735e76-8b20-3c87-9716-be3e82642473","roadType":3,"magvar":73,"subtype":"JAM_HEAVY_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.117185,"y":40.610873},"pubMillis":1553290812707},{"country":"US","nThumbsUp":1,"city":"Staten Island, NY","reportRating":1,"confidence":2,"reliability":9,"type":"JAM","uuid":"9e4564ea-62cd-346c-8fed-3d445849b0b6","roadType":3,"magvar":105,"subtype":"JAM_HEAVY_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.113293,"y":40.610946},"pubMillis":1553288957449},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":4,"confidence":0,"reliability":5,"type":"JAM","uuid":"473eb786-4f7a-3f31-9b9d-1551ec50c3bb","roadType":3,"magvar":105,"subtype":"","street":"I-278 E / Staten Island Expwy","location":{"x":-74.110515,"y":40.610336},"pubMillis":1553289395518},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":4,"confidence":0,"reliability":5,"type":"ACCIDENT","uuid":"c7086162-937d-338f-b9a9-e5f7b6260743","roadType":3,"magvar":87,"subtype":"ACCIDENT_MAJOR","street":"I-278 E / Staten Island Expwy","location":{"x":-74.101463,"y":40.610376},"pubMillis":1553290648035},{"country":"US","nThumbsUp":0,"city":"Staten Island, NY","reportRating":4,"confidence":0,"reliability":6,"type":"JAM","uuid":"ed735042-04ce-3ff8-a71d-d8b3ed9a23d3","roadType":3,"magvar":115,"subtype":"JAM_STAND_STILL_TRAFFIC","street":"I-278 E / Staten Island Expwy","location":{"x":-74.086463,"y":40.60727},"pubMillis":1553289516206}],"causeType":"WEATHERHAZARD","detectionDate":"Fri Mar 22 21:32:15 +0000 2019","regularSpeed":57.27}],"startTimeMillis":1553290680000,"startTime":"2019-03-22 21:38:00:000","endTime":"2019-03-22 21:39:00:000","jams":[{"country":"US","city":"Perth Amboy, NJ","level":3,"line":[{"x":-74.277641,"y":40.513274},{"x":-74.276634,"y":40.513002},{"x":-74.276048,"y":40.512839}],"speedKMH":12.65,"length":755,"turnType":"NONE","type":"NONE","uuid":411005085,"endNode":"New Brunswick Ave","speed":3.513888888888889,"segments":[{},{},{},{},{},{},{},{}],"roadType":2,"delay":128,"street":"Fayette St","id":411005085,"pubMillis":1553290846053},{"country":"US","city":"Perth Amboy, NJ","level":2,"line":[{"x":-74.281729,"y":40.510681},{"x":-74.28088,"y":40.510443},{"x":-74.279966,"y":40.510189}],"speedKMH":18.43,"length":974,"turnType":"NONE","type":"NONE","uuid":431427598,"endNode":"High St","speed":5.1194444444444445,"segments":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"roadType":2,"delay":89,"street":"Market St","id":431427598,"pubMillis":1553290849213}]}'

  test('readFeatures', () => {
    expect.assertions(70)
    
    const data = JSON.parse(json)
    
    const waze = new Waze()

    const features = waze.readFeatures(json)

    expect(features.length).toBe(6)
    expect(features[0].getGeometry().getCoordinates()).toEqual([
      [-8268549.17344558, 4940812.612859795],
      [-8268437.074718351, 4940772.785669192],
      [-8268371.841496747, 4940748.918716943]
    ])


    data.jams.forEach((jam, i) => {
      Object.keys(jam).forEach(key => {
        expect(features[i].get(key)).toEqual(jam[key])
        expect(features[i].getGeometry().getCoordinates()).toEqual(lineFromWaze(jam.line))
      })
    })

  })
})

const lineFromWaze = (line)  => {
  const coords = []
  line.forEach(coord => {
    coords.push([coord.x, coord.y])
  })
  return (new LineString(coords)).transform('EPSG:4326', 'EPSG:3857').getCoordinates()
}