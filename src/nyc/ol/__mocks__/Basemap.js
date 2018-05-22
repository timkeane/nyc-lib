const mock = jest.fn().mockImplementation(() => {
  return {
    getView: () => {
      return {
        fit: jest.fn(),
        animate: jest.fn()
      }
    },
    addLayer: jest.fn(),
    getSize: jest.fn(() => {return [100, 100]}),
    setSize: jest.fn(),
    once: jest.fn().mockImplementation((eventType, callback) => {
      callback()
    })
  }
})

export default mock
