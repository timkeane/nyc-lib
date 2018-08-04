import OlSourceVector from 'ol/source/Vector'
import AutoLoad from 'nyc/ol/source/AutoLoad'

jest.mock('ol/source/Vector')

const warn = console.warn
beforeEach(() => {
  OlSourceVector.mockClear()
  console.warn = jest.fn()
})
afterEach(() => {
  console.warn = warn
})

test('loader passed to super constructor should be empty function', () => {
  expect.assertions(5)

  const options = {name: 'test'}

  const autoLoad = new AutoLoad(options)

  expect(OlSourceVector.mock.calls.length).toBe(1)
  expect(OlSourceVector.mock.calls[0][0].name).toBe('test')
  expect(typeof OlSourceVector.mock.calls[0][0].loader).toBe('function')

  OlSourceVector.mock.calls[0][0].loader()

  expect(console.warn).toHaveBeenCalledTimes(1)
  expect(console.warn.mock.calls[0][0]).toBe('Use autoLoad to load features')
})
