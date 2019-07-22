import $ from 'jquery'

const mock = jest.fn().mockImplementation(() => {
  const it = {
    ok: jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        resolve()
      })
    }),
    yesNo: jest.fn().mockImplementation(e => {
      return new Promise(resolve => {
        resolve($(e.target).hasClass('btn-yes'))
      })
    })
  }
  mock.mock.instances.pop()
  mock.mock.instances.push(it)
  return it
})

export default mock
