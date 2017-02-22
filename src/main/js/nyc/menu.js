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
	 * @param {function()=} callback
	 */
	toggleMenu: function(callback){
		callback = callback || function(){};
		var mnu = this.menu;
		if (mnu){
			var open = $('.ctl-mnu-tgl:visible').not($(mnu));
			if (open.length){
				open.slideUp(function(){
					$(mnu).slideToggle(callback);
				});						
			}else{
				$(mnu).slideToggle(callback);
			}
		}
	}
};