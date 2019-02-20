/**
 * Work in progress - not built into librariy for now
 * @module nyc/Drag
 */

import $ from 'jquery'

/**
 * @desc Class
 * @public
 * @class
 */
class Drag {
/**
   * @desc Create an instance of Drag
   * @public
   * @constructor
   * @param {Object} options Constructor options
   */
  constructor(options) {
    this.dragging = false
    this.startTop = 0
    this.startLeft = 0
    this.width = 0
    this.height = 0
    this.startZ = 0
    this.handle = options.handle
    this.target = $(options.target)
    this.targetStartPosition = {
      left: this.target.css('left'),
      top: this.target.css('top'),
      bottom: this.target.css('bottom'),
      right: this.target.css('right')
    }
    this.element = this.target.addClass('drag')
    if (this.handle) {
      this.element = this.element.find(this.handle)
      this.drag = this.element.addClass('drag-hndl').parent()
    } else {
      this.drag = this.element
    }
    this.growTail(options)
    this.element.css('cursor', options.cursor || 'move')
      .on('mousedown', $.proxy(this.down, this))
    $(document).on('mousemove', $.proxy(this.move, this))
    $(document).on('mouseup', $.proxy(this.up, this))
  }
  down(event) {
    this.dragging = true
    event.preventDefault()
    this.startLeft = this.drag.offset().left
    this.startTop = this.drag.offset().top
    this.width = this.drag.outerWidth()
    this.height = this.drag.outerHeight()
    this.startZ = this.drag.css('z-index')
    this.startX = this.startLeft + this.width - event.pageX
    this.startY = this.startTop + this.height - event.pageY
    this.drag.addClass('dragging').css('z-index', 1000)
  }
  tailDown() {
    const points = this.tail.find('.pointer').attr('points')
    this.pointsAttr = points.split(' ')
    this.startPoints = []
    this.pointsAttr.forEach(p => {
      const xy = p.split(',')
      this.startPoints.push({x: xy[0] * 1, y: xy[1] * 1})
    })
  }
  move(event) {
    if (this.dragging) {
      $('.dragging').offset({
        left: event.pageX + this.startX - this.width,
        top: event.pageY + this.startY - this.height
      })
      $(document).on('mouseup', function(e) {
        $(e.target).removeClass('dragging')
          .css('z-index', this.startZ)
      })
    }
  }
  tailMove(event) {
    if (this.dragging) {
      const left = event.pageX + this.startX - this.width
      const top = event.pageY + this.startY - this.height
      const dLdeft = left - this.startLeft
      const dTop = top - this.startTop
      this.pointsAttr[1] = (this.startPoints[1].x - dLdeft) + ',' + (this.startPoints[1].y - dTop)
      this.tail.find('.pointer').attr('points', this.pointsAttr.join(' '))
    }
  }
  up(event) {
    this.dragging = false
    if (this.handle) {
      this.element.removeClass('drag-hndl')
        .parent()
        .removeClass('dragging')
    } else {
      this.element.removeClass('dragging')
    }
  }
  resetTail() {
    if (this.tail) {
      const target = this.target
      const copyFrom = target.children().length ? target.children().last() : target
      const bgColor = copyFrom.css('background-color')
      const fill = (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') ? '#fff' : bgColor
      const width = parseFloat(copyFrom.css('border-bottom-width'))
      const y = width / 2
      this.tail.css({
        'margin-top': `${this.tailOffset[1] - width}px`,
        'margin-left': `${this.tailOffset[0]}px`
      })
      this.tail.find('polyline.mask')
        .attr({
          points: `0,${y} 24,${y}`,
          stroke: fill,
          fill: 'none',
          'stroke-width': width
        })
      this.tail.find('polyline.pointer')
        .attr({
          points: `0,${y} 12,12 24,${y}`,
          stroke: copyFrom.css('border-bottom-color'),
          fill: fill,
          'stroke-width': width
        })
      this.target.append(this.tail)
    }
  }
  growTail(options) {
    if (options.tail) {
      this.tail = $(Drag.TAIL_SVG)
      this.tailOffset = options.tailOffset || [0, 0]
      this.resetTail()
      this.element.on('mousedown', $.proxy(this.tailDown, this))
      $(document).on('mousemove', $.proxy(this.tailMove, this))
    }
  }
}

/**
 * @desc Constructor option for {@link module:nyc/Drag~Drag}
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} target The DOM node that will become draggable
 * @property {jQuery|Element|string=} handle The child node of the target that will used as the dragging handle
 * @property {boolean} [tail=false] Attach a callout tail that will always point at its starting location
 * @property {Array<Number>} [tailOffset=[0, 0]] Offset the tail
 */
Drag.Options

Drag.TAIL_SVG = '<svg class="tail" width="1" height="1">' +
  '<polyline class="mask" points="0,0 24,0"/>' +
  '<polyline class="pointer" stroke-linecap="round"/>' +
'</svg>'

Drag.START_POINTS = '0,0 12,12 24,0'

export default Drag
