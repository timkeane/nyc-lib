import $ from 'jquery'


const fadeOut = $.fn.fadeOut
let div
beforeEach(() => {
  $.fn.fadeOut = jest.fn()
  div = $('<div></div>')
  $('body').append(div)
})
afterEach(() => {
  $.fn.fadeOut = fadeOut
  div.remove()
})

test('jq', () => {
  expect(div.css('display')).toBe('block')
  div.fadeOut()
  expect($.fn.fadeOut).toHaveBeenCalledTimes(1)
  expect($.fn.fadeOut.mock.instances[0].get(0)).toBe(div.get(0))
})
