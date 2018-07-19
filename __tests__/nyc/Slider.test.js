import nyc from 'nyc'
import Container from 'nyc/Container'
import Slider from 'nyc/Slider'

let target
const nextId = nyc.nextId
beforeEach(() => {
  target = $('<div></div>')
  $('body').append(target)
  nyc.nextId = jest.fn(() => {return 'slider-0'})
  $.resetMocks()
})
afterEach(() => {
  nyc.nextId = nextId
  target.remove()
})

describe('constructor', () => {
  test('constructor all options', () => {
    expect.assertions(20)
  
    const slider = new Slider({
      target: target,
      label: 'My slider',
      min: 0,
      max: 100,
      step: 10,
      value: 50,
      units: '%'
    })
  
    expect(slider instanceof Container).toBe(true)
    expect(slider instanceof Slider).toBe(true)
  
    expect(slider.range.attr('min')).toBe('0')
    expect(slider.range.attr('max')).toBe('100')
    expect(slider.range.attr('step')).toBe('10')
    expect(slider.range.attr('id')).toBe('slider-0')
    expect(slider.range.val()).toBe('50')
    expect(slider.val()).toBe(50)
  
    expect(slider.text.val()).toBe('50')

    expect(slider.find('label').html()).toBe('My slider')
    expect(slider.find('label').attr('for')).toBe('slider-0')
    expect(nyc.nextId).toHaveBeenCalledTimes(1)
    expect(slider.find('span').html()).toBe('%')
  
    expect($.mocks.proxy).toHaveBeenCalledTimes(3)
    expect($.mocks.proxy.mock.calls[0][0]).toBe(slider.change)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(slider)

    expect($.mocks.proxy.mock.calls[1][0]).toBe(slider.key)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(slider)

    expect($.mocks.proxy.mock.calls[2][0]).toBe(slider.change)
    expect($.mocks.proxy.mock.calls[2][1]).toBe(slider)
  })

  test('constructor ony required options', () => {
    expect.assertions(22)
  
    const slider = new Slider({
      target: target,
      min: 0,
      max: 100
    })
  
    expect(slider instanceof Container).toBe(true)
    expect(slider instanceof Slider).toBe(true)
  
    expect(slider.range.attr('min')).toBe('0')
    expect(slider.range.attr('max')).toBe('100')
    expect(slider.range.attr('step')).toBe('1')
    expect(slider.range.attr('id')).toBe('slider-0')
    expect(nyc.nextId).toHaveBeenCalledTimes(1)
    expect(slider.range.val()).toBe('0')
    expect(slider.val()).toBe(0)
  
    expect(slider.text.val()).toBe('0')

    expect(slider.find('label').html()).toBe('')
    expect(slider.find('label').attr('for')).toBe('slider-0')
    expect(slider.find('span').length).toBe(0)
  
    expect($.mocks.proxy).toHaveBeenCalledTimes(3)
    expect($.mocks.proxy.mock.calls[0][0]).toBe(slider.change)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(slider)

    expect($.mocks.proxy.mock.calls[1][0]).toBe(slider.key)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(slider)

    expect($.mocks.proxy.mock.calls[2][0]).toBe(slider.change)
    expect($.mocks.proxy.mock.calls[2][1]).toBe(slider)
  
    slider.text.focus()
    expect($.mocks.select).toHaveBeenCalledTimes(1)
    expect($.mocks.select.mock.instances[0].get(0)).toBe(slider.text.get(0))
  })
})

test('val', () => {
  expect.assertions(3)

  const slider = new Slider({
    target: target,
    min: 0,
    max: 100,
    value: 50
  })

  expect(slider.val()).toBe(50)
  expect(slider.val(60)).toBe(slider)
  expect(slider.val()).toBe(60)
})

test('badKey', () => {
  expect.assertions(16)

  const slider = new Slider({
    target: target,
    min: 0,
    max: 100,
    value: 50
  })

  expect(slider.badKey({keyCode: 8})).toBe(false) //backspace
  expect(slider.badKey({keyCode: 9})).toBe(false) //tab
  expect(slider.badKey({keyCode: 37})).toBe(false) //left arrow
  expect(slider.badKey({keyCode: 39})).toBe(false) //right arrow

  expect(slider.badKey({keyCode: 48})).toBe(false) //0
  expect(slider.badKey({keyCode: 49})).toBe(false) //1
  expect(slider.badKey({keyCode: 50})).toBe(false) //2
  expect(slider.badKey({keyCode: 51})).toBe(false) //3
  expect(slider.badKey({keyCode: 52})).toBe(false) //4
  expect(slider.badKey({keyCode: 53})).toBe(false) //5
  expect(slider.badKey({keyCode: 54})).toBe(false) //6
  expect(slider.badKey({keyCode: 55})).toBe(false) //7
  expect(slider.badKey({keyCode: 56})).toBe(false) //8
  expect(slider.badKey({keyCode: 57})).toBe(false) //9
  
  expect(slider.badKey({keyCode: 65})).toBe(true) //a

  expect(slider.badKey({keyCode: 106})).toBe(true) //j

})

test('key', () => {
  expect.assertions(4)

  const slider = new Slider({
    target: target,
    min: 0,
    max: 100,
    value: 50
  })

  slider.key({keyCode: 38}) //up arrow
  expect(slider.val()).toBe(51)
 
  slider.key({keyCode: 40}) //down arrow
  expect(slider.val()).toBe(50)

  slider.key({
    keyCode: 65,
    preventDefault: () => {expect(true).toBe(true)}
  }) //a

  slider.on('change', (event) => {
    expect(event).toBe(slider)
  })
  slider.key({keyCode: 13}) //enter

  slider.key({keyCode: 48}) //0
})