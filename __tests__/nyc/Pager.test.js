import $ from 'jquery'

import Container from 'nyc/Container'
import Pager from 'nyc/Pager'

const items = [
  {html() {return 'item 0'}},
  {html() {return 'item 1'}},
  {html() {return 'item 2'}},
  {html() {return 'item 3'}},
  {html() {return 'item 4'}},
  {html() {return 'item 5'}},
  {html() {return 'item 6'}},
  {html() {return 'item 7'}},
  {html() {return 'item 8'}},
  {html() {return 'item 9'}},
  {html() {return 'item 10'}},   
  {html() {return 'item 11'}} 
]
let target
beforeEach(() => {
  target = $('<div></div>')
  $('body').append(target)
})
afterEach(() => {
  target.remove()
})

test('constructor without items and pageSize', () => {
  const pager = new Pager({
    target: target
  })
 
  expect(pager instanceof Container).toBe(true)
  expect(pager instanceof Pager).toBe(true)
  expect(pager.pageSize).toBe(10)
  expect(pager.items.length).toBe(0)
  expect(pager.getContainer().length).toBe(1)
  expect(pager.getContainer().get(0)).toBe(target.get(0))
  expect(pager.list.length).toBe(1)
  expect(pager.list.get(0)).toBe(target.find('.list').get(0))
  expect(pager.list.children().length).toBe(0)
  expect(pager.moreBtn.length).toBe(1)
  expect(pager.moreBtn.get(0)).toBe(target.find('button').get(0))
})

test('everything constructed with items and pageSize', () => {
  const pager = new Pager({
    target: target,
    items: items,
    pageSize: 5
  })
 
  expect(pager instanceof Container).toBe(true)
  expect(pager instanceof Pager).toBe(true)
  expect(pager.pageSize).toBe(5)
  expect(pager.items).toBe(items)
  expect(pager.getContainer().length).toBe(1)
  expect(pager.getContainer().get(0)).toBe(target.get(0))
  expect(pager.list.length).toBe(1)
  expect(pager.moreBtn.length).toBe(1)
  expect(pager.moreBtn.get(0)).toBe(target.find('button').get(0))
  expect(pager.moreBtn.css('display')).toBe('inline-block')
  expect(pager.list.get(0)).toBe(target.find('.list').get(0))
  expect(pager.list.children().length).toBe(5)

  pager.list.children().each((i, item) => {
    expect($(item).html()).toBe(items[i].html())
  })

  pager.moreBtn.trigger('click')

  expect(pager.list.children().length).toBe(10)
  pager.list.children().each((i, item) => {
    expect($(item).html()).toBe(items[i].html())
  })
  
  const test = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(pager.moreBtn.css('display'))
      }, 500)
    })
  }

  pager.moreBtn.trigger('click')
  
  expect(pager.list.children().length).toBe(12)
  pager.list.children().each((i, item) => {
    expect($(item).html()).toBe(items[i].html())
  })
  
  return test().then(visible => expect(visible).toBe('none'))
})