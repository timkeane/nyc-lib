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
