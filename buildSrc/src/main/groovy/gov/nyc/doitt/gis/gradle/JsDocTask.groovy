package gov.nyc.doitt.nyc.gis.gradle

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

class JsDocTask extends DefaultTask {
	def jsdocDir = '../node_modules/.bin'
	def sourceDir = ''
	def destinationDir = ''
	def isWindows = false
	@TaskAction
	public void build(){
		def docs = new File(destinationDir)
		def cmd = isWindows ? new File("${jsdocDir}/jsdoc.cmd") : new File("${jsdocDir}/jsdoc") 
		if (cmd.exists()){
			docs.mkdirs()
			cmd = "${cmd} --verbose --recurse ${sourceDir} --destination ${destinationDir}"
			def proc = cmd.execute()
			proc.waitForProcessOutput(System.out, System.err)
		}else{
			println '-------------------------------------------------------------------------'
			println	"	File '${cmd.getAbsolutePath()}' not found!"
			println	'	Install JsDoc (https://github.com/jsdoc3/jsdoc) or'
			println	"	set 'jsdocDir' property on task '${this.getName()}'."
			println	"	Skipping task '${this.getName()}'!"
			println '-------------------------------------------------------------------------'
		}
	}
}