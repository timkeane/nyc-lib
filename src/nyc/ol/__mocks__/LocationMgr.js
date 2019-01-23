/* global jest */
const mock = jest.fn().mockImplementation(() => {
  return {
    on: jest.fn(),
    search: {
      setFeatures: jest.fn(),
      input: {
        focus: jest.fn()
      }
    }
  }
})

export default mock
