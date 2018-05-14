import jq from 'jquery'

const exeCallback = (callback) => {
  if (callback) callback()
}

jq.fn.slideDown = jest.fn((callback) => {
  const instances = $.mocks.slideDown.mock.instances
  instances[instances.length - 1].show()
  exeCallback(callback)
})
jq.fn.slideUp = jest.fn((callback) => {
  const instances = $.mocks.slideUp.mock.instances
  instances[instances.length - 1].hide()
  exeCallback(callback)
})
jq.fn.fadeIn = jest.fn((callback) => {
  const instances = $.mocks.fadeIn.mock.instances
  instances[instances.length - 1].show()
  exeCallback(callback)
})
jq.fn.fadeOut = jest.fn((callback) => {
  const instances = $.mocks.fadeOut.mock.instances
  instances[instances.length - 1].hide()
  exeCallback(callback)
})

jq.originalProxy = jq.proxy

jq.proxy = jest.fn() 
jq.proxy.mockImplementation = (fn, scope) => {
  console.warn(fn,scope);
  
  return jq.originalProxy(fn, scope)
}
jq.proxy.wtf ='wtf'

jq.mocks = {
  slideDown: jq.fn.slideDown,
  slideUp: jq.fn.slideUp,
  fadeIn: jq.fn.fadeIn,
  fadeOut: jq.fn.fadeOut,
  proxy: jq.proxy
}

jq.resetMocks = () => {
  Object.values(jq.mocks).forEach(fn => {
    fn.mockReset()
  })
}

global.$ = jq
