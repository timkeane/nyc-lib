const mock = jest.fn().mockImplementation(() => {
  const it = {
    ok: jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        resolve()
      })
    })
  }
  mock.mock.instances.pop()
  mock.mock.instances.push(it)
  return it
})

export default mock
