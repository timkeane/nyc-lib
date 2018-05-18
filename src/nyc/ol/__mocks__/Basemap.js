const mock = jest.fn().mockImplementation(() => {
  return {
    getView: () => {
      return {fit: jest.fn()}
    },
    addLayer: jest.fn(),
    getSize: jest.fn(),
    setSize: jest.fn()
  }
})

export default mock
