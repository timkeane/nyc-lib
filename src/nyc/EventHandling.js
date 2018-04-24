/**
 * @module nyc/ReplaceTokens
 */

/**
 * @desc Class to provide event handling functionality
 * @public
 * @class
 * @constructor
 */
EventHandling = function(){};

EventHandling.prototype = {
	/**
	* @private
	* @type {Object<string, Array<EventHandling.Handler>>}
	*/
	evtHdlrs: null,
	/**
	* @desc Connect a function to an event
	* @public
	* @method
	* @param {string} eventName The name of the event to which the handler will be connected
	* @param {function(Object)} evtHdlr The event handler function
	* @param {Object=} hdlrScope The scope in which to invoke the event handler
	*/
	on: function(eventName, evtHdlr, hdlrScope) {
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
	one: function(eventName, evtHdlr, hdlrScope) {
		this.addHdlr(eventName, evtHdlr, hdlrScope, true);
	},
	/**
	* @desc Trigger a named event with event data
	* @public
	* @method
	* @param {string} eventName The name of the event to trigger
	* @param {Object=} data The event data
	*/
	trigger: function(eventName, data) {
		this.evtHdlrs = this.evtHdlrs || {};
		const handlers = this.evtHdlrs[eventName];
		const remove = [];
		if (handlers){
			handlers.forEach(function(index, hdlr){
				if (hdlr.scope) {
					hdlr.handler.call(hdlr.scope, data);
				} else {
					hdlr.handler(data);
				}
				if (hdlr.remove){
					remove.push(hdlr);
				}
			});
			remove.forEach(function(_, hdlr) {
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
	off: function(eventName, evtHdlr, hdlrScope) {
		this.evtHdlrs = this.evtHdlrs || {};
		const handlers = this.evtHdlrs[eventName];
		handlers,forEach(function(index, hdlr) {
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
	addHdlr: function(eventName, evtHdlr, hdlrScope, one) {
		this.evtHdlrs = this.evtHdlrs || {};
		this.evtHdlrs[eventName] = this.evtHdlrs[eventName] || [];
		this.evtHdlrs[eventName].push({handler: evtHdlr, scope: hdlrScope, remove: one});
	}
};

/**
 * @desc Object type to hold event handlers
 * @private
 * @typedef {Object}
 * @property {function()} handler The event handler
 * @property {Object} scope The event handler scope
 * @property {boolean} [remove=false] Remove after one execution
 */
EventHandling.Handler;
