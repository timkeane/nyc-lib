/** 
 * @export 
 * @namespace
 */
window.nyc = window.nyc || {};

proj4.defs(
	'EPSG:2263',
	'+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'
);

/**
 * @class
 * @classdesc Abstract class to provide string replacement functionality
 * @export
 * @constructor
 */
nyc.ReplaceTokens = function(){};

nyc.ReplaceTokens.prototype = {
	/**
	 * @export
	 * @method
	 * @param {string} str
	 * @param {Object.<string, string>} values
	 * @return {string}
	 */
	replace: function(str, values){
		for (var name in values){
			str = str.replace(new RegExp('\\$\\{' + name + '\\}', 'g'), values[name]);
		}
		return str;
	}
};

/**
 * @class
 * @classdesc Abstract class to provide event handling functionality
 * @export
 * @constructor
 */
nyc.EventHandling = function(){};

nyc.EventHandling.prototype = {
	/**
	 * @export
	 * @method
	 * @param {string} eventName
	 * @param {function(Object)} evtHdlr
	 * @param {Object=} hdlrScope
	 */
    on: function(eventName, evtHdlr, hdlrScope){
        this.addHdlr(eventName, evtHdlr, hdlrScope);
    },
	/**
	 * @export
	 * @method
	 * @param {string} eventName
	 * @param {function(Object)} evtHdlr
	 * @param {Object=} hdlrScope
	 */
    one: function(eventName, evtHdlr, hdlrScope){
        this.addHdlr(eventName, evtHdlr, hdlrScope, true);
    },
	/**
	 * @private
	 * @method
	 * @param {string} eventName
	 * @param {function(Object)} evtHdlr
	 * @param {Object} hdlrScope
	 * @param {boolean} one
	 */
    addHdlr: function(eventName, evtHdlr, hdlrScope, one){
        this.evtHdlrs = this.evtHdlrs || {};
        this.evtHdlrs[eventName] = this.evtHdlrs[eventName] || [];
        this.evtHdlrs[eventName].push({handler: evtHdlr, scope: hdlrScope, remove: one});		    	
    },
	/**
	 * @export
	 * @method
	 * @param {string} eventName
	 * @param {Object=} data
	 */
    trigger: function(eventName, data){
        this.evtHdlrs = this.evtHdlrs || {};
        var handlers = this.evtHdlrs[eventName], remove = [];
		if (handlers){
            $.each(handlers, function(index, hdlr){
                if (hdlr.scope){
                    hdlr.handler.call(hdlr.scope, data);
                }else{
                	hdlr.handler(data);
                }
                if (hdlr.remove){
                	remove.push(hdlr);
                }
            });
            $.each(remove, function(_, hdlr){
            	handlers.splice($.inArray(hdlr, handlers), 1);
            });
        }
    },
	/**
	 * @export
	 * @method
	 * @param {string} eventName
	 * @param {function(Object)} evtHdlr
	 * @param {Object=} hdlrScope
	 */
    off: function(eventName, evtHdlr, hdlrScope){
        this.evtHdlrs = this.evtHdlrs || {};
        var handlers = this.evtHdlrs[eventName];
    	$.each(handlers, function(index, hdlr){
    		if (hdlr.handler === evtHdlr && hdlr.scope === hdlrScope){
    			handlers.splice(index, 1);
    			return false;
    		}
    	});
    }
};

/**
 * @export
 * @static
 * @function
 * @param {Object} childCtor
 * @param {Object} parentCtor
 */
nyc.inherits = function(childCtor, parentCtor){
	for (var member in parentCtor.prototype){
		if (!(member in childCtor.prototype)){
			childCtor.prototype[member] = parentCtor.prototype[member];
		}
	}
};