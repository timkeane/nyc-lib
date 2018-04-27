QUnit.module('nyc.Collapsible', {});

QUnit.test('constructor', function(assert){
	assert.expect(3);
	
	var div = $('<div><div>stuff</div></div>');
	$('body').append(div);
	
	var options = {target: div, title: 'title'};
	var collapsible = new nyc.Collapsible(options);
	var buttonHtml = div.children().first().children().first().html();
	
	assert.equal(div.children().get(0).tagName, 'H3');
	assert.ok(div.children().first().children().first().children().get(0) === collapsible.currentVal.get(0));
	assert.equal(buttonHtml.substr(0, buttonHtml.indexOf('<')), options.title);

	div.remove();
});