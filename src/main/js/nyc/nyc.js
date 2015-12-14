/** 
 * @public 
 * @namespace
 */
var nyc = nyc || {};

/** 
 * @external JQuery 
 * @see http://api.jquery.com/
 */

if (typeof proj4 == undefined){
	proj4.defs(
		'EPSG:2263',
		'+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'
	);
};

/**
 * @desc Provide inheritance functionality
 * @public
 * @static
 * @function
 * @param {Function} childCtor The child constructor
 * @param {Function} parentCtor The parent constructor
 */
nyc.inherits = function(childCtor, parentCtor){
	for (var member in parentCtor.prototype){
		if (!(member in childCtor.prototype)){
			childCtor.prototype[member] = parentCtor.prototype[member];
		}
	}
};

/**
 * @desc Class to provide string replacement functionality
 * @public
 * @class
 * @constructor
 */
nyc.ReplaceTokens = function(){};

nyc.ReplaceTokens.prototype = {
	/**
	 * @desc Replace tokens in a string with values from a provided object
	 * @public
	 * @method
	 * @param {string} str String with tokens to be replaced 
	 * @param {Object.<string, string>} values Values token for replacement
	 * @return {string} String with replacement value substitution
	 */
	replace: function(str, values){
		for (var name in values){
			str = str.replace(new RegExp('\\$\\{' + name + '\\}', 'g'), values[name]);
		}
		return str;
	}
};

/**
 * @desc Class to provide event handling functionality
 * @public
 * @class
 * @constructor
 */
nyc.EventHandling = function(){};

nyc.EventHandling.prototype = {
	/**
	 * @desc Connect a function to an event
	 * @public
	 * @method
	 * @param {string} eventName The name of the event to which the handler will be connected
	 * @param {function(Object)} evtHdlr The event handler function
	 * @param {Object=} hdlrScope The scope in which to invoke the event handler
	 */
    on: function(eventName, evtHdlr, hdlrScope){
        this.addHdlr(eventName, evtHdlr, hdlrScope);
    },
	/**
	 * @desc Connect a function to an event for a single invocation
	 * @public
	 * @method
	 * @param {string} eventName The name of the event to which the handler will be connected
	 * @param {function(Object)} evtHdlr The event handler function
	 * @param {Object=} hdlrScope The scope in which to invoke the event handler
	 */
    one: function(eventName, evtHdlr, hdlrScope){
        this.addHdlr(eventName, evtHdlr, hdlrScope, true);
    },
	/**
	 * @desc Trigger a named event with event data
	 * @public
	 * @method
	 * @param {string} eventName The name of the event to trigger
	 * @param {Object=} data The event data
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
	 * @desc Remove a previously connected event handler
	 * @public
	 * @method
	 * @param {string} eventName The name of the event to which the handler will be connected
	 * @param {function(Object)} evtHdlr The event handler function
	 * @param {Object=} hdlrScope The scope in which to invoke the event handler
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
    }
};
