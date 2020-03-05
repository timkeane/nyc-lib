import IconLib from 'nyc/ol/style/IconLib'

const SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15"></svg>`

const DATA_URI = 'data:image/svg+xml;charset=utf-8,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215px%22%20height%3D%2215px%22%20viewBox%3D%220%200%2015%2015%22%20style%3D%22undefined%3Bfill%3A%23ff0000%22%3E%3C%2Fsvg%3E'

test('constructor', () => {
  expect.assertions(2)
  let iconLib = new IconLib()
  expect(iconLib.url).toBe(IconLib.URL)
  iconLib = new IconLib('mock-url')
  expect(iconLib.url).toBe('mock-url')
})

test('style', done => {
  expect.assertions(3)
  const iconLib = new IconLib()

  fetch.mockResponseOnce(SVG)

  let style = iconLib.style('mapbox-maki/danger#ff0000', 32)

  expect(fetch.mock.calls[0][0]).toEqual(`${IconLib.URL}/mapbox-maki/danger-15.svg`)

  setTimeout(() => {
    expect(style.getImage().getScale()).toBe(32 / 15)
    expect(style.getImage().getSrc()).toBe(DATA_URI)
    done()
  }, 2000)
  
})