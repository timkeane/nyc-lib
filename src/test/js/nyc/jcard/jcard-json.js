(function(){

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
	var rev = date.toISOString();
	var z = rev.substr(rev.length - 1);
	rev = rev.replace(/-|:/g, '');
	rev = rev.substr(0, rev.indexOf('.')) + z;
	
	var builder = new nyc.jcard.Builder();
	builder.add(builder.name(name));
	builder.add(builder.address(address));
	builder.add(builder.email(email1));
	builder.add(builder.email(email2));
	builder.add(builder.phone(phone1));
	builder.add(builder.phone(phone2));
	builder.add(builder.url(url1));
	builder.add(builder.url(url2));
	builder.add(builder.organization(organization));
	builder.add(builder.timezone('-5:00'));
	builder.add(builder.geography(geo));
	builder.add(builder.note('First note right here!\nSecond note right there!'));
	builder.add(builder.revision(date));
	
	return [builder.json(), rev];
	
}());