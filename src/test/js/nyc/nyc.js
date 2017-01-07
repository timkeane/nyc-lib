QUnit.module('nyc.ReplaceTokens');

QUnit.test('replace', function(assert){
	assert.expect(2);
	var replace = new nyc.ReplaceTokens();
	assert.equal(
	replace.replace('the ${speed} ${color} ${animal} ${action} the ${otherThing}',
		{
			speed: 'quick',
			color: 'brown',
			animal: 'fox',
			action: 'jumped over',
			otherThing: 'lazy dog',
			notUsed: 'not used'
		}),
		'the quick brown fox jumped over the lazy dog'
	);
	assert.equal(
	replace.replace('the ${speed} ${color} ${animal} ${action} the ${otherThing}',
		{
			speed: 'slow',
			color: 'green',
			animal: 'turtle',
			action: 'crawled under',
			otherThing: 'rock',
			notUsed: 'not used'
		}),
		'the slow green turtle crawled under the rock'
	);
});

QUnit.module('nyc.EventHandling');

QUnit.test('on', function(assert){
	assert.expect(10);
	
	var aHandler = function(){};
	var anotherHandler = function(data){};
	var anObj = {
		name: 'anObj',	
		handler: function(){}
	};
	var anotherObj = {
		name: 'anotherObj',
		handler: function(data){}
	};

	var handling = new nyc.EventHandling();

	handling.on('event1', aHandler);

	assert.equal(handling.evtHdlrs['event1'].length, 1);
	assert.deepEqual(handling.evtHdlrs['event1'][0], {handler: aHandler, scope: undefined, remove: undefined});

	handling.on('event1', anObj.handler, anObj);

	assert.equal(handling.evtHdlrs['event1'].length, 2);
	assert.deepEqual(handling.evtHdlrs['event1'][0], {handler: aHandler, scope: undefined, remove: undefined});
	assert.deepEqual(handling.evtHdlrs['event1'][1], {handler: anObj.handler, scope: anObj, remove: undefined});

	handling.on('event2', anotherHandler);

	assert.equal(handling.evtHdlrs['event2'].length, 1);
	assert.deepEqual(handling.evtHdlrs['event2'][0], {handler: anotherHandler, scope: undefined, remove: undefined});

	handling.on('event2', anotherObj.handler, anotherObj);

	assert.equal(handling.evtHdlrs['event2'].length, 2);
	assert.deepEqual(handling.evtHdlrs['event2'][0], {handler: anotherHandler, scope: undefined, remove: undefined});
	assert.deepEqual(handling.evtHdlrs['event2'][1], {handler: anotherObj.handler, scope: anotherObj, remove: undefined});
});

QUnit.test('one', function(assert){
	assert.expect(10);
	
	var aHandler = function(){};
	var anotherHandler = function(data){};
	var anObj = {
		name: 'anObj',	
		handler: function(){}
	};
	var anotherObj = {
		name: 'anotherObj',
		handler: function(data){}
	};

	var handling = new nyc.EventHandling();

	handling.one('event1', aHandler);

	assert.equal(handling.evtHdlrs['event1'].length, 1);
	assert.deepEqual(handling.evtHdlrs['event1'][0], {handler: aHandler, scope: undefined, remove: true});

	handling.one('event1', anObj.handler, anObj);

	assert.equal(handling.evtHdlrs['event1'].length, 2);
	assert.deepEqual(handling.evtHdlrs['event1'][0], {handler: aHandler, scope: undefined, remove: true});
	assert.deepEqual(handling.evtHdlrs['event1'][1], {handler: anObj.handler, scope: anObj, remove: true});

	handling.one('event2', anotherHandler);

	assert.equal(handling.evtHdlrs['event2'].length, 1);
	assert.deepEqual(handling.evtHdlrs['event2'][0], {handler: anotherHandler, scope: undefined, remove: true});

	handling.one('event2', anotherObj.handler, anotherObj);

	assert.equal(handling.evtHdlrs['event2'].length, 2);
	assert.deepEqual(handling.evtHdlrs['event2'][0], {handler: anotherHandler, scope: undefined, remove: true});
	assert.deepEqual(handling.evtHdlrs['event2'][1], {handler: anotherObj.handler, scope: anotherObj, remove: true});
});

QUnit.test('trigger', function(assert){
	assert.expect(8);
	
	var aHandler = function(data){
		assert.equal(data, 'data1');
	};
	var anotherHandler = function(data){
		assert.equal(data, 'data2');
	};
	var anObj = {
		name: 'anObj',	
		handler: function(data){
			assert.equal(data, 'data1');
		}
	};
	var anotherObj = {
		name: 'anotherObj',
		handler: function(data){
			assert.equal(data, 'data2');
		}
	};

	var handling = new nyc.EventHandling();

	handling.on('event1', aHandler);
	handling.one('event1', anObj.handler, anObj);
	handling.one('event2', anotherHandler);
	handling.on('event2', anotherObj.handler, anotherObj);

	handling.trigger('event1', 'data1');
	handling.trigger('event2', 'data2');

	assert.equal(handling.evtHdlrs['event1'].length, 1);
	assert.deepEqual(handling.evtHdlrs['event1'][0], {handler: aHandler, scope: undefined, remove: undefined});
	
	assert.equal(handling.evtHdlrs['event2'].length, 1);
	assert.deepEqual(handling.evtHdlrs['event2'][0], {handler: anotherObj.handler, scope: anotherObj, remove: undefined});
});

QUnit.test('off', function(assert){
	assert.expect(6);
	
	var aHandler = function(){};
	var anotherHandler = function(data){};
	var anObj = {
		name: 'anObj',	
		handler: function(){}
	};
	var anotherObj = {
		name: 'anotherObj',
		handler: function(data){}
	};

	var handling = new nyc.EventHandling();

	handling.on('event1', aHandler);
	handling.one('event1', anObj.handler, anObj);

	assert.equal(handling.evtHdlrs['event1'].length, 2);
	assert.deepEqual(handling.evtHdlrs['event1'][0], {handler: aHandler, scope: undefined, remove: undefined});
	assert.deepEqual(handling.evtHdlrs['event1'][1], {handler: anObj.handler, scope: anObj, remove: true});

	handling.off('event1', aHandler);

	assert.equal(handling.evtHdlrs['event1'].length, 1);
	assert.deepEqual(handling.evtHdlrs['event1'][0], {handler: anObj.handler, scope: anObj, remove: true});

	handling.off('event1', anObj.handler, anObj);
	
	assert.equal(handling.evtHdlrs['event1'].length, 0);

});

QUnit.module('nyc');

QUnit.test('inherits', function(assert){
	assert.expect(12);
	var aFunc = function(arg){this.arg = arg;};
	
	var parent = function(){};
	parent.prototype.number = 1;
	parent.prototype.string = 'string';
	parent.prototype.array = ['array'];
	parent.prototype.func = aFunc;
	parent.prototype.obj = {name:'object'};
	
	var child = function(){};
	child.prototype.member = 'member';
	child.prototype.number = 2;
	
	nyc.inherits(child, parent);
	
	assert.equal(child.prototype.member, 'member');
	assert.equal(child.prototype.number, 2);
	assert.equal(child.prototype.string, parent.prototype.string);
	assert.deepEqual(child.prototype.array, parent.prototype.array);
	assert.deepEqual(child.prototype.func, parent.prototype.func);
	assert.deepEqual(child.prototype.obj, parent.prototype.obj);
	
	assert.notOk('member' in parent.prototype);
	assert.equal(parent.prototype.number, 1);
	assert.equal(parent.prototype.string, 'string');
	assert.deepEqual(parent.prototype.array, ['array']);
	assert.deepEqual(parent.prototype.func, aFunc);
	assert.deepEqual(parent.prototype.obj, {name:'object'});
});

