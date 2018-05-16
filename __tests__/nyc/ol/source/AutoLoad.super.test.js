const warn = console.warn
beforeEach(() => {
  jest.mock('ol/source/vector', () => {
    return jest.fn(optns => global.passedOptions = optns)
  })
  console.warn = jest.fn()
})
afterEach(() => {
  jest.unmock('ol/source/vector')
  console.warn = warn
  delete global.passedOptions
})

test('loader passed to super constructor should be empty function', () => {
  expect.assertions(5)

  const options = {name: 'test'}

  require('ol/source/vector')
  const AutoLoading = require('nyc/ol/source/AutoLoad').default

  const autoLoad = new AutoLoading(options)

  expect(global.passedOptions).toBe(options)
  expect(global.passedOptions.name).toBe('test')
  expect(typeof global.passedOptions.loader).toBe('function')

  global.passedOptions.loader()

  expect(console.warn).toHaveBeenCalledTimes(1)
  expect(console.warn.mock.calls[0][0]).toBe('Use autoLoad to load features')
})
