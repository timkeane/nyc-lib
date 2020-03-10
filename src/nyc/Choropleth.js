/**
 * @module nyc/Choropleth
 */

import $ from 'jquery'
import Choice from 'nyc/Choice'
import Collapsible from 'nyc/Collapsible'
import Container from 'nyc/Container'
import Stats from 'nyc/Stats'

/**
 * @desc Class for creating a set of controls for gerating rules for choropleth maps
 * @public
 * @class
 * @extends {module:nyc/Container~Container}
 * @fires module:nyc/Choropleth~Choropleth#change
 */
class Choropleth extends Container {
  /**
   * @desc Create an instance of Choropleth
   * @public
   * @constructor
   * @param {module:nyc/Choropleth~Choropleth.Rules} options The rules to set on the controls
   */
  constructor(options) {
    super(Choropleth.HTML)
    
    this.colorSchemes = Object.assign({}, Choropleth.COLORS)

    const counts = []
    for (let i = 7; i > 1; i--) {
      counts.push({name: 'count', label: `${i} classifications`, values: [i]})
    }
    counts[0].checked = true
    this.count = new Choice({
      target: $('<div></div>'),
      choices: counts,
      radio: true
    })
    this.appendCollapsible('Number of classifications', this.count.getContainer(), 'count')

    this.method = this.choicesFromKeys(Stats.METHODS, 'method', 'mthd')
    this.colorScheme = this.choicesFromKeys(this.colorSchemes, 'colorScheme', 'clr-sch')
    this.colors = this.choicesFromKeys({}, 'color', 'clr')
    this.appendCollapsible('Classification method', this.method.getContainer(), 'cls-mth')
    this.appendCollapsible('Color scheme', this.colorScheme.getContainer(), 'clr-sch')
    this.colorsClps = this.appendCollapsible('Color', this.colors.getContainer(), 'clr')
    this.apply = $('<button class="btn rad-all apply">Apply</button>')
    this.getContainer().append(this.apply)
    this.colorScheme.on('change', this.colorChoices, this)
    this.apply.click($.proxy(this.btnHdlr, this))
    this.count.on('change', this.adjustColors, this)
    this.method.on('change', this.adjustCounts, this)
    this.val(options)
  }
  /**
   * @private
   * @method
   */
  adjustCounts() {
    const lastCount = this.count.val()[0].values[0]
    const std = this.method.val()[0].values[0] === Stats.METHODS.stdDeviation.name
    
    let checked = false
    const counts = [] 
    for (let i = 7; i > 1; i--) {
      if (std) {
        if (i % 2) {
          counts.push({
            name: 'count', 
            label: `${i} classifications`, 
            values: [i],
            checked: i === lastCount
          })
          if (i === lastCount) {
            checked = true
          }
        }
      } else {
        counts.push({
          name: 'count', 
          label: `${i} classifications`, 
          values: [i],
          checked: i === lastCount
        })
        if (i === lastCount) {
          checked = true
        }
      }
    }
    if (!checked) {
      counts[0].checked = true
    }
    this.count.setChoices(counts)
    this.count.trigger('change', this.count)
  }
  /**
   * @private
   * @method
   */
  adjustColors() {
    const me = this
    const size = this.count.val()[0].values[0]
    const colorScheme = this.colorScheme.val()[0].label.toLowerCase()
    const colors = this.colorSchemes[colorScheme].values
    const inputs = this.colors.inputs
    const choices = []
    colors.forEach((color, i) => {
      const label = $('<div>&nbsp;</div>')
      const values = this.resizeColors(color, size)
      const input = $(inputs.get(i))
      values.forEach(color => {
        label.append(`<div class="clr" style="background-color:${color}"></div>`)
      })
      const choice = {
        label,
        name: input.attr('name'),
        values,
        checked: input.prop('checked')
      }
      choices.push(choice)
      const reverse = $(Choropleth.REV_BTN_HTML)
        .data('choice', choice)
        .data('colorScheme', this.colorScheme.val()[0].label.toLowerCase())
        .click($.proxy(this.reverseColors, this))
      label.append(reverse)
    })
    this.colors.setChoices(choices)
  }
  /**
   * @private
   * @method
   * @param {JQuery.Event}
   */
  reverseColors(event) {
    const target = $(event.target)
    this.val({
      colorScheme: target.data('colorScheme'),
      colors: target.data('choice').values.reverse()
    })
  }
  /**
   * @desc Get or set the choropleth rules
   * @public
   * @method
   * @param {Chorpleth.Rules=} options The rules to set on the controls
   * @return {Chorpleth.Rules=} The rules that are set on the controls
   */
  val(options) {
    if (options) {
      this.count.choices.forEach(choice => {
        if (choice.values[0] === options.count) {
          this.method.val([choice])
        }
      })
      this.method.choices.forEach(choice => {
        if (choice.values[0] === options.method) {
          this.method.val([choice])
        }
      })
      this.colorScheme.choices.forEach(choice => {
        if (choice.label.toLowerCase() === options.colorScheme) {
          this.colorScheme.val([choice])
        }
      })
      this.colorScheme.trigger('change', this.colorScheme)
      this.colors.choices.some((choice, i) => {
        if (this.arrEq(choice.values, options.colors)) {
          return true
          this.colors.val([choice])
          this.adjustColors()
        } else if (this.arrEq(choice.values.reverse(), options.colors)) {
          this.colorSchemes[options.colorScheme].values[i].reverse()
          this.colors.val([choice])
          this.adjustColors()
          return true
        } else {
          choice.values.reverse()
        }
      })
    } else {
      let colors = this.colors.val()[0].values
      colors = this.resizeColors(colors, this.count.val())
      return {
        count: this.count.val()[0].values[0],
        colorScheme: this.colorScheme.val()[0].label.toLowerCase(),
        method: this.method.val()[0].values[0],
        colors
      }
    }
  }
  /**
   * @private
   * @method
   * @param {Array<number>|Array<string>} array1
   * @param {Array<number>|Array<string>} array2
   * @returns {boolean}
   */
  arrEq(array1, array2) {
    let equal = true
    if (array1.length === array2.length) {
      array1.some((a, i) => {
        equal = a === array2[i]
        return !equal
      })
    }
    return equal
  }
  /**
   * @private
   * @method
   * @param {Array<string>} original
   * @param {number} size
   * @returns {Array<string>}
   */
  resizeColors(original, size) {
    const modified = []
    original.forEach(element => {
      modified.push(element)
    })
    while (modified.length > size) {
      const mid = Math.floor((modified.length - 1) / 2)
      modified.splice(mid, 1)
    }
    return modified
  }
  /**
   * @private
   * @method
   */
  btnHdlr() {
    this.trigger('change', this)
  }
  /**
   * @private
   * @method
   * @param {string} title
   * @param {JQuery} content
   * @param {string} css
   */
  appendCollapsible(title, content, css) {
    const collapsible = new Collapsible({
      target: $(`<div class="${css}"></div>`),
      title,
      content,
      collapsed: title === 'Color'
    })
    this.getContainer().append(collapsible.getContainer())
    return collapsible
  }
  /**
   * @private
   * @method
   * @param {Object} obj
   * @param {string} name
   * @param {string} css
   * @returns {module:nyc/Choice~Choice}
   */
  choicesFromKeys(obj, name, css) {
    const choices = []
    Object.keys(obj).forEach(key => {
      const props = obj[key]
      let label = props.label
      let values = props.values
      if (!$.isArray(values)) {
        values = [props.name]
      }
      choices.push({name, label, values})
    })
    const radio = new Choice({
      target: $(`<div class="${css}"></div>`),
      choices: choices,
      radio: true
    })
    return radio
  }
  /**
   * @private
   * @method
   */
  colorChoices() {
    const choices = []
    this.colorScheme.val().forEach(schemes => {
      schemes.values.forEach((scheme, i) => {
        const label = $('<div class="clr">&nbsp;</div>')
        scheme.forEach(color => {
          label.append(`<div style="background-color:${color}"></div>`)
        })
        choices.push({
          name: 'colors', 
          label, 
          values: scheme, 
          checked: $(this.colors.inputs[i]).prop('checked')
        })
      })
    })
    this.colors.setChoices(choices)
    if (!this.colorsClps.find('.content').is(':visible')){
      this.colorsClps.toggle()
    }
    this.adjustColors()
    if (this.colors.val().length === 0) {
      this.colors.val([this.colors.choices[0]])
    }
  }
  /**
   * @private
   * @method
   * @param {string} color
   * @param {number} min
   * @param {number} max
   * @param {number} places
   * @returns {JQuery}
   */
  legItem(color, min, max, places) {
    places = places || 0
    return $(`<div class="it">
      <div class="sym" style="background-color:${color}">&nbsp;</div>
      <div class="gt">${new Number(min.toFixed(places)).toLocaleString()}</div>
      <div class="to">-</div>
      <div class="lt">${new Number(max.toFixed(places)).toLocaleString()}</div>
    </div>`)
  }
  /**
   * @desc Generates an HTML legend for a choropleth map
   * @public
   * @method
   * @param {string} title The title of the legend
   * @param {Array<number>} classifications The numeric classification buckets for the legend
   * @param {Array<string>} colors The colors for the classifications
   * @param {number} places The nuber of places for rounding of the classifications
   * @returns {JQuery}
   */
  legend(title, classifications, colors, places) {
    const legend = $(Choropleth.LEGEND_HTML)
    const items = legend.find('.its')
    legend.find('h3').html(title)
    classifications.forEach((cls, i) => {
      if (i < classifications.length - 1) {
        const item = this.legItem(colors[i], cls, classifications[i + 1], places)
        if (i === 0) {
          $(item.children().get(1)).remove()
          $(item.children().get(1)).remove()
          $('<div class="op">&lt;</div>').insertBefore($(item.children().get(1)))
        }
        if (i === classifications.length - 2) {
          item.children().last().remove()
          item.children().last().remove()
          $('<div class="op">&gt;</div>').insertBefore(item.children().last())
        }
        items.append(item)
      }
    })
    return legend
  }
}

/**
 * @desc Color choices for choropleth maps
 * @public
 * @const
 * @type {Object}
 */
Choropleth.COLORS = {
  divergent: {
    label: 'Divergent',
    values: [
      ['#762a83', '#af8dc3', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#7fbf7b', '#1b7837'],
      ['#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5', '#c7eae5', '#5ab4ac', '#01665e'],
      ['#b2182b', '#ef8a62', '#fddbc7', '#ffffff', '#e0e0e0', '#999999', '#4d4d4d']
    ]
  },
  sequential: {
    label: 'Sequential',
    values: [
      ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04'],
      ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
      ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026']     
    ]
  }
}

/**
 * @desc Rules options for {@link module:nyc/Choropleth~Choropleth#val}
 * @public
 * @typedef {Object}
 * @property {number} count The number of classifications
 * @property {string} method The classification method
 * @property {string} colorScheme The name of the color scheme ('divergent' or 'sequential')
 * @property {Array<string>} colors An array of hex colors
 */
Choropleth.Rules

/**
 * @desc The change event
 * @event module:nyc/Choropleth~Choropleth#change
 * @type {module:nyc/Choropleth~Choropleth}
 */

/**
 * @private
 * @const
 * @type {string}
 */
Choropleth.HTML = '<div class="choro"></div>'

/**
 * @private
 * @const
 * @type {string}
 */
Choropleth.LEGEND_HTML = `<div class="leg" title="Map legend">
  <h3></h3>
  <div class="its"></div>
</div>`

/**
 * @private
 * @const
 * @type {string}
 */
Choropleth.REV_BTN_HTML = `<button class="rev" title="Reverse colors">
  <span class="screen-reader-only">Reverse colors</span>&#x21C4;
</button>`

export default Choropleth
