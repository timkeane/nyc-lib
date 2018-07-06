const originalLocalStorage = window.localStorage 

const mockFunctions = {
  setItem: jest.fn().mockImplementation((name, value) => {
    window.localStorage.data[name] = value
  }),
  getItem: jest.fn().mockImplementation(name => {
    return window.localStorage.data[name]
  }),
  removeItem: jest.fn().mockImplementation(name => {
    delete window.localStorage.data[name]
  })
}

const localStorageMock = {
  data: {},
  resetMock() {
    $.extend(localStorageMock, mockFunctions)
    window.localStorage = localStorageMock
  },
  unmock() {
    window.localStorage = originalLocalStorage
  }
}

export default localStorageMock