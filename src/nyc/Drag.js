/**
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
    this.element = $(options.target).addClass('drag')
    if (this.handle) {
      this.element = this.element.find(this.handle)
    }
    this.element.css('cursor', options.cursor || 'move')
      .on('mousedown', $.proxy(this.down, this))
      .on('mouseup', $.proxy(this.up, this))
  }
  down(event) {
    let drag
    this.dragging = true
    event.preventDefault();
    if (this.handle) {
      drag = this.element.addClass('drag-hndl')
        .parent()
        .addClass('dragging')
    } else {
      drag = this.element.addClass('dragging')
    }
    this.startLeft = drag.offset().left;
    this.startTop = drag.offset().top;
    this.width = drag.outerWidth();
    this.height = drag.outerHeight();
    this.startZ = drag.css('z-index');
    this.startX = this.startLeft + this.width - event.pageX;
    this.startY = this.startTop + this.height - event.pageY;
    drag.css('z-index', 1000)
      .parents()
      .on('mousemove', $.proxy(this.move, this))
  }
  move(event) {
    if (this.dragging) {
      $('.dragging').offset({
        left: event.pageX + this.startX - this.width,
        top: event.pageY + this.startY - this.height
      }).on('mouseup', function(e) {
        $(e.target).removeClass('dragging')
          .css('z-index', this.startZ);
      });
    }
  }
  up(event) {
    this.dragging = false
    if (this.handle) {
      this.element.removeClass('drag-hndl')
        .parent()
        .removeClass('dragging');
    } else {
      this.element.removeClass('dragging');
    }
  }
}

export default Drag
