import Choropleth from 'nyc/Choropleth'

describe('constructor', () => {

  test('constructor no options', () => {
    expect.assertions(1)

    const choro = new Choropleth()

    expect(choro.val()).toEqual({
      count: 7,
      method: 'equalIntervalClasses',
      colorScheme: 'divergent',
      colors: Choropleth.COLORS.divergent.values[0]
    })
  })

  test('constructor with options', () => {
    expect.assertions(1)

    const choro = new Choropleth({
      count: 5,
      method: 'equalIntervalClasses',
      colorScheme: 'sequential',
      colors: ['#feedde', '#fdd0a2', '#f16913', '#d94801', '#8c2d04']
    })
    
    expect(choro.val()).toEqual({
      count: 5,
      method: 'equalIntervalClasses',
      colorScheme: 'sequential',
      colors: ['#feedde', '#fdd0a2', '#f16913', '#d94801', '#8c2d04']
    })
  })

})

describe('adjustCounts', () => {
  test('adjustCounts not std', () => {
    expect.assertions(27)

    const choro = new Choropleth()

    choro.count.on('change', event => {
      expect(event).toBe(choro.count)
      expect(choro.count.choices.length).toBe(6)
      choro.count.choices.forEach((c, i) => {
        expect(c.name).toBe('count')
        expect(c.label).toBe(`${7 - i} classifications`)
        expect(c.values.length).toBe(1)
        expect(c.values[0]).toBe(7 - i)
      })
      expect(choro.val()).toEqual({
        count: 7,
        method: 'ckmeansClasses',
        colorScheme: 'divergent',
        colors: Choropleth.COLORS.divergent.values[0]
      })
    })

    // trigger the call to adjustCounts
    choro.method.val([choro.method.choices[2]])
    choro.method.trigger('change', choro.method)
  })

  test('adjustCounts is std with an invalid count', () => {
    expect.assertions(15)

    const choro = new Choropleth({count: 6})

    choro.count.on('change', event => {
      expect(event).toBe(choro.count)
      expect(choro.count.choices.length).toBe(3)

      expect(choro.count.choices[0].name).toBe('count')
      expect(choro.count.choices[0].label).toBe('7 classifications')
      expect(choro.count.choices[0].values.length).toBe(1)
      expect(choro.count.choices[0].values[0]).toBe(7)

      expect(choro.count.choices[1].name).toBe('count')
      expect(choro.count.choices[1].label).toBe('5 classifications')
      expect(choro.count.choices[1].values.length).toBe(1)
      expect(choro.count.choices[1].values[0]).toBe(5)

      expect(choro.count.choices[2].name).toBe('count')
      expect(choro.count.choices[2].label).toBe('3 classifications')
      expect(choro.count.choices[2].values.length).toBe(1)
      expect(choro.count.choices[2].values[0]).toBe(3)

      expect(choro.val()).toEqual({
        count: 7,
        method: 'stdClasses',
        colorScheme: 'divergent',
        colors: Choropleth.COLORS.divergent.values[0]
      })
    })

    // trigger the call to adjustCounts
    choro.method.val([choro.method.choices[1]])
    choro.method.trigger('change', choro.method)
  })

  test('adjustCounts is std with a valid count', () => {
    expect.assertions(15)

    const choro = new Choropleth()

    choro.count.on('change', event => {
      expect(event).toBe(choro.count)
      expect(choro.count.choices.length).toBe(3)

      expect(choro.count.choices[0].name).toBe('count')
      expect(choro.count.choices[0].label).toBe('7 classifications')
      expect(choro.count.choices[0].values.length).toBe(1)
      expect(choro.count.choices[0].values[0]).toBe(7)

      expect(choro.count.choices[1].name).toBe('count')
      expect(choro.count.choices[1].label).toBe('5 classifications')
      expect(choro.count.choices[1].values.length).toBe(1)
      expect(choro.count.choices[1].values[0]).toBe(5)

      expect(choro.count.choices[2].name).toBe('count')
      expect(choro.count.choices[2].label).toBe('3 classifications')
      expect(choro.count.choices[2].values.length).toBe(1)
      expect(choro.count.choices[2].values[0]).toBe(3)

      expect(choro.val()).toEqual({
        count: 7,
        method: 'stdClasses',
        colorScheme: 'divergent',
        colors: Choropleth.COLORS.divergent.values[0]
      })
    })

    // trigger the call to adjustCounts
    choro.method.val([choro.method.choices[1]])
    choro.method.trigger('change', choro.method)
  })
})

describe('adjustColors', () => {

  test('adjustColors on count change', () => {
    expect.assertions(10)

    const choro = new Choropleth()

    // trigger the call to adjustColors
    choro.count.val([choro.count.choices[0]])
    choro.count.trigger('change', choro.count)

    expect(choro.val().colors).toEqual(Choropleth.COLORS.divergent.values[0])

    choro.colors.choices.forEach((c, i) => {
      const hexColors = Choropleth.COLORS.divergent.values[i]
      expect(c.name).toBe('colors')
      expect(c.values).toEqual(hexColors)
      const label = $('<div>&nbsp;</div>')
      hexColors.forEach(hex => {
        label.append(`<div class="clr" style="background-color:${hex}"></div>`)
      })
      label.append($(Choropleth.REV_BTN_HTML))

      expect(c.label.html()).toBe(label.html())
    })
  })

  test('adjustColors on colorScheme change', () => {
    expect.assertions(10)

    const choro = new Choropleth()

    // trigger the call to adjustColors
    choro.colorScheme.val([choro.colorScheme.choices[1]])
    choro.colorScheme.trigger('change', choro.colorScheme)

    expect(choro.val().colors).toEqual(Choropleth.COLORS.sequential.values[0])

    choro.colors.choices.forEach((c, i) => {
      const hexColors = Choropleth.COLORS.sequential.values[i]
      expect(c.name).toBe('colors')
      expect(c.values).toEqual(hexColors)
      const label = $('<div>&nbsp;</div>')
      hexColors.forEach(hex => {
        label.append(`<div class="clr" style="background-color:${hex}"></div>`)
      })
      label.append($(Choropleth.REV_BTN_HTML))

      expect(c.label.html()).toBe(label.html())
    })
  })
})

test('reverseColors', () => {
  expect.assertions(4)

  const choro = new Choropleth()

  const hexColors = Choropleth.COLORS.divergent.values[0]

  const label0 = $('<div>&nbsp;</div>')
  const label1 = $('<div>&nbsp;</div>')
  const reversed = []
  hexColors.forEach(hex => {
    label0.append(`<div class="clr" style="background-color:${hex}"></div>`)
  })
  label0.append(Choropleth.REV_BTN_HTML)
  for (let i = hexColors.length - 1; i >= 0; i--) {
    reversed.push(hexColors[i])
    label1.append(`<div class="clr" style="background-color:${hexColors[i]}"></div>`)
  }
  label1.append(Choropleth.REV_BTN_HTML)

  expect($(choro.colors.find('label').get(0)).html()).toBe($('<div></div>').append(label0).html())
  expect(choro.val()).toEqual({
    count: 7,
    method: 'equalIntervalClasses',
    colorScheme: 'divergent',
    colors: Choropleth.COLORS.divergent.values[0]
  })
  // trigger the call to reverseColors
  $(choro.colors.find('button.rev').get(0)).trigger('click')

  expect($(choro.colors.find('label').get(0)).html()).toBe($('<div></div>').append(label1).html())
  expect(choro.val()).toEqual({
    count: 7,
    method: 'equalIntervalClasses',
    colorScheme: 'divergent',
    colors: reversed
  })
})

test('set val', () => {
  expect.assertions(8)

  const choro = new Choropleth({method: 'stdClasses'})

  expect(choro.count.choices.length).toBe(3)
  expect(choro.val()).toEqual({
    count: 7,
    method: 'stdClasses',
    colorScheme: 'divergent',
    colors: Choropleth.COLORS.divergent.values[0]
  })

  choro.val({count: 6})

  expect(choro.count.choices.length).toBe(3)
  expect(choro.val()).toEqual({
    count: 7,
    method: 'stdClasses',
    colorScheme: 'divergent',
    colors: Choropleth.COLORS.divergent.values[0]
  })

  choro.val({count: 5})

  expect(choro.count.choices.length).toBe(3)
  expect(choro.val()).toEqual({
    count: 5,
    method: 'stdClasses',
    colorScheme: 'divergent',
    colors: ['#762a83', '#af8dc3', '#d9f0d3', '#7fbf7b', '#1b7837']
  })

  choro.count.val([])
  choro.val({method: 'ckmeansClasses'})

  expect(choro.count.choices.length).toBe(6)
  expect(choro.val()).toEqual({
    count: 7,
    method: 'ckmeansClasses',
    colorScheme: 'divergent',
    colors: Choropleth.COLORS.divergent.values[0]
  })
})

test('arrEq', () => {
  expect.assertions(8)

  const choro = new Choropleth()

  expect(choro.arrEq([1, 2, 3, 4], [1, 2, 3, 4])).toBe(true)
  expect(choro.arrEq([1, 2, 3, 4], [1, 2, 4, 3])).toBe(false)
  expect(choro.arrEq([1, 2, 3, 4], [4, 3, 2, 1])).toBe(false)
  expect(choro.arrEq([1, 2, 3, 4], [1, 2, 3, 4, 5])).toBe(false)
  expect(choro.arrEq([0, 1, 2, 3, 4], [1, 2, 3, 4])).toBe(false)
  expect(choro.arrEq([], [])).toBe(true)
  expect(choro.arrEq(null, [])).toBe(false)
  expect(choro.arrEq([])).toBe(false)
})

test('resizeColors', () => {
  expect.assertions(25)

  const choro = new Choropleth()

  const original = choro.colors.val()[0].values

  let resized = choro.resizeColors(original, 6)

  expect(resized.length).toBe(6)
  expect(resized[0]).toBe(original[0])
  expect(resized[1]).toBe(original[1])
  expect(resized[2]).toBe(original[2])
  expect(resized[3]).toBe(original[4])
  expect(resized[4]).toBe(original[5])
  expect(resized[5]).toBe(original[6])

  resized = choro.resizeColors(original, 5)

  expect(resized.length).toBe(5)
  expect(resized[0]).toBe(original[0])
  expect(resized[1]).toBe(original[1])
  expect(resized[2]).toBe(original[4])
  expect(resized[3]).toBe(original[5])
  expect(resized[4]).toBe(original[6])

  resized = choro.resizeColors(original, 4)

  expect(resized.length).toBe(4)
  expect(resized[0]).toBe(original[0])
  expect(resized[1]).toBe(original[1])
  expect(resized[2]).toBe(original[5])
  expect(resized[3]).toBe(original[6])

  resized = choro.resizeColors(original, 3)

  expect(resized.length).toBe(3)
  expect(resized[0]).toBe(original[0])
  expect(resized[1]).toBe(original[5])
  expect(resized[2]).toBe(original[6])

  resized = choro.resizeColors(original, 2)

  expect(resized.length).toBe(2)
  expect(resized[0]).toBe(original[0])
  expect(resized[1]).toBe(original[6])
})

test('btnHndlr', () => {
  expect.assertions(1)

  const choro = new Choropleth()

  choro.on('change', event => {
    expect(event).toBe(choro)
  })

  choro.find('.apply').trigger('click')
})

test('legItem', () => {
  expect.assertions(18)

  const choro = new Choropleth()

  let it = choro.legItem('#ff0000', 0, 10)

  expect(it.hasClass('it')).toBe(true)
  expect(it.children().length).toBe(4)

  expect(it.children().first().hasClass('sym')).toBe(true)
  expect(it.children().first().attr('style')).toBe('background-color:#ff0000')

  expect($(it.children().get(1)).hasClass('gt')).toBe(true)
  expect($(it.children().get(1)).html()).toBe('0')

  expect($(it.children().get(2)).hasClass('to')).toBe(true)
  expect($(it.children().get(2)).html()).toBe('-')

  expect($(it.children().get(3)).hasClass('lt')).toBe(true)
  expect($(it.children().get(3)).html()).toBe('10')

  it = choro.legItem('#0000ff', 0.1234, 10.3456, 2)

  expect(it.children().first().hasClass('sym')).toBe(true)
  expect(it.children().first().attr('style')).toBe('background-color:#0000ff')

  expect($(it.children().get(1)).hasClass('gt')).toBe(true)
  expect($(it.children().get(1)).html()).toBe('0.12')

  expect($(it.children().get(2)).hasClass('to')).toBe(true)
  expect($(it.children().get(2)).html()).toBe('-')

  expect($(it.children().get(3)).hasClass('lt')).toBe(true)
  expect($(it.children().get(3)).html()).toBe('10.35')
})

test('legend', () => {
  expect.assertions(37)

  const choro = new Choropleth()

  const original = choro.colors.val()[0].values

  let resized = choro.resizeColors(original, 5)
  let classifications = [1.2, 3, 4, 4.6, 7, 9]
  
  let leg = choro.legend('legend-title', classifications, resized)

  expect(leg.hasClass('leg')).toBe(true)

  const items = leg.find('.it')
  
  expect($($(items.get(0)).children().get(0)).hasClass('sym')).toBe(true)
  expect($($(items.get(0)).children().get(0)).attr('style')).toBe(`background-color:${resized[0]}`)
  
  expect($($(items.get(0)).children().get(1)).hasClass('op')).toBe(true)
  expect($($(items.get(0)).children().get(1)).html()).toBe('&lt;')

  expect($($(items.get(0)).children().get(2)).hasClass('lt')).toBe(true)
  expect($($(items.get(0)).children().get(2)).html()).toBe(`${new Number(classifications[1].toFixed(0)).toLocaleString()}`)

  expect($($(items.get(items.length - 1)).children().get(0)).hasClass('sym')).toBe(true)
  expect($($(items.get(items.length - 1)).children().get(0)).attr('style')).toBe(`background-color:${resized[resized.length - 1]}`)
  
  expect($($(items.get(items.length - 1)).children().get(1)).hasClass('op')).toBe(true)
  expect($($(items.get(items.length - 1)).children().get(1)).html()).toBe('&gt;')

  expect($($(items.get(items.length - 1)).children().get(2)).hasClass('gt')).toBe(true)
  expect($($(items.get(items.length - 1)).children().get(2)).html()).toBe(`${new Number(classifications[classifications.length - 2].toFixed(0)).toLocaleString()}`)

  for (let i = 1; i < resized.length - 1; i++) {
    const it = $(items.get(i))

    expect($(it.children().get(0)).hasClass('sym')).toBe(true)
    expect($(it.children().get(0)).attr('style')).toBe(`background-color:${resized[i]}`)
  
    expect($(it.children().get(1)).hasClass('gt')).toBe(true)
    expect($(it.children().get(1)).html()).toBe(`${new Number(classifications[i].toFixed(0)).toLocaleString()}`)
  
    expect($(it.children().get(2)).hasClass('to')).toBe(true)
    expect($(it.children().get(2)).html()).toBe('-')
  
    expect($(it.children().get(3)).hasClass('lt')).toBe(true)
    expect($(it.children().get(3)).html()).toBe(`${new Number(classifications[i + 1].toFixed(0)).toLocaleString()}`)

  }
})
