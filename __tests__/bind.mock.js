const mock = {
  boundFunctions: [],
  bind: (fn, scope) => {
    const bound = fn.bind(scope)
    bound.fn = fn
    bound.scope = scope
    mock.boundFunctions.push(bound)
    return bound
  },
  resetMocks: () => {
    mock.boundFunctions.length = 0
  }
}
export default mock