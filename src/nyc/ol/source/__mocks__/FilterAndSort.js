const mock = jest.fn().mockImplementation(() => {
  return {
    sort: jest.fn().mockImplementation(() => {
      return mock.features || []
    }),
    getFeatures: jest.fn().mockImplementation(() => {
      return mock.features || []
    }),
    autoLoad: () => {
    return new Promise(resolve => {
      resolve([{id: '1'}])
    })
  }
}
})

export default mock