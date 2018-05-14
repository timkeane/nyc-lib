import $ from 'jquery'

$.originalFunctions = {
  proxy: $.proxy,
  ajax: $.ajax
}

$.resetMocks = () => {
  $.fn.slideUp = jest.fn().mockImplementation(callback => {
    const instances = $.mocks.slideUp.mock.instances
    instances[instances.length - 1].hide()
    if (callback) callback()
  })

  $.fn.slideDown = jest.fn().mockImplementation(callback => {
    const instances = $.mocks.slideDown.mock.instances
    instances[instances.length - 1].show()
    if (callback) callback()
  })


  $.fn.fadeIn = jest.fn().mockImplementation(callback => {
    const instances = $.mocks.fadeIn.mock.instances
    instances[instances.length - 1].show()
    if (callback) callback()
  })

  $.fn.fadeOut = jest.fn().mockImplementation(callback => {
    const instances = $.mocks.fadeOut.mock.instances
    instances[instances.length - 1].hide()
    if (callback) callback()
  })

  $.proxy = jest.fn()
  $.proxy.returnedValues = []
  $.proxy.mockImplementation((fn, scope) => {
    const result = $.originalFunctions.proxy(fn, scope)
    $.proxy.returnedValues.push(result)
    return result
  })

  $.ajax = jest.fn()
  $.ajax.testData = {error: false, response: {}}
  $.ajax.mockImplementation(args => {
    if (!$.ajax.testData.error) {
      args.success($.ajax.testData.response)
    } else {
      args.error($.ajax.testData.error)
    }
  })

  $.mocks = {
    slideDown: $.fn.slideDown,
    slideUp: $.fn.slideUp,
    fadeIn: $.fn.fadeIn,
    fadeOut: $.fn.fadeOut,
    proxy: $.proxy,
    ajax: $.ajax
  }
}

export default $
