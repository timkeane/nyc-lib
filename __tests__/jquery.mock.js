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

  $.fn.slideToggle = jest.fn().mockImplementation(callback => {
    const instances = $.mocks.slideToggle.mock.instances
    const hidden = instances[instances.length - 1].css('display') === 'none'
    instances[instances.length - 1][hidden ? 'show' : 'hide']()
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

  $.fn.fadeToggle = jest.fn().mockImplementation(callback => {
    const instances = $.mocks.fadeToggle.mock.instances
    const hidden = instances[instances.length - 1].css('display') === 'none'
    instances[instances.length - 1][hidden ? 'show' : 'hide']()
    if (callback) callback()
  })

  $.fn.resize = jest.fn()

  $.fn.width = jest.fn().mockImplementation(width => {
    const instances = $.mocks.width.mock.instances
    const instance = instances[instances.length - 1]
    if (typeof width === 'number') {
      instance.data('width', width)
      return instance
    } else {
      return instance.data('width')
    }
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
    slideToggle: $.fn.slideToggle,
    fadeIn: $.fn.fadeIn,
    fadeOut: $.fn.fadeOut,
    fadeToggle: $.fn.fadeToggle,
    resize: $.fn.resize,
    width: $.fn.width,
    proxy: $.proxy,
    ajax: $.ajax
  }
}

export default $
