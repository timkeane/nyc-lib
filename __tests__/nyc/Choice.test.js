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
})

test('constructor radio', () => {
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
})
