const mock = jest.fn().mockImplementation(() => {
  return {
    getView: () => {
      return {fit: jest.fn()}
    },
    addLayer: jest.fn(),
    getSize: jest.fn(() => {return [100, 100]}),
    setSize: jest.fn()
  }
})

export default mock
