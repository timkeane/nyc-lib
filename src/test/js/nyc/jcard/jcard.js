QUnit.config.requireExpects = true;

QUnit.module('nyc.jcard.Builder', {
	beforeEach: function(assert){
		this.BUILDER = new nyc.jcard.Builder();
	},
	afterEach: function(assert){
		delete this.BUILDER;
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(1);
	assert.deepEqual(this.BUILDER.data, ['vcard', [['version', {}, nyc.jcard.Data.TEXT, '4.0']]]);
});

QUnit.test('name', function(assert){
	assert.expect(2);
	
	var name = {
		first: 'Gregory',
		initial: 'A.',
		last: 'House',
		prefix: 'Dr.',
		suffix: 'MD'
	};
	
	var prop = this.BUILDER.name(name);
	
	assert.deepEqual(prop, [nyc.jcard.Property.NAME, {}, nyc.jcard.Data.TEXT, ['House', 'Gregory', 'A.', 'Dr.', 'MD']]);

	name = {
		first: 'Gregory',
		last: 'House'
	};
	
	prop = this.BUILDER.name(name);
	
	assert.deepEqual(prop, [nyc.jcard.Property.NAME, {}, nyc.jcard.Data.TEXT, ['House', 'Gregory', '', '', '']]);
});

QUnit.test('address', function(assert){
	assert.expect(3);
	
	var address = {
		line1: '2 Metrotect Ctr.',
		line2: '4th floor',
		city: 'Brooklyn',
		state: 'NY',
		zip: '11201',
		country: 'U.S.A.',
		type: nyc.jcard.Type.WORK
	};
	
	var prop = this.BUILDER.address(address);
	
	assert.deepEqual(prop, [nyc.jcard.Property.ADDRESS, {type: nyc.jcard.Type.WORK, label: '2 Metrotect Ctr.\\n4th floor\\nBrooklyn\\, NY 11201\\nU.S.A.'}, nyc.jcard.Data.TEXT, ['2 Metrotect Ctr.', 'Brooklyn', '4th floor', 'NY', '11201', 'U.S.A.']]);

	address = {
		line1: '2 Metrotect Ctr.',
		city: 'Brooklyn',
		state: 'NY',
		zip: '11201',
		type: nyc.jcard.Type.HOME
	};
	
	prop = this.BUILDER.address(address);
	
	assert.deepEqual(prop, [nyc.jcard.Property.ADDRESS, {type: nyc.jcard.Type.HOME, label: '2 Metrotect Ctr.\\nBrooklyn\\, NY 11201'}, nyc.jcard.Data.TEXT, ['2 Metrotect Ctr.', 'Brooklyn', '', 'NY', '11201', '']]);

	address = {
		line1: '2 Metrotect Ctr.',
		city: 'Brooklyn',
		state: 'NY',
		zip: '11201'
	};
	
	prop = this.BUILDER.address(address);
	
	assert.deepEqual(prop, [nyc.jcard.Property.ADDRESS, { label: '2 Metrotect Ctr.\\nBrooklyn\\, NY 11201'}, nyc.jcard.Data.TEXT, ['2 Metrotect Ctr.', 'Brooklyn', '', 'NY', '11201', '']]);
});

QUnit.test('email', function(assert){
	assert.expect(3);
	
	var email = {
		email: 'me@work.com',
		type: nyc.jcard.Type.WORK
	};
	
	var prop = this.BUILDER.email(email);
	
	assert.deepEqual(prop, [nyc.jcard.Property.EMAIL, {type: nyc.jcard.Type.WORK}, nyc.jcard.Data.TEXT, 'me@work.com']);

	email = {
		email: 'you@home.com',
		type: nyc.jcard.Type.HOME
	};
	
	prop = this.BUILDER.email(email);
	
	assert.deepEqual(prop, [nyc.jcard.Property.EMAIL, {type: nyc.jcard.Type.HOME}, nyc.jcard.Data.TEXT, 'you@home.com']);

	email = {
		email: 'you@home.com'
	};
	
	prop = this.BUILDER.email(email);
	
	assert.deepEqual(prop, [nyc.jcard.Property.EMAIL, {}, nyc.jcard.Data.TEXT, 'you@home.com']);
});

QUnit.test('phone', function(assert){
	assert.expect(3);
	
	var phone = {
		area: '212',
		number: '555-1212',
		extension: '234',
		type: [nyc.jcard.Type.WORK, nyc.jcard.Type.CELL]
	};
	
	var prop = this.BUILDER.phone(phone);
	
	assert.deepEqual(prop, [nyc.jcard.Property.PHONE, {type: [nyc.jcard.Type.WORK, nyc.jcard.Type.CELL]}, nyc.jcard.Data.URI, '+1-212-555-1212,234']);

	phone = {
		area: '212',
		number: '555-1212',
		type: nyc.jcard.Type.HOME
	};
	
	prop = this.BUILDER.phone(phone);
	
	assert.deepEqual(prop, [nyc.jcard.Property.PHONE, {type: nyc.jcard.Type.HOME}, nyc.jcard.Data.URI, '+1-212-555-1212']);

	phone = {
		area: '212',
		number: '555-1212'
	};
	
	prop = this.BUILDER.phone(phone);
	
	assert.deepEqual(prop, [nyc.jcard.Property.PHONE, {}, nyc.jcard.Data.URI, '+1-212-555-1212']);
});

QUnit.test('url', function(assert){
	assert.expect(3);
	
	var url = {
		url: 'http://maps.nyc.gov/',
		type: nyc.jcard.Type.WORK
	};
	
	var prop = this.BUILDER.url(url);
	
	assert.deepEqual(prop, [nyc.jcard.Property.URL, {type: nyc.jcard.Type.WORK}, nyc.jcard.Data.URI, 'http://maps.nyc.gov/']);

	url = {
		url: 'http://me.home.com/',
		type: nyc.jcard.Type.HOME
	};
	
	prop = this.BUILDER.url(url);
	
	assert.deepEqual(prop, [nyc.jcard.Property.URL, {type: nyc.jcard.Type.HOME}, nyc.jcard.Data.URI, 'http://me.home.com/']);

	url = {
		url: 'http://me.home.com/'
	};
	
	prop = this.BUILDER.url(url);
	
	assert.deepEqual(prop, [nyc.jcard.Property.URL, {}, nyc.jcard.Data.URI, 'http://me.home.com/']);
});

QUnit.test('organization', function(assert){
	assert.expect(3);
	
	var organization = {
		name: 'My Fancy Company',
		type: nyc.jcard.Type.WORK
	};
	
	var prop = this.BUILDER.organization(organization);
	
	assert.deepEqual(prop, [nyc.jcard.Property.ORGANIZATION, {type: nyc.jcard.Type.WORK}, nyc.jcard.Data.TEXT, 'My Fancy Company']);

	organization = {
		name: 'My Fancy Company',
		type: 'Fancy'
	};
	
	prop = this.BUILDER.organization(organization);
	
	assert.deepEqual(prop, [nyc.jcard.Property.ORGANIZATION, {type: 'Fancy'}, nyc.jcard.Data.TEXT, 'My Fancy Company']);

	organization = {
		name: 'My Fancy Company'
	};
	
	prop = this.BUILDER.organization(organization);
	
	assert.deepEqual(prop, [nyc.jcard.Property.ORGANIZATION, {}, nyc.jcard.Data.TEXT, 'My Fancy Company']);
});

QUnit.test('timezone', function(assert){
	assert.expect(1);
	
	var prop = this.BUILDER.timezone('-5:00');
	
	assert.deepEqual(prop, [nyc.jcard.Property.TIMEZONE, {}, nyc.jcard.Data.UTC_OFFSET, '-5:00']);
});

QUnit.test('geo', function(assert){
	assert.expect(1);
	
	var geo = {
		lng: -73.9856,
		lat: 40.6937,
		type: nyc.jcard.Type.WORK
	};
	
	var prop = this.BUILDER.geography(geo);
	
	assert.deepEqual(prop, [nyc.jcard.Property.GEOGRAPHY, {type: nyc.jcard.Type.WORK}, nyc.jcard.Data.URI, 'geo:' + geo.lat + ',' + geo.lng]);
});

QUnit.test('note', function(assert){
	assert.expect(1);

	var prop = this.BUILDER.note('This is my note right here!');
	
	assert.deepEqual(prop, [nyc.jcard.Property.NOTE, {}, nyc.jcard.Data.TEXT, 'This is my note right here!']);
});

QUnit.test('revision', function(assert){
	assert.expect(1);
	
	var date = new Date();
	var rev = date.toISOString(), z = rev.substr(rev.length - 1);
	rev = rev.replace(/-|:/g, '');
	rev = rev.substr(0, rev.indexOf('.')) + z;

	var prop = this.BUILDER.revision(date);
	
	assert.deepEqual(prop, [nyc.jcard.Property.REVISION, {}, nyc.jcard.Data.DATE, rev]);
});

QUnit.test('formattedName (has name)', function(assert){
	assert.expect(1);
	
	var name = {
		first: 'Gregory',
		initial: 'A.',
		last: 'House',
		prefix: 'Dr.',
		suffix: 'MD'
	};

	this.BUILDER.add(this.BUILDER.name(name));

	this.BUILDER.formattedName();
	
	var props = this.BUILDER.data[1];
	
	assert.deepEqual(props[props.length - 1], [nyc.jcard.Property.FORMATTED_NAME, {}, nyc.jcard.Data.TEXT, 'Dr. Gregory A. House, MD'])
});

QUnit.test('formattedName (no name, has organization)', function(assert){
	assert.expect(1);
	
	var organization = {
		name: 'My Fancy Company',
		type: nyc.jcard.Type.WORK
	};
		

	this.BUILDER.add(this.BUILDER.organization(organization));

	this.BUILDER.formattedName();
	
	var props = this.BUILDER.data[1];
	
	assert.deepEqual(props[props.length - 1], [nyc.jcard.Property.FORMATTED_NAME, {}, nyc.jcard.Data.TEXT, 'My Fancy Company'])
});

QUnit.test('formattedName (no name, no organization)', function(assert){
	assert.expect(4);
	
	var address = {
		line1: '2 Metrotect Ctr.',
		line2: '4th floor',
		city: 'Brooklyn',
		state: 'NY',
		zip: '11201',
		country: 'U.S.A.',
		type: nyc.jcard.Type.WORK
	};

	var email = {
		email: 'me@work.com',
		type: nyc.jcard.Type.WORK
	};

	var phone = {
		area: '212',
		number: '555-1212',
		extension: '234',
		type: [nyc.jcard.Type.WORK, nyc.jcard.Type.CELL]
	};
	
	var geo = {
		lng: -73.9856,
		lat: 40.6937,
		type: nyc.jcard.Type.WORK
	};	
		
	this.BUILDER.add(this.BUILDER.address(address));
	this.BUILDER.add(this.BUILDER.email(email));
	this.BUILDER.add(this.BUILDER.phone(phone));

	this.BUILDER.formattedName();
	
	$.each(this.BUILDER.data[1], function(_, prop){
		assert.notEqual(prop[0], nyc.jcard.Property.FORMATTED_NAME);
	});
});

QUnit.test('jcard', function(assert){
	assert.expect(1);
	
	var name = {
		first: 'Gregory',
		initial: 'A.',
		last: 'House',
		prefix: 'Dr.',
		suffix: 'MD'
	};

	var address = {
		line1: '2 Metrotect Ctr.',
		line2: '4th floor',
		city: 'Brooklyn',
		state: 'NY',
		zip: '11201',
		country: 'U.S.A.',
		type: nyc.jcard.Type.WORK
	};

	var email1 = {
		email: 'me@work.com',
		type: nyc.jcard.Type.WORK
	};

	var email2 = {
		email: 'me@home.com',
		type: nyc.jcard.Type.HOME
	};

	var phone1 = {
		area: '212',
		number: '555-1212',
		extension: '234',
		type: [nyc.jcard.Type.WORK, nyc.jcard.Type.CELL]
	};
		
	var phone2 = {
		area: '212',
		number: '555-5555',
		type: nyc.jcard.Type.HOME
	};
		
	var url1 = {
		url: 'http://maps.nyc.gov/',
		type: nyc.jcard.Type.WORK
	};
		
	var url2 = {
		url: 'http://me.org/',
		type: nyc.jcard.Type.HOME
	};
		
	var organization = {
		name: 'My Fancy Company',
		type: nyc.jcard.Type.WORK
	};
	
	var geo = {
		lng: -73.9856,
		lat: 40.6937,
		type: nyc.jcard.Type.WORK
	};
	
	var date = new Date();

	var rev = date.toISOString(), z = rev.substr(rev.length - 1);
	rev = rev.replace(/-|:/g, '');
	rev = rev.substr(0, rev.indexOf('.')) + z;

	var expected = ['vcard', [
			['version', {}, 'text', '4.0'],
			['n', {}, 'text', ['House', 'Gregory', 'A.', 'Dr.', 'MD']],			
			['adr', {type: 'work', label: '2 Metrotect Ctr.\\n4th floor\\nBrooklyn\\, NY 11201\\nU.S.A.'}, 'text', ['2 Metrotect Ctr.', 'Brooklyn', '4th floor', 'NY', '11201', 'U.S.A.']],
			['email', {type: 'work'}, 'text', 'me@work.com'],
			['email', {type: 'home'}, 'text', 'me@home.com'],
			['tel', {type: ['work', 'cell']}, 'uri', '+1-212-555-1212,234'],
			['tel', {type: 'home'}, 'uri', '+1-212-555-5555'],
			['url', {type: 'work'}, 'uri', 'http://maps.nyc.gov/'],
			['url', {type: 'home'}, 'uri', 'http://me.org/'],
			['org', {type: 'work'}, 'text', 'My Fancy Company'],
			['tz', {}, 'utc-offset', '-5:00'],
			['geo', {type: 'work'}, 'uri', 'geo:40.6937,-73.9856'],
			['rev', {}, 'date-and-or-time', rev],
			['note', {}, 'text', 'First note right here!\nSecond note right there!'],
			['fn', {}, 'text', 'Dr. Gregory A. House, MD']
		]
	];
	
	this.BUILDER.add(this.BUILDER.name(name));
	this.BUILDER.add(this.BUILDER.address(address));
	this.BUILDER.add(this.BUILDER.email(email1));
	this.BUILDER.add(this.BUILDER.email(email2));
	this.BUILDER.add(this.BUILDER.phone(phone1));
	this.BUILDER.add(this.BUILDER.phone(phone2));
	this.BUILDER.add(this.BUILDER.url(url1));
	this.BUILDER.add(this.BUILDER.url(url2));
	this.BUILDER.add(this.BUILDER.organization(organization));
	this.BUILDER.add(this.BUILDER.timezone('-5:00'));
	this.BUILDER.add(this.BUILDER.geography(geo));
	this.BUILDER.add(this.BUILDER.revision(date));
	this.BUILDER.add(this.BUILDER.note('First note right here!\nSecond note right there!'));
	
	assert.deepEqual(this.BUILDER.jcard(), expected);
});

QUnit.test('json', function(assert){
	assert.expect(1);
	
	var name = {
		first: 'Gregory',
		initial: 'A.',
		last: 'House',
		prefix: 'Dr.',
		suffix: 'MD'
	};

	var address = {
		line1: '2 Metrotect Ctr.',
		line2: '4th floor',
		city: 'Brooklyn',
		state: 'NY',
		zip: '11201',
		country: 'U.S.A.',
		type: nyc.jcard.Type.WORK
	};

	var email = {
		email: 'me@work.com',
		type: nyc.jcard.Type.WORK
	};

	var phone = {
		area: '212',
		number: '555-1212',
		extension: '234',
		type: [nyc.jcard.Type.WORK, nyc.jcard.Type.CELL]
	};
		
	var url = {
		url: 'http://maps.nyc.gov/',
		type: nyc.jcard.Type.WORK
	};
		
	var organization = {
		name: 'My Fancy Company',
		type: nyc.jcard.Type.WORK
	};
	
	var geo = {
		lng: -73.9856,
		lat: 40.6937,
		type: nyc.jcard.Type.WORK
	};
	
	var date = new Date();

	var rev = date.toISOString(), z = rev.substr(rev.length - 1);
	rev = rev.replace(/-|:/g, '');
	rev = rev.substr(0, rev.indexOf('.')) + z;

	var expected = ['vcard', [
			['version', {}, 'text', '4.0'],
			['n', {}, 'text', ['House', 'Gregory', 'A.', 'Dr.', 'MD']],			
			['adr', {type: 'work', label: '2 Metrotect Ctr.\\n4th floor\\nBrooklyn\\, NY 11201\\nU.S.A.'}, 'text', ['2 Metrotect Ctr.', 'Brooklyn', '4th floor', 'NY', '11201', 'U.S.A.']],
			['email', {type: 'work'}, 'text', 'me@work.com'],
			['tel', {type: ['work', 'cell']}, 'uri', '+1-212-555-1212,234'],
			['url', {type: 'work'}, 'uri', 'http://maps.nyc.gov/'],
			['org', {type: 'work'}, 'text', 'My Fancy Company'],
			['tz', {}, 'utc-offset', '-5:00'],
			['geo', {type: 'work'}, 'uri', 'geo:40.6937,-73.9856'],
			['rev', {}, 'date-and-or-time', rev],
			['note', {}, 'text', 'First note right here!\nSecond note right there!'],
			['fn', {}, 'text', 'Dr. Gregory A. House, MD']
		]
	];
	
	this.BUILDER.add(this.BUILDER.name(name));
	this.BUILDER.add(this.BUILDER.address(address));
	this.BUILDER.add(this.BUILDER.email(email));
	this.BUILDER.add(this.BUILDER.phone(phone));
	this.BUILDER.add(this.BUILDER.url(url));
	this.BUILDER.add(this.BUILDER.organization(organization));
	this.BUILDER.add(this.BUILDER.timezone('-5:00'));
	this.BUILDER.add(this.BUILDER.geography(geo));
	this.BUILDER.add(this.BUILDER.revision(date));
	this.BUILDER.add(this.BUILDER.note('First note right here!\nSecond note right there!'));
	
	assert.deepEqual(this.BUILDER.json(), JSON.stringify(expected));
});