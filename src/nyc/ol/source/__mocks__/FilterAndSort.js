const mock = jest.fn().mockImplementation(() => {
  return {
    getUrl: jest.fn().mockImplementation(() => {
      return mock.url || ''
    }),
    getFormat: jest.fn().mockImplementation(() => {
      return mock.format
    }),
    sort: jest.fn().mockImplementation(() => {
      return mock.features || []
    }),
    getFeatures: jest.fn().mockImplementation(() => {
      return mock.features || []
    }),
    autoLoad: () => {
      return new Promise(resolve => {
        resolve(mock.features)
      })
    }
  }
})

export default mock
