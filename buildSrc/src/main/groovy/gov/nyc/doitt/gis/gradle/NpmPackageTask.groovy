package gov.nyc.doitt.nyc.gis.gradle

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction
import groovy.json.JsonBuilder
import java.util.HashMap
import gov.nyc.doitt.nyc.gis.gradle.util.Util

class NpmPackageTask extends DefaultTask {
	def packageFile = ''
	def libName = ''
	def version = ''
	def license = ''
	def desc = ''
	def author = ''
	def contributors = []
	def gitHubUrl = ''
	def keywords = []
	def dependencies = []
	@TaskAction
	public void run(){
		def pkg = new HashMap<String, Object>()
		def builder = new JsonBuilder(pkg)
		new File(Util.getDirectoryName(packageFile)).mkdirs()
		pkg.put('name', libName)
		pkg.put('version', version)
		pkg.put('license', license)
		pkg.put('description', desc)
		pkg.put('author', author)
		pkg.put('contributors', contributors)
		pkg.put('repository', [type: 'git', url: gitHubUrl])
		pkg.put('keywords', keywords)
		new File(packageFile).text = builder.toPrettyString()
	}
}