import $ from 'jquery'

import AutoComplete from 'nyc/AutoComplete'

const list = [
  'Fred Flintstone',
  'Wilma Flintstone',
  'Pebbles Flintstone',
  'Barney Rubble',
  'Betty Rubble',
  'BamBam Rubble'
]
const inUl = $('<ul></ul>')
const outUl = $('<ul></ul>')

beforeEach(() => {
  list.forEach(item => {
    inUl.append($('<li></li>').html(item))
  })
})

afterEach(() => {
  inUl.empty()
  outUl.empty()
})

test('filter one lower case letter', () => {
  const autoComplete = new AutoComplete()
  expect(autoComplete.filter(list, 'b')).toEqual([
    'Pebbles Flintstone',
    'Barney Rubble',
    'Betty Rubble',
    'BamBam Rubble'
  ])
})

test('filterUl one lower case letter', () => {
  const autoComplete = new AutoComplete()

  autoComplete.filterUl(inUl, outUl, 'b')

  expect(outUl.children().length).toBe(4)
  expect(outUl.children().get(0).innerHTML).toBe('Pebbles Flintstone')
  expect(outUl.children().get(1).innerHTML).toBe('Barney Rubble')
  expect(outUl.children().get(2).innerHTML).toBe('Betty Rubble')
  expect(outUl.children().get(3).innerHTML).toBe('BamBam Rubble')

  expect(inUl.children().length).toBe(2)
  expect(inUl.children().get(0).innerHTML).toBe('Fred Flintstone')
  expect(inUl.children().get(1).innerHTML).toBe('Wilma Flintstone')
})

test('filter one upper case letter', () => {
  const autoComplete = new AutoComplete()

  expect(autoComplete.filter(list, 'B')).toEqual([
    'Pebbles Flintstone',
    'Barney Rubble',
    'Betty Rubble',
    'BamBam Rubble'
  ])
})

test('filterUl one upper case letter', () => {
  const autoComplete = new AutoComplete()

  autoComplete.filterUl(inUl, outUl, 'B')

  expect(outUl.children().length).toBe(4)
  expect(outUl.children().get(0).innerHTML).toBe('Pebbles Flintstone')
  expect(outUl.children().get(1).innerHTML).toBe('Barney Rubble')
  expect(outUl.children().get(2).innerHTML).toBe('Betty Rubble')
  expect(outUl.children().get(3).innerHTML).toBe('BamBam Rubble')

  expect(inUl.children().length).toBe(2)
  expect(inUl.children().get(0).innerHTML).toBe('Fred Flintstone')
  expect(inUl.children().get(1).innerHTML).toBe('Wilma Flintstone')
})

test('filter three letters', () => {
  const autoComplete = new AutoComplete()

  expect(autoComplete.filter(list, 'MbA')).toEqual([
    'Wilma Flintstone',
    'Pebbles Flintstone',
    'Barney Rubble',
    'Betty Rubble',
    'BamBam Rubble'
  ])
})

test('filterUl three letters', () => {
  const autoComplete = new AutoComplete()

  autoComplete.filterUl(inUl, outUl, 'MbA')

  expect(outUl.children().length).toBe(5)
  expect(outUl.children().get(0).innerHTML).toBe('Wilma Flintstone')
  expect(outUl.children().get(1).innerHTML).toBe('Pebbles Flintstone')
  expect(outUl.children().get(2).innerHTML).toBe('Barney Rubble')
  expect(outUl.children().get(3).innerHTML).toBe('Betty Rubble')
  expect(outUl.children().get(4).innerHTML).toBe('BamBam Rubble')

  expect(inUl.children().length).toBe(1)
  expect(inUl.children().get(0).innerHTML).toBe('Fred Flintstone')
})

test('filter four letters not exact', () => {
  const autoComplete = new AutoComplete()

  expect(autoComplete.filter(list, 'bbur')).toEqual([
    'Fred Flintstone',
    'Pebbles Flintstone',
    'Barney Rubble',
    'Betty Rubble',
    'BamBam Rubble'
  ])
})

test('filterUl four letters not exact', () => {
  const autoComplete = new AutoComplete()

  autoComplete.filterUl(inUl, outUl, 'bbur')

  expect(outUl.children().length).toBe(5)
  expect(outUl.children().get(0).innerHTML).toBe('Fred Flintstone')
  expect(outUl.children().get(1).innerHTML).toBe('Pebbles Flintstone')
  expect(outUl.children().get(2).innerHTML).toBe('Barney Rubble')
  expect(outUl.children().get(3).innerHTML).toBe('Betty Rubble')
  expect(outUl.children().get(4).innerHTML).toBe('BamBam Rubble')

  expect(inUl.children().length).toBe(1)
  expect(inUl.children().get(0).innerHTML).toBe('Wilma Flintstone')
})

test('filter four letters exact with mutiple matches', () => {
  const autoComplete = new AutoComplete()

  expect(autoComplete.filter(list, 'ubbl')).toEqual([
    'Barney Rubble',
    'Betty Rubble',
    'BamBam Rubble'
  ])
})

test('filterUl four letters exact with mutiple matches', () => {
  const autoComplete = new AutoComplete()

  autoComplete.filterUl(inUl, outUl, 'ubbl')

  expect(outUl.children().length).toBe(3)
  expect(outUl.children().get(0).innerHTML).toBe('Barney Rubble')
  expect(outUl.children().get(1).innerHTML).toBe('Betty Rubble')
  expect(outUl.children().get(2).innerHTML).toBe('BamBam Rubble')

  expect(inUl.children().length).toBe(3)
  expect(inUl.children().get(0).innerHTML).toBe('Fred Flintstone')
  expect(inUl.children().get(1).innerHTML).toBe('Wilma Flintstone')
  expect(inUl.children().get(2).innerHTML).toBe('Pebbles Flintstone')
})

test('filter four letters exact with one match', () => {
  const autoComplete = new AutoComplete()

  expect(autoComplete.filter(list, 'FRED')).toEqual([
    'Fred Flintstone'
  ])
})

test('filterUl four letters exact with one match', () => {
  const autoComplete = new AutoComplete()

  autoComplete.filterUl(inUl, outUl, 'FRED')

  expect(outUl.children().length).toBe(1)
  expect(outUl.children().get(0).innerHTML).toBe('Fred Flintstone')

  expect(inUl.children().length).toBe(5)
  expect(inUl.children().get(0).innerHTML).toBe('Wilma Flintstone')
  expect(inUl.children().get(1).innerHTML).toBe('Pebbles Flintstone')
  expect(inUl.children().get(2).innerHTML).toBe('Barney Rubble')
  expect(inUl.children().get(3).innerHTML).toBe('Betty Rubble')
  expect(inUl.children().get(4).innerHTML).toBe('BamBam Rubble')
})

test('filterUl multiple times with swap', () => {
  const autoComplete = new AutoComplete()

  autoComplete.filterUl(inUl, outUl, 'FRED')

  expect(outUl.children().length).toBe(1)
  expect(outUl.children().get(0).innerHTML).toBe('Fred Flintstone')

  expect(inUl.children().length).toBe(5)
  expect(inUl.children().get(0).innerHTML).toBe('Wilma Flintstone')
  expect(inUl.children().get(1).innerHTML).toBe('Pebbles Flintstone')
  expect(inUl.children().get(2).innerHTML).toBe('Barney Rubble')
  expect(inUl.children().get(3).innerHTML).toBe('Betty Rubble')
  expect(inUl.children().get(4).innerHTML).toBe('BamBam Rubble')

  autoComplete.log = true
  autoComplete.filterUl(inUl, outUl, 'rubb')

  expect(outUl.children().length).toBe(3)
  expect(outUl.children().get(0).innerHTML).toBe('Barney Rubble')
  expect(outUl.children().get(1).innerHTML).toBe('Betty Rubble')
  expect(outUl.children().get(2).innerHTML).toBe('BamBam Rubble')

  expect(inUl.children().length).toBe(3)
  expect(inUl.children().get(0).innerHTML).toBe('Fred Flintstone')
  expect(inUl.children().get(1).innerHTML).toBe('Wilma Flintstone')
  expect(inUl.children().get(2).innerHTML).toBe('Pebbles Flintstone')

})
