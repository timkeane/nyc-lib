package jcard

import org.junit.Test
import ezvcard.Ezvcard
import ezvcard.VCard
import ezvcard.io.chain.ChainingJsonStringParser
import javax.script.*

class JCardEzvcardIntegrationTest {

	@Test
	void testJCardEzvcardIntegration() {

		def jcard = new File('src/main/js/nyc/jcard/jcard.js').getText()
		def js = new File('src/test/js/nyc/jcard/jcard-json.js').getText()
		def manager = new ScriptEngineManager()
		def engine = manager.getEngineByName('JavaScript')
		def result = engine.eval(jcard + js)
		def json = result['0']
		

		//json = '["vcard",[["version",{},"text","4.0"],["org",{},"text","Imagine Dumbo - Adams"],["adr",{"type":"work","label":"85 Adams St\\\\nBrooklyn\\\\, NY 11201\\\\nU.S.A."},"text",["85 Adams St","Brooklyn","","NY","11201","U.S.A."]],["email",{},"text","caroline@imagineelc.com"],["url",{},"uri","http://imagineelc.com"],["tz",{},"utc-offset","-5:00"],["geo",{},"uri","geo:NaN,NaN"],["note",{},"text","Program Code: KCEG\\\\n\\\\n\\\\n\\\\nProgram Features:\\\\n\\\\n\\\\tPlease contact site directly for information about meals\\\\n\\\\tOutdoor (offsite) playspace\\\\n\\\\tDaily Start Time: 9:30 a.m\\\\n\\\\tEarly Drop Off Available: Yes\\\\n\\\\tLate Pick Up Available: Yes\\\\n\\\\n2015-16 Seats: 11 Full day\\\\n\\\\n"],["fn",{},"text","Imagine Dumbo - Adams"]]]'
		
		json = '["vcard",[["version",{},"text","4.0"],["n",{},"text",["House","Gregory","A.","Dr.","MD"]],["adr",{"type":"work","label":"2 Metrotect Ctr.\\\\n4th floor\\\\nBrooklyn\\\\, NY 11201\\\\nU.S.A."},"text",["2 Metrotect Ctr.","Brooklyn","4th floor","NY","11201","U.S.A."]],["email",{"type":"work"},"text","me@work.com"],["email",{"type":"home"},"text","me@home.com"],["tel",{"type":["work","cell"]},"uri","+1-212-555-1212,234"],["tel",{"type":"home"},"uri","+1-212-555-5555"],["url",{"type":"work"},"uri","http://maps.nyc.gov/"],["url",{"type":"home"},"uri","http://me.org/"],["org",{"type":"work"},"text","My Fancy Company"],["tz",{},"utc-offset","-5:00"],["geo",{"type":"work"},"uri","geo:40.6937,-73.9856"],["note",{},"text","First note right here!\\nSecond note right there!"],["rev",{},"date-and-or-time","20160404T200048Z"],["fn",{},"text","Dr. Gregory A. House, MD"]]]'
		
		
		new File('build/test-results/jcard.json').write(json);

		def parser = Ezvcard.parseJson(json)
		def vcard = parser.first()
		
		def actual = Ezvcard.write(vcard).go()
		
		def expected = "BEGIN:VCARD\r\n" +
			"VERSION:4.0\r\n" +
			"N:House;Gregory;A.;Dr.;MD\r\n" +
			"ADR;TYPE=work;LABEL=\"2 Metrotect Ctr.\\n4th floor\\nBrooklyn\\, NY 11201\\nU.S.\r\n" +
			" A.\":2 Metrotect Ctr.;Brooklyn;4th floor;NY;11201;U.S.A.;\r\n" +
			"EMAIL;TYPE=work:me@work.com\r\n" +
			"EMAIL;TYPE=home:me@home.com\r\n" +
			"TEL;TYPE=work,cell:+1-212-555-1212\\,234\r\n" +
			"TEL;TYPE=home:+1-212-555-5555\r\n" +
			"URL;TYPE=work:http://maps.nyc.gov/\r\n" +
			"URL;TYPE=home:http://me.org/\r\n" +
			"ORG;TYPE=work:My Fancy Company\r\n" +
			"TZ;VALUE=utc-offset:-0500\r\n" +
			"GEO;TYPE=work:geo:40.6937,-73.9856\r\n" +
			"NOTE:First note right here!\\nSecond note right there!\r\n" +
			"REV:" + result['1'] + "\r\n" +
			"FN:Dr. Gregory A. House\\, MD\r\n" +
			"PRODID:ez-vcard 0.9.8\r\n" +
			"END:VCARD\r\n"
 
		new File('build/test-results/actual.vcf').write(actual);
		new File('build/test-results/expected.vcf').write(expected);

		assert actual == expected
		
	}
	
}
