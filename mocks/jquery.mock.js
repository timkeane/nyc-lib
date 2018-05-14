import jq from 'jquery'

jq.fn.slideDown = jest.fn()
jq.fn.slideUp = jest.fn()
jq.fn.fadeIn = jest.fn()
jq.fn.fadeOut = jest.fn()

jq.mocks = {
  slideDown: jq.fn.slideDown,
  slideUp: jq.fn.slideUp,
  fadeIn: jq.fn.fadeIn,
  fadeOut: jq.fn.fadeOut
}

global.$ = jq
