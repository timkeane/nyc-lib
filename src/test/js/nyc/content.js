QUnit.module('nyc.Content');

QUnit.test('message', function(assert){
	assert.expect(4);

	var content = new nyc.Content({
		message1: 'This message is from ${from} to ${to}',
		message2: 'The quick ${color} fox jumps over the lazy ${animal}',
	});
	assert.equal(content.message('message1', {from: 'me', to: 'you'}), 'This message is from me to you');
	assert.equal(content.message('message1', {from: 'you', to: 'me'}), 'This message is from you to me');
	assert.equal(content.message('message2', {color: 'brown', animal: 'dog'}), 'The quick brown fox jumps over the lazy dog');
	assert.equal(content.message('message2', {color: 'red', animal: 'cow'}), 'The quick red fox jumps over the lazy cow');
});
