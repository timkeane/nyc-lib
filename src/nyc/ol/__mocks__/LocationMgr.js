/* global jest */
const mock = jest.fn().mockImplementation(() => {
  return {
    on: jest.fn(),
    zoomSearch: {
      setFeatures: jest.fn(),
      input: {
        focus: jest.fn()
      }
    }
  }
})

export default mock
