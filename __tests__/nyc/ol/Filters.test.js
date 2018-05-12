import $ from 'jquery'

import OlFeature from 'ol/Feature'

import Filters from 'nyc/ol/Filters'
import Container from 'nyc/Container'
import FilterAndSort from 'nyc/ol/source/FilterAndSort'

const features = [
  new OlFeature({field1: '', field2: '', field3: ''}),
  new OlFeature({field1: '', field2: '', field3: ''}),
  new OlFeature({field1: '', field2: '', field3: ''}),
  new OlFeature({field1: '', field2: '', field3: ''})
]
const source = new FilterAndSort({
  features: features
})
const filterChoiceOptions = [
  {
    target: '#choice',
    choices: [
      {name: 'field1', label: 'Choice 1', values: [1], checked: true},
      {name: 'field2', label: 'Choice 2', values: [2, 3, 4]}
    ]
  },
  {
    radio: true,
    choices: [
      {name: 'field3', label: 'Choice A', values: ['a']},
      {name: 'field3', label: 'Choice B', values: ['b', 'c', 'd'], checked: true},
      {name: 'field3', label: 'Choice C', values: ['z', 'q']}
    ]
  }
]
let target
let choiceTarget
beforeEach(() => {
  target = $('<div></div>')
  choiceTarget = $('<div id="choice"></div>')
  $('body').append(target)
  $('body').append(choiceTarget)
})
afterEach(() => {
  target.remove()
  choiceTarget.remove()
})

test('constructor', () => {
  const filters = new Filters({
    target: target,
    source: source,
    filterChoiceOptions: filterChoiceOptions
  })

  expect(filters instanceof Container).toBe(true)
  expect(filters instanceof Filters).toBe(true)

  expect(filters.find('.chc').length).toBe(2)
})
