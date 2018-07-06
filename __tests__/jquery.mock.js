import $ from 'jquery'

$.originalFunctions = {
  width: $.fn.width,
  height: $.fn.height,
  proxy: $.proxy,
  ajax: $.ajax,
  getScript: $.getScript
}

$.resetMocks = () => {
  $.fn.slideUp = jest.fn().mockImplementation((arg0, arg1) => {
    const instances = $.mocks.slideUp.mock.instances
    instances[instances.length - 1].hide()
    if (typeof arg0 === 'function') arg0()
    else if (typeof arg1 === 'function') arg1()
  })

  $.fn.slideDown = jest.fn().mockImplementation((arg0, arg1) => {
    const instances = $.mocks.slideDown.mock.instances
    instances[instances.length - 1].show()
    if (typeof arg0 === 'function') arg0()
    else if (typeof arg1 === 'function') arg1()
  })

  $.fn.slideToggle = jest.fn().mockImplementation((arg0, arg1)  => {
    const instances = $.mocks.slideToggle.mock.instances
    const hidden = instances[instances.length - 1].css('display') === 'none'
    instances[instances.length - 1][hidden ? 'show' : 'hide']()
    if (typeof arg0 === 'function') arg0()
    else if (typeof arg1 === 'function') arg1()
  })

  $.fn.fadeIn = jest.fn().mockImplementation((arg0, arg1)  => {
    const instances = $.mocks.fadeIn.mock.instances
    instances[instances.length - 1].show()
    if (typeof arg0 === 'function') arg0()
    else if (typeof arg1 === 'function') arg1()
  })

  $.fn.fadeOut = jest.fn().mockImplementation((arg0, arg1)  => {
    const instances = $.mocks.fadeOut.mock.instances
    instances[instances.length - 1].hide()
    if (typeof arg0 === 'function') arg0()
    else if (typeof arg1 === 'function') arg1()
  })

  $.fn.fadeToggle = jest.fn().mockImplementation((arg0, arg1)  => {
    const instances = $.mocks.fadeToggle.mock.instances
    const hidden = instances[instances.length - 1].css('display') === 'none'
    instances[instances.length - 1][hidden ? 'show' : 'hide']()
    if (typeof arg0 === 'function') arg0()
    else if (typeof arg1 === 'function') arg1()
  })

  $.fn.resize = jest.fn()

  $.fn.width = jest.fn().mockImplementation(width => {
    const instances = $.mocks.width.mock.instances
    const instance = instances[instances.length - 1]
    if (typeof width === 'number') {
      instance.data('width', width)
      return instance
    } else {
      width = instance.data('width')
      return typeof width === 'number' ? width : $.originalFunctions.width.call(instance)
    }
  })

  $.fn.height = jest.fn().mockImplementation(height => {
    const instances = $.mocks.height.mock.instances
    const instance = instances[instances.length - 1]
    if (typeof height === 'number') {
      instance.data('height', height)
      return instance
    } else {
      height = instance.data('height')
      return typeof height === 'number' ? height : $.originalFunctions.height.call(instance)
    }
  })

  $.fn.select = jest.fn()
  
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

  $.getScript = jest.fn()
  $.getScript.result = {text: '', status: 200, xhr: {}}
  $.getScript.mockImplementation((url, success) => {
    const idx = url.indexOf('callback')
    if (idx > -1) {
      let cb = url.substr(idx).split('=')[1]
      cb = cb.split('&')[0]
      eval(`${cb}()`)
    }
    if (success) success($.getScript.result.text, $.getScript.result.status, $.getScript.result.xhr)
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
    height: $.fn.height,
    select: $.fn.select,
    proxy: $.proxy,
    ajax: $.ajax,
    getScript: $.getScript
  }
}

export default $
