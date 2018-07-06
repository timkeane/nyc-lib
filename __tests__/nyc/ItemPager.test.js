import Container from 'nyc/Container'
import ItemPager from 'nyc/ItemPager'

const items = [
  {html() {return '<p>item 0<p>'}},
  {html() {return '<p>item 1<p>'}},
  {html() {return '<p>item 2<p>'}},
  {html() {return '<p>item 3<p>'}},
  {html() {return '<p>item 4<p>'}},
  {html() {return '<p>item 5<p>'}},
  {html() {return '<p>item 6<p>'}},
  {html() {return '<p>item 7<p>'}},
  {html() {return '<p>item 8<p>'}},
  {html() {return '<p>item 9<p>'}},
  {html() {return '<p>item 10<p>'}},
  {html() {return '<p>item 11<p>'}}
]
let target
beforeEach(() => {
  target = $('<div></div>')
  $('body').append(target)
})
afterEach(() => {
  target.remove()
})

test('constructor no target and no items', () => {
  expect.assertions(11)

  const pager = new ItemPager()

  expect(pager instanceof Container).toBe(true)
  expect(pager instanceof ItemPager).toBe(true)
  expect(pager.getContainer().length).toBe(1)
  expect(pager.getContainer().hasClass('it-pg')).toBe(true)
  expect(pager.current.length).toBe(1)
  expect(pager.current.get(0)).toBe(pager.getContainer().find('.current').get(0))
  expect(pager.total.length).toBe(1)
  expect(pager.total.get(0)).toBe(pager.getContainer().find('.total').get(0))
  expect(pager.currentItem.length).toBe(1)
  expect(pager.currentItem.get(0)).toBe(pager.getContainer().find('.it').get(0))
  expect(pager.items).toBeNull()
})

test('constructor no items', () => {
  expect.assertions(13)

  const pager = new ItemPager({target: target})

  expect(pager instanceof Container).toBe(true)
  expect(pager instanceof ItemPager).toBe(true)
  expect(pager.getContainer().length).toBe(1)
  expect(pager.getContainer().parent().get(0)).toBe(target.get(0))
  expect(pager.getContainer().hasClass('it-pg')).toBe(true)
  expect(target.html()).toBe(ItemPager.HTML)
  expect(pager.current.length).toBe(1)
  expect(pager.current.get(0)).toBe(target.find('.current').get(0))
  expect(pager.total.length).toBe(1)
  expect(pager.total.get(0)).toBe(target.find('.total').get(0))
  expect(pager.currentItem.length).toBe(1)
  expect(pager.currentItem.get(0)).toBe(target.find('.it').get(0))
  expect(pager.items).toBeNull()
})

test('constructor has zero calls show', () => {
  expect.assertions(7)

  const pager = new ItemPager({
    target: target,
    items: []
  })

  expect(pager.items.length).toBe(0)
  expect(pager.items).toEqual([])
  expect(pager.btns.css('display')).toBe('none')
  expect(pager.current.data('current')).toBe(0)
  expect(pager.current.html()).toBe('1')
  expect(pager.total.html()).toBe('0')
  expect(pager.currentItem.text()).toBe('')
})

test('constructor has items calls show', () => {
  expect.assertions(7)

  const pager = new ItemPager({
    target: target,
    items: items
  })

  expect(pager.items.length).toBe(items.length)
  expect(pager.items).toBe(items)
  expect(pager.btns.css('display')).toBe('block')
  expect(pager.current.data('current')).toBe(0)
  expect(pager.current.html()).toBe('1')
  expect(pager.total.html()).toBe(`${items.length}`)
  expect(pager.currentItem.text()).toBe('item 0')
})

test('show triggers change', () => {
  expect.assertions(1)

  const pager = new ItemPager({
    target: target
  })

  const test = (event) => {
    expect(event).toBe(pager)
  }

  pager.on('change', test)

  pager.show(items)
})

test('navigate', () => {
  expect.assertions(5 + 2 * (items.length - 1))

  const pager = new ItemPager({
    target: target,
    items: items
  })

  expect(pager.currentItem.text()).toBe('item 0')
  for (let i = 1; i < items.length; i++) {
    pager.find('.btn-nxt').trigger('click')
    expect(pager.currentItem.text()).toBe(`item ${i}`)
  }
  expect(pager.currentItem.text()).toBe('item 11')
  pager.find('.btn-nxt').trigger('click')
  expect(pager.currentItem.text()).toBe('item 11')

  for (let i = items.length - 2; i > -1; i--) {
    pager.find('.btn-prv').trigger('click')
    expect(pager.currentItem.text()).toBe(`item ${i}`)
  }
  expect(pager.currentItem.text()).toBe('item 0')
  pager.find('.btn-prv').trigger('click')
  expect(pager.currentItem.text()).toBe('item 0')
})
