/* global jest */

const mockSearchContainer = {
  hide: jest.fn()
}

const mockLocationMgr = {
  on: jest.fn(),
  search: {
    setFeatures: jest.fn(),
    input: {
      focus: jest.fn()
    },
    getContainer: jest.fn(() => {
      return mockSearchContainer
    })
  }
}

const mock = jest.fn().mockImplementation(() => {
  return mockLocationMgr
})

mock.mockSearchContainer = mockSearchContainer
mock.resetMocks = () => {
  mock.mockClear()
  mockLocationMgr.on.mockClear()
  mockLocationMgr.search.setFeatures.mockClear()
  mockLocationMgr.search.input.focus.mockClear()
  mockLocationMgr.search.getContainer.mockClear()
  mockSearchContainer.hide.mockClear()
}
export default mock
