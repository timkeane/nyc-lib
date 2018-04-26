import EventHandling from 'nyc/EventHandling'

test('constructor', () => { 
    const handling = new EventHandling()
    expect(handling.evtHdlrs).toEqual({})
})

test('on', () => {
    const handling = new EventHandling()

	const aHandler = function(){}
	const anotherHandler = function(data){}
	const anObj = {
		name: 'anObj',	
		handler: function(){}
	}
	const anotherObj = {
		name: 'anotherObj',
		handler: function(data){}
	}

	handling.on('event1', aHandler)

	expect(handling.evtHdlrs['event1'].length).toBe(1)
	expect(handling.evtHdlrs['event1'][0]).toEqual({
        handler: aHandler, scope: undefined, remove: undefined
    })

	handling.on('event1', anObj.handler, anObj)

	expect(handling.evtHdlrs['event1'].length).toBe(2)
	expect(handling.evtHdlrs['event1'][0]).toEqual({
        handler: aHandler, scope: undefined, remove: undefined
    })
	expect(handling.evtHdlrs['event1'][1]).toEqual({
        handler: anObj.handler, scope: anObj, remove: undefined
    })

	handling.on('event2', anotherHandler)

	expect(handling.evtHdlrs['event2'].length).toBe(1)
	expect(handling.evtHdlrs['event2'][0]).toEqual({
		handler: anotherHandler, scope: undefined, remove: undefined
	})

	handling.on('event2', anotherObj.handler, anotherObj)

	expect(handling.evtHdlrs['event2'].length).toBe(2)
	expect(handling.evtHdlrs['event2'][0]).toEqual({
		handler: anotherHandler, scope: undefined, remove: undefined
	})
	expect(handling.evtHdlrs['event2'][1]).toEqual({
		handler: anotherObj.handler, scope: anotherObj, remove: undefined
	})

})

test('one', () => {
	const handling = new EventHandling()

	const aHandler = function(){}
	const anotherHandler = function(data){}
	const anObj = {
		name: 'anObj',	
		handler: function(){}
	}
	const anotherObj = {
		name: 'anotherObj',
		handler: function(data){}
	}

	handling.one('event1', aHandler)

	expect(handling.evtHdlrs['event1'].length).toBe(1)
	expect(handling.evtHdlrs['event1'][0]).toEqual({
		handler: aHandler, scope: undefined, remove: true
	})

	handling.one('event1', anObj.handler, anObj)

	expect(handling.evtHdlrs['event1'].length).toBe(2)
	expect(handling.evtHdlrs['event1'][0]).toEqual({
		handler: aHandler, scope: undefined, remove: true
	})
	expect(handling.evtHdlrs['event1'][1]).toEqual({
		handler: anObj.handler, scope: anObj, remove: true
	})

	handling.one('event2', anotherHandler)

	expect(handling.evtHdlrs['event2'].length).toBe(1)
	expect(handling.evtHdlrs['event2'][0]).toEqual({
		handler: anotherHandler, scope: undefined, remove: true
	})

	handling.one('event2', anotherObj.handler, anotherObj)

	expect(handling.evtHdlrs['event2'].length).toBe(2)
	expect(handling.evtHdlrs['event2'][0]).toEqual({
		handler: anotherHandler, scope: undefined, remove: true
	})
	expect(handling.evtHdlrs['event2'][1]).toEqual({
		handler: anotherObj.handler, scope: anotherObj, remove: true
	})	
})

test('trigger a single stand alone function for a single event', () => {
	const handling = new EventHandling()

	const aHandler = jest.fn(data => {
		expect(data).toBe('data1')
	})

	handling.on('event1', aHandler)

	handling.trigger('event1', 'data1')
	expect(aHandler).toHaveBeenCalledTimes(1)
})

test('trigger stand alone function from many for a single event', () => {
	const handling = new EventHandling()

	const aHandlerNotToCall = jest.fn(data => {})

	const aHandlerToCall = jest.fn(data => {
		expect(data).toBe('data2')
	})

	handling.on('event1', aHandlerNotToCall)
	handling.on('event2', aHandlerToCall)

	handling.trigger('event2', 'data2')
	expect(aHandlerNotToCall).toHaveBeenCalledTimes(0)
	expect(aHandlerToCall).toHaveBeenCalledTimes(1)
})

test('trigger multiple stand alone function for a single event', () => {
	const handling = new EventHandling()

	const handler1 = jest.fn(data => {
		expect(data).toBe('data1')
	})

	const handler2 = jest.fn(data => {
		expect(data).toBe('data1')
	})

	handling.on('event1', handler1)
	handling.on('event1', handler2)

	handling.trigger('event1', 'data1')
	expect(handler1).toHaveBeenCalledTimes(1)
	expect(handler2).toHaveBeenCalledTimes(1)
})

test('trigger function within scope', () => {
	const handling = new EventHandling()

	const scope = {
		handler: jest.fn(data => {
			expect(data).toBe('data1')
		})
	}

	handling.on('event1', scope.handler, scope)

	handling.trigger('event1', 'data1')
	expect(scope.handler).toHaveBeenCalledTimes(1)
})

test('off single handler', () => {
	const handling = new EventHandling()

	const aHandler = jest.fn()

	handling.on('event1', aHandler)
	expect(handling.evtHdlrs['event1'].length).toBe(1)

	handling.off('event1', aHandler)
	expect(handling.evtHdlrs['event1'].length).toBe(0)
})

test('off multiple handlers remove from middle', () => {
	const handling = new EventHandling()

	const handler1 = jest.fn()
	const handler2 = jest.fn()
	const handler3 = jest.fn()

	handling.on('event1', handler1)
	handling.on('event1', handler2)
	handling.on('event1', handler3)

	expect(handling.evtHdlrs['event1'].length).toBe(3)

	handling.off('event1', handler2)
	expect(handling.evtHdlrs['event1'].length).toBe(2)
	expect(handling.evtHdlrs['event1'][0].handler).toEqual(handler1)
	expect(handling.evtHdlrs['event1'][1].handler).toEqual(handler3)
})

test('off multiple handlers remove from beginnig', () => {
	const handling = new EventHandling()

	const handler1 = jest.fn()
	const handler2 = jest.fn()
	const handler3 = jest.fn()

	handling.on('event1', handler1)
	handling.on('event1', handler2)
	handling.on('event1', handler3)

	expect(handling.evtHdlrs['event1'].length).toBe(3)

	handling.off('event1', handler1)
	expect(handling.evtHdlrs['event1'].length).toBe(2)
	expect(handling.evtHdlrs['event1'][0].handler).toEqual(handler2)
	expect(handling.evtHdlrs['event1'][1].handler).toEqual(handler3)
})

test('off multiple handlers remove from end', () => {
	const handling = new EventHandling()

	const handler1 = jest.fn()
	const handler2 = jest.fn()
	const handler3 = jest.fn()

	handling.on('event1', handler1)
	handling.on('event1', handler2)
	handling.on('event1', handler3)

	expect(handling.evtHdlrs['event1'].length).toBe(3)

	handling.off('event1', handler3)
	expect(handling.evtHdlrs['event1'].length).toBe(2)
	expect(handling.evtHdlrs['event1'][0].handler).toEqual(handler1)
	expect(handling.evtHdlrs['event1'][1].handler).toEqual(handler2)
})