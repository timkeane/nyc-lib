class MockMutationObserver {
  constructor(cb){
    MockMutationObserver.constructorCalls.push(cb)
  }
  observe(observed, options) {
    MockMutationObserver.observeCalls.push([observed, options])
  }
}

MockMutationObserver.constructorCalls = []
MockMutationObserver.observeCalls = []

MockMutationObserver.resetMock = () => {
  MockMutationObserver.constructorCalls.length = 0
  MockMutationObserver.observeCalls.length = 0
}

export default MockMutationObserver