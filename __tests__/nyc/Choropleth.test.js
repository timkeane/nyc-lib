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