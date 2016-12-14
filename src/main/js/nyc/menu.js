var nyc = nyc || {};

/**
 * @desc Abstract class that menu toggling control
 * @public
 * @abstract
 * @class
 * @constructor
 */
nyc.Menu = function(){};

nyc.Menu.prototype = {
	/**
	 * @desc The HTML DOM element that is the menu container
	 * @public
	 * @member {Element} type 
	 */
	menu: null,
	/**
	 * @desc Close all other menus and toggle this menu
	 * @public
	 * @method
	 */
	toggleMenu: function(){
		var me = this, open = $('.ctl-mnu-tgl.mnu-open').not($(me.menu));
		if (open.length){
			open.slideUp(function(){
				$(me.menu).slideToggle(me.css);
			});						
		}else{
			$(me.menu).slideToggle(me.css);
		}
	},
	/**
	 * @private
	 * @method
	 */
	css: function(){
		$('.ctl-mnu-tgl:hidden').removeClass('mnu-open');
		$('.ctl-mnu-tgl:visible').addClass('mnu-open');
	}
};