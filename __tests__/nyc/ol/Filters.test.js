import $ from 'jquery'

import Filters from 'nyc/ol/Filters'
import Container from 'nyc/Container'

const filterChoiceOptions = [
  {
    target: '#choice',
    choices: [
      {name: 'field1', label: 'Choice 1', values: [1], checked: true},
      {name: 'field1', label: 'Choice 2', values: [2, 3, 4], checked: true},
      {name: 'field2', label: 'Choice 2', values: ['doo', 'fus'], checked: true},
      {name: 'field4', label: 'Choice 2', values: ['foo']}
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
    source: {},
    filterChoiceOptions: filterChoiceOptions
  })

  expect(filters instanceof Container).toBe(true)
  expect(filters instanceof Filters).toBe(true)

  expect(filters.getContainer().length).toBe(1)
  expect(filters.getContainer().get(0)).toBe(target.get(0))

  expect(filters.choiceControls.length).toBe(2)
  expect(filters.find('.chc').length).toBe(2)
  expect(filters.find('#choice').length).toBe(1)
  expect(filters.find('.filter-0').length).toBe(1)

  expect(filters.choiceControls[0].getContainer().length).toBe(1)
  expect(filters.choiceControls[0].getContainer().get(0)).toBe(choiceTarget.get(0))
  expect(filters.choiceControls[0].radio).toBe(undefined)
  expect(filters.choiceControls[0].choices).toBe(filterChoiceOptions[0].choices)

  expect(filters.choiceControls[1].getContainer().length).toBe(1)
  expect(filters.choiceControls[1].getContainer().hasClass('filter-0')).toBe(true)
  expect(filters.choiceControls[1].radio).toBe(true)
  expect(filters.choiceControls[1].choices).toBe(filterChoiceOptions[1].choices)
})

test('filter', () => {
  expect.assertions(9)

  const filters = new Filters({
    target: target,
    source: {},
    filterChoiceOptions: filterChoiceOptions
  })

  filters.source.filter = jest.fn()

  filters.on('change', (event) => {
    expect(event).toBe(filters)
  })

  filters.choiceControls[0].trigger('change')

  expect(filters.source.filter).toHaveBeenCalledTimes(1)
  expect(filters.source.filter.mock.calls[0][0].length).toBe(3)

  expect(filters.source.filter.mock.calls[0][0][0].property).toBe('field1')
  expect(filters.source.filter.mock.calls[0][0][0].values).toEqual([1, 2, 3, 4])

  expect(filters.source.filter.mock.calls[0][0][1].property).toBe('field2')
  expect(filters.source.filter.mock.calls[0][0][1].values).toEqual(['doo', 'fus'])

  expect(filters.source.filter.mock.calls[0][0][2].property).toBe('field3')
  expect(filters.source.filter.mock.calls[0][0][2].values).toEqual(['b', 'c', 'd'])
})
