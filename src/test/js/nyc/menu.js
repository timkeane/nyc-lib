QUnit.module('nyc.Menu');

QUnit.test('toggleMenu', function(assert){
	assert.expect(6);
	
	var done = assert.async();
	 
	var mnu = $('<div class="ctl-mnu-tgl"></div>');
	var other = $('<div class="ctl-mnu-tgl"></div>');

	$('body').append([mnu, other]);

	mnu.hide();
	
	var menu = new nyc.Menu();
	menu.menu = mnu.get(0);
	
	assert.equal(mnu.css('display'), 'none');
	assert.equal(other.css('display'), 'block');
	
	menu.toggleMenu();
	
	setTimeout(function(){
		assert.equal(other.css('display'), 'none');
		setTimeout(function(){
			assert.equal(mnu.css('display'), 'block');
			menu.toggleMenu();
			setTimeout(function(){
				assert.equal(mnu.css('display'), 'none');
				assert.equal(other.css('display'), 'none');
				done();
			}, 500);
		}, 500);
	}, 500);

});
