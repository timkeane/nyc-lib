import OlPolygon from 'ol/geom/Polygon'
import {getCenter as olExtentGetCenter} from 'ol/extent'
import OlGeoJSON from 'ol/format/GeoJSON'
import OlFeature from 'ol/Feature'

import NycSearch from 'nyc/Search'
import Search from 'nyc/ol/Search'
import NycLocator from 'nyc/Locator'

let target
beforeEach(() => {
  target = $('<div></div>')
  $('body').append(target)
})

afterEach(() => {
  target.remove()
})

test('constructor', () => {
  expect.assertions(5)
  
  const tip = $('<div class="f-tip"></div>')
  $('body').append(tip)
  tip.show()

  const search = new Search(target)

  expect(search instanceof Search).toBe(true)
  expect(search instanceof NycSearch).toBe(true)
  expect(search.geoJson instanceof OlGeoJSON).toBe(true)

  expect(search.getContainer().hasClass('srch-ctr')).toBe(true)

  search.getContainer().trigger('click')

  expect(tip.css('display')).toBe('none')

  tip.remove()
})

test('featureAsLocation', () => {
  expect.assertions(1)

  const options = {
    nameField: 'NAME'
  }
  const geom = new OlPolygon([[0,0], [0,2], [2,2], [2,0], [0,0]])
  const feature = new OlFeature({
    geometry: geom,
    NAME: 'a name',
    foo: 'bar'
  })

  const search = new Search(target)

  const result = search.featureAsLocation(feature, options)

  expect(result).toEqual({
    name: 'a name',
    coordinate: olExtentGetCenter(geom.getExtent()),
    geometry: JSON.parse(search.geoJson.writeGeometry(geom)),
    data: feature.getProperties(),
    type: 'geocoded',
    accuracy: NycLocator.Accuracy.HIGH
  })
})

test('featureAsLocation feature has getName', () => {
  expect.assertions(1)

  const options = {}
  const geom = new OlPolygon([[0,0], [0,2], [2,2], [2,0], [0,0]])
  const feature = new OlFeature({
    geometry: geom,
    foo: 'bar'
  })

  feature.getName = () => {
    return 'a name'
  }

  const search = new Search(target)

  const result = search.featureAsLocation(feature, options)

  expect(result).toEqual({
    name: 'a name',
    coordinate: olExtentGetCenter(geom.getExtent()),
    geometry: JSON.parse(search.geoJson.writeGeometry(geom)),
    data: feature.getProperties(),
    type: 'geocoded',
    accuracy: NycLocator.Accuracy.HIGH
  })
})

