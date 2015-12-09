package gov.nyc.doitt.nyc.gis.gradle

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction
import gov.nyc.doitt.nyc.gis.gradle.JsMinifier

class MiniJsTask extends DefaultTask {
    private static final JsMinifier MINIFIER = new JsMinifier()
	def libName = ''
	def version = ''
	def fileNames = []
	def sourceDir = ''
	def destinationDir = ''
	def compilationLevel = 'WHITESPACE_ONLY'
	def warningLevel = 'VERBOSE'
	def sourceMapLocationMapping = '' 
	def comment = null 
	def morerOptions = []
	@TaskAction
	public void minify(){
		MINIFIER.minify(
			libName,
			version,
			fileNames,
			sourceDir,
			destinationDir,
			compilationLevel,
			warningLevel,
			comment,
			morerOptions
		)	
	}
}