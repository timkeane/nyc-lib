const mock = jest.fn().mockImplementation(() => {
  return {
    autoLoad: () => {
    return new Promise(resolve => {
      resolve([{id: '1'}])
    })
  }
}
})

export default mock