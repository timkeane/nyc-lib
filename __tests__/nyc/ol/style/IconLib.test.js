import IconLib from 'nyc/ol/style/IconLib'
import Layer from 'ol/layer/Vector'

const SVG = [
  `<?xml version="1.0" encoding="UTF-8"?>
  <svg id="danger" version="1.1" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15"></svg>`,
  `<?xml version="1.0" encoding="UTF-8"?>
  <svg id="library" version="1.1" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15"></svg>`
]
const DATA_URI = [
  'data:image/svg+xml;charset=utf-8,%3Csvg%20id%3D%22danger%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215px%22%20height%3D%2215px%22%20viewBox%3D%220%200%2015%2015%22%20style%3D%22%3Bfill%3A%23ff0000%22%3E%3C%2Fsvg%3E',
  'data:image/svg+xml;charset=utf-8,%3Csvg%20id%3D%22library%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215px%22%20height%3D%2215px%22%20viewBox%3D%220%200%2015%2015%22%20style%3D%22%3Bfill%3A%230000ff%22%3E%3C%2Fsvg%3E'
]

beforeEach(() => {
  fetch.mockReset()
})

test('constructor', () => {
  expect.assertions(2)
  let iconLib = new IconLib()
  expect(iconLib.url).toBe(IconLib.URL)
  iconLib = new IconLib('mock-url')
  expect(iconLib.url).toBe('mock-url')
})

describe('style from string', () => {
  const iconLib = new IconLib()

  test('style from string', done => {
    expect.assertions(6)
    fetch.mockResponseOnce(SVG[0])
    const style1 = iconLib.style('mapbox-maki/danger#ff0000', 32)
    setTimeout(() => {
      expect(style1.getImage().getScale()).toBe(32 / 15)
      expect(style1.getImage().getSrc()).toBe(DATA_URI[0])
      const style2 = iconLib.style('mapbox-maki/danger#ff0000', 64)
      expect(style2.getImage().getScale()).toBe(64 / 15)
      expect(style2.getImage().getSrc()).toBe(DATA_URI[0])
      expect(fetch.mock.calls.length).toBe(1)
      expect(fetch.mock.calls[0][0]).toEqual(`${IconLib.URL}/mapbox-maki/danger-15.svg`)
      done()
    }, 100)
  })

  test('style from string - something different', done => {
    expect.assertions(6)
    fetch.mockResponseOnce(SVG[1])
    const style1 = iconLib.style('mapbox-maki/library#0000ff', 32)
    setTimeout(() => {
      expect(style1.getImage().getScale()).toBe(32 / 15)
      expect(style1.getImage().getSrc()).toBe(DATA_URI[1])
      const style2 = iconLib.style('mapbox-maki/library#0000ff', 64)
      expect(style2.getImage().getScale()).toBe(64 / 15)
      expect(style2.getImage().getSrc()).toBe(DATA_URI[1])
      expect(fetch.mock.calls.length).toBe(1)
      expect(fetch.mock.calls[0][0]).toEqual(`${IconLib.URL}/mapbox-maki/library-15.svg`)
      done()
    }, 100)

  })
})

describe('style from object', () => {
  const iconLib = new IconLib()

  test('style from object', done => {
    expect.assertions(6)
    fetch.mockResponseOnce(SVG[0])
    const style1 = iconLib.style({
      library: 'mapbox-maki',
      name: 'danger',
      color: '#ff0000'
    }, 32)
    setTimeout(() => {
      expect(style1.getImage().getScale()).toBe(32 / 15)
      expect(style1.getImage().getSrc()).toBe(DATA_URI[0])
      const style2 = iconLib.style('mapbox-maki/danger#ff0000', 64)
      expect(style2.getImage().getScale()).toBe(64 / 15)
      expect(style2.getImage().getSrc()).toBe(DATA_URI[0])
      expect(fetch.mock.calls.length).toBe(1)
      expect(fetch.mock.calls[0][0]).toEqual(`${IconLib.URL}/mapbox-maki/danger-15.svg`)
      done()
    }, 100)
  })
  test('style from object - different', done => {
    expect.assertions(6)
    fetch.mockResponseOnce(SVG[1])
    const style1 = iconLib.style({
      library: 'mapbox-maki',
      name: 'library',
      color: '#0000ff'
    }, 32)
    setTimeout(() => {
      expect(style1.getImage().getScale()).toBe(32 / 15)
      expect(style1.getImage().getSrc()).toBe(DATA_URI[1])
      const style2 = iconLib.style('mapbox-maki/library#0000ff', 64)
      expect(style2.getImage().getScale()).toBe(64 / 15)
      expect(style2.getImage().getSrc()).toBe(DATA_URI[1])
      expect(fetch.mock.calls.length).toBe(1)
      expect(fetch.mock.calls[0][0]).toEqual(`${IconLib.URL}/mapbox-maki/library-15.svg`)
      done()
    }, 100)
  })

})
