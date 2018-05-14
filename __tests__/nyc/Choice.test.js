import $ from 'jquery'

import nyc from 'nyc/nyc'

import Container from 'nyc/Container'
import Choice from 'nyc/Choice'

let container
const checkChoices = [
  {name: 'choice-1', label: 'Choice 1', values: [1], checked: true},
  {name: 'choice-2', label: 'Choice 2', values: [2, 3, 4]},
  {name: 'choice-3', label: 'Choice 3', values: [5], checked: true}
]
const radioChoices = [
  {name: 'choice', label: 'Choice A', values: ['a']},
  {name: 'choice', label: 'Choice B', values: ['b', 'c', 'd'], checked: true},
  {name: 'choice', label: 'Choice C', values: ['z', 'q']}
]
beforeEach(() => {
  container = $('<div></div>')
  $('body').append(container)
})
afterEach(() => {
  container.remove()
})

test('constructor checkbox', () => {
  expect.assertions(22)

  const choice = new Choice({
    target: container,
    choices: checkChoices
  })

  expect(choice instanceof Container).toBe(true)
  expect(choice instanceof Choice).toBe(true)

  expect(choice.inputs.length).toBe(3)
  expect(choice.find('input').length).toBe(3)
  expect(choice.find('input').get(0)).toBe(choice.inputs.get(0))
  expect(choice.find('input').get(1)).toBe(choice.inputs.get(1))
  expect(choice.find('input').get(2)).toBe(choice.inputs.get(2))

  expect($(choice.find('input').get(0)).data('choice')).toBe(checkChoices[0])
  expect($(choice.find('input').get(1)).data('choice')).toBe(checkChoices[1])
  expect($(choice.find('input').get(2)).data('choice')).toBe(checkChoices[2])

  expect($(choice.find('input').get(0)).attr('name')).toBe(checkChoices[0].name)
  expect($(choice.find('input').get(1)).attr('name')).toBe(checkChoices[1].name)
  expect($(choice.find('input').get(2)).attr('name')).toBe(checkChoices[2].name)

  expect($(choice.find('input').get(0)).attr('type')).toBe('checkbox')
  expect($(choice.find('input').get(1)).attr('type')).toBe('checkbox')
  expect($(choice.find('input').get(2)).attr('type')).toBe('checkbox')

  expect($(choice.find('label').get(0)).html()).toBe(checkChoices[0].label)
  expect($(choice.find('label').get(1)).html()).toBe(checkChoices[1].label)
  expect($(choice.find('label').get(2)).html()).toBe(checkChoices[2].label)

  expect($(choice.find('.lbl').get(0)).hasClass(checkChoices[0].name)).toBe(true)
  expect($(choice.find('.lbl').get(1)).hasClass(checkChoices[1].name)).toBe(true)
  expect($(choice.find('.lbl').get(2)).hasClass(checkChoices[2].name)).toBe(true)
})

test('constructor radio', () => {
  expect.assertions(22)

  const choice = new Choice({
    target: container,
    choices: radioChoices,
    radio: true
  })

  expect(choice instanceof Container).toBe(true)
  expect(choice instanceof Choice).toBe(true)

  expect(choice.inputs.length).toBe(3)
  expect(choice.find('input').length).toBe(3)
  expect(choice.find('input').get(0)).toBe(choice.inputs.get(0))
  expect(choice.find('input').get(1)).toBe(choice.inputs.get(1))
  expect(choice.find('input').get(2)).toBe(choice.inputs.get(2))

  expect($(choice.find('input').get(0)).data('choice')).toBe(radioChoices[0])
  expect($(choice.find('input').get(1)).data('choice')).toBe(radioChoices[1])
  expect($(choice.find('input').get(2)).data('choice')).toBe(radioChoices[2])

  expect($(choice.find('input').get(0)).attr('name')).toBe(radioChoices[0].name)
  expect($(choice.find('input').get(1)).attr('name')).toBe(radioChoices[1].name)
  expect($(choice.find('input').get(2)).attr('name')).toBe(radioChoices[2].name)

  expect($(choice.find('input').get(0)).attr('type')).toBe('radio')
  expect($(choice.find('input').get(1)).attr('type')).toBe('radio')
  expect($(choice.find('input').get(2)).attr('type')).toBe('radio')

  expect($(choice.find('label').get(0)).html()).toBe(radioChoices[0].label)
  expect($(choice.find('label').get(1)).html()).toBe(radioChoices[1].label)
  expect($(choice.find('label').get(2)).html()).toBe(radioChoices[2].label)

  expect($(choice.find('.lbl').get(0)).hasClass(`${radioChoices[1].name}-0`)).toBe(true)
  expect($(choice.find('.lbl').get(1)).hasClass(`${radioChoices[1].name}-1`)).toBe(true)
  expect($(choice.find('.lbl').get(1)).hasClass(`${radioChoices[1].name}-1`)).toBe(true)
})

test('val checkbox', () => {
  expect.assertions(6)

  const choice = new Choice({
    target: container,
    choices: checkChoices
  })

  let value = choice.val()
  expect(value.length).toBe(2)
  expect(value[0]).toBe(checkChoices[0])
  expect(value[1]).toBe(checkChoices[2])

  value = choice.val([checkChoices[1], checkChoices[2]])
  expect(value.length).toBe(2)
  expect(value[0]).toBe(checkChoices[1])
  expect(value[1]).toBe(checkChoices[2])
})

test('val radio', () => {
  expect.assertions(4)
  
  const choice = new Choice({
    target: container,
    choices: radioChoices,
    radio: true
  })

  let value = choice.val()
  expect(value.length).toBe(1)
  expect(value[0]).toBe(radioChoices[1])

  value = choice.val([radioChoices[0], radioChoices[2]])
  expect(value.length).toBe(1)
  expect(value[0]).toBe(radioChoices[2])
})

test('change checkbox', () => {
  expect.assertions(2)
  
  const handler = jest.fn()

  const choice = new Choice({
    target: container,
    choices: checkChoices
  })

  choice.on('change', handler)

  $(choice.inputs.get(1)).trigger('change')

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler.mock.calls[0][0]).toBe(choice)
})
