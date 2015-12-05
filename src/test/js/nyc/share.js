QUnit.module('nyc.Share', {
	beforeEach: function(assert){
		$('head').append('<meta prefix="og: http://ogp.me/ns#" property="og:title" content="NYC Hurricane Evacuation Zone Finder">')
			.append('<meta prefix="og: http://ogp.me/ns#" property="og:url" content="http://maps.nyc.gov/hurricane">')
			.append('<meta prefix="og: http://ogp.me/ns#" property="og:description" content="NYC Hurricane Evacuation Zone Finder...">');
	},
	afterEach: function(asset){
		$('#share-btn, #share-btns, head meta[prefix="og: http://ogp.me/ns#"]').remove();		
	}
});

QUnit.test('not iOS', function(assert){
	assert.expect(14);
	
	var isIosAppMode = nyc.Share.prototype.isIosAppMode;
	nyc.Share.prototype.isIosAppMode = function(){
		return false;
	};

	var share = new nyc.Share('body');
	
	assert.equal($('#share-btn').length, 1);
	assert.equal($('#share-btns').children().length, 6);
	
	assert.equal($('#facebook-btn').attr('href'), 'https://www.facebook.com/sharer/sharer.php?u=http://maps.nyc.gov/hurricane');
	assert.equal($('#facebook-btn').attr('target'), '_blank');

	assert.equal($('#twitter-btn').attr('href'), 'https://twitter.com/intent/tweet?text=http://maps.nyc.gov/hurricane @nycgov&source=webclient');
	assert.equal($('#twitter-btn').attr('target'), '_blank');

	assert.equal($('#google-btn').attr('href'), 'https://plus.google.com/share?url=http://maps.nyc.gov/hurricane');
	assert.equal($('#google-btn').attr('target'), '_blank');

	assert.equal($('#linkedin-btn').attr('href'), 'http://www.linkedin.com/shareArticle?mini=true&url=http://maps.nyc.gov/hurricane');
	assert.equal($('#linkedin-btn').attr('target'), '_blank');

	assert.equal($('#tumblr-btn').attr('href'), 'http://www.tumblr.com/share/link?url=http://maps.nyc.gov/hurricane&name=NYC Hurricane Evacuation Zone Finder&description=via%20NYC.gov');
	assert.equal($('#tumblr-btn').attr('target'), '_blank');

	assert.equal($('#email-btn').attr('href'), 'mailto:?subject=NYC Hurricane Evacuation Zone Finder&body=NYC Hurricane Evacuation Zone Finder...%0A%0Ahttp://maps.nyc.gov/hurricane');
	assert.notOk($('#email-btn').attr('target'));
	
	nyc.Share.prototype.isIosAppMode = isIosAppMode;
});

QUnit.test('iOS', function(assert){
	assert.expect(14);
	
	var isIosAppMode = nyc.Share.prototype.isIosAppMode;
	nyc.Share.prototype.isIosAppMode = function(){
		return true;
	};

	var share = new nyc.Share('body');
	
	assert.equal($('#share-btn').length, 1);
	assert.equal($('#share-btns').children().length, 6);
	
	assert.equal($('#facebook-btn').attr('href'), 'https://www.facebook.com/sharer/sharer.php?u=http://maps.nyc.gov/hurricane');
	assert.equal($('#facebook-btn').attr('target'), '_blank');

	assert.equal($('#twitter-btn').attr('href'), 'https://twitter.com/intent/tweet?text=http://maps.nyc.gov/hurricane @nycgov&source=webclient');
	assert.equal($('#twitter-btn').attr('target'), '_blank');

	assert.equal($('#google-btn').attr('href'), 'https://plus.google.com/share?url=http://maps.nyc.gov/hurricane');
	assert.equal($('#google-btn').attr('target'), '_blank');

	assert.equal($('#linkedin-btn').attr('href'), 'http://www.linkedin.com/shareArticle?mini=true&url=http://maps.nyc.gov/hurricane');
	assert.equal($('#linkedin-btn').attr('target'), '_blank');

	assert.equal($('#tumblr-btn').attr('href'), 'http://www.tumblr.com/share/link?url=http://maps.nyc.gov/hurricane&name=NYC Hurricane Evacuation Zone Finder&description=via%20NYC.gov');
	assert.equal($('#tumblr-btn').attr('target'), '_blank');
	
	assert.equal($('#email-btn').attr('href'), 'mailto:?subject=NYC Hurricane Evacuation Zone Finder&body=NYC Hurricane Evacuation Zone Finder...%0A%0Ahttp://maps.nyc.gov/hurricane');
	assert.equal($('#email-btn').attr('target'), '_blank');

	nyc.Share.prototype.isIosAppMode = isIosAppMode;
});

QUnit.test('open', function(assert){
	assert.expect(1);
	
	var done = assert.async();
	
	var share = new nyc.Share('body');
	
	$('#share-btns').hide();
	$('#share-btn').trigger('click');
	
	setTimeout(function(){
		assert.equal($('#share-btns').css('display'), 'block');
		done();
	}, 1000);
});

QUnit.test('close', function(assert){
	assert.expect(1);
	
	var done = assert.async();
	
	var share = new nyc.Share('body');
	
	$('#share-btns').show();
	$('body').trigger('click');
	
	setTimeout(function(){
		assert.equal($('#share-btns').css('display'), 'none');
		done();
	}, 1000);
});