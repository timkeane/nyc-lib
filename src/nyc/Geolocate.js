/**
 * @module nyc/Geolocate
 */

import $ from 'jquery'

import Container from 'nyc/Container'

/**
 * @desc Abstract class for zoom and search controls
 * @public
 * @abstract
 * @class
 * @extends module:nyc/Container~Container
 * @fires module:nyc/Geolocate~Geolocate#geolocate
 */
class Geolocate extends Container {
  /**
   * @desc  Create an instance of Geolocate
   * @access protected
   * @constructor
   * @param {jQuery|Element|string} target The target
   */
  constructor(target) {
    super($(Geolocate.HTML))
    $(target).append(this.getContainer())
    this.find('.btn-geo').click($.proxy(this.geolocate, this))
  }
  /**
   * @desc Trigger the geolocate event requeted by user interaction
   * @public
   * @method
   */
  geolocate() {
    this.trigger('geolocate')
  }
}

/**
 * @desc The user has requested their geolocation
 * @event module:nyc/Geolocate~Geolocate#geolocate
 */

/**
 * @private
 * @const
 * @type {string}
 */
Geolocate.HTML = '<div class="geoloc">' +
  '<button class="btn btn-geo btn-sq rad-all btn-dark" title="Current location">' +
    '<span class="screen-reader-only">Current location</span>' +
    '<span class="fas fa-location-arrow" role="img"></span>' +
  '</button>' +
'</div>'

export default Geolocate
