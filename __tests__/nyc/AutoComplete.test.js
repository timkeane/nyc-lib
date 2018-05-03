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
  console.warn(inUl.innerHTML)
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

test('filter four letters exact with mutiple matches', () => {
  const autoComplete = new AutoComplete()

  expect(autoComplete.filter(list, 'ubbl')).toEqual([
    'Barney Rubble',
    'Betty Rubble',
    'BamBam Rubble'
  ])
})

test('filter four letters exact with one match', () => {
  const autoComplete = new AutoComplete()

  expect(autoComplete.filter(list, 'FRED')).toEqual([
    'Fred Flintstone'
  ])
})

