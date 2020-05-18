import $ from 'jquery'

import Container from 'nyc/Container'
import Choice from 'nyc/Choice'
import ToggleSwitch from 'nyc/ToggleSwitch'

let container
const toggleChoices = [
  {name: 'choice-1', label: 'Yes', values: ['yes'], checked: true},
  {name: 'choice-2', label: 'No', values: ['no', '']},
]
const toggleTooManyChoices = [
  {name: 'choice-1', label: 'Yes', values: ['yes'], checked: true},
  {name: 'choice-2', label: 'No', values: ['no', '']},
  {name: 'choice-3', label: 'Y/N', values: ['no', 'yes']},
]

beforeEach(() => {
  container = $('<div></div>')
  $('body').append(container)
})
afterEach(() => {
  container.remove()
})

test.only('constructor toggle', () => {
  expect.assertions(17)

  const toggle = new ToggleSwitch({
    target: container,
    choices: toggleChoices
  })

  expect(toggle instanceof Container).toBe(true)
  expect(toggle instanceof Choice).toBe(true)

  expect(toggle.inputs.length).toBe(2)
  expect(toggle.find('input').length).toBe(2)
  expect(toggle.find('input').get(0)).toBe(toggle.inputs.get(0))
  expect(toggle.find('input').get(1)).toBe(toggle.inputs.get(1))

  expect($(toggle.find('input').get(0)).data('choice')).toBe(toggleChoices[0])
  expect($(toggle.find('input').get(1)).data('choice')).toBe(toggleChoices[1])


  expect($(toggle.find('input').get(0)).attr('name')).toBe(toggleChoices[0].name)
  expect($(toggle.find('input').get(1)).attr('name')).toBe(toggleChoices[1].name)


  expect($(toggle.find('input').get(0)).attr('type')).toBe('radio')
  expect($(toggle.find('input').get(1)).attr('type')).toBe('radio')


  expect($(toggle.find('label').get(0)).html()).toBe(toggleChoices[0].label)
  expect($(toggle.find('label').get(1)).html()).toBe(toggleChoices[1].label)

  expect($(toggle.find('.chc-chc').get(0)).hasClass(`${toggleChoices[0].name}-0`)).toBe(true)
  expect($(toggle.find('.chc-chc').get(1)).hasClass(`${toggleChoices[1].name}-1`)).toBe(true)

  expect($(toggle.getContainer()).hasClass('tog')).toBe(true)

})

test.only('constructor, too many choices', () => {
  expect.assertions(1)
  try {
    new ToggleSwitch({
      target: container,
      choices: toggleTooManyChoices
    })
  }
  catch(e) {
    expect(e).toBe('ToggleSwitch can only have 2 choices') 
  }
})