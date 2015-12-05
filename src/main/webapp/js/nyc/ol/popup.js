/* portions of nyc.ol.ol.Popup modified from MIT (c) Matt Walker */
/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.ol = nyc.ol || {};

/**
 * An object to display popups on a map
 * @export
 * @constructor
 * @param {ol.Map} map
 * @param {olx.OverlayOptions} options Overlay options.
 *
 */
nyc.ol.Popup = function(map, options){
	var me = this;
	options = options || {};
	this.options = options;
	me.container = $(document.createElement('div'));
	me.container.addClass('popup');
	me.closer = $(document.createElement('a'));
	me.closer.addClass('popup-closer');
	me.container.append(me.closer);
	me.closer.click(function(){me.container.fadeOut();});
	me.content = $(document.createElement('div'));
	me.content.addClass('popup-content');
	me.container.append(me.content);
	options.element = me.container[0];
	options.stopEvent = true;
	ol.Overlay.call(this, options);
	map.addOverlay(me);
	if (me.options.coordinates) me.show(me.options);
};
ol.inherits(nyc.ol.Popup, ol.Overlay);

/**
 * Show popup
 * @export
 * @param {olx.OverlayOptions} options Overlay options.
 */
nyc.ol.Popup.prototype.show = function(options){
	this.setOptions(options);
	this.setPosition(this.coordinates);
	if (!this.visible()) this.container.fadeIn();
	this.pan();
};

/**
 * @private
 * @return {boolean} visibility
 */
nyc.ol.Popup.prototype.visible = function(){
	return this.container.css('display') == 'block';
};

/**
 * @private
 * @return {boolean}
 */
nyc.ol.Popup.prototype.isMobile = function(){
	return navigator.userAgent.match(/(iPad|iPhone|iPod|iOS|Android)/g) != null;
}

/**
 * set popup options
 * @export
 * @param {olx.OverlayOptions} options Overlay options.
 */
nyc.ol.Popup.prototype.setOptions = function(options){
	if (options){
		for (var o in options){
			this.options[o] = options[o];
		}
	}
	this.coordinates = this.options.coordinates;
	this.content.html(this.options.html || '').trigger('create');
	if (this.isMobile()){
		this.content.find('a, button').each(function(_, n){
			if ($(n).attr('onclick')){
				$(n).bind('tap', function(){
					$(n).trigger('click');
				});
			}
		});				
	}

	this.margin = this.options.margin || [10, 10, 10, 10];
};

/**
 * hide the popup 
 * @export
 */
nyc.ol.Popup.prototype.hide = function() {
	this.container.fadeOut();
};

/**
 * @private
 * @param {ol.Coordinate} coord
 */
nyc.ol.Popup.prototype.pan = function(coord){
	var n = this.getElement(),
		map = this.getMap(),
		view = map.getView(),
		tailHeight = parseInt($(n).css('bottom')),
		tailOffsetLeft = -parseInt($(n).css('left')),
		popOffset = this.getOffset(),
		popPx = map.getPixelFromCoordinate(this.options.coordinates),
		mapSize = map.getSize(),
		popSize = {
			width: $(n).width(),
			height: $(n).height() + tailHeight
		},
		tailOffsetRight = popSize.width - tailOffsetLeft,
		fromLeft = (popPx[0] - tailOffsetLeft) - this.margin[3],
		fromRight = mapSize[0] - (popPx[0] + tailOffsetRight) - this.margin[1],
		fromTop = popPx[1] - popSize.height + popOffset[1] - this.margin[0],
		fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1] - this.margin[2],
		center = view.getCenter(),
		px = map.getPixelFromCoordinate(center);
	if (fromRight < 0) {
		px[0] -= fromRight;
	} else if (fromLeft < 0) {
		px[0] += fromLeft;
	}
	if (fromTop < 0) {
		px[1] += fromTop;
	} else if (fromBottom < 0) {
		px[1] -= fromBottom;
	}
	map.beforeRender(ol.animation.pan({source:center}));
	view.setCenter(map.getCoordinateFromPixel(px));
};
